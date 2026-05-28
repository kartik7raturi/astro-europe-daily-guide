import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, DollarSign, TrendingUp, Copy, Share2, 
  CheckCircle, Clock, AlertCircle, Gift, BarChart3 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AffiliateAnalytics from "@/components/AffiliateAnalytics";

interface AffiliateData {
  id: string;
  affiliate_code: string;
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  total_referrals: number;
  status: string;
  payment_details: {
    upi_id?: string;
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
  } | null;
}

interface AffiliateOrder {
  id: string;
  order_amount: number;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
}

const Affiliate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [orders, setOrders] = useState<AffiliateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upi_id: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
  });

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAffiliateData = async () => {
    if (!user) return;
    
    try {
      const { data: affiliateData, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (affiliateData) {
        setAffiliate({
          ...affiliateData,
          payment_details: affiliateData.payment_details as AffiliateData['payment_details']
        });
        if (affiliateData.payment_details) {
          const pd = affiliateData.payment_details as AffiliateData['payment_details'];
          setPaymentDetails({
            upi_id: pd?.upi_id || "",
            bank_name: pd?.bank_name || "",
            account_number: pd?.account_number || "",
            ifsc_code: pd?.ifsc_code || "",
          });
        }
        
        // Load affiliate orders
        const { data: ordersData } = await supabase
          .from("affiliate_orders")
          .select("*")
          .eq("affiliate_id", affiliateData.id)
          .order("created_at", { ascending: false });
        
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error("Error loading affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "AV";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const registerAsAffiliate = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setRegistering(true);
    try {
      const affiliateCode = generateAffiliateCode();
      
      const { data, error } = await supabase
        .from("affiliates")
        .insert({
          user_id: user.id,
          affiliate_code: affiliateCode,
        commission_rate: 25.00,
          status: "approved",
        })
        .select()
        .single();

      if (error) throw error;

      setAffiliate({
        ...data,
        payment_details: null
      });
      toast({
        title: "Welcome, Affiliate Partner! 🎉",
        description: "You're approved! Start sharing your link and earn 25% commission.",
      });
    } catch (error: any) {
      console.error("Error registering:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const updatePaymentDetails = async () => {
    if (!affiliate) return;

    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ payment_details: paymentDetails })
        .eq("id", affiliate.id);

      if (error) throw error;

      setAffiliate({ ...affiliate, payment_details: paymentDetails });
      toast({ title: "Payment details updated" });
    } catch (error) {
      console.error("Error updating payment details:", error);
      toast({
        title: "Error",
        description: "Failed to update payment details",
        variant: "destructive",
      });
    }
  };

  const copyAffiliateLink = () => {
    if (!affiliate) return;
    const link = `${window.location.origin}/shop?ref=${affiliate.affiliate_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard!" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-starlight py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Gift className="w-20 h-20 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Earn 25% Commission — Join Free!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Share astrology products and earn ₹25 on every ₹100 sale. Sign in to get started instantly!
          </p>
          <Button variant="cosmic" size="lg" onClick={() => navigate("/auth")}>
            Sign In to Start Earning
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gradient-starlight">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cosmic opacity-10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1 border-primary/40">
              💰 India's Best Affiliate Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-6">
              Earn ₹25 on Every ₹100 Sale
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Join AstroVibe's affiliate program and earn <span className="text-primary font-bold">25% commission</span> on every sale. 
              No approval wait — start earning instantly!
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Share your link → Someone buys → You get paid. It's that simple! 🚀
            </p>
            <Button
              variant="cosmic"
              size="lg"
              className="text-xl px-10 py-6 h-auto"
              onClick={registerAsAffiliate}
              disabled={registering}
            >
              {registering ? "Setting Up..." : "Start Earning Now — It's Free!"}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">✅ Instant approval • No fees • No minimum payout</p>
          </div>
        </section>

        {/* Commission Calculator */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">See How Much You Can Earn 💸</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/30 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-2">5 sales/month</p>
                  <p className="text-4xl font-bold text-primary">₹625+</p>
                  <p className="text-sm text-muted-foreground mt-1">per month</p>
                </CardContent>
              </Card>
              <Card className="border-primary shadow-cosmic bg-card/80">
                <CardContent className="pt-6 text-center">
                  <Badge className="mb-2">Most Common</Badge>
                  <p className="text-muted-foreground mb-2">20 sales/month</p>
                  <p className="text-4xl font-bold text-primary">₹2,500+</p>
                  <p className="text-sm text-muted-foreground mt-1">per month</p>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-2">50 sales/month</p>
                  <p className="text-4xl font-bold text-primary">₹6,250+</p>
                  <p className="text-sm text-muted-foreground mt-1">per month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Sirf 3 Steps Mein Shuru Karo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-cosmic flex items-center justify-center text-primary-foreground font-bold text-xl rounded-br-2xl">1</div>
                <CardContent className="pt-14 text-center">
                  <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Sign Up Free</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button, get your unique link instantly. No wait, no approval needed!
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-cosmic flex items-center justify-center text-primary-foreground font-bold text-xl rounded-br-2xl">2</div>
                <CardContent className="pt-14 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Share Your Link</h3>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp, Instagram, YouTube, blog — share anywhere! Jab koi buy kare, aapko commission mile.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-cosmic flex items-center justify-center text-primary-foreground font-bold text-xl rounded-br-2xl">3</div>
                <CardContent className="pt-14 text-center">
                  <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Get Paid ₹₹₹</h3>
                  <p className="text-sm text-muted-foreground">
                    25% commission seedha aapke UPI ya bank account mein. Track everything in real-time dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Kyun AstroVibe Affiliate Best Hai?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "💰", title: "25% Commission — Highest in Industry", desc: "Dusre platforms 5-10% dete hain, hum dete hain 25%! Har sale pe maximum earning." },
                { icon: "⚡", title: "Instant Approval", desc: "Koi wait nahi, koi rejection nahi. Sign up karo aur turant sharing shuru karo." },
                { icon: "📊", title: "Real-time Analytics Dashboard", desc: "Apni sales, clicks, aur earnings track karo live dashboard pe. Full transparency." },
                { icon: "🏦", title: "Easy Payout via UPI/Bank", desc: "Commission seedha aapke UPI ID ya bank account mein. No minimum payout limit." },
                { icon: "🔗", title: "Lifetime Cookie Tracking", desc: "Ek baar koi aapke link se aaye, toh unki future purchases pe bhi commission milega." },
                { icon: "🎯", title: "High Conversion Products", desc: "Astrology products ki demand bahut zyada hai India mein. Conversion rate bahut acha hai!" },
              ].map((item, idx) => (
                <Card key={idx} className="bg-card/80">
                  <CardContent className="p-6 flex items-start gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-cosmic border-none p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Abhi Join Karo, Abhi Kamana Shuru Karo!
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Free signup • 25% commission • Instant approval • No risk
            </p>
            <Button
              variant="gold"
              size="lg"
              className="text-xl px-10 py-6 h-auto"
              onClick={registerAsAffiliate}
              disabled={registering}
            >
              {registering ? "Setting Up..." : "Join Free — Start Earning 25% 🚀"}
            </Button>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              Affiliate Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your referrals and earnings
            </p>
          </div>
          {getStatusBadge(affiliate.status)}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{affiliate.total_referrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{affiliate.total_earnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">₹{affiliate.pending_earnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold">{affiliate.commission_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Affiliate Link</CardTitle>
            <CardDescription>Share this link to earn commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                readOnly
                value={`${window.location.origin}/shop?ref=${affiliate.affiliate_code}`}
                className="font-mono"
              />
              <Button onClick={copyAffiliateLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your affiliate code: <span className="font-mono font-bold">{affiliate.affiliate_code}</span>
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="analytics">
          <TabsList className="mb-4">
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders">Referred Orders</TabsTrigger>
            <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AffiliateAnalytics 
              orders={orders}
              totalEarnings={affiliate.total_earnings}
              totalReferrals={affiliate.total_referrals}
              commissionRate={affiliate.commission_rate}
            />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Referred Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No referrals yet</p>
                    <p className="text-sm text-muted-foreground">
                      Share your link to start earning
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            Order Amount: ₹{order.order_amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-500">
                            +₹{order.commission_amount}
                          </p>
                          <Badge variant={order.commission_paid ? "default" : "secondary"}>
                            {order.commission_paid ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Add your payment details to receive commissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input
                    id="upi"
                    placeholder="yourname@upi"
                    value={paymentDetails.upi_id}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, upi_id: e.target.value })
                    }
                  />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Or add bank account details
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank">Bank Name</Label>
                      <Input
                        id="bank"
                        placeholder="Bank Name"
                        value={paymentDetails.bank_name}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, bank_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="account">Account Number</Label>
                      <Input
                        id="account"
                        placeholder="Account Number"
                        value={paymentDetails.account_number}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, account_number: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        placeholder="IFSC Code"
                        value={paymentDetails.ifsc_code}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, ifsc_code: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={updatePaymentDetails} variant="cosmic">
                  Save Payment Details
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Affiliate;
