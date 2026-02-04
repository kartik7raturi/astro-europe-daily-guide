-- Create pricing_plans table for admin to manage plans
CREATE TABLE public.pricing_plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    period TEXT NOT NULL DEFAULT 'one-time',
    description TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    credits INTEGER DEFAULT 0,
    sketches INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    icon TEXT DEFAULT 'Star',
    gradient TEXT DEFAULT 'bg-gradient-cosmic',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active plans
CREATE POLICY "Anyone can view active plans"
ON public.pricing_plans
FOR SELECT
USING (is_active = true);

-- Only admins can manage plans
CREATE POLICY "Admins can manage plans"
ON public.pricing_plans
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_pricing_plans_updated_at
BEFORE UPDATE ON public.pricing_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.pricing_plans (name, price, period, description, features, credits, sketches, is_popular, display_order, icon, gradient)
VALUES 
    ('Freemium', 0, 'forever', 'Start your cosmic journey for free', 
     ARRAY['Basic Daily Horoscope', 'Love Percentage Calculator', 'Basic Numerology Report', 'Limited Compatibility Analysis', 'Community Access'],
     0, 0, false, 1, 'Star', 'bg-gradient-cosmic'),
    ('Starter', 49, 'one-time', 'Get your first soulmate sketch',
     ARRAY['1 AI-Generated Soulmate Sketch', '10 Credits for Generation', 'Basic Soulmate Reading', 'Love Compatibility Score', 'Meeting Place Prediction', '30-Day Access'],
     10, 1, false, 2, 'Heart', 'bg-gradient-gold'),
    ('Explorer', 199, 'package', 'Multiple sketches for deeper insights',
     ARRAY['6 AI-Generated Soulmate Sketches', '60 Credits for Generation', 'Detailed Soulmate Analysis', 'Advanced Love Readings', 'Twin Flame Analysis', 'Karmic Bond Reading', 'Meeting Time Predictions', '90-Day Access'],
     60, 6, true, 3, 'Sparkles', 'bg-gradient-cosmic'),
    ('Master', 299, 'premium', 'Ultimate soulmate discovery experience',
     ARRAY['12 AI-Generated Soulmate Sketches', '120 Credits for Generation', 'Full Soulmate Analysis', 'All Premium Features', 'Lifetime Predictions', 'Priority Support', 'Daily Guidance', 'Lucky Numbers', 'Color Therapy', 'Problem Solutions', '180-Day Access'],
     120, 12, false, 4, 'Crown', 'bg-gradient-gold');