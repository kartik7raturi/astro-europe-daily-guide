-- Create coupon codes table
CREATE TABLE public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Coupon codes are viewable by everyone" 
ON public.coupon_codes 
FOR SELECT 
USING (is_active = true AND current_uses < max_uses);

CREATE POLICY "Admins can insert coupon codes" 
ON public.coupon_codes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can update coupon usage" 
ON public.coupon_codes 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coupon_codes_updated_at
BEFORE UPDATE ON public.coupon_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Generate 10 codes for 10% discount
INSERT INTO public.coupon_codes (code, discount_percentage, max_uses) VALUES
('SAVE10-A1B2C3', 10, 1),
('SAVE10-D4E5F6', 10, 1),
('SAVE10-G7H8I9', 10, 1),
('SAVE10-J0K1L2', 10, 1),
('SAVE10-M3N4O5', 10, 1),
('SAVE10-P6Q7R8', 10, 1),
('SAVE10-S9T0U1', 10, 1),
('SAVE10-V2W3X4', 10, 1),
('SAVE10-Y5Z6A7', 10, 1),
('SAVE10-B8C9D0', 10, 1);

-- Generate 20 codes for 100% discount (free)
INSERT INTO public.coupon_codes (code, discount_percentage, max_uses) VALUES
('FREE100-A1B2C3', 100, 1),
('FREE100-D4E5F6', 100, 1),
('FREE100-G7H8I9', 100, 1),
('FREE100-J0K1L2', 100, 1),
('FREE100-M3N4O5', 100, 1),
('FREE100-P6Q7R8', 100, 1),
('FREE100-S9T0U1', 100, 1),
('FREE100-V2W3X4', 100, 1),
('FREE100-Y5Z6A7', 100, 1),
('FREE100-B8C9D0', 100, 1),
('FREE100-E1F2G3', 100, 1),
('FREE100-H4I5J6', 100, 1),
('FREE100-K7L8M9', 100, 1),
('FREE100-N0O1P2', 100, 1),
('FREE100-Q3R4S5', 100, 1),
('FREE100-T6U7V8', 100, 1),
('FREE100-W9X0Y1', 100, 1),
('FREE100-Z2A3B4', 100, 1),
('FREE100-C5D6E7', 100, 1),
('FREE100-F8G9H0', 100, 1);