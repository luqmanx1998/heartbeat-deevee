import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(request) {
  try {
    const secret = request.headers.get("x-low-stock-secret");

    if (secret !== process.env.LOW_STOCK_SECRET) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { productId, threshold = 5 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name, stock, image, low_stock_email_sent")
      .eq("id", productId)
      .single();

    if (productError) throw productError;

    const stock = Number(product.stock ?? 0);

    if (stock > threshold) {
      await supabaseAdmin
        .from("products")
        .update({ low_stock_email_sent: false })
        .eq("id", product.id);

      return NextResponse.json({ success: true, sent: false, reason: "Stock is healthy." });
    }

    if (product.low_stock_email_sent) {
      return NextResponse.json({ success: true, sent: false, reason: "Already sent." });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const logoUrl = `${siteUrl}/deeveeemaildark2.png`;
    const productImageUrl = product.image
      ? `${siteUrl}${product.image.startsWith("/") ? "" : "/"}${product.image}`
      : `${siteUrl}/book3.jpeg`;

    const html = `
      <div style="margin:0; padding:0; background:#0b0b0d; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:640px; margin:0 auto; padding:32px 16px;">
          <div style="overflow:hidden; border-radius:28px; background:#ffffff; box-shadow:0 24px 70px rgba(20,12,6,0.12);">
            <img src="${logoUrl}" alt="Deevee" style="width:100%; height:auto; display:block;" />

            <div style="padding:34px 30px 30px;">
              <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#b8924f;">
                Low Stock Warning
              </p>

              <h1 style="margin:0; font-size:32px; line-height:1.1; color:#151515;">
                Bestand ist niedrig ✦
              </h1>

              <div style="margin-top:26px; padding:20px; border-radius:22px; background:#111111;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:86px; vertical-align:top;">
                      <img src="${productImageUrl}" alt="${escapeHtml(product.name)}" style="width:70px; height:92px; object-fit:cover; border-radius:10px; display:block;" />
                    </td>
                    <td style="vertical-align:top;">
                      <p style="margin:0; font-size:18px; color:#ffffff; font-weight:700;">
                        ${escapeHtml(product.name)}
                      </p>
                      <p style="margin:10px 0 0; font-size:15px; color:#f4efe8;">
                        Aktueller Bestand: <strong>${stock}</strong>
                      </p>
                      <p style="margin:8px 0 0; font-size:14px; color:#b9b9b9;">
                        Schwellenwert: ${threshold}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin:26px 0 0; font-size:14px; line-height:1.7; color:#777;">
                Dieses Produkt ist fast ausverkauft. Bitte prüfe, ob Bestand nachgefüllt werden soll.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.LOW_STOCK_ALERT_EMAIL,
      subject: `Low stock warning — ${product.name}`,
      html,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    await supabaseAdmin
      .from("products")
      .update({ low_stock_email_sent: true })
      .eq("id", product.id);

    return NextResponse.json({ success: true, sent: true });
  } catch (error) {
    console.error("Low stock warning error:", error);
    return NextResponse.json({ error: "Failed to send low stock warning." }, { status: 500 });
  }
}