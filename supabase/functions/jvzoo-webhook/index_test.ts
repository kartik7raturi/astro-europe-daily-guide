// Live end-to-end test of the JVZoo webhook for all three price points.
// Uses the real JVZOO_SECRET_KEY secret to sign payloads, fires them at the
// deployed function, then asserts the subscriber row & credits in Supabase.
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SECRET = Deno.env.get("JVZOO_SECRET_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/jvzoo-webhook`;

async function sha1Hex(s: string) {
  const h = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(params: Record<string, string>) {
  const keys = Object.keys(params).filter((k) => k !== "cverify").sort();
  const joined = keys.map((k) => params[k]).join("|") + SECRET;
  return (await sha1Hex(joined)).toUpperCase().substring(0, 8);
}

async function fire(productId: string, email: string) {
  const params: Record<string, string> = {
    ctransaction: "SALE",
    cproditem: productId,
    ctransreceipt: `TEST-${Date.now()}-${productId}`,
    ccustemail: email,
    ccustname: "Test Buyer",
    ctransamount: productId === "soulmate-19" ? "19.99" : productId === "vip-99" ? "99" : "999",
  };
  params.cverify = await sign(params);
  const body = new URLSearchParams(params).toString();
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  return { status: res.status, text };
}

const cases: Array<{ pid: string; email: string; tier: string }> = [
  { pid: "soulmate-19", email: `jvzoo-test-19-${Date.now()}@example.com`, tier: "starter" },
  { pid: "vip-99", email: `jvzoo-test-99-${Date.now()}@example.com`, tier: "master" },
  { pid: "plr-999", email: `jvzoo-test-999-${Date.now()}@example.com`, tier: "master" },
];

Deno.test("JVZoo webhook grants correct tier for each price point", async () => {
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  for (const c of cases) {
    const r = await fire(c.pid, c.email);
    console.log(`[${c.pid}] →`, r.status, r.text);
    assertEquals(r.status, 200);

    // Allow a brief moment for the upsert
    await new Promise((r) => setTimeout(r, 500));

    const { data: sub, error } = await sb
      .from("subscribers")
      .select("email, subscribed, subscription_tier")
      .eq("email", c.email)
      .maybeSingle();
    if (error) throw error;
    console.log(`[${c.pid}] subscriber:`, sub);
    assertEquals(sub?.subscribed, true, `subscribed flag for ${c.pid}`);
    assertEquals(sub?.subscription_tier, c.tier, `tier for ${c.pid}`);

    // Clean up
    await sb.from("subscribers").delete().eq("email", c.email);
  }
});

Deno.test("JVZoo webhook rejects invalid signature", async () => {
  const email = `jvzoo-test-bad-${Date.now()}@example.com`;
  const body = new URLSearchParams({
    ctransaction: "SALE",
    cproditem: "soulmate-19",
    ctransreceipt: `BAD-${Date.now()}`,
    ccustemail: email,
    cverify: "DEADBEEF",
  }).toString();
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  await res.text();
  assertEquals(res.status, 200); // we always return 200 to JVZoo

  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: sub } = await sb
    .from("subscribers")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  assertEquals(sub, null, "no subscriber row should be created for invalid signature");
});