import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, MessageCircle, Phone, Video, Search, Filter, Globe, Award, UserPlus, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Consultations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadAstrologers();
    if (user) loadBookings();
  }, [user]);

  const loadAstrologers = async () => {
    try {
      const { data } = await supabase
        .from('astrologers')
        .select('*')
        .eq('is_available', true)
        .eq('status', 'approved')
        .order('rating', { ascending: false });
      setAstrologers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('consultation_bookings')
      .select('*, astrologers(name, image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setBookings(data || []);
  };

  const filteredAstrologers = astrologers
    .filter(a => {
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !a.specialization?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterSpec !== 'all' && a.specialization !== filterSpec) return false;
      if (filterPrice === 'low' && a.hourly_rate > 500) return false;
      if (filterPrice === 'mid' && (a.hourly_rate < 500 || a.hourly_rate > 1000)) return false;
      if (filterPrice === 'high' && a.hourly_rate < 1000) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_low') return (a.hourly_rate || 0) - (b.hourly_rate || 0);
      if (sortBy === 'price_high') return (b.hourly_rate || 0) - (a.hourly_rate || 0);
      if (sortBy === 'experience') return (b.experience_years || 0) - (a.experience_years || 0);
      return 0;
    });

  const specializations = [...new Set(astrologers.map(a => a.specialization).filter(Boolean))];

  const getTypeIcon = (type: string) => {
    if (type === 'video') return <Video className="h-4 w-4" />;
    if (type === 'audio') return <Phone className="h-4 w-4" />;
    return <MessageCircle className="h-4 w-4" />;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Talk to Expert Astrologers</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Get personalized guidance from India's top Vedic astrologers via chat, audio, or video call. Pay securely, consult instantly.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" onClick={() => navigate('/astrologer-register')}>
            <UserPlus className="h-4 w-4 mr-2" /> Become an Astrologer
          </Button>
          {user && (
            <Button variant="outline" onClick={() => navigate('/astrologer-dashboard')}>
              Astrologer Dashboard
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Astrologers</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6 mt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or specialization..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterSpec} onValueChange={setFilterSpec}>
              <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Specialization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map(s => <SelectItem key={s} value={s!}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Price" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under ₹500/hr</SelectItem>
                <SelectItem value="mid">₹500-₹1000/hr</SelectItem>
                <SelectItem value="high">Above ₹1000/hr</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price_low">Price: Low-High</SelectItem>
                <SelectItem value="price_high">Price: High-Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground">{filteredAstrologers.length} astrologers found</p>

          {filteredAstrologers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No astrologers match your filters. Try adjusting your search.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.map(astrologer => {
                const languages = astrologer.languages || ['Hindi', 'English'];
                const types = astrologer.consultation_types || ['chat'];
                return (
                  <Card key={astrologer.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/astrologer/${astrologer.id}`)}>
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                      {astrologer.image_url ? (
                        <img src={astrologer.image_url} alt={astrologer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary">{astrologer.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-lg">
                        {astrologer.name}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{astrologer.rating}</span>
                        </div>
                      </CardTitle>
                      <CardDescription>{astrologer.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Award className="h-3 w-3" />
                        <span>{astrologer.experience_years} yrs</span>
                        <Globe className="h-3 w-3 ml-2" />
                        <span>{languages.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {types.includes('chat') && <Badge variant="outline" className="text-xs"><MessageCircle className="h-3 w-3 mr-1" />Chat</Badge>}
                        {types.includes('audio') && <Badge variant="outline" className="text-xs"><Phone className="h-3 w-3 mr-1" />Audio</Badge>}
                        {types.includes('video') && <Badge variant="outline" className="text-xs"><Video className="h-3 w-3 mr-1" />Video</Badge>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">₹{astrologer.hourly_rate}/hr</span>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4 mt-4">
          {!user ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Please login to see your bookings</p>
                <Button onClick={() => navigate('/auth')}>Login</Button>
              </CardContent>
            </Card>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No bookings yet. Browse astrologers and book your first consultation!
              </CardContent>
            </Card>
          ) : (
            bookings.map(booking => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {booking.astrologers?.image_url ? (
                        <img src={booking.astrologers.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                          {booking.astrologers?.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{booking.astrologers?.name || 'Astrologer'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getTypeIcon(booking.consultation_type)}
                          <span className="capitalize">{booking.consultation_type}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{format(new Date(booking.scheduled_at), 'PPP p')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">₹{booking.amount}</span>
                      <Badge variant={
                        booking.status === 'completed' ? 'default' : 
                        booking.status === 'cancelled' ? 'destructive' : 'secondary'
                      }>
                        {booking.status}
                      </Badge>
                      {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/consultation-chat/${booking.id}`); }}>
                          <MessageCircle className="h-4 w-4 mr-1" /> Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consultations;
