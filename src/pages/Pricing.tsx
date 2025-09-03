import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Check, Star, Heart, Sparkles, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedSketches, setSelectedSketches] = useState([1]); // Slider state for sketches

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (plan: any) => {
    setLoading(plan.name);
    
    try {
      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: parseInt(plan.price.replace('₹', '')),
          planName: plan.name
        }
      });

      if (error) throw error;

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'astrovibe.online',
        description: `${plan.name} Plan`,
        order_id: data.orderId,
        handler: (response: any) => {
          toast({
            title: "Payment Successful!",
            description: `Welcome to ${plan.name} plan! Payment ID: ${response.razorpay_payment_id}`,
          });
          // Here you can redirect to dashboard or handle success
          window.location.href = '/dashboard';
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Freemium plan
  const freemiumPlan = {
    name: "Freemium",
    price: "Free",
    period: "forever",
    description: "Start your cosmic journey for free",
    features: [
      "Basic Daily Horoscope",
      "Love Percentage Calculator", 
      "Basic Numerology Report",
      "Limited Compatibility Analysis",
      "Community Access"
    ],
    icon: Star,
    gradient: "bg-gradient-cosmic",
    popular: false,
    isFree: true
  };

  // Soulmate sketch options
  const sketchOptions = [
    { sketches: 1, price: 49, period: "one-time", regularPrice: 49 },
    { sketches: 6, price: 199, period: "package deal", regularPrice: 294 },
    { sketches: 12, price: 299, period: "premium package", regularPrice: 588 }
  ];

  const currentSketchCount = selectedSketches[0];
  let currentOption;
  
  // Map slider value to closest sketch option
  if (currentSketchCount <= 3) {
    currentOption = sketchOptions[0]; // 1 sketch
  } else if (currentSketchCount <= 9) {
    currentOption = sketchOptions[1]; // 6 sketches  
  } else {
    currentOption = sketchOptions[2]; // 12 sketches
  }
  
  // Update selected sketches to match the actual option
  const actualSketchCount = currentOption.sketches;
  
  // Calculate savings percentage
  const savingsPercentage = currentOption.regularPrice > currentOption.price 
    ? Math.round(((currentOption.regularPrice - currentOption.price) / currentOption.regularPrice) * 100)
    : 0;

  const soulmateSketchPlan = {
    name: `${actualSketchCount} Soulmate Sketch${actualSketchCount > 1 ? 'es' : ''}`,
    price: `₹${currentOption.price}`,
    period: currentOption.period,
    description: actualSketchCount === 1 ? "Get your first soulmate sketch" : 
                actualSketchCount === 6 ? "Multiple sketches for deeper insights" : 
                "Ultimate soulmate discovery experience",
    features: [
      `${actualSketchCount} AI-Generated Soulmate Sketch${actualSketchCount > 1 ? 'es' : ''}`,
      actualSketchCount === 1 ? "Basic Soulmate Reading" : "Detailed Soulmate Analysis",
      actualSketchCount === 1 ? "Love Compatibility Score" : "Advanced Love Readings",
      actualSketchCount === 1 ? "Meeting Place Prediction" : "Twin Flame Analysis",
      actualSketchCount >= 6 ? "Karmic Bond Reading" : `${30 * actualSketchCount}-Day Access`,
      ...(actualSketchCount >= 6 ? ["Meeting Time Predictions"] : []),
      ...(actualSketchCount >= 12 ? ["Lifetime Predictions", "Priority Support"] : []),
      `${actualSketchCount === 1 ? 30 : actualSketchCount === 6 ? 90 : 180}-Day Access`
    ].filter(Boolean),
    icon: actualSketchCount === 1 ? Heart : actualSketchCount === 6 ? Sparkles : Crown,
    gradient: actualSketchCount === 6 ? "bg-gradient-cosmic" : "bg-gradient-gold",
    popular: actualSketchCount === 6,
    sketches: actualSketchCount
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
            Choose Your Cosmic Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the mysteries of the universe with our premium astrology features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Freemium Plan */}
          <Card 
            className="relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 border-border hover:border-primary/50"
          >
            <CardHeader className="text-center pb-6 pt-6">
              <div className={`w-14 h-14 mx-auto rounded-full ${freemiumPlan.gradient} flex items-center justify-center mb-3`}>
                <Star className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">{freemiumPlan.name}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {freemiumPlan.description}
              </CardDescription>
              <div className="pt-3">
                <span className="text-3xl font-bold text-primary">{freemiumPlan.price}</span>
                <span className="text-muted-foreground ml-2 text-sm">/ {freemiumPlan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-2 mb-6">
                {freemiumPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-card-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full h-10 text-sm font-semibold"
                variant="cosmic"
                onClick={() => window.location.href = '/dashboard'}
              >
                Start Free
                <Star className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Soulmate Sketch Plan with Slider */}
          <Card 
            className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
              soulmateSketchPlan.popular 
                ? 'border-primary shadow-cosmic' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            {soulmateSketchPlan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-gold text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
            )}

            <CardHeader className="text-center pb-6 pt-6">
              <div className={`w-14 h-14 mx-auto rounded-full ${soulmateSketchPlan.gradient} flex items-center justify-center mb-3`}>
                <soulmateSketchPlan.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-bold">{soulmateSketchPlan.name}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {soulmateSketchPlan.description}
              </CardDescription>
              
              {/* Sketch Count Slider */}
              <div className="pt-4 px-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Number of sketches:</span>
                  <span className="font-semibold text-primary">{actualSketchCount}</span>
                </div>
                <Slider
                  value={selectedSketches}
                  onValueChange={setSelectedSketches}
                  max={12}
                  min={1}
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>6</span>
                  <span>12</span>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-primary">{soulmateSketchPlan.price}</span>
                  {savingsPercentage > 0 && (
                    <div className="text-xs">
                      <div className="line-through text-muted-foreground">₹{currentOption.regularPrice}</div>
                      <div className="text-green-500 font-semibold">{savingsPercentage}% OFF</div>
                    </div>
                  )}
                </div>
                <span className="text-muted-foreground ml-2 text-sm">/ {soulmateSketchPlan.period}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  ₹{Math.round(currentOption.price / actualSketchCount)} per sketch
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-2 mb-6">
                {soulmateSketchPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-card-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full h-10 text-sm font-semibold ${
                  soulmateSketchPlan.popular 
                    ? 'cosmic shadow-cosmic' 
                    : 'gold'
                }`}
                variant={soulmateSketchPlan.popular ? 'cosmic' : 'gold'}
                onClick={() => handlePayment(soulmateSketchPlan)}
                disabled={loading === soulmateSketchPlan.name}
              >
                {loading === soulmateSketchPlan.name ? 'Processing...' : 'Purchase Now'}
                <Star className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Why Choose Our Cosmic Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accurate Predictions</h3>
              <p className="text-muted-foreground">AI-powered astrology readings with high accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Love & Relationships</h3>
              <p className="text-muted-foreground">Find your soulmate and strengthen relationships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Growth</h3>
              <p className="text-muted-foreground">Unlock your potential with cosmic guidance</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4">Not sure which plan is right for you?</h2>
          <p className="text-muted-foreground mb-6">
            Start with our Freemium plan and upgrade to soulmate sketches as you explore your cosmic journey
          </p>
          <Button variant="mystical" size="lg">
            Contact Our Cosmic Advisors
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;