import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Sparkles, TrendingUp, Calendar, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CrushAnalysis {
  id: string;
  crush_name: string;
  crush_birthdate: string;
  compatibility_score: number;
  analysis_text: string;
  daily_insight: string;
  thinking_about_you_percentage: number;
}

const CrushAnalyzer = () => {
  const [crushName, setCrushName] = useState("");
  const [crushBirthdate, setCrushBirthdate] = useState("");
  const [analyses, setAnalyses] = useState<CrushAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('crush_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const analyzeCrush = async () => {
    if (!crushName.trim() || !crushBirthdate) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and birthdate for analysis.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate analysis based on cosmic energies
      const compatibilityScore = Math.floor(Math.random() * 40) + 60; // 60-100%
      const thinkingPercentage = Math.floor(Math.random() * 50) + 30; // 30-80%
      
      const analysisText = generateAnalysis(compatibilityScore);
      const dailyInsight = generateDailyInsight(thinkingPercentage);

      const { data, error } = await supabase
        .from('crush_analysis')
        .insert({
          user_id: user.id,
          crush_name: crushName,
          crush_birthdate: crushBirthdate,
          compatibility_score: compatibilityScore,
          analysis_text: analysisText,
          daily_insight: dailyInsight,
          thinking_about_you_percentage: thinkingPercentage
        })
        .select()
        .single();

      if (error) throw error;

      setAnalyses([data, ...analyses]);
      setCrushName("");
      setCrushBirthdate("");
      
      toast({
        title: "Analysis Complete!",
        description: "Your cosmic love reading is ready ✨"
      });
    } catch (error) {
      console.error('Error analyzing crush:', error);
      toast({
        title: "Error",
        description: "Failed to analyze. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = (score: number) => {
    if (score >= 90) {
      return "The cosmic energies reveal an extraordinary connection! Your souls vibrate at similar frequencies, creating powerful magnetic attraction. This connection transcends the physical realm and touches the spiritual. The stars suggest this could be a transformative relationship.";
    } else if (score >= 80) {
      return "Strong cosmic compatibility detected! Your energy fields complement each other beautifully. There's natural chemistry and understanding between you. The universe is aligning to bring you closer together.";
    } else if (score >= 70) {
      return "Good cosmic harmony exists between you both. While there may be some challenges, the overall energy is positive and growth-oriented. This connection has potential for deep emotional bonding.";
    } else {
      return "The cosmic energies show a moderate connection. There's attraction present, but it may require patience and understanding to develop. Focus on building friendship first.";
    }
  };

  const generateDailyInsight = (percentage: number) => {
    const insights = [
      `They're thinking about you ${percentage}% of the time today! Your energy is definitely on their mind.`,
      `Cosmic vibrations suggest they've thought of you ${percentage}% more today than usual. Something special is brewing!`,
      `Today's lunar energy indicates they're thinking of you with ${percentage}% positive intentions.`,
      `The stars whisper that ${percentage}% of their thoughts today have been colored by your presence.`
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crush_analysis')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnalyses(analyses.filter(analysis => analysis.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis removed from your collection."
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Cosmic Crush Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the cosmic connection with your special someone
          </p>
        </div>

        {/* Analysis Form */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-pink-500/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-600" />
              Analyze Your Crush
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crushName">Their Name</Label>
                <Input
                  id="crushName"
                  value={crushName}
                  onChange={(e) => setCrushName(e.target.value)}
                  placeholder="Enter their name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crushBirthdate">Their Birthdate</Label>
                <Input
                  id="crushBirthdate"
                  type="date"
                  value={crushBirthdate}
                  onChange={(e) => setCrushBirthdate(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={analyzeCrush} 
              disabled={loading}
              className="w-full gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Analyzing Cosmic Connection..." : "Analyze Connection"}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary fill-current" />
                    {analysis.crush_name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Born: {new Date(analysis.crush_birthdate).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Compatibility Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compatibility Score</span>
                    <span className="text-2xl font-bold text-primary">{analysis.compatibility_score}%</span>
                  </div>
                  <Progress value={analysis.compatibility_score} className="h-3" />
                </div>

                {/* Analysis Text */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Cosmic Analysis
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{analysis.analysis_text}</p>
                </div>

                {/* Daily Insight */}
                <div className="bg-card/50 rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Today's Insight
                  </h3>
                  <p className="text-sm text-muted-foreground">{analysis.daily_insight}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {analyses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analyses Yet</h3>
              <p className="text-muted-foreground">
                Analyze your first crush to discover your cosmic connection!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CrushAnalyzer;