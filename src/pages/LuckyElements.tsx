import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Clock, Compass, Gem, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface LuckyElements {
  id: string;
  date: string;
  lucky_number: number;
  lucky_color: string;
  lucky_time: string;
  gemstone: string;
  direction: string;
  created_at: string;
}

const LuckyElements = () => {
  const [user, setUser] = useState(null);
  const [luckyElements, setLuckyElements] = useState<LuckyElements | null>(null);
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
    await loadLuckyElements(session.user.id);
  };

  const loadLuckyElements = async (userId: string) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      let { data } = await supabase
        .from('lucky_elements')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (!data) {
        // Generate new lucky elements for today
        await generateLuckyElements(userId);
      } else {
        setLuckyElements(data);
      }
    } catch (error) {
      console.error('Error loading lucky elements:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLuckyElements = async (userId?: string) => {
    const userIdToUse = userId || user?.id;
    if (!userIdToUse) return;

    setGenerating(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Black', 'Golden'];
      const gemstones = ['Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Amethyst', 'Topaz', 'Pearl', 'Coral', 'Garnet', 'Opal'];
      const directions = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
      
      const luckyNumber = Math.floor(Math.random() * 99) + 1;
      const luckyColor = colors[Math.floor(Math.random() * colors.length)];
      const luckyHour = Math.floor(Math.random() * 24);
      const luckyMinute = Math.floor(Math.random() * 60);
      const luckyTime = `${luckyHour.toString().padStart(2, '0')}:${luckyMinute.toString().padStart(2, '0')}:00`;
      const gemstone = gemstones[Math.floor(Math.random() * gemstones.length)];
      const direction = directions[Math.floor(Math.random() * directions.length)];

      // Delete existing entry for today if it exists
      await supabase
        .from('lucky_elements')
        .delete()
        .eq('user_id', userIdToUse)
        .eq('date', today);

      const { data, error } = await supabase
        .from('lucky_elements')
        .insert([{
          user_id: userIdToUse,
          date: today,
          lucky_number: luckyNumber,
          lucky_color: luckyColor,
          lucky_time: luckyTime,
          gemstone: gemstone,
          direction: direction
        }])
        .select()
        .single();

      if (error) throw error;

      setLuckyElements(data);
      toast({
        title: "Lucky Elements Updated",
        description: "Your daily lucky elements have been refreshed!",
      });
    } catch (error) {
      console.error('Error generating lucky elements:', error);
      toast({
        title: "Error",
        description: "Failed to generate lucky elements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Red': 'bg-red-500',
      'Blue': 'bg-blue-500',
      'Green': 'bg-green-500',
      'Yellow': 'bg-yellow-500',
      'Purple': 'bg-purple-500',
      'Orange': 'bg-orange-500',
      'Pink': 'bg-pink-500',
      'White': 'bg-white border border-gray-300',
      'Black': 'bg-black',
      'Golden': 'bg-yellow-400'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Daily Lucky Elements</h1>
        <p className="text-muted-foreground">Your personalized lucky elements for {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="mb-6">
        <Button onClick={() => generateLuckyElements()} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Lucky Elements
            </>
          )}
        </Button>
      </div>

      {luckyElements ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Lucky Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-primary mb-4">{luckyElements.lucky_number}</div>
              <p className="text-muted-foreground">Use this number for important decisions today</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <div className={`w-5 h-5 rounded-full ${getColorStyle(luckyElements.lucky_color)}`} />
                Lucky Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className={`w-24 h-24 rounded-full mx-auto ${getColorStyle(luckyElements.lucky_color)}`} />
              </div>
              <div className="text-2xl font-semibold mb-2">{luckyElements.lucky_color}</div>
              <p className="text-muted-foreground">Wear or surround yourself with this color today</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Lucky Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">{formatTime(luckyElements.lucky_time)}</div>
              <p className="text-muted-foreground">Best time for important activities today</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Gem className="h-5 w-5" />
                Lucky Gemstone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-4">{luckyElements.gemstone}</div>
              <p className="text-muted-foreground">Carry or wear this gemstone for good fortune</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Compass className="h-5 w-5" />
                Lucky Direction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-4">{luckyElements.direction}</div>
              <p className="text-muted-foreground">Face this direction during important activities</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <ul className="space-y-2 text-sm">
                <li>• Use your lucky number for lottery tickets or important choices</li>
                <li>• Incorporate your lucky color in your outfit or workspace</li>
                <li>• Schedule important meetings during your lucky time</li>
                <li>• Keep your lucky gemstone nearby or visualize it</li>
                <li>• Face your lucky direction when making decisions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Lucky Elements</CardTitle>
            <CardDescription>
              Click the refresh button above to generate your daily lucky elements.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Lucky Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">General Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li>• Lucky elements are refreshed daily at midnight</li>
                <li>• Use them as guidance, not absolute rules</li>
                <li>• Combine multiple elements for enhanced effect</li>
                <li>• Trust your intuition alongside the guidance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>• Start your day by reviewing your lucky elements</li>
                <li>• Set reminders for your lucky time</li>
                <li>• Keep a journal of how they work for you</li>
                <li>• Share positive experiences with friends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LuckyElements;