import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SalesPageChrome from "@/components/SalesPageChrome";

const ThankYouVip = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState({ supplement_url: "", dashboard_url: "/dashboard" });

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
        supplement_url: val.thankyou_vip_supplement_url || "",
        dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
      });
    }
  };

  const handleSupplement = () => {
    if (urls.supplement_url) {
      window.open(urls.supplement_url, "_blank");
    } else {
      navigate("/dashboard");
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
              Your VIP astrology dashboard is now fully unlocked. Login details have been sent to your inbox — check your spam folder if you don't see them within 5 minutes.
            </p>

            <div className="bg-primary/5 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold mb-1">✨ All VIP features unlocked</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                <li>Complete life predictions (past, present, future)</li>
                <li>Full love & compatibility analysis</li>
                <li>Wealth & career roadmap</li>
                <li>Daily, weekly, monthly updates</li>
              </ul>
            </div>

            {urls.supplement_url && (
              <div className="border rounded-lg p-4 bg-card/50">
                <h3 className="font-semibold mb-2 text-foreground">🧴 Enhance Your Journey</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover wellness supplements designed to align your body with cosmic energy.
                </p>
                <Button variant="cosmic" size="lg" className="w-full gap-2" onClick={handleSupplement}>
                  <ShoppingBag className="h-5 w-5" /> Browse Supplements
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            <Button variant={urls.supplement_url ? "outline" : "cosmic"} size="lg" className="w-full" onClick={handleDashboard}>
              {urls.supplement_url ? "No thanks, go to Dashboard" : "Go to Dashboard"}
            </Button>

            <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
              <p>This is a digital membership upgrade. No physical item will be shipped.</p>
              <p>The withdrawal from your account will be done by <strong>Digistore24</strong>.</p>
            </div>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="thankyoupage" />
      </div>
    </div>
  );
};

export default ThankYouVip;
