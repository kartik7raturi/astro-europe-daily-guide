import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, Tag, Percent, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  discount_type: string;
  discount_amount: number;
  applicable_to: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
}

const CouponsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [applicableTo, setApplicableTo] = useState<string>("all");

  useEffect(() => {
    checkAdmin();
    loadCoupons();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!data && user.email !== "sankhobusiness@gmail.com") {
      navigate("/");
    }
  };

  const loadCoupons = async () => {
    const { data, error } = await supabase
      .from("coupon_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setCoupons(data.map(c => ({
        ...c,
        discount_type: c.discount_type || 'percentage',
        discount_amount: c.discount_amount || 0,
        applicable_to: c.applicable_to || 'all'
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const couponData = {
      code: (formData.get("code") as string).toUpperCase(),
      discount_percentage: discountType === 'percentage' ? parseInt(formData.get("discountValue") as string) : 0,
      discount_type: discountType,
      discount_amount: discountType === 'fixed' ? parseFloat(formData.get("discountValue") as string) : 0,
      applicable_to: applicableTo,
      max_uses: parseInt(formData.get("maxUses") as string),
      expires_at: (formData.get("expiresAt") as string) || null,
      is_active: true,
    };

    if (editingCoupon) {
      const { error } = await supabase
        .from("coupon_codes")
        .update(couponData)
        .eq("id", editingCoupon.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update coupon",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });
    } else {
      const { error } = await supabase
        .from("coupon_codes")
        .insert([couponData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create coupon",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
    }

    setIsDialogOpen(false);
    setEditingCoupon(null);
    setDiscountType("percentage");
    setApplicableTo("all");
    loadCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    const { error } = await supabase
      .from("coupon_codes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Coupon deleted successfully",
    });

    loadCoupons();
  };

  const toggleActive = async (coupon: Coupon) => {
    const { error } = await supabase
      .from("coupon_codes")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive",
      });
      return;
    }

    loadCoupons();
  };

  const getApplicableLabel = (type: string) => {
    switch (type) {
      case 'credits': return 'Credits Only';
      case 'products': return 'Shop Products';
      case 'all': return 'All';
      default: return type;
    }
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === 'fixed') {
      return `₹${coupon.discount_amount}`;
    }
    return `${coupon.discount_percentage}%`;
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDiscountType(coupon.discount_type || 'percentage');
    setApplicableTo(coupon.applicable_to || 'all');
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCoupon(null);
    setDiscountType("percentage");
    setApplicableTo("all");
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Coupons Management
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                All Coupons
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="cosmic" onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Coupon Code</Label>
                      <Input
                        id="code"
                        name="code"
                        placeholder="SAVE20"
                        defaultValue={editingCoupon?.code}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Discount Type</Label>
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Percentage Discount
                            </div>
                          </SelectItem>
                          <SelectItem value="fixed">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4" />
                              Fixed Amount (₹)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="discountValue">
                        {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}
                      </Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        min="0"
                        max={discountType === 'percentage' ? 100 : undefined}
                        step={discountType === 'fixed' ? '0.01' : '1'}
                        defaultValue={
                          editingCoupon 
                            ? (discountType === 'percentage' 
                                ? editingCoupon.discount_percentage 
                                : editingCoupon.discount_amount)
                            : ''
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Applicable To</Label>
                      <Select value={applicableTo} onValueChange={setApplicableTo}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All (Credits & Products)</SelectItem>
                          <SelectItem value="credits">Credits Only</SelectItem>
                          <SelectItem value="products">Shop Products Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="maxUses">Max Uses</Label>
                      <Input
                        id="maxUses"
                        name="maxUses"
                        type="number"
                        min="1"
                        defaultValue={editingCoupon?.max_uses || 100}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                      <Input
                        id="expiresAt"
                        name="expiresAt"
                        type="datetime-local"
                        defaultValue={
                          editingCoupon?.expires_at
                            ? new Date(editingCoupon.expires_at)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                      />
                    </div>
                    <Button type="submit" variant="cosmic" className="w-full">
                      {editingCoupon ? "Update" : "Create"} Coupon
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applicable To</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-bold">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {getDiscountDisplay(coupon)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.discount_type === 'fixed' ? 'Fixed' : 'Percentage'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getApplicableLabel(coupon.applicable_to)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.current_uses} / {coupon.max_uses}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${
                          coupon.is_active
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                        onClick={() => toggleActive(coupon)}
                      >
                        {coupon.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(coupon)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {coupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No coupons found. Create your first coupon!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CouponsManagement;
