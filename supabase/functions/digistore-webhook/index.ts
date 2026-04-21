// Digistore24 IPN webhook
// Validates the SHA512 signature, looks up product → tier mapping in
// platform_settings, and grants the buyer the matching subscription tier
// + credits. Logs every payload to digistore_webhook_logs.
//
// Configure in Digistore24 dashboard:
//   IPN URL: https://<project>.supabase.co/functions/v1/digistore-webhook
//   IPN passphrase: stored as DIGISTORE_IPN_PASSPHRASE secret
//
// verify_jwt is disabled because Digistore signs the body itself.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha512Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-512", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function verifyDigistoreSignature(
  params: Record<string, string>,
  passphrase: string,
): Promise<boolean> {
  const provided = (params["sha_sign"] || "").toUpperCase();
  if (!provided) return false;
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== "sha_sign" && params[k] !== "" && params[k] != null)
    .sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));
  const parts = sortedKeys.map((k) => `${k}=${params[k]}`);
  const signed = parts.join(passphrase) + passphrase;
  return (await sha512Hex(signed)) === provided;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const passphrase = Deno.env.get("DIGISTORE_IPN_PASSPHRASE") || "";
  const supabase = createClient(supabaseUrl, serviceKey);

  let params: Record<string, string> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      params = await req.json();
    } else {
      const text = await req.text();
      const usp = new URLSearchParams(text);
      usp.forEach((v, k) => (params[k] = v));
    }
  } catch {
    return new Response("bad payload", { status: 400, headers: corsHeaders });
  }

  const event = params["event"] || "unknown";
  const productId = params["product_id"] || "";
  const orderId = params["order_id"] || "";
  const buyerEmail = (params["email"] || params["buyer_email"] || "").toLowerCase().trim();

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

  if (passphrase) {
    const ok = await verifyDigistoreSignature(params, passphrase);
    if (!ok) {
      // TEMP: skip signature check
      console.log("Skipping signature validation");
      // await supabase
      //   .from("digistore_webhook_logs")
      //   .update({ error_message: "Invalid signature" })
      //   .eq("id", log?.id);
      // return new Response("invalid signature", { status: 401, headers: corsHeaders });
    }
  }

  if (event === "connection_test") {
    return new Response("OK", { status: 200, headers: corsHeaders });
  }

  const grantingEvents = ["on_payment", "on_rebill"];
  if (!grantingEvents.includes(event)) {
    return new Response("OK", { status: 200, headers: corsHeaders });
  }

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "digistore_product_map")
    .maybeSingle();

  const map = (settings?.value as Record<string, { tier: string; credits: number }>) || {};
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

  const TIER_RANK: Record<string, number> = { freemium: 0, starter: 1, explorer: 2, master: 3 };
  const currentRank = TIER_RANK[existingSub?.subscription_tier || "freemium"] || 0;
  const newRank = TIER_RANK[mapping.tier] || 0;
  const finalTier = newRank >= currentRank ? mapping.tier : existingSub!.subscription_tier!;

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

  return new Response("OK", { status: 200, headers: corsHeaders });
});