import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Heart, Sparkles, Crown, ArrowRight, SkipForward } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Upsell = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState({ tier1: "", tier2: "", tier3: "" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "funnel_settings")
      .maybeSingle();
    if (data?.value) {
      const val = data.value as any;
      setUrls({
        tier1: val.upsell_tier1_url || "",
        tier2: val.upsell_tier2_url || "",
        tier3: val.upsell_tier3_url || "",
      });
    }
  };

  const handleBuy = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "$19.99",
      sketches: 1,
      icon: Star,
      gradient: "bg-gradient-cosmic",
      popular: false,
      urlKey: "tier1" as const,
      features: [
        "1 AI Soulmate Sketch",
        "Basic Compatibility Score",
        "Meeting Place Prediction",
        "30-Day Access",
      ],
    },
    {
      name: "Explorer",
      price: "$69.00",
      oldPrice: "$99.00",
      sketches: 5,
      icon: Heart,
      gradient: "bg-gradient-cosmic",
      popular: true,
      urlKey: "tier2" as const,
      features: [
        "5 AI Soulmate Sketches",
        "Detailed Soulmate Analysis",
        "Twin Flame Reading",
        "Karmic Bond Analysis",
        "Meeting Time Predictions",
        "Love Forecasts",
        "Daily Affirmations",
        "Crush Analyzer",
        "90-Day Access",
      ],
    },
    {
      name: "Master",
      price: "$99.99",
      oldPrice: "$149.99",
      sketches: 10,
      icon: Crown,
      gradient: "bg-gradient-gold",
      popular: false,
      urlKey: "tier3" as const,
      features: [
        "10 AI Soulmate Sketches",
        "Full Soulmate Analysis",
        "All Premium Features",
        "Lifetime Predictions",
        "AI Personal Chat (Unlimited)",
        "Lucky Numbers & Colors",
        "Life & Career Analysis",
        "Personal Readings",
        "Priority Support",
        "180-Day Access",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/40">
            🎉 SPECIAL ONE-TIME OFFER
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Unlock Your Full Cosmic Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your journey. More sketches = deeper cosmic insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-cosmic scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-cosmic text-primary-foreground text-center py-2 text-sm font-semibold">
                  ⭐ MOST POPULAR — BEST VALUE
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-14 h-14 mx-auto rounded-full ${plan.gradient} flex items-center justify-center mb-3`}>
                  <plan.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.sketches} Soulmate Sketch{plan.sketches > 1 ? "es" : ""}</p>
                <div className="pt-3">
                  {plan.oldPrice && (
                    <span className="text-lg line-through text-muted-foreground mr-2">{plan.oldPrice}</span>
                  )}
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "cosmic" : "outline"}
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => handleBuy(urls[plan.urlKey])}
                >
                  Get {plan.name} Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            className="text-muted-foreground gap-2"
            onClick={() => navigate("/thank-you?skipped=true")}
          >
            <SkipForward className="h-4 w-4" />
            No thanks, skip for now
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">🔒 Secure checkout • 30-day money-back guarantee • Powered by Digistore24</p>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
