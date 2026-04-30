import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail({
  to,
  orderId,
  items,
  total,
  shippingAddress,
}) {
  const itemsHtml = items
    .map(
      (item) => `
      <div style="margin-bottom:12px;">
        <strong>${item.product_name}</strong><br/>
        Qty: ${item.quantity} — €${item.subtotal}
      </div>
    `
    )
    .join("");

  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Your Deevee order is confirmed ✦",
    html: `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
        <h2 style="letter-spacing:2px;">DEE VEE</h2>

        <h3>Your order is confirmed ✦</h3>

        <p>Order ID: ${orderId}</p>

        <hr/>

        ${itemsHtml}

        <hr/>

        <p><strong>Total:</strong> €${total}</p>

        <p style="white-space:pre-line;">
          <strong>Shipping to:</strong>
          ${shippingAddress}
        </p>

        <hr/>

        <p style="font-size:12px; color:#666;">
          If you have any questions, contact us at xdeevee@gmail.com
        </p>
      </div>
    `,
  });
}