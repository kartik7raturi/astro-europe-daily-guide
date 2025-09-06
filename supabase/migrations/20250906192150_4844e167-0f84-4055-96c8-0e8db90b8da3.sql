-- Update orders table to include order_type for soulmate tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'general';

-- Update existing orders to have proper order_type
UPDATE public.orders SET order_type = 'soulmate_sketches' WHERE order_type = 'general';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_type ON public.orders(user_id, order_type, status);

-- Update soulmate_readings table to track daily usage
ALTER TABLE public.soulmate_readings ADD COLUMN IF NOT EXISTS generation_date DATE DEFAULT CURRENT_DATE;

-- Add index for soulmate readings by date
CREATE INDEX IF NOT EXISTS idx_soulmate_readings_date ON public.soulmate_readings(user_id, generation_date);