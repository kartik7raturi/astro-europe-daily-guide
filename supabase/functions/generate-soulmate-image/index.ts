import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, gender } = await req.json()
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Generating realistic color soulmate portrait with Indian face structure')

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error('HUGGING_FACE_ACCESS_TOKEN is not set')
      return new Response(
        JSON.stringify({ error: 'Hugging Face token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Enhance prompt for beautiful pencil sketch portrait using numerology
    const genderText = gender === 'female' ? 'beautiful young woman with soft feminine features' : gender === 'male' ? 'handsome young man with strong masculine features' : 'attractive young person'
    const enhancedPrompt = `Professional artistic pencil sketch portrait of a ${genderText}, full face forward facing view, clear unobstructed face, no hair covering face, detailed graphite pencil drawing style, fine line art, beautiful expressive eyes, symmetrical facial features, gentle smile, clean white paper background, high detail pencil strokes, artistic sketch technique, portrait illustration, no shading on face, well-defined facial contours, elegant and attractive appearance, masterful pencil artwork, classical portrait style, front-facing composition, nothing covering or obscuring any part of the face. Based on numerology: ${prompt}`

    console.log('Enhanced prompt:', enhancedPrompt)

    const apiUrl = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancedPrompt
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const image = await response.blob()
    const arrayBuffer = await image.arrayBuffer()
    
    // Convert to base64 in chunks to avoid stack overflow
    const uint8Array = new Uint8Array(arrayBuffer)
    let binary = ''
    const chunkSize = 8192
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize)
      binary += String.fromCharCode(...chunk)
    }
    const base64 = btoa(binary)

    console.log('Successfully generated soulmate portrait sketch')

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating soulmate image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate soulmate image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
