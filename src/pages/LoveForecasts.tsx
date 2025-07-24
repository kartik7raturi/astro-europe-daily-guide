import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, TrendingUp, DollarSign, Clock, RefreshCw, Crown, Sparkles, Wand2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface LoveForecast {
  love_score: number;
  career_score: number;
  finance_score: number;
  love_advice: string;
  career_advice: string;
  finance_advice: string;
  lucky_love_time: string;
  soulmate_sketch: string | null;
}

interface SoulmateProfile {
  appearance: string;
  personality: string;
  meetingLocation: string;
  timeframe: string;
  connectionType: string;
}

const LoveForecasts = () => {
  const [forecast, setForecast] = useState<LoveForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSoulmate, setAiSoulmate] = useState<SoulmateProfile | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAccess, subscribed, trial_end, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    loadTodayForecast();
  }, []);

  const loadTodayForecast = async () => {
    try {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('love_forecasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading forecast:', error);
        return;
      }

      if (data) {
        setForecast(data);
      } else {
        generateNewForecast();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewForecast = async () => {
    try {
      if (!user) return;

      const loveScore = Math.floor(Math.random() * 10) + 1;
      const careerScore = Math.floor(Math.random() * 10) + 1;
      const financeScore = Math.floor(Math.random() * 10) + 1;
      
      const loveAdvice = getLoveAdvice(loveScore);
      const careerAdvice = getCareerAdvice(careerScore);
      const financeAdvice = getFinanceAdvice(financeScore);
      
      const luckyTimes = ['08:00', '11:30', '14:20', '17:45', '20:15'];
      const luckyTime = luckyTimes[Math.floor(Math.random() * luckyTimes.length)];

      // Generate soulmate sketch description for subscribed users
      const soulmateSketch = hasAccess('love_forecasts') ? generateSoulmateSketch() : null;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('love_forecasts')
        .insert({
          user_id: user.id,
          date: today,
          love_score: loveScore,
          career_score: careerScore,
          finance_score: financeScore,
          love_advice: loveAdvice,
          career_advice: careerAdvice,
          finance_advice: financeAdvice,
          lucky_love_time: luckyTime,
          soulmate_sketch: soulmateSketch
        })
        .select()
        .single();

      if (error) throw error;

      setForecast(data);
      toast({
        title: "Forecast Updated",
        description: "Your daily cosmic predictions are ready!"
      });
    } catch (error) {
      console.error('Error generating forecast:', error);
    }
  };

  const generateSoulmateSketch = () => {
    const features = [
      "warm, expressive eyes that sparkle with kindness",
      "a gentle smile that lights up their face",
      "an aura of creativity and intelligence",
      "stylish yet comfortable appearance",
      "confident but approachable demeanor",
      "an artistic or intellectual vibe",
      "natural charisma and charm"
    ];
    
    const locations = [
      "a cozy bookstore or library",
      "an art gallery or creative space",
      "a peaceful park or garden",
      "a coffee shop with good music",
      "a cultural event or workshop",
      "while traveling or exploring"
    ];

    const selectedFeatures = features.slice(0, 3 + Math.floor(Math.random() * 3));
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return `Your soulmate has ${selectedFeatures.join(', ')}. The cosmic energies suggest you'll meet them in ${location}. They bring balance to your energy and share your deeper values.`;
  };

  const getLoveAdvice = (score: number) => {
    if (score >= 8) return "Love energy is powerful today! Open your heart to new connections or deepen existing bonds.";
    if (score >= 6) return "Romance flows gently today. A perfect time for heartfelt conversations and small gestures.";
    if (score >= 4) return "Love requires patience today. Focus on self-love and understanding your emotional needs.";
    return "Cosmic energies suggest taking time for self-reflection. Love will bloom when the timing is right.";
  };

  const getCareerAdvice = (score: number) => {
    if (score >= 8) return "Career momentum is strong! Take bold action on important projects and showcase your talents.";
    if (score >= 6) return "Steady progress in your professional life. Collaboration and networking will be beneficial.";
    if (score >= 4) return "Focus on organization and planning today. Lay groundwork for future career opportunities.";
    return "A day for patience in professional matters. Avoid major decisions and focus on skill development.";
  };

  const getFinanceAdvice = (score: number) => {
    if (score >= 8) return "Financial opportunities may present themselves! Trust your intuition with money matters.";
    if (score >= 6) return "Steady financial energy. Good time for budgeting and planning future investments.";
    if (score >= 4) return "Be conservative with spending today. Focus on saving and avoid unnecessary purchases.";
    return "Practice financial mindfulness. Review your expenses and consider long-term financial goals.";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const generateAISoulmate = async () => {
    if (!user || !hasAccess('love_forecasts')) return;
    
    setGeneratingAI(true);
    try {
      // Generate detailed AI soulmate profile
      const appearances = [
        "tall with dark hair and expressive brown eyes",
        "medium height with golden blonde hair and green eyes", 
        "athletic build with auburn hair and hazel eyes",
        "elegant posture with black hair and deep blue eyes",
        "charming smile with light brown hair and warm amber eyes"
      ];
      
      const personalities = [
        "intellectually curious with a passion for art and culture",
        "adventurous spirit who loves travel and new experiences", 
        "compassionate soul with a deep love for nature and animals",
        "creative mind with talents in music or writing",
        "ambitious dreamer who values family and authentic connections"
      ];
      
      const locations = [
        "a cozy coffee shop where you both reach for the same book",
        "a museum exhibit where you share the same fascination",
        "a park where you're both walking your dogs",
        "a cooking class where you're paired as partners",
        "a volunteering event for a cause you both care about"
      ];
      
      const timeframes = [
        "within the next 6 months during spring",
        "in the upcoming year around your birthday",
        "during a significant life transition period", 
        "when you least expect it but most need it",
        "after you've completed a personal growth journey"
      ];
      
      const connections = [
        "an instant recognition as if you've known each other before",
        "a slow-building friendship that blossoms into deep love",
        "a magnetic attraction combined with intellectual compatibility",
        "a comfortable ease that feels like coming home",
        "a passionate connection that ignites your creative spirits"
      ];
      
      const newSoulmate: SoulmateProfile = {
        appearance: appearances[Math.floor(Math.random() * appearances.length)],
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        meetingLocation: locations[Math.floor(Math.random() * locations.length)],
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        connectionType: connections[Math.floor(Math.random() * connections.length)]
      };
      
      setAiSoulmate(newSoulmate);
      
      toast({
        title: "AI Soulmate Generated",
        description: "Your detailed soulmate profile has been created using advanced cosmic algorithms.",
      });
    } catch (error) {
      console.error('Error generating AI soulmate:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate AI soulmate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">Loading your cosmic forecasts...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Love Forecasts</h1>
          <p className="text-muted-foreground">Please sign in to access your personalized love forecasts.</p>
          <Link to="/auth">
            <Button variant="cosmic">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasAccess('love_forecasts')) {
    const trialDaysLeft = trial_end ? Math.ceil((new Date(trial_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Crown className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Premium Feature</h1>
          </div>
          
          {trialDaysLeft > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Your trial has ended. Upgrade to Premium to continue accessing Love Forecasts with Soulmate Sketches.</p>
              <Button variant="cosmic" size="lg" className="gap-2">
                <Crown className="h-5 w-5" />
                Upgrade to Premium
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Love Forecasts with AI Soulmate Sketches are a Premium feature.</p>
              <p className="text-sm text-green-600">✨ Start your 15-day FREE trial!</p>
              <Button variant="cosmic" size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Free Trial
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Daily Life Forecasts
          </h1>
          <p className="text-muted-foreground text-lg">
            Love, Career & Finance predictions aligned with cosmic energies
          </p>
        </div>

        {forecast && (
          <>
            {/* Love Forecast */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-pink-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-pink-600" />
                  Love & Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Energy Level:</span>
                  <Progress value={forecast.love_score * 10} className="flex-1" />
                  <span className={`text-2xl font-bold ${getScoreColor(forecast.love_score)}`}>
                    {forecast.love_score}/10
                  </span>
                </div>
                <p className="text-muted-foreground">{forecast.love_advice}</p>
                {forecast.lucky_love_time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-pink-600" />
                    Lucky time for love: {forecast.lucky_love_time}
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                    <h4 className="font-semibold text-pink-700 dark:text-pink-300">Soulmate Features</h4>
                    <Crown className="h-4 w-4 text-amber-500" />
                  </div>
                  
                  {forecast.soulmate_sketch && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Your Soulmate Sketch</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">{forecast.soulmate_sketch}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Dialog onOpenChange={(open) => {
                      if (open && !aiSoulmate) {
                        generateAISoulmate();
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate Detailed AI Soulmate Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Your AI-Generated Soulmate Profile
                          </DialogTitle>
                        </DialogHeader>
                        {generatingAI ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Creating your perfect soulmate profile...</p>
                          </div>
                        ) : aiSoulmate ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-gradient-cosmic rounded-lg text-primary-foreground">
                              <h4 className="font-semibold mb-2">Physical Appearance</h4>
                              <p className="text-primary-foreground/90">{aiSoulmate.appearance}</p>
                            </div>
                            
                            <div className="p-4 bg-gradient-gold/20 rounded-lg">
                              <h4 className="font-semibold mb-2">Personality & Interests</h4>
                              <p className="text-foreground/80">{aiSoulmate.personality}</p>
                            </div>
                            
                            <div className="p-4 bg-accent/20 rounded-lg">
                              <h4 className="font-semibold mb-2">How You'll Meet</h4>
                              <p className="text-foreground/80">{aiSoulmate.meetingLocation}</p>
                            </div>
                            
                            <div className="p-4 bg-primary/10 rounded-lg">
                              <h4 className="font-semibold mb-2">Timeline</h4>
                              <p className="text-foreground/80">{aiSoulmate.timeframe}</p>
                            </div>
                            
                            <div className="p-4 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                              <h4 className="font-semibold mb-2">Connection Type</h4>
                              <p className="text-foreground/80">{aiSoulmate.connectionType}</p>
                            </div>
                            
                            <p className="text-xs text-muted-foreground text-center mt-4">
                              Generated using advanced AI algorithms and cosmic data analysis
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Click "Generate" to create your soulmate profile</p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Forecast */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Career & Professional Life
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Energy Level:</span>
                  <Progress value={forecast.career_score * 10} className="flex-1" />
                  <span className={`text-2xl font-bold ${getScoreColor(forecast.career_score)}`}>
                    {forecast.career_score}/10
                  </span>
                </div>
                <p className="text-muted-foreground">{forecast.career_advice}</p>
              </CardContent>
            </Card>

            {/* Finance Forecast */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Finance & Wealth
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Energy Level:</span>
                  <Progress value={forecast.finance_score * 10} className="flex-1" />
                  <span className={`text-2xl font-bold ${getScoreColor(forecast.finance_score)}`}>
                    {forecast.finance_score}/10
                  </span>
                </div>
                <p className="text-muted-foreground">{forecast.finance_advice}</p>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={generateNewForecast} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Get New Forecast
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoveForecasts;