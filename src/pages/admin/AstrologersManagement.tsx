import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Astrologer {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  bio: string;
  image_url: string;
  rating: number;
  hourly_rate: number;
  is_available: boolean;
}

const AstrologersManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAstrologer, setEditingAstrologer] = useState<Astrologer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience_years: "",
    bio: "",
    image_url: "",
    rating: "5.0",
    hourly_rate: "",
  });

  useEffect(() => {
    checkAdmin();
    loadAstrologers();
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
      .single();

    if (!data) {
      navigate("/");
    }
  };

  const loadAstrologers = async () => {
    const { data } = await supabase
      .from("astrologers")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAstrologers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const astrologerData = {
      name: formData.name,
      specialization: formData.specialization,
      experience_years: parseInt(formData.experience_years),
      bio: formData.bio,
      image_url: formData.image_url,
      rating: parseFloat(formData.rating),
      hourly_rate: parseFloat(formData.hourly_rate),
      is_available: true,
    };

    if (editingAstrologer) {
      const { error } = await supabase
        .from("astrologers")
        .update(astrologerData)
        .eq("id", editingAstrologer.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Astrologer updated successfully" });
      }
    } else {
      const { error } = await supabase.from("astrologers").insert(astrologerData);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Astrologer created successfully" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
    loadAstrologers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this astrologer?")) return;

    const { error } = await supabase.from("astrologers").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Astrologer deleted successfully" });
      loadAstrologers();
    }
  };

  const handleEdit = (astrologer: Astrologer) => {
    setEditingAstrologer(astrologer);
    setFormData({
      name: astrologer.name,
      specialization: astrologer.specialization || "",
      experience_years: astrologer.experience_years?.toString() || "",
      bio: astrologer.bio || "",
      image_url: astrologer.image_url || "",
      rating: astrologer.rating?.toString() || "5.0",
      hourly_rate: astrologer.hourly_rate?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      experience_years: "",
      bio: "",
      image_url: "",
      rating: "5.0",
      hourly_rate: "",
    });
    setEditingAstrologer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              Astrologers Management
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="cosmic" onClick={resetForm}>
                <Plus className="w-5 h-5 mr-2" />
                Add Astrologer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAstrologer ? "Edit Astrologer" : "Add New Astrologer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Experience (Years)</Label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Hourly Rate (₹)</Label>
                  <Input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="cosmic" className="w-full">
                  {editingAstrologer ? "Update" : "Create"} Astrologer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astrologers.map((astrologer) => (
            <Card key={astrologer.id}>
              <CardHeader>
                <CardTitle>{astrologer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{astrologer.specialization}</p>
                <p className="text-sm mb-2">Experience: {astrologer.experience_years} years</p>
                <p className="text-sm mb-2">Rating: {astrologer.rating}/5</p>
                <p className="text-lg font-bold text-primary mb-4">₹{astrologer.hourly_rate}/hr</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(astrologer)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(astrologer.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologersManagement;