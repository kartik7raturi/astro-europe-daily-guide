import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Stars, Sparkles, Moon, Sun, Heart, Target, Palette, Hash, Smartphone, Download, Mail, BookOpen, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import cosmicHero from "@/assets/cosmic-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SponsorBanner from "@/components/SponsorBanner";
import TrustBadges from "@/components/TrustBadges";

const Home = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { toast } = useToast();

  const blogPosts = [
    {
      title: "Understanding Your Zodiac Sign in Modern Times",
      excerpt: "Discover how ancient wisdom applies to contemporary Indian life and relationships.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Astrology"
    },
    {
      title: "The Power of Daily Affirmations in Cosmic Practice",
      excerpt: "Learn how to harness cosmic energy through mindful affirmation practices.",
      date: "2024-01-10",
      readTime: "3 min read",
      category: "Wellness"
    },
    {
      title: "Numerology: Decoding Your Life Path Number",
      excerpt: "A comprehensive guide to understanding your personal numerology chart.",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Numerology"
    }
  ];

  const faqs = [
    {
      question: "How accurate are the daily horoscope readings?",
      answer: "Our readings combine traditional Indian astrological wisdom with modern interpretation techniques. While astrology provides guidance and insights, remember that you have the power to shape your destiny through your choices and actions."
    },
    {
      question: "Can I get readings for multiple zodiac signs?",
      answer: "Yes! You can create multiple profiles or check readings for friends and family members. Our system allows you to save different birth data for various people you care about."
    },
    {
      question: "What makes your approach specifically Indian?",
      answer: "Our readings incorporate Indian astrological traditions, cultural sensibilities, and wisdom that resonates with Indian values of thoughtfulness, cultural appreciation, and balanced living."
    },
    {
      question: "How often should I check my astro insights?",
      answer: "Our readings are updated every day at midnight IST. Many users find checking their reading each morning helps set a positive intention for the day, but use them as often as feels right for you."
    },
    {
      question: "Do you offer personalized consultations?",
      answer: "Yes! We provide one-on-one consultations with experienced astrologers who specialize in Indian astrological traditions. You can book consultations through your dashboard."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade security and never share your personal information. Your birth data and readings are encrypted and stored securely according to Indian data protection standards."
    }
  ];

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
      const { error } = await supabase.from('subscribers').insert({
        email: email,
        subscribed: true
      });

      if (error) throw error;

      toast({
        title: "Welcome to our cosmic community! ✨",
        description: "You'll receive weekly insights and exclusive content.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubscribing(false);
    }
  };

  const features = [
    {
      icon: Sun,
      title: "Daily Predictions",
      description: "Get personalized daily insights about how your day will unfold based on cosmic alignments."
    },
    {
      icon: Hash,
      title: "Lucky Numbers",
      description: "Discover your fortunate numbers for the day to guide important decisions and opportunities."
    },
    {
      icon: Palette,
      title: "Power Colors",
      description: "Learn which colors will enhance your energy and bring positive vibrations to your day."
    },
    {
      icon: Target,
      title: "Problem Solutions",
      description: "Receive cosmic guidance and practical solutions tailored for Indian wisdom traditions."
    },
    {
      icon: Heart,
      title: "Love & Relationships",
      description: "Understand your romantic prospects and relationship dynamics with celestial guidance."
    },
    {
      icon: Moon,
      title: "Life Challenges",
      description: "Navigate obstacles with ancient wisdom and modern insights for personal growth."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform-gpu"
          style={{ backgroundImage: `url(${cosmicHero})` }}
        >
          <div className="absolute inset-0 bg-background/70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative transform-gpu">
                <Stars className="h-16 w-16 text-primary" />
                <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
              Discover Your Cosmic Destiny
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unlock the mysteries of the universe with personalized astrology readings crafted for Indian wisdom. 
              Get daily guidance, lucky numbers, power colors, and solutions to life's challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="cosmic" size="lg" className="w-full sm:w-auto">
                  Get Started
                  <Stars className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/horoscope">
                <Button variant="mystical" size="lg" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Banner */}
      <SponsorBanner page="home" />
      
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What the Stars Reveal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience comprehensive cosmic guidance designed specifically for Indian sensibilities and wisdom traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors duration-300 group">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Smartphone className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Take Your Cosmic Journey Mobile
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Download our mobile app and access your daily readings, horoscopes, and cosmic guidance anywhere, anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* iOS Download */}
            <Card className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-cosmic rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Download className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">iOS App</h3>
                <p className="text-muted-foreground mb-6">
                  Download for iPhone and iPad. Full-featured app with offline capabilities and push notifications for daily readings.
                </p>
                <Button variant="cosmic" size="lg" className="w-full" onClick={() => window.open('#', '_blank')}>
                  Download for iOS
                  <Download className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Requires iOS 12.0 or later
                </p>
              </CardContent>
            </Card>

            {/* Android Download */}
            <Card className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Download className="h-8 w-8 text-accent-foreground" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Android App</h3>
                <p className="text-muted-foreground mb-6">
                  Download APK file or get it from Google Play. Optimized for all Android devices with dark mode support.
                </p>
                <div className="space-y-3">
                  <Button variant="gold" size="lg" className="w-full" onClick={() => window.open('#', '_blank')}>
                    Download APK
                    <Download className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => window.open('#', '_blank')}>
                    Google Play Store
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Requires Android 7.0 or later
                </p>
              </CardContent>
            </Card>
          </div>

          {/* App Features */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Mobile App Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Offline Access</h4>
                <p className="text-sm text-muted-foreground">Read your horoscopes even without internet connection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Get daily reminders for your cosmic guidance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Personalized</h4>
                <p className="text-sm text-muted-foreground">Tailored readings based on your profile and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-cosmic p-8 border-none">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Unlock Your Cosmic Potential?
            </h2>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Join thousands of Indians who trust our celestial guidance for daily insights and life-changing solutions.
            </p>
            <Link to="/horoscope">
              <Button variant="gold" size="lg">
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Cosmic Wisdom Blog
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore in-depth articles about astrology, numerology, and astro insights crafted for the modern Indian mindset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="bg-card/80 border-primary/20 hover:border-primary/40 transition-colors duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Link to="/blog">
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/blog">
              <Button variant="cosmic" size="lg">
                View All Articles
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-cosmic">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-primary-foreground">
            <div className="flex justify-center mb-6">
              <Mail className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Weekly Cosmic Newsletter
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
              Get exclusive weekly insights, cosmic forecasts, and premium astrological content delivered directly to your inbox. Join our community of cosmic seekers across India.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                required
              />
              <Button 
                type="submit" 
                variant="gold" 
                disabled={subscribing}
                className="whitespace-nowrap"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <p className="text-sm text-primary-foreground/70 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our astro insights and astrological services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Link to="/contact">
              <Button variant="outline">
                Contact Our Support Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
           <p className="text-muted-foreground text-lg">
              See how astrovibe.online is changing lives across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Bahut sahi predictions milti hain yahan pe! Maine 6 mahine se use kar raha hoon aur career mein bahut help mili. Daily horoscope padhna ab meri aadat ban gayi hai."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">R</div>
                  <div>
                    <p className="font-semibold">Rahul Sharma</p>
                    <p className="text-sm text-muted-foreground">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Love forecast feature ne meri life change kar di! Soulmate sketch bilkul accurate tha. Mujhe apna partner mil gaya exactly jaisa app ne bataya tha. Thank you astrovibe!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">P</div>
                  <div>
                    <p className="font-semibold">Priya Patel</p>
                    <p className="text-sm text-muted-foreground">Ahmedabad, Gujarat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Numerology report ne mujhe clarity di ki mera life path kya hai. Career direction samajh mein aa gayi aur ab main bahut khush hoon apne decisions se."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">A</div>
                  <div>
                    <p className="font-semibold">Ankit Verma</p>
                    <p className="text-sm text-muted-foreground">Delhi, NCR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Pehle mujhe believe nahi tha astrology pe, lekin daily affirmations aur guidance ne meri soch badal di. Ab har subah app check karna mera routine hai. Bohot positive feel hota hai!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">S</div>
                  <div>
                    <p className="font-semibold">Sneha Reddy</p>
                    <p className="text-sm text-muted-foreground">Hyderabad, Telangana</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Astro journal feature meri daily routine ka hissa ban gayi hai. Mood tracking with planets wala concept bahut unique hai. Apne aap ko samajhna easy ho gaya hai."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">D</div>
                  <div>
                    <p className="font-semibold">Deepak Kumar</p>
                    <p className="text-sm text-muted-foreground">Bangalore, Karnataka</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">★★★★★</div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "Crush analyzer sach mein kaam karta hai! Compatibility patterns samajh aaye aur mujhe confidence mila apne crush se baat karne ka. Ab hum saath mein hain! 😊"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">M</div>
                  <div>
                    <p className="font-semibold">Meera Iyer</p>
                    <p className="text-sm text-muted-foreground">Chennai, Tamil Nadu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Join 50,000+ happy users across India
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;