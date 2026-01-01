-- Add additional_images column to products table for multiple photos
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}';

-- Create a view for reviews with profile names
CREATE OR REPLACE VIEW public.product_reviews_with_profiles AS
SELECT 
  pr.id,
  pr.product_id,
  pr.user_id,
  pr.rating,
  pr.review_text,
  pr.created_at,
  pr.updated_at,
  COALESCE(p.full_name, 'Anonymous User') as reviewer_name
FROM public.product_reviews pr
LEFT JOIN public.profiles p ON pr.user_id = p.user_id;

-- Enable RLS on the view (inherits from base table)
GRANT SELECT ON public.product_reviews_with_profiles TO authenticated;
GRANT SELECT ON public.product_reviews_with_profiles TO anon;