import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Video, MessageCircle, Phone, Calendar, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Consultation {
  id: string;
  astrologer_name: string;
  consultation_type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  notes: string;
  created_at: string;
}

const Consultations = () => {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    astrologer_name: '',
    consultation_type: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 30,
    notes: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const astrologers = [
    { name: 'Dr. Priya Sharma', specialty: 'Vedic Astrology', rating: 4.9, price: 50 },
    { name: 'Master Chen Wei', specialty: 'Chinese Astrology', rating: 4.8, price: 60 },
    { name: 'Prof. Sarah Johnson', specialty: 'Western Astrology', rating: 4.7, price: 45 },
    { name: 'Guru Rajesh Kumar', specialty: 'Numerology', rating: 4.9, price: 55 },
    { name: 'Dr. Maria Rodriguez', specialty: 'Tarot & Astrology', rating: 4.6, price: 40 }
  ];

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
    await loadConsultations(session.user.id);
  };

  const loadConsultations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookConsultation = async () => {
    if (!user) return;

    setBooking(true);
    try {
      const selectedAstrologer = astrologers.find(a => a.name === formData.astrologer_name);
      const scheduledAt = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);
      
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: user.id,
          astrologer_name: formData.astrologer_name,
          consultation_type: formData.consultation_type,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: formData.duration_minutes,
          price: selectedAstrologer?.price || 50,
          notes: formData.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      setConsultations([data, ...consultations]);
      setFormData({
        astrologer_name: '',
        consultation_type: '',
        scheduled_date: '',
        scheduled_time: '',
        duration_minutes: 30,
        notes: ''
      });

      toast({
        title: "Consultation Booked",
        description: "Your consultation has been booked successfully. You will receive a confirmation soon.",
      });
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast({
        title: "Error",
        description: "Failed to book consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
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
        <h1 className="text-4xl font-bold mb-2">Astrology Consultations</h1>
        <p className="text-muted-foreground">Book personalized sessions with expert astrologers</p>
      </div>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book Consultation</TabsTrigger>
          <TabsTrigger value="astrologers">Our Astrologers</TabsTrigger>
          <TabsTrigger value="history">My Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a New Consultation</CardTitle>
              <CardDescription>Schedule a personalized astrology session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="astrologer">Select Astrologer</Label>
                  <Select value={formData.astrologer_name} onValueChange={(value) => setFormData({...formData, astrologer_name: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an astrologer" />
                    </SelectTrigger>
                    <SelectContent>
                      {astrologers.map((astrologer) => (
                        <SelectItem key={astrologer.name} value={astrologer.name}>
                          {astrologer.name} - ${astrologer.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Consultation Type</Label>
                  <Select value={formData.consultation_type} onValueChange={(value) => setFormData({...formData, consultation_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="audio">Audio Call</SelectItem>
                      <SelectItem value="chat">Text Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={formData.duration_minutes.toString()} onValueChange={(value) => setFormData({...formData, duration_minutes: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Questions/Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Share your specific questions or areas of interest..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={bookConsultation} 
                disabled={booking || !formData.astrologer_name || !formData.consultation_type || !formData.scheduled_date || !formData.scheduled_time}
                className="w-full"
              >
                {booking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Consultation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="astrologers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {astrologers.map((astrologer) => (
              <Card key={astrologer.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {astrologer.name}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{astrologer.rating}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>{astrologer.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">${astrologer.price}/session</Badge>
                    <Button 
                      variant="outline" 
                      onClick={() => setFormData({...formData, astrologer_name: astrologer.name})}
                    >
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {consultations.length > 0 ? (
            consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(consultation.consultation_type)}
                      {consultation.astrologer_name}
                    </div>
                    <Badge className={getStatusColor(consultation.status)}>
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(consultation.scheduled_at), 'PPP p')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span><br />
                      {consultation.consultation_type.charAt(0).toUpperCase() + consultation.consultation_type.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span><br />
                      {consultation.duration_minutes} minutes
                    </div>
                    <div>
                      <span className="font-medium">Price:</span><br />
                      ${consultation.price}
                    </div>
                    <div>
                      <span className="font-medium">Booked:</span><br />
                      {format(new Date(consultation.created_at), 'PP')}
                    </div>
                  </div>
                  {consultation.notes && (
                    <div className="mt-4">
                      <span className="font-medium">Notes:</span>
                      <p className="text-sm text-muted-foreground mt-1">{consultation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Consultations Yet</CardTitle>
                <CardDescription>
                  You haven't booked any consultations yet. Start by booking your first session!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consultations;