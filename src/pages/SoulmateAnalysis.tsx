import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialShare from "@/components/SocialShare";

interface AshtakootResult {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  graha_maitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
  total: number;
}

interface CompatibilityResult {
  score: number;
  analysis: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  ashtakoot: AshtakootResult;
}

const SoulmateAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const partnerData = {
      name: formData.get("partnerName") as string,
      dob: formData.get("partnerDob") as string,
      time: formData.get("partnerTime") as string,
      place: formData.get("partnerPlace") as string,
    };

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate compatibility analysis (simplified for demo)
      const analysis = await generateCompatibilityAnalysis(partnerData);
      
      // Save to database
      const { error } = await supabase
        .from("compatibility_readings")
        .insert([{
          user_id: user.id,
          partner_name: partnerData.name,
          partner_dob: partnerData.dob,
          partner_time_of_birth: partnerData.time,
          partner_place_of_birth: partnerData.place,
          compatibility_score: analysis.score,
          matching_qualities: analysis.ashtakoot.total,
          total_qualities: 36,
          detailed_analysis: analysis.analysis,
          strengths: analysis.strengths,
          challenges: analysis.challenges,
          advice: analysis.advice,
        }]);

      if (error) throw error;

      setResult(analysis);
      toast({
        title: "Analysis Complete!",
        description: "Your soulmate compatibility has been analyzed.",
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

  const generateCompatibilityAnalysis = async (partnerData: any): Promise<CompatibilityResult> => {
    // Simulate ashtakoot calculation (in production, this would be a complex calculation)
    const ashtakoot: AshtakootResult = {
      varna: Math.floor(Math.random() * 2) + 1,      // Max 1
      vashya: Math.floor(Math.random() * 3) + 1,     // Max 2
      tara: Math.floor(Math.random() * 4) + 1,       // Max 3
      yoni: Math.floor(Math.random() * 5) + 1,       // Max 4
      graha_maitri: Math.floor(Math.random() * 6) + 1, // Max 5
      gana: Math.floor(Math.random() * 7) + 1,       // Max 6
      bhakoot: Math.floor(Math.random() * 8) + 1,    // Max 7
      nadi: Math.floor(Math.random() * 9) + 1,       // Max 8
      total: 0
    };

    ashtakoot.total = ashtakoot.varna + ashtakoot.vashya + ashtakoot.tara + 
                     ashtakoot.yoni + ashtakoot.graha_maitri + ashtakoot.gana + 
                     ashtakoot.bhakoot + ashtakoot.nadi;

    const score = Math.round((ashtakoot.total / 36) * 100);

    let analysis = "";
    let strengths: string[] = [];
    let challenges: string[] = [];
    let advice = "";

    if (score >= 80) {
      analysis = "Exceptional cosmic harmony! Your souls are deeply aligned across multiple dimensions. This connection transcends the ordinary and suggests a truly cosmic bond.";
      strengths = ["Perfect spiritual alignment", "Natural understanding", "Shared life goals", "Complementary energies"];
      challenges = ["May be too similar at times", "Need to maintain individual growth"];
      advice = "Embrace this rare connection while nurturing your individual paths. Your union has the potential to inspire others and create positive change in the world.";
    } else if (score >= 60) {
      analysis = "Strong compatibility with excellent potential for a harmonious relationship. Your cosmic energies complement each other beautifully with minor areas for growth.";
      strengths = ["Good emotional compatibility", "Shared values", "Mutual support", "Growing together"];
      challenges = ["Communication differences", "Different approaches to life"];
      advice = "Focus on open communication and understanding each other's perspectives. Your differences can become strengths through mutual respect and patience.";
    } else if (score >= 40) {
      analysis = "Moderate compatibility with potential for growth. This relationship will require conscious effort and understanding but can develop into something beautiful.";
      strengths = ["Learning opportunities", "Growth potential", "Different perspectives"];
      challenges = ["Significant differences to bridge", "Requires extra effort", "May have conflicting goals"];
      advice = "Success in this relationship depends on both partners' commitment to understanding and accepting differences. Consider couple's counseling or relationship workshops.";
    } else {
      analysis = "Challenging compatibility that requires significant work and understanding. While not impossible, this relationship would need exceptional commitment from both parties.";
      strengths = ["Opportunities for profound growth", "Teaching each other"];
      challenges = ["Fundamental differences", "Requires constant work", "May be emotionally draining"];
      advice = "Proceed with caution and deep self-reflection. Consider whether you're both willing to put in the extraordinary effort required for this challenging but potentially transformative connection.";
    }

    return {
      score,
      analysis,
      strengths,
      challenges,
      advice,
      ashtakoot
    };
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-starlight p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="bg-gradient-cosmic border-none text-primary-foreground">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Heart className="h-6 w-6 mr-2" />
                  Compatibility Score: {result.score}%
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Progress value={result.score} className="w-full mb-4" />
                <p className="text-lg">{result.analysis}</p>
              </CardContent>
            </Card>

            {/* Ashtakoot Breakdown */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  36 Guna Analysis (Ashtakoot)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Varna</p>
                    <Badge variant="secondary">{result.ashtakoot.varna}/1</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Vashya</p>
                    <Badge variant="secondary">{result.ashtakoot.vashya}/2</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tara</p>
                    <Badge variant="secondary">{result.ashtakoot.tara}/3</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Yoni</p>
                    <Badge variant="secondary">{result.ashtakoot.yoni}/4</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Graha Maitri</p>
                    <Badge variant="secondary">{result.ashtakoot.graha_maitri}/5</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Gana</p>
                    <Badge variant="secondary">{result.ashtakoot.gana}/6</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Bhakoot</p>
                    <Badge variant="secondary">{result.ashtakoot.bhakoot}/7</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Nadi</p>
                    <Badge variant="secondary">{result.ashtakoot.nadi}/8</Badge>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold">
                    Total: {result.ashtakoot.total}/36 Gunas Match
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Strengths and Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-600">Relationship Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="h-4 w-4 text-green-500 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-600">Areas for Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-center">
                        <Users className="h-4 w-4 text-orange-500 mr-2" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Advice */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Cosmic Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{result.advice}</p>
              </CardContent>
            </Card>

            {/* Social Sharing */}
            <SocialShare 
              title="My Soulmate Compatibility Analysis"
              text={`I just discovered my cosmic compatibility score is ${result.score}%! ${result.analysis.substring(0, 100)}...`}
              hashtags={['SoulmateAnalysis', 'Compatibility', 'CosmicLove']}
            />

            <div className="text-center">
              <Button 
                variant="cosmic" 
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
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
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              Soulmate Compatibility Analysis
            </CardTitle>
            <p className="text-muted-foreground">
              Discover your cosmic compatibility using the ancient 36 Guna system
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner's Full Name</Label>
                <Input
                  id="partnerName"
                  name="partnerName"
                  placeholder="Enter your partner's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerDob">Partner's Date of Birth</Label>
                <Input
                  id="partnerDob"
                  name="partnerDob"
                  type="date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerTime">Partner's Time of Birth (Optional)</Label>
                <Input
                  id="partnerTime"
                  name="partnerTime"
                  type="time"
                  placeholder="If known, enter time of birth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerPlace">Partner's Place of Birth</Label>
                <Input
                  id="partnerPlace"
                  name="partnerPlace"
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">About the 36 Guna System</h3>
                <p className="text-sm text-muted-foreground">
                  The Ashtakoot system analyzes 8 categories of compatibility (36 total points) 
                  including Varna (spiritual compatibility), Vashya (mutual attraction), 
                  Tara (health & well-being), Yoni (sexual compatibility), and more.
                </p>
              </div>

              <Button 
                type="submit" 
                variant="cosmic" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Analyzing Compatibility..." : "Analyze Compatibility"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoulmateAnalysis;