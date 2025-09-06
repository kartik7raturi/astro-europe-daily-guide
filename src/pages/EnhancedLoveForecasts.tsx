import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, TrendingUp, DollarSign, Clock, RefreshCw, Crown, Sparkles, Wand2, Share2, Twitter, Facebook, Copy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import soulmateTemplate from "@/assets/soulmate-sketch-realistic.jpg";
import SocialShare from "@/components/SocialShare";

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

const EnhancedLoveForecasts = () => {
  const [forecast, setForecast] = useState<LoveForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSoulmate, setAiSoulmate] = useState<SoulmateProfile | null>(null);
  const [soulmateCount, setSoulmateCount] = useState(0);
  const [allowedSoulmates, setAllowedSoulmates] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAccess, subscribed, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    loadTodayForecast();
    loadSoulmateUsage();
  }, []);

  const loadSoulmateUsage = async () => {
    if (!user) return;

    try {
      // Get user's order history to determine allowed soulmate count
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .eq('order_type', 'soulmate_sketches');

      if (error) {
        console.error('Error loading orders:', error);
        return;
      }

      let totalAllowed = 0;
      if (orders && orders.length > 0) {
        orders.forEach(order => {
          const metadata = order.metadata;
          if (metadata && metadata.sketches) {
            totalAllowed += metadata.sketches;
          }
        });
      }

      setAllowedSoulmates(totalAllowed);

      // Count how many soulmates have been generated today
      const today = new Date().toISOString().split('T')[0];
      const { data: soulmateReadings, error: readingsError } = await supabase
        .from('soulmate_readings')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today);

      if (!readingsError && soulmateReadings) {
        setSoulmateCount(soulmateReadings.length);
      }

    } catch (error) {
      console.error('Error loading soulmate usage:', error);
    }
  };

  const loadTodayForecast = async () => {
    try {
      if (!user) return;

      // Get user's profile for personalized reading
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

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
        generatePersonalizedForecast(profile);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
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

      const soulmateSketch = hasAccess('love_forecasts') ? generateIndianSoulmateSketch() : null;

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
        title: "आज का व्यक्तिगत भविष्यफल तैयार है",
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
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "मेष (Aries)";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "वृषभ (Taurus)";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "मिथुन (Gemini)";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "कर्क (Cancer)";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "सिंह (Leo)";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "कन्या (Virgo)";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "तुला (Libra)";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "वृश्चिक (Scorpio)";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "धनु (Sagittarius)";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "मकर (Capricorn)";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "कुंभ (Aquarius)";
    return "मीन (Pisces)";
  };

  const getZodiacLoveEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "मेष (Aries)": 8, "वृषभ (Taurus)": 7, "मिथुन (Gemini)": 6,
      "कर्क (Cancer)": 9, "सिंह (Leo)": 8, "कन्या (Virgo)": 5,
      "तुला (Libra)": 9, "वृश्चिक (Scorpio)": 8, "धनु (Sagittarius)": 7,
      "मकर (Capricorn)": 6, "कुंभ (Aquarius)": 5, "मीन (Pisces)": 9
    };
    return energies[sign] || 7;
  };

  const getZodiacCareerEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "मेष (Aries)": 9, "वृषभ (Taurus)": 8, "मिथुन (Gemini)": 7,
      "कर्क (Cancer)": 6, "सिंह (Leo)": 9, "कन्या (Virgo)": 8,
      "तुला (Libra)": 7, "वृश्चिक (Scorpio)": 8, "धनु (Sagittarius)": 8,
      "मकर (Capricorn)": 9, "कुंभ (Aquarius)": 7, "मीन (Pisces)": 6
    };
    return energies[sign] || 7;
  };

  const getZodiacFinanceEnergy = (sign: string): number => {
    const energies: Record<string, number> = {
      "मेष (Aries)": 7, "वृषभ (Taurus)": 9, "मिथुन (Gemini)": 6,
      "कर्क (Cancer)": 7, "सिंह (Leo)": 8, "कन्या (Virgo)": 8,
      "तुला (Libra)": 7, "वृश्चिक (Scorpio)": 9, "धनु (Sagittarius)": 7,
      "मकर (Capricorn)": 9, "कुंभ (Aquarius)": 6, "मीन (Pisces)": 6
    };
    return energies[sign] || 7;
  };

  const generateIndianSoulmateSketch = () => {
    const features = [
      "गहरी, भावनात्मक आंखें जो दयालुता से चमकती हैं",
      "मुस्कान जो उनके चेहरे को रोशन कर देती है",
      "रचनात्मकता और बुद्धिमत्ता का आभास",
      "पारंपरिक लेकिन आधुनिक रूप",
      "आत्मविश्वास लेकिन सहज व्यक्तित्व"
    ];
    
    const locations = [
      "मंदिर या धार्मिक स्थान पर",
      "पुस्तकालय या शिक्षा संस्थान में",
      "कला प्रदर्शनी या सांस्कृतिक कार्यक्रम में",
      "शांत गार्डन या पार्क में",
      "त्योहार या सामुदायिक समारोह में"
    ];

    const selectedFeatures = features.slice(0, 2 + Math.floor(Math.random() * 2));
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return `आपके जीवनसाथी में ${selectedFeatures.join(', ')} होगी। ग्रह नक्षत्र कहते हैं कि आपकी मुलाकात ${location} होगी। वे आपकी ऊर्जा को संतुलित करेंगे और आपके गहरे मूल्यों को साझा करेंगे।`;
  };

  const getPersonalizedLoveAdvice = (score: number, zodiacSign: string) => {
    const advice: Record<string, Record<number, string>> = {
      "मेष (Aries)": {
        8: "प्रेम की शक्तिशाली ऊर्जा है आज! नए रिश्तों के लिए दिल खोलें या मौजूदा बंधनों को गहरा करें।",
        6: "आज प्रेम धीमी गति से बहेगा। दिल की बातचीत और छोटे इशारों के लिए उत्तम समय है।",
        4: "प्रेम में आज धैर्य की जरूरत। आत्म-प्रेम पर ध्यान दें।"
      }
      // Add more zodiac signs as needed
    };
    
    return advice[zodiacSign]?.[Math.floor(score/2)*2 + 4] || "प्रेम आज आपके आसपास है, बस उसे पहचानने की जरूरत है।";
  };

  const getPersonalizedCareerAdvice = (score: number, zodiacSign: string) => {
    if (score >= 8) return "करियर में आज बहुत अच्छी गति है! महत्वपूर्ण कामों पर साहसिक कदम उठाएं।";
    if (score >= 6) return "व्यावसायिक जीवन में स्थिर प्रगति। सहयोग और नेटवर्किंग फायदेमंद होगी।";
    if (score >= 4) return "आज योजना और संगठन पर ध्यान दें। भविष्य के अवसरों की नींव रखें।";
    return "व्यावसायिक मामलों में धैर्य का दिन। बड़े फैसलों से बचें और कौशल विकास पर ध्यान दें।";
  };

  const getPersonalizedFinanceAdvice = (score: number, zodiacSign: string) => {
    if (score >= 8) return "वित्तीय अवसर आ सकते हैं! पैसे के मामलों में अपने अंतर्ज्ञान पर भरोसा करें।";
    if (score >= 6) return "स्थिर वित्तीय ऊर्जा। बजट और भविष्य के निवेश की योजना बनाने का अच्छा समय।";
    if (score >= 4) return "आज खर्च में संयम बरतें। बचत पर ध्यान दें और अनावश्यक खरीदारी से बचें।";
    return "वित्तीय सचेतता का अभ्यास करें। अपने खर्चों की समीक्षा करें।";
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
    if (!user || !hasAccess('love_forecasts')) return;
    
    // Check if user has remaining soulmate generations
    if (soulmateCount >= allowedSoulmates && allowedSoulmates > 0) {
      toast({
        title: "Generation Limit Reached",
        description: `You have used all ${allowedSoulmates} of your purchased soulmate generations. Please purchase more to continue.`,
        variant: "destructive"
      });
      return;
    }

    if (allowedSoulmates === 0) {
      toast({
        title: "Purchase Required",
        description: "Please purchase a soulmate sketch package to generate AI soulmate profiles.",
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
          title: "प्रोफ़ाइल अधूरी है",
          description: "कृपया पहले अपनी प्रोफ़ाइल में लिंग की जानकारी दें।",
          variant: "destructive"
        });
        setGeneratingAI(false);
        return;
      }

      const birthDate = new Date(profileData.date_of_birth);
      const zodiacSign = getZodiacSign(birthDate);
      
      const userGender = profileData.gender;
      const soulmateGender = userGender === 'male' ? 'female' : 'male';
      const appearances = getIndianCompatibleAppearances(zodiacSign, soulmateGender);
      const personalities = getIndianCompatiblePersonalities(zodiacSign);
      const locations = getIndianCompatibleMeetingPlaces(zodiacSign);
      const timeframes = getIndianCompatibleTimeframes(zodiacSign);
      const connections = getIndianCompatibleConnections(zodiacSign);
      
      const selectedAppearance = appearances[Math.floor(Math.random() * appearances.length)];
      
      const genderPrompt = soulmateGender === 'female' ? 'beautiful Indian woman' : 'handsome Indian man';
      const imagePrompt = `${genderPrompt}, ${selectedAppearance}, ${zodiacSign} energy, soulmate for ${profileData.full_name}, born ${birthDate.toDateString()}`;
      
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
      
      // Save to database
      await supabase.from('soulmate_readings').insert({
        user_id: user.id,
        soulmate_description: `${newSoulmate.appearance} - ${newSoulmate.personality}`,
        meeting_place_prediction: newSoulmate.meetingLocation,
        meeting_time_prediction: newSoulmate.timeframe,
        soulmate_sketch_url: newSoulmate.sketchUrl
      });
      
      setAiSoulmate(newSoulmate);
      setSoulmateCount(prev => prev + 1);
      
      toast({
        title: "AI जीवनसाथी तैयार",
        description: `आपका व्यक्तिगत ${soulmateGender === 'female' ? 'महिला' : 'पुरुष'} ${zodiacSign} जीवनसाथी प्रोफ़ाइल बन गया है।`,
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

  const getIndianCompatibleAppearances = (zodiacSign: string, gender: string): string[] => {
    const femaleAppearances: Record<string, string[]> = {
      "मेष (Aries)": ["मजबूत चेहरा काले बालों और तेज भूरी आंखों के साथ", "एथलेटिक बिल्ड गहरे बालों और दृढ़ आंखों के साथ"],
      "वृषभ (Taurus)": ["सुंदर कद गेहुंआ बालों और कोमल भूरी आंखों के साथ", "शालीन रूप सुनहरे बालों के साथ"],
      "मिथुन (Gemini)": ["चंचल चेहरा हल्के बालों और जिज्ञासु आंखों के साथ", "अभिव्यंजक लक्षण भूरे बालों के साथ"],
      "कर्क (Cancer)": ["कोमल स्त्री लक्षण चांदी जैसे बालों के साथ", "पोषणकारी रूप काले बालों और भावुक आंखों के साथ"],
      "सिंह (Leo)": ["शाही रूप सुनहरे बालों और आत्मविश्वास से भरी आंखों के साथ", "नाटकीय लक्षण बहते बालों के साथ"],
      "कन्या (Virgo)": ["परिष्कृत लक्षण साफ भूरे बालों के साथ", "सुंदर बिल्ड व्यवस्थित सुनहरे बालों के साथ"],
      "तुला (Libra)": ["संतुलित लक्षण सुनहरे बालों के साथ", "सुंदर बिल्ड बहते बालों के साथ"],
      "वृश्चिक (Scorpio)": ["गहन लक्षण रहस्यमय काले बालों के साथ", "चुंबकीय उपस्थिति काले बालों के साथ"],
      "धनु (Sagittarius)": ["साहसिक बिल्ड जंगली भूरे बालों के साथ", "स्वतंत्र रूप भूरे बालों के साथ"],
      "मकर (Capricorn)": ["विशिष्ट लक्षण पेशेवर भूरे बालों के साथ", "संरचित बिल्ड परिष्कृत बालों के साथ"],
      "कुंभ (Aquarius)": ["अनोखे लक्षण अपरंपरागत बाल रंगों के साथ", "प्रगतिशील रूप चांदी बालों के साथ"],
      "मीन (Pisces)": ["सपनीले लक्षण समुद्री हरे बालों के साथ", "ईथर बिल्ड चांदी सुनहरे बालों के साथ"]
    };

    const maleAppearances: Record<string, string[]> = {
      "मेष (Aries)": ["मांसपेशियों का निर्माण काले बालों और दृढ़ आंखों के साथ", "मजबूत जबड़ा गहरे बालों के साथ"],
      "वृषभ (Taurus)": ["मजबूत निर्माण गेहुंआ बालों के साथ", "चौड़े कंधे भूरे बालों के साथ"],
      "मिथुन (Gemini)": ["दुबला निर्माण रेतीले सुनहरे बालों के साथ", "अभिव्यंजक लक्षण हल्के भूरे बालों के साथ"],
      "कर्क (Cancer)": ["कोमल मर्दाना लक्षण चांदी बालों के साथ", "सुरक्षात्मक रूप काले बालों के साथ"],
      "सिंह (Leo)": ["शाही रूप सुनहरे बालों के साथ", "नाटकीय लक्षण मोटे बालों के साथ"],
      "कन्या (Virgo)": ["परिष्कृत लक्षण साफ भूरे बालों के साथ", "एथलेटिक बिल्ड व्यवस्थित रूप के साथ"],
      "तुला (Libra)": ["संतुलित लक्षण संतुलित बालों के साथ", "सुंदर निर्माण बहते बालों के साथ"],
      "वृश्चिक (Scorpio)": ["गहन लक्षण रहस्यमय काले बालों के साथ", "चुंबकीय उपस्थिति काले बालों के साथ"],
      "धनु (Sagittarius)": ["साहसिक निर्माण जंगली भूरे बालों के साथ", "असभ्य रूप भूरे बालों के साथ"],
      "मकर (Capricorn)": ["विशिष्ट लक्षण पेशेवर भूरे बालों के साथ", "संरचित निर्माण ग्रे धारीदार बालों के साथ"],
      "कुंभ (Aquarius)": ["अनोखे लक्षण अपरंपरागत बाल रंगों के साथ", "प्रगतिशील रूप चांदी बालों के साथ"],
      "मीन (Pisces)": ["सपनीले लक्षण बहते बालों के साथ", "ईथर निर्माण चांदी सुनहरे बालों के साथ"]
    };

    const appearances = gender === 'female' ? femaleAppearances : maleAppearances;
    return appearances[zodiacSign] || appearances["मेष (Aries)"];
  };

  const getIndianCompatiblePersonalities = (zodiacSign: string): string[] => {
    const personalities: Record<string, string[]> = {
      "मेष (Aries)": ["साहसी नेता जो नए रोमांच के लिए जुनूनी है", "प्रतिस्पर्धी भावना साहस से भरे दिल के साथ"],
      "वृषभ (Taurus)": ["विश्वसनीय आत्मा सुंदरता की गहरी सराहना के साथ", "धैर्यवान स्वभाव मजबूत मूल्यों के साथ"],
      "मिथुन (Gemini)": ["जिज्ञासु मन मजाकिया बातचीत के साथ", "सामाजिक तितली बौद्धिक रुचियों के साथ"],
      "कर्क (Cancer)": ["पोषण करने वाला दिल गहरी भावनात्मक बुद्धिमत्ता के साथ", "पारिवारिक उन्मुख आत्मा सुरक्षात्मक प्रवृत्ति के साथ"],
      "सिंह (Leo)": ["आत्मविश्वास से भरपूर कलाकार उदार दिल के साथ", "करिश्माई नेता गर्म व्यक्तित्व के साथ"],
      "कन्या (Virgo)": ["विश्लेषणात्मक दिमाग सहायक प्रकृति के साथ", "व्यावहारिक आत्मा संगठनात्मक कौशल के साथ"],
      "तुला (Libra)": ["कूटनीतिक शांति बनाने वाला कलात्मक आंख के साथ", "सामंजस्यपूर्ण आत्मा संतुलन की इच्छा के साथ"],
      "वृश्चिक (Scorpio)": ["गहन आत्मा रूपांतरण शक्ति के साथ", "भावुक स्वभाव रहस्यमय गहराई के साथ"],
      "धनु (Sagittarius)": ["साहसिक दार्शनिक आशावादी विश्वदृष्टि के साथ", "सत्य खोजने वाला घुमक्कड़ दार्शनिक दिमाग के साथ"],
      "मकर (Capricorn)": ["महत्वाकांक्षी उपलब्धि हासिल करने वाला अनुशासित दृष्टिकोण के साथ", "जिम्मेदार नेता व्यावहारिक ज्ञान के साथ"],
      "कुंभ (Aquarius)": ["नवाचार मानवतावादी अनोखे दृष्टिकोण के साथ", "स्वतंत्र विचारक सनकी रुचियों के साथ"],
      "मीन (Pisces)": ["दयालु सपने देखने वाला कलात्मक आत्मा के साथ", "सहज empathआध्यात्मिक गहराई के साथ"]
    };
    return personalities[zodiacSign] || personalities["मेष (Aries)"];
  };

  const getIndianCompatibleMeetingPlaces = (zodiacSign: string): string[] => {
    const locations: Record<string, string[]> = {
      "मेष (Aries)": ["किसी खेल प्रतियोगिता में जहाम दोनों एक ही टीम का समर्थन कर रहे हों", "साहसिक दौड़ या ट्रेकिंग के दौरान"],
      "वृषभ (Taurus)": ["फार्मर्स मार्केट में जहाम दोनों ताजे फूलों के लिए पहुंचे हों", "स्वादिष्ट भोजन वाले आरामदायक रेस्तरां में"],
      "मिथुन (Gemini)": ["किताबों की दुकान के कैफे में साहित्यिक चर्चा के दौरान", "दिलचस्प बातचीत वाले नेटवर्किंग इवेंट में"],
      "कर्क (Cancer)": ["पारिवारिक समारोह या सामुदायिक कार्यक्रम में", "स्थानीय चैरिटी या पशु आश्रय में स्वयंसेवा के दौरान"],
      "सिंह (Leo)": ["थिएटर प्रदर्शन या कला गैलरी के उद्घाटन में", "लक्जरी रिसॉर्ट या उच्च स्तरीय सामाजिक कार्यक्रम में"],
      "कन्या (Virgo)": ["हेल्थ फूड स्टोर या वेलनेस वर्कशॉप में", "पर्यावरणीय कारणों के लिए स्वयंसेवी परियोजना के दौरान"],
      "तुला (Libra)": ["संग्रहालय या सांस्कृतिक केंद्र में", "शादी या सामाजिक समारोह में"],
      "वृश्चिक (Scorpio)": ["योग या ध्यान वर्कशॉप में", "मनोविज्ञान या आध्यात्मिक सेमिनार में"],
      "धनु (Sagittarius)": ["यात्रा एजेंसी या हवाई अड्डे में", "दर्शन या आध्यात्म की कक्षा में"],
      "मकर (Capricorn)": ["पेशेवर कॉन्फ्रेंस या कैरियर मेले में", "बिजनेस नेटवर्किंग इवेंट में"],
      "कुंभ (Aquarius)": ["तकनीक सम्मेलन या नवाचार कार्यशाला में", "सामाजिक न्याय या पर्यावरण समूह की बैठक में"],
      "मीन (Pisces)": ["कला स्टूडियो या संगीत कार्यक्रम में", "आध्यात्मिक retreat या मेडिटेशन सेंटर में"]
    };
    return locations[zodiacSign] || locations["मेष (Aries)"];
  };

  const getIndianCompatibleTimeframes = (zodiacSign: string): string[] => {
    return [
      "अगले 6 महीने में दीवाली के त्योहार के दौरान",
      "होली के रंगबिरंगे समय में अगले साल",
      "आने वाले दशहरे की पावन अवधि में",
      "दुर्गा पूजा के दिव्य समय में",
      "गणेश चतुर्थी के शुभ अवसर पर"
    ];
  };

  const getIndianCompatibleConnections = (zodiacSign: string): string[] => {
    return [
      "कर्मिक आत्माओं का मिलन (karmic soul connection)",
      "पूर्वजन्म का रिश्ता (past life bond)",
      "आध्यात्मिक साझेदारी (spiritual partnership)", 
      "दिव्य आशीर्वाद से मिलना (divine blessing connection)",
      "ग्रह नक्षत्रों द्वारा निर्धारित रिश्ता (astrological destined bond)"
    ];
  };

  const shareSoulmate = async () => {
    if (!aiSoulmate) return;
    
    const shareText = `मैंने अपना AI जीवनसाथी बनाया है! ${aiSoulmate.appearance} - ${aiSoulmate.personality}. हमारी मुलाकात ${aiSoulmate.meetingLocation} होगी। #AIजीवनसाथी #ज्योतिष`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'मेरा AI जीवनसाथी',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "कॉपी हो गया!",
        description: "Text copied to clipboard"
      });
    }
  };

  const shareOnTwitter = () => {
    if (!aiSoulmate) return;
    const text = `मैंने अपना AI जीवनसाथी बनाया है! ${aiSoulmate.appearance} - ${aiSoulmate.personality} #AIजीवनसाथी #ज्योतिष`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    if (!aiSoulmate) return;
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your cosmic forecasts...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">प्रेम पूर्वानुमान</h2>
            <p className="text-muted-foreground mb-6">
              अपने प्रेम, करियर और वित्त के पूर्वानुमान देखने के लिए साइन इन करें
            </p>
            <Link to="/auth">
              <Button variant="cosmic">साइन इन करें</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess('love_forecasts')) {
    return (
      <div className="min-h-screen bg-gradient-starlight flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Crown className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">प्रीमियम सुविधा</h2>
            <p className="text-muted-foreground mb-6">
              प्रेम पूर्वानुमान और AI जीवनसाथी प्रोफ़ाइल प्राप्त करने के लिए प्रीमियम में अपग्रेड करें
            </p>
            <Link to="/pricing">
              <Button variant="cosmic">अपग्रेड करें</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            प्रेम पूर्वानुमान
          </h1>
          <p className="text-muted-foreground text-lg">
            आज का आपका व्यक्तिगत प्रेम, करियर और वित्त पूर्वानुमान
          </p>
        </div>

        {/* Soulmate Usage Counter */}
        {allowedSoulmates > 0 && (
          <div className="mb-8 text-center">
            <Card className="inline-block">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  AI जीवनसाथी जनरेशन: {soulmateCount}/{allowedSoulmates} उपयोग किए गए
                </p>
                <Progress value={(soulmateCount / allowedSoulmates) * 100} className="mt-2 w-48" />
              </CardContent>
            </Card>
          </div>
        )}

        {forecast && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Love Card */}
            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
              <CardHeader className="text-center pb-4">
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <CardTitle className="text-lg">प्रेम</CardTitle>
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
                  शुभ समय: {forecast.lucky_love_time}
                </div>
              </CardContent>
            </Card>

            {/* Career Card */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="text-center pb-4">
                <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">करियर</CardTitle>
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
                <CardTitle className="text-lg">वित्त</CardTitle>
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

        {/* AI Soulmate Generation */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">AI जीवनसाथी जेनरेटर</CardTitle>
            </div>
            <p className="text-muted-foreground">
              अपनी जन्म तिथि के आधार पर व्यक्तिगत जीवनसाथी प्रोफ़ाइल बनाएं
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={generateAISoulmate}
                  disabled={generatingAI || (allowedSoulmates > 0 && soulmateCount >= allowedSoulmates)}
                  variant="cosmic" 
                  size="lg"
                  className="gap-2"
                >
                  {generatingAI ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      जेनरेट हो रहा है...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      AI जीवनसाथी बनाएं
                      {allowedSoulmates > 0 && ` (${allowedSoulmates - soulmateCount} बचे हैं)`}
                    </>
                  )}
                </Button>
              </DialogTrigger>

              {aiSoulmate && (
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center">आपका AI जीवनसाथी</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {aiSoulmate.sketchUrl && (
                      <div className="text-center">
                        <div className="relative inline-block">
                          <img 
                            src={aiSoulmate.sketchUrl} 
                            alt="AI Generated Soulmate" 
                            className="w-64 h-64 object-cover rounded-lg shadow-cosmic mx-auto"
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">रूप-रंग:</h3>
                        <p className="text-sm text-muted-foreground">{aiSoulmate.appearance}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">व्यक्तित्व:</h3>
                        <p className="text-sm text-muted-foreground">{aiSoulmate.personality}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">मिलने का स्थान:</h3>
                        <p className="text-sm text-muted-foreground">{aiSoulmate.meetingLocation}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">समय सीमा:</h3>
                        <p className="text-sm text-muted-foreground">{aiSoulmate.timeframe}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-primary">कनेक्शन प्रकार:</h3>
                      <p className="text-sm text-muted-foreground">{aiSoulmate.connectionType}</p>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex justify-center gap-4 pt-4 border-t">
                      <Button onClick={shareSoulmate} variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        साझा करें
                      </Button>
                      <Button onClick={shareOnTwitter} variant="outline" size="sm" className="gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                      <Button onClick={shareOnFacebook} variant="outline" size="sm" className="gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                      <Button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${aiSoulmate.appearance} - ${aiSoulmate.personality}`);
                          toast({ title: "कॉपी हो गया!", description: "Soulmate details copied to clipboard" });
                        }}
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        कॉपी करें
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={loadTodayForecast} 
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            पूर्वानुमान रीफ्रेश करें
          </Button>
        </div>

        {forecast && <SocialShare />}
      </div>
    </div>
  );
};

export default EnhancedLoveForecasts;