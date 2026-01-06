import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category: string | null;
  };
}

const Wishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product_id,
          product:products (
            id,
            name,
            description,
            price,
            image_url,
            category
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      setItems((data || []).filter(item => item.product) as WishlistItem[]);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      setItems(items.filter((item) => item.id !== itemId));
      toast({ title: "Removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setAddingToCart(productId);
    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        });
      }

      toast({ title: "Added to cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const moveAllToCart = async () => {
    if (!user || items.length === 0) return;

    try {
      for (const item of items) {
        await addToCart(item.product_id);
      }
      toast({ title: "All items added to cart" });
    } catch (error) {
      console.error("Error moving items to cart:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-starlight py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-20 h-20 mx-auto text-primary/50 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to save your favorite products
          </p>
          <Button variant="cosmic" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="cosmic" onClick={moveAllToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save products you love by clicking the heart icon
              </p>
              <Button variant="cosmic" onClick={() => navigate("/shop")}>
                <Sparkles className="w-4 h-4 mr-2" />
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-cosmic flex items-center justify-center overflow-hidden">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles className="w-16 h-16 text-primary-foreground" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  {item.product.category && (
                    <Badge variant="outline" className="w-fit mb-2">
                      {item.product.category}
                    </Badge>
                  )}
                  <CardTitle className="text-lg">{item.product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.product.price}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(item.product_id)}
                      disabled={addingToCart === item.product_id}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {addingToCart === item.product_id ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
