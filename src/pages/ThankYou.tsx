import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "Soulmate Sketch";
  const [thankYouContent, setThankYouContent] = useState<{
    title: string;
    message: string;
    cta_text: string;
    cta_link: string;
  } | null>(null);

  useEffect(() => {
    loadThankYouContent();
  }, []);

  const loadThankYouContent = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "thank_you_page")
      .maybeSingle();
    
    if (data?.value) {
      setThankYouContent(data.value as any);
    }
  };

  const title = thankYouContent?.title || "Thank You for Your Purchase! 🎉";
  const message = thankYouContent?.message || 
    `Your ${plan} credits have been activated. You can now access all the premium features included in your plan. Start exploring your cosmic insights right away!`;
  const ctaText = thankYouContent?.cta_text || "Start Your Reading";
  const ctaLink = thankYouContent?.cta_link || "/love-forecasts";

  return (
    <div className="min-h-screen bg-gradient-starlight flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <Card className="border-primary/30 text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500" />
                <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-sparkle" />
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-cosmic bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">{message}</p>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">Plan: {plan}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your credits are ready to use immediately
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link to={ctaLink}>
                <Button variant="cosmic" size="lg" className="w-full gap-2">
                  {ctaText} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
