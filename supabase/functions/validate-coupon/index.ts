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
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Coupon code is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Validate coupon code
    const { data: coupon, error } = await supabaseClient
      .from('coupon_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: "Failed to validate coupon" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!coupon) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid coupon code" 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if coupon has remaining uses
    if (coupon.current_uses >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Coupon code has been fully used" 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if coupon has expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Coupon code has expired" 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
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