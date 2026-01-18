import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  link_url: string;
}

interface SponsorBannerProps {
  page: string;
}

const SponsorBanner = ({ page }: SponsorBannerProps) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    loadSponsors();
  }, [page]);

  const loadSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("id, name, image_url, link_url, pages")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading sponsors:", error);
      return;
    }

    // Filter sponsors that include this page
    const filteredSponsors = (data || []).filter((sponsor: any) => 
      sponsor.pages && sponsor.pages.includes(page)
    );

    setSponsors(filteredSponsors);
  };

  if (sponsors.length === 0) return null;

  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto px-4">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.link_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block relative group mb-4 last:mb-0"
          >
            <div className="relative overflow-hidden rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-all">
              <img
                src={sponsor.image_url}
                alt={sponsor.name}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-3 h-3" />
                Sponsored
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SponsorBanner;
