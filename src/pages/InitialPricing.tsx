import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const InitialPricing = () => {
  const navigate = useNavigate();
  const [buyUrl, setBuyUrl] = useState("");

  useEffect(() => {
    loadSettings();
    // Load Digistore24 trusted badge
    const script = document.createElement("script");
    script.src = "https://www.digistore24.com/trusted-badge/45148/s7e2aWO7TB1vImg/salespage";
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "funnel_settings")
      .maybeSingle();
    if (data?.value) {
      const val = data.value as any;
      setBuyUrl(val.initial_buy_url || "");
    }
  };

  const handleBuy = () => {
    if (buyUrl) {
      window.open(buyUrl, "_blank");
    } else {
      navigate("/upsell");
    }
  };

  const features = [
    "1 AI-Generated Soulmate Sketch",
    "Basic Love Compatibility Score",
    "Meeting Place Prediction",
    "Personalised Numerology Report",
    "Email Support",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Star className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Get Your AI Soulmate Sketch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover who the stars have destined for you with an AI-powered soulmate portrait based on your birth chart.
          </p>
        </div>

        <Card className="max-w-lg mx-auto border-2 border-primary shadow-cosmic overflow-hidden">
          <div className="bg-gradient-cosmic p-4 text-center">
            <p className="text-primary-foreground font-semibold text-sm">INTRODUCTORY OFFER</p>
          </div>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Soulmate Sketch Package</CardTitle>
            <div className="pt-4">
              <span className="text-5xl font-bold text-primary">$19.99</span>
              <p className="text-sm text-muted-foreground mt-1">One-time payment • Instant access</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">What you get:</p>
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="cosmic"
              size="lg"
              className="w-full text-lg h-14 gap-2"
              onClick={handleBuy}
            >
              Get My Soulmate Sketch — $19.99
              <ArrowRight className="h-5 w-5" />
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">🔒 Secure checkout • 30-day money-back guarantee</p>
              <p className="text-xs text-muted-foreground">Powered by Digistore24 — trusted by millions worldwide</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InitialPricing;
