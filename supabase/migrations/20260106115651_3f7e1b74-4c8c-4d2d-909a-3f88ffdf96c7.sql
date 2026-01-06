-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  affiliate_code VARCHAR(20) NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_orders table to track orders from affiliates
CREATE TABLE public.affiliate_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for affiliates
CREATE POLICY "Users can view their own affiliate profile"
ON public.affiliates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate profile"
ON public.affiliates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate profile"
ON public.affiliates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliates"
ON public.affiliates FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all affiliates"
ON public.affiliates FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for affiliate_orders
CREATE POLICY "Affiliates can view their own orders"
ON public.affiliate_orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates
    WHERE affiliates.id = affiliate_orders.affiliate_id
    AND affiliates.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all affiliate orders"
ON public.affiliate_orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage affiliate orders"
ON public.affiliate_orders FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_affiliate_orders_affiliate_id ON public.affiliate_orders(affiliate_id);

-- Add trigger for updated_at
CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();