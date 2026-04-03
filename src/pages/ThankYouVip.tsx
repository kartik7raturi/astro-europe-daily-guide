import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


const ThankYouVip = () => {
  const [urls, setUrls] = useState({ supplement_url: "", dashboard_url: "/dashboard" });

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
        supplement_url: val.thankyou_vip_supplement_url || "",
        dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
      });
    }
  };

  const handleSupplement = () => {
    if (urls.supplement_url) {
      window.open(urls.supplement_url, "_blank");
    } else {
      window.location.href = "/shop";
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
              Welcome to VIP! 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">
              Congratulations! Your VIP upgrade is now active. You now have full access to all premium features and cosmic insights.
            </p>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                ✨ All premium features unlocked
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-card/50">
              <h3 className="font-semibold mb-2 text-foreground">🧴 Enhance Your Journey</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover our curated wellness supplements designed to align your body with cosmic energy.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="cosmic" size="lg" className="w-full gap-2" onClick={handleSupplement}>
                <ShoppingBag className="h-5 w-5" /> Browse Supplements
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Link to={urls.dashboard_url}>
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouVip;
