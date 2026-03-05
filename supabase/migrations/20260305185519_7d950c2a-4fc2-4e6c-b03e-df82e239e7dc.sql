
-- Enhance astrologers table for self-registration
ALTER TABLE public.astrologers 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{"Hindi","English"}'::text[],
ADD COLUMN IF NOT EXISTS intro_video_url text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS consultation_types text[] DEFAULT '{"chat","audio","video"}'::text[],
ADD COLUMN IF NOT EXISTS availability jsonb DEFAULT '[]'::jsonb;

-- Wallet system
CREATE TABLE IF NOT EXISTS public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance numeric NOT NULL DEFAULT 0,
  total_earned numeric NOT NULL DEFAULT 0,
  total_withdrawn numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all wallets" ON public.wallets FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Wallet transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL, -- 'credit', 'debit', 'commission', 'withdrawal', 'refund'
  description text,
  reference_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all transactions" ON public.wallet_transactions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Consultation bookings (enhanced)
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  astrologer_id uuid REFERENCES public.astrologers(id) ON DELETE CASCADE NOT NULL,
  consultation_type text NOT NULL DEFAULT 'chat', -- chat, audio, video
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  amount numeric NOT NULL,
  platform_commission numeric NOT NULL DEFAULT 0,
  astrologer_earning numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
  payment_status text NOT NULL DEFAULT 'unpaid', -- unpaid, paid, refunded
  payment_id text,
  notes text,
  rating integer,
  review_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.consultation_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Astrologers can view their bookings" ON public.consultation_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM astrologers WHERE astrologers.id = consultation_bookings.astrologer_id AND astrologers.user_id = auth.uid())
);
CREATE POLICY "Users can insert bookings" ON public.consultation_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.consultation_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Astrologers can update their bookings" ON public.consultation_bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM astrologers WHERE astrologers.id = consultation_bookings.astrologer_id AND astrologers.user_id = auth.uid())
);
CREATE POLICY "Admins can manage all bookings" ON public.consultation_bookings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Consultation chat messages
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.consultation_bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  message_type text NOT NULL DEFAULT 'text', -- text, image, system
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booking participants can view messages" ON public.consultation_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM consultation_bookings cb 
    WHERE cb.id = consultation_messages.booking_id 
    AND (cb.user_id = auth.uid() OR EXISTS (SELECT 1 FROM astrologers a WHERE a.id = cb.astrologer_id AND a.user_id = auth.uid()))
  )
);
CREATE POLICY "Booking participants can send messages" ON public.consultation_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM consultation_bookings cb 
    WHERE cb.id = consultation_messages.booking_id 
    AND (cb.user_id = auth.uid() OR EXISTS (SELECT 1 FROM astrologers a WHERE a.id = cb.astrologer_id AND a.user_id = auth.uid()))
  )
);
CREATE POLICY "Admins can view all messages" ON public.consultation_messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected, completed
  payment_method text DEFAULT 'upi',
  payment_details jsonb DEFAULT '{}'::jsonb,
  admin_notes text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals" ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can request withdrawals" ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawal_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Platform settings for commission
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.platform_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default commission setting
INSERT INTO public.platform_settings (key, value) VALUES ('commission_percentage', '{"value": 20}'::jsonb) ON CONFLICT (key) DO NOTHING;

-- Enable realtime on consultation_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_messages;
