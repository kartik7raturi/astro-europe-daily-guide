import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Star, Moon, Calendar, Plus, Edit3 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  entry_date: string;
  mood_rating: number;
  daily_events: string;
  prediction_accuracy: string;
  personal_notes: string;
  moon_phase: string;
  planetary_influences: string;
}

const AstroJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    mood_rating: 5,
    daily_events: '',
    prediction_accuracy: '',
    personal_notes: '',
    moon_phase: '',
    planetary_influences: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    loadEntryForDate(selectedDate);
  }, [selectedDate]);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('astro_journal')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const loadEntryForDate = async (date: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('astro_journal')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading entry:', error);
        return;
      }

      if (data) {
        setCurrentEntry(data);
        setIsEditing(true);
      } else {
        setCurrentEntry({
          mood_rating: 5,
          daily_events: '',
          prediction_accuracy: '',
          personal_notes: '',
          moon_phase: getMoonPhase(date),
          planetary_influences: ''
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getMoonPhase = (date: string) => {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const dateObj = new Date(date);
    const dayOfMonth = dateObj.getDate();
    const phaseIndex = Math.floor((dayOfMonth - 1) / 3.75);
    return phases[Math.min(phaseIndex, phases.length - 1)];
  };

  const saveEntry = async () => {
    if (!currentEntry.daily_events?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please add some daily events to save your entry.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const entryData = {
        user_id: user.id,
        entry_date: selectedDate,
        mood_rating: currentEntry.mood_rating || 5,
        daily_events: currentEntry.daily_events || '',
        prediction_accuracy: currentEntry.prediction_accuracy || '',
        personal_notes: currentEntry.personal_notes || '',
        moon_phase: currentEntry.moon_phase || getMoonPhase(selectedDate),
        planetary_influences: currentEntry.planetary_influences || ''
      };

      if (isEditing && currentEntry.id) {
        const { error } = await supabase
          .from('astro_journal')
          .update(entryData)
          .eq('id', currentEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('astro_journal')
          .insert(entryData);

        if (error) throw error;
        setIsEditing(true);
      }

      await loadEntries();
      await loadEntryForDate(selectedDate);
      
      toast({
        title: "Entry Saved",
        description: "Your cosmic journal entry has been saved ✨"
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return "😢";
    if (rating <= 4) return "😕";
    if (rating <= 6) return "😐";
    if (rating <= 8) return "😊";
    return "😄";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Astro Journal
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your cosmic journey and reflect on your daily experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journal Entry Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-6 w-6 text-primary" />
                  {isEditing ? 'Edit Entry' : 'New Entry'}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="entryDate">Date</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Mood Rating: {currentEntry.mood_rating}/10 {getMoodEmoji(currentEntry.mood_rating || 5)}</Label>
                  <Slider
                    value={[currentEntry.mood_rating || 5]}
                    onValueChange={(value) => setCurrentEntry({ ...currentEntry, mood_rating: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyEvents">Daily Events & Experiences</Label>
                  <Textarea
                    id="dailyEvents"
                    value={currentEntry.daily_events || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, daily_events: e.target.value })}
                    placeholder="What happened today? How did you feel?"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="predictionAccuracy">Prediction Accuracy</Label>
                  <Textarea
                    id="predictionAccuracy"
                    value={currentEntry.prediction_accuracy || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, prediction_accuracy: e.target.value })}
                    placeholder="How accurate were yesterday's predictions? What came true?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalNotes">Personal Reflections</Label>
                  <Textarea
                    id="personalNotes"
                    value={currentEntry.personal_notes || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, personal_notes: e.target.value })}
                    placeholder="Your thoughts, insights, and reflections..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="moonPhase">Moon Phase</Label>
                    <Input
                      id="moonPhase"
                      value={currentEntry.moon_phase || ''}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, moon_phase: e.target.value })}
                      placeholder="e.g., Full Moon, New Moon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planetaryInfluences">Planetary Influences</Label>
                    <Input
                      id="planetaryInfluences"
                      value={currentEntry.planetary_influences || ''}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, planetary_influences: e.target.value })}
                      placeholder="e.g., Mercury Retrograde"
                    />
                  </div>
                </div>

                <Button 
                  onClick={saveEntry} 
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {loading ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Past Entries */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Past Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No entries yet. Start your cosmic journal today!
                  </p>
                ) : (
                  entries.slice(0, 10).map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-card/80 ${
                        entry.entry_date === selectedDate ? 'bg-primary/10 border-primary' : 'bg-card/50'
                      }`}
                      onClick={() => setSelectedDate(entry.entry_date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </span>
                        <span className="text-sm">
                          {getMoodEmoji(entry.mood_rating)} {entry.mood_rating}/10
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {entry.daily_events}
                      </p>
                      {entry.moon_phase && (
                        <div className="flex items-center gap-1 mt-2">
                          <Moon className="h-3 w-3 text-primary" />
                          <span className="text-xs text-muted-foreground">{entry.moon_phase}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstroJournal;