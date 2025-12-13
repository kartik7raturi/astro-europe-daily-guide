import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Heart, Sparkles, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateLifePathNumber, calculateDestinyNumber } from '@/utils/numerology';

const SoulmatePortrait = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');

  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  const getZodiacElement = (sign: string) => {
    const fire = ['Aries', 'Leo', 'Sagittarius'];
    const earth = ['Taurus', 'Virgo', 'Capricorn'];
    const air = ['Gemini', 'Libra', 'Aquarius'];
    
    if (fire.includes(sign)) return 'Fire';
    if (earth.includes(sign)) return 'Earth';
    if (air.includes(sign)) return 'Air';
    return 'Water';
  };

  const getAuraColor = (lifePathNumber: number): string => {
    const colors: { [key: number]: string } = {
      1: 'vibrant red',
      2: 'soft orange',
      3: 'bright yellow',
      4: 'stable green',
      5: 'electric blue',
      6: 'deep indigo',
      7: 'mystical violet',
      8: 'powerful gold',
      9: 'cosmic silver',
      11: 'luminous white',
      22: 'radiant platinum',
      33: 'ethereal rainbow'
    };
    return colors[lifePathNumber] || 'gentle blue';
  };

  const getSoulmateTraits = (element: string, lifePathNumber: number) => {
    const elementTraits: { [key: string]: string } = {
      Fire: 'confident posture, warm golden glow radiating from their presence, passionate and dynamic energy, bold and expressive features',
      Earth: 'grounded and elegant appearance, natural earthy tones in their aura, serene and stable presence, refined and timeless beauty',
      Air: 'thoughtful and charming demeanor, ethereal light around them, intellectual sparkle in their eyes, graceful and captivating presence',
      Water: 'dreamy and magnetic presence, flowing cosmic energy, deeply emotional and soulful eyes, mystical and enchanting aura'
    };

    const numerologyTraits: { [key: number]: string } = {
      1: 'strong leadership qualities visible in their stance, independent spirit shining through',
      2: 'gentle and harmonious features, peaceful and balanced energy',
      3: 'creative and expressive face, joyful and artistic aura',
      4: 'reliable and steady presence, practical wisdom in their gaze',
      5: 'adventurous and free-spirited look, versatile and dynamic energy',
      6: 'nurturing and caring expression, loving and responsible aura',
      7: 'wise and introspective features, spiritual depth in their eyes',
      8: 'powerful and successful presence, ambitious and confident energy',
      9: 'compassionate and humanitarian gaze, universal love emanating',
      11: 'highly intuitive and inspirational appearance, enlightened spiritual presence',
      22: 'master builder energy, visionary and transformational aura',
      33: 'master teacher presence, universal love and healing energy radiating'
    };

    return `${elementTraits[element]}, ${numerologyTraits[lifePathNumber] || numerologyTraits[1]}`;
  };

  const generateSoulmatePrompt = () => {
    const birthDate = new Date(formData.dateOfBirth);
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const destinyNumber = calculateDestinyNumber(formData.fullName);
    const auraColor = getAuraColor(lifePathNumber);

    // Pure numerology-based traits
    const numerologyTraitsMap: { [key: number]: { appearance: string; energy: string } } = {
      1: { appearance: 'strong jawline, confident posture, piercing eyes', energy: 'leadership and independence' },
      2: { appearance: 'soft gentle features, kind eyes, harmonious face', energy: 'balance and partnership' },
      3: { appearance: 'bright expressive eyes, joyful smile, creative aura', energy: 'creativity and expression' },
      4: { appearance: 'stable structured features, wise steady gaze', energy: 'stability and reliability' },
      5: { appearance: 'dynamic energetic look, adventurous spark in eyes', energy: 'freedom and adventure' },
      6: { appearance: 'nurturing warm expression, loving gentle eyes', energy: 'love and responsibility' },
      7: { appearance: 'mysterious deep eyes, introspective calm face', energy: 'wisdom and spirituality' },
      8: { appearance: 'powerful commanding presence, ambitious gaze', energy: 'success and abundance' },
      9: { appearance: 'compassionate soulful eyes, humanitarian warmth', energy: 'universal love and healing' },
      11: { appearance: 'illuminated ethereal features, spiritual radiance', energy: 'intuition and enlightenment' },
      22: { appearance: 'visionary powerful look, master builder presence', energy: 'manifestation and mastery' },
      33: { appearance: 'divine healing presence, unconditional love in eyes', energy: 'spiritual teaching and love' }
    };

    const traits = numerologyTraitsMap[lifePathNumber] || numerologyTraitsMap[1];

    const analysisText = `🔢 Numerological Soulmate Analysis

**Your Numerology Profile:**
• Name: ${formData.fullName}
• Birth Date: ${formData.dateOfBirth}
• Life Path Number: ${lifePathNumber}
• Destiny Number: ${destinyNumber}
• Soulmate Aura Color: ${auraColor}

**Your Soulmate's Energy:**
Based on your Life Path Number ${lifePathNumber}, your destined soulmate embodies the energy of ${traits.energy}. They will complement your soul's journey and bring balance to your life path.`;

    setAnalysis(analysisText);

    return `Clean professional portrait photograph of a beautiful person, ${traits.appearance}. 
    
Style: Ultra realistic, high resolution portrait photography, clean white or soft gradient background.
Face: Clear symmetrical features, natural beauty, genuine warm smile, eyes radiating ${traits.energy}.
Lighting: Soft professional studio lighting, no harsh shadows, clean and bright.
Mood: Warm, approachable, loving, genuine connection.
Quality: 8K resolution, sharp focus, professional headshot style.
Important: Single person, front facing, centered, clean simple background, no text, no watermarks.`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.dateOfBirth || !formData.placeOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const prompt = generateSoulmatePrompt();

      const { data, error } = await supabase.functions.invoke('generate-soulmate-image', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        toast.success('Your soulmate portrait has been revealed! ✨');
      } else {
        throw new Error('No image data received');
      }
    } catch (error: any) {
      console.error('Error generating soulmate portrait:', error);
      toast.error('Failed to generate portrait. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `soulmate-portrait-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Portrait downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Destined Soulmate Portrait Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the face of your destined soulmate through the ancient wisdom of astrology and numerology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Birth Details
              </CardTitle>
              <CardDescription>
                Enter your complete birth information for accurate astrological and numerological analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="border-primary/30 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">Used for numerology calculation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="border-primary/30 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">Determines your zodiac sign and life path number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOfBirth">Time of Birth (Optional)</Label>
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                    className="border-primary/30 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">For more accurate rising sign calculation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                  <Input
                    id="placeOfBirth"
                    type="text"
                    placeholder="City, Country"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    required
                    className="border-primary/30 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">Important for astrological calculations</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Revealing Your Soulmate...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Generate Soulmate Portrait
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {generatedImage && (
              <Card className="border-primary/20 shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Destined Soulmate
                    </span>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative group rounded-lg overflow-hidden bg-gradient-to-b from-primary/10 to-background">
                    <img
                      src={generatedImage}
                      alt="Your destined soulmate"
                      className="w-full h-auto max-h-[600px] object-contain rounded-lg"
                      style={{ display: 'block' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Spiritual Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground">
                    {analysis}
                  </div>
                </CardContent>
              </Card>
            )}

            {!generatedImage && !loading && (
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Astrological Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        We analyze your zodiac sign, elemental nature, and planetary positions to understand your romantic energy
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Numerology Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Your Life Path and Destiny Numbers reveal your soul's purpose and ideal partner vibration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">AI Visualization</h3>
                      <p className="text-sm text-muted-foreground">
                        Advanced AI creates a hyper-realistic portrait combining all spiritual insights into a visual manifestation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulmatePortrait;