import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Clock, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CancellationRefund = () => {
  const [customContent, setCustomContent] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "page_content")
      .maybeSingle();
    if (data?.value) {
      const val = data.value as any;
      if (val.cancellation_content) setCustomContent(val.cancellation_content);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <RefreshCw className="h-12 w-12 text-primary animate-glow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-muted-foreground">
            We want you to be completely satisfied with our cosmic services.
          </p>
        </div>

        {customContent ? (
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="whitespace-pre-wrap text-muted-foreground">{customContent}</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You may cancel your service at any time. Here are our terms:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>One-time access purchases:</strong> Cancellations within 60 days of purchase are eligible for a full refund.</li>
                  <li><strong>Subscriptions:</strong> Cancel anytime through your JVZoo account. You retain access until the end of your billing period.</li>
                  <li><strong>How to cancel:</strong> Contact support@astrovibe.online or use your JVZoo buyer account.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-accent" />
                  60-Day Money-Back Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Every purchase is backed by our 60-day money-back guarantee. If you're not happy, email us within 60 days for a full refund — no questions asked.
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Eligible:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Technical issues preventing access</li>
                    <li>• Services not delivered as described</li>
                    <li>• Duplicate charges or billing errors</li>
                    <li>• Cancellation within 60 days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Refund Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Contact support@astrovibe.online within 60 days</li>
                  <li>2. Provide your order number or email</li>
                  <li>3. Refunds are processed within 5–7 business days to your original payment method</li>
                </ol>
                <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                  All payments are processed by JVZoo. Refunds appear from JVZoo on your statement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-cosmic/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-foreground mb-2"><strong>Need help?</strong></p>
                <p className="text-muted-foreground">
                  Email support@astrovibe.online — we respond within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationRefund;
