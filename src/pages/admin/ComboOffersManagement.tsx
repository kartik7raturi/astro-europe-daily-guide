import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Percent, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ComboOffer {
  id: string;
  min_quantity: number;
  discount_percentage: number;
  description: string;
  is_active: boolean;
}

const ComboOffersManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<ComboOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ComboOffer | null>(null);
  const [formData, setFormData] = useState({
    min_quantity: 2,
    discount_percentage: 10,
    description: '',
    is_active: true
  });

  useEffect(() => {
    checkAdminAndLoad();
  }, [user]);

  const checkAdminAndLoad = async () => {
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

    if (!data) {
      navigate("/");
      return;
    }

    loadOffers();
  };

  const loadOffers = async () => {
    try {
      const { data, error } = await supabase
        .from("combo_offers")
        .select("*")
        .order("min_quantity", { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast({
        title: "Error",
        description: "Failed to load combo offers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingOffer) {
        const { error } = await supabase
          .from("combo_offers")
          .update({
            min_quantity: formData.min_quantity,
            discount_percentage: formData.discount_percentage,
            description: formData.description,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingOffer.id);

        if (error) throw error;
        toast({ title: "Offer updated successfully" });
      } else {
        const { error } = await supabase
          .from("combo_offers")
          .insert({
            min_quantity: formData.min_quantity,
            discount_percentage: formData.discount_percentage,
            description: formData.description,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast({ title: "Offer created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      loadOffers();
    } catch (error) {
      console.error("Error saving offer:", error);
      toast({
        title: "Error",
        description: "Failed to save combo offer",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const { error } = await supabase
        .from("combo_offers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Offer deleted successfully" });
      loadOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (offer: ComboOffer) => {
    setEditingOffer(offer);
    setFormData({
      min_quantity: offer.min_quantity,
      discount_percentage: offer.discount_percentage,
      description: offer.description || '',
      is_active: offer.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      min_quantity: 2,
      discount_percentage: 10,
      description: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Combo Offers Management</h1>
            <p className="text-muted-foreground">Manage quantity-based discount offers</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mb-6" variant="cosmic">
              <Plus className="w-4 h-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? "Edit Combo Offer" : "Create Combo Offer"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="min_quantity">Minimum Quantity</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  min="2"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Buy 2 items and get 10% discount"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full" variant="cosmic">
                {editingOffer ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className={!offer.is_active ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Percent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Buy {offer.min_quantity}+ items - {offer.discount_percentage}% OFF
                      </h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                      <span className={`text-sm ${offer.is_active ? 'text-green-500' : 'text-red-500'}`}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(offer)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(offer.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {offers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Percent className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No combo offers yet. Create one to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboOffersManagement;
