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
    const { questions, reading_type, priority = 'normal' } = await req.json()
    
    if (!questions || !reading_type) {
      return new Response(
        JSON.stringify({ error: 'Questions and reading type are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Creating personal reading:', { reading_type, priority })

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

    // Generate responses based on questions
    const responses = questions.map((question: string) => {
      // Simple AI-like response generation based on question content
      if (question.toLowerCase().includes('love') || question.toLowerCase().includes('relationship')) {
        return "Venus's influence suggests a period of emotional growth. Your heart chakra is opening to new possibilities. Trust your intuition in matters of love."
      } else if (question.toLowerCase().includes('career') || question.toLowerCase().includes('work')) {
        return "Mars is strongly positioned in your chart, indicating professional success. Focus on your unique talents and don't be afraid to take calculated risks."
      } else if (question.toLowerCase().includes('health') || question.toLowerCase().includes('wellness')) {
        return "Your life force is strong, but pay attention to balance. Mercury retrograde suggests taking time for rest and meditation."
      } else if (question.toLowerCase().includes('money') || question.toLowerCase().includes('finance')) {
        return "Jupiter's blessing brings financial opportunities. Stay grounded and make practical decisions. Avoid impulsive investments."
      } else {
        return "The cosmic energies are aligned in your favor. Trust the universe's plan and remain open to guidance from your higher self."
      }
    })

    // Insert personal reading into database
    const { data: reading, error: insertError } = await supabase
      .from('personal_readings')
      .insert({
        user_id: user.id,
        reading_type,
        questions,
        responses,
        priority,
        status: 'completed'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting personal reading:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create personal reading' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully created personal reading')

    return new Response(
      JSON.stringify({ 
        success: true, 
        reading,
        message: 'Your personal reading has been completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in personal readings function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})