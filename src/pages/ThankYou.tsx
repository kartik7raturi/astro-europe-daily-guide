import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SalesPageChrome from "@/components/SalesPageChrome";

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skipped = searchParams.get("skipped") === "true";
  const [urls, setUrls] = useState({ vip_url: "/upsell", dashboard_url: "/dashboard" });

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
        vip_url: val.thankyou_vip_url || "/upsell",
        dashboard_url: val.thankyou_dashboard_url || "/dashboard",
      });
    }
  };

  const handleVipUpgrade = () => {
    if (urls.vip_url.startsWith("http")) {
      window.open(urls.vip_url, "_blank");
    } else {
      navigate(urls.vip_url);
    }
  };

  const handleSkipToDashboard = () => {
    if (urls.dashboard_url.startsWith("http")) {
      window.open(urls.dashboard_url, "_blank");
    } else {
      navigate(urls.dashboard_url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-lg w-full mx-auto">
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
            <p className="text-muted-foreground text-base md:text-lg">
              {skipped
                ? "You can explore your basic features now. Upgrade anytime to unlock the full cosmic experience."
                : "Your Soulmate Sketch package is now active. Unlock even more with our VIP upgrade!"}
            </p>

            {!skipped && (
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  ✨ Your Soulmate Sketch features are ready to use
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
              <Button
                variant={skipped ? "cosmic" : "outline"}
                size="lg"
                className="w-full"
                onClick={handleSkipToDashboard}
              >
                {skipped ? "Go to Dashboard" : "No thanks, go to Dashboard"}
              </Button>
            </div>

            {/* Bank statement note */}
            <p className="text-xs text-muted-foreground border-t border-border pt-4">
              The debit will appear as <strong>Digistore24 GmbH (Germany)</strong> on your bank or card statement.
            </p>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="thankyoupage" />
      </div>
    </div>
  );
};

export default ThankYou;
