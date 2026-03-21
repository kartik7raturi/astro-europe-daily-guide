import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagePages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [thankYou, setThankYou] = useState({
    title: "Thank You for Your Purchase! 🎉",
    message: "Your credits have been activated. Start exploring your cosmic insights right away!",
    cta_text: "Start Your Reading",
    cta_link: "/love-forecasts",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("key", "thank_you_page")
      .maybeSingle();

    if (data?.value) {
      const val = data.value as any;
      setThankYou({
        title: val.title || thankYou.title,
        message: val.message || thankYou.message,
        cta_text: val.cta_text || thankYou.cta_text,
        cta_link: val.cta_link || thankYou.cta_link,
      });
    }
  };

  const saveThankYouPage = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("platform_settings")
        .select("id")
        .eq("key", "thank_you_page")
        .maybeSingle();

      if (existing) {
        await supabase
          .from("platform_settings")
          .update({ value: thankYou as any, updated_at: new Date().toISOString() })
          .eq("key", "thank_you_page");
      } else {
        await supabase
          .from("platform_settings")
          .insert({ key: "thank_you_page", value: thankYou as any });
      }

      toast({ title: "Saved!", description: "Thank You page settings updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Button>

        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-8">
          Manage Pages
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Thank You Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={thankYou.title}
                onChange={(e) => setThankYou({ ...thankYou, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={thankYou.message}
                onChange={(e) => setThankYou({ ...thankYou, message: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={thankYou.cta_text}
                  onChange={(e) => setThankYou({ ...thankYou, cta_text: e.target.value })}
                />
              </div>
              <div>
                <Label>Button Link</Label>
                <Input
                  value={thankYou.cta_link}
                  onChange={(e) => setThankYou({ ...thankYou, cta_link: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={saveThankYouPage} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagePages;
