import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Star, Heart, ArrowLeft, Check, Truck, RotateCcw, Shield, Package, Sparkles, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProductReviews from "@/components/ProductReviews";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductRating from "@/components/ProductRating";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  additional_images: string[];
  features: string[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewStats, setReviewStats] = useState<{ total: number; average: number; distribution: number[] }>({
    total: 0, average: 0, distribution: [0, 0, 0, 0, 0]
  });

  const affiliateRef = searchParams.get("ref");

  useEffect(() => {
    if (affiliateRef) {
      sessionStorage.setItem("affiliate_ref", affiliateRef);
    }
  }, [affiliateRef]);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviewStats();
      if (user) checkWishlist();
    }
  }, [id, user]);

  const loadReviewStats = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", id);
    
    if (data && data.length > 0) {
      const dist = [0, 0, 0, 0, 0];
      data.forEach(r => { dist[r.rating - 1]++; });
      const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
      setReviewStats({ total: data.length, average: avg, distribution: dist });
    }
  };

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) throw error;

      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description || "",
          price: Number(data.price),
          category: data.category || "General",
          image_url: data.image_url || "",
          additional_images: (data.additional_images || []) as string[],
          features: (Array.isArray(data.features) ? data.features : []) as string[],
        });
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle();
    setInWishlist(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({ title: "Sign In Required", description: "Please sign in to add to wishlist", variant: "destructive" });
      navigate("/auth");
      return;
    }

    try {
      if (inWishlist) {
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", id);
        setInWishlist(false);
        toast({ title: "Removed from wishlist" });
      } else {
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: id });
        setInWishlist(true);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Sign In Required", description: "Please sign in to add items to cart", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setAddingToCart(true);
    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .single();

      if (existing) {
        await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({ user_id: user.id, product_id: id, quantity });
      }

      toast({ title: "Added to Cart", description: `${quantity} item(s) added to your cart` });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({ title: "Sign In Required", description: "Please sign in to purchase", variant: "destructive" });
      navigate("/auth");
      return;
    }

    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .single();

      if (!existing) {
        await supabase.from("cart_items").insert({ user_id: user.id, product_id: id, quantity });
      }

      navigate("/checkout");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to process", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/shop")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <ProductImageCarousel
              mainImage={product.image_url}
              additionalImages={product.additional_images}
              productName={product.name}
              category={product.category}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <ProductRating productId={product.id} size="md" />
            </div>

            {/* Title & Category */}
            <div>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg">{product.description}</p>

            {/* Features Grid */}
            {product.features.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
            </div>

            {/* Shipping & Return Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="text-sm font-medium">3-5 Days</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Returns</p>
                    <p className="text-sm font-medium">7 Days</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Secure</p>
                    <p className="text-sm font-medium">Payment</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 h-12 text-lg bg-gradient-cosmic"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12 text-lg"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={toggleWishlist}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="mt-12 border-t pt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewStats.total})</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Product</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {product.features.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Key Highlights
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Product Specifications
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 text-sm">
                  <div className="bg-muted/50 p-3 font-medium border-b">Category</div>
                  <div className="p-3 border-b">{product.category}</div>
                  
                  <div className="bg-muted/50 p-3 font-medium border-b">Type</div>
                  <div className="p-3 border-b">Digital / Astrology Service</div>
                  
                  <div className="bg-muted/50 p-3 font-medium border-b">Delivery</div>
                  <div className="p-3 border-b">3-5 Business Days</div>
                  
                  <div className="bg-muted/50 p-3 font-medium border-b">Return Policy</div>
                  <div className="p-3 border-b">7 Days Easy Return</div>
                  
                  <div className="bg-muted/50 p-3 font-medium border-b">Payment</div>
                  <div className="p-3 border-b">UPI, Cards, COD, Razorpay</div>
                  
                  <div className="bg-muted/50 p-3 font-medium">Features Included</div>
                  <div className="p-3">{product.features.length} Features</div>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">What You'll Receive</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      After purchase, you'll receive a detailed personalized report based on your birth chart and astrological profile. Results are delivered within the specified delivery time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {/* Reviews Summary */}
              {reviewStats.total > 0 && (
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Rating Summary</h3>
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Average Score */}
                      <div className="text-center sm:text-left">
                        <span className="text-5xl font-bold text-primary">{reviewStats.average.toFixed(1)}</span>
                        <div className="flex justify-center sm:justify-start mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewStats.average) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{reviewStats.total} reviews</p>
                      </div>

                      {/* Distribution Bars */}
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = reviewStats.distribution[star - 1];
                          const pct = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-sm">
                              <span className="w-6 text-right">{star}</span>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <Progress value={pct} className="flex-1 h-2" />
                              <span className="w-8 text-muted-foreground text-xs">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ProductReviews productId={product.id} productName={product.name} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
