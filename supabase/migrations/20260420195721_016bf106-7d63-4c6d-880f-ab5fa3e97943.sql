-- Map Digistore product IDs to internal subscription tiers + credits
-- 685352 = $19 starter (initial pricing)  -> tier 'starter', 1 credit, lifetime (one-time)
-- 686182 = VIP upgrade                    -> tier 'master',  10 credits, lifetime (one-time)
-- We persist the mapping in platform_settings so admins can tweak without redeploys.

INSERT INTO public.platform_settings (key, value)
VALUES (
  'digistore_product_map',
  '{
    "685352": { "tier": "starter", "credits": 1,  "label": "Initial $19 Membership" },
    "686182": { "tier": "master",  "credits": 10, "label": "VIP Upgrade" }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Webhook log so we have a forensic trail of every Digistore IPN
CREATE TABLE IF NOT EXISTS public.digistore_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT,
  product_id TEXT,
  order_id TEXT,
  buyer_email TEXT,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.digistore_webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook logs"
  ON public.digistore_webhook_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_digistore_webhook_logs_email
  ON public.digistore_webhook_logs (buyer_email);
CREATE INDEX IF NOT EXISTS idx_digistore_webhook_logs_created
  ON public.digistore_webhook_logs (created_at DESC);