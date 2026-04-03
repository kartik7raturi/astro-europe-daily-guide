import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define which features are available at each tier
const TIER_FEATURES: Record<string, string[]> = {
  freemium: [
    'basic_horoscope',
    'love_calculator',
    'basic_numerology',
    'limited_compatibility',
  ],
  starter: [
    'soulmate_sketch',
    'basic_soulmate_reading',
    'meeting_place_prediction',
    'basic_love_compatibility',
    'numerology_report',
  ],
  explorer: [
    'detailed_soulmate_analysis',
    'advanced_love_readings',
    'twin_flame_analysis',
    'karmic_bonds',
    'meeting_time_predictions',
    'love_forecasts',
    'daily_affirmations',
    'crush_analyzer',
    'tarot_reading',
  ],
  master: [
    'full_soulmate_analysis',
    'all_premium_features',
    'priority_support',
    'daily_guidance',
    'lucky_numbers',
    'color_therapy',
    'problem_solutions',
    'life_career_analysis',
    'personal_readings',
    'ai_chat_unlimited',
  ],
};

const TIER_LEVELS: Record<string, number> = {
  freemium: 0,
  starter: 1,
  explorer: 2,
  master: 3,
  admin: 99,
};

interface FeatureAccessState {
  loading: boolean;
  isAdmin: boolean;
  tier: string;
  tierLevel: number;
  hasActiveSubscription: boolean;
  credits: number;
}

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const [state, setState] = useState<FeatureAccessState>({
    loading: true,
    isAdmin: false,
    tier: 'freemium',
    tierLevel: 0,
    hasActiveSubscription: false,
    credits: 0,
  });

  useEffect(() => {
    if (user) {
      checkAccess();
    } else {
      setState({
        loading: false,
        isAdmin: false,
        tier: 'freemium',
        tierLevel: 0,
        hasActiveSubscription: false,
        credits: 0,
      });
    }
  }, [user]);

  const checkAccess = async () => {
    if (!user) return;

    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const isAdmin = !!roleData || user.email === 'sankhobusiness@gmail.com';

      const { data: subData } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .maybeSingle();

      let tier = 'freemium';
      let hasActiveSubscription = false;

      if (subData) {
        const now = new Date();
        const subscriptionEnd = subData.subscription_end ? new Date(subData.subscription_end) : null;
        
        // Check if subscribed and has active period
        if (subData.subscribed) {
          if (subscriptionEnd && now < subscriptionEnd) {
            hasActiveSubscription = true;
            tier = subData.subscription_tier || 'starter';
          } else if (!subscriptionEnd && subData.subscription_tier) {
            // No end date but has tier = active (e.g. one-time purchase)
            hasActiveSubscription = true;
            tier = subData.subscription_tier;
          }
        }
      }

      setState({
        loading: false,
        isAdmin,
        tier: isAdmin ? 'admin' : tier,
        tierLevel: isAdmin ? 99 : (TIER_LEVELS[tier] || 0),
        hasActiveSubscription: isAdmin || hasActiveSubscription,
        credits: creditsData?.credits_remaining || 0,
      });
    } catch (error) {
      console.error('Error checking feature access:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const canAccess = (feature: string): boolean => {
    if (state.isAdmin) return true;
    const userTierLevel = state.tierLevel;
    if (TIER_FEATURES.freemium?.includes(feature)) return true;
    if (userTierLevel >= 1 && TIER_FEATURES.starter?.includes(feature)) return true;
    if (userTierLevel >= 2 && TIER_FEATURES.explorer?.includes(feature)) return true;
    if (userTierLevel >= 3 && TIER_FEATURES.master?.includes(feature)) return true;
    return false;
  };

  const hasMinimumTier = (minTier: string): boolean => {
    if (state.isAdmin) return true;
    const minLevel = TIER_LEVELS[minTier] || 0;
    return state.tierLevel >= minLevel;
  };

  const hasCredits = (required: number): boolean => {
    if (state.isAdmin) return true;
    return state.credits >= required;
  };

  return {
    ...state,
    canAccess,
    hasMinimumTier,
    hasCredits,
    refresh: checkAccess,
  };
};

export default useFeatureAccess;
