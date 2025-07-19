-- Create birth_charts table for detailed astrological charts
CREATE TABLE public.birth_charts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  chart_type TEXT NOT NULL DEFAULT 'vedic', -- 'vedic' or 'western'
  houses JSONB,
  planets JSONB,
  aspects JSONB,
  chart_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create numerology_reports table
CREATE TABLE public.numerology_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  life_path_number INTEGER,
  destiny_number INTEGER,
  soul_urge_number INTEGER,
  personality_number INTEGER,
  name_analysis JSONB,
  detailed_report TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create astro_calendar table
CREATE TABLE public.astro_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  moon_phase TEXT,
  planetary_transits JSONB,
  good_activities TEXT[],
  avoid_activities TEXT[],
  energy_level INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prediction_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  content TEXT NOT NULL,
  dasha_info JSONB,
  numerology_forecast JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  astrologer_name TEXT NOT NULL,
  consultation_type TEXT NOT NULL, -- 'chat', 'video', 'audio'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  price DECIMAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT, -- 'astrology', 'numerology', 'zodiac', 'general'
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_items table
CREATE TABLE public.saved_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'chart', 'report', 'horoscope', 'prediction'
  item_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  horoscope_type TEXT DEFAULT 'vedic', -- 'vedic', 'western'
  language TEXT DEFAULT 'en',
  notification_time TIME DEFAULT '09:00:00',
  daily_notifications BOOLEAN DEFAULT true,
  weekly_notifications BOOLEAN DEFAULT true,
  monthly_notifications BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light', -- 'light', 'dark'
  theme_color TEXT DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lucky_elements table
CREATE TABLE public.lucky_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  lucky_number INTEGER,
  lucky_color TEXT,
  lucky_time TIME,
  gemstone TEXT,
  direction TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astro_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_elements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for birth_charts
CREATE POLICY "Users can view their own birth charts" ON public.birth_charts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own birth charts" ON public.birth_charts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own birth charts" ON public.birth_charts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for numerology_reports
CREATE POLICY "Users can view their own numerology reports" ON public.numerology_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own numerology reports" ON public.numerology_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own numerology reports" ON public.numerology_reports FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for astro_calendar (public read)
CREATE POLICY "Everyone can view astro calendar" ON public.astro_calendar FOR SELECT USING (true);

-- RLS Policies for predictions
CREATE POLICY "Users can view their own predictions" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own consultations" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for blog_posts (public read for published)
CREATE POLICY "Everyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);

-- RLS Policies for saved_items
CREATE POLICY "Users can view their own saved items" ON public.saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved items" ON public.saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved items" ON public.saved_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lucky_elements
CREATE POLICY "Users can view their own lucky elements" ON public.lucky_elements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lucky elements" ON public.lucky_elements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lucky elements" ON public.lucky_elements FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_birth_charts_updated_at BEFORE UPDATE ON public.birth_charts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_numerology_reports_updated_at BEFORE UPDATE ON public.numerology_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add profile_picture column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture TEXT;