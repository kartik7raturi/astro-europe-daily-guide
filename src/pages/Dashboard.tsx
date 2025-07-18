import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Stars, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Shield, 
  Target, 
  Calendar,
  LogOut,
  User,
  Settings
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DailyReading {
  id: string;
  overview: string;
  lucky_numbers: number[];
  power_colors: string[];
  love_guidance: string;
  career_guidance: string;
  health_guidance: string;
  challenges: string;
  solutions: string;
  advice: string;
  reading_date: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  date_of_birth: string;
  place_of_birth: string;
  time_of_birth?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyReading, setDailyReading] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadUserData(session.user.id);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    checkUser();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        // Load or generate today's reading
        await loadDailyReading(userId);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadDailyReading = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if reading exists for today
      const { data: existingReading } = await supabase
        .from("daily_readings")
        .select("*")
        .eq("user_id", userId)
        .eq("reading_date", today)
        .single();

      if (existingReading) {
        setDailyReading(existingReading);
      } else {
        // Generate new reading for today
        await generateDailyReading(userId, today);
      }
    } catch (error) {
      console.error("Error loading daily reading:", error);
    }
  };

  const generateDailyReading = async (userId: string, date: string) => {
    try {
      // Generate sample reading (in production, this would be more sophisticated)
      const luckyNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
      const colors = ["Deep Purple", "Golden Yellow", "Emerald Green", "Sapphire Blue", "Ruby Red"];
      const powerColors = [colors[Math.floor(Math.random() * colors.length)]];

      const newReading = {
        user_id: userId,
        reading_date: date,
        overview: "Today brings harmonious cosmic energy that aligns perfectly with your European sensibilities. The stars favor thoughtful decision-making and cultural pursuits.",
        lucky_numbers: luckyNumbers,
        power_colors: powerColors,
        love_guidance: "Venus encourages meaningful conversations and emotional depth in your relationships. Focus on genuine connection rather than surface attractions.",
        career_guidance: "Professional opportunities arise through networking and collaborative efforts. Your diplomatic approach will open new doors.",
        health_guidance: "Balance work with leisure activities. Consider taking a peaceful walk in nature or practicing mindfulness meditation.",
        challenges: "Minor communication misunderstandings may arise in the afternoon. Practice patience and active listening.",
        solutions: "Approach conflicts with typical European diplomacy - seek understanding before being understood. Cultural wisdom will guide you.",
        advice: "Trust your intuition today. The universe supports your journey toward personal growth and cultural enrichment."
      };

      const { data, error } = await supabase
        .from("daily_readings")
        .insert([newReading])
        .select()
        .single();

      if (error) throw error;
      setDailyReading(data);
    } catch (error) {
      console.error("Error generating daily reading:", error);
      toast({
        title: "Error",
        description: "Could not generate today's reading. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="text-center">
          <Stars className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your cosmic insights...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Please complete your astrology profile to access your personalized dashboard.
            </p>
            <Button onClick={() => navigate("/horoscope")} variant="cosmic">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Stars className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Cosmic Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {profile.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="daily" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Horoscope</TabsTrigger>
            <TabsTrigger value="life">Life & Career</TabsTrigger>
            <TabsTrigger value="soulmate">Soulmate Analysis</TabsTrigger>
          </TabsList>

          {/* Daily Horoscope Tab */}
          <TabsContent value="daily" className="space-y-6">
            {dailyReading && (
              <>
                {/* Today's Overview */}
                <Card className="bg-gradient-cosmic border-none text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Today's Cosmic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{dailyReading.overview}</p>
                  </CardContent>
                </Card>

                {/* Quick Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        Lucky Numbers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {dailyReading.lucky_numbers.map((num, index) => (
                          <Badge key={index} variant="secondary" className="text-lg px-3 py-1">
                            {num}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        Power Colors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {dailyReading.power_colors.map((color, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        Daily Advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{dailyReading.advice}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Guidance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-red-500" />
                        Love & Relationships
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{dailyReading.love_guidance}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                        Career & Finance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{dailyReading.career_guidance}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-orange-600">Challenges Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{dailyReading.challenges}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-green-600">Solutions & Guidance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{dailyReading.solutions}</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Life & Career Tab */}
          <TabsContent value="life" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detailed Life Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Coming soon! This section will provide comprehensive insights into your life path, 
                  career opportunities, and long-term cosmic influences based on your birth chart.
                </p>
                <Button variant="cosmic" disabled>
                  Generate Life Analysis
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Soulmate Analysis Tab */}
          <TabsContent value="soulmate" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Soulmate Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Discover your perfect match using the ancient 36 Guna system from Hindu astrology. 
                  Enter your partner's details to analyze compatibility across all aspects of life.
                </p>
                <Button 
                  variant="cosmic" 
                  onClick={() => navigate("/soulmate-analysis")}
                >
                  Start Compatibility Analysis
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;