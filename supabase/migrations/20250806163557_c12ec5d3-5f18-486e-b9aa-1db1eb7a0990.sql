-- Create tables for footer services

-- Personal Readings Service
CREATE TABLE public.personal_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reading_type TEXT NOT NULL,
  questions TEXT[] NOT NULL,
  responses TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily Guidance Service  
CREATE TABLE public.daily_guidance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  guidance_text TEXT NOT NULL,
  focus_areas TEXT[] NOT NULL,
  lucky_activities TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lucky Numbers Service
CREATE TABLE public.lucky_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_numbers INTEGER[] NOT NULL,
  weekly_numbers INTEGER[] NOT NULL,
  monthly_numbers INTEGER[] NOT NULL,
  lottery_numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Color Therapy Service
CREATE TABLE public.color_therapy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  primary_color TEXT NOT NULL,
  secondary_colors TEXT[] NOT NULL,
  avoid_colors TEXT[] NOT NULL,
  color_meanings JSONB NOT NULL,
  usage_suggestions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Problem Solutions Service
CREATE TABLE public.problem_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_category TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  urgency_level TEXT NOT NULL DEFAULT 'medium',
  astrological_solution TEXT NOT NULL,
  recommended_actions TEXT[] NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.personal_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_solutions ENABLE ROW LEVEL SECURITY;

-- Create policies for personal_readings
CREATE POLICY "Users can view their own personal readings" 
ON public.personal_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personal readings" 
ON public.personal_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal readings" 
ON public.personal_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for daily_guidance
CREATE POLICY "Users can view their own daily guidance" 
ON public.daily_guidance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily guidance" 
ON public.daily_guidance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for lucky_numbers  
CREATE POLICY "Users can view their own lucky numbers" 
ON public.lucky_numbers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lucky numbers" 
ON public.lucky_numbers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for color_therapy
CREATE POLICY "Users can view their own color therapy" 
ON public.color_therapy 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own color therapy" 
ON public.color_therapy 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for problem_solutions
CREATE POLICY "Users can view their own problem solutions" 
ON public.problem_solutions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own problem solutions" 
ON public.problem_solutions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problem solutions" 
ON public.problem_solutions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_personal_readings_updated_at
  BEFORE UPDATE ON public.personal_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_problem_solutions_updated_at
  BEFORE UPDATE ON public.problem_solutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_personal_readings_user_id ON public.personal_readings(user_id);
CREATE INDEX idx_daily_guidance_user_date ON public.daily_guidance(user_id, date);
CREATE INDEX idx_lucky_numbers_user_date ON public.lucky_numbers(user_id, date);
CREATE INDEX idx_color_therapy_user_date ON public.color_therapy(user_id, date);
CREATE INDEX idx_problem_solutions_user_id ON public.problem_solutions(user_id);

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for blog posts (public read access)
CREATE POLICY "Blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Add index for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);