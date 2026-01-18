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
  affiliate_code?: string;
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

    // Process affiliate commission if affiliate code is provided
    if (orderData.affiliate_code) {
      console.log("Processing affiliate commission for code:", orderData.affiliate_code);
      
      try {
        // Find the affiliate by code
        const { data: affiliate, error: affiliateError } = await supabase
          .from('affiliates')
          .select('*')
          .eq('affiliate_code', orderData.affiliate_code)
          .eq('status', 'approved')
          .single();

        if (affiliateError) {
          console.log("Affiliate not found or not approved:", affiliateError.message);
        } else if (affiliate) {
          console.log("Found affiliate:", affiliate.id);
          
          // Calculate commission
          const commissionAmount = (orderData.amount * affiliate.commission_rate) / 100;
          
          // Create affiliate order record
          const { error: affiliateOrderError } = await supabase
            .from('affiliate_orders')
            .insert({
              affiliate_id: affiliate.id,
              order_id: order.id,
              order_amount: orderData.amount,
              commission_amount: commissionAmount,
              commission_paid: false
            });

          if (affiliateOrderError) {
            console.error("Error creating affiliate order:", affiliateOrderError);
          } else {
            console.log("Affiliate order created with commission:", commissionAmount);
            
            // Update affiliate stats
            const { error: updateError } = await supabase
              .from('affiliates')
              .update({
                total_referrals: affiliate.total_referrals + 1,
                total_earnings: affiliate.total_earnings + commissionAmount,
                pending_earnings: affiliate.pending_earnings + commissionAmount
              })
              .eq('id', affiliate.id);

            if (updateError) {
              console.error("Error updating affiliate stats:", updateError);
            } else {
              console.log("Affiliate stats updated successfully");
            }
          }
        }
      } catch (affiliateProcessError) {
        console.error("Error processing affiliate:", affiliateProcessError);
        // Don't fail the order if affiliate processing fails
      }
    }

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
