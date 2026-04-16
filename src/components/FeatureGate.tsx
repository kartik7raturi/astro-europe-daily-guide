import { ReactNode } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  children: ReactNode;
  feature?: string;
  minTier?: 'freemium' | 'starter' | 'explorer' | 'master';
  requiredCredits?: number;
  fallback?: ReactNode;
  /** When true (default), gated content renders blurred behind an upgrade overlay. */
  showUpgradePrompt?: boolean;
}

/**
 * Gates a feature by tier. Visitors with no plan see blurred content + a
 * "Get Started" overlay → /initial-pricing. Starter users see a "VIP" overlay
 * → /upsell. Paid users with sufficient access see the content.
 */
const FeatureGate = ({
  children,
  feature,
  minTier = 'freemium',
  requiredCredits,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) => {
  const { loading, isAdmin, canAccess, hasMinimumTier, hasCredits, tier, hasActiveSubscription } = useFeatureAccess();

  if (isAdmin) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const hasAccess = feature ? canAccess(feature) : hasMinimumTier(minTier);
  const hasSufficientCredits = requiredCredits ? hasCredits(requiredCredits) : true;

  if (hasAccess && hasSufficientCredits) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  // Visitors who haven't bought anything go to the $19.99 initial offer.
  // Starter users (bought $19.99) trying to access VIP-only features go to /upsell.
  const goesToUpsell = hasActiveSubscription && tier === 'starter';
  const upgradePath = goesToUpsell ? '/upsell' : '/initial-pricing';
  const upgradeLabel = goesToUpsell ? 'Upgrade to VIP' : 'Unlock for $19.99';
  const headline = goesToUpsell ? 'VIP Feature' : 'Premium Feature';
  const description = requiredCredits && !hasSufficientCredits
    ? `This feature requires ${requiredCredits} credits.`
    : goesToUpsell
      ? 'Available with the VIP upgrade. Unlock all premium tools.'
      : 'Get started with our Soulmate Sketch package to unlock this.';

  if (!showUpgradePrompt) return null;

  return (
    <div className="relative rounded-lg overflow-hidden border border-primary/30">
      {/* Blurred preview of the actual content */}
      <div className="blur-md select-none pointer-events-none opacity-60">
        {children}
      </div>

      {/* Overlay with upgrade CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px] p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-cosmic flex items-center justify-center mb-4">
            {goesToUpsell ? (
              <Crown className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Lock className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">{headline}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Link to={upgradePath}>
            <Button variant="cosmic" className="gap-2">
              {goesToUpsell ? <Crown className="w-4 h-4" /> : null}
              {upgradeLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
