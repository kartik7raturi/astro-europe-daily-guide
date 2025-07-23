import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars, Sparkles, Moon, Sun, Heart, Target, Palette, Hash, Smartphone, Download } from "lucide-react";
import cosmicHero from "@/assets/cosmic-hero.jpg";

const Home = () => {
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
      description: "Receive cosmic guidance and practical solutions tailored for European wisdom traditions."
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${cosmicHero})` }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Stars className="h-16 w-16 text-primary animate-float" />
                <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-sparkle" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
              Discover Your Cosmic Destiny
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unlock the mysteries of the universe with personalized astrology readings crafted for European wisdom. 
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

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What the Stars Reveal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience comprehensive cosmic guidance designed specifically for European sensibilities and wisdom traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-cosmic">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="h-12 w-12 text-primary group-hover:animate-float" />
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
              <Smartphone className="h-16 w-16 text-primary animate-float" />
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
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-cosmic">
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
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-cosmic">
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
              Join thousands of Europeans who trust our celestial guidance for daily insights and life-changing solutions.
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">
              Discover how Cosmic Insights has transformed lives across Europe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "The daily horoscope readings are incredibly accurate and insightful. I've been using Cosmic Insights for 6 months and it's helped me make better decisions in my career and relationships."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Maria Schmidt</p>
                    <p className="text-sm text-muted-foreground">Berlin, Germany</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "The love forecasts feature helped me understand my relationship patterns better. I met my soulmate just as the app predicted - at an art gallery during spring!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Alessandro Rossi</p>
                    <p className="text-sm text-muted-foreground">Milan, Italy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "The numerology reports gave me such clarity about my life path. The detailed analysis helped me choose the right career direction and I couldn't be happier!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sophie Dubois</p>
                    <p className="text-sm text-muted-foreground">Paris, France</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "I was skeptical at first, but the daily affirmations and cosmic guidance have genuinely improved my mindset and brought more positivity into my life."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    L
                  </div>
                  <div>
                    <p className="font-semibold">Lars Andersen</p>
                    <p className="text-sm text-muted-foreground">Copenhagen, Denmark</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "The astro journal feature has become part of my daily routine. Tracking my mood with planetary influences has helped me understand myself so much better."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    E
                  </div>
                  <div>
                    <p className="font-semibold">Elena Petrov</p>
                    <p className="text-sm text-muted-foreground">Prague, Czech Republic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground mb-4 italic">
                  "The crush analyzer was surprisingly accurate! It helped me understand compatibility patterns and gave me confidence to pursue meaningful connections."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">James Thompson</p>
                    <p className="text-sm text-muted-foreground">London, UK</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Join over 50,000+ satisfied users across Europe
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;