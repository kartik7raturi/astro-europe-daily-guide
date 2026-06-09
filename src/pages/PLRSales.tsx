import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Crown, Package, FileText, Image as ImageIcon, Video, Mail, Sparkles, TrendingUp, Users, Zap, Award, Clock, DollarSign, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesPageChrome from "@/components/SalesPageChrome";
import DigistoreBadge from "@/components/DigistoreBadge";
import JVZooDisclaimer from "@/components/JVZooDisclaimer";

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

  const benefits = [
    { icon: DollarSign, title: "Keep 100% of Profits", text: "No royalties, no recurring fees. Every dollar you make is yours to keep." },
    { icon: Rocket, title: "Launch in 24 Hours", text: "Everything is pre-built. Upload, rebrand, and start selling tomorrow." },
    { icon: TrendingUp, title: "$2.2B Industry", text: "Tap into the booming spiritual & astrology market growing 15% per year." },
    { icon: Users, title: "Unlimited Customers", text: "Sell to as many buyers as you want — no licence limits, no caps." },
    { icon: Zap, title: "Zero Tech Skills Needed", text: "Drag-and-drop deployment guide. If you can copy-paste, you can launch this." },
    { icon: Award, title: "Proven Sales Funnel", text: "Battle-tested $19 → $99 funnel converting at 4-7% out of the box." },
  ];

  const features = [
    "Complete React + Vite + Tailwind source code (production-ready)",
    "Supabase backend schema + edge functions included",
    "AI Soulmate Sketch generator (Hugging Face integration)",
    "Numerology, Tarot, Horoscope & Daily Reading modules",
    "Built-in Stripe / Razorpay / WarriorPlus payment integration",
    "Admin dashboard for orders, users & analytics",
    "Mobile-responsive on every device",
    "SEO-optimized pages with schema markup",
    "Multi-language ready (EN / ES / DE / FR)",
    "Free lifetime updates for 12 months",
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
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Get the complete AstroVibe business-in-a-box: source code, content library, marketing assets and commercial rights — all yours for one payment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary" /> Instant Delivery</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-primary" /> 30-Day Guarantee</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-primary" /> Lifetime Updates</span>
          </div>
        </div>

        {/* Why PLR — Benefits */}
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Why AstroVibe PLR Is a No-Brainer</h2>
            <p className="text-center text-muted-foreground mb-6 text-sm md:text-base">Stop spending $50k+ and 6 months building from scratch.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="p-4 rounded-lg bg-card/40 border border-border/40 hover:border-primary/40 transition">
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.text}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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

        {/* Technical features */}
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6">⚡ Technical Features</h2>
            <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 max-w-3xl mx-auto">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* About the PLR */}
        <Card className="mb-10 border-primary/20">
          <CardContent className="p-6 md:p-8 prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-center mb-4 not-prose">📖 About AstroVibe PLR</h2>
            <p className="text-muted-foreground">
              AstroVibe is a battle-tested astrology & spiritual SaaS that has generated 6 figures for its original creators. With this <strong>Private Label Rights licence</strong> you get the entire business handed to you on a silver platter — code, content, creatives, and conversion funnels.
            </p>
            <p className="text-muted-foreground mt-3">
              Rebrand the logo, point it to your domain, plug in your payment processor, and you're live. Sell it as a SaaS subscription, charge for one-off readings, license sub-PLR — the choice is yours. You keep <strong>100% of every sale</strong>, forever.
            </p>
            <p className="text-muted-foreground mt-3 text-xs italic">
              ⚠️ Only <strong>50 licences</strong> will be sold to protect market saturation. Once gone, this offer closes permanently.
            </p>
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
            <Button
              type="button"
              variant="cosmic"
              size="lg"
              className="w-full text-base md:text-lg font-bold py-6"
            >
              Get PLR Master Licence — $999
            </Button>

            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                30-Day Money-Back Guarantee
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">🔒 Secure JVZoo checkout</p>
            <JVZooDisclaimer />
            <div className="text-center pt-2">
              <a
                href="https://warriorplus.com/o/nothanks/w0x1tv"
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                No thanks, I'll pass on this opportunity
              </a>
            </div>
          </CardContent>
        </Card>

        <SalesPageChrome badgeType="salespage" />
      </div>
    </div>
  );
};

export default PLRSales;