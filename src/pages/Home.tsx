import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Stars, Sparkles, Moon, Sun, Heart, Target, Palette, Hash, Mail, HelpCircle, ChevronDown, ChevronUp, Check, ArrowRight, Star, Shield, Zap, Eye } from "lucide-react";
import cosmicHero from "@/assets/cosmic-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SponsorBanner from "@/components/SponsorBanner";
import TrustBadges from "@/components/TrustBadges";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const { error } = await supabase.from('subscribers').insert({ email, subscribed: true });
      if (error) throw error;
      toast({ title: "Welcome to our cosmic community! ✨", description: "You'll receive weekly insights and exclusive content." });
      setEmail("");
    } catch (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  const features = [
    { icon: Heart, title: "AI Soulmate Sketch", description: "Get an AI-generated portrait of your soulmate based on your birth chart and cosmic alignments." },
    { icon: Sun, title: "Daily Horoscope", description: "Personalised daily predictions to guide your decisions and plan your day." },
    { icon: Target, title: "Love Compatibility", description: "Deep compatibility analysis with twin flame, karmic bond & crush insights." },
    { icon: Hash, title: "Numerology Reports", description: "Discover your life path, destiny number, and hidden personality traits." },
    { icon: Palette, title: "Lucky Elements", description: "Daily lucky colours, numbers, gemstones and directions for positive energy." },
    { icon: Moon, title: "AI Cosmic Chat", description: "Get instant answers to life questions from our AI astrology assistant." },
  ];

  const whyUs = [
    { icon: Star, title: "Accurate AI Predictions", desc: "Our AI combines ancient astrology wisdom with modern machine learning for highly accurate readings." },
    { icon: Shield, title: "Privacy & Security", desc: "Your personal data is encrypted and never shared. GDPR compliant and fully secure." },
    { icon: Zap, title: "Instant Results", desc: "Get your soulmate sketch and readings in seconds — no waiting, no appointments needed." },
    { icon: Eye, title: "Deep Cosmic Insights", desc: "Go beyond basic horoscopes with twin flame analysis, karmic bonds, and life path guidance." },
  ];

  const faqs = [
    { question: "What is a soulmate sketch?", answer: "Our AI analyses your birth chart, planetary positions, and cosmic alignments to generate a portrait of the person the stars have destined for you. It includes physical characteristics, personality traits, and where you might meet them." },
    { question: "How does it work?", answer: "Simply enter your birth details (date, time, place of birth) and our AI engine processes your astrological data to create a personalised soulmate portrait along with compatibility insights and meeting predictions." },
    { question: "Can I get a refund if I'm not satisfied?", answer: "Yes! We offer a 60-day money-back guarantee on all purchases. If you're not completely satisfied, contact our support team for a full refund." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and other payment methods through our secure JVZoo checkout. All transactions are protected with SSL encryption." },
    { question: "Is my personal data safe?", answer: "Absolutely. We use enterprise-grade security and are fully GDPR compliant. Your birth data and readings are encrypted and stored securely. We never sell or share your personal information." },
    { question: "What's included in the VIP plan?", answer: "VIP members get unlimited soulmate sketches, full twin flame & karmic bond analysis, daily love forecasts, AI personal guidance chat, lucky elements, life & career analysis, and priority support." },
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transform-gpu" style={{ backgroundImage: `url(${cosmicHero})` }}>
          <div className="absolute inset-0 bg-background/70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative transform-gpu">
                <Stars className="h-16 w-16 text-primary" />
                <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
              Discover Your Soulmate Through AI & Astrology
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Get an AI-generated soulmate portrait based on your birth chart. See who the cosmos has destined for you — with love predictions, compatibility scores & personalised insights.
            </p>
            <p className="text-lg text-primary font-semibold mb-8">
              ⭐ Trusted by 50,000+ users across Europe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button variant="cosmic" size="lg" className="w-full sm:w-auto gap-2">
                  Get Your Free Astrology Report
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="mystical" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <SponsorBanner page="home" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </div>

      {/* What We Offer — Clarity Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Is AstroVibe?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AstroVibe uses <strong>AI-powered astrology</strong> to create a personalised portrait of your soulmate. 
              Based on your birth chart, planetary positions, and cosmic alignments, we generate a detailed sketch of the 
              person destined for you — along with predictions about where and when you'll meet.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Enter Your Birth Details</h3>
              <p className="text-sm text-muted-foreground">Provide your date, time, and place of birth for accurate cosmic analysis.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="font-bold text-lg mb-2">AI Analyses Your Chart</h3>
              <p className="text-sm text-muted-foreground">Our AI processes your astrological data to identify your soulmate's cosmic blueprint.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Receive Your Sketch</h3>
              <p className="text-sm text-muted-foreground">Get your personalised soulmate portrait with compatibility insights and meeting predictions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AstroVibe Section */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why 50,000+ People Trust AstroVibe
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors text-center">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Get With AstroVibe
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — Get Free Report */}
      <section className="py-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-cosmic p-8 md:p-12 border-none">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Meet Your Soulmate?
            </h2>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Take our free astrology quiz and get your personalised numerology report — then unlock your full soulmate sketch.
            </p>
            <Link to="/quiz">
              <Button variant="gold" size="lg" className="text-lg gap-2">
                Get Your Free Report
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-primary-foreground/60 mt-4">No credit card required for the free report</p>
          </Card>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-cosmic">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-primary-foreground">
            <div className="flex justify-center mb-6">
              <Mail className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Weekly Cosmic Newsletter</h2>
            <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
              Get exclusive weekly insights, cosmic forecasts, and premium astrological content delivered directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" required />
              <Button type="submit" variant="gold" disabled={subscribing} className="whitespace-nowrap">
                {subscribing ? "Subscribing..." : "Subscribe"}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-sm text-primary-foreground/70 mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-0">
                  <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                    {expandedFaq === index ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link to="/contact">
              <Button variant="outline">Contact Our Support Team</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
