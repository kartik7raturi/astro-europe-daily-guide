import { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  children: ReactNode;
  feature?: string;
  minTier?: 'freemium' | 'starter' | 'explorer' | 'master';
  requiredCredits?: number;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

const FeatureGate = ({
  children,
  feature,
  minTier = 'freemium',
  requiredCredits,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) => {
  const { loading, isAdmin, canAccess, hasMinimumTier, hasCredits } = useFeatureAccess();

  // Admin always has access
  if (isAdmin) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check feature access
  const hasAccess = feature ? canAccess(feature) : hasMinimumTier(minTier);
  
  // Check credits if required
  const hasSufficientCredits = requiredCredits ? hasCredits(requiredCredits) : true;

  if (hasAccess && hasSufficientCredits) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt
  if (showUpgradePrompt) {
    return (
      <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-cosmic flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">Premium Feature</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {requiredCredits && !hasSufficientCredits
              ? `This feature requires ${requiredCredits} credits. Please purchase more credits.`
              : `This feature is available on the ${minTier.charAt(0).toUpperCase() + minTier.slice(1)} plan and above.`}
          </p>
          <Link to="/pricing">
            <Button className="gap-2" variant="cosmic">
              <Crown className="w-4 h-4" />
              Upgrade Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default FeatureGate;
