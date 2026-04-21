import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, ArrowRight, SkipForward, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";

const Upsell = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState({ silver: "", gold: "", skip: "" });

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
        silver: val.vip_silver_url || val.vip_monthly_url || "",
        gold: val.vip_gold_url || val.vip_annual_url || "",
        skip: val.vip_skip_url || "",
      });
    }
  };

  const handleBuy = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      navigate("/thank-you-vip");
    }
  };

  const handleSkip = () => {
    if (urls.skip) {
      window.open(urls.skip, "_blank");
    } else {
      navigate("/dashboard");
    }
  };

  const silverFeatures = [
    "4 AI Soulmate Sketches (4 credits)",
    "Full Soulmate & Twin Flame Analysis",
    "Karmic Bond Reading",
    "Daily Love Forecasts",
    "Personal Tarot Readings",
    "Email Support",
  ];

  const goldFeatures = [
    "10 AI Soulmate Sketches (10 credits)",
    "Everything in Silver",
    "AI Personal Guidance Chat (Unlimited)",
    "Lucky Numbers, Colours & Gemstones",
    "Life & Career Analysis",
    "Daily Affirmations & Horoscope",
    "Meeting Time Predictions",
    "Priority Support",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Inline horizontal badge */}
        <div className="flex justify-center mb-6">
          <DigistoreBadge type="salespage" />
        </div>

        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/40">
            🎉 EXCLUSIVE VIP UPGRADE
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Wait! Unlock Your FULL Astrology Reading
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            You've only seen a small part. Your current plan shows limited insights — upgrade now to unlock deep future predictions, relationship secrets and wealth opportunities inside your dashboard.
          </p>
        </div>

        {/* Pricing Cards: Silver & Gold */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {/* Silver */}
          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Silver Membership</CardTitle>
              <div className="pt-3">
                <span className="text-4xl font-bold text-primary">$49</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">4 sketches included</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {silverFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2"
                onClick={() => handleBuy(urls.silver)}
              >
                Get Silver — $49
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Gold - Best Value */}
          <Card className="border-2 border-primary shadow-cosmic relative overflow-hidden">
            <div className="bg-gradient-cosmic text-primary-foreground text-center py-2 text-sm font-semibold">
              ⭐ BEST VALUE
            </div>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <Crown className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl">Gold Membership</CardTitle>
              <div className="pt-3">
                <span className="text-4xl font-bold text-primary">$99</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">10 sketches + all features</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {goldFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="cosmic"
                size="lg"
                className="w-full gap-2"
                onClick={() => handleBuy(urls.gold)}
              >
                <Crown className="h-4 w-4" /> Get Gold — $99
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guarantee */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Shield className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              60-Day Money-Back Guarantee
            </p>
          </div>
        </div>

        {/* Skip */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            className="text-muted-foreground gap-2"
            onClick={handleSkip}
          >
            <SkipForward className="h-4 w-4" />
            No thanks, skip for now
          </Button>
        </div>

        {/* Mandatory Digistore notes */}
        <div className="max-w-2xl mx-auto mb-6 text-center text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-4">
          This is a digital membership upgrade. After purchase, VIP features unlock instantly inside your dashboard. No physical product will be shipped.<br/>
          The withdrawal from your account will be done by Digistore24.
        </div>

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default Upsell;
