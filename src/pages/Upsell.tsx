import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";
import JVZooDisclaimer from "@/components/JVZooDisclaimer";

const Upsell = () => {
  useEffect(() => {
    document.title = "VIP Upgrade — AstroVibe";
  }, []);

  const goldFeatures = [
    "10 AI Soulmate Sketches (10 credits)",
    "Full Soulmate & Twin Flame Analysis",
    "Karmic Bond Reading + Daily Love Forecasts",
    "Personal Tarot Readings",
    "AI Personal Guidance Chat (Unlimited)",
    "Lucky Numbers, Colours & Gemstones",
    "Life & Career Analysis",
    "Daily Affirmations & Horoscope",
    "Meeting Time Predictions",
    "Priority Support",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Inline horizontal badge */}
        <div className="flex justify-center mb-6">
          <DigistoreBadge type="salespage" />
        </div>

        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/40">
            🎉 EXCLUSIVE VIP UPGRADE
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4 px-2">
            Wait! Unlock Your FULL Astrology Reading
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            You've only seen a small part. Your current plan shows limited insights — upgrade now to unlock deep future predictions, relationship secrets and wealth opportunities inside your dashboard.
          </p>
        </div>

        {/* Gold - Single VIP offer */}
        <div className="max-w-lg mx-auto mb-10">
          <Card className="border-2 border-primary shadow-cosmic relative overflow-hidden">
            <div className="bg-gradient-cosmic text-primary-foreground text-center py-2 text-sm font-semibold">
              ⭐ BEST VALUE
            </div>
            <CardHeader className="text-center pb-4 px-4 md:px-6">
              <div className="flex justify-center mb-3">
                <Crown className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl">Gold Membership</CardTitle>
              <div className="pt-3">
                <span className="text-4xl md:text-5xl font-bold text-primary">$99</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">10 sketches + all features</p>
            </CardHeader>
            <CardContent className="space-y-5 px-4 md:px-6">
              <ul className="space-y-2">
                {goldFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="cosmic"
                size="lg"
                className="w-full text-base md:text-lg font-bold py-6"
              >
                Upgrade to Gold VIP — $99
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

        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            No thanks, skip for now
          </Link>
        </div>

        <JVZooDisclaimer />

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default Upsell;
