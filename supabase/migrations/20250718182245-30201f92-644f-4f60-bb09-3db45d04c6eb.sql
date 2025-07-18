-- Create user profiles table for storing astrology data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  time_of_birth TIME,
  place_of_birth TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  questions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily readings table
CREATE TABLE public.daily_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overview TEXT NOT NULL,
  lucky_numbers INTEGER[] NOT NULL DEFAULT '{}',
  power_colors TEXT[] NOT NULL DEFAULT '{}',
  love_guidance TEXT,
  career_guidance TEXT,
  health_guidance TEXT,
  challenges TEXT,
  solutions TEXT,
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reading_date)
);

-- Create compatibility readings table for soulmate analysis
CREATE TABLE public.compatibility_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_dob DATE NOT NULL,
  partner_time_of_birth TIME,
  partner_place_of_birth TEXT NOT NULL,
  compatibility_score INTEGER NOT NULL DEFAULT 0,
  matching_qualities INTEGER NOT NULL DEFAULT 0,
  total_qualities INTEGER NOT NULL DEFAULT 36,
  detailed_analysis TEXT,
  soulmate_sketch TEXT,
  strengths TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the 36 qualities system table
CREATE TABLE public.ashtakoot_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compatibility_reading_id UUID NOT NULL REFERENCES public.compatibility_readings(id) ON DELETE CASCADE,
  varna_points INTEGER DEFAULT 0,
  vashya_points INTEGER DEFAULT 0,
  tara_points INTEGER DEFAULT 0,
  yoni_points INTEGER DEFAULT 0,
  graha_maitri_points INTEGER DEFAULT 0,
  gana_points INTEGER DEFAULT 0,
  bhakoot_points INTEGER DEFAULT 0,
  nadi_points INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ashtakoot_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for daily readings
CREATE POLICY "Users can view their own daily readings" 
ON public.daily_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily readings" 
ON public.daily_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily readings" 
ON public.daily_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for compatibility readings
CREATE POLICY "Users can view their own compatibility readings" 
ON public.compatibility_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compatibility readings" 
ON public.compatibility_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compatibility readings" 
ON public.compatibility_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for ashtakoot analysis
CREATE POLICY "Users can view their own ashtakoot analysis" 
ON public.ashtakoot_analysis 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.compatibility_readings cr 
    WHERE cr.id = compatibility_reading_id 
    AND cr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own ashtakoot analysis" 
ON public.ashtakoot_analysis 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.compatibility_readings cr 
    WHERE cr.id = compatibility_reading_id 
    AND cr.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be used when users sign up to create their profile
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user (will be used when profile data is available)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();