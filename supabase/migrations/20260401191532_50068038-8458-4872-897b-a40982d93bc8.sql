
-- Add external checkout URL to products for Digistore24 integration
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS external_checkout_url text;

-- Add quantity pricing tiers to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS quantity_pricing jsonb DEFAULT '[]'::jsonb;
