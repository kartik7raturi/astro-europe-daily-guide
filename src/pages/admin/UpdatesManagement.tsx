import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Plus, X, Image, Link, Type, Users, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Recipient {
  email: string;
  name: string;
  selected: boolean;
}

const UpdatesManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);

  // Email fields
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("AstroVibe");
  const [message, setMessage] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [fontSize, setFontSize] = useState("16");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Recipients
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [user]);

  const checkAdminAndLoadUsers = async () => {
    if (!user) { navigate("/auth"); return; }
    
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData && user.email !== "sankhobusiness@gmail.com") {
      navigate("/"); return;
    }

    // Load subscribers
    const { data: subs } = await supabase
      .from("subscribers")
      .select("email, subscribed")
      .eq("subscribed", true);

    // Load profiles with emails from newsletter
    const { data: newsletter } = await supabase
      .from("newsletter_subscribers")
      .select("email, subscribed")
      .eq("subscribed", true);

    const emailSet = new Set<string>();
    const recipientList: Recipient[] = [];

    subs?.forEach(s => {
      if (!emailSet.has(s.email)) {
        emailSet.add(s.email);
        recipientList.push({ email: s.email, name: s.email.split("@")[0], selected: false });
      }
    });

    newsletter?.forEach(n => {
      if (!emailSet.has(n.email)) {
        emailSet.add(n.email);
        recipientList.push({ email: n.email, name: n.email.split("@")[0], selected: false });
      }
    });

    setRecipients(recipientList);
    setLoading(false);
  };

  const addManualRecipient = () => {
    if (!manualEmail.trim()) return;
    if (recipients.find(r => r.email === manualEmail.trim())) {
      toast({ title: "Duplicate", description: "This email is already in the list", variant: "destructive" });
      return;
    }
    setRecipients(prev => [...prev, { 
      email: manualEmail.trim(), 
      name: manualName.trim() || manualEmail.split("@")[0], 
      selected: true 
    }]);
    setManualEmail("");
    setManualName("");
  };

  const toggleRecipient = (index: number) => {
    setRecipients(prev => prev.map((r, i) => i === index ? { ...r, selected: !r.selected } : r));
  };

  const toggleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setRecipients(prev => prev.map(r => ({ ...r, selected: newVal })));
  };

  const removeRecipient = (index: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  };

  const insertImage = () => {
    if (!imageUrl) return;
    setMessage(prev => prev + `\n<img src="${imageUrl}" alt="Email image" style="max-width:100%;border-radius:8px;margin:12px 0;" />\n`);
    setImageUrl("");
    toast({ title: "Image added to email body" });
  };

  const insertLink = () => {
    if (!linkUrl) return;
    setMessage(prev => prev + `\n<a href="${linkUrl}" style="color:#8b5cf6;text-decoration:underline;">${linkText || linkUrl}</a>\n`);
    setLinkUrl("");
    setLinkText("");
    toast({ title: "Link added to email body" });
  };

  const buildHtml = () => {
    const contentHtml = message.replace(/\n/g, "<br/>");
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background-color:${bgColor};font-family:${fontFamily};">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#8b5cf6;font-size:28px;margin:0;">✨ AstroVibe Updates ✨</h1>
    </div>
    <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:24px;border:1px solid rgba(139,92,246,0.2);">
      <p style="color:${fontColor};font-size:${fontSize}px;line-height:1.6;margin:0;">
        Hi {{name}},
      </p>
      <div style="color:${fontColor};font-size:${fontSize}px;line-height:1.6;margin-top:16px;">
        ${contentHtml}
      </div>
    </div>
    <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid rgba(139,92,246,0.2);">
      <p style="color:#888;font-size:12px;">© ${new Date().getFullYear()} AstroVibe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  };

  const sendBulkEmail = async () => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) {
      toast({ title: "No recipients selected", variant: "destructive" });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Subject and message are required", variant: "destructive" });
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("send-bulk-email", {
        body: {
          recipients: selected.map(r => ({ email: r.email, name: r.name })),
          subject,
          htmlContent: buildHtml(),
          fromName,
        },
      });

      if (error) throw error;

      setSendResult({ sent: data.sent, failed: data.failed });
      toast({
        title: `Emails sent: ${data.sent}/${selected.length}`,
        description: data.failed > 0 ? `${data.failed} failed` : "All sent successfully!",
      });
    } catch (err: any) {
      toast({ title: "Error sending emails", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const selectedCount = recipients.filter(r => r.selected).length;
  const filteredRecipients = recipients.filter(r =>
    r.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Mail className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Email Updates
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Compose */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Compose Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>From Name</Label>
                  <Input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="AstroVibe" />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="🌟 Exciting updates from AstroVibe!" />
                </div>
                <div>
                  <Label>Message (supports HTML, use {"{{name}}"} for personalization)</Label>
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write your message here... Use {{name}} to personalize."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Styling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Font & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                        <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                        <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                        <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                        <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Size (px)</Label>
                    <Input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} min="12" max="32" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={fontColor} onChange={e => setFontColor(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={bgColor} onChange={e => setBgColor(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insert Image / Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" /> Media & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <div className="flex gap-2">
                    <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
                    <Button onClick={insertImage} size="sm" variant="outline"><Image className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div>
                  <Label>Link URL</Label>
                  <div className="flex gap-2">
                    <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" />
                    <Input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Link text" className="w-32" />
                    <Button onClick={insertLink} size="sm" variant="outline"><Link className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Recipients */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> Recipients
                  <Badge variant="secondary" className="ml-auto">{selectedCount} selected</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add manual */}
                <div className="flex gap-2">
                  <Input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Name" className="w-28" />
                  <Input value={manualEmail} onChange={e => setManualEmail(e.target.value)} placeholder="email@example.com" />
                  <Button onClick={addManualRecipient} size="sm" variant="outline"><Plus className="w-4 h-4" /></Button>
                </div>

                <div className="flex items-center gap-2">
                  <Input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search users..." className="flex-1" />
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} id="selectAll" />
                    <Label htmlFor="selectAll" className="text-sm whitespace-nowrap">Select All</Label>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                  {filteredRecipients.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">No users found. Add manually above.</p>
                  ) : (
                    filteredRecipients.map((r, i) => {
                      const realIndex = recipients.indexOf(r);
                      return (
                        <div key={r.email} className="flex items-center gap-2 p-2 rounded-lg border bg-card/50">
                          <Checkbox checked={r.selected} onCheckedChange={() => toggleRecipient(realIndex)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{r.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeRecipient(realIndex)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={buildHtml().replace("{{name}}", "Preview User")}
                    className="w-full h-[300px]"
                    title="Email Preview"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Send */}
            {sendResult && (
              <Card className="border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {sendResult.failed === 0 ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{sendResult.sent} emails sent successfully</p>
                      {sendResult.failed > 0 && <p className="text-sm text-muted-foreground">{sendResult.failed} failed</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={sendBulkEmail}
              disabled={sending || selectedCount === 0}
              variant="cosmic"
              className="w-full"
              size="lg"
            >
              {sending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending to {selectedCount} recipients...</>
              ) : (
                <><Send className="w-5 h-5 mr-2" /> Send to {selectedCount} Recipients</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatesManagement;
