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
    
    console.log('Generating color therapy for date:', date)

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

    // Check if color therapy already exists for today
    const today = date || new Date().toISOString().split('T')[0]
    const { data: existingTherapy } = await supabase
      .from('color_therapy')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existingTherapy) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          therapy: existingTherapy,
          message: 'Color therapy retrieved successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Color therapy data
    const colorTherapies = [
      {
        primary: 'Red',
        secondary: ['Orange', 'Pink'],
        avoid: ['Dark Blue', 'Black'],
        meanings: {
          red: 'Energy, passion, courage, action',
          orange: 'Creativity, enthusiasm, warmth',
          pink: 'Love, compassion, nurturing'
        },
        usage: [
          'Wear red accessories for confidence',
          'Add orange elements to your workspace',
          'Use pink in your bedroom for emotional healing'
        ]
      },
      {
        primary: 'Blue',
        secondary: ['Turquoise', 'Indigo'],
        avoid: ['Bright Red', 'Orange'],
        meanings: {
          blue: 'Calm, communication, truth, healing',
          turquoise: 'Balance, clarity, emotional stability',
          indigo: 'Intuition, wisdom, spiritual awareness'
        },
        usage: [
          'Wear blue clothing for peaceful communication',
          'Use turquoise in meditation spaces',
          'Add indigo to enhance spiritual practices'
        ]
      },
      {
        primary: 'Green',
        secondary: ['Yellow-Green', 'Forest Green'],
        avoid: ['Purple', 'Magenta'],
        meanings: {
          green: 'Growth, harmony, abundance, healing',
          yellowGreen: 'Renewal, fresh starts, vitality',
          forestGreen: 'Stability, grounding, nature connection'
        },
        usage: [
          'Surround yourself with green plants',
          'Wear green for heart chakra healing',
          'Use forest green for grounding energy'
        ]
      },
      {
        primary: 'Yellow',
        secondary: ['Gold', 'Lemon'],
        avoid: ['Dark Gray', 'Brown'],
        meanings: {
          yellow: 'Joy, optimism, mental clarity, confidence',
          gold: 'Wisdom, success, divine connection',
          lemon: 'Cleansing, purification, mental sharpness'
        },
        usage: [
          'Add yellow flowers to your space',
          'Wear gold jewelry for success',
          'Use lemon yellow for study areas'
        ]
      },
      {
        primary: 'Purple',
        secondary: ['Lavender', 'Violet'],
        avoid: ['Yellow', 'Green'],
        meanings: {
          purple: 'Spirituality, transformation, luxury, intuition',
          lavender: 'Peace, relaxation, emotional balance',
          violet: 'Crown chakra activation, divine wisdom'
        },
        usage: [
          'Use purple in meditation for spiritual growth',
          'Wear lavender for stress relief',
          'Add violet to enhance psychic abilities'
        ]
      },
      {
        primary: 'Orange',
        secondary: ['Peach', 'Coral'],
        avoid: ['Blue', 'Gray'],
        meanings: {
          orange: 'Creativity, enthusiasm, social connection',
          peach: 'Gentle energy, friendship, warmth',
          coral: 'Emotional healing, self-expression'
        },
        usage: [
          'Wear orange for creative projects',
          'Use peach in social spaces',
          'Add coral to enhance self-expression'
        ]
      },
      {
        primary: 'Pink',
        secondary: ['Rose', 'Magenta'],
        avoid: ['Black', 'Dark Green'],
        meanings: {
          pink: 'Universal love, emotional healing, compassion',
          rose: 'Romance, beauty, self-love',
          magenta: 'Emotional balance, spiritual love'
        },
        usage: [
          'Use pink rose quartz for heart healing',
          'Wear rose colors for self-love',
          'Add magenta for emotional balance'
        ]
      }
    ]

    // Generate color therapy based on date
    const dayOfWeek = new Date(today).getDay()
    const selectedTherapy = colorTherapies[dayOfWeek % colorTherapies.length]

    // Insert color therapy into database
    const { data: therapy, error: insertError } = await supabase
      .from('color_therapy')
      .insert({
        user_id: user.id,
        date: today,
        primary_color: selectedTherapy.primary,
        secondary_colors: selectedTherapy.secondary,
        avoid_colors: selectedTherapy.avoid,
        color_meanings: selectedTherapy.meanings,
        usage_suggestions: selectedTherapy.usage
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting color therapy:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create color therapy' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully created color therapy')

    return new Response(
      JSON.stringify({ 
        success: true, 
        therapy,
        message: 'Color therapy generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in color therapy function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})