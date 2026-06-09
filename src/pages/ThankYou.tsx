import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SalesPageChrome from "@/components/SalesPageChrome";
import AccessInfoBlock from "@/components/AccessInfoBlock";

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
              Your astrology dashboard is ready. Your access is now active and you can log in below. You will also receive details by email — if you don't see it, please check your spam folder.
            </p>

            <AccessInfoBlock />

            {!skipped && (
              <div className="bg-primary/5 rounded-lg p-4 text-left">
                <p className="text-sm font-semibold mb-1">📥 Access instructions</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Your access is now active inside your dashboard</li>
                  <li>Login email has been sent to your inbox</li>
                  <li>Check spam folder if not received within 5 minutes</li>
                </ul>
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

            {/* Mandatory notes */}
            <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
              <p>This is a digital product. No physical item will be shipped.</p>
              <p>The withdrawal from your account will be done by <strong>Digistore24</strong>.</p>
            </div>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="thankyoupage" />
      </div>
    </div>
  );
};

export default ThankYou;
