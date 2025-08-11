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
    const { problem_category, problem_description, urgency_level = 'medium' } = await req.json()
    
    if (!problem_category || !problem_description) {
      return new Response(
        JSON.stringify({ error: 'Problem category and description are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Creating problem solution:', { problem_category, urgency_level })

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

    // Generate astrological solutions based on problem category
    function generateSolution(category: string, description: string) {
      const solutions = {
        'love': {
          solution: "Venus is currently in a challenging aspect, affecting your romantic energy. The cosmic alignment suggests focusing on self-love first. Jupiter's influence indicates that patience will bring the right person into your life.",
          actions: [
            'Light a pink candle every Friday for 4 weeks',
            'Wear rose quartz jewelry close to your heart',
            'Practice daily self-love affirmations',
            'Meditate during Venus hours (Friday evenings)',
            'Write in a gratitude journal focusing on love received'
          ],
          timeline: 'Positive changes expected within 6-8 weeks'
        },
        'career': {
          solution: "Mars is positioned favorably in your 10th house of career, but Saturn is creating delays. The planetary transit suggests that persistent effort combined with strategic networking will overcome current obstacles.",
          actions: [
            'Perform Sun salutations every morning',
            'Wear yellow or gold on important work days',
            'Place a citrine crystal on your work desk',
            'Chant career mantras during sunrise',
            'Network during Mercury-favorable days (Wednesdays)'
          ],
          timeline: 'Career breakthrough expected within 3-4 months'
        },
        'health': {
          solution: "Your sixth house of health shows stress-related imbalances. The Moon's current phase suggests focusing on emotional healing will improve physical symptoms. Holistic approaches are favored.",
          actions: [
            'Drink water charged under moonlight',
            'Practice pranayama breathing exercises',
            'Eat according to your dosha type',
            'Use healing crystals like amethyst or clear quartz',
            'Schedule regular healing sessions during waxing moon'
          ],
          timeline: 'Health improvements within 2-3 months'
        },
        'finance': {
          solution: "Jupiter's transit through your wealth sector is temporarily blocked by Rahu. The cosmic guidance suggests clearing past financial karma through conscious spending and generous giving will unlock abundance.",
          actions: [
            'Donate to charity every Thursday',
            'Keep a green aventurine in your wallet',
            'Perform Lakshmi puja on Fridays',
            'Avoid major purchases during Mercury retrograde',
            'Create a vision board for financial goals'
          ],
          timeline: 'Financial stability within 4-6 months'
        },
        'family': {
          solution: "Family karma is being cleared through current challenges. The lunar nodes suggest that patience, forgiveness, and clear communication will restore harmony. Focus on healing generational patterns.",
          actions: [
            'Light white candles for family peace',
            'Practice loving-kindness meditation',
            'Use clear communication during favorable Mercury days',
            'Perform family ancestor rituals',
            'Create a harmonious home environment with plants'
          ],
          timeline: 'Family harmony restored within 2-3 months'
        },
        'spiritual': {
          solution: "Your spiritual path is being activated by Neptune's influence. The universe is calling you to deeper practices. Current challenges are initiating you into higher consciousness levels.",
          actions: [
            'Establish daily meditation practice',
            'Study spiritual texts during Mercury favorable times',
            'Connect with nature regularly',
            'Use spiritual crystals like selenite or amethyst',
            'Join a spiritual community or find a mentor'
          ],
          timeline: 'Spiritual breakthrough within 1-2 months'
        },
        'general': {
          solution: "The planetary influences suggest you're in a transformative phase. Trust the cosmic process and focus on inner growth. The challenges you're facing are preparing you for a higher life purpose.",
          actions: [
            'Practice daily gratitude and mindfulness',
            'Use protective crystals like black tourmaline',
            'Follow lunar cycles for important decisions',
            'Maintain regular spiritual practices',
            'Trust your intuition and inner guidance'
          ],
          timeline: 'Positive changes within 4-6 weeks'
        }
      }

      const categoryKey = category.toLowerCase()
      return solutions[categoryKey] || solutions['general']
    }

    const solution = generateSolution(problem_category, problem_description)

    // Insert problem solution into database
    const { data: problemSolution, error: insertError } = await supabase
      .from('problem_solutions')
      .insert({
        user_id: user.id,
        problem_category,
        problem_description,
        urgency_level,
        astrological_solution: solution.solution,
        recommended_actions: solution.actions,
        timeline: solution.timeline,
        status: 'active'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting problem solution:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create problem solution' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully created problem solution')

    return new Response(
      JSON.stringify({ 
        success: true, 
        solution: problemSolution,
        message: 'Astrological solution generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in problem solutions function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})