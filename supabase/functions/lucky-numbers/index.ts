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
    
    console.log('Generating lucky numbers for date:', date)

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

    // Check if lucky numbers already exist for today
    const today = date || new Date().toISOString().split('T')[0]
    const { data: existingNumbers } = await supabase
      .from('lucky_numbers')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existingNumbers) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          numbers: existingNumbers,
          message: 'Lucky numbers retrieved successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate lucky numbers based on date and user ID
    const dateNum = new Date(today).getTime()
    const userHash = user.id.split('-').join('').slice(0, 8)
    const seed = parseInt(userHash, 16) + dateNum

    // Seeded random number generator
    function seededRandom(seed: number) {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    function generateNumbers(count: number, max: number, seedOffset: number) {
      const numbers = []
      for (let i = 0; i < count; i++) {
        const randomValue = seededRandom(seed + seedOffset + i)
        numbers.push(Math.floor(randomValue * max) + 1)
      }
      return [...new Set(numbers)].slice(0, count) // Remove duplicates and ensure count
    }

    const dailyNumbers = generateNumbers(3, 9, 0)
    const weeklyNumbers = generateNumbers(5, 50, 100)
    const monthlyNumbers = generateNumbers(7, 100, 200)
    const lotteryNumbers = generateNumbers(6, 49, 300)

    // Insert lucky numbers into database
    const { data: numbers, error: insertError } = await supabase
      .from('lucky_numbers')
      .insert({
        user_id: user.id,
        date: today,
        daily_numbers: dailyNumbers,
        weekly_numbers: weeklyNumbers,
        monthly_numbers: monthlyNumbers,
        lottery_numbers: lotteryNumbers
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting lucky numbers:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create lucky numbers' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully created lucky numbers')

    return new Response(
      JSON.stringify({ 
        success: true, 
        numbers,
        message: 'Lucky numbers generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in lucky numbers function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})