import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Truck, 
  Shield, 
  ArrowLeft,
  Package,
  Percent,
  Trash2,
  Plus,
  Minus
} from "lucide-react";
import TrustBadges from "@/components/TrustBadges";
import CheckoutUpsell from "@/components/CheckoutUpsell";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface ComboOffer {
  min_quantity: number;
  discount_percentage: number;
  description: string;
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount: number} | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      // Load cart
      const { data: cartData } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity, product:products(name, price, image_url)")
        .eq("user_id", user.id);

      // Load combo offers
      const { data: offersData } = await supabase
        .from("combo_offers")
        .select("min_quantity, discount_percentage, description")
        .eq("is_active", true)
        .order("min_quantity", { ascending: true });

      // Load saved address
      const { data: settings } = await supabase
        .from("user_settings")
        .select("default_address, display_name, phone")
        .eq("user_id", user.id)
        .single();

      if (settings?.default_address) {
        const addr = settings.default_address as any;
        setShippingDetails({
          fullName: settings.display_name || '',
          email: user.email || '',
          phone: settings.phone || '',
          address: addr.address || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          country: addr.country || 'India'
        });
      }

      setCart(cartData || []);
      setComboOffers(offersData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartId);

      if (error) throw error;

      setCart(cart.map(item => 
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      toast({ title: "Error updating quantity", variant: "destructive" });
    }
  };

  const removeItem = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartId);

      if (error) throw error;

      setCart(cart.filter(item => item.id !== cartId));
      toast({ title: "Item removed" });
    } catch (error) {
      toast({ title: "Error removing item", variant: "destructive" });
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { code: couponCode }
      });

      if (error || !data?.valid) {
        toast({ title: "Invalid coupon code", variant: "destructive" });
        return;
      }

      setAppliedCoupon({ code: couponCode, discount: data.discount_percentage });
      toast({ title: `Coupon applied! ${data.discount_percentage}% off` });
    } catch (error) {
      toast({ title: "Error applying coupon", variant: "destructive" });
    }
  };

  const handleCheckout = async () => {
    if (!user) return;

    // Validate shipping details
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingDetails[field as keyof ShippingDetails]) {
        toast({ title: `Please fill in ${field}`, variant: "destructive" });
        return;
      }
    }

    setProcessingCheckout(true);

    try {
      // Save address as default
      const { error: settingsError } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          display_name: shippingDetails.fullName,
          phone: shippingDetails.phone,
          default_address: {
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            pincode: shippingDetails.pincode,
            country: shippingDetails.country
          }
        }, { onConflict: 'user_id' });

      if (settingsError) console.error("Error saving address:", settingsError);

      const orderAmount = Math.round(finalTotal * 100); // Convert to paise

      if (paymentMethod === 'cod') {
        // Process COD order
        const { data, error } = await supabase.functions.invoke('process-cod-order', {
          body: {
            amount: orderAmount,
            currency: 'INR',
            items: cart.map(item => ({
              product_id: item.product_id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            shipping_address: shippingDetails,
            customer_name: shippingDetails.fullName,
            customer_email: shippingDetails.email,
            customer_phone: shippingDetails.phone,
            affiliate_code: sessionStorage.getItem('affiliate_ref')
          }
        });

        if (error) throw error;

        // Clear cart
        await supabase.from("cart_items").delete().eq("user_id", user.id);
        sessionStorage.removeItem('affiliate_ref');

        toast({ title: "Order Placed!", description: "Your order has been placed successfully." });
        navigate("/profile?tab=orders");
      } else {
        // Process Razorpay order
        const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
          body: { amount: orderAmount, currency: 'INR' }
        });

        if (error) throw error;

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: data.key_id,
            amount: orderAmount,
            currency: 'INR',
            name: 'Astro Guide',
            order_id: data.order_id,
            handler: async function(response: any) {
              try {
                await supabase.functions.invoke('process-razorpay-payment', {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    items: cart.map(item => ({
                      product_id: item.product_id,
                      name: item.product.name,
                      quantity: item.quantity,
                      price: item.product.price
                    })),
                    shipping_address: shippingDetails,
                    customer_name: shippingDetails.fullName,
                    customer_email: shippingDetails.email,
                    customer_phone: shippingDetails.phone,
                    affiliate_code: sessionStorage.getItem('affiliate_ref')
                  }
                });

                await supabase.from("cart_items").delete().eq("user_id", user.id);
                sessionStorage.removeItem('affiliate_ref');

                toast({ title: "Payment Successful!", description: "Your order has been placed." });
                navigate("/profile?tab=orders");
              } catch (error) {
                console.error("Payment error:", error);
                toast({ title: "Payment Error", variant: "destructive" });
              }
            },
            prefill: {
              name: shippingDetails.fullName,
              email: shippingDetails.email,
              contact: shippingDetails.phone
            },
            theme: { color: '#667eea' }
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        };
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({ title: "Checkout Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-starlight py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/shop")} variant="cosmic">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const applicableOffer = comboOffers
    .filter(offer => totalQuantity >= offer.min_quantity)
    .sort((a, b) => b.min_quantity - a.min_quantity)[0];
  
  const comboDiscount = applicableOffer ? (subtotal * applicableOffer.discount_percentage) / 100 : 0;
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const totalDiscount = comboDiscount + couponDiscount;
  const finalTotal = subtotal - totalDiscount;

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/shop")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Items ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-20 h-20 bg-gradient-cosmic rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-primary font-bold">₹{item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive ml-auto" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upsell */}
            <CheckoutUpsell cartProductIds={cart.map(c => c.product_id)} onAddToCart={() => loadData()} />

            {/* Shipping Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input 
                      value={shippingDetails.fullName} 
                      onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email"
                      value={shippingDetails.email} 
                      onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input 
                      value={shippingDetails.phone} 
                      onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input 
                      value={shippingDetails.pincode} 
                      onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                <div>
                  <Label>Address *</Label>
                  <Input 
                    value={shippingDetails.address} 
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                    placeholder="House/Flat No., Street, Landmark"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input 
                      value={shippingDetails.city} 
                      onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Input 
                      value={shippingDetails.state} 
                      onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input 
                      value={shippingDetails.country} 
                      onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'razorpay' | 'cod')}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Pay Online (Razorpay)</p>
                        <p className="text-sm text-muted-foreground">Cards, UPI, Netbanking, Wallets</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {applicableOffer && (
                    <div className="flex justify-between text-green-500">
                      <span className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Combo Discount ({applicableOffer.discount_percentage}%)
                      </span>
                      <span>-₹{comboDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-500">
                      <span className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Coupon ({appliedCoupon.discount}%)
                      </span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full bg-gradient-cosmic text-primary-foreground" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={processingCheckout}
                >
                  {processingCheckout ? "Processing..." : `Place Order • ₹${finalTotal.toFixed(2)}`}
                </Button>

                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    100% Secure Payment
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="h-3 w-3" />
                    Free Shipping • 3-5 Days Delivery
                  </div>
                </div>
              </CardContent>
            </Card>

            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
