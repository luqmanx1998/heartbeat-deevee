import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request) {
  try {
    const { order, items } = await request.json();

    if (!order || !items) {
      return NextResponse.json(
        { error: "Missing order data." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const logoUrl = `${siteUrl}/DeeveeLogo5.png`;

    const itemsHtml = items
  .map((item) => {
    const imageUrl = item.product_image
      ? `${siteUrl}${item.product_image.startsWith("/") ? "" : "/"}${item.product_image}`
      : `${siteUrl}/book3.jpeg`;

    return `
      <div
        style="
          padding:16px;
          border-radius:18px;
          background:#111111;
          margin-bottom:14px;
        "
      >
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width:74px; vertical-align:top;">
              <img
                src="${imageUrl}"
                alt="${escapeHtml(item.product_name)}"
                style="width:58px; height:76px; object-fit:cover; border-radius:10px; display:block;"
              />
            </td>

            <td style="vertical-align:top; padding-left:14px;">
              <p style="margin:0; font-size:17px; color:#ffffff; font-weight:600; line-height:1.35;">
                ${escapeHtml(item.product_name)}
              </p>

              <p style="margin:8px 0 0; font-size:14px; color:#b9b9b9;">
                Menge: ${item.quantity}
              </p>

              <p style="margin:6px 0 0; font-size:14px; color:#b9b9b9;">
                Preis: €${Number(item.unit_price ?? 0).toFixed(2)}
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;
  })
  .join("");

    const html = `
      <div style="margin:0; padding:0; background:#0b0b0d; font-family:Arial, Helvetica, sans-serif;">
        <div style="max-width:640px; margin:0 auto; padding:32px 16px;">

          <div style="overflow:hidden; border-radius:28px; background:#ffffff; box-shadow:0 24px 70px rgba(20,12,6,0.12);">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;">
              <tr>
                <td align="center" bgcolor="#090909" style="background-color:#090909;">
                  <img
                    src="${logoUrl}"
                    alt="Deevee"
                    width="1200"
                    style="width:1200px; max-width:100%; height:auto; display:block; border:0;"
                  />
                </td>
              </tr>
            </table>

            <div style="padding:34px 30px 30px;">

              <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#b8924f;">
                Shipping Update
              </p>

              <h1 style="margin:0; font-size:34px; line-height:1.1; color:#151515; letter-spacing:-0.04em;">
                Deine Bestellung wurde versandt ✦
              </h1>

              <p style="margin:20px 0 0; font-size:16px; line-height:1.3; color:#4a4a4a;">
                Hallo,
                <br/><br/>
                deine Bestellung ist jetzt unterwegs.
                Vielen Dank für deine Unterstützung von Deevee.
              </p>

              <div
                style="
                  margin-top:28px;
                  padding:24px;
                  border-radius:22px;
                  background:#111111;
                  color:#ffffff;
                "
              >
                <p style="margin:0; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#b8924f;">
                  Order ID
                </p>

                <p style="margin:10px 0 0; font-size:18px; line-height:1.5; color:#f4efe8; word-break:break-all;">
                  ${escapeHtml(order.id)}
                </p>

                <p style="margin:24px 0 10px; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#b8924f;">
                  Shipping Address
                </p>

                <p style="margin:0; font-size:15px; line-height:1.3; color:#f4efe8; white-space:pre-line;">
                  ${escapeHtml(order.shipping_address || "No address")}
                </p>
              </div>

              <div style="margin-top:28px;">
                <p style="margin:0 0 18px; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#b8924f;">
                  Items
                </p>

                ${itemsHtml}
              </div>

              <div
                style="
                  margin-top:30px;
                  padding-top:24px;
                  border-top:1px solid rgba(0,0,0,0.08);
                "
              >
                <p style="margin:0; font-size:14px; color:#777777; line-height:1.7;">
                  Falls du Fragen zu deiner Bestellung hast, antworte einfach auf diese E-Mail.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: order.customer_email,
      subject: "Deine Bestellung wurde versandt ✦",
      html,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Shipping email error:", error);

    return NextResponse.json(
      { error: "Failed to send shipping email." },
      { status: 500 }
    );
  }
}