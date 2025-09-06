import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  trial_end: string | null;
  loading: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    trial_end: null,
    loading: true,
  });

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        trial_end: null,
        loading: false,
      });
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
        return;
      }

      if (data) {
        const now = new Date();
        const trialEnd = data.trial_end ? new Date(data.trial_end) : null;
        const subscriptionEnd = data.subscription_end ? new Date(data.subscription_end) : null;
        
        // Check if user is in trial period or has active subscription
        const inTrial = trialEnd && now < trialEnd;
        const hasActiveSubscription = data.subscribed && subscriptionEnd && now < subscriptionEnd;
        
        setSubscription({
          subscribed: inTrial || hasActiveSubscription || false,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          trial_end: data.trial_end,
          loading: false,
        });
      } else {
        // Create new subscriber entry without trial
        const { data: newSubscriber, error: insertError } = await supabase
          .from('subscribers')
          .insert({
            user_id: user.id,
            email: user.email!,
            subscribed: false,
            trial_end: null, // No trial period
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating subscriber:', insertError);
          return;
        }

        setSubscription({
          subscribed: false, // No trial access
          subscription_tier: null,
          subscription_end: null,
          trial_end: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  };

  const hasAccess = (feature: 'love_forecasts' | 'affirmations' | 'journal') => {
    // Premium features that require subscription
    const premiumFeatures = ['love_forecasts', 'affirmations', 'journal'];
    
    if (!premiumFeatures.includes(feature)) {
      return true; // Free features
    }

    return subscription.subscribed;
  };

  return {
    ...subscription,
    hasAccess,
    checkSubscription,
  };
};