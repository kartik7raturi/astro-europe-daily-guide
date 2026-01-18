import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: {
    user_id: string;
    amount: number;
    order_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    metadata: any;
    affiliate_code?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    }: PaymentVerification = await req.json();

    console.log("Verifying payment:", { razorpay_order_id, razorpay_payment_id });

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret key not configured");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature verification failed");
      return new Response(
        JSON.stringify({ error: "Payment verification failed" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Signature verified successfully");

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
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        metadata: orderData.metadata,
        payment_provider: 'razorpay'
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    console.log("Order created:", order.id);

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
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({ orderId: order.id })
      });
      console.log("Invoice email triggered");
    } catch (emailError) {
      console.error("Error sending invoice email:", emailError);
    }

    // Clear cart items
    if (orderData.user_id) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', orderData.user_id);
      console.log("Cart cleared");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id,
        message: "Payment verified and order created successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
