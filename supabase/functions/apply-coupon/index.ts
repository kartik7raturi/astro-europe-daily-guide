import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, orderId } = await req.json();

    if (!code || !orderId) {
      return new Response(
        JSON.stringify({ error: "Coupon code and order ID are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client with service role for updating
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get and validate coupon
    const { data: coupon, error: fetchError } = await supabaseClient
      .from('coupon_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (fetchError) {
      console.error('Database error:', fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to validate coupon" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!coupon || coupon.current_uses >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired coupon code" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Increment coupon usage
    const { error: updateError } = await supabaseClient
      .from('coupon_codes')
      .update({ 
        current_uses: coupon.current_uses + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', coupon.id);

    if (updateError) {
      console.error('Error updating coupon:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to apply coupon" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        discount_percentage: coupon.discount_percentage,
        code: coupon.code
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});