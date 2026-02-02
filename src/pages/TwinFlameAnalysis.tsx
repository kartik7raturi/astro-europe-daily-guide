import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Flame, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialShare from "@/components/SocialShare";

interface TwinFlameResult {
  connectionScore: number;
  flameType: string;
  analysis: string;
  signs: string[];
  challenges: string[];
  guidance: string;
}

const TwinFlameAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TwinFlameResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const partnerData = {
      name: formData.get("partnerName") as string,
      dob: formData.get("partnerDob") as string,
      meetingDate: formData.get("meetingDate") as string,
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to access this feature");

      // Generate twin flame analysis
      const analysis = generateTwinFlameAnalysis(partnerData);
      setResult(analysis);
      
      toast({
        title: "Analysis Complete!",
        description: "Your twin flame connection has been analyzed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTwinFlameAnalysis = (data: any): TwinFlameResult => {
    const score = Math.floor(Math.random() * 40) + 60;
    
    let flameType = "";
    let analysis = "";
    let signs: string[] = [];
    let challenges: string[] = [];
    let guidance = "";

    if (score >= 85) {
      flameType = "Divine Twin Flame";
      analysis = "Your connection shows extraordinary signs of a true twin flame union. The cosmic energies between you are intensely mirrored, suggesting you share the same soul essence split into two bodies.";
      signs = ["Instant deep recognition", "Telepathic connection", "Intense emotional triggers", "Mirrored life experiences", "Spiritual awakening together"];
      challenges = ["Intense push-pull dynamic", "Running and chasing phases", "Deep inner work required"];
      guidance = "Embrace the journey of self-discovery this connection brings. Focus on your own healing and growth - your twin will mirror your progress.";
    } else if (score >= 70) {
      flameType = "Strong Soul Connection";
      analysis = "You share a powerful soul connection with significant twin flame characteristics. While not a full twin flame union, this connection is deeply transformative and spiritually significant.";
      signs = ["Strong intuitive knowing", "Feeling of familiarity", "Synchronicities around you", "Growth through the relationship"];
      challenges = ["Communication barriers", "Different spiritual paths", "Timing issues"];
      guidance = "Honor this connection by focusing on open communication and mutual spiritual growth. The universe brought you together for profound learning.";
    } else {
      flameType = "Karmic Soul Connection";
      analysis = "Your connection appears to be a significant karmic relationship. While different from twin flames, karmic connections serve important purposes in our spiritual journey.";
      signs = ["Lessons to learn together", "Unresolved past life energy", "Strong attraction", "Growth opportunities"];
      challenges = ["Repeating patterns", "Difficulty letting go", "Power dynamics"];
      guidance = "Focus on the lessons this relationship offers. Karmic connections help clear past patterns and prepare us for deeper unions.";
    }

    return { connectionScore: score, flameType, analysis, signs, challenges, guidance };
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-starlight p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            <Card className="bg-gradient-cosmic border-none text-primary-foreground">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Flame className="h-6 w-6 mr-2" />
                  {result.flameType}: {result.connectionScore}%
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Progress value={result.connectionScore} className="w-full mb-4" />
                <p className="text-lg">{result.analysis}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-500 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Signs of Your Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.signs.map((sign, index) => (
                      <li key={index} className="flex items-center">
                        <Flame className="h-4 w-4 text-orange-500 mr-2" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-500 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Challenges to Navigate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-center">
                        <Heart className="h-4 w-4 text-blue-500 mr-2" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Divine Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{result.guidance}</p>
              </CardContent>
            </Card>

            <SocialShare 
              title="My Twin Flame Analysis"
              text={`I discovered my twin flame connection type: ${result.flameType} with ${result.connectionScore}% connection strength!`}
              hashtags={['TwinFlame', 'SoulConnection', 'SpiritualJourney']}
            />

            <div className="text-center">
              <Button variant="cosmic" onClick={() => setResult(null)}>
                Analyze Another Connection
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight p-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Flame className="h-6 w-6 mr-2 text-orange-500" />
              Twin Flame Analysis
            </CardTitle>
            <p className="text-muted-foreground">
              Discover if your connection is a twin flame union
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Their Name</Label>
                <Input id="partnerName" name="partnerName" placeholder="Enter their name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerDob">Their Date of Birth</Label>
                <Input id="partnerDob" name="partnerDob" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingDate">When Did You First Meet?</Label>
                <Input id="meetingDate" name="meetingDate" type="date" />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What is a Twin Flame?</h3>
                <p className="text-sm text-muted-foreground">
                  Twin flames are two halves of the same soul, split and incarnated into separate bodies. 
                  Meeting your twin flame triggers profound spiritual awakening and transformation.
                </p>
              </div>

              <Button type="submit" variant="cosmic" className="w-full" disabled={loading}>
                {loading ? "Analyzing Connection..." : "Analyze Twin Flame Connection"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TwinFlameAnalysis;
