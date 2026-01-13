import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Heart, Sparkles, Crown, Mail, ArrowRight, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;
      
      toast.success("Thank you for subscribing to our astro insights!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "₹99",
      period: "one-time",
      description: "Perfect for first-time cosmic explorers",
      features: [
        "1 Soulmate Sketch",
        "30 Days Reading Access",
        "Basic Compatibility Analysis",
        "Daily Horoscope",
        "Love Percentage Calculator",
        "Basic Numerology Report"
      ],
      icon: Heart,
      gradient: "bg-gradient-cosmic",
      popular: false
    },
    {
      name: "Explorer", 
      price: "₹399",
      period: "6 months",
      description: "Dive deeper into your cosmic journey",
      features: [
        "25 Soulmate Sketches",
        "6 Months Full Access",
        "Advanced Compatibility Readings",
        "Love Forecasts & Predictions",
        "Daily Affirmations",
        "Astro Journal Access",
        "Priority Support",
        "Crush Analysis Tool",
        "Lucky Elements Daily"
      ],
      icon: Sparkles,
      gradient: "bg-gradient-gold",
      popular: true
    },
    {
      name: "Master",
      price: "₹499", 
      period: "lifetime",
      description: "Unlock the full cosmic experience",
      features: [
        "50 Soulmate Sketches",
        "Lifetime Access",
        "All Premium Features",
        "Advanced Numerology Reports",
        "Birth Chart Analysis", 
        "Astro Calendar Access",
        "VIP Support",
        "Custom Predictions",
        "Exclusive Content",
        "Personal Readings",
        "Daily Guidance",
        "Lucky Numbers",
        "Color Therapy",
        "Problem Solutions"
      ],
      icon: Crown,
      gradient: "bg-gradient-cosmic",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
            Discover Your Cosmic Destiny
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Unlock the secrets of the universe with personalized astrology readings, soulmate sketches, and cosmic guidance tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/horoscope">
              <Button size="lg" className="cosmic">
                Start Your Journey
                <Star className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose astrovibe.online?</h2>
            <p className="text-xl text-muted-foreground">Experience the power of ancient wisdom with modern technology</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Accuracy</h3>
              <p className="text-muted-foreground">Advanced algorithms combined with ancient wisdom for precise predictions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-gold rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+ Happy Users</h3>
              <p className="text-muted-foreground">Join thousands who have found their cosmic path</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Protected</h3>
              <p className="text-muted-foreground">Your data is secure and your readings are completely private</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Cosmic Journey</h2>
            <p className="text-xl text-muted-foreground">Select the perfect plan to unlock your destiny</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.name}
                  className={`relative overflow-hidden border-2 transition-colors duration-300 ${
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

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`w-16 h-16 mx-auto rounded-full ${plan.gradient} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-card-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/pricing">
                      <Button 
                        className={`w-full h-12 text-lg font-semibold`}
                        variant={plan.popular ? 'cosmic' : 'gold'}
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-card/80 border border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Stay Connected to the Cosmos</CardTitle>
              <CardDescription className="text-lg">
                Get daily insights, cosmic updates, and exclusive offers delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSubscribing} className="cosmic">
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
