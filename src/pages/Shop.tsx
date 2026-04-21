import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield, ArrowRight, Sparkles, TrendingUp, Heart, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Shop = () => {
  const [buyUrl, setBuyUrl] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", "funnel_settings")
        .maybeSingle();
      if (data?.value) {
        const v = data.value as any;
        setBuyUrl(v.money_magnet_url || "");
      }
    })();
  }, []);

  const handleBuy = () => {
    if (buyUrl) window.open(buyUrl, "_blank");
  };

  const benefits = [
    { icon: Coins, title: "Attract Wealth Energy", text: "Align your aura with abundance frequencies" },
    { icon: TrendingUp, title: "Unlock Hidden Opportunities", text: "Spot career & financial doors before they open" },
    { icon: Heart, title: "Banish Money Blocks", text: "Clear subconscious patterns holding you back" },
    { icon: Sparkles, title: "Daily Manifestation Rituals", text: "Step-by-step practice you can do in 5 minutes" },
  ];

  const includes = [
    "Complete Money Magnet digital programme",
    "21-day wealth-attraction ritual workbook",
    "Personalised numerology money map",
    "Daily affirmation audio bundle",
    "Lifetime access — instant digital delivery",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <Coins className="h-14 w-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Money Magnet — Activate Your Wealth Frequency
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The complete cosmic wealth-attraction system trusted by thousands across Europe to break money blocks and call in abundance — fast.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Card key={i} className="border-primary/20">
                <CardContent className="p-5 flex gap-3">
                  <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.text}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What's included + CTA */}
        <Card className="max-w-xl mx-auto border-2 border-primary shadow-cosmic overflow-hidden mb-8">
          <div className="bg-gradient-cosmic p-3 text-center">
            <p className="text-primary-foreground font-semibold text-sm">⭐ COMPLETE MONEY MAGNET BUNDLE</p>
          </div>
          <CardContent className="p-6 space-y-5">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">$39</span>
              <p className="text-sm text-muted-foreground mt-1">One-time payment · Lifetime digital access</p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Includes:</p>
              <ul className="space-y-2">
                {includes.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="cosmic"
              size="lg"
              className="w-full text-base h-14 gap-2"
              onClick={handleBuy}
              disabled={!buyUrl}
            >
              Get Money Magnet — $39
              <ArrowRight className="h-5 w-5" />
            </Button>

            {!buyUrl && (
              <p className="text-xs text-center text-muted-foreground">
                Checkout link will appear once configured by admin.
              </p>
            )}

            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                60-Day Money-Back Guarantee
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed border-t border-border pt-3">
              This is a digital product. No physical item will be shipped.<br/>
              The withdrawal from your account will be done by Digistore24.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shop;
