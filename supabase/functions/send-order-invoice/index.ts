import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceRequest {
  orderId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId }: InvoiceRequest = await req.json();
    console.log("Sending invoice for order:", orderId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order.customer_email) {
      return new Response(
        JSON.stringify({ error: "No customer email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;

    // Build items table
    let itemsHtml = '';
    let subtotal = 0;
    
    if (order.metadata?.cart_items && Array.isArray(order.metadata.cart_items)) {
      order.metadata.cart_items.forEach((item: any) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${itemTotal}</td>
          </tr>
        `;
      });
    } else {
      itemsHtml = `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${order.order_type}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${order.amount}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${order.amount}</td>
        </tr>
      `;
      subtotal = order.amount;
    }

    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 16px 16px 0 0;">
      <table style="width: 100%;">
        <tr>
          <td>
            <h1 style="color: white; margin: 0; font-size: 28px;">✨ AstroVibe</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0 0;">Astrology & Numerology Services</p>
          </td>
          <td style="text-align: right;">
            <h2 style="color: white; margin: 0; font-size: 24px;">INVOICE</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0 0; font-weight: 600;">${invoiceNumber}</p>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Invoice Body -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Bill To & Invoice Details -->
      <table style="width: 100%; margin-bottom: 30px;">
        <tr>
          <td style="vertical-align: top; width: 50%;">
            <h3 style="color: #6b7280; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">Bill To</h3>
            <p style="color: #111827; margin: 0; font-weight: 600; font-size: 16px;">${order.customer_name || 'Customer'}</p>
            <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">${order.customer_email}</p>
            ${order.customer_phone ? `<p style="color: #6b7280; margin: 4px 0; font-size: 14px;">${order.customer_phone}</p>` : ''}
            ${order.shipping_address ? `
            <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px; line-height: 1.5;">
              ${order.shipping_address.address || ''}<br>
              ${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} ${order.shipping_address.pincode || ''}<br>
              ${order.shipping_address.country || 'India'}
            </p>
            ` : ''}
          </td>
          <td style="vertical-align: top; text-align: right;">
            <table style="margin-left: auto;">
              <tr>
                <td style="color: #6b7280; padding: 4px 12px 4px 0;">Invoice Date:</td>
                <td style="color: #111827; font-weight: 600;">${orderDate}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 4px 12px 4px 0;">Order ID:</td>
                <td style="color: #111827; font-weight: 600;">#${order.id.slice(0, 8)}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 4px 12px 4px 0;">Payment Status:</td>
                <td><span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">PAID</span></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Item</th>
            <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Price</th>
            <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end;">
        <table style="width: 250px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
            <td style="padding: 8px 0; text-align: right; color: #111827;">₹${subtotal}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Tax (Included):</td>
            <td style="padding: 8px 0; text-align: right; color: #111827;">₹0</td>
          </tr>
          <tr style="border-top: 2px solid #e5e7eb;">
            <td style="padding: 12px 0; color: #111827; font-weight: 700; font-size: 18px;">Total:</td>
            <td style="padding: 12px 0; text-align: right; color: #667eea; font-weight: 700; font-size: 18px;">₹${order.amount}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Thank you for your purchase! ✨
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 8px;">
          This is a computer-generated invoice. No signature required.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 4px;">
          For any queries, please contact support@astrovibe.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "AstroVibe <onboarding@resend.dev>",
      to: [order.customer_email],
      subject: `Invoice ${invoiceNumber} - AstroVibe Order`,
      html: invoiceHtml,
    });

    console.log("Invoice email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, invoiceNumber, emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending invoice:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
