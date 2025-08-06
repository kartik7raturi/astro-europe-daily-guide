import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Heart, Sparkles, Crown } from "lucide-react";

const Pricing = () => {
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

                  <Button 
                    className={`w-full h-12 text-lg font-semibold ${
                      plan.popular 
                        ? 'cosmic shadow-cosmic' 
                        : 'gold'
                    }`}
                    variant={plan.popular ? 'cosmic' : 'gold'}
                  >
                    Get Started
                    <Star className="w-5 h-5 ml-2" />
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
            Start with our Starter plan and upgrade anytime as you explore your cosmic journey
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