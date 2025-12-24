-- Fix remaining security issues and create combo_offers table

-- 1. Drop and recreate all product_reviews policies to ensure clean state
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Anyone can view product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can create their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Everyone can view product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.product_reviews;

-- Recreate with unique names
CREATE POLICY "Public can view all product reviews" 
ON public.product_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users create own reviews" 
ON public.product_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reviews only" 
ON public.product_reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own reviews only" 
ON public.product_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- 2. Fix subscribers table - fix permissive update policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscribers;

CREATE POLICY "Users update own subscription only" 
ON public.subscribers 
FOR UPDATE 
USING ((user_id = auth.uid()) OR (email = auth.email()));

-- 3. Fix coupon_codes - remove public listing
DROP POLICY IF EXISTS "Coupon codes are viewable by everyone" ON public.coupon_codes;
DROP POLICY IF EXISTS "System can update coupon usage" ON public.coupon_codes;
DROP POLICY IF EXISTS "Authenticated users can validate coupon codes" ON public.coupon_codes;
DROP POLICY IF EXISTS "Admin can update coupon codes" ON public.coupon_codes;

CREATE POLICY "Authenticated users validate coupons" 
ON public.coupon_codes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin updates coupon codes" 
ON public.coupon_codes 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- 4. Add RLS policies to astology table (RLS enabled but no policies)
DROP POLICY IF EXISTS "Astrology data is viewable by everyone" ON public.astology;
CREATE POLICY "Astrology data viewable by everyone" 
ON public.astology 
FOR SELECT 
USING (true);

-- 5. Add admin policies for blog_posts management
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- 6. Create combo_offers table for admin-managed quantity discounts
CREATE TABLE IF NOT EXISTS public.combo_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_quantity INT NOT NULL,
  discount_percentage NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on combo_offers
ALTER TABLE public.combo_offers ENABLE ROW LEVEL SECURITY;

-- Everyone can view active combo offers
DROP POLICY IF EXISTS "Anyone can view active combo offers" ON public.combo_offers;
CREATE POLICY "Anyone views active combo offers" 
ON public.combo_offers 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage combo offers
DROP POLICY IF EXISTS "Admins can manage combo offers" ON public.combo_offers;
CREATE POLICY "Admins manage combo offers" 
ON public.combo_offers 
FOR ALL 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- Insert default combo offers
INSERT INTO public.combo_offers (min_quantity, discount_percentage, description) VALUES
(2, 10, 'Buy 2 items and get 10% discount'),
(3, 25, 'Buy 3 items and get 25% discount')
ON CONFLICT DO NOTHING;