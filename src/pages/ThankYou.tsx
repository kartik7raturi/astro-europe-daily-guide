import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const skipped = searchParams.get("skipped") === "true";
  const [urls, setUrls] = useState({ vip_url: "/upsell", dashboard_url: "/dashboard" });

  useEffect(() => {
    loadSettings();
    // Load Digistore24 trusted badge
    const script = document.createElement("script");
    script.src = "https://www.digistore24.com/trusted-badge/45152/URbvNfHBuUCF7uC/thankyoupage";
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
        vip_url: val.thankyou_vip_url || "/upsell",
        dashboard_url: val.thankyou_dashboard_url || "/dashboard",
      });
    }
  };

  const handleVipUpgrade = () => {
    if (urls.vip_url.startsWith("http")) {
      window.open(urls.vip_url, "_blank");
    } else {
      window.location.href = urls.vip_url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <Card className="border-primary/30 text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-primary" />
                <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-sparkle" />
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-cosmic bg-clip-text text-transparent">
              {skipped ? "You're All Set! 🌟" : "Thank You for Your Purchase! 🎉"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">
              {skipped
                ? "You can explore your basic features now. Upgrade anytime to unlock your full cosmic experience."
                : "Your Soulmate Sketch package is now active. Unlock even more with our VIP upgrade!"}
            </p>

            {!skipped && (
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✨ Your basic features are ready to use immediately
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {!skipped && (
                <Button variant="cosmic" size="lg" className="w-full gap-2" onClick={handleVipUpgrade}>
                  <Crown className="h-5 w-5" /> Upgrade to VIP
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
              <Link to={urls.dashboard_url}>
                <Button variant={skipped ? "cosmic" : "outline"} size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              {skipped && (
                <Button variant="outline" className="w-full gap-2" onClick={handleVipUpgrade}>
                  <Sparkles className="h-4 w-4" /> View Premium Plans
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
