-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wishlist
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Insert sample astrologers data
INSERT INTO public.astrologers (name, specialization, experience_years, bio, rating, hourly_rate, is_available, image_url)
VALUES 
  ('Priya Sharma', 'Vedic Astrology & Love Compatibility', 12, 'Expert in relationship astrology with deep knowledge of Vedic traditions. Specializes in compatibility analysis and love forecasts.', 4.8, 2000, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'),
  ('Chen Wei', 'Chinese Astrology & Feng Shui', 15, 'Master of Chinese astrological systems and Feng Shui. Combines ancient wisdom with modern interpretations.', 4.9, 2500, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
  ('Raj Kumar', 'Numerology & Life Path Analysis', 10, 'Specialized in numerology and life path readings. Helps clients discover their true purpose and potential.', 4.7, 1800, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'),
  ('Maya Patel', 'Tarot & Spiritual Guidance', 8, 'Intuitive tarot reader and spiritual guide. Provides clarity on life decisions and personal growth.', 4.6, 1500, true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'),
  ('Dr. Amit Singh', 'Medical Astrology & Health', 20, 'Pioneer in medical astrology. Combines traditional Ayurvedic principles with astrological insights for health guidance.', 5.0, 3000, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop')
ON CONFLICT DO NOTHING;