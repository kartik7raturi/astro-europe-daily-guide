import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp,
  Briefcase,
  DollarSign,
  Target,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowLeft,
  Calendar,
  Loader2,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  email: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface LifeCareerAnalysis {
  lifePathInsights: string;
  careerPredictions: string;
  financialOutlook: string;
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
  timingPredictions: {
    nextThreeMonths: string;
    nextSixMonths: string;
    nextYear: string;
    nextTwoYears: string;
    nextFiveYears: string;
  };
}

const LifeCareerAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [analysis, setAnalysis] = useState<LifeCareerAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile && !error) {
        const userData = {
          name: profile.full_name,
          email: user.email || '',
          dateOfBirth: new Date(profile.date_of_birth),
          timeOfBirth: profile.time_of_birth || '',
          placeOfBirth: profile.place_of_birth
        };
        setUserData(userData);
        
        // Load existing analysis
        await loadExistingAnalysis();
      } else {
        toast({
          title: "Profile Required",
          description: "Please complete your profile first",
          variant: "destructive",
        });
        navigate("/horoscope");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAnalysis = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('life_career_analysis')
        .select('*')
        .eq('user_id', user.id)
        .eq('analysis_date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (data && !error) {
        setAnalysis({
          lifePathInsights: data.life_path_insights,
          careerPredictions: data.career_predictions,
          financialOutlook: data.financial_outlook,
          opportunities: data.opportunities as string[],
          challenges: data.challenges as string[],
          recommendations: data.recommendations as string[],
          timingPredictions: data.timing_predictions as {
            nextThreeMonths: string;
            nextSixMonths: string;
            nextYear: string;
            nextTwoYears: string;
            nextFiveYears: string;
          }
        });
      }
    } catch (error) {
      console.error('Error loading existing analysis:', error);
    }
  };

  const generateAnalysis = async () => {
    if (!userData || !user) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('life-career-analysis', {
        body: { userData }
      });

      if (error) {
        throw error;
      }

      setAnalysis(data);
      toast({
        title: "Analysis Generated!",
        description: "Your life & career analysis has been created successfully",
      });
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your analysis...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <div className="w-24"></div>
        </div>

        {/* User Info */}
        <Card className="bg-gradient-cosmic p-6 mb-8 border-none">
          <div className="text-center text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">
              Life & Career Analysis
            </h1>
            <p className="text-primary-foreground/90">
              Welcome, {userData.name} • {userData.placeOfBirth}
            </p>
          </div>
        </Card>

        {!analysis ? (
          <Card className="text-center p-8">
            <CardContent>
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Generate Your Life & Career Analysis</h2>
              <p className="text-muted-foreground mb-6">
                Get detailed insights into your life path, career opportunities, and future predictions
                based on Indian astrological wisdom and your birth chart.
              </p>
              <Button 
                onClick={generateAnalysis} 
                disabled={generating}
                className="bg-gradient-cosmic text-primary-foreground"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Generate Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Life Path Insights */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Life Path Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{analysis.lifePathInsights}</p>
              </CardContent>
            </Card>

            {/* Career Predictions */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-blue-400" />
                  Career Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{analysis.careerPredictions}</p>
              </CardContent>
            </Card>

            {/* Financial Outlook */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-400" />
                  Financial Outlook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{analysis.financialOutlook}</p>
              </CardContent>
            </Card>

            {/* Opportunities & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border-green-400/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="border-green-400/40 text-green-400 mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-foreground text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-orange-400/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="border-orange-400/40 text-orange-400 mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="text-foreground text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-0.5 min-w-fit">
                        {index + 1}
                      </Badge>
                      <span className="text-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timing Predictions */}
            <Card className="bg-gradient-gold/10 border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Timing Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-accent mb-2">Next 3 Months</h4>
                    <p className="text-sm text-foreground">{analysis.timingPredictions.nextThreeMonths}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">Next 6 Months</h4>
                    <p className="text-sm text-foreground">{analysis.timingPredictions.nextSixMonths}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">Next Year</h4>
                    <p className="text-sm text-foreground">{analysis.timingPredictions.nextYear}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">Next 2 Years</h4>
                    <p className="text-sm text-foreground">{analysis.timingPredictions.nextTwoYears}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-accent mb-2">Next 5 Years</h4>
                  <p className="text-foreground">{analysis.timingPredictions.nextFiveYears}</p>
                </div>
              </CardContent>
            </Card>

            {/* Regenerate Button */}
            <div className="text-center">
              <Button 
                onClick={generateAnalysis} 
                disabled={generating}
                variant="outline"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Generate New Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeCareerAnalysis;