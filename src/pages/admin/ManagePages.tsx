import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, ExternalLink, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagePages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [funnel, setFunnel] = useState({
    initial_buy_url: "",
    vip_silver_url: "",
    vip_gold_url: "",
    vip_skip_url: "",
    thankyou_vip_url: "/upsell",
    thankyou_dashboard_url: "/dashboard",
    thankyou_vip_supplement_url: "",
    thankyou_vip_dashboard_url: "/dashboard",
    money_magnet_url: "",
  });

  const [pageContent, setPageContent] = useState({
    contact_content: "",
    imprint_content: "",
    cancellation_content: "",
    privacy_content: "",
    terms_content: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [funnelRes, contentRes] = await Promise.all([
      supabase.from("platform_settings").select("*").eq("key", "funnel_settings").maybeSingle(),
      supabase.from("platform_settings").select("*").eq("key", "page_content").maybeSingle(),
    ]);

    if (funnelRes.data?.value) {
      const val = funnelRes.data.value as any;
      setFunnel({
        initial_buy_url: val.initial_buy_url || "",
        // Backwards-compat: read silver/gold first, fall back to old monthly/annual keys
        vip_silver_url: val.vip_silver_url || val.vip_monthly_url || "",
        vip_gold_url: val.vip_gold_url || val.vip_annual_url || "",
        vip_skip_url: val.vip_skip_url || "",
        thankyou_vip_url: val.thankyou_vip_url || "/upsell",
        thankyou_dashboard_url: val.thankyou_dashboard_url || "/dashboard",
        thankyou_vip_supplement_url: val.thankyou_vip_supplement_url || "",
        thankyou_vip_dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
        money_magnet_url: val.money_magnet_url || "",
      });
    }

    if (contentRes.data?.value) {
      const val = contentRes.data.value as any;
      setPageContent({
        contact_content: val.contact_content || "",
        imprint_content: val.imprint_content || "",
        cancellation_content: val.cancellation_content || "",
        privacy_content: val.privacy_content || "",
        terms_content: val.terms_content || "",
      });
    }
  };

  const saveSetting = async (key: string, value: any) => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("platform_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();
      if (existing) {
        await supabase
          .from("platform_settings")
          .update({ value: value as any, updated_at: new Date().toISOString() })
          .eq("key", key);
      } else {
        await supabase.from("platform_settings").insert({ key, value: value as any });
      }
      toast({ title: "Saved!", description: "Settings updated successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveFunnel = () => saveSetting("funnel_settings", funnel);
  const saveContent = () => saveSetting("page_content", pageContent);

  // Quick directory of every public page in the funnel for at-a-glance management
  const pageDirectory = [
    { name: "Initial Sales Page ($19.99)", path: "/initial-pricing", buttons: ["Get My Soulmate Sketch — $19.99"] },
    { name: "VIP Upgrade Sales Page", path: "/upsell", buttons: ["Silver $49", "Gold $99", "No thanks (skip)"] },
    { name: "Thank You (after Initial)", path: "/thank-you", buttons: ["Upgrade to VIP", "Go to Dashboard"] },
    { name: "Thank You (after VIP)", path: "/thank-you-vip", buttons: ["Browse Supplements", "Go to Dashboard"] },
    { name: "Imprint (Impressum)", path: "/imprint", buttons: [] },
    { name: "Contact", path: "/contact", buttons: [] },
    { name: "Cancellation & Refund", path: "/cancellation-refund", buttons: [] },
    { name: "Privacy", path: "/privacy", buttons: [] },
    { name: "Terms", path: "/terms", buttons: [] },
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Button>

        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-8">
          Manage Pages & Funnel
        </h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">All Pages</TabsTrigger>
            <TabsTrigger value="funnel">Sales Buttons</TabsTrigger>
            <TabsTrigger value="thankyou">Thank You</TabsTrigger>
            <TabsTrigger value="content">Page Content</TabsTrigger>
          </TabsList>

          {/* Overview: every public page with edit links */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>All Pages</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Open any page in a new tab, or jump to the matching settings tab to edit it.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {pageDirectory.map((p) => (
                  <div
                    key={p.path}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.path}</p>
                      {p.buttons.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Buttons: {p.buttons.join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(p.path, "_blank")}
                        className="gap-1"
                      >
                        <ExternalLink className="h-3 w-3" /> Open
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales button URLs */}
          <TabsContent value="funnel">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" /> Initial Sales Page ($19.99)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Buy Button URL — "Get My Soulmate Sketch — $19.99"</Label>
                    <Input
                      placeholder="https://www.jvzoo.com/b/..."
                      value={funnel.initial_buy_url}
                      onChange={(e) => setFunnel({ ...funnel, initial_buy_url: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" /> VIP Upgrade Page
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Silver Membership ($49) Button URL</Label>
                    <Input
                      placeholder="https://www.jvzoo.com/b/..."
                      value={funnel.vip_silver_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_silver_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Gold Membership ($99) Button URL</Label>
                    <Input
                      placeholder="https://www.jvzoo.com/b/..."
                      value={funnel.vip_gold_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_gold_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>"No Thanks, Skip" Button URL (leave empty → goes to /dashboard)</Label>
                    <Input
                      placeholder="https://... or leave empty"
                      value={funnel.vip_skip_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_skip_url: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" /> Shop — Money Magnet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>"Get Money Magnet" Button URL (JVZoo link)</Label>
                    <Input
                      placeholder="https://www.jvzoo.com/b/..."
                      value={funnel.money_magnet_url}
                      onChange={(e) => setFunnel({ ...funnel, money_magnet_url: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The CTA on /shop opens this URL in a new tab.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveFunnel} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Sales Button URLs"}
              </Button>
            </div>
          </TabsContent>

          {/* Thank You URLs */}
          <TabsContent value="thankyou">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thank You (after Initial $19.99)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>"Upgrade to VIP" Button URL</Label>
                    <Input
                      placeholder="/upsell or https://..."
                      value={funnel.thankyou_vip_url}
                      onChange={(e) => setFunnel({ ...funnel, thankyou_vip_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>"Go to Dashboard" Button URL</Label>
                    <Input
                      placeholder="/dashboard"
                      value={funnel.thankyou_dashboard_url}
                      onChange={(e) => setFunnel({ ...funnel, thankyou_dashboard_url: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thank You (after VIP Purchase)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>"Browse Supplements" Button URL (optional)</Label>
                    <Input
                      placeholder="https://... (leave empty to hide section)"
                      value={funnel.thankyou_vip_supplement_url}
                      onChange={(e) =>
                        setFunnel({ ...funnel, thankyou_vip_supplement_url: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>"Go to Dashboard" Button URL</Label>
                    <Input
                      placeholder="/dashboard"
                      value={funnel.thankyou_vip_dashboard_url}
                      onChange={(e) =>
                        setFunnel({ ...funnel, thankyou_vip_dashboard_url: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveFunnel} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Thank You URLs"}
              </Button>
            </div>
          </TabsContent>

          {/* Page text content */}
          <TabsContent value="content">
            <div className="space-y-6">
              {[
                { key: "contact_content", label: "Contact Page", rows: 6 },
                { key: "imprint_content", label: "Imprint (Impressum)", rows: 10 },
                { key: "cancellation_content", label: "Cancellation & Refund", rows: 8 },
                { key: "privacy_content", label: "Privacy Policy", rows: 8 },
                { key: "terms_content", label: "Terms of Service", rows: 8 },
              ].map((p) => (
                <Card key={p.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> {p.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label>Custom content (leave empty to use default)</Label>
                    <Textarea
                      value={(pageContent as any)[p.key]}
                      onChange={(e) =>
                        setPageContent({ ...pageContent, [p.key]: e.target.value })
                      }
                      rows={p.rows}
                      placeholder={`Enter custom ${p.label.toLowerCase()} text...`}
                    />
                  </CardContent>
                </Card>
              ))}

              <Button onClick={saveContent} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Page Content"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagePages;
