import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars, Sparkles, ArrowRight, Hash, Heart, Briefcase, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateLifePathNumber, calculateDestinyNumber, calculateSoulUrgeNumber, calculatePersonalityNumber } from "@/utils/numerology";

const FreeReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const dob = profile?.date_of_birth || "1990-01-01";
  const name = profile?.full_name || "Cosmic Traveller";
  
  const lifePathNumber = calculateLifePathNumber(dob);
  const destinyNumber = calculateDestinyNumber(name);
  const soulUrgeNumber = calculateSoulUrgeNumber(name);
  const personalityNumber = calculatePersonalityNumber(name);

  const lifePathMeanings: Record<number, string> = {
    1: "You are a natural leader with strong independence and creativity. Your path is about pioneering new ideas.",
    2: "You are diplomatic and sensitive. Your path involves cooperation, balance, and bringing harmony to relationships.",
    3: "You are creative and expressive. Your life path is about joy, communication, and artistic expression.",
    4: "You are practical and hardworking. Your path involves building solid foundations and creating order.",
    5: "You are adventurous and freedom-loving. Your path involves change, travel, and embracing new experiences.",
    6: "You are nurturing and responsible. Your life path involves love, family, and caring for others.",
    7: "You are analytical and spiritual. Your path involves seeking truth, wisdom, and inner knowledge.",
    8: "You are ambitious and goal-oriented. Your path involves material success, power, and achievement.",
    9: "You are compassionate and humanitarian. Your path involves service to others and universal love.",
    11: "You are highly intuitive and visionary. As a master number, you carry great spiritual potential.",
    22: "You are a master builder. You have the ability to turn dreams into reality on a grand scale.",
    33: "You are a master teacher. Your path involves selfless service and uplifting humanity.",
  };

  const meaning = lifePathMeanings[lifePathNumber] || lifePathMeanings[lifePathNumber % 10] || "Your cosmic journey is unique and filled with potential.";

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Stars className="h-16 w-16 text-primary" />
              <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-sparkle" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-2">
            Your Free Numerology Report
          </h1>
          <p className="text-muted-foreground text-lg">Hello {name}, here are your cosmic numbers</p>
        </div>

        {/* Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Life Path", number: lifePathNumber, icon: Stars, color: "from-purple-500 to-indigo-600" },
            { label: "Destiny", number: destinyNumber, icon: Heart, color: "from-pink-500 to-rose-600" },
            { label: "Soul Urge", number: soulUrgeNumber, icon: Eye, color: "from-blue-500 to-cyan-600" },
            { label: "Personality", number: personalityNumber, icon: Briefcase, color: "from-amber-500 to-orange-600" },
          ].map((item) => (
            <Card key={item.label} className="text-center border-primary/20">
              <CardContent className="pt-6 pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <span className="text-2xl font-bold text-white">{item.number}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">Number</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Life Path Summary */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Life Path {lifePathNumber} — Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{meaning}</p>
          </CardContent>
        </Card>

        {/* Blurred Premium Section */}
        <div className="relative mb-8">
          <Card className="border-primary/20 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">🔮 Detailed Soulmate Analysis</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="blur-sm select-none pointer-events-none">
                <p className="text-muted-foreground mb-4">Based on your Life Path Number {lifePathNumber}, your ideal soulmate would have complementary cosmic energy. Your most compatible life path numbers are...</p>
                <p className="text-muted-foreground mb-4">Your soulmate is likely to appear in your life during a period of personal growth. The stars suggest they may have characteristics including...</p>
                <p className="text-muted-foreground">Your AI-generated soulmate sketch reveals a person with unique features aligned with your cosmic blueprint...</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                <div className="text-center p-6">
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Unlock Your Full Report</h3>
                  <p className="text-muted-foreground mb-4 text-sm max-w-sm">
                    Get your detailed soulmate sketch, compatibility analysis, and personalised predictions
                  </p>
                  <Button variant="cosmic" size="lg" className="gap-2" onClick={() => navigate("/initial-pricing")}>
                    Get Full Report — $19.99
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">🔒 Secure checkout • 60-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default FreeReport;
