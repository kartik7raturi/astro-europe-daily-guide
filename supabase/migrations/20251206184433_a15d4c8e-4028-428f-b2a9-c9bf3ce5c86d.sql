-- Add shipping_address column to orders table for delivery details
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address jsonb DEFAULT '{}'::jsonb;

-- Add contact details columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- Create order status enum if not exists and update status to use more options
-- Update existing status values to be compatible
UPDATE public.orders SET status = 'pending' WHERE status NOT IN ('pending', 'accepted', 'fulfilled', 'shipped', 'delivered', 'cancelled');

-- Add status_history column to track status changes
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_history jsonb DEFAULT '[]'::jsonb;

-- Add tracking_number column for shipped orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number text;