import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagePages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [thankYou, setThankYou] = useState({
    vip_url: "/upsell",
    dashboard_url: "/dashboard",
  });

  const [thankYouVip, setThankYouVip] = useState({
    supplement_url: "",
    dashboard_url: "/dashboard",
  });

  const [funnel, setFunnel] = useState({
    initial_buy_url: "",
    vip_monthly_url: "",
    vip_annual_url: "",
    vip_skip_url: "",
    thankyou_vip_url: "/upsell",
    thankyou_dashboard_url: "/dashboard",
    thankyou_vip_supplement_url: "",
    thankyou_vip_dashboard_url: "/dashboard",
  });

  const [shopUrls, setShopUrls] = useState({
    shop_buy1_url: "",
    shop_buy2_url: "",
    shop_buy3_url: "",
  });

  const [pageContent, setPageContent] = useState({
    contact_content: "",
    imprint_content: "",
    cancellation_content: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [funnelRes, shopRes, contentRes] = await Promise.all([
      supabase.from("platform_settings").select("*").eq("key", "funnel_settings").maybeSingle(),
      supabase.from("platform_settings").select("*").eq("key", "shop_urls").maybeSingle(),
      supabase.from("platform_settings").select("*").eq("key", "page_content").maybeSingle(),
    ]);

    if (funnelRes.data?.value) {
      const val = funnelRes.data.value as any;
      setFunnel({
        initial_buy_url: val.initial_buy_url || "",
        vip_monthly_url: val.vip_monthly_url || "",
        vip_annual_url: val.vip_annual_url || "",
        vip_skip_url: val.vip_skip_url || "",
        thankyou_vip_url: val.thankyou_vip_url || "/upsell",
        thankyou_dashboard_url: val.thankyou_dashboard_url || "/dashboard",
        thankyou_vip_supplement_url: val.thankyou_vip_supplement_url || "",
        thankyou_vip_dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
      });
      setThankYou({
        vip_url: val.thankyou_vip_url || "/upsell",
        dashboard_url: val.thankyou_dashboard_url || "/dashboard",
      });
      setThankYouVip({
        supplement_url: val.thankyou_vip_supplement_url || "",
        dashboard_url: val.thankyou_vip_dashboard_url || "/dashboard",
      });
    }

    if (shopRes.data?.value) {
      const val = shopRes.data.value as any;
      setShopUrls({
        shop_buy1_url: val.shop_buy1_url || "",
        shop_buy2_url: val.shop_buy2_url || "",
        shop_buy3_url: val.shop_buy3_url || "",
      });
    }

    if (contentRes.data?.value) {
      const val = contentRes.data.value as any;
      setPageContent({
        contact_content: val.contact_content || "",
        imprint_content: val.imprint_content || "",
        cancellation_content: val.cancellation_content || "",
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
      toast({ title: "Saved!", description: "Settings updated successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveFunnel = () => {
    saveSetting("funnel_settings", funnel);
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="funnel">Sales Funnel</TabsTrigger>
            <TabsTrigger value="thankyou">Thank You Pages</TabsTrigger>
            <TabsTrigger value="shop">Shop URLs</TabsTrigger>
            <TabsTrigger value="content">Page Content</TabsTrigger>
          </TabsList>

          {/* Sales Funnel Tab */}
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
                    <Label>Buy Button URL (Get My Soulmate Sketch — $19.99)</Label>
                    <Input
                      placeholder="https://www.digistore24.com/product/..."
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
                    <Label>Monthly VIP ($45/month) Button URL</Label>
                    <Input
                      placeholder="https://www.digistore24.com/product/..."
                      value={funnel.vip_monthly_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_monthly_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Annual VIP ($199/year) Button URL</Label>
                    <Input
                      placeholder="https://www.digistore24.com/product/..."
                      value={funnel.vip_annual_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_annual_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>"No Thanks, Skip" Button URL (leave empty for default)</Label>
                    <Input
                      placeholder="https://... or leave empty"
                      value={funnel.vip_skip_url}
                      onChange={(e) => setFunnel({ ...funnel, vip_skip_url: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveFunnel} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Funnel Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* Thank You Pages Tab */}
          <TabsContent value="thankyou">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thank You Page (After Initial $19.99 Purchase)</CardTitle>
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
                  <CardTitle>Thank You Page (After VIP Purchase)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>"Browse Supplements" Button URL</Label>
                    <Input
                      placeholder="https://... or /shop"
                      value={funnel.thankyou_vip_supplement_url}
                      onChange={(e) => setFunnel({ ...funnel, thankyou_vip_supplement_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>"Go to Dashboard" Button URL</Label>
                    <Input
                      placeholder="/dashboard"
                      value={funnel.thankyou_vip_dashboard_url}
                      onChange={(e) => setFunnel({ ...funnel, thankyou_vip_dashboard_url: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveFunnel} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Thank You Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* Shop URLs Tab */}
          <TabsContent value="shop">
            <Card>
              <CardHeader>
                <CardTitle>Shop Product Pricing Button URLs</CardTitle>
                <p className="text-sm text-muted-foreground">Set external checkout URLs for each pricing tier on the shop product page.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Buy 1 Button URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={shopUrls.shop_buy1_url}
                    onChange={(e) => setShopUrls({ ...shopUrls, shop_buy1_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Buy 2 Button URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={shopUrls.shop_buy2_url}
                    onChange={(e) => setShopUrls({ ...shopUrls, shop_buy2_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Buy 3 Button URL</Label>
                  <Input
                    placeholder="https://www.digistore24.com/product/..."
                    value={shopUrls.shop_buy3_url}
                    onChange={(e) => setShopUrls({ ...shopUrls, shop_buy3_url: e.target.value })}
                  />
                </div>
                <Button onClick={() => saveSetting("shop_urls", shopUrls)} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Shop URLs"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Custom Content (leave empty for default)</Label>
                    <Textarea
                      value={pageContent.contact_content}
                      onChange={(e) => setPageContent({ ...pageContent, contact_content: e.target.value })}
                      rows={6}
                      placeholder="Enter custom contact page text..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imprint (Impressum) Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Custom Imprint Content (leave empty for default)</Label>
                    <Textarea
                      value={pageContent.imprint_content}
                      onChange={(e) => setPageContent({ ...pageContent, imprint_content: e.target.value })}
                      rows={10}
                      placeholder="Enter your company details, address, registration info..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cancellation & Refund Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Custom Content (leave empty for default)</Label>
                    <Textarea
                      value={pageContent.cancellation_content}
                      onChange={(e) => setPageContent({ ...pageContent, cancellation_content: e.target.value })}
                      rows={6}
                      placeholder="Enter custom cancellation/refund policy text..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => saveSetting("page_content", pageContent)} disabled={loading} className="gap-2">
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
