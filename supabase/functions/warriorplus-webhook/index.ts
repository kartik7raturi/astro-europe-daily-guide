// WarriorPlus IPN webhook
// Verifies the wp_signature using the vendor API key, looks up product →
// tier mapping in platform_settings (key: warriorplus_product_map), and
// grants the buyer the matching subscription tier + credits. Logs every
// payload to digistore_webhook_logs (reused as generic IPN log table).
//
// Configure in WarriorPlus → Vendor Settings → Instant Notifications:
//   Notification URL: https://<project>.supabase.co/functions/v1/warriorplus-webhook
//   API Key: stored as WARRIORPLUS_API_KEY secret
//
// verify_jwt is disabled because WarriorPlus signs the body itself.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha1Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// WarriorPlus signature algorithm:
//   1. Take all POSTed params except wp_signature
//   2. Sort by key (case-insensitive)
//   3. Concatenate the values (no separator)
//   4. Append the vendor API key
//   5. SHA1 the resulting string → compare to wp_signature
async function verifyWarriorPlusSignature(
  params: Record<string, string>,
  apiKey: string,
): Promise<boolean> {
  const provided = (params["wp_signature"] || "").toLowerCase();
  if (!provided) return false;
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== "wp_signature")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const concatenated = sortedKeys.map((k) => params[k] ?? "").join("") + apiKey;
  return (await sha1Hex(concatenated)) === provided;
}

Deno.serve(async (req) => {
  // Always respond 200 to the IPN — never 4xx/5xx — to avoid retry storms.
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    console.log("WarriorPlus webhook hit:", req.method, req.url);

    if (req.method !== "POST") {
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let params: Record<string, string> = {};
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    try {
      if (ct.includes("application/json")) {
        params = await req.json();
      } else if (ct.includes("multipart/form-data")) {
        const fd = await req.formData();
        fd.forEach((v, k) => (params[k] = String(v)));
      } else {
        const text = await req.text();
        const usp = new URLSearchParams(text);
        usp.forEach((v, k) => (params[k] = v));
      }
    } catch (e) {
      console.error("Payload parse error:", e);
    }

    try {
      const url = new URL(req.url);
      url.searchParams.forEach((v, k) => {
        if (!params[k]) params[k] = v;
      });
    } catch {}

    console.log("WarriorPlus params:", JSON.stringify(params));

    // WarriorPlus uses action_type values like: sale, refund, chargeback,
    // bill, rebill, cancel-rebill. Product is identified by wp_product_id
    // (offer id) or wp_offer_id.
    const event = params["action"] || params["action_type"] || "unknown";
    const productId = String(
      params["wp_product_id"] || params["product_id"] || params["wp_offer_id"] || "",
    );
    const orderId = String(
      params["wp_sale_id"] || params["sale_id"] || params["transaction_id"] || "",
    );
    const buyerEmail = String(
      params["wp_buyer_email"] || params["buyer_email"] || params["email"] || "",
    )
      .toLowerCase()
      .trim();

    const { data: log } = await supabase
      .from("digistore_webhook_logs")
      .insert({
        event,
        product_id: productId,
        order_id: orderId,
        buyer_email: buyerEmail,
        raw_payload: params,
      })
      .select()
      .single();

    // Connection / test pings — WarriorPlus sometimes sends "test" action.
    if (event === "test" || event === "connection_test") {
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("WARRIORPLUS_API_KEY") || "";
    if (apiKey) {
      const signatureOk = await verifyWarriorPlusSignature(params, apiKey);
      if (!signatureOk) {
        console.warn("Invalid WarriorPlus signature for order", orderId);
        await supabase
          .from("digistore_webhook_logs")
          .update({ error_message: "Invalid signature" })
          .eq("id", log?.id);
        return new Response("OK", { status: 200, headers: corsHeaders });
      }
    } else {
      console.warn("WARRIORPLUS_API_KEY not set — skipping signature check");
    }

    const grantingEvents = ["sale", "bill", "rebill", "test-sale"];
    if (!grantingEvents.includes(event)) {
      console.log("Non-granting event, ignoring:", event);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const { data: settings } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "warriorplus_product_map")
      .maybeSingle();

    const map =
      (settings?.value as Record<string, { tier: string; credits: number }>) || {};
    const mapping = map[productId];
    if (!mapping) {
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: `No mapping for product_id ${productId}` })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    if (!buyerEmail) {
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: "Missing buyer email" })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const { data: existingSub } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", buyerEmail)
      .maybeSingle();

    const TIER_RANK: Record<string, number> = {
      freemium: 0,
      starter: 1,
      explorer: 2,
      master: 3,
    };
    const currentRank = TIER_RANK[existingSub?.subscription_tier || "freemium"] || 0;
    const newRank = TIER_RANK[mapping.tier] || 0;
    const finalTier =
      newRank >= currentRank ? mapping.tier : existingSub!.subscription_tier!;

    const subRow = {
      email: buyerEmail,
      subscribed: true,
      subscription_tier: finalTier,
      subscription_end: null as string | null,
      user_id: existingSub?.user_id ?? null,
      updated_at: new Date().toISOString(),
    };

    if (existingSub) {
      await supabase.from("subscribers").update(subRow).eq("id", existingSub.id);
    } else {
      await supabase.from("subscribers").insert(subRow);
    }

    if (existingSub?.user_id && mapping.credits > 0) {
      const { data: creditsRow } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", existingSub.user_id)
        .maybeSingle();

      if (creditsRow) {
        await supabase
          .from("user_credits")
          .update({
            credits_remaining: (creditsRow.credits_remaining || 0) + mapping.credits,
            total_credits_purchased:
              (creditsRow.total_credits_purchased || 0) + mapping.credits,
          })
          .eq("user_id", existingSub.user_id);
      } else {
        await supabase.from("user_credits").insert({
          user_id: existingSub.user_id,
          credits_remaining: mapping.credits,
          total_credits_purchased: mapping.credits,
        });
      }
    }

    await supabase
      .from("digistore_webhook_logs")
      .update({ processed: true })
      .eq("id", log?.id);

    console.log("VIP/tier granted:", { buyerEmail, finalTier, credits: mapping.credits });
    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Webhook fatal error:", err);
    return new Response("OK", { status: 200, headers: corsHeaders });
  }
});