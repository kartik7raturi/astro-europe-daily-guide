import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle, XCircle, IndianRupee, Users, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const ConsultationManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [commissionPct, setCommissionPct] = useState('20');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [astroRes, bookRes, wdRes, settingsRes] = await Promise.all([
        supabase.from('astrologers').select('*').order('created_at', { ascending: false }),
        supabase.from('consultation_bookings').select('*, astrologers(name)').order('created_at', { ascending: false }).limit(50),
        supabase.from('withdrawal_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('platform_settings').select('value').eq('key', 'commission_percentage').single(),
      ]);
      setAstrologers(astroRes.data || []);
      setBookings(bookRes.data || []);
      setWithdrawals(wdRes.data || []);
      if ((settingsRes.data?.value as any)?.value) setCommissionPct((settingsRes.data.value as any).value.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveAstrologer = async (id: string) => {
    const { error } = await supabase.from('astrologers').update({ status: 'approved', is_available: true }).eq('id', id);
    if (!error) { toast({ title: "Astrologer approved ✅" }); loadAll(); }
  };

  const rejectAstrologer = async (id: string) => {
    const { error } = await supabase.from('astrologers').update({ status: 'rejected', is_available: false }).eq('id', id);
    if (!error) { toast({ title: "Astrologer rejected" }); loadAll(); }
  };

  const updateCommission = async () => {
    const { error } = await supabase.from('platform_settings').update({ value: { value: parseInt(commissionPct) } }).eq('key', 'commission_percentage');
    if (!error) toast({ title: "Commission updated to " + commissionPct + "%" });
  };

  const processWithdrawal = async (id: string, status: string) => {
    const { error } = await supabase.from('withdrawal_requests').update({ status, processed_at: new Date().toISOString() }).eq('id', id);
    if (!error) { toast({ title: `Withdrawal ${status}` }); loadAll(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const pendingAstrologers = astrologers.filter(a => a.status === 'pending');
  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.platform_commission || 0), 0);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-3xl font-bold">Consultation Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{astrologers.length}</p><p className="text-xs text-muted-foreground">Astrologers</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-xs text-muted-foreground">Total Bookings</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-green-500" /><div><p className="text-2xl font-bold">₹{totalRevenue}</p><p className="text-xs text-muted-foreground">Platform Revenue</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-orange-500" /><div><p className="text-2xl font-bold">{pendingAstrologers.length}</p><p className="text-xs text-muted-foreground">Pending Approvals</p></div></div></CardContent></Card>
        </div>

        <Tabs defaultValue="astrologers">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="astrologers">Astrologers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="astrologers" className="space-y-4 mt-4">
            {astrologers.map(a => (
              <Card key={a.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{a.name.charAt(0)}</div>
                      )}
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-sm text-muted-foreground">{a.specialization} • {a.experience_years}yr exp • ₹{a.hourly_rate}/hr</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.status === 'approved' ? 'default' : a.status === 'rejected' ? 'destructive' : 'secondary'}>{a.status}</Badge>
                      {a.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => approveAstrologer(a.id)}><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => rejectAstrologer(a.id)}><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4 mt-4">
            {bookings.map(b => (
              <Card key={b.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Astrologer:</span><br />{b.astrologers?.name || 'N/A'}</div>
                    <div><span className="text-muted-foreground">Type:</span><br />{b.consultation_type}</div>
                    <div><span className="text-muted-foreground">Amount:</span><br />₹{b.amount} (Commission: ₹{b.platform_commission})</div>
                    <div><span className="text-muted-foreground">Date:</span><br />{format(new Date(b.scheduled_at), 'PP')}</div>
                    <div><Badge variant={b.status === 'completed' ? 'default' : 'secondary'}>{b.status}</Badge></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4 mt-4">
            {withdrawals.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No withdrawal requests</CardContent></Card>
            ) : (
              withdrawals.map(w => (
                <Card key={w.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">₹{w.amount} via {w.payment_method}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(w.created_at), 'PPP')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={w.status === 'completed' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}>{w.status}</Badge>
                        {w.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => processWithdrawal(w.id, 'completed')}><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => processWithdrawal(w.id, 'rejected')}><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Commission</CardTitle>
                <CardDescription>Set the percentage commission deducted from each consultation payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Commission Percentage (%)</Label>
                    <Input type="number" min="0" max="100" value={commissionPct} onChange={e => setCommissionPct(e.target.value)} />
                  </div>
                  <Button onClick={updateCommission} className="mt-6">Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">Current: {commissionPct}% goes to platform, {100 - parseInt(commissionPct)}% goes to astrologer</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultationManagement;
