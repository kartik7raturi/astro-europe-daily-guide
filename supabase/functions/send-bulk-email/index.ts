import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { recipients, subject, htmlContent, fromName, fromEmail } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients list is required');
    }
    if (!subject || !htmlContent) {
      throw new Error('Subject and content are required');
    }

    const results = [];
    const batchSize = 10;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient: { email: string; name?: string }) => {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${fromName || 'AstroVibe'} <${fromEmail || 'onboarding@resend.dev'}>`,
              to: [recipient.email],
              subject: subject,
              html: htmlContent.replace(/{{name}}/g, recipient.name || 'Valued Customer'),
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            return { email: recipient.email, success: false, error: JSON.stringify(data) };
          }
          return { email: recipient.email, success: true, id: data.id };
        } catch (err) {
          return { email: recipient.email, success: false, error: err.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return new Response(JSON.stringify({
      success: true,
      total: results.length,
      sent: successCount,
      failed: failCount,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
