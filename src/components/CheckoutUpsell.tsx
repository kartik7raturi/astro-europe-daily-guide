import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
}

interface CheckoutUpsellProps {
  cartProductIds: string[];
  onAddToCart: (productId: string) => void;
}

const CheckoutUpsell = ({ cartProductIds, onAddToCart }: CheckoutUpsellProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [addedProducts, setAddedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [cartProductIds]);

  const loadRecommendations = async () => {
    try {
      // Get products not in cart, limit to 3 recommendations
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, description")
        .eq("is_active", true)
        .not("id", "in", `(${cartProductIds.join(",") || "00000000-0000-0000-0000-000000000000"})`)
        .limit(3);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        });

      if (error) throw error;

      setAddedProducts([...addedProducts, productId]);
      onAddToCart(productId);
      
      toast({
        title: "Added to Cart!",
        description: "Product added to your order"
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  if (loading || recommendations.length === 0) return null;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Complete Your Order</h3>
          <Badge variant="secondary" className="ml-auto">Recommended</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recommendations.map((product) => {
            const isAdded = addedProducts.includes(product.id);
            
            return (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-cosmic flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-primary font-bold text-sm">₹{product.price}</p>
                </div>
                <Button
                  size="sm"
                  variant={isAdded ? "secondary" : "default"}
                  onClick={() => !isAdded && handleAddToCart(product.id)}
                  disabled={isAdded}
                  className="flex-shrink-0"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutUpsell;
