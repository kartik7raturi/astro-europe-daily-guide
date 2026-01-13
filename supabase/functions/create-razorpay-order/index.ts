import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'INR', planName } = await req.json();
    console.log('Received payment request:', { amount, currency, planName });

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    console.log('Environment check:', { 
      razorpayKeyId: razorpayKeyId ? `${razorpayKeyId.substring(0, 8)}...` : 'MISSING',
      razorpayKeySecret: razorpayKeySecret ? 'Present' : 'MISSING',
      allEnvVars: Object.keys(Deno.env.toObject())
    });

    if (!razorpayKeyId || !razorpayKeySecret) {
      const errorMsg = `Razorpay credentials missing - KeyID: ${!!razorpayKeyId}, KeySecret: ${!!razorpayKeySecret}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: planName
      }
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const responseText = await response.text();
    console.log('Razorpay API response status:', response.status);
    console.log('Razorpay API response:', responseText);

    if (!response.ok) {
      console.error('Razorpay API error:', responseText);
      throw new Error(`Razorpay API error: ${responseText}`);
    }

    let order;
    try {
      order = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Razorpay response:', e);
      throw new Error('Invalid response from Razorpay');
    }

    return new Response(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create-razorpay-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});