-- Create sponsors table for managing sponsored content
CREATE TABLE public.sponsors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    pages TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active sponsors
CREATE POLICY "Anyone can view active sponsors" 
ON public.sponsors 
FOR SELECT 
USING (is_active = true);

-- Allow admins to manage sponsors
CREATE POLICY "Admins can manage sponsors" 
ON public.sponsors 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add affiliate_code column to orders table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'affiliate_code') THEN
        ALTER TABLE public.orders ADD COLUMN affiliate_code TEXT;
    END IF;
END $$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sponsors_updated_at
BEFORE UPDATE ON public.sponsors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();