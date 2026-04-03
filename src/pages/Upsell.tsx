import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, ArrowRight, SkipForward } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Upsell = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState({ monthly: "", annual: "", skip: "" });

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
      setUrls({
        monthly: val.vip_monthly_url || "",
        annual: val.vip_annual_url || "",
        skip: val.vip_skip_url || "",
      });
    }
  };

  const handleBuy = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const vipFeatures = [
    "Unlimited AI Soulmate Sketches",
    "Full Soulmate & Twin Flame Analysis",
    "Karmic Bond Reading",
    "Daily Love Forecasts & Predictions",
    "AI Personal Guidance Chat (Unlimited)",
    "Lucky Numbers, Colours & Gemstones",
    "Life & Career Analysis",
    "Daily Affirmations & Horoscope",
    "Personal Tarot Readings",
    "Priority Support",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/40">
            🎉 EXCLUSIVE VIP UPGRADE
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Unlock All Premium Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upgrade to VIP and get unlimited access to all cosmic insights, soulmate sketches, and personalised readings.
          </p>
        </div>

        {/* Features List */}
        <Card className="max-w-2xl mx-auto mb-8 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 text-center">Everything included in VIP:</h3>
            <ul className="grid md:grid-cols-2 gap-3">
              {vipFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Monthly */}
          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Monthly VIP</CardTitle>
              <div className="pt-3">
                <span className="text-4xl font-bold text-primary">$45</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2"
                onClick={() => handleBuy(urls.monthly)}
              >
                Start Monthly VIP
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Annual - Best Value */}
          <Card className="border-2 border-primary shadow-cosmic relative overflow-hidden">
            <div className="bg-gradient-cosmic text-primary-foreground text-center py-2 text-sm font-semibold">
              ⭐ BEST VALUE — SAVE 63%
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Annual VIP</CardTitle>
              <div className="pt-3">
                <span className="text-4xl font-bold text-primary">$199</span>
                <span className="text-muted-foreground">/year</span>
                <p className="text-xs text-muted-foreground mt-1">That's only $16.58/month</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="cosmic"
                size="lg"
                className="w-full gap-2"
                onClick={() => handleBuy(urls.annual)}
              >
                <Crown className="h-4 w-4" /> Get Annual VIP
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            className="text-muted-foreground gap-2"
            onClick={() => {
              if (urls.skip) {
                window.open(urls.skip, "_blank");
              } else {
                navigate("/thank-you?skipped=true");
              }
            }}
          >
            <SkipForward className="h-4 w-4" />
            No thanks, skip for now
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">🔒 Secure checkout • Cancel anytime • Powered by Digistore24</p>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
