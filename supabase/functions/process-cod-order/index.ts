import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CODOrderData {
  user_id: string;
  amount: number;
  order_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  metadata: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: CODOrderData = await req.json();
    console.log("Processing COD order:", orderData);

    // Validate required fields
    if (!orderData.user_id || !orderData.amount || !orderData.customer_name || !orderData.customer_phone) {
      throw new Error("Missing required order details");
    }

    // Create order in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        order_type: orderData.order_type,
        amount: orderData.amount,
        currency: 'INR',
        status: 'pending',
        payment_id: `COD_${Date.now()}`,
        order_id: `COD_ORDER_${Date.now()}`,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        metadata: orderData.metadata,
        payment_provider: 'cod'
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating COD order:", orderError);
      throw orderError;
    }

    console.log("COD Order created:", order.id);

    // Send invoice email
    try {
      await supabase.functions.invoke('send-order-invoice', {
        body: { orderId: order.id }
      });
      console.log("Invoice email triggered for COD order");
    } catch (emailError) {
      console.error("Error sending invoice email:", emailError);
    }

    // Clear cart items
    if (orderData.user_id) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', orderData.user_id);
      console.log("Cart cleared for COD order");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id,
        message: "COD order placed successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error processing COD order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
