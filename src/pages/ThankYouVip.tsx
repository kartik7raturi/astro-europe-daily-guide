import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SalesPageChrome from "@/components/SalesPageChrome";
import AccessInfoBlock from "@/components/AccessInfoBlock";

const ThankYouVip = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState({ dashboard_url: "/dashboard" });

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
        dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
      });
    }
  };

  const handleDashboard = () => {
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
              Welcome to VIP! 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-base md:text-lg">
              Your VIP astrology dashboard is now fully unlocked.
            </p>

            <AccessInfoBlock />

            <div className="bg-primary/5 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold mb-1">✨ All VIP features unlocked</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                <li>Complete life predictions (past, present, future)</li>
                <li>Full love & compatibility analysis</li>
                <li>Wealth & career roadmap</li>
                <li>Daily, weekly, monthly updates</li>
              </ul>
            </div>

            <Button variant="cosmic" size="lg" className="w-full" onClick={handleDashboard}>
              Go to Dashboard
            </Button>

            <a
              href="https://www.jvzoo.com/nothanks/443439"
              className="inline-flex items-center justify-center w-full h-11 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
            >
              No Thanks
            </a>

            <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
              <p>This is a digital membership upgrade. No physical item will be shipped.</p>
              <p>The withdrawal from your account will be done by <strong>JVZoo</strong>.</p>
            </div>
          </CardContent>
        </Card>

        {/* JVZoo tracking pixel */}
        <img
          src="https://i.jvzoo.com/117121/443439/6"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />

        <SalesPageChrome badgeType="thankyoupage" />
      </div>
    </div>
  );
};

export default ThankYouVip;
