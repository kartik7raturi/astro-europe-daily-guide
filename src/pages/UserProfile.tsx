import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, ShoppingCart, Package, Trash2, ExternalLink } from "lucide-react";

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
}

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadUserData();
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
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
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
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
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
                    <Button variant="cosmic" className="w-full">
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
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{order.order_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{order.amount}</p>
                          <p className="text-sm capitalize">{order.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
