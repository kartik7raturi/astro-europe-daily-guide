-- Fix the view to use SECURITY INVOKER instead of DEFINER
DROP VIEW IF EXISTS public.product_reviews_with_profiles;

CREATE VIEW public.product_reviews_with_profiles 
WITH (security_invoker = true) AS
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

-- Grant access
GRANT SELECT ON public.product_reviews_with_profiles TO authenticated;
GRANT SELECT ON public.product_reviews_with_profiles TO anon;