import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, ArrowRight, Sparkles, Heart, Hash, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";

const InitialPricing = () => {
  const navigate = useNavigate();
  const [buyUrl, setBuyUrl] = useState("");

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
      setBuyUrl(val.initial_buy_url || "");
    }
  };

  const handleBuy = () => {
    if (buyUrl) {
      window.open(buyUrl, "_blank");
    } else {
      navigate("/thank-you");
    }
  };

  const features = [
    { icon: Heart, text: "1 AI-Generated Soulmate Sketch" },
    { icon: Star, text: "Personal Love Compatibility Score" },
    { icon: MapPin, text: "Meeting Place Prediction" },
    { icon: Hash, text: "Personalised Numerology Report" },
    { icon: Sparkles, text: "Email Support" },
  ];

  const testimonials = [
    { name: "Sophie M.", location: "Berlin, Germany", text: "The soulmate sketch was incredibly accurate. Two months later I met someone who looked remarkably similar!", initial: "S" },
    { name: "Lucas H.", location: "Amsterdam, Netherlands", text: "I was sceptical, but the report gave me real clarity about who I should be looking for.", initial: "L" },
    { name: "Emma W.", location: "London, UK", text: "Worth every euro. The numerology report alone was eye-opening.", initial: "E" },
  ];

  const benefits = [
    "Discover the cosmic blueprint of your future partner",
    "Understand where and how you're most likely to meet them",
    "Get a clear, AI-rendered visual of their features",
    "Receive your personal numerology breakdown",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Inline Digistore badge in header — horizontal, does NOT cover anything */}
        <div className="flex justify-center mb-6">
          <DigistoreBadge type="salespage" />
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Star className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Discover Your AI Soulmate Sketch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See who the stars have destined for you with an AI-powered portrait based on your unique birth chart.
          </p>
        </div>

        {/* Description / What we offer */}
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center">What You'll Get</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Your personalised Soulmate Sketch package combines ancient astrology with modern AI to reveal the person the cosmos has aligned with you.
            </p>
            <ul className="grid md:grid-cols-2 gap-3 mt-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="max-w-lg mx-auto border-2 border-primary shadow-cosmic overflow-hidden mb-10">
          <div className="bg-gradient-cosmic p-3 text-center">
            <p className="text-primary-foreground font-semibold text-sm">⭐ MOST POPULAR STARTER OFFER</p>
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
              <p className="text-sm font-semibold text-foreground mb-3">Includes:</p>
              <ul className="space-y-3">
                {features.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Button
              variant="cosmic"
              size="lg"
              className="w-full text-base md:text-lg h-14 gap-2"
              onClick={handleBuy}
            >
              Get My Soulmate Sketch — $19.99
              <ArrowRight className="h-5 w-5" />
            </Button>

            {/* 60-day guarantee */}
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                60-Day Money-Back Guarantee
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Secure Digistore24 checkout
            </p>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-card/50 border-primary/20">
                <CardContent className="p-5">
                  <div className="flex text-accent text-sm mb-2">★★★★★</div>
                  <p className="text-sm text-foreground italic mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default InitialPricing;
