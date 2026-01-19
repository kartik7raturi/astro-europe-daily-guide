import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, DollarSign, CheckCircle, XCircle, 
  Eye, ArrowLeft, TrendingUp 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Affiliate {
  id: string;
  user_id: string;
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
  created_at: string;
}

interface AffiliateOrder {
  id: string;
  affiliate_id: string;
  order_id: string;
  order_amount: number;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
}

const AffiliateManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [affiliateOrders, setAffiliateOrders] = useState<AffiliateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    checkAdminAndLoad();
  }, [user]);

  const checkAdminAndLoad = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadAffiliates();
    } catch (error) {
      console.error("Error checking admin:", error);
      navigate("/");
    }
  };

  const loadAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const affiliatesData = (data || []).map(a => ({
        ...a,
        payment_details: a.payment_details as Affiliate['payment_details']
      }));
      
      setAffiliates(affiliatesData);
      
      // Calculate stats
      setStats({
        total: affiliatesData.length,
        approved: affiliatesData.filter((a) => a.status === "approved").length,
        pending: affiliatesData.filter((a) => a.status === "pending").length,
        totalEarnings: affiliatesData.reduce((sum, a) => sum + Number(a.total_earnings), 0),
      });
    } catch (error) {
      console.error("Error loading affiliates:", error);
      toast({
        title: "Error",
        description: "Failed to load affiliates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAffiliateStatus = async (affiliateId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ status })
        .eq("id", affiliateId);

      if (error) throw error;

      setAffiliates(
        affiliates.map((a) =>
          a.id === affiliateId ? { ...a, status } : a
        )
      );
      
      toast({ title: `Affiliate ${status}` });
    } catch (error) {
      console.error("Error updating affiliate:", error);
      toast({
        title: "Error",
        description: "Failed to update affiliate",
        variant: "destructive",
      });
    }
  };

  const updateCommissionRate = async (affiliateId: string, rate: number) => {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ commission_rate: rate })
        .eq("id", affiliateId);

      if (error) throw error;

      setAffiliates(
        affiliates.map((a) =>
          a.id === affiliateId ? { ...a, commission_rate: rate } : a
        )
      );
      
      toast({ title: "Commission rate updated" });
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast({
        title: "Error",
        description: "Failed to update commission rate",
        variant: "destructive",
      });
    }
  };

  const viewAffiliateOrders = async (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    
    try {
      const { data, error } = await supabase
        .from("affiliate_orders")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAffiliateOrders(data || []);
    } catch (error) {
      console.error("Error loading affiliate orders:", error);
    }
  };

  const markCommissionPaid = async (orderId: string, commissionAmount: number) => {
    try {
      const { error } = await supabase
        .from("affiliate_orders")
        .update({ commission_paid: true })
        .eq("id", orderId);

      if (error) throw error;

      // Also update the affiliate's pending_earnings
      if (selectedAffiliate) {
        const newPendingEarnings = Math.max(0, selectedAffiliate.pending_earnings - commissionAmount);
        await supabase
          .from("affiliates")
          .update({ pending_earnings: newPendingEarnings })
          .eq("id", selectedAffiliate.id);
        
        // Update local state
        setAffiliates(
          affiliates.map((a) =>
            a.id === selectedAffiliate.id ? { ...a, pending_earnings: newPendingEarnings } : a
          )
        );
        setSelectedAffiliate({ ...selectedAffiliate, pending_earnings: newPendingEarnings });
      }

      setAffiliateOrders(
        affiliateOrders.map((o) =>
          o.id === orderId ? { ...o, commission_paid: true } : o
        )
      );
      
      toast({ title: "Commission marked as paid" });
    } catch (error) {
      console.error("Error marking commission paid:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              Affiliate Management
            </h1>
            <p className="text-muted-foreground">
              Manage affiliate partners and commissions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Affiliates</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliates Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Affiliates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell className="font-mono font-bold">
                      {affiliate.affiliate_code}
                    </TableCell>
                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-20"
                          value={affiliate.commission_rate}
                          onChange={(e) =>
                            updateCommissionRate(affiliate.id, parseFloat(e.target.value))
                          }
                        />
                        <span>%</span>
                      </div>
                    </TableCell>
                    <TableCell>{affiliate.total_referrals}</TableCell>
                    <TableCell className="text-green-500">
                      ₹{affiliate.total_earnings}
                    </TableCell>
                    <TableCell className="text-yellow-500">
                      ₹{affiliate.pending_earnings}
                    </TableCell>
                    <TableCell>
                      {new Date(affiliate.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewAffiliateOrders(affiliate)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {affiliate.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                updateAffiliateStatus(affiliate.id, "approved")
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                updateAffiliateStatus(affiliate.id, "rejected")
                              }
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {affiliates.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No affiliates yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Affiliate Orders Dialog */}
        <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Orders for {selectedAffiliate?.affiliate_code}
              </DialogTitle>
            </DialogHeader>
            
            {selectedAffiliate?.payment_details && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Payment Details</h4>
                {selectedAffiliate.payment_details.upi_id && (
                  <p className="text-sm">UPI: {selectedAffiliate.payment_details.upi_id}</p>
                )}
                {selectedAffiliate.payment_details.bank_name && (
                  <p className="text-sm">
                    Bank: {selectedAffiliate.payment_details.bank_name} - 
                    {selectedAffiliate.payment_details.account_number}
                  </p>
                )}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliateOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{order.order_amount}</TableCell>
                    <TableCell className="text-green-500">
                      ₹{order.commission_amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.commission_paid ? "default" : "secondary"}>
                        {order.commission_paid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!order.commission_paid && (
                        <Button
                          size="sm"
                          onClick={() => markCommissionPaid(order.id, order.commission_amount)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {affiliateOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders for this affiliate</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAffiliate(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AffiliateManagement;
