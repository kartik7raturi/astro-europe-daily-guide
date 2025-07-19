import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { Moon, Sun, Star, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AstroCalendarData {
  date: string;
  moon_phase: string;
  planetary_transits: any;
  good_activities: string[];
  avoid_activities: string[];
  energy_level: number;
}

const AstroCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<AstroCalendarData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendarData(selectedDate);
  }, [selectedDate]);

  const loadCalendarData = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      let { data } = await supabase
        .from('astro_calendar')
        .select('*')
        .eq('date', dateStr)
        .single();

      if (!data) {
        // Generate mock data if not exists
        data = await generateMockCalendarData(dateStr);
      }

      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      // Generate mock data on error
      const mockData = await generateMockCalendarData(format(date, 'yyyy-MM-dd'));
      setCalendarData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCalendarData = async (dateStr: string) => {
    const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const activities = {
      good: ['Meditation', 'New Beginnings', 'Creative Work', 'Networking', 'Learning', 'Travel Planning', 'Financial Planning', 'Exercise'],
      avoid: ['Arguments', 'Major Decisions', 'Signing Contracts', 'Surgery', 'Confrontations', 'Gambling', 'Overspending']
    };

    const mockData = {
      id: crypto.randomUUID(),
      date: dateStr,
      moon_phase: moonPhases[Math.floor(Math.random() * moonPhases.length)],
      planetary_transits: {
        mercury: 'Gemini',
        venus: 'Taurus',
        mars: 'Leo'
      },
      good_activities: activities.good.sort(() => 0.5 - Math.random()).slice(0, 3),
      avoid_activities: activities.avoid.sort(() => 0.5 - Math.random()).slice(0, 2),
      energy_level: Math.floor(Math.random() * 5) + 3,
      created_at: new Date().toISOString()
    };

    // Insert into database
    try {
      await supabase
        .from('astro_calendar')
        .insert([mockData]);
    } catch (error) {
      console.error('Error inserting calendar data:', error);
    }

    return mockData;
  };

  const getMoonPhaseIcon = (phase: string) => {
    if (phase.includes('New')) return '🌑';
    if (phase.includes('Waxing Crescent')) return '🌒';
    if (phase.includes('First Quarter')) return '🌓';
    if (phase.includes('Waxing Gibbous')) return '🌔';
    if (phase.includes('Full')) return '🌕';
    if (phase.includes('Waning Gibbous')) return '🌖';
    if (phase.includes('Last Quarter')) return '🌗';
    if (phase.includes('Waning Crescent')) return '🌘';
    return '🌙';
  };

  const getEnergyColor = (level: number) => {
    if (level >= 7) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Astro Calendar</h1>
        <p className="text-muted-foreground">Track planetary movements and optimal timing for activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>Astrological overview for the selected date</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : calendarData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="font-medium">Moon Phase:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMoonPhaseIcon(calendarData.moon_phase)}</span>
                      <span>{calendarData.moon_phase}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">Energy Level:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-4 rounded ${
                              i < calendarData.energy_level ? getEnergyColor(calendarData.energy_level) : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{calendarData.energy_level}/10</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {calendarData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Favorable Activities</CardTitle>
                  <CardDescription>Good time for these activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {calendarData.good_activities?.map((activity, idx) => (
                      <Badge key={idx} variant="default" className="bg-green-100 text-green-800">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Activities to Avoid</CardTitle>
                  <CardDescription>Better to postpone these activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {calendarData.avoid_activities?.map((activity, idx) => (
                      <Badge key={idx} variant="destructive" className="bg-red-100 text-red-800">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Planetary Transits</CardTitle>
                  <CardDescription>Current planetary positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {calendarData.planetary_transits && Object.entries(calendarData.planetary_transits).map(([planet, sign]) => (
                      <div key={planet} className="flex justify-between">
                        <span className="capitalize font-medium">{planet}:</span>
                        <Badge variant="outline">{sign as string}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AstroCalendar;