import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    message: "Your features have been activated. Start exploring your cosmic insights right away!",
    cta_text: "Start Your Reading",
    cta_link: "/love-forecasts",
  });

  const [funnel, setFunnel] = useState({
    initial_buy_url: "",
    upsell_tier1_url: "",
    upsell_tier2_url: "",
    upsell_tier3_url: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [thankYouRes, funnelRes] = await Promise.all([
      supabase.from("platform_settings").select("*").eq("key", "thank_you_page").maybeSingle(),
      supabase.from("platform_settings").select("*").eq("key", "funnel_settings").maybeSingle(),
    ]);

    if (thankYouRes.data?.value) {
      const val = thankYouRes.data.value as any;
      setThankYou({
        title: val.title || thankYou.title,
        message: val.message || thankYou.message,
        cta_text: val.cta_text || thankYou.cta_text,
        cta_link: val.cta_link || thankYou.cta_link,
      });
    }

    if (funnelRes.data?.value) {
      const val = funnelRes.data.value as any;
      setFunnel({
        initial_buy_url: val.initial_buy_url || "",
        upsell_tier1_url: val.upsell_tier1_url || "",
        upsell_tier2_url: val.upsell_tier2_url || "",
        upsell_tier3_url: val.upsell_tier3_url || "",
      });
    }
  };

  const saveSetting = async (key: string, value: any) => {
    setLoading(true);
    try {
      const { data: existing } = await supabase.from("platform_settings").select("id").eq("key", key).maybeSingle();
      if (existing) {
        await supabase.from("platform_settings").update({ value: value as any, updated_at: new Date().toISOString() }).eq("key", key);
      } else {
        await supabase.from("platform_settings").insert({ key, value: value as any });
      }
      toast({ title: "Saved!", description: `Settings updated successfully.` });
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Button>

        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-8">
          Manage Pages & Funnel
        </h1>

        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="funnel">Sales Funnel URLs</TabsTrigger>
            <TabsTrigger value="thankyou">Thank You Page</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>Digistore24 Checkout URLs</CardTitle>
                <p className="text-sm text-muted-foreground">Set the external Digistore24 checkout links for each pricing tier. Leave empty to use default behavior.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Initial Pricing ($19.99) — Buy Button URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={funnel.initial_buy_url}
                    onChange={(e) => setFunnel({ ...funnel, initial_buy_url: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold mb-3">Upsell Page URLs</p>
                </div>
                <div>
                  <Label>Tier 1 — Starter ($19.99) URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={funnel.upsell_tier1_url}
                    onChange={(e) => setFunnel({ ...funnel, upsell_tier1_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tier 2 — Explorer ($69.00) URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={funnel.upsell_tier2_url}
                    onChange={(e) => setFunnel({ ...funnel, upsell_tier2_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tier 3 — Master ($99.99) URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={funnel.upsell_tier3_url}
                    onChange={(e) => setFunnel({ ...funnel, upsell_tier3_url: e.target.value })}
                  />
                </div>
                <Button onClick={() => saveSetting("funnel_settings", funnel)} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Funnel Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thankyou">
            <Card>
              <CardHeader>
                <CardTitle>Thank You Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={thankYou.title} onChange={(e) => setThankYou({ ...thankYou, title: e.target.value })} />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea value={thankYou.message} onChange={(e) => setThankYou({ ...thankYou, message: e.target.value })} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Button Text</Label>
                    <Input value={thankYou.cta_text} onChange={(e) => setThankYou({ ...thankYou, cta_text: e.target.value })} />
                  </div>
                  <div>
                    <Label>Button Link</Label>
                    <Input value={thankYou.cta_link} onChange={(e) => setThankYou({ ...thankYou, cta_link: e.target.value })} />
                  </div>
                </div>
                <Button onClick={() => saveSetting("thank_you_page", thankYou)} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Thank You Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagePages;
