import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Clock, Shield, Mail } from "lucide-react";

const CancellationRefund = () => {
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
                You may cancel your subscription or service at any time. Here are our cancellation terms:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong>One-time purchases:</strong> Cancellations must be requested within 24 hours of purchase for a full refund.
                </li>
                <li>
                  <strong>6-month plans:</strong> You can cancel anytime. No refund for unused portion, but you retain access until the end of your billing period.
                </li>
                <li>
                  <strong>Lifetime plans:</strong> Cancellations must be requested within 7 days of purchase for a full refund.
                </li>
                <li>
                  <strong>Service cancellation:</strong> To cancel, contact us at sankhobusiness@gmail.com or through your account dashboard.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-accent" />
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We offer refunds under the following conditions:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Eligible for Refund:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Technical issues preventing access to purchased services</li>
                    <li>• Services not delivered as described</li>
                    <li>• Duplicate charges or billing errors</li>
                    <li>• Cancellation within the specified timeframe above</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Non-Refundable:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Services already consumed (readings already provided)</li>
                    <li>• Cancellations after the specified grace period</li>
                    <li>• Dissatisfaction with astrological interpretations (as they are subjective)</li>
                    <li>• Change of mind after the grace period has expired</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Refund Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To request a refund:
              </p>
              <ol className="space-y-2 text-muted-foreground">
                <li>1. Contact us at sankhobusiness@gmail.com within the applicable timeframe</li>
                <li>2. Provide your order number or account details</li>
                <li>3. Explain the reason for your refund request</li>
                <li>4. Our team will review your request within 2-3 business days</li>
                <li>5. If approved, refunds will be processed to your original payment method within 5-7 business days</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At astrovibe.online, we're committed to providing exceptional cosmic guidance and customer service. 
                If you're not satisfied with our services, we'll work with you to make it right.
              </p>
              <p className="text-muted-foreground">
                We believe in transparency and fairness in all our dealings. This policy ensures that both you and 
                astrovibe.online are protected while maintaining the highest standards of service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-cosmic/10 border-primary/30">
            <CardContent className="p-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-foreground mb-2">
                  <strong>Questions about cancellations or refunds?</strong>
                </p>
                <p className="text-muted-foreground">
                  Contact our support team at sankhobusiness@gmail.com or through your account dashboard.
                  We're here to help and will respond within 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefund;