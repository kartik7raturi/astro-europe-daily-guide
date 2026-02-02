import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link2, Repeat, Sparkles, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialShare from "@/components/SocialShare";

interface KarmicResult {
  karmicScore: number;
  bondType: string;
  pastLifeConnection: string;
  lessons: string[];
  patterns: string[];
  healingGuidance: string;
  resolution: string;
}

const KarmicBonds = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KarmicResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("personName") as string,
      relationship: formData.get("relationship") as string,
      patterns: formData.get("patterns") as string,
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to access this feature");

      const analysis = generateKarmicAnalysis(data);
      setResult(analysis);
      
      toast({
        title: "Analysis Complete!",
        description: "Your karmic bond reading is ready.",
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

  const generateKarmicAnalysis = (data: any): KarmicResult => {
    const score = Math.floor(Math.random() * 50) + 50;
    
    const bondTypes = [
      { type: "Teacher-Student Bond", pastLife: "In a past life, you were student and teacher. One of you held wisdom the other needed to learn." },
      { type: "Sibling Soul Bond", pastLife: "Your souls have traveled together as siblings or close family in multiple lifetimes." },
      { type: "Lover's Karmic Bond", pastLife: "Unresolved romantic karma from a past life where the relationship ended abruptly or with unfinished business." },
      { type: "Healer-Healed Bond", pastLife: "One of you healed the other in a past life, creating a debt of gratitude and service." },
      { type: "Adversarial Karma", pastLife: "Past life conflict or betrayal that needs resolution and forgiveness in this lifetime." }
    ];

    const selected = bondTypes[Math.floor(Math.random() * bondTypes.length)];

    return {
      karmicScore: score,
      bondType: selected.type,
      pastLifeConnection: selected.pastLife,
      lessons: [
        "Learning unconditional forgiveness",
        "Releasing attachment to outcomes",
        "Developing healthy boundaries",
        "Understanding your own worth"
      ],
      patterns: [
        "Repeating similar conflicts or dynamics",
        "Feeling inexplicably drawn together despite difficulties",
        "Intense emotional reactions beyond current circumstances",
        "Sense of unfinished business"
      ],
      healingGuidance: "To heal this karmic bond, focus on forgiveness - both of yourself and the other person. Recognize the lessons being offered and consciously choose to break old patterns. Meditation and journaling about your feelings can accelerate healing.",
      resolution: "This karma can be resolved through conscious awareness, forgiveness practices, and choosing new responses to old triggers. Once the lessons are learned, you may find the intensity of the connection naturally shifts or completes."
    };
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
                  <Link2 className="h-6 w-6 mr-2" />
                  {result.bondType}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-4">Karmic Intensity: {result.karmicScore}%</p>
                <Progress value={result.karmicScore} className="w-full mb-4" />
                <p className="text-lg">{result.pastLifeConnection}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-500 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Karmic Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-center">
                        <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-500 flex items-center">
                    <Repeat className="h-5 w-5 mr-2" />
                    Recurring Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.patterns.map((pattern, index) => (
                      <li key={index} className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Healing Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{result.healingGuidance}</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Path to Resolution</h4>
                  <p className="text-sm">{result.resolution}</p>
                </div>
              </CardContent>
            </Card>

            <SocialShare 
              title="My Karmic Bond Reading"
              text={`I discovered my karmic connection: ${result.bondType}. Understanding past life bonds helps heal present relationships.`}
              hashtags={['KarmicBonds', 'PastLife', 'SpiritualHealing']}
            />

            <div className="text-center">
              <Button variant="cosmic" onClick={() => setResult(null)}>
                Analyze Another Bond
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
              <Link2 className="h-6 w-6 mr-2 text-purple-500" />
              Karmic Bond Reading
            </CardTitle>
            <p className="text-muted-foreground">
              Understand the past life connections influencing your relationships
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="personName">Person's Name</Label>
                <Input id="personName" name="personName" placeholder="Enter their name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship</Label>
                <Input id="relationship" name="relationship" placeholder="e.g., Partner, Friend, Family member" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patterns">Describe Any Recurring Patterns (Optional)</Label>
                <Textarea 
                  id="patterns" 
                  name="patterns" 
                  placeholder="Describe any repeating dynamics, conflicts, or feelings in this relationship..."
                  rows={3}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What are Karmic Bonds?</h3>
                <p className="text-sm text-muted-foreground">
                  Karmic bonds are connections from past lives that continue into our present. 
                  These relationships often carry unresolved lessons, debts, or purposes that our souls 
                  agreed to work through together.
                </p>
              </div>

              <Button type="submit" variant="cosmic" className="w-full" disabled={loading}>
                {loading ? "Analyzing Karmic Bond..." : "Reveal Karmic Bond"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KarmicBonds;
