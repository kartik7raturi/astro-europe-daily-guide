import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Stars, 
  Sun, 
  Moon, 
  Heart, 
  Briefcase, 
  Palette, 
  Hash,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Facebook,
  Download
} from "lucide-react";
import { 
  calculateLifePathNumber, 
  calculateDestinyNumber, 
  getLifePathMeaning, 
  getDailyNumerologyGuidance 
} from "@/utils/numerology";

interface UserData {
  name: string;
  email: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  specificQuestions: string;
}

const DailyReading = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // First check for saved profile data
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
          placeOfBirth: profile.place_of_birth,
          specificQuestions: profile.questions || ''
        };
        setUserData(userData);
      } else {
        // Fallback to localStorage if no profile exists
        const storedData = localStorage.getItem("userAstrologyData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          parsed.dateOfBirth = new Date(parsed.dateOfBirth);
          setUserData(parsed);
        } else {
          // Create default user data if none exists - no need to redirect to form
          const defaultUserData = {
            name: user.email?.split('@')[0] || 'User',
            email: user.email || '',
            dateOfBirth: new Date('1990-01-01'), // Default birth date
            timeOfBirth: '12:00',
            placeOfBirth: 'Unknown',
            specificQuestions: ''
          };
          setUserData(defaultUserData);
          
          // Save default profile to database for future use
          await supabase.from('profiles').upsert({
            user_id: user.id,
            full_name: defaultUserData.name,
            date_of_birth: defaultUserData.dateOfBirth.toISOString().split('T')[0],
            time_of_birth: defaultUserData.timeOfBirth,
            place_of_birth: defaultUserData.placeOfBirth,
            questions: defaultUserData.specificQuestions
          }, {
            onConflict: 'user_id'
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Even on error, provide default data instead of redirecting
      const defaultUserData = {
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        dateOfBirth: new Date('1990-01-01'),
        timeOfBirth: '12:00',
        placeOfBirth: 'Unknown',
        specificQuestions: ''
      };
      setUserData(defaultUserData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your cosmic reading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Calculate numerology numbers
  const lifePathNumber = calculateLifePathNumber(userData.dateOfBirth);
  const destinyNumber = calculateDestinyNumber(userData.name);
  const lifePathMeaning = getLifePathMeaning(lifePathNumber);
  const dailyGuidance = getDailyNumerologyGuidance(lifePathNumber);

  // Calculate age and zodiac sign
  const age = currentDate.getFullYear() - userData.dateOfBirth.getFullYear();
  const birthMonth = userData.dateOfBirth.getMonth() + 1;
  const birthDay = userData.dateOfBirth.getDate();
  
  // Simplified zodiac calculation
  const getZodiacSign = (month: number, day: number) => {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  const zodiacSign = getZodiacSign(birthMonth, birthDay);

  // Generate personalized content based on numerology and Indian sensibilities
  const generateReading = () => {
    const powerColors = ["Deep Royal Purple", "Golden Amber", "Emerald Green", "Sapphire Blue"];
    const selectedColor = powerColors[Math.floor(Math.random() * powerColors.length)];

    return {
      dailyOverview: `Good day, ${userData.name}! Your Life Path Number ${lifePathNumber} combined with your ${zodiacSign} sign reveals important cosmic alignments today. ${dailyGuidance.guidance}`,
      
      love: `With Destiny Number ${destinyNumber}, your romantic energy is ${destinyNumber % 2 === 0 ? 'balanced and harmonious' : 'passionate and dynamic'}. Today favors meaningful connections and heartfelt conversations. Trust your intuition in matters of the heart.`,
      
      career: `Life Path ${lifePathNumber}: ${lifePathMeaning.traits.split(',').slice(0, 2).join(',')}. These qualities serve you well professionally today. Focus on leveraging your natural strengths for career advancement.`,
      
      health: `Your body and mind need balance today. Consider mindful practices rooted in Indian wellness traditions. Listen to your body's wisdom and honor its needs.`,
      
      challenge: dailyGuidance.challenges,
      
      solution: dailyGuidance.solutions,
      
      luckyNumbers: dailyGuidance.luckyNumbers,
      powerColor: selectedColor,
      
      advice: `Life Path ${lifePathNumber} individuals thrive when: ${lifePathMeaning.traits}. Apply these strengths today while being mindful of the challenges identified.`
    };
  };

  const reading = generateReading();

  // Save reading to database
  const saveReading = async () => {
    if (!user) return;
    
    try {
      await supabase.from('daily_readings').upsert({
        user_id: user.id,
        reading_date: currentDate.toISOString().split('T')[0],
        overview: reading.dailyOverview,
        love_guidance: reading.love,
        career_guidance: reading.career,
        health_guidance: reading.health,
        challenges: reading.challenge,
        solutions: reading.solution,
        advice: reading.advice,
        lucky_numbers: reading.luckyNumbers,
        power_colors: [reading.powerColor]
      }, {
        onConflict: 'user_id,reading_date'
      });
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  };

  // Save reading when component loads
  useEffect(() => {
    if (userData) {
      saveReading();
    }
  }, [userData]);

  const shareReading = () => {
    const text = `My daily cosmic reading: ${reading.dailyOverview.substring(0, 100)}... Get yours at ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Daily Cosmic Reading',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const shareOnTwitter = () => {
    const text = `My daily cosmic reading reveals amazing insights! ✨ ${reading.dailyOverview.substring(0, 100)}... #CosmicInsights #Astrology`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/horoscope">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Reading
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{currentDate.toLocaleDateString('en-IN', { 
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
              Welcome, {userData.name}
            </h1>
            <div className="flex justify-center items-center gap-4 text-primary-foreground/90">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                {zodiacSign}
              </Badge>
              <span>•</span>
              <span>{userData.placeOfBirth}</span>
              {userData.timeOfBirth && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {userData.timeOfBirth}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Daily Overview */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-accent" />
              Today's Cosmic Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{reading.dailyOverview}</p>
          </CardContent>
        </Card>

        {/* Lucky Numbers & Power Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Lucky Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {reading.luckyNumbers.map((number, index) => (
                  <Badge key={index} variant="outline" className="text-lg px-3 py-1 border-primary/40">
                    {number}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-accent" />
                Power Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-gold text-accent-foreground">
                {reading.powerColor}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Incorporate this color into your day for enhanced positive energy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Life Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                Love & Relationships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{reading.love}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-400" />
                Career & Finance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{reading.career}</p>
            </CardContent>
          </Card>
        </div>

        {/* Health */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-400" />
              Health & Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{reading.health}</p>
          </CardContent>
        </Card>

        {/* Numerology Insights */}
        <Card className="mb-6 bg-gradient-cosmic/10 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Your Numerology Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Life Path Number: {lifePathNumber}</h4>
              <p className="text-sm text-muted-foreground mb-3">Your Core Traits:</p>
              <p className="text-foreground">{lifePathMeaning.traits}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Destiny Number: {destinyNumber}</h4>
              <p className="text-sm text-muted-foreground">Based on your name ({userData.name}), guiding your life purpose</p>
            </div>
          </CardContent>
        </Card>

        {/* Challenge & Solution */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Today's Challenge (Based on Life Path {lifePathNumber})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">{reading.challenge}</p>
            
            <Separator />
            
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                Numerology-Based Solution
              </h4>
              <p className="text-foreground">{reading.solution}</p>
            </div>
            
            <Separator />
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Ongoing Challenges for Life Path {lifePathNumber}:</h4>
              <p className="text-sm text-foreground">{lifePathMeaning.challenges}</p>
              <h4 className="font-semibold mt-3 mb-2">Long-term Solutions:</h4>
              <p className="text-sm text-foreground">{lifePathMeaning.solutions}</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Advice */}
        <Card className="mb-8 bg-gradient-gold/10 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stars className="h-5 w-5 text-accent" />
              Cosmic Wisdom for Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground font-medium leading-relaxed">{reading.advice}</p>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share Your Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={shareReading} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={shareOnTwitter} className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" onClick={shareOnFacebook} className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Save PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link to="/horoscope">
            <Button variant="cosmic" size="lg">
              Get Another Reading
            </Button>
          </Link>
          <p className="text-muted-foreground text-sm">
            Remember: The stars guide, but you create your destiny. Use this wisdom to enhance your Indian heritage of thoughtfulness and cultural appreciation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyReading;