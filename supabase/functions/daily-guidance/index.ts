import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { date } = await req.json()
    
    console.log('Generating daily guidance for date:', date)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if guidance already exists for today
    const today = date || new Date().toISOString().split('T')[0]
    const { data: existingGuidance } = await supabase
      .from('daily_guidance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existingGuidance) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          guidance: existingGuidance,
          message: 'Daily guidance retrieved successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate daily guidance based on current date energies
    const dayOfWeek = new Date(today).getDay()
    const guidance_templates = [
      {
        text: "Today's cosmic energy encourages you to embrace new beginnings. Trust your intuition and take that first step toward your dreams.",
        focus: ['intuition', 'new_beginnings', 'courage'],
        activities: ['meditation', 'journaling', 'creative_work']
      },
      {
        text: "The planetary alignment favors communication and relationships. Reach out to loved ones and express your authentic self.",
        focus: ['communication', 'relationships', 'authenticity'],
        activities: ['social_connections', 'honest_conversations', 'collaborative_projects']
      },
      {
        text: "Today is perfect for introspection and planning. The universe supports your efforts to organize and structure your path forward.",
        focus: ['planning', 'organization', 'structure'],
        activities: ['goal_setting', 'organizing_spaces', 'strategic_thinking']
      },
      {
        text: "Creative energies are heightened today. Express yourself through art, music, or any form of creative expression that speaks to your soul.",
        focus: ['creativity', 'self_expression', 'inspiration'],
        activities: ['artistic_creation', 'music', 'dance', 'writing']
      },
      {
        text: "The stars encourage balance and harmony. Focus on creating equilibrium between work, rest, and play in your daily routine.",
        focus: ['balance', 'harmony', 'wellness'],
        activities: ['yoga', 'nature_walks', 'balanced_nutrition', 'rest']
      },
      {
        text: "Today brings opportunities for growth and learning. Stay open to new knowledge and experiences that expand your consciousness.",
        focus: ['learning', 'growth', 'expansion'],
        activities: ['reading', 'studying', 'exploring_new_places', 'learning_skills']
      },
      {
        text: "Spiritual energies are strong today. Connect with your higher self through meditation, prayer, or contemplative practices.",
        focus: ['spirituality', 'higher_self', 'contemplation'],
        activities: ['meditation', 'prayer', 'spiritual_reading', 'energy_healing']
      }
    ]

    const selectedGuidance = guidance_templates[dayOfWeek % guidance_templates.length]

    // Insert daily guidance into database
    const { data: guidance, error: insertError } = await supabase
      .from('daily_guidance')
      .insert({
        user_id: user.id,
        date: today,
        guidance_text: selectedGuidance.text,
        focus_areas: selectedGuidance.focus,
        lucky_activities: selectedGuidance.activities
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting daily guidance:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create daily guidance' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully created daily guidance')

    return new Response(
      JSON.stringify({ 
        success: true, 
        guidance,
        message: 'Daily guidance generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in daily guidance function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})