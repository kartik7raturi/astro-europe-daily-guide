import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, MessageCircle, Phone, Video, Clock, Globe, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const AstrologerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [astrologer, setAstrologer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingForm, setBookingForm] = useState({
    type: 'chat',
    date: '',
    time: '',
    duration: '30',
    notes: '',
  });

  useEffect(() => {
    loadAstrologer();
  }, [id]);

  const loadAstrologer = async () => {
    try {
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setAstrologer(data);

      // Load reviews for this astrologer
      const { data: bks } = await supabase
        .from('consultation_bookings')
        .select('rating, review_text, created_at')
        .eq('astrologer_id', id!)
        .not('rating', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
      setReviews(bks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!bookingForm.date || !bookingForm.time) {
      toast({ title: "Please select date and time", variant: "destructive" });
      return;
    }
    setBooking(true);
    try {
      // Get commission
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'commission_percentage')
        .single();
      const commissionPct = (settings?.value as any)?.value || 20;

      const durationHours = parseInt(bookingForm.duration) / 60;
      const amount = Math.round((astrologer.hourly_rate || 500) * durationHours);
      const platformCommission = Math.round(amount * commissionPct / 100);
      const astrologerEarning = amount - platformCommission;

      const scheduledAt = new Date(`${bookingForm.date}T${bookingForm.time}`);

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, currency: 'INR', planName: `Consultation with ${astrologer.name}` }
      });

      if (orderError) throw orderError;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AstroVibe Consultation',
        description: `${bookingForm.type} consultation with ${astrologer.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Create booking after payment
          const { data: bk, error: bkError } = await supabase
            .from('consultation_bookings')
            .insert({
              user_id: user.id,
              astrologer_id: astrologer.id,
              consultation_type: bookingForm.type,
              scheduled_at: scheduledAt.toISOString(),
              duration_minutes: parseInt(bookingForm.duration),
              amount,
              platform_commission: platformCommission,
              astrologer_earning: astrologerEarning,
              payment_status: 'paid',
              payment_id: response.razorpay_payment_id,
              notes: bookingForm.notes,
              status: 'pending',
            })
            .select()
            .single();

          if (bkError) throw bkError;

          toast({
            title: "Booking Confirmed! 🎉",
            description: "Payment successful. The astrologer will confirm your session soon.",
          });
          navigate('/consultations');
        },
        prefill: { email: user.email },
        theme: { color: '#6366f1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!astrologer) return <div className="min-h-screen flex items-center justify-center">Astrologer not found</div>;

  const languages = astrologer.languages || ['Hindi', 'English'];
  const consultationTypes = astrologer.consultation_types || ['chat'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {astrologer.image_url ? (
                    <img src={astrologer.image_url} alt={astrologer.name} className="w-32 h-32 rounded-full object-cover border-4 border-primary/20" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">{astrologer.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{astrologer.name}</h1>
                  <p className="text-muted-foreground mt-1">{astrologer.specialization}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{astrologer.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{astrologer.experience_years} years exp</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{languages.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {consultationTypes.includes('chat') && <Badge variant="outline"><MessageCircle className="h-3 w-3 mr-1" /> Chat</Badge>}
                    {consultationTypes.includes('audio') && <Badge variant="outline"><Phone className="h-3 w-3 mr-1" /> Audio</Badge>}
                    {consultationTypes.includes('video') && <Badge variant="outline"><Video className="h-3 w-3 mr-1" /> Video</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader><CardTitle>About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{astrologer.bio || 'No bio available.'}</p>
            </CardContent>
          </Card>

          {/* Intro Video */}
          {astrologer.intro_video_url && (
            <Card>
              <CardHeader><CardTitle>Introduction Video</CardTitle></CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={astrologer.intro_video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardHeader><CardTitle>Reviews ({reviews.length})</CardTitle></CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-4 w-4 ${idx < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                        ))}
                        <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), 'PP')}</span>
                      </div>
                      {r.review_text && <p className="text-sm text-muted-foreground">{r.review_text}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Book Session
                <span className="text-xl text-primary">₹{astrologer.hourly_rate}/hr</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Consultation Type</Label>
                <Select value={bookingForm.type} onValueChange={v => setBookingForm({...bookingForm, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {consultationTypes.includes('chat') && <SelectItem value="chat">💬 Chat</SelectItem>}
                    {consultationTypes.includes('audio') && <SelectItem value="audio">📞 Audio Call</SelectItem>}
                    {consultationTypes.includes('video') && <SelectItem value="video">📹 Video Call</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} min={format(new Date(), 'yyyy-MM-dd')} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} />
              </div>
              <div>
                <Label>Duration</Label>
                <Select value={bookingForm.duration} onValueChange={v => setBookingForm({...bookingForm, duration: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min - ₹{Math.round((astrologer.hourly_rate || 500) * 0.5)}</SelectItem>
                    <SelectItem value="60">60 min - ₹{astrologer.hourly_rate || 500}</SelectItem>
                    <SelectItem value="90">90 min - ₹{Math.round((astrologer.hourly_rate || 500) * 1.5)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Questions / Notes (optional)</Label>
                <Textarea value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} placeholder="What would you like to discuss?" rows={3} />
              </div>
              <Button className="w-full" size="lg" onClick={handleBooking} disabled={booking}>
                {booking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Pay & Book Now'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Secure payment via Razorpay. 100% refund if astrologer cancels.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AstrologerProfile;
