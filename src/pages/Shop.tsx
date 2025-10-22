import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Star, Package, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  features: string[];
  popular?: boolean;
}

const Shop = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    loadProducts();
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            price: Number(p.price),
            category: p.category || "General",
            image: p.image_url || "/placeholder.svg",
            features: (Array.isArray(p.features) ? p.features : []) as string[],
            popular: p.category === "Numerology" || p.category === "Predictions",
          }))
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to cart",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        });

      if (error) throw error;

      setCart([...cart, productId]);
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setWishlist(data?.map(w => w.product_id) || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add to wishlist",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        setWishlist(wishlist.filter(id => id !== productId));
        toast({ title: "Removed from wishlist" });
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({
            user_id: user.id,
            product_id: productId
          });

        if (error) throw error;
        setWishlist([...wishlist, productId]);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };

  const handleBuyNow = async (product: Product) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a purchase",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      // Add to cart first
      const { error: cartError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        });

      if (cartError && cartError.code !== '23505') throw cartError; // Ignore duplicate errors

      // Navigate to profile with cart tab selected
      navigate("/profile?tab=cart");
      toast({
        title: "Ready to Checkout",
        description: "Review your cart and complete your purchase"
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
            Astrology Shop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our premium astrology products and services
          </p>
          {cart.length > 0 && (
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {cart.length} items in cart
              </Badge>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                product.popular 
                  ? 'border-primary shadow-cosmic' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {product.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-gold text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
              >
                <Heart 
                  className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-primary text-primary' : ''}`}
                />
              </Button>

              <CardHeader 
                className="text-center pb-6 pt-6 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-full h-48 bg-gradient-cosmic rounded-lg mb-4 flex items-center justify-center">
                  {product.category === "Love" && <Heart className="w-16 h-16 text-primary-foreground" />}
                  {product.category === "Career" && <Package className="w-16 h-16 text-primary-foreground" />}
                  {product.category === "Astrology" && <Sparkles className="w-16 h-16 text-primary-foreground" />}
                  {product.category === "Numerology" && <Star className="w-16 h-16 text-primary-foreground" />}
                  {product.category === "Remedies" && <Sparkles className="w-16 h-16 text-primary-foreground" />}
                  {product.category === "Predictions" && <Star className="w-16 h-16 text-primary-foreground" />}
                </div>
                <Badge variant="outline" className="mb-2 w-fit mx-auto">
                  {product.category}
                </Badge>
                <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {product.description}
                </CardDescription>
                <div className="pt-3">
                  <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-cosmic text-primary-foreground"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Detail Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="w-full h-64 bg-gradient-cosmic rounded-lg flex items-center justify-center">
                {selectedProduct?.category === "Love" && <Heart className="w-24 h-24 text-primary-foreground" />}
                {selectedProduct?.category === "Career" && <Package className="w-24 h-24 text-primary-foreground" />}
                {selectedProduct?.category === "Astrology" && <Sparkles className="w-24 h-24 text-primary-foreground" />}
                {selectedProduct?.category === "Numerology" && <Star className="w-24 h-24 text-primary-foreground" />}
                {selectedProduct?.category === "Remedies" && <Sparkles className="w-24 h-24 text-primary-foreground" />}
                {selectedProduct?.category === "Predictions" && <Star className="w-24 h-24 text-primary-foreground" />}
              </div>
              
              <Badge variant="outline">{selectedProduct?.category}</Badge>
              
              <p className="text-muted-foreground">{selectedProduct?.description}</p>
              
              <div className="text-3xl font-bold text-primary">₹{selectedProduct?.price}</div>
              
              <div>
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="space-y-2">
                  {selectedProduct?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-gradient-cosmic text-primary-foreground"
                  onClick={() => {
                    if (selectedProduct) handleBuyNow(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (selectedProduct) handleAddToCart(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Coming Soon Features */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-cosmic/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl">More Features Coming Soon!</CardTitle>
              <CardDescription className="text-base">
                We're building a complete e-commerce experience with:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Full cart and checkout system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Order tracking and management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Digital product downloads</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Multiple payment options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Personalized recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span>Customer reviews and ratings</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;
