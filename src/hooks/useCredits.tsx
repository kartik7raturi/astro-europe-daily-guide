import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Credits {
  credits_remaining: number;
  total_credits_purchased: number;
  loading: boolean;
}

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<Credits>({
    credits_remaining: 0,
    total_credits_purchased: 0,
    loading: true
  });

  useEffect(() => {
    if (user) {
      loadCredits();
    }
  }, [user]);

  const loadCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCredits({
          credits_remaining: data.credits_remaining,
          total_credits_purchased: data.total_credits_purchased,
          loading: false
        });
      } else {
        // Initialize credits for new users
        await initializeCredits();
      }
    } catch (error) {
      console.error('Error loading credits:', error);
      setCredits(prev => ({ ...prev, loading: false }));
    }
  };

  const initializeCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          credits_remaining: 0,
          total_credits_purchased: 0
        })
        .select()
        .single();

      if (error) throw error;

      setCredits({
        credits_remaining: data.credits_remaining,
        total_credits_purchased: data.total_credits_purchased,
        loading: false
      });
    } catch (error) {
      console.error('Error initializing credits:', error);
      setCredits(prev => ({ ...prev, loading: false }));
    }
  };

  const addCredits = async (amount: number, planName: string) => {
    if (!user) return false;

    try {
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('credits_remaining, total_credits_purchased')
        .eq('user_id', user.id)
        .single();

      if (!currentCredits) {
        await initializeCredits();
        return addCredits(amount, planName);
      }

      const { error } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: currentCredits.credits_remaining + amount,
          total_credits_purchased: currentCredits.total_credits_purchased + amount
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await loadCredits();
      
      toast({
        title: "Credits Added!",
        description: `${amount} credits have been added to your account from ${planName} plan.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: "Error",
        description: "Failed to add credits. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const useCredit = async (purpose: string = 'soulmate_generation') => {
    if (!user) return false;

    if (credits.credits_remaining <= 0) {
      toast({
        title: "No Credits Remaining",
        description: "Please purchase more credits to continue using this feature.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_credits')
        .update({
          credits_remaining: credits.credits_remaining - 1
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCredits(prev => ({
        ...prev,
        credits_remaining: prev.credits_remaining - 1
      }));

      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast({
        title: "Error",
        description: "Failed to process credit usage. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getCreditPackages = () => [
    {
      name: "Starter Pack",
      price: 49,
      credits: 10,
      description: "Perfect for trying out soulmate sketches"
    },
    {
      name: "Popular Pack", 
      price: 199,
      credits: 60,
      description: "Best value for regular users",
      popular: true
    },
    {
      name: "Premium Pack",
      price: 299,
      credits: 120,
      description: "Maximum credits for power users"
    }
  ];

  return {
    credits: credits.credits_remaining,
    totalPurchased: credits.total_credits_purchased,
    loading: credits.loading,
    addCredits,
    useCredit,
    loadCredits,
    getCreditPackages,
    hasCredits: credits.credits_remaining > 0
  };
};