import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Star, Shield, Users, IndianRupee } from 'lucide-react';

const SPECIALIZATIONS = [
  'Vedic Astrology', 'Numerology', 'Tarot Reading', 'Palmistry',
  'Vastu Shastra', 'KP Astrology', 'Horary Astrology', 'Prashna Kundli',
  'Gemstone Consultation', 'Marriage Compatibility', 'Career Guidance', 'Health Astrology'
];

const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

const AstrologerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience_years: '',
    bio: '',
    image_url: '',
    hourly_rate: '',
    languages: ['Hindi', 'English'] as string[],
    intro_video_url: '',
    consultation_types: ['chat'] as string[],
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('astrologer-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('astrologer-images')
        .getPublicUrl(fileName);
      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Photo uploaded successfully!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setImageUploading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleConsultationType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      consultation_types: prev.consultation_types.includes(type)
        ? prev.consultation_types.filter(t => t !== type)
        : [...prev.consultation_types, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization || !formData.hourly_rate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('astrologers').insert({
        user_id: user.id,
        name: formData.name,
        specialization: formData.specialization,
        experience_years: parseInt(formData.experience_years) || 0,
        bio: formData.bio,
        image_url: formData.image_url,
        hourly_rate: parseFloat(formData.hourly_rate),
        languages: formData.languages,
        intro_video_url: formData.intro_video_url,
        consultation_types: formData.consultation_types,
        status: 'pending',
        is_available: false,
        rating: 5.0,
      });
      if (error) throw error;
      toast({
        title: "Registration Submitted! 🎉",
        description: "Your profile is under review. You'll be notified once approved.",
      });
      navigate('/astrologer-dashboard');
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Become an AstroVibe Astrologer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join India's fastest growing astrology platform. Share your wisdom, earn from home, and help thousands find their path.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Set your own rates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">10,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Secure payments</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Fill your details. Profile will be reviewed by admin before going live.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div>
                <Label>Profile Photo *</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
                    {imageUploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Pandit Rajesh Sharma" required />
                </div>
                <div>
                  <Label>Experience (Years) *</Label>
                  <Input type="number" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} placeholder="5" required />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <Label>Specialization *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SPECIALIZATIONS.map(spec => (
                    <Badge
                      key={spec}
                      variant={formData.specialization === spec ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFormData({...formData, specialization: spec})}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label>Languages You Speak *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map(lang => (
                    <Badge
                      key={lang}
                      variant={formData.languages.includes(lang) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleLanguage(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Consultation Types */}
              <div>
                <Label>Consultation Types *</Label>
                <div className="flex gap-4 mt-2">
                  {[
                    { value: 'chat', label: '💬 Chat' },
                    { value: 'audio', label: '📞 Audio Call' },
                    { value: 'video', label: '📹 Video Call' },
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.consultation_types.includes(type.value)}
                        onCheckedChange={() => toggleConsultationType(type.value)}
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Consultation Rate (₹ per hour) *</Label>
                  <Input type="number" value={formData.hourly_rate} onChange={e => setFormData({...formData, hourly_rate: e.target.value})} placeholder="500" required />
                </div>
                <div>
                  <Label>Introduction Video URL (optional)</Label>
                  <Input value={formData.intro_video_url} onChange={e => setFormData({...formData, intro_video_url: e.target.value})} placeholder="https://youtube.com/..." />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label>About You / Bio *</Label>
                <Textarea
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell users about your experience, expertise, and what makes your readings special..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit for Review'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By registering, you agree to our platform terms. Admin will review your profile within 24-48 hours.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AstrologerRegistration;
