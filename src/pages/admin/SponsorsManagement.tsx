import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, ArrowLeft, ExternalLink, Image } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  link_url: string;
  pages: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const AVAILABLE_PAGES = [
  { value: "home", label: "Home" },
  { value: "shop", label: "Shop" },
  { value: "blog", label: "Blog" },
  { value: "daily-reading", label: "Daily Reading" },
  { value: "numerology", label: "Numerology" },
  { value: "astro-calendar", label: "Astro Calendar" },
  { value: "lucky-elements", label: "Lucky Elements" },
  { value: "love-forecasts", label: "Love Forecasts" },
  { value: "crush-analyzer", label: "Crush Analyzer" },
  { value: "pricing", label: "Pricing" },
  { value: "consultations", label: "Consultations" },
  { value: "soulmate-analysis", label: "Soulmate Analysis" },
  { value: "life-career", label: "Life & Career" },
];

const SponsorsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    link_url: "",
    pages: [] as string[],
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    checkAdmin();
    loadSponsors();
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

  const loadSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading sponsors:", error);
      return;
    }

    if (data) {
      setSponsors(data as Sponsor[]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `sponsor-${Date.now()}.${fileExt}`;
      const filePath = `sponsors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sponsorData = {
      name: formData.name,
      image_url: formData.image_url,
      link_url: formData.link_url,
      pages: formData.pages,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    if (editingSponsor) {
      const { error } = await supabase
        .from("sponsors")
        .update(sponsorData)
        .eq("id", editingSponsor.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Sponsor updated successfully" });
      }
    } else {
      const { error } = await supabase.from("sponsors").insert(sponsorData);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Sponsor created successfully" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
    loadSponsors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Sponsor deleted successfully" });
      loadSponsors();
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      image_url: sponsor.image_url,
      link_url: sponsor.link_url,
      pages: sponsor.pages || [],
      is_active: sponsor.is_active,
      display_order: sponsor.display_order,
    });
    setIsDialogOpen(true);
  };

  const togglePage = (page: string) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter(p => p !== page)
        : [...prev.pages, page]
    }));
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("sponsors")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      loadSponsors();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image_url: "",
      link_url: "",
      pages: [],
      is_active: true,
      display_order: 0,
    });
    setEditingSponsor(null);
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
              Sponsors Management
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="cosmic" onClick={resetForm}>
                <Plus className="w-5 h-5 mr-2" />
                Add Sponsor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Sponsor Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium Astrology Tools"
                    required
                  />
                </div>
                
                <div>
                  <Label>Sponsor Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Sponsor Preview"
                        className="w-full max-w-md h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 728x90 or 300x250 pixels
                  </p>
                </div>

                <div>
                  <Label>Link URL</Label>
                  <Input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Display on Pages</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AVAILABLE_PAGES.map((page) => (
                      <div key={page.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={page.value}
                          checked={formData.pages.includes(page.value)}
                          onCheckedChange={() => togglePage(page.value)}
                        />
                        <label htmlFor={page.value} className="text-sm cursor-pointer">
                          {page.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <Button type="submit" variant="cosmic" className="w-full" disabled={isUploading}>
                  {editingSponsor ? "Update" : "Create"} Sponsor
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {sponsors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sponsors yet. Add your first sponsor!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.id} className={!sponsor.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{sponsor.name}</span>
                    <Switch
                      checked={sponsor.is_active}
                      onCheckedChange={() => toggleActive(sponsor.id, sponsor.is_active)}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sponsor.image_url && (
                    <img
                      src={sponsor.image_url}
                      alt={sponsor.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <a
                    href={sponsor.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm flex items-center gap-1 mb-3 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {sponsor.link_url.slice(0, 30)}...
                  </a>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {sponsor.pages?.map((page) => (
                      <Badge key={page} variant="secondary" className="text-xs">
                        {page}
                      </Badge>
                    ))}
                    {(!sponsor.pages || sponsor.pages.length === 0) && (
                      <span className="text-xs text-muted-foreground">No pages selected</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sponsor)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(sponsor.id)}
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
        )}
      </div>
    </div>
  );
};

export default SponsorsManagement;
