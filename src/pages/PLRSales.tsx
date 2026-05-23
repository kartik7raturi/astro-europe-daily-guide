import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Crown, Package, FileText, Image as ImageIcon, Video, Mail } from "lucide-react";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";
import WarriorPlusButton from "@/components/WarriorPlusButton";

const PLRSales = () => {
  const included = [
    { icon: Package, text: "Full AstroVibe website source code (React + Tailwind) — rebrand & resell as your own" },
    { icon: FileText, text: "100+ ready-to-publish astrology blog articles (DOCX + Markdown)" },
    { icon: ImageIcon, text: "500+ branded social media graphics (Canva templates included)" },
    { icon: Video, text: "30 short-form video scripts + ready-rendered MP4 promos" },
    { icon: Mail , text: "Pre-written email sequences (welcome, upsell, win-back) — Mailchimp & Resend ready" },
    { icon: Crown, text: "Commercial PLR licence — keep 100% of every sale you make" },
  ];

  const bonuses = [
    "BONUS 1: Sales funnel templates ($19 + $99 upsell) — proven copy",
    "BONUS 2: Done-for-you ad creatives (Meta + TikTok)",
    "BONUS 3: 12 lead-magnet PDFs (Soulmate quiz, Numerology guide…)",
    "BONUS 4: Private buyer-only support community",
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-6">
          <DigistoreBadge type="salespage" />
        </div>

        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-4">
            PRIVATE LABEL RIGHTS • LIMITED LICENCES
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            AstroVibe PLR — Launch Your Own Astrology Empire
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the complete AstroVibe business-in-a-box: source code, content library, marketing assets and commercial rights — all yours for one payment.
          </p>
        </div>

        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center">📦 What's Included</h2>
            <ul className="grid md:grid-cols-2 gap-3 mt-4">
              {included.map((b, i) => {
                const Icon = b.icon;
                return (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/40 border border-border/40">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{b.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-border/40">
              <h3 className="text-lg font-semibold text-center mb-3">🎁 Fast-Action Bonuses</h3>
              <ul className="space-y-2 max-w-2xl mx-auto">
                {bonuses.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-lg mx-auto border-2 border-primary shadow-cosmic overflow-hidden mb-10">
          <div className="bg-gradient-cosmic p-3 text-center">
            <p className="text-primary-foreground font-semibold text-sm">👑 COMPLETE PLR PACKAGE</p>
          </div>
          <CardHeader className="text-center pb-4 px-4 md:px-6">
            <CardTitle className="text-2xl">AstroVibe PLR Master Licence</CardTitle>
            <div className="pt-4">
              <span className="text-sm text-muted-foreground line-through">$2,997</span>
              <div>
                <span className="text-4xl md:text-5xl font-bold text-primary">$999</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">One-time payment • Instant download</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-4 md:px-6">
            <WarriorPlusButton
              scriptSrc="https://warriorplus.com/o2/js/kvc5tc"
              buyHref="https://warriorplus.com/o2/buy/kgf6b4/kvc5tc/plr999"
              buttonImg="https://warriorplus.com/o2/btn/fn100011000/kgf6b4/kvc5tc/465278"
              trackingUrl="https://warriorplus.com/o2/v/kgf6b4/kvc5tc"
              alt="Get AstroVibe PLR for $999"
            />

            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                30-Day Money-Back Guarantee
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">🔒 Secure WarriorPlus checkout</p>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              The withdrawal will be processed by WarriorPlus. After payment you'll be redirected to your private download page with all files and your licence certificate.
            </p>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default PLRSales;