import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  newStatus: string;
  trackingNumber?: string;
}

const getStatusMessage = (status: string): { title: string; message: string; color: string } => {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    pending: {
      title: "Order Received",
      message: "We have received your order and are processing it.",
      color: "#EAB308"
    },
    accepted: {
      title: "Order Accepted",
      message: "Great news! Your order has been accepted and is being prepared.",
      color: "#3B82F6"
    },
    fulfilled: {
      title: "Order Fulfilled",
      message: "Your order has been fulfilled and is ready for shipping.",
      color: "#8B5CF6"
    },
    shipped: {
      title: "Order Shipped",
      message: "Your order is on its way! Track your package using the tracking number below.",
      color: "#F97316"
    },
    delivered: {
      title: "Order Delivered",
      message: "Your order has been delivered. We hope you enjoy your purchase!",
      color: "#22C55E"
    },
    cancelled: {
      title: "Order Cancelled",
      message: "Your order has been cancelled. If you have any questions, please contact us.",
      color: "#EF4444"
    }
  };
  return statusMessages[status] || statusMessages.pending;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, trackingNumber }: OrderNotificationRequest = await req.json();
    console.log("Sending notification for order:", orderId, "status:", newStatus);

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
      console.log("No customer email found for order:", orderId);
      return new Response(
        JSON.stringify({ success: true, message: "No email to send to" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const statusInfo = getStatusMessage(newStatus);
    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">✨ AstroVibe</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Order Update</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background-color: ${statusInfo.color}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600;">
          ${statusInfo.title}
        </div>
      </div>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Hello ${order.customer_name || 'Valued Customer'},
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        ${statusInfo.message}
      </p>
      
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Order ID:</td>
            <td style="color: #111827; font-weight: 600; text-align: right;">#${order.id.slice(0, 8)}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Order Date:</td>
            <td style="color: #111827; text-align: right;">${orderDate}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Amount:</td>
            <td style="color: #111827; font-weight: 600; text-align: right;">${order.currency} ${order.amount}</td>
          </tr>
          ${trackingNumber || order.tracking_number ? `
          <tr>
            <td style="color: #6b7280; padding: 8px 0;">Tracking Number:</td>
            <td style="color: #667eea; font-weight: 600; text-align: right;">${trackingNumber || order.tracking_number}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      ${order.shipping_address && Object.keys(order.shipping_address).length > 0 ? `
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 18px;">📍 Shipping Address</h3>
        <p style="color: #374151; margin: 0; line-height: 1.6;">
          ${order.shipping_address.address || ''}<br>
          ${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} - ${order.shipping_address.pincode || ''}<br>
          ${order.shipping_address.country || 'India'}
        </p>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Thank you for choosing AstroVibe! ✨
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 8px;">
          If you have any questions, please contact our support team.
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
      subject: `${statusInfo.title} - Order #${order.id.slice(0, 8)}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
