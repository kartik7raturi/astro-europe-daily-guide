import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();
    
    if (!userData) {
      return new Response(
        JSON.stringify({ error: "User data is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { 
        auth: { 
          persistSession: false 
        }
      }
    );

    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Set auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Generate life and career analysis based on user data
    const analysis = generateLifeCareerAnalysis(userData);

    // Save to database
    const { data: savedAnalysis, error: saveError } = await supabaseClient
      .from('life_career_analysis')
      .upsert({
        user_id: user.id,
        analysis_date: new Date().toISOString().split('T')[0],
        life_path_insights: analysis.lifePathInsights,
        career_predictions: analysis.careerPredictions,
        financial_outlook: analysis.financialOutlook,
        opportunities: analysis.opportunities,
        challenges: analysis.challenges,
        recommendations: analysis.recommendations,
        timing_predictions: analysis.timingPredictions
      }, {
        onConflict: 'user_id,analysis_date'
      });

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      return new Response(
        JSON.stringify({ error: "Failed to save analysis" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('Error in life-career-analysis function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

function generateLifeCareerAnalysis(userData: any) {
  const birthDate = new Date(userData.dateOfBirth);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  
  // Calculate life path number
  const lifePathNumber = calculateLifePathNumber(birthDate);
  
  // Calculate zodiac sign
  const zodiacSign = getZodiacSign(birthMonth, birthDay);

  return {
    lifePathInsights: `Based on your life path number ${lifePathNumber} and ${zodiacSign} zodiac sign, you possess natural leadership qualities and analytical thinking. Your European astrological chart suggests a strong connection to intellectual pursuits and structured approaches to life. At age ${age}, you're entering a phase of significant professional development and personal growth.`,
    
    careerPredictions: `Your ${zodiacSign} nature combined with life path ${lifePathNumber} indicates excellent potential in fields requiring precision, communication, and creative problem-solving. The next 2-3 years will bring important career transitions. Focus on developing skills in technology, consulting, or leadership roles. Your European astrological influences suggest success in international business or cultural endeavors.`,
    
    financialOutlook: `Financial stability will improve gradually over the next 18 months. Your methodical ${zodiacSign} approach to money management will serve you well. Avoid speculative investments during Mercury retrograde periods. Focus on building multiple income streams and consider European investment opportunities in sustainable industries.`,
    
    opportunities: [
      "Leadership role opening in Q2-Q3 of this year",
      "International collaboration or European business venture",
      "Skill development opportunity in emerging technologies",
      "Networking connections through professional associations"
    ],
    
    challenges: [
      "Balancing perfectionist tendencies with delegation needs",
      "Overcoming conservative approach to risk-taking", 
      "Managing work-life balance during career transition periods",
      "Navigating office politics with diplomatic European approach"
    ],
    
    recommendations: [
      "Develop cross-cultural communication skills for international opportunities",
      "Consider advanced education or professional certifications",
      "Build a strong professional network through European business associations",
      "Practice mindfulness and stress management techniques",
      "Create a 5-year strategic career plan with milestone reviews"
    ],
    
    timingPredictions: {
      nextThreeMonths: "Focus on skill building and relationship development",
      nextSixMonths: "Significant professional opportunity will emerge",
      nextYear: "Career advancement or job change likely",
      nextTwoYears: "Financial stability and leadership role consolidation",
      nextFiveYears: "Established expert status in your field with international recognition"
    }
  };
}

function calculateLifePathNumber(birthDate: Date): number {
  const dateString = birthDate.toISOString().split('T')[0].replace(/-/g, '');
  let sum = 0;
  
  for (let digit of dateString) {
    sum += parseInt(digit);
  }
  
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

function getZodiacSign(month: number, day: number): string {
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}