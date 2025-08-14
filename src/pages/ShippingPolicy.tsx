import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Download, Globe, Clock } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-starlight py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Download className="h-12 w-12 text-primary animate-glow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-muted-foreground">
            Information about how we deliver our digital cosmic services to you.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Digital Service Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                astrovibe.online provides exclusively digital services. We do not ship physical products. 
                All our services are delivered electronically through our platform.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Our Digital Services Include:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personalized astrology readings</li>
                  <li>• Daily horoscope updates</li>
                  <li>• Soulmate analysis and sketches</li>
                  <li>• Numerology reports</li>
                  <li>• Lucky numbers and power colors</li>
                  <li>• Digital cosmic guidance and insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Delivery Timeframes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Instant Access Services:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Account creation and platform access: Immediate</li>
                    <li>• Daily horoscope readings: Available immediately upon login</li>
                    <li>• Basic compatibility analysis: Instant results</li>
                    <li>• Lucky numbers and power colors: Generated instantly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Generated Content Services:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Personalized soulmate sketches: 24-48 hours</li>
                    <li>• Detailed numerology reports: 2-4 hours</li>
                    <li>• Custom astrology readings: 4-8 hours</li>
                    <li>• Advanced compatibility analysis: 1-2 hours</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Consultation Services:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• One-on-one consultations: Scheduled based on availability</li>
                    <li>• Personal readings: Within 24 hours of request</li>
                    <li>• Custom problem solutions: 24-72 hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Global Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our digital services are available worldwide, 24/7. Since all our offerings are delivered through 
                our online platform, there are no geographical restrictions or shipping limitations.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Access Requirements:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Stable internet connection</li>
                  <li>• Compatible web browser or mobile device</li>
                  <li>• Valid email address for account creation</li>
                  <li>• Payment method for premium services</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Access and Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                How to access your purchased services:
              </p>
              <ol className="space-y-2 text-muted-foreground">
                <li>1. Log into your astrovibe.online account</li>
                <li>2. Navigate to your dashboard</li>
                <li>3. Access your purchased services from the appropriate sections</li>
                <li>4. Download or view your content as needed</li>
                <li>5. Save or bookmark important readings for future reference</li>
              </ol>
              <p className="text-muted-foreground">
                <strong>Note:</strong> You will receive email notifications when new content is ready for download 
                or when services are available.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Technical Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you experience any issues accessing your purchased services:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Check your internet connection and browser compatibility</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try accessing from a different device or browser</li>
                <li>• Contact our support team at sankhobusiness@gmail.com if issues persist</li>
              </ul>
              <p className="text-muted-foreground">
                Our technical support team is available to help you access your cosmic services and resolve 
                any delivery-related issues promptly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-cosmic/10 border-primary/30">
            <CardContent className="p-6">
              <div className="text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-foreground mb-2">
                  <strong>Questions about service delivery?</strong>
                </p>
                <p className="text-muted-foreground">
                  Contact our support team at sankhobusiness@gmail.com for assistance with accessing 
                  your digital cosmic services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;