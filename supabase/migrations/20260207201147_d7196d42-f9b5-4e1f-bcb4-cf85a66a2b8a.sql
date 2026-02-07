-- Add new columns to coupon_codes for discount type and applicable category
ALTER TABLE public.coupon_codes 
ADD COLUMN IF NOT EXISTS discount_type text NOT NULL DEFAULT 'percentage',
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS applicable_to text NOT NULL DEFAULT 'all';

-- Add comment for clarity
COMMENT ON COLUMN public.coupon_codes.discount_type IS 'Type of discount: percentage or fixed';
COMMENT ON COLUMN public.coupon_codes.discount_amount IS 'Fixed discount amount in INR (used when discount_type is fixed)';
COMMENT ON COLUMN public.coupon_codes.applicable_to IS 'Where coupon applies: all, credits, products';