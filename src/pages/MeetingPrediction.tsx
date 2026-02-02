import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Calendar, Sparkles, ArrowLeft, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialShare from "@/components/SocialShare";

interface PredictionResult {
  timeFrame: string;
  location: string;
  circumstance: string;
  signs: string[];
  preparation: string[];
  luckyDays: string[];
  cosmicMessage: string;
}

const MeetingPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to access this feature");

      // Get user's profile for personalized prediction
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const prediction = generatePrediction(profile);
      setResult(prediction);
      
      toast({
        title: "Prediction Generated!",
        description: "Your soulmate meeting prediction is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Please complete your profile first",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = (profile: any): PredictionResult => {
    const timeFrames = [
      "Within the next 3-6 months",
      "During the upcoming season change",
      "Within the next year",
      "During a significant planetary transit in your chart",
      "When Venus enters your 7th house"
    ];

    const locations = [
      "A social gathering or community event",
      "Through mutual friends or connections",
      "At a place related to learning or personal growth",
      "During travel or in a new environment",
      "At work or a professional setting",
      "An unexpected encounter in a familiar place"
    ];

    const circumstances = [
      "You'll both reach for the same item or share a moment of synchronicity",
      "A conversation will spark unexpectedly and feel instantly comfortable",
      "You'll feel a strong sense of recognition, as if you've known them before",
      "They'll appear when you've finally let go and stopped actively searching",
      "A mutual interest or hobby will bring you together naturally"
    ];

    return {
      timeFrame: timeFrames[Math.floor(Math.random() * timeFrames.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      circumstance: circumstances[Math.floor(Math.random() * circumstances.length)],
      signs: [
        "Repeated angel numbers (111, 222, 444)",
        "Dreams about meeting someone new",
        "Sudden urge to visit new places",
        "Feeling more open and receptive than usual",
        "Synchronicities with love symbols"
      ],
      preparation: [
        "Focus on self-love and personal growth",
        "Clear emotional baggage from past relationships",
        "Stay open and present in social situations",
        "Trust divine timing and release attachment",
        "Work on becoming the partner you wish to attract"
      ],
      luckyDays: ["Friday (Venus Day)", "Monday (Moon Day)", "Full Moon Days"],
      cosmicMessage: "The universe is aligning circumstances for your meeting. Trust in divine timing and continue focusing on your own growth. Your soulmate is also preparing to meet you."
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
                  <Heart className="h-6 w-6 mr-2" />
                  Your Soulmate Meeting Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg">{result.cosmicMessage}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">When</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold text-primary">{result.timeFrame}</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">Where</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold text-primary">{result.location}</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Sparkles className="h-8 w-8 mx-auto text-primary mb-2" />
                  <CardTitle className="text-lg">How</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold text-primary">{result.circumstance}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-500">
                    <Star className="h-5 w-5 mr-2" />
                    Signs to Watch For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.signs.map((sign, index) => (
                      <li key={index} className="flex items-center">
                        <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-pink-500">
                    <Heart className="h-5 w-5 mr-2" />
                    How to Prepare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.preparation.map((prep, index) => (
                      <li key={index} className="flex items-center">
                        <Heart className="h-4 w-4 text-pink-500 mr-2" />
                        {prep}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Lucky Days for Love
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.luckyDays.map((day, index) => (
                    <span key={index} className="bg-primary/20 text-primary px-4 py-2 rounded-full font-medium">
                      {day}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <SocialShare 
              title="My Soulmate Meeting Prediction"
              text={`The universe predicts I'll meet my soulmate ${result.timeFrame.toLowerCase()} at ${result.location.toLowerCase()}!`}
              hashtags={['SoulmatePrediction', 'DivineT iming', 'LoveIsComming']}
            />

            <div className="text-center">
              <Button variant="cosmic" onClick={() => setResult(null)}>
                Get New Prediction
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
              <MapPin className="h-6 w-6 mr-2 text-pink-500" />
              Soulmate Meeting Prediction
            </CardTitle>
            <p className="text-muted-foreground">
              Discover when, where, and how you'll meet your soulmate
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">What You'll Discover:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  The timeframe when you're most likely to meet
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  The type of location where the meeting may occur
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  The circumstances of your first encounter
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-primary" />
                  Signs to watch for as the meeting approaches
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 rounded-lg text-center">
              <p className="text-sm">
                This prediction is based on cosmic alignments and numerological insights from your birth chart.
              </p>
            </div>

            <Button onClick={handleGenerate} variant="cosmic" className="w-full" disabled={loading}>
              {loading ? "Consulting the Stars..." : "Reveal My Soulmate Prediction"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingPrediction;
