import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calculator, Save, Share2 } from 'lucide-react';

interface NumerologyReport {
  id: string;
  life_path_number: number;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  name_analysis: any;
  detailed_report: string;
  created_at: string;
}

const Numerology = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    await loadUserData(session.user.id);
  };

  const loadUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
        setCustomName(profileData.full_name);
        await loadNumerologyReport(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNumerologyReport = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('numerology_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setReport(data[0]);
      }
    } catch (error) {
      console.error('Error loading numerology report:', error);
    }
  };

  const calculateLifePathNumber = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const total = day + month + year;
    return reduceToSingleDigit(total);
  };

  const calculateDestinyNumber = (name: string) => {
    const values: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    const total = name.toUpperCase().split('').reduce((sum, char) => {
      return sum + (values[char] || 0);
    }, 0);
    
    return reduceToSingleDigit(total);
  };

  const calculateSoulUrgeNumber = (name: string) => {
    const vowels = 'AEIOU';
    const values: { [key: string]: number } = {
      A: 1, E: 5, I: 9, O: 6, U: 3
    };
    
    const total = name.toUpperCase().split('').reduce((sum, char) => {
      return vowels.includes(char) ? sum + (values[char] || 0) : sum;
    }, 0);
    
    return reduceToSingleDigit(total);
  };

  const calculatePersonalityNumber = (name: string) => {
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const values: { [key: string]: number } = {
      B: 2, C: 3, D: 4, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4,
      N: 5, P: 7, Q: 8, R: 9, S: 1, T: 2, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    const total = name.toUpperCase().split('').reduce((sum, char) => {
      return consonants.includes(char) ? sum + (values[char] || 0) : sum;
    }, 0);
    
    return reduceToSingleDigit(total);
  };

  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = Math.floor(num / 10) + (num % 10);
    }
    return num;
  };

  const generateNumerologyReport = async () => {
    if (!user || !profile || !customName) return;

    setGenerating(true);
    try {
      const lifePathNumber = calculateLifePathNumber(profile.date_of_birth);
      const destinyNumber = calculateDestinyNumber(customName);
      const soulUrgeNumber = calculateSoulUrgeNumber(customName);
      const personalityNumber = calculatePersonalityNumber(customName);

      const nameAnalysis = {
        name: customName,
        total_letters: customName.replace(/\s/g, '').length,
        vowels: customName.match(/[aeiouAEIOU]/g)?.length || 0,
        consonants: customName.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g)?.length || 0
      };

      const detailedReport = generateDetailedReport(lifePathNumber, destinyNumber, soulUrgeNumber, personalityNumber);

      const { data, error } = await supabase
        .from('numerology_reports')
        .insert([{
          user_id: user.id,
          life_path_number: lifePathNumber,
          destiny_number: destinyNumber,
          soul_urge_number: soulUrgeNumber,
          personality_number: personalityNumber,
          name_analysis: nameAnalysis,
          detailed_report: detailedReport
        }])
        .select()
        .single();

      if (error) throw error;

      setReport(data);
      toast({
        title: "Numerology Report Generated",
        description: "Your detailed numerology analysis has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating numerology report:', error);
      toast({
        title: "Error",
        description: "Failed to generate numerology report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateDetailedReport = (lifePath: number, destiny: number, soulUrge: number, personality: number) => {
    const meanings: { [key: number]: string } = {
      1: "Leadership, independence, and pioneering spirit. You are a natural leader with strong willpower.",
      2: "Cooperation, diplomacy, and partnership. You excel in collaborative environments and relationships.",
      3: "Creativity, communication, and artistic expression. You have a gift for inspiring and entertaining others.",
      4: "Stability, hard work, and practical approach. You build solid foundations and value security.",
      5: "Freedom, adventure, and versatility. You seek variety and new experiences in life.",
      6: "Nurturing, responsibility, and service to others. You are naturally caring and protective.",
      7: "Spirituality, introspection, and analysis. You seek deeper understanding and wisdom.",
      8: "Material success, ambition, and business acumen. You have strong organizational skills.",
      9: "Humanitarian service, compassion, and universal love. You are drawn to helping humanity.",
      11: "Intuition, inspiration, and spiritual insight. You are a natural visionary and teacher.",
      22: "Master builder, practical idealism, and material mastery. You can manifest great things.",
      33: "Master teacher, spiritual service, and healing. You inspire and heal others through your presence."
    };

    return `
Life Path Number ${lifePath}: ${meanings[lifePath] || 'Unique path with special qualities.'}

Destiny Number ${destiny}: ${meanings[destiny] || 'Special destiny awaiting fulfillment.'}

Soul Urge Number ${soulUrge}: ${meanings[soulUrge] || 'Deep inner desires guide your journey.'}

Personality Number ${personality}: ${meanings[personality] || 'Others see your unique qualities.'}

Your numerological profile suggests a balanced approach to life with strong potential for personal growth and achievement.
    `.trim();
  };

  const saveReport = async () => {
    if (!report || !user) return;

    try {
      await supabase
        .from('saved_items')
        .insert([{
          user_id: user.id,
          item_type: 'report',
          item_id: report.id,
          title: 'Numerology Report'
        }]);

      toast({
        title: "Report Saved",
        description: "Your numerology report has been saved to your collection.",
      });
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Please complete your profile with birth details to generate your numerology report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/horoscope')}>Complete Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Numerology Report</h1>
        <p className="text-muted-foreground">Discover the hidden meanings in your name and birth date</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="name">Name for Analysis</Label>
            <Input
              id="name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter full name"
              className="mt-1"
            />
          </div>
          <Button onClick={generateNumerologyReport} disabled={generating || !customName.trim()}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>

        {report && (
          <div className="flex gap-2">
            <Button onClick={saveReport} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        )}
      </div>

      {report ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="numbers">Core Numbers</TabsTrigger>
            <TabsTrigger value="analysis">Name Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Your Numerological Profile
                </CardTitle>
                <CardDescription>
                  Based on: {report.name_analysis?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{report.life_path_number}</div>
                    <div className="text-sm font-medium">Life Path</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{report.destiny_number}</div>
                    <div className="text-sm font-medium">Destiny</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{report.soul_urge_number}</div>
                    <div className="text-sm font-medium">Soul Urge</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{report.personality_number}</div>
                    <div className="text-sm font-medium">Personality</div>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{report.detailed_report}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="numbers" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Life Path Number
                    <Badge variant="default" className="text-lg px-3 py-1">{report.life_path_number}</Badge>
                  </CardTitle>
                  <CardDescription>Your life's journey and purpose</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Calculated from your birth date: {new Date(profile.date_of_birth).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Destiny Number
                    <Badge variant="secondary" className="text-lg px-3 py-1">{report.destiny_number}</Badge>
                  </CardTitle>
                  <CardDescription>Your life's mission and what you're meant to achieve</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Calculated from your full name: {report.name_analysis?.name}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Soul Urge Number
                    <Badge variant="outline" className="text-lg px-3 py-1">{report.soul_urge_number}</Badge>
                  </CardTitle>
                  <CardDescription>Your inner desires and motivations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Calculated from the vowels in your name
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Personality Number
                    <Badge variant="destructive" className="text-lg px-3 py-1">{report.personality_number}</Badge>
                  </CardTitle>
                  <CardDescription>How others perceive you</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Calculated from the consonants in your name
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Name Analysis</CardTitle>
                <CardDescription>Detailed breakdown of "{report.name_analysis?.name}"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{report.name_analysis?.total_letters}</div>
                    <div className="text-sm text-muted-foreground">Total Letters</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{report.name_analysis?.vowels}</div>
                    <div className="text-sm text-muted-foreground">Vowels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{report.name_analysis?.consonants}</div>
                    <div className="text-sm text-muted-foreground">Consonants</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Numerology Report</CardTitle>
            <CardDescription>
              Enter your name above and click generate to discover your numerological insights.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Numerology;