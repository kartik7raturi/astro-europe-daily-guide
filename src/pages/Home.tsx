import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars, Sparkles, Moon, Sun, Heart, Target, Palette, Hash } from "lucide-react";
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
              <Link to="/horoscope">
                <Button variant="cosmic" size="lg" className="w-full sm:w-auto">
                  Get Your Reading
                  <Stars className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="mystical" size="lg" className="w-full sm:w-auto">
                  Learn More
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
    </div>
  );
};

export default Home;