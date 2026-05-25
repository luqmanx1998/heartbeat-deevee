import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail({
  to,
  orderId,
  items,
  total,
  shippingAddress,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const logoUrl = `${siteUrl}/deeveeemaildark.png`;
  const heroUrl = `${siteUrl}/book1email.jpeg`;

  const itemsHtml = items
  .map((item) => {
    const imageUrl = item.product_image
      ? `${siteUrl}${item.product_image.startsWith("/") ? "" : "/"}${item.product_image}`
      : `${siteUrl}/book3.jpeg`;

    return `
      <tr>
        <td style="padding:16px 0; border-bottom:1px solid rgba(20,20,20,0.08); width:74px;">
          <img
            src="${imageUrl}"
            alt="${item.product_name}"
            style="width:58px; height:76px; object-fit:cover; border-radius:10px; display:block;"
          />
        </td>

        <td style="padding:16px 0; border-bottom:1px solid rgba(20,20,20,0.08);">
          <div style="font-size:16px; font-weight:700; color:#161616;">
            ${item.product_name}
          </div>
          <div style="margin-top:5px; font-size:13px; color:#777;">
            Quantity ${item.quantity}
          </div>
        </td>

        <td style="padding:16px 0; border-bottom:1px solid rgba(20,20,20,0.08); text-align:right; font-size:15px; color:#161616;">
          €${Number(item.subtotal || 0).toFixed(2)}
        </td>
      </tr>
    `;
  })
  .join("");

  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Your Deevee order is confirmed ✦",
    html: `
      <div style="margin:0; padding:0; background:#0b0b0d; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:640px; margin:0 auto; padding:32px 16px;">
          <div style="overflow:hidden; border-radius:28px; background:#ffffff; box-shadow:0 24px 70px rgba(20,12,6,0.12);">
            
            <div style="background:#090909; padding:34px 24px; text-align:center;">
              <img
                src="${logoUrl}"
                alt="Deevee"
                style="width:190px; max-width:80%; height:auto; display:block; margin:0 auto;"
              />
            </div>

            <div style="margin:0; padding:0; background:#0b0b0d;">
               <img
                src="${heroUrl}"
                alt="Heartbeat"
                style="max-width:80%; height:auto; display:block; margin:0 auto;"
                />
            </div>

            <div style="padding:34px 30px 30px;">
              <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#b8924f;">
                Order confirmed
              </p>

              <h1 style="margin:0; font-size:30px; line-height:1.1; color:#151515; letter-spacing:-0.04em;">
                Thank you for your order ✦
              </h1>

              <p style="margin:16px 0 0; font-size:14px; line-height:1.7; color:#666;">
                Your Deevee order has been received and payment was successful.
              </p>

              <div style="margin-top:24px; padding:16px 18px; border-radius:18px; background:#f7f2eb; border:1px solid #eadfce;">
                <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9b8b7c;">
                  Order ID
                </div>
                <div style="margin-top:6px; font-size:13px; color:#272727; word-break:break-all;">
                  ${orderId}
                </div>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:26px; border-collapse:collapse;">
                ${itemsHtml}

                <tr>
                  <td style="padding-top:20px; font-size:17px; font-weight:700; color:#161616;">
                    Total paid
                  </td>
                  <td style="padding-top:20px; text-align:right; font-size:20px; font-weight:700; color:#161616;">
                    €${Number(total || 0).toFixed(2)}
                  </td>
                </tr>
              </table>

              <div style="margin-top:30px; padding:20px; border-radius:22px; background:#111111; color:#ffffff;">
                <div style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#c8a96b;">
                  Shipping to
                </div>

                <div style="margin-top:12px; white-space:pre-line; font-size:14px; line-height:1.7; color:#f4efe8;">
                  ${shippingAddress || "No shipping address provided"}
                </div>
              </div>

              <p style="margin:26px 0 0; font-size:13px; line-height:1.7; color:#777;">
                If you have any questions, contact us at
                <a href="mailto:xdeeveee@gmail.com" style="color:#8b6cff; text-decoration:none;">
                  xdeeveee@gmail.com
                </a>.
              </p>
            </div>
          </div>

          <p style="margin:18px 0 0; text-align:center; font-size:11px; color:#9b8b7c;">
            Deevee Store · Official order confirmation
          </p>
        </div>
      </div>
    `,
  });
}