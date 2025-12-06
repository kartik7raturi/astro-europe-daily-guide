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
import { User, Heart, ShoppingCart, Package, Trash2, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

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

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
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

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShippingDetails(prev => ({ ...prev, email: user.email || '' }));
    loadUserData();
    
    // Check for tab parameter in URL
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setTimeout(() => {
        const tabElement = document.querySelector(`[value="${tab}"]`) as HTMLElement;
        tabElement?.click();
      }, 100);
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

      setWishlist(wishlistData || []);
      setCart(cartData || []);
      setOrders(ordersData || []);
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
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order with shipping details
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          order_type: "product",
          amount: totalAmount,
          status: "pending",
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
          }
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Clear cart
      const { error: clearError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (clearError) throw clearError;

      setCart([]);
      setShowCheckoutDialog(false);
      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation soon."
      });

      // Reload orders
      loadUserData();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    } finally {
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

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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

        <Tabs defaultValue="wishlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="cart">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders ({orders.length})
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
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{cartTotal}
                      </span>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Order Total:</span>
                <span className="text-2xl font-bold text-primary">₹{cartTotal}</span>
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