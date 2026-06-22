import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail({
  to,
  orderId,
  items,
  total,
  shippingAddress,
  orderAccessToken,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const logoUrl = `${siteUrl}/deeveeemaildark2.png`;
  const heroUrl = `${siteUrl}/emailhero.jpg`;
  const orderLink = `${siteUrl}/store/order/${orderId}?token=${orderAccessToken}`;

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
            Menge ${item.quantity}
          </div>
        </td>

        <td style="padding:16px 0; border-bottom:1px solid rgba(20,20,20,0.08); text-align:right; font-size:15px; color:#161616;">
          €${Number(item.subtotal || 0).toFixed(2)}
        </td>
      </tr>
    `;
    })
    .join("");

    console.log("SEND ORDER EMAIL DEBUG", {
  orderId,
  orderAccessToken,
  orderLink,
});

  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Deine Deevee Bestellung wurde bestätigt",
    html: `
      <div style="margin:0; padding:0; background:#0b0b0d; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:640px; margin:0 auto; padding:32px 16px;">
          <div style="overflow:hidden; border-radius:28px; background:#ffffff; box-shadow:0 24px 70px rgba(20,12,6,0.12);">
            
            <div style="text-align:center;">
              <img
                src="${logoUrl}"
                alt="Deevee"
                style="width:640px; max-width:100%; height:auto; display:block; margin:0 auto;"
              />
            </div>

            <div style="margin:0; padding:0; background:#0b0b0d;">
               <img
                src="${heroUrl}"
                alt="Heartbeat"
                style="width:640px; max-width:100%; height:auto; display:block; margin:0 auto;"
                />
            </div>

            <div style="padding:34px 30px 30px;">
              <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#b8924f;">
                Bestellung bestätigt
              </p>

              <h1 style="margin:0; font-size:30px; line-height:1.1; color:#151515; letter-spacing:-0.04em;">
                Vielen Dank für deine Bestellung
              </h1>

              <p style="margin:16px 0 0; font-size:14px; line-height:1.7; color:#666;">
                Deine Bestellung wurde erfolgreich erhalten und die Zahlung wurde bestätigt.
              </p>

              <div style="margin-top:24px; padding:16px 18px; border-radius:18px; background:#f7f2eb; border:1px solid #eadfce;">
                <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9b8b7c;">
                  Bestellnummer
                </div>
                <div style="margin-top:6px; font-size:13px; color:#272727; word-break:break-all;">
                  ${orderId}
                </div>
              </div>

              <div style="margin-top:22px; text-align:center;">
              <a
                href="${orderLink}"
                style="
                  display:inline-block;
                  padding:14px 22px;
                  border-radius:999px;
                  background:#111111;
                  color:#ffffff;
                  font-size:13px;
                  font-weight:700;
                  text-decoration:none;
                "
              >
                Bestellung ansehen / stornieren
              </a>
            </div>

                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:26px; border-collapse:collapse;">
                ${itemsHtml}

                <tr>
                <td colspan="2" style="padding-top:20px; font-size:17px; font-weight:700; color:#161616;">
                  Gesamtbetrag
                </td>
                <td style="padding-top:20px; text-align:right; font-size:20px; font-weight:700; color:#161616;">
                  €${Number(total || 0).toFixed(2)}
                </td>
              </tr>
                            </table>

              <div style="margin-top:30px; padding:20px; border-radius:22px; background:#111111; color:#ffffff;">
                <div style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#c8a96b;">
                  Lieferadresse
                </div>

                <div style="white-space:pre-line; font-size:14px; line-height:1.7; color:#f4efe8;">
                 ${shippingAddress || "Keine Lieferadresse angegeben"}
                </div>
              </div>

              <div
  style="
    margin-top:28px;
    padding:20px;
    border-radius:22px;
    background:#f7f2eb;
    border:1px solid #eadfce;
  "
>
  <div
    style="
      font-size:11px;
      letter-spacing:0.22em;
      text-transform:uppercase;
      color:#9b8b7c;
      margin-bottom:8px;
    "
  >
    Hilfe & Rücksendungen
  </div>

  <p
    style="
      margin:0;
      font-size:14px;
      line-height:1.7;
      color:#272727;
    "
  >
    Bei Fragen zu deiner Bestellung, Versand, Rückerstattungen oder
    Rücksendungen kontaktiere uns bitte unter:
  </p>

  <p
    style="
      margin:10px 0 0;
      font-size:16px;
      font-weight:700;
    "
  >
    <a
      href="mailto:xdeeveee@gmail.com"
      style="
        color:#8b6cff;
        text-decoration:none;
      "
    >
      xdeeveee@gmail.com
    </a>
  </p>
</div>
            </div>
          </div>

          <p style="margin:18px 0 0; text-align:center; font-size:11px; color:#9b8b7c;">
            Deevee Store · Offizielle Bestellbestätigung
          </p>
        </div>
      </div>
    `,
  });
}
