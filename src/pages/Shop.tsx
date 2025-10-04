import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const products: Product[] = [
    {
      id: "1",
      name: "Complete Birth Chart Analysis",
      description: "Comprehensive analysis of your Vedic birth chart",
      price: 999,
      category: "Astrology",
      image: "/placeholder.svg",
      features: [
        "Detailed planetary positions",
        "House analysis",
        "Dasha predictions",
        "Career guidance",
        "Relationship insights"
      ]
    },
    {
      id: "2",
      name: "Numerology Life Path Report",
      description: "Discover your life purpose through numerology",
      price: 499,
      category: "Numerology",
      image: "/placeholder.svg",
      features: [
        "Life path number analysis",
        "Destiny number insights",
        "Soul urge interpretation",
        "Lucky numbers",
        "Name analysis"
      ],
      popular: true
    },
    {
      id: "3",
      name: "Soulmate Compatibility Reading",
      description: "Find out if you're destined to be together",
      price: 799,
      category: "Love",
      image: "/placeholder.svg",
      features: [
        "Ashtakoot matching",
        "Mangal dosha analysis",
        "Love compatibility score",
        "Marriage timing predictions",
        "Relationship guidance"
      ]
    },
    {
      id: "4",
      name: "Career Astrology Consultation",
      description: "Professional guidance for career success",
      price: 1499,
      category: "Career",
      image: "/placeholder.svg",
      features: [
        "Career path analysis",
        "Job change timing",
        "Business ventures guidance",
        "Professional growth predictions",
        "Income enhancement tips"
      ]
    },
    {
      id: "5",
      name: "Personalized Gemstone Recommendation",
      description: "Find your lucky gemstone based on your chart",
      price: 599,
      category: "Remedies",
      image: "/placeholder.svg",
      features: [
        "Planetary gemstone analysis",
        "Wearing instructions",
        "Alternative gemstones",
        "Best time to wear",
        "Mantra guidance"
      ]
    },
    {
      id: "6",
      name: "Monthly Prediction Report",
      description: "Detailed predictions for the coming month",
      price: 299,
      category: "Predictions",
      image: "/placeholder.svg",
      features: [
        "Day-by-day predictions",
        "Lucky dates and times",
        "Challenges and solutions",
        "Opportunities forecast",
        "Health guidance"
      ],
      popular: true
    }
  ];

  const handleAddToCart = (productId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to cart",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setCart([...cart, productId]);
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart"
    });
  };

  const handleBuyNow = (product: Product) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a purchase",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // Navigate to checkout (to be implemented)
    toast({
      title: "Coming Soon",
      description: "Checkout functionality will be available soon!"
    });
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
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
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

              <CardHeader className="text-center pb-6 pt-6">
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
