import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars, FileText, Info, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-starlight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FileText className="h-12 w-12 text-primary animate-glow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Please read these terms carefully before using our astrological services.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About Our Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                astrovibe.online provides astrological readings and guidance based on traditional Indian 
                astrological practices. Our services are intended for entertainment, personal insight, 
                and spiritual guidance purposes.
              </p>
              <p className="text-muted-foreground">
                By using our service, you acknowledge that astrological readings are interpretive 
                in nature and should not be considered as factual predictions or professional advice 
                for medical, legal, financial, or other important life decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Important Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong>Entertainment Purpose:</strong> Our readings are for entertainment, 
                  self-reflection, and spiritual guidance. They should not replace professional 
                  advice from qualified practitioners.
                </li>
                <li>
                  <strong>Personal Responsibility:</strong> You maintain full responsibility 
                  for your life decisions. Our readings are meant to inspire and guide, 
                  not to dictate your choices.
                </li>
                <li>
                  <strong>Cultural Respect:</strong> Our interpretations honor Indian 
                  astrological traditions while respecting diverse cultural backgrounds 
                  within India.
                </li>
                <li>
                  <strong>No Guarantees:</strong> We cannot guarantee specific outcomes 
                  or the accuracy of future predictions, as astrology is an interpretive art.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Use of Our Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You agree to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Provide accurate birth information for the most relevant readings</li>
                <li>• Use our service responsibly and for personal growth</li>
                <li>• Respect the interpretive nature of astrological guidance</li>
                <li>• Not rely solely on astrological advice for important life decisions</li>
                <li>• Maintain respect for the cultural traditions we honor</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The content, design, and methodologies used in our readings are proprietary 
                to astrovibe.online. While we draw from traditional Indian astrological practices, 
                our specific interpretations and presentation are our intellectual property.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>60-Day Money-Back Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                We stand behind every AstroVibe purchase with a full <strong>60-day money-back guarantee</strong>.
                If you are not satisfied with your purchase for any reason, simply email us within
                60 days of your order date and we will process a complete refund — no questions asked.
              </p>
              <p>
                Refund requests are honoured for all digital products, memberships and PLR packages
                sold on astrovibe.online. Refunds are issued to your original payment method by our
                retailer (JVZoo) and typically appear within 5–10 business days.
              </p>
              <p>
                To request a refund, contact <strong>andrewjimmer692@gmail.com</strong> with your
                order ID and the email used at checkout.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-cosmic/10 border-primary/30">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-foreground mb-2">
                  <strong>Questions about these terms?</strong>
                </p>
                <p className="text-muted-foreground">
                  Contact us at sankhobusiness@gmail.com for clarification on any aspect of our terms of service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;