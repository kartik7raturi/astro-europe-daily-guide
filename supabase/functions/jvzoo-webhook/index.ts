// JVZoo IPN webhook
// Verifies the JVZoo `cverify` signature, looks up the product in
// platform_settings (key: jvzoo_product_map → { "<product_id>": { tier, credits } })
// and grants the buyer the matching subscription tier + credits.
//
// JVZoo IPN setup:
//   Notification URL: https://xoslysosyomsteckufvn.supabase.co/functions/v1/jvzoo-webhook
//   Secret Key:       generate at https://www.jvzoo.com/sellers/sellersettings (IPN settings)
//   Store the key as the JVZOO_SECRET_KEY secret in Supabase.
//
// Signature algorithm:
//   1. Take all POSTed params except `cverify`
//   2. Sort by key (case-sensitive)
//   3. Join values with `|`
//   4. Append the JVZoo secret key
//   5. SHA1 the result, uppercase, take the first 8 chars → must equal `cverify`

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

async function verifyJvzooSignature(
  params: Record<string, string>,
  secretKey: string,
): Promise<boolean> {
  const provided = (params["cverify"] || "").toUpperCase();
  if (!provided) return false;
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== "cverify")
    .sort();
  const concatenated = sortedKeys.map((k) => params[k] ?? "").join("|") + secretKey;
  const sha = (await sha1Hex(concatenated)).toUpperCase();
  console.log("SIG DEBUG", JSON.stringify({
    provided,
    computed: sha.substring(0, 8),
    sortedKeys,
    joinedNoSecret: sortedKeys.map((k) => params[k] ?? "").join("|"),
    secretLen: secretKey.length,
    secretPrefix: secretKey.substring(0, 6),
  }));
  return sha.substring(0, 8) === provided;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    console.log("JVZoo webhook hit:", req.method, req.url);
    if (req.method !== "POST") return new Response("OK", { status: 200, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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
        new URLSearchParams(text).forEach((v, k) => (params[k] = v));
      }
    } catch (e) {
      console.error("Payload parse error:", e);
    }

    console.log("JVZoo params:", JSON.stringify(params));

    // JVZoo `ctransaction` values: SALE, BILL, RFND, CGBK, INSF, CANCEL-REBILL, UNCANCEL-REBILL
    const event = (params["ctransaction"] || "unknown").toUpperCase();
    const productId = String(params["cproditem"] || "");
    const orderId = String(params["ctransreceipt"] || "");
    const buyerEmail = String(params["ccustemail"] || "").toLowerCase().trim();

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

    const secret = Deno.env.get("JVZOO_SECRET_KEY") || "";
    if (!secret) {
      console.warn("JVZOO_SECRET_KEY not set — rejecting");
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: "JVZOO_SECRET_KEY not configured" })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const signatureOk = await verifyJvzooSignature(params, secret);
    if (!signatureOk) {
      console.warn("Invalid JVZoo signature for order", orderId);
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: "Invalid signature" })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const grantingEvents = ["SALE", "BILL", "UNCANCEL-REBILL"];
    if (!grantingEvents.includes(event)) {
      console.log("Non-granting event, ignoring:", event);
      await supabase
        .from("digistore_webhook_logs")
        .update({ processed: true })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const { data: settings } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "jvzoo_product_map")
      .maybeSingle();

    const map =
      (settings?.value as Record<string, { tier: string; credits: number }>) || {};
    // Default mapping fallback if admin hasn't configured one yet.
    const defaultMap: Record<string, { tier: string; credits: number }> = {
      "soulmate-19": { tier: "starter", credits: 1 },
      "vip-99": { tier: "master", credits: 10 },
      "plr-999": { tier: "master", credits: 100 },
    };
    const mapping = map[productId] || defaultMap[productId] || { tier: "starter", credits: 1 };

    if (!buyerEmail) {
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: "Missing buyer email" })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const { data: grant, error: grantErr } = await supabase.rpc("grant_subscription", {
      p_email: buyerEmail,
      p_tier: mapping.tier,
      p_credits: mapping.credits,
    });
    if (grantErr) {
      console.error("grant_subscription error:", grantErr);
      await supabase
        .from("digistore_webhook_logs")
        .update({ error_message: grantErr.message })
        .eq("id", log?.id);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    await supabase
      .from("digistore_webhook_logs")
      .update({ processed: true })
      .eq("id", log?.id);

    console.log("JVZoo grant:", { buyerEmail, ...mapping, grant });
    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Webhook fatal error:", err);
    return new Response("OK", { status: 200, headers: corsHeaders });
  }
});