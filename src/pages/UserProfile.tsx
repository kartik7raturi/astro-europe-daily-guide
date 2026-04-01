import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, ShoppingCart, Package, Trash2, Truck, CheckCircle, Clock, MapPin, Percent, Settings, MessageCircle, RotateCcw, CreditCard, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProfileSettings from "@/components/ProfileSettings";
import CustomerSupport from "@/components/CustomerSupport";
import CheckoutUpsell from "@/components/CheckoutUpsell";

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    price: number;
    image_url: string;
  };
}

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

interface Order {
  id: string;
  order_type: string;
  amount: number;
  status: string;
  created_at: string;
  metadata: any;
  tracking_number: string | null;
  shipping_address: any;
  customer_name: string | null;
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

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
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
  
  // Get initial tab from URL
  const params = new URLSearchParams(window.location.search);
  const urlTab = params.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'settings');

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShippingDetails(prev => ({ ...prev, email: user.email || '' }));
    loadUserData();
    
    // Update active tab from URL when it changes
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['wishlist', 'cart', 'orders', 'settings', 'support'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load wishlist
      const { data: wishlistData } = await supabase
        .from("wishlist")
        .select("id, product_id, product:products(name, price, image_url)")
        .eq("user_id", user.id);

      // Load cart
      const { data: cartData } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity, product:products(name, price, image_url)")
        .eq("user_id", user.id);

      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Load combo offers
      const { data: offersData } = await supabase
        .from("combo_offers")
        .select("min_quantity, discount_percentage, description")
        .eq("is_active", true)
        .order("min_quantity", { ascending: true });

      setWishlist(wishlistData || []);
      setCart(cartData || []);
      setOrders(ordersData || []);
      setComboOffers(offersData || []);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = async (order: Order) => {
    if (!user) return;
    setProcessingRequest(order.id);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: `Return Request for Order #${order.id.slice(0, 8).toUpperCase()}`,
        status: "open",
        priority: "high"
      });

      if (error) throw error;

      toast({
        title: "Return Request Submitted",
        description: "Your return request has been submitted. Our team will contact you within 24-48 hours.",
      });
      
      // Switch to support tab
      setActiveTab('support');
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRefundRequest = async (order: Order) => {
    if (!user) return;
    setProcessingRequest(order.id);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: `Refund Request for Order #${order.id.slice(0, 8).toUpperCase()} - ₹${order.amount}`,
        status: "open",
        priority: "high"
      });

      if (error) throw error;

      toast({
        title: "Refund Request Submitted",
        description: "Your refund request has been submitted. Our team will review and process it within 3-5 business days.",
      });
      
      // Switch to support tab
      setActiveTab('support');
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast({
        title: "Error",
        description: "Failed to submit refund request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId);

      if (error) throw error;

      setWishlist(wishlist.filter((item) => item.id !== wishlistId));
      toast({
        title: "Removed",
        description: "Item removed from wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartId);

      if (error) throw error;

      setCart(cart.filter((item) => item.id !== cartId));
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const updateCartQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartId);

      if (error) throw error;

      setCart(
        cart.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;

    // Validate shipping details
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address || 
        !shippingDetails.city || !shippingDetails.state || !shippingDetails.pincode) {
      toast({
        title: "Missing Details",
        description: "Please fill in all required delivery details",
        variant: "destructive"
      });
      return;
    }

    setProcessingCheckout(true);
    
    try {
      const totalAmount = Math.round(cartTotal);
      // Get affiliate referral from session storage
      const affiliateRef = sessionStorage.getItem('affiliate_ref');
      
      const orderDetails = {
        user_id: user.id,
        amount: totalAmount,
        order_type: 'product',
        customer_name: shippingDetails.fullName,
        customer_email: shippingDetails.email,
        customer_phone: shippingDetails.phone,
        shipping_address: {
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode,
          country: shippingDetails.country
        },
        metadata: { 
          cart_items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name
          }))
        },
        affiliate_code: affiliateRef
      };

      if (paymentMethod === 'cod') {
        // Process COD order
        const { data, error } = await supabase.functions.invoke('process-cod-order', {
          body: orderDetails
        });

        if (error) throw error;

        setCart([]);
        setShowCheckoutDialog(false);
        // Clear affiliate ref after successful order
        sessionStorage.removeItem('affiliate_ref');
        toast({
          title: "Order Placed!",
          description: "Your Cash on Delivery order has been placed successfully. Pay ₹" + totalAmount + " on delivery."
        });
        loadUserData();
      } else {
        // Process Razorpay payment
        const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
          body: { amount: totalAmount, currency: 'INR', planName: 'Product Purchase' }
        });

        if (orderError) {
          console.error('Razorpay order error:', orderError);
          throw new Error(orderError.message || 'Failed to create payment order');
        }

        if (!orderData || !orderData.orderId) {
          console.error('Invalid Razorpay response:', orderData);
          throw new Error('Failed to initialize payment. Please try Cash on Delivery.');
        }

        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'AstroVibe',
            description: 'Product Purchase',
            order_id: orderData.orderId,
            handler: async function (response: any) {
              try {
                const { data: verifyData, error: verifyError } = await supabase.functions.invoke('process-razorpay-payment', {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderData: orderDetails
                  }
                });

                if (verifyError) throw verifyError;

                setCart([]);
                setShowCheckoutDialog(false);
                // Clear affiliate ref after successful order
                sessionStorage.removeItem('affiliate_ref');
                toast({
                  title: "Payment Successful!",
                  description: "Your order has been placed. Invoice sent to your email."
                });
                loadUserData();
              } catch (error) {
                console.error("Error processing payment:", error);
                toast({
                  title: "Payment Error",
                  description: "Payment received but order creation failed. Please contact support.",
                  variant: "destructive"
                });
              }
            },
            prefill: {
              name: shippingDetails.fullName,
              email: shippingDetails.email,
              contact: shippingDetails.phone
            },
            theme: {
              color: '#667eea'
            },
            modal: {
              ondismiss: function() {
                setProcessingCheckout(false);
              }
            }
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.on('payment.failed', function(response: any) {
            console.error('Payment failed:', response.error);
            toast({
              title: "Payment Failed",
              description: response.error.description || "Payment was not completed. Please try again or use Cash on Delivery.",
              variant: "destructive"
            });
            setProcessingCheckout(false);
          });
          razorpay.open();
        };

        script.onerror = () => {
          throw new Error('Failed to load payment gateway. Please try Cash on Delivery.');
        };
      }

    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process order. Please try Cash on Delivery.",
        variant: "destructive"
      });
      setProcessingCheckout(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; icon: any; label: string } } = {
      pending: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
      accepted: { color: "bg-blue-500", icon: CheckCircle, label: "Accepted" },
      fulfilled: { color: "bg-purple-500", icon: Package, label: "Fulfilled" },
      shipped: { color: "bg-orange-500", icon: Truck, label: "Shipped" },
      delivered: { color: "bg-green-500", icon: MapPin, label: "Delivered" },
      cancelled: { color: "bg-red-500", icon: Trash2, label: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Calculate total quantity and apply combo discount
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Find applicable combo offer
  const applicableOffer = comboOffers
    .filter(offer => totalQuantity >= offer.min_quantity)
    .sort((a, b) => b.min_quantity - a.min_quantity)[0];
  
  const discountPercentage = applicableOffer?.discount_percentage || 0;
  const discountAmount = (cartSubtotal * discountPercentage) / 100;
  const cartTotal = cartSubtotal - discountAmount;

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <User className="h-8 w-8" />
            My Profile
          </h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="support">
              <MessageCircle className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wishlist">
            {wishlist.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                  <Button
                    onClick={() => navigate("/shop")}
                    variant="cosmic"
                    className="mt-4"
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="w-full h-48 bg-gradient-cosmic rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-16 h-16 text-primary-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold mb-2">{item.product.name}</h3>
                      <p className="text-primary font-bold mb-4">
                        ₹{item.product.price}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart">
            {cart.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button
                    onClick={() => navigate("/shop")}
                    variant="cosmic"
                    className="mt-4"
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {cart.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gradient-cosmic rounded-lg flex items-center justify-center overflow-hidden">
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{item.product.name}</h3>
                            <p className="text-primary font-bold mb-2">
                              ₹{item.product.price}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity - 1)
                                }
                              >
                                -
                              </Button>
                              <span className="w-12 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Combo Offers Info */}
                {comboOffers.length > 0 && (
                  <Card className="mb-4 border-dashed border-primary/50">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">Combo Offers Available!</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {comboOffers.map((offer, idx) => (
                          <p key={idx} className={totalQuantity >= offer.min_quantity ? 'text-green-600 font-medium' : ''}>
                            {offer.description}
                            {totalQuantity >= offer.min_quantity && ' ✓ Applied'}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Cart Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal ({totalQuantity} items):</span>
                        <span>₹{cartSubtotal}</span>
                      </div>
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Combo Discount ({discountPercentage}%):</span>
                          <span>- ₹{discountAmount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-lg font-medium">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{cartTotal.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="cosmic" 
                      className="w-full"
                      onClick={() => setShowCheckoutDialog(true)}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-xl">₹{order.amount}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      {order.metadata?.cart_items && (
                        <div className="border-t pt-4 mb-4">
                          <h4 className="text-sm font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.metadata.cart_items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tracking Info */}
                      {order.tracking_number && (
                        <div className="border-t pt-4">
                          <p className="text-sm">
                            <span className="font-medium">Tracking:</span> {order.tracking_number}
                          </p>
                        </div>
                      )}

                      {/* Shipping Address */}
                      {order.shipping_address && Object.keys(order.shipping_address).length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> Delivery Address
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_name}<br />
                            {order.shipping_address.address}<br />
                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                          </p>
                        </div>
                      )}

                      {/* Refund/Return Options */}
                      {(order.status === "delivered" || order.status === "shipped") && (
                        <div className="border-t pt-4 mt-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("/order-tracking")}>
                              <Truck className="w-4 h-4 mr-2" />
                              Track Order
                            </Button>
                            {order.status === "delivered" && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={processingRequest === order.id}
                                  onClick={() => handleReturnRequest(order)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  {processingRequest === order.id ? "Submitting..." : "Return"}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  disabled={processingRequest === order.id}
                                  onClick={() => handleRefundRequest(order)}
                                >
                                  {processingRequest === order.id ? "Submitting..." : "Request Refund"}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Settings Tab */}
          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>

          {/* Customer Support Tab */}
          <TabsContent value="support">
            <CustomerSupport />
          </TabsContent>
        </Tabs>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={shippingDetails.fullName}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  placeholder="Street address, apartment, suite, etc."
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={shippingDetails.state}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  value={shippingDetails.pincode}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                  placeholder="XXXXXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={shippingDetails.country}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Upsell Products */}
            <CheckoutUpsell 
              cartProductIds={cart.map(c => c.product_id)} 
              onAddToCart={() => loadUserData()} 
            />

            {/* Payment Method Selection */}
            <div className="border-t pt-4 mt-4">
              <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'razorpay' | 'cod')}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Pay Online</p>
                      <p className="text-xs text-muted-foreground">Credit/Debit Card, UPI, Net Banking</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer mt-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Combo Discount ({discountPercentage}%):</span>
                    <span>- ₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Order Total:</span>
                  <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant="cosmic"
                onClick={handleCheckout}
                disabled={processingCheckout}
              >
                {processingCheckout ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;