import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, Sparkles, Heart, Hash, MapPin } from "lucide-react";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";
import WarriorPlusButton from "@/components/WarriorPlusButton";

const InitialPricing = () => {
  const features = [
    { icon: Heart, text: "Personalised astrology dashboard (instant digital access)" },
    { icon: Star, text: "AI-generated Soulmate Sketch + compatibility score" },
    { icon: MapPin, text: "Where & how you'll meet your soulmate" },
    { icon: Hash, text: "Full numerology report based on your birth details" },
    { icon: Sparkles, text: "Email support included" },
  ];

  const benefits = [
    "Personalised astrology dashboard — yours forever",
    "Basic life, love & career predictions",
    "AI-rendered visual of your future partner",
    "Personal numerology breakdown",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Inline Digistore badge in header — horizontal, does NOT cover anything */}
        <div className="flex justify-center mb-6">
          <DigistoreBadge type="salespage" />
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Star className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Unlock Your Personal Astrology Dashboard in 60 Seconds
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant digital access to your AstroVibe member area with personalised predictions about your love life, career, money and future — based on your unique birth details.
          </p>
        </div>

        {/* What you get */}
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center">🎯 What You Get</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              AstroVibe is a digital membership product. After purchase you receive instant access to your secure member dashboard where you can view your astrology insights anytime — no waiting, nothing shipped.
            </p>
            <ul className="grid md:grid-cols-2 gap-3 mt-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="max-w-lg mx-auto border-2 border-primary shadow-cosmic overflow-hidden mb-10">
          <div className="bg-gradient-cosmic p-3 text-center">
            <p className="text-primary-foreground font-semibold text-sm">⭐ MOST POPULAR STARTER OFFER</p>
          </div>
          <CardHeader className="text-center pb-4 px-4 md:px-6">
            <CardTitle className="text-2xl">Soulmate Sketch Package</CardTitle>
            <div className="pt-4">
              <span className="text-4xl md:text-5xl font-bold text-primary">$19.99</span>
              <p className="text-sm text-muted-foreground mt-1">One-time payment • Instant access</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-4 md:px-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Includes:</p>
              <ul className="space-y-3">
                {features.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <WarriorPlusButton
              scriptSrc="https://warriorplus.com/o2/js/kvc5tc"
              buyHref="https://warriorplus.com/o2/buy/kgf6b4/kvc5tc/vbzdmk"
              buttonImg="https://warriorplus.com/o2/btn/fn100011000/kgf6b4/kvc5tc/465278"
              trackingUrl="https://warriorplus.com/o2/v/kgf6b4/kvc5tc"
              alt="Get My Soulmate Sketch for $19.99"
            />

            {/* 60-day guarantee */}
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                60-Day Money-Back Guarantee
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Secure WarriorPlus checkout
            </p>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              The withdrawal from your account will be processed by WarriorPlus.<br/>
              This is a digital product. No physical product will be shipped. Results are based on astrology interpretations and are not a substitute for professional advice.
            </p>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default InitialPricing;
