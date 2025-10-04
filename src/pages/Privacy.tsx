import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stars, Shield, Eye, Lock, FileText } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-starlight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-primary animate-glow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Your privacy and the security of your personal information is our top priority.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We collect only the information necessary to provide you with personalized astrological readings:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your name (for personalization)</li>
                <li>• Date and time of birth (for astrological calculations)</li>
                <li>• Place of birth (for geographic considerations)</li>
                <li>• Email address (optional, for contact purposes)</li>
                <li>• Any specific questions or areas of interest you share</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How We Protect Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your personal data is processed locally and not stored permanently on our servers</li>
                <li>• We use secure encryption for any data transmission</li>
                <li>• We never share your personal information with third parties</li>
                <li>• Your birth data is used solely for generating your reading</li>
                <li>• You can request deletion of any stored information at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                In accordance with Indian data protection regulations (GDPR), you have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Access your personal data</li>
                <li>• Correct any inaccurate information</li>
                <li>• Request deletion of your data</li>
                <li>• Withdraw consent at any time</li>
                <li>• Port your data to another service</li>
                <li>• Object to processing of your data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-cosmic/10 border-primary/30">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-foreground mb-2">
                  <strong>Questions about our privacy practices?</strong>
                </p>
                <p className="text-muted-foreground">
                  Contact us at privacy@cosmicinsights.eu for any privacy-related inquiries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;