import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Star, Heart, Sparkles, Crown, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string | null;
  features: string[];
  credits: number | null;
  sketches: number | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  display_order: number | null;
  icon: string | null;
  gradient: string | null;
}

const PlansManagement = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFeaturesInput(plan.features.join('\n'));
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan({
      id: '',
      name: '',
      price: 0,
      period: 'one-time',
      description: '',
      features: [],
      credits: 0,
      sketches: 0,
      is_active: true,
      is_popular: false,
      display_order: plans.length + 1,
      icon: 'Star',
      gradient: 'bg-gradient-cosmic'
    });
    setFeaturesInput('');
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPlan) return;

    const features = featuresInput.split('\n').filter(f => f.trim());
    const planData = {
      ...editingPlan,
      features
    };

    try {
      if (editingPlan.id) {
        const { error } = await supabase
          .from('pricing_plans')
          .update(planData)
          .eq('id', editingPlan.id);

        if (error) throw error;
        toast.success('Plan updated successfully');
      } else {
        const { id, ...insertData } = planData;
        const { error } = await supabase
          .from('pricing_plans')
          .insert(insertData);

        if (error) throw error;
        toast.success('Plan created successfully');
      }

      setIsDialogOpen(false);
      loadPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Plan deleted successfully');
      loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const toggleActive = async (plan: PricingPlan) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .update({ is_active: !plan.is_active })
        .eq('id', plan.id);

      if (error) throw error;
      loadPlans();
    } catch (error) {
      console.error('Error toggling plan:', error);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pricing Plans Management</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Plan
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIconComponent(plan.icon)}
                      <span className="font-medium">{plan.name}</span>
                      {plan.is_popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>₹{plan.price}</TableCell>
                  <TableCell>{plan.period}</TableCell>
                  <TableCell>{plan.credits || 0}</TableCell>
                  <TableCell>{plan.features.length} features</TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.is_active || false}
                      onCheckedChange={() => toggleActive(plan)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan?.id ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    value={editingPlan.period}
                    onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                    placeholder="e.g., one-time, monthly, forever"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credits</Label>
                  <Input
                    type="number"
                    value={editingPlan.credits || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, credits: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sketches</Label>
                  <Input
                    type="number"
                    value={editingPlan.sketches || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, sketches: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingPlan.display_order || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  rows={6}
                  placeholder="Enter each feature on a new line"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={editingPlan.icon || 'Star'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, icon: e.target.value })}
                  >
                    <option value="Star">Star</option>
                    <option value="Heart">Heart</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Crown">Crown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Gradient</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={editingPlan.gradient || 'bg-gradient-cosmic'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, gradient: e.target.value })}
                  >
                    <option value="bg-gradient-cosmic">Cosmic</option>
                    <option value="bg-gradient-gold">Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.is_active || false}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.is_popular || false}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_popular: checked })}
                  />
                  <Label>Popular (Show Badge)</Label>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Save Plan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManagement;
