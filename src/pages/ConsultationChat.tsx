import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, ArrowLeft, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';

const ConsultationChat = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    loadBooking();
  }, [user, bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    // Subscribe to realtime messages
    const channel = supabase
      .channel(`consultation-${bookingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'consultation_messages',
        filter: `booking_id=eq.${bookingId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*, astrologers(*)')
        .eq('id', bookingId!)
        .single();
      if (error) throw error;
      setBooking(data);

      const { data: msgs } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('booking_id', bookingId!)
        .order('created_at', { ascending: true });
      setMessages(msgs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    try {
      const { error } = await supabase.from('consultation_messages').insert({
        booking_id: bookingId!,
        sender_id: user.id,
        message: newMessage.trim(),
      });
      if (error) throw error;
      setNewMessage('');
    } catch (error: any) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const submitReview = async () => {
    if (!rating) return;
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ rating, review_text: reviewText })
        .eq('id', bookingId!);
      if (error) throw error;
      toast({ title: "Review submitted! Thank you 🙏" });
      loadBooking();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>;

  const astrologerName = booking.astrologers?.name || 'Astrologer';
  const isCompleted = booking.status === 'completed';
  const canChat = booking.status === 'confirmed' || booking.status === 'in_progress';

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold">{astrologerName}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(booking.scheduled_at), 'PPP p')}</span>
            <Badge variant="outline" className="text-xs">{booking.status}</Badge>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                {canChat ? 'Start your conversation...' : 'No messages in this consultation.'}
              </div>
            )}
            {messages.map((msg: any) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {format(new Date(msg.created_at), 'p')}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      {canChat && (
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Review Section */}
      {isCompleted && !booking.rating && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Rate this consultation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`h-8 w-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                </button>
              ))}
            </div>
            <Input
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Write a review (optional)..."
            />
            <Button onClick={submitReview} disabled={!rating}>Submit Review</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultationChat;
