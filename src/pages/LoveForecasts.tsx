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
import soulmateTemplate from "@/assets/soulmate-sketch-realistic.jpg";

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
      // Get user's astrological data for personalized generation
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, date_of_birth, time_of_birth, place_of_birth, gender')
        .eq('user_id', user.id)
        .single();

      if (!profileData || !profileData.full_name || !profileData.date_of_birth || !profileData.gender) {
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile with gender information first to generate a personalized soulmate.",
          variant: "destructive"
        });
        setGeneratingAI(false);
        return;
      }

      // Calculate user's zodiac sign for personalized matching
      const birthDate = new Date(profileData.date_of_birth);
      const zodiacSign = getZodiacSign(birthDate);
      
      // Generate astrologically compatible appearance based on user's sign and opposite gender
      const userGender = profileData.gender;
      const soulmateGender = userGender === 'male' ? 'female' : 'male';
      const appearances = getCompatibleAppearances(zodiacSign, soulmateGender);
      const personalities = getCompatiblePersonalities(zodiacSign);
      const locations = getCompatibleMeetingPlaces(zodiacSign);
      const timeframes = getCompatibleTimeframes(zodiacSign);
      const connections = getCompatibleConnections(zodiacSign);
      
      // Create personalized appearance description based on user's name and birth data
      const selectedAppearance = appearances[Math.floor(Math.random() * appearances.length)];
      
      // Generate unique AI image based on user's profile with opposite gender
      const genderPrompt = soulmateGender === 'female' ? 'beautiful woman' : 'handsome man';
      const imagePrompt = `${genderPrompt}, ${selectedAppearance}, ${zodiacSign} energy, soulmate for ${profileData.full_name}, born ${birthDate.toDateString()}`;
      
      console.log('Generating AI soulmate image with prompt:', imagePrompt);
      
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-soulmate-image', {
        body: { prompt: imagePrompt }
      });

      if (imageError) {
        console.error('Error generating image:', imageError);
        throw new Error('Failed to generate unique soulmate image');
      }

      const newSoulmate: SoulmateProfile = {
        appearance: selectedAppearance,
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        meetingLocation: locations[Math.floor(Math.random() * locations.length)],
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        connectionType: connections[Math.floor(Math.random() * connections.length)],
        sketchUrl: imageData?.image || soulmateTemplate
      };
      
      setAiSoulmate(newSoulmate);
      
      toast({
        title: "AI Soulmate Generated",
        description: `Your personalized ${soulmateGender} ${zodiacSign} soulmate profile has been created using your birth data.`,
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

  const getCompatibleAppearances = (zodiacSign: string, gender: string): string[] => {
    const femaleAppearances: Record<string, string[]> = {
      "Aries": ["athletic build with fiery red hair and determined green eyes", "strong facial features with dark hair and passionate brown eyes"],
      "Taurus": ["curvaceous build with warm brown hair and gentle earth-toned eyes", "elegant posture with rich auburn hair and stable brown eyes"],
      "Gemini": ["slender build with playful blonde hair and curious blue eyes", "expressive features with light brown hair and sparkling hazel eyes"],
      "Cancer": ["soft feminine features with silver-blonde hair and emotional blue eyes", "nurturing appearance with dark hair and caring brown eyes"],
      "Leo": ["regal bearing with golden hair and confident amber eyes", "dramatic features with flowing mane and proud golden eyes"],
      "Virgo": ["refined features with neat brown hair and intelligent green eyes", "graceful build with organized blonde hair and analytical blue eyes"],
      "Libra": ["harmonious features with balanced blonde hair and charming blue eyes", "elegant build with flowing hair and diplomatic brown eyes"],
      "Scorpio": ["intense features with mysterious dark hair and penetrating dark eyes", "magnetic presence with black hair and hypnotic hazel eyes"],
      "Sagittarius": ["adventurous build with wild brown hair and optimistic blue eyes", "free-spirited appearance with auburn hair and wanderlust green eyes"],
      "Capricorn": ["distinguished features with professional brown hair and ambitious dark eyes", "structured build with sophisticated hair and determined grey eyes"],
      "Aquarius": ["unique features with unconventional hair colors and electric blue eyes", "progressive appearance with silver hair and innovative grey eyes"],
      "Pisces": ["dreamy features with flowing sea-green hair and mystical blue eyes", "ethereal build with silver-blonde hair and compassionate violet eyes"]
    };

    const maleAppearances: Record<string, string[]> = {
      "Aries": ["muscular build with fiery red hair and determined green eyes", "strong jawline with dark hair and passionate brown eyes"],
      "Taurus": ["sturdy build with warm brown hair and gentle earth-toned eyes", "broad shoulders with rich auburn hair and stable brown eyes"],
      "Gemini": ["lean build with sandy blonde hair and curious blue eyes", "expressive features with light brown hair and sparkling hazel eyes"],
      "Cancer": ["soft masculine features with silver hair and emotional blue eyes", "protective appearance with dark hair and caring brown eyes"],
      "Leo": ["regal bearing with golden hair and confident amber eyes", "dramatic features with thick mane and proud golden eyes"],
      "Virgo": ["refined features with neat brown hair and intelligent green eyes", "athletic build with organized appearance and analytical blue eyes"],
      "Libra": ["harmonious features with balanced hair and charming blue eyes", "elegant build with flowing hair and diplomatic brown eyes"],
      "Scorpio": ["intense features with mysterious dark hair and penetrating dark eyes", "magnetic presence with black hair and hypnotic hazel eyes"],
      "Sagittarius": ["adventurous build with wild brown hair and optimistic blue eyes", "rugged appearance with auburn hair and wanderlust green eyes"],
      "Capricorn": ["distinguished features with professional brown hair and ambitious dark eyes", "structured build with grey-streaked hair and determined grey eyes"],
      "Aquarius": ["unique features with unconventional hair colors and electric blue eyes", "progressive appearance with silver hair and innovative grey eyes"],
      "Pisces": ["dreamy features with flowing hair and mystical blue eyes", "ethereal build with silver-blonde hair and compassionate violet eyes"]
    };

    const appearances = gender === 'female' ? femaleAppearances : maleAppearances;
    return appearances[zodiacSign] || appearances["Aries"];
  };

  const getCompatiblePersonalities = (zodiacSign: string): string[] => {
    const personalities: Record<string, string[]> = {
      "Aries": ["bold leader with passionate energy for new adventures", "competitive spirit with a heart full of courage and determination"],
      "Taurus": ["reliable soul with deep appreciation for beauty and comfort", "patient nature with strong values and love for simple pleasures"],
      "Gemini": ["curious mind with witty conversation and adaptable nature", "social butterfly with intellectual interests and communication skills"],
      "Cancer": ["nurturing heart with deep emotional intelligence and intuition", "family-oriented soul with protective instincts and empathy"],
      "Leo": ["confident performer with generous heart and creative spirit", "charismatic leader with warm personality and dramatic flair"],
      "Virgo": ["analytical mind with helpful nature and attention to detail", "practical soul with organizational skills and desire to serve"],
      "Libra": ["diplomatic peacemaker with artistic eye and social grace", "harmonious spirit with desire for balance and beautiful partnerships"],
      "Scorpio": ["intense soul with transformative power and mysterious depth", "passionate nature with investigative mind and emotional intensity"],
      "Sagittarius": ["adventurous philosopher with optimistic worldview and freedom-loving spirit", "truth-seeking wanderer with philosophical mind and humor"],
      "Capricorn": ["ambitious achiever with disciplined approach and traditional values", "responsible leader with practical wisdom and long-term vision"],
      "Aquarius": ["innovative humanitarian with unique perspective and progressive ideals", "independent thinker with eccentric interests and social consciousness"],
      "Pisces": ["compassionate dreamer with artistic soul and spiritual depth", "intuitive empath with imaginative mind and selfless nature"]
    };
    return personalities[zodiacSign] || personalities["Aries"];
  };

  const getCompatibleMeetingPlaces = (zodiacSign: string): string[] => {
    const locations: Record<string, string[]> = {
      "Aries": ["at a sports competition where you're both cheering for the same team", "during an adventure race or hiking trail"],
      "Taurus": ["at a farmers market where you both reach for the same fresh flowers", "in a cozy restaurant with amazing food"],
      "Gemini": ["at a bookstore café during a literary discussion", "at a networking event with interesting conversations"],
      "Cancer": ["at a family gathering or community event", "volunteering at a local charity or animal shelter"],
      "Leo": ["at a theater performance or art gallery opening", "at a luxury resort or upscale social event"],
      "Virgo": ["at a health food store or wellness workshop", "during a volunteer project for environmental causes"],
      "Libra": ["at an art museum or classical music concert", "at a wedding or elegant social gathering"],
      "Scorpio": ["at a mystery book club or psychology seminar", "during a deep spiritual retreat or transformation workshop"],
      "Sagittarius": ["at an international travel expo or cultural festival", "during a philosophy class or adventure travel"],
      "Capricorn": ["at a professional conference or business networking event", "at a historical museum or traditional cultural site"],
      "Aquarius": ["at a technology conference or humanitarian cause", "during a progressive political rally or innovation meetup"],
      "Pisces": ["at a spiritual retreat or meditation center", "near water - beach, lake, or aquarium with mystical atmosphere"]
    };
    return locations[zodiacSign] || locations["Aries"];
  };

  const getCompatibleTimeframes = (zodiacSign: string): string[] => {
    const timeframes: Record<string, string[]> = {
      "Aries": ["during spring when your energy is at its peak", "when you're starting a new ambitious project"],
      "Taurus": ["during late spring when nature is in full bloom", "when you're feeling most grounded and stable"],
      "Gemini": ["during early summer when social activity peaks", "when you're exploring new learning opportunities"],
      "Cancer": ["during summer when family connections are strong", "around a full moon when emotions run deep"],
      "Leo": ["during peak summer when you're radiating confidence", "during a celebration where you're being honored"],
      "Virgo": ["during late summer when you're organizing your life", "when you're focused on health and self-improvement"],
      "Libra": ["during autumn when balance and harmony are emphasized", "when you're attending cultural or social events"],
      "Scorpio": ["during late autumn when transformation energy is strong", "when you're going through a period of personal growth"],
      "Sagittarius": ["during your birthday season when adventure calls", "when you're planning or taking a significant journey"],
      "Capricorn": ["during winter when you're focused on goals", "when you're achieving a major career milestone"],
      "Aquarius": ["during late winter when innovation energy peaks", "when you're involved in humanitarian or progressive causes"],
      "Pisces": ["during early spring when intuition is heightened", "when you're in a period of spiritual or artistic awakening"]
    };
    return timeframes[zodiacSign] || timeframes["Aries"];
  };

  const getCompatibleConnections = (zodiacSign: string): string[] => {
    const connections: Record<string, string[]> = {
      "Aries": ["an instant spark of competitive chemistry and mutual respect", "a bold attraction that challenges you both to grow"],
      "Taurus": ["a slow-building, steady connection that feels like home", "a sensual chemistry combined with emotional security"],
      "Gemini": ["an intellectual connection through witty conversation and shared curiosity", "a playful friendship that evolves into deeper understanding"],
      "Cancer": ["an emotional bond that feels like you've known each other forever", "a nurturing connection with deep family-like comfort"],
      "Leo": ["a dramatic, passionate romance with mutual admiration", "a creative partnership where you inspire each other's talents"],
      "Virgo": ["a practical connection built on shared values and goals", "a supportive relationship where you help each other improve"],
      "Libra": ["a harmonious balance where you complement each other perfectly", "an aesthetic and romantic connection with natural partnership energy"],
      "Scorpio": ["an intense, transformative bond with magnetic attraction", "a deep psychological connection with unspoken understanding"],
      "Sagittarius": ["an adventurous partnership with shared philosophical ideals", "a free-spirited connection that encourages mutual growth"],
      "Capricorn": ["a mature, stable connection with shared ambitions", "a traditional courtship that builds into lasting commitment"],
      "Aquarius": ["an unconventional friendship that breaks all the rules", "an innovative partnership where you create positive change together"],
      "Pisces": ["a mystical, spiritual connection that transcends the physical", "an empathetic bond where you understand each other's deepest feelings"]
    };
    return connections[zodiacSign] || connections["Aries"];
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
                            {/* Soulmate Sketch */}
                            {aiSoulmate.sketchUrl && (
                              <div className="text-center mb-6">
                                <h4 className="font-semibold mb-4 flex items-center justify-center gap-2">
                                  <Heart className="h-4 w-4 text-primary" />
                                  Your Soulmate Sketch
                                </h4>
                                 <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
                                   <img 
                                     src={aiSoulmate.sketchUrl} 
                                     alt="AI Generated Soulmate Portrait" 
                                     className="w-full h-full object-cover"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                 </div>
                                 <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mt-3">
                                   <p className="text-xs text-amber-800 dark:text-amber-200 text-center flex items-center justify-center gap-1">
                                     <span className="text-amber-600">⚠️</span>
                                     This AI-generated portrait is created using your name, gender, and birth date for personalized astrological compatibility. For entertainment purposes only.
                                   </p>
                                 </div>
                              </div>
                            )}
                            
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