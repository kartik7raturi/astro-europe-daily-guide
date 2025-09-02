import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const plans = [
    {
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
    },
    {
      name: "1 Soulmate Sketch",
      price: "₹49",
      period: "one-time",
      description: "Get your first soulmate sketch",
      features: [
        "1 AI-Generated Soulmate Sketch",
        "Basic Soulmate Reading",
        "Love Compatibility Score",
        "Meeting Place Prediction",
        "30-Day Access"
      ],
      icon: Heart,
      gradient: "bg-gradient-gold",
      popular: false,
      sketches: 1
    },
    {
      name: "6 Soulmate Sketches",
      price: "₹199",
      period: "package deal",
      description: "Multiple sketches for deeper insights",
      features: [
        "6 AI-Generated Soulmate Sketches",
        "Detailed Soulmate Analysis",
        "Advanced Love Readings",
        "Twin Flame Analysis",
        "Karmic Bond Reading",
        "Meeting Time Predictions",
        "90-Day Access"
      ],
      icon: Sparkles,
      gradient: "bg-gradient-cosmic",
      popular: true,
      sketches: 6
    },
    {
      name: "12 Soulmate Sketches",
      price: "₹299",
      period: "premium package",
      description: "Ultimate soulmate discovery experience",
      features: [
        "12 AI-Generated Soulmate Sketches",
        "Complete Soulmate Profile",
        "Premium Love Forecasts",
        "Advanced Compatibility Reports",
        "Twin Flame & Karmic Analysis",
        "Lifetime Predictions",
        "Priority Support",
        "180-Day Access"
      ],
      icon: Crown,
      gradient: "bg-gradient-gold",
      popular: false,
      sketches: 12
    }
  ];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-primary shadow-cosmic' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-gold text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-6">
                  <div className={`w-14 h-14 mx-auto rounded-full ${plan.gradient} flex items-center justify-center mb-3`}>
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-3">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">/ {plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-card-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                   <Button 
                     className={`w-full h-10 text-sm font-semibold ${
                       plan.popular 
                         ? 'cosmic shadow-cosmic' 
                         : 'gold'
                     }`}
                     variant={plan.popular ? 'cosmic' : 'gold'}
                     onClick={() => plan.isFree ? window.location.href = '/dashboard' : handlePayment(plan)}
                     disabled={loading === plan.name}
                   >
                     {loading === plan.name ? 'Processing...' : plan.isFree ? 'Start Free' : 'Purchase Now'}
                     <Star className="w-4 h-4 ml-2" />
                   </Button>
                </CardContent>
              </Card>
            );
          })}
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