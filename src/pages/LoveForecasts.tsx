import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, TrendingUp, DollarSign, Clock, RefreshCw, Crown, Sparkles, Wand2, Share2, Twitter, Facebook, Copy, Briefcase, CreditCard, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useCredits } from "@/hooks/useCredits";
import { Link } from "react-router-dom";
import soulmateTemplate from "@/assets/soulmate-sketch-realistic.jpg";
import SocialShare from "@/components/SocialShare";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  sketchUrl?: string;
}

const LoveForecasts = () => {
  const [forecast, setForecast] = useState<LoveForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSoulmate, setAiSoulmate] = useState<SoulmateProfile | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAccess, subscribed, loading: subscriptionLoading } = useSubscription();
  const { credits, loading: creditsLoading, useCredit, getCreditPackages } = useCredits();

  useEffect(() => {
    loadTodayForecast();
  }, []);

  const loadTodayForecast = async () => {
    try {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Parallel queries for faster loading
      const [forecastResult, profileResult] = await Promise.all([
        supabase
          .from('love_forecasts')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      const { data, error } = forecastResult;
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading forecast:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setForecast(data);
        setLoading(false);
      } else {
        // Generate in background without blocking UI
        setLoading(false);
        generatePersonalizedForecast(profileResult.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const generatePersonalizedForecast = async (profile: any) => {
    try {
      if (!user) return;

      // Generate personalized forecast based on user's profile
      let loveScore, careerScore, financeScore;
      let loveAdvice, careerAdvice, financeAdvice;

      if (profile && profile.date_of_birth && profile.full_name && profile.place_of_birth) {
        // Calculate personalized scores based on birth data
        const birthDate = new Date(profile.date_of_birth);
        const zodiacSign = getZodiacSign(birthDate);
        const nameNumerology = calculateNameNumerology(profile.full_name);
        const dayOfYear = getDayOfYear(new Date());

        // Generate scores based on astrological calculations
        loveScore = Math.floor((nameNumerology + dayOfYear + getZodiacLoveEnergy(zodiacSign)) % 10) + 1;
        careerScore = Math.floor((nameNumerology * 2 + dayOfYear + getZodiacCareerEnergy(zodiacSign)) % 10) + 1;
        financeScore = Math.floor((nameNumerology * 3 + dayOfYear + getZodiacFinanceEnergy(zodiacSign)) % 10) + 1;

        loveAdvice = getPersonalizedLoveAdvice(loveScore, zodiacSign);
        careerAdvice = getPersonalizedCareerAdvice(careerScore, zodiacSign);
        financeAdvice = getPersonalizedFinanceAdvice(financeScore, zodiacSign);
      } else {
        // Fallback to random if profile incomplete
        loveScore = Math.floor(Math.random() * 10) + 1;
        careerScore = Math.floor(Math.random() * 10) + 1;
        financeScore = Math.floor(Math.random() * 10) + 1;
        loveAdvice = getLoveAdvice(loveScore);
        careerAdvice = getCareerAdvice(careerScore);
        financeAdvice = getFinanceAdvice(financeScore);
      }
      
      const luckyTimes = ['06:30', '09:15', '12:30', '15:45', '18:20', '21:00'];
      const luckyTime = luckyTimes[Math.floor(Math.random() * luckyTimes.length)];

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
        title: "Today's Personal Forecast Ready!",
        description: "Your personalized daily cosmic predictions are ready!"
      });
    } catch (error) {
      console.error('Error generating forecast:', error);
    }
  };

  const calculateNameNumerology = (name: string): number => {
    const values = { a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9, j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9, s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8 };
    let sum = 0;
    for (let char of name.toLowerCase()) {
      sum += values[char] || 0;
    }
    return sum % 9 || 9;
  };

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getZodiacSign = (birthDate: Date): string => {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  const getZodiacLoveEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "Aries": 8, "Taurus": 7, "Gemini": 6,
      "Cancer": 9, "Leo": 8, "Virgo": 5,
      "Libra": 9, "Scorpio": 8, "Sagittarius": 7,
      "Capricorn": 6, "Aquarius": 5, "Pisces": 9
    };
    return energies[sign] || 7;
  };

  const getZodiacCareerEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "Aries": 9, "Taurus": 8, "Gemini": 7,
      "Cancer": 6, "Leo": 9, "Virgo": 8,
      "Libra": 7, "Scorpio": 8, "Sagittarius": 8,
      "Capricorn": 9, "Aquarius": 7, "Pisces": 6
    };
    return energies[sign] || 7;
  };

  const getZodiacFinanceEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "Aries": 7, "Taurus": 9, "Gemini": 6,
      "Cancer": 7, "Leo": 8, "Virgo": 8,
      "Libra": 7, "Scorpio": 9, "Sagittarius": 7,
      "Capricorn": 9, "Aquarius": 6, "Pisces": 6
    };
    return energies[sign] || 7;
  };

  const generateSoulmateSketch = () => {
    const features = [
      "Deep, emotional eyes that sparkle with kindness",
      "A smile that lights up their face",
      "An aura of creativity and intelligence",
      "A balanced traditional and modern appearance",
      "Confident yet approachable personality"
    ];
    
    const locations = [
      "at a spiritual or peaceful place",
      "in a library or educational institution",
      "at an art exhibition or cultural event",
      "in a quiet garden or park",
      "at a festival or community gathering"
    ];

    const selectedFeatures = features.slice(0, 2 + Math.floor(Math.random() * 2));
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return `Your soulmate will have ${selectedFeatures.join(', ')}. The stars indicate you will meet ${location}. They will balance your energy and share your deep values.`;
  };

  const getPersonalizedLoveAdvice = (score: number, zodiacSign: string) => {
    const advice: Record<string, Record<number, string>> = {
      "Aries": {
        8: "Powerful love energy today! Open your heart to new relationships or deepen existing bonds.",
        6: "Love flows gently today. Perfect time for heartfelt conversations and small gestures.",
        4: "Love requires patience today. Focus on self-love and inner harmony."
      },
      "Taurus": {
        8: "Your natural charm attracts genuine connections today. Trust your instincts in love.",
        6: "Stable romantic energy supports long-term relationship building. Take it slow.",
        4: "Focus on personal growth and self-worth. Love will follow naturally."
      }
      // Add more zodiac signs as needed
    };
    
    return advice[zodiacSign]?.[Math.floor(score/2)*2 + 4] || "Love surrounds you today, just open your heart to recognize it.";
  };

  const getPersonalizedCareerAdvice = (score: number, zodiacSign: string) => {
    if (score >= 8) return "Excellent career momentum today! Take bold steps on important projects and seize opportunities.";
    if (score >= 6) return "Steady progress in professional life. Collaboration and networking will be highly beneficial.";
    if (score >= 4) return "Focus on planning and organization today. Lay the foundation for future opportunities.";
    return "A day for patience in professional matters. Avoid major decisions and focus on skill development.";
  };

  const getPersonalizedFinanceAdvice = (score: number, zodiacSign: string) => {
    if (score >= 8) return "Financial opportunities may present themselves! Trust your intuition in money matters and investments.";
    if (score >= 6) return "Stable financial energy. Good time for budgeting and planning future investments wisely.";
    if (score >= 4) return "Practice restraint in spending today. Focus on savings and avoid unnecessary purchases.";
    return "Practice financial mindfulness. Review your expenses and create a sustainable budget plan.";
  };

  const getLoveAdvice = (score: number) => {
    if (score >= 8) return "Love energy is powerful today! Open your heart to new connections.";
    if (score >= 6) return "Romance flows gently today. Perfect time for heartfelt conversations.";
    if (score >= 4) return "Love requires patience today. Focus on self-love.";
    return "Cosmic energies suggest taking time for self-reflection.";
  };

  const getCareerAdvice = (score: number) => {
    if (score >= 8) return "Career momentum is strong! Take bold action on important projects.";
    if (score >= 6) return "Steady progress in your professional life. Collaboration will be beneficial.";
    if (score >= 4) return "Focus on organization and planning today.";
    return "A day for patience in professional matters.";
  };

  const getFinanceAdvice = (score: number) => {
    if (score >= 8) return "Financial opportunities may present themselves!";
    if (score >= 6) return "Steady financial energy. Good time for budgeting.";
    if (score >= 4) return "Be conservative with spending today.";
    return "Practice financial mindfulness.";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const generateAISoulmate = async () => {
    if (!user) return;
    
    // Check if user has credits
    if (credits <= 0) {
      toast({
        title: "No Credits Available",
        description: "Please purchase credits to generate AI soulmate profiles.",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingAI(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, date_of_birth, time_of_birth, place_of_birth, gender')
        .eq('user_id', user.id)
        .single();

      if (!profileData || !profileData.full_name || !profileData.date_of_birth || !profileData.gender) {
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile with gender information first.",
          variant: "destructive"
        });
        setGeneratingAI(false);
        return;
      }

      const birthDate = new Date(profileData.date_of_birth);
      const zodiacSign = getZodiacSign(birthDate);
      
      const userGender = profileData.gender;
      const soulmateGender = userGender === 'male' ? 'female' : 'male';
      const appearances = getCompatibleAppearances(zodiacSign, soulmateGender);
      const personality = getCompatiblePersonality(zodiacSign);
      const meetingLocation = getMeetingPrediction(zodiacSign);
      const timeframe = getTimingPrediction(birthDate);
      const connectionType = getConnectionType(zodiacSign);

      const selectedAppearance = appearances[Math.floor(Math.random() * appearances.length)];
      
      // Generate AI soulmate image
      console.log('Generating AI soulmate image...');
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-soulmate-image', {
        body: { 
          prompt: `${soulmateGender} with ${selectedAppearance}, ${personality}, Indian features`
        }
      });

      if (imageError) {
        console.error('Error generating soulmate image:', imageError);
        toast({
          title: "Image Generation Failed",
          description: "Using default template. Please try again.",
          variant: "destructive"
        });
      }

      const newSoulmate: SoulmateProfile = {
        appearance: selectedAppearance,
        personality,
        meetingLocation,
        timeframe,
        connectionType,
        sketchUrl: imageData?.image || soulmateTemplate
      };
      
      setAiSoulmate(newSoulmate);

      // Use 10 credits for soulmate generation (as this is a premium AI feature)
      if (credits < 10) {
        toast({
          title: "Insufficient Credits",
          description: "You need 10 credits to generate an AI soulmate. Please purchase more credits.",
          variant: "destructive"
        });
        setGeneratingAI(false);
        return;
      }
      
      // Deduct 10 credits
      for (let i = 0; i < 10; i++) {
        const creditUsed = await useCredit('soulmate_generation');
        if (!creditUsed && i === 0) {
          setGeneratingAI(false);
          return;
        }
      }

      // Save to soulmate readings
      await supabase.from('soulmate_readings').insert({
        user_id: user.id,
        soulmate_description: JSON.stringify(newSoulmate),
        love_percentage: Math.floor(Math.random() * 30) + 70,
        generation_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "AI Soulmate Generated!",
        description: `Your personalized ${soulmateGender} ${zodiacSign} soulmate profile has been created.`,
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

  const getCompatibleAppearances = (zodiacSign: string, gender: string) => {
    const appearances = {
      male: [
        "Tall and athletic build with warm brown eyes",
        "Medium height with a charming smile and gentle demeanor",
        "Strong jawline with expressive dark eyes and wavy hair",
        "Lean build with intelligent eyes and a thoughtful expression"
      ],
      female: [
        "Graceful height with sparkling eyes and flowing hair",
        "Petite frame with a radiant smile and confident posture",
        "Medium build with expressive eyes and elegant features",
        "Tall and elegant with striking features and natural beauty"
      ]
    };
    return appearances[gender as keyof typeof appearances] || appearances.female;
  };

  const getCompatiblePersonality = (zodiacSign: string) => {
    const personalities = [
      "Kind-hearted and empathetic with a great sense of humor",
      "Intelligent and ambitious yet down-to-earth and caring",
      "Creative and passionate with strong family values",
      "Loyal and supportive with a positive outlook on life"
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
  };

  const getMeetingPrediction = (zodiacSign: string) => {
    const locations = [
      "through mutual friends at a social gathering",
      "at a professional networking event or workplace",
      "during a cultural event or community celebration",
      "while pursuing a hobby or educational activity",
      "at a coffee shop or bookstore during a casual outing"
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getTimingPrediction = (birthDate: Date) => {
    const timeframes = [
      "within the next 6 months",
      "in the coming year during a significant life change",
      "within 2 years when you least expect it",
      "soon, possibly within the next few months"
    ];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  };

  const getConnectionType = (zodiacSign: string) => {
    const connections = [
      "An instant spiritual connection that feels like destiny",
      "A gradual friendship that blossoms into deep love",
      "A magnetic attraction with perfect compatibility",
      "A soulmate bond based on shared values and dreams"
    ];
    return connections[Math.floor(Math.random() * connections.length)];
  };

  if (loading || subscriptionLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your cosmic forecast...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Love Forecast
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personalized daily love, career, and finance predictions
          </p>
        </div>

        {/* Credits Display */}
        <div className="mb-8 flex justify-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                Available Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {creditsLoading ? "Loading..." : credits}
              </div>
              <p className="text-xs text-muted-foreground">
                Credits remaining for soulmate generation
              </p>
            </CardContent>
          </Card>
        </div>

        {forecast && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Love Card */}
            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
              <CardHeader className="text-center pb-4">
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Love</CardTitle>
                <div className="text-3xl font-bold">
                  <span className={getScoreColor(forecast.love_score)}>
                    {forecast.love_score}/10
                  </span>
                </div>
                <Progress value={forecast.love_score * 10} className="mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center mb-4">{forecast.love_advice}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Lucky time: {forecast.lucky_love_time}</span>
                </div>
              </CardContent>
            </Card>

            {/* Career Card */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="text-center pb-4">
                <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Career</CardTitle>
                <div className="text-3xl font-bold">
                  <span className={getScoreColor(forecast.career_score)}>
                    {forecast.career_score}/10
                  </span>
                </div>
                <Progress value={forecast.career_score * 10} className="mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center">{forecast.career_advice}</p>
              </CardContent>
            </Card>

            {/* Finance Card */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="text-center pb-4">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Finance</CardTitle>
                <div className="text-3xl font-bold">
                  <span className={getScoreColor(forecast.finance_score)}>
                    {forecast.finance_score}/10
                  </span>
                </div>
                <Progress value={forecast.finance_score * 10} className="mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center">{forecast.finance_advice}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Soulmate Generator */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6" />
              AI Soulmate Generator
            </CardTitle>
            <p className="text-muted-foreground">
              Generate your personalized soulmate profile based on your birth details
            </p>
          </CardHeader>
          <CardContent className="text-center">
            {credits <= 0 && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Purchase credits to generate unlimited AI soulmate sketches! 
                  <br />
                  Starter Pack (₹49) - 10 credits | Popular Pack (₹199) - 60 credits | Premium Pack (₹299) - 120 credits
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={generateAISoulmate}
              disabled={generatingAI || credits <= 0}
              variant="default" 
              size="lg"
              className="gap-2 bg-gradient-cosmic text-white"
            >
              {generatingAI ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate AI Soulmate
                  {credits > 0 && ` (${credits} credits)`}
                </>
              )}
            </Button>

            <Dialog open={!!aiSoulmate} onOpenChange={(open) => !open && setAiSoulmate(null)}>
              {aiSoulmate && (
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">Your AI Soulmate</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {aiSoulmate.sketchUrl && (
                      <div className="text-center">
                        <div className="relative inline-block">
                          <img 
                            src={aiSoulmate.sketchUrl} 
                            alt="AI Generated Soulmate" 
                            className="rounded-lg shadow-lg max-w-xs mx-auto"
                            style={{ maxHeight: '300px', width: 'auto' }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Physical Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{aiSoulmate.appearance}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Personality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{aiSoulmate.personality}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">How You'll Meet</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{aiSoulmate.meetingLocation}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Timing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{aiSoulmate.timeframe}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Connection Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{aiSoulmate.connectionType}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Social Sharing */}
                    <div className="flex justify-center space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>

            {forecast?.soulmate_sketch && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Daily Soulmate Insight</h4>
                <p className="text-sm text-muted-foreground">{forecast.soulmate_sketch}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Forecast
            </Button>
            <Link to="/horoscope">
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">
                <Crown className="mr-2 h-4 w-4" />
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveForecasts;