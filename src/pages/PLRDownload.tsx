import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, FileArchive, FileText, Image as ImageIcon, Video, Mail, Code, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface PLRFile {
  icon: typeof Download;
  title: string;
  description: string;
  size: string;
  url: string;
}

const files: PLRFile[] = [
  {
    icon: Code,
    title: "AstroVibe Website Source Code",
    description: "Complete React + Vite + Tailwind codebase with Supabase backend setup",
    size: "48 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-source-v1.zip",
  },
  {
    icon: FileText,
    title: "100+ Astrology Blog Articles",
    description: "DOCX + Markdown — SEO-optimised, ready to publish",
    size: "22 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-blog-pack.zip",
  },
  {
    icon: ImageIcon,
    title: "500+ Social Media Graphics",
    description: "PNG exports + editable Canva templates",
    size: "310 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-social-graphics.zip",
  },
  {
    icon: Video,
    title: "Video Promo Pack",
    description: "30 short-form MP4 promos + raw scripts",
    size: "1.2 GB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-video-pack.zip",
  },
  {
    icon: Mail,
    title: "Email Sequences",
    description: "Welcome, upsell, win-back, abandoned-cart — Mailchimp & Resend ready",
    size: "4 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-email-sequences.zip",
  },
  {
    icon: FileText,
    title: "Lead-Magnet PDFs (×12)",
    description: "Soulmate quiz, numerology guide, daily horoscope sample, and more",
    size: "38 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-lead-magnets.zip",
  },
  {
    icon: FileArchive,
    title: "Ad Creative Bundle",
    description: "Meta + TikTok ready-to-run ad creatives (image + video)",
    size: "180 MB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-ads.zip",
  },
  {
    icon: Crown,
    title: "Commercial PLR Licence Certificate",
    description: "Your personalised licence PDF — proof of resale rights",
    size: "240 KB",
    url: "https://cdn.astrovibe.online/plr/astrovibe-licence.pdf",
  },
];

const PLRDownload = () => {
  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Welcome to the AstroVibe PLR Family! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your payment was successful. All files below are yours forever — bookmark this page or save the links to your password manager.
          </p>
        </div>

        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Your Downloads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border/40 bg-card/40 hover:border-primary/40 transition-colors"
                >
                  <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">{f.size}</p>
                  </div>
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <a href={f.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/30 mb-8">
          <CardContent className="p-6 space-y-3 text-sm">
            <p className="font-semibold">📌 Important — Read First</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Download every file within 30 days. Links remain active long-term but back them up locally.</li>
              <li>• Your commercial licence allows you to rebrand and resell. You may NOT redistribute the raw PLR files as PLR themselves.</li>
              <li>• Need help setting up? Email <a href="mailto:plr@astrovibe.online" className="text-primary underline">plr@astrovibe.online</a>.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PLRDownload;