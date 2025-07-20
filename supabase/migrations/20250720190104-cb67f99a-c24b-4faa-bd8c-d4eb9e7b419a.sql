-- Add new tables for comprehensive astrology features

-- Daily affirmations table
CREATE TABLE public.daily_affirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  affirmation_text TEXT NOT NULL,
  zodiac_sign TEXT,
  numerology_number INTEGER,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for daily_affirmations
ALTER TABLE public.daily_affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own affirmations"
ON public.daily_affirmations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affirmations"
ON public.daily_affirmations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affirmations"
ON public.daily_affirmations FOR UPDATE
USING (auth.uid() = user_id);

-- Love forecasts table
CREATE TABLE public.love_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  love_score INTEGER DEFAULT 5,
  career_score INTEGER DEFAULT 5,
  finance_score INTEGER DEFAULT 5,
  love_advice TEXT,
  career_advice TEXT,
  finance_advice TEXT,
  lucky_love_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for love_forecasts
ALTER TABLE public.love_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own love forecasts"
ON public.love_forecasts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own love forecasts"
ON public.love_forecasts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own love forecasts"
ON public.love_forecasts FOR UPDATE
USING (auth.uid() = user_id);

-- Soulmate readings table
CREATE TABLE public.soulmate_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  soulmate_description TEXT,
  meeting_place_prediction TEXT,
  meeting_time_prediction TEXT,
  soulmate_sketch_url TEXT,
  twin_flame_analysis TEXT,
  karmic_bond_reading TEXT,
  love_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for soulmate_readings
ALTER TABLE public.soulmate_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own soulmate readings"
ON public.soulmate_readings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soulmate readings"
ON public.soulmate_readings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soulmate readings"
ON public.soulmate_readings FOR UPDATE
USING (auth.uid() = user_id);

-- Crush analysis table
CREATE TABLE public.crush_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crush_name TEXT NOT NULL,
  crush_birthdate DATE,
  compatibility_score INTEGER DEFAULT 0,
  analysis_text TEXT,
  daily_insight TEXT,
  thinking_about_you_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for crush_analysis
ALTER TABLE public.crush_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crush analysis"
ON public.crush_analysis FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crush analysis"
ON public.crush_analysis FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crush analysis"
ON public.crush_analysis FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crush analysis"
ON public.crush_analysis FOR DELETE
USING (auth.uid() = user_id);

-- Astrology quizzes table
CREATE TABLE public.astrology_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  quiz_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for quizzes (public read access)
ALTER TABLE public.astrology_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view quizzes"
ON public.astrology_quizzes FOR SELECT
USING (true);

-- Quiz results table
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL,
  answers JSONB NOT NULL,
  result_text TEXT,
  score INTEGER DEFAULT 0,
  shareable_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for quiz_results
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz results"
ON public.quiz_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
ON public.quiz_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Astro journal table
CREATE TABLE public.astro_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_rating INTEGER DEFAULT 5,
  daily_events TEXT,
  prediction_accuracy TEXT,
  personal_notes TEXT,
  moon_phase TEXT,
  planetary_influences TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for astro_journal
ALTER TABLE public.astro_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journal entries"
ON public.astro_journal FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
ON public.astro_journal FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.astro_journal FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.astro_journal FOR DELETE
USING (auth.uid() = user_id);

-- User streaks table
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_visit_date DATE DEFAULT CURRENT_DATE,
  streak_type TEXT DEFAULT 'daily_check_in',
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create policies for user_streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
ON public.user_streaks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
ON public.user_streaks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
ON public.user_streaks FOR UPDATE
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_soulmate_readings_updated_at
BEFORE UPDATE ON public.soulmate_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crush_analysis_updated_at
BEFORE UPDATE ON public.crush_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_astro_journal_updated_at
BEFORE UPDATE ON public.astro_journal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
BEFORE UPDATE ON public.user_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();