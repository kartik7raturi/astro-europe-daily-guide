import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Stars, Heart, Globe, BookOpen, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Globe,
      title: "European Heritage",
      description: "Our readings are rooted in centuries of European astrological traditions, combining ancient wisdom with modern insights tailored for contemporary European life."
    },
    {
      icon: Heart,
      title: "Compassionate Guidance",
      description: "We believe in providing gentle, nurturing guidance that respects your personal journey and cultural background."
    },
    {
      icon: BookOpen,
      title: "Traditional Wisdom",
      description: "Drawing from classical European astrology, we honor the deep traditions of celestial wisdom passed down through generations."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Understanding the European emphasis on community and relationships, our readings consider your social and cultural context."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Stars className="h-16 w-16 text-primary animate-glow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
            About Cosmic Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are dedicated to providing authentic astrological guidance that honors European traditions while addressing the unique needs and sensibilities of modern European life.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Cosmic Insights, we believe that astrology should be more than entertainment—it should be a meaningful tool for personal growth, understanding, and connection with the cosmic rhythms that have guided European cultures for millennia.
                </p>
                <p>
                  Our approach combines the depth of traditional European astrological practices with contemporary psychological insights, creating personalized guidance that resonates with modern European values of sophistication, cultural awareness, and thoughtful living.
                </p>
                <p>
                  We understand that Europeans value precision, cultural depth, and meaningful insights. That's why our readings go beyond generic horoscopes to provide nuanced, culturally-aware guidance that respects your heritage while supporting your personal journey.
                </p>
              </div>
            </div>
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-accent" />
                  Why Choose Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm">Culturally-aware readings designed for European sensibilities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm">Solutions grounded in European wisdom traditions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm">Personalized insights based on precise birth data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm">Practical guidance for daily life decisions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm">Respectful of diverse European cultural backgrounds</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Values & Approach
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by deep respect for European cultural heritage and the timeless wisdom of the stars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary group-hover:animate-float" />
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Begin Your Cosmic Journey?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join our community of thoughtful Europeans who trust the stars for daily guidance and life insights.
          </p>
          <Link to="/horoscope">
            <Button variant="cosmic" size="lg">
              Start Your Reading
              <Stars className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;