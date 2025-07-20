import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, DollarSign, Clock, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoveForecast {
  love_score: number;
  career_score: number;
  finance_score: number;
  love_advice: string;
  career_advice: string;
  finance_advice: string;
  lucky_love_time: string;
}

const LoveForecasts = () => {
  const [forecast, setForecast] = useState<LoveForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTodayForecast();
  }, []);

  const loadTodayForecast = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('love_forecasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const loveScore = Math.floor(Math.random() * 10) + 1;
      const careerScore = Math.floor(Math.random() * 10) + 1;
      const financeScore = Math.floor(Math.random() * 10) + 1;
      
      const loveAdvice = getLoveAdvice(loveScore);
      const careerAdvice = getCareerAdvice(careerScore);
      const financeAdvice = getFinanceAdvice(financeScore);
      
      const luckyTimes = ['08:00', '11:30', '14:20', '17:45', '20:15'];
      const luckyTime = luckyTimes[Math.floor(Math.random() * luckyTimes.length)];

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
          lucky_love_time: luckyTime
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">Loading your cosmic forecasts...</div>
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