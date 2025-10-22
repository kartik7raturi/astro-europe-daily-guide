import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw, Save, Star, Crown, Sparkles, Share2, Twitter, Facebook, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

interface Affirmation {
  id: string;
  affirmation_text: string;
  zodiac_sign: string;
  is_favorite: boolean;
}

const DailyAffirmations = () => {
  const [todayAffirmation, setTodayAffirmation] = useState<Affirmation | null>(null);
  const [favorites, setFavorites] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAccess, subscribed, trial_end, loading: subscriptionLoading } = useSubscription();

  const affirmations = [
    "The universe conspires to bring me love and joy today",
    "I am aligned with my highest purpose and divine destiny",
    "My energy attracts abundance and positive opportunities",
    "I trust the cosmic timing of my life's journey",
    "I radiate love and attract meaningful connections",
    "My intuition guides me toward my soul's desires",
    "I am worthy of all the beautiful experiences coming my way",
    "The stars illuminate my path to success and happiness"
  ];

  useEffect(() => {
    loadTodayAffirmation();
    loadFavorites();
  }, []);

  const loadTodayAffirmation = async () => {
    try {
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_affirmations')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading affirmation:', error);
        return;
      }

      if (data) {
        setTodayAffirmation(data);
      } else {
        generateNewAffirmation();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewAffirmation = async () => {
    try {
      if (!user) return;

      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_affirmations')
        .insert({
          user_id: user.id,
          affirmation_text: randomAffirmation,
          date: today,
          zodiac_sign: 'universal'
        })
        .select()
        .single();

      if (error) throw error;

      setTodayAffirmation(data);
      toast({
        title: "New Affirmation Generated",
        description: "A fresh cosmic message just for you!"
      });
    } catch (error) {
      console.error('Error generating affirmation:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!todayAffirmation) return;

    try {
      const newFavoriteStatus = !todayAffirmation.is_favorite;
      
      const { error } = await supabase
        .from('daily_affirmations')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', todayAffirmation.id);

      if (error) throw error;

      setTodayAffirmation({ ...todayAffirmation, is_favorite: newFavoriteStatus });
      
      if (newFavoriteStatus) {
        toast({
          title: "Added to Favorites",
          description: "This affirmation is now saved in your collection!"
        });
      }
      
      loadFavorites();
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('daily_affirmations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const shareAffirmation = (text: string) => {
    const shareText = `Today's cosmic affirmation: "${text}" ✨ Get your daily affirmations at astrovibe.online`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Cosmic Affirmation',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Share your affirmation on social media!"
      });
    }
  };

  const shareOnTwitter = (text: string) => {
    const shareText = `Today's cosmic affirmation: "${text}" ✨ #DailyAffirmation #CosmicWisdom`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  const shareOnFacebook = (text: string) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(`"${text}" - My daily cosmic affirmation from astrovibe.online`)}`, '_blank');
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">Loading your cosmic message...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Daily Affirmations</h1>
          <p className="text-muted-foreground">Please sign in to access your personalized daily affirmations.</p>
          <Link to="/auth">
            <Button variant="cosmic">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Daily Cosmic Affirmations
          </h1>
          <p className="text-muted-foreground text-lg">
            Align your energy with the universe's positive vibrations
          </p>
        </div>

        {/* Today's Affirmation */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              Today's Affirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {todayAffirmation && (
              <>
                <blockquote className="text-xl italic text-center py-8 px-4 border-l-4 border-primary">
                  "{todayAffirmation.affirmation_text}"
                </blockquote>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleFavorite}
                    variant={todayAffirmation.is_favorite ? "default" : "outline"}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${todayAffirmation.is_favorite ? 'fill-current' : ''}`} />
                    {todayAffirmation.is_favorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button onClick={generateNewAffirmation} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    New Affirmation
                  </Button>
                  
                  <Button 
                    onClick={() => shareAffirmation(todayAffirmation.affirmation_text)} 
                    variant="outline" 
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Favorite Affirmations */}
        {favorites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-6 w-6 text-primary" />
                Your Favorite Affirmations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {favorites.map((affirmation) => (
                  <div
                    key={affirmation.id}
                    className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <p className="italic">"{affirmation.affirmation_text}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyAffirmations;