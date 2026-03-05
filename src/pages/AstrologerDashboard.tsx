import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, IndianRupee, Calendar, MessageCircle, Star, TrendingUp, ArrowDownToLine, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AstrologerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [astrologer, setAstrologer] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('upi');
  const [withdrawDetails, setWithdrawDetails] = useState('');

  useEffect(() => {
    if (user) loadData();
    else navigate('/auth');
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      // Get astrologer profile
      const { data: astro } = await supabase
        .from('astrologers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!astro) {
        navigate('/astrologer-register');
        return;
      }
      setAstrologer(astro);

      // Get or create wallet
      let { data: w } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
      if (!w) {
        const { data: newW } = await supabase.from('wallets').insert({ user_id: user.id }).select().single();
        w = newW;
      }
      setWallet(w);

      // Get bookings
      const { data: bks } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('astrologer_id', astro.id)
        .order('created_at', { ascending: false });
      setBookings(bks || []);

      // Get withdrawals
      const { data: wds } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setWithdrawals(wds || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const requestWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > (wallet?.balance || 0)) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from('withdrawal_requests').insert({
        user_id: user!.id,
        amount,
        payment_method: withdrawMethod,
        payment_details: { details: withdrawDetails },
      });
      if (error) throw error;
      toast({ title: "Withdrawal request submitted!", description: "Admin will process within 2-3 business days." });
      setWithdrawAmount('');
      setWithdrawDetails('');
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ status })
        .eq('id', bookingId);
      if (error) throw error;
      toast({ title: `Booking ${status}` });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  if (!astrologer) return null;

  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.astrologer_earning || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Astrologer Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={astrologer.status === 'approved' ? 'default' : 'secondary'}>
              {astrologer.status === 'approved' ? '✅ Approved' : '⏳ Pending Approval'}
            </Badge>
            {astrologer.is_available && <Badge variant="outline" className="text-green-600">🟢 Online</Badge>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">₹{wallet?.balance || 0}</p>
                <p className="text-xs text-muted-foreground">Available Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₹{totalEarnings}</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{completedBookings.length}</p>
                <p className="text-xs text-muted-foreground">Sessions Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{astrologer.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Bookings ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="earnings">Earnings & Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4 mt-4">
          {pendingBookings.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No pending bookings</CardContent></Card>
          ) : (
            pendingBookings.map(booking => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium capitalize">{booking.consultation_type} Consultation</span>
                        <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>{booking.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.scheduled_at), 'PPP p')} • {booking.duration_minutes} min • ₹{booking.amount}
                      </p>
                      {booking.notes && <p className="text-sm mt-1">Notes: {booking.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>Accept</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>Reject</Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <Button size="sm" onClick={() => navigate(`/consultation-chat/${booking.id}`)}>
                            <MessageCircle className="h-4 w-4 mr-1" /> Start Chat
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'completed')}>Mark Complete</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          {completedBookings.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No completed sessions yet</CardContent></Card>
          ) : (
            completedBookings.map(booking => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium capitalize">{booking.consultation_type} • {booking.duration_minutes} min</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(booking.scheduled_at), 'PPP')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{booking.astrologer_earning}</p>
                      {booking.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{booking.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ArrowDownToLine className="h-5 w-5" /> Request Withdrawal</CardTitle>
              <CardDescription>Available balance: ₹{wallet?.balance || 0}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="500" />
                </div>
                <div>
                  <Label>Method</Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{withdrawMethod === 'upi' ? 'UPI ID' : 'Account Details'}</Label>
                  <Input value={withdrawDetails} onChange={e => setWithdrawDetails(e.target.value)} placeholder={withdrawMethod === 'upi' ? 'name@upi' : 'IFSC, Account No'} />
                </div>
              </div>
              <Button onClick={requestWithdrawal} disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}>
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>

          {withdrawals.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Withdrawal History</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {withdrawals.map(w => (
                    <div key={w.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">₹{w.amount}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(w.created_at), 'PPP')}</p>
                      </div>
                      <Badge variant={w.status === 'completed' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {w.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AstrologerDashboard;
