import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, Save, Share2 } from 'lucide-react';

interface BirthChart {
  id: string;
  chart_type: string;
  houses: any;
  planets: any;
  aspects: any;
  chart_data: any;
  created_at: string;
}

const BirthChart = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
  const [chartType, setChartType] = useState('vedic');
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
        await loadBirthChart(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBirthChart = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('birth_charts')
        .select('*')
        .eq('user_id', userId)
        .eq('chart_type', chartType)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setBirthChart(data[0]);
      }
    } catch (error) {
      console.error('Error loading birth chart:', error);
    }
  };

  const generateBirthChart = async () => {
    if (!user || !profile) return;

    setGenerating(true);
    try {
      // Generate mock birth chart data
      const mockChart = {
        houses: {
          1: { sign: 'Aries', lord: 'Mars', planets: ['Sun'] },
          2: { sign: 'Taurus', lord: 'Venus', planets: [] },
          3: { sign: 'Gemini', lord: 'Mercury', planets: ['Mercury'] },
          4: { sign: 'Cancer', lord: 'Moon', planets: ['Moon'] },
          5: { sign: 'Leo', lord: 'Sun', planets: [] },
          6: { sign: 'Virgo', lord: 'Mercury', planets: [] },
          7: { sign: 'Libra', lord: 'Venus', planets: ['Venus'] },
          8: { sign: 'Scorpio', lord: 'Mars', planets: [] },
          9: { sign: 'Sagittarius', lord: 'Jupiter', planets: ['Jupiter'] },
          10: { sign: 'Capricorn', lord: 'Saturn', planets: ['Saturn'] },
          11: { sign: 'Aquarius', lord: 'Saturn', planets: [] },
          12: { sign: 'Pisces', lord: 'Jupiter', planets: [] }
        },
        planets: {
          Sun: { sign: 'Aries', house: 1, degree: 15.5 },
          Moon: { sign: 'Cancer', house: 4, degree: 22.3 },
          Mercury: { sign: 'Gemini', house: 3, degree: 8.7 },
          Venus: { sign: 'Libra', house: 7, degree: 12.1 },
          Mars: { sign: 'Leo', house: 5, degree: 18.9 },
          Jupiter: { sign: 'Sagittarius', house: 9, degree: 25.6 },
          Saturn: { sign: 'Capricorn', house: 10, degree: 3.4 }
        },
        aspects: [
          { planet1: 'Sun', planet2: 'Moon', type: 'Square', orb: 2.1 },
          { planet1: 'Venus', planet2: 'Jupiter', type: 'Trine', orb: 1.8 }
        ]
      };

      const { data, error } = await supabase
        .from('birth_charts')
        .insert([{
          user_id: user.id,
          chart_type: chartType,
          houses: mockChart.houses,
          planets: mockChart.planets,
          aspects: mockChart.aspects,
          chart_data: mockChart
        }])
        .select()
        .single();

      if (error) throw error;

      setBirthChart(data);
      toast({
        title: "Birth Chart Generated",
        description: "Your detailed birth chart has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating birth chart:', error);
      toast({
        title: "Error",
        description: "Failed to generate birth chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const saveChart = async () => {
    if (!birthChart || !user) return;

    try {
      await supabase
        .from('saved_items')
        .insert([{
          user_id: user.id,
          item_type: 'chart',
          item_id: birthChart.id,
          title: `${chartType} Birth Chart`
        }]);

      toast({
        title: "Chart Saved",
        description: "Your birth chart has been saved to your collection.",
      });
    } catch (error) {
      console.error('Error saving chart:', error);
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
              Please complete your profile with birth details to generate your birth chart.
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
        <h1 className="text-4xl font-bold mb-2">Birth Chart Generator</h1>
        <p className="text-muted-foreground">Generate and explore your detailed astrological birth chart</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Select value={chartType} onValueChange={(value) => { setChartType(value); loadBirthChart(user?.id || ''); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vedic">Vedic (Sidereal)</SelectItem>
            <SelectItem value="western">Western (Tropical)</SelectItem>
          </SelectContent>
        </Select>

        {!birthChart && (
          <Button onClick={generateBirthChart} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Chart'
            )}
          </Button>
        )}

        {birthChart && (
          <div className="flex gap-2">
            <Button onClick={saveChart} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={generateBirthChart} disabled={generating}>
              Regenerate
            </Button>
          </div>
        )}
      </div>

      {birthChart ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="aspects">Aspects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Chart Overview
                </CardTitle>
                <CardDescription>
                  {chartType === 'vedic' ? 'Vedic (Sidereal)' : 'Western (Tropical)'} Birth Chart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Birth Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {profile.full_name}</p>
                      <p><span className="font-medium">Date:</span> {new Date(profile.date_of_birth).toLocaleDateString()}</p>
                      <p><span className="font-medium">Time:</span> {profile.time_of_birth || 'Not specified'}</p>
                      <p><span className="font-medium">Place:</span> {profile.place_of_birth}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Chart Highlights</h3>
                    <div className="space-y-2">
                      <Badge variant="secondary">Sun in {birthChart.planets?.Sun?.sign}</Badge>
                      <Badge variant="secondary">Moon in {birthChart.planets?.Moon?.sign}</Badge>
                      <Badge variant="secondary">Ascendant in {birthChart.houses?.[1]?.sign}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Houses</CardTitle>
                <CardDescription>The 12 houses and their planetary placements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(birthChart.houses || {}).map(([house, data]: [string, any]) => (
                    <Card key={house} className="p-4">
                      <h3 className="font-semibold mb-2">House {house}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{data.sign}</p>
                      <p className="text-xs mb-2">Ruler: {data.lord}</p>
                      {data.planets?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {data.planets.map((planet: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">{planet}</Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planetary Positions</CardTitle>
                <CardDescription>Current positions of planets in signs and houses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(birthChart.planets || {}).map(([planet, data]: [string, any]) => (
                    <div key={planet} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{planet}</h3>
                        <p className="text-sm text-muted-foreground">
                          {data.sign} • House {data.house} • {data.degree.toFixed(1)}°
                        </p>
                      </div>
                      <Badge variant="secondary">{data.sign}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aspects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planetary Aspects</CardTitle>
                <CardDescription>Major aspects between planets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {birthChart.aspects?.map((aspect: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{aspect.planet1} {aspect.type} {aspect.planet2}</h3>
                        <p className="text-sm text-muted-foreground">Orb: {aspect.orb}°</p>
                      </div>
                      <Badge variant={aspect.type === 'Trine' ? 'default' : 'secondary'}>
                        {aspect.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Birth Chart</CardTitle>
            <CardDescription>
              Click the generate button above to create your detailed {chartType} birth chart.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default BirthChart;