import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SponsorBanner from "@/components/SponsorBanner";
import TrustBadges from "@/components/TrustBadges";
import ProductRating from "@/components/ProductRating";
import ProductShippingInfo from "@/components/ProductShippingInfo";
import ShopFilters from "@/components/ShopFilters";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  additional_images: string[];
  features: string[];
  popular?: boolean;
  created_at: string;
}

const Shop = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const affiliateRef = searchParams.get("ref");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Store affiliate ref in session storage for tracking
  useEffect(() => {
    if (affiliateRef) {
      sessionStorage.setItem("affiliate_ref", affiliateRef);
    }
  }, [affiliateRef]);
  
  useEffect(() => {
    loadProducts();
    if (user) {
      loadWishlist();
      loadCart();
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
        const mappedProducts = data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price),
          category: p.category || "General",
          image_url: p.image_url || "",
          additional_images: (p.additional_images || []) as string[],
          features: (Array.isArray(p.features) ? p.features : []) as string[],
          popular: p.category === "Numerology" || p.category === "Predictions",
          created_at: p.created_at,
        }));
        setProducts(mappedProducts);
        
        // Set initial max price
        const maxPrice = Math.max(...mappedProducts.map(p => p.price), 10000);
        setPriceRange([0, maxPrice]);
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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  // Get max price
  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 10000);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const loadCart = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("cart_items")
        .select("product_id")
        .eq("user_id", user.id);
      setCart(data?.map(c => c.product_id) || []);
    } catch (error) {
      console.error("Error loading cart:", error);
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

    setAddingToCart(productId);
    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1
          });

        if (error) throw error;
        setCart([...cart, productId]);
      }

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
    } finally {
      setAddingToCart(null);
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

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Love":
        return <Heart className="w-16 h-16 text-primary-foreground" />;
      case "Career":
        return <Package className="w-16 h-16 text-primary-foreground" />;
      case "Numerology":
        return <Star className="w-16 h-16 text-primary-foreground" />;
      default:
        return <Sparkles className="w-16 h-16 text-primary-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Sponsor Banner */}
        <SponsorBanner page="shop" />
        
        {/* Trust Badges */}
        <TrustBadges />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
            Astrology Shop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our premium astrology products and services
          </p>
          <div className="mt-6 flex justify-center gap-4">
            {cart.length > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate("/checkout")}
                className="gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart ({cart.length})
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate("/wishlist")}
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ShopFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          maxPrice={maxPrice}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                product.popular 
                  ? 'border-primary shadow-cosmic' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
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
                onClick={(e) => toggleWishlist(product.id, e)}
              >
                <Heart 
                  className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-primary text-primary' : ''}`}
                />
              </Button>

              <CardHeader className="text-center pb-6 pt-6">
                {/* Product Image or Fallback */}
                <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-cosmic flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                    {getCategoryIcon(product.category)}
                  </div>
                </div>
                <Badge variant="outline" className="mb-2 w-fit mx-auto">
                  {product.category}
                </Badge>
                <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </CardDescription>
                <div className="pt-2">
                  <ProductRating productId={product.id} />
                </div>
                <div className="pt-3">
                  <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                </div>
                <ProductShippingInfo />
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-cosmic text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={addingToCart === product.id}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addingToCart === product.id ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>

                {/* Product Description */}
                {product.description && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3 border-t pt-3">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
