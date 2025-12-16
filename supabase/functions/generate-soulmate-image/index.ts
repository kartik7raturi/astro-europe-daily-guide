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

    console.log('Generating soulmate portrait sketch with Indian face structure')

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error('HUGGING_FACE_ACCESS_TOKEN is not set')
      return new Response(
        JSON.stringify({ error: 'Hugging Face token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Enhance prompt for Indian face structure and pencil sketch style
    const genderText = gender === 'female' ? 'Indian woman' : gender === 'male' ? 'Indian man' : 'Indian person'
    const enhancedPrompt = `Professional pencil sketch portrait of a beautiful ${genderText} with traditional Indian facial features, almond-shaped eyes, defined cheekbones, straight nose, full lips. Black and white graphite pencil drawing, detailed shading, realistic sketch art style, clean white background, portrait orientation, high detail face study, no color, monochrome. ${prompt}`

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
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

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
