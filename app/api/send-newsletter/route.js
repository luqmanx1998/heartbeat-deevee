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
    const { subject, message } = await request.json();

    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanSubject || !cleanMessage) {
      return NextResponse.json(
        { error: "Subject and message are required." },
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

    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from("subscribers")
      .select("email")
      .eq("status", "confirmed");

    if (subscribersError) throw subscribersError;

    const emails = [...new Set((subscribers ?? []).map((s) => s.email).filter(Boolean))];

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
      });
    }

    const safeMessage = escapeHtml(cleanMessage).replaceAll("\n", "<br/>");

   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""); 
   const logoUrl = `${siteUrl}/deeveeemaildark.png`; 
   
   const html = `
  <div style="margin:0; padding:0; background:#0b0b0d; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:640px; margin:0 auto; padding:32px 16px;">
      <div style="overflow:hidden; border-radius:28px; background:#ffffff; box-shadow:0 24px 70px rgba(20,12,6,0.12);">
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;">
  <tr>
    <td align="center" bgcolor="#090909" style="background-color:#090909; padding:34px 24px;">
      <img
        src="${logoUrl}"
        alt="Deevee"
        width="190"
        style="width:190px; max-width:80%; height:auto; display:block; border:0; outline:none; text-decoration:none;"
      />
    </td>
  </tr>
</table>

        <div style="padding:34px 30px 30px;">
          <p style="margin:0 0 10px; font-size:11px; letter-spacing:0.28em; text-transform:uppercase; color:#b8924f;">
            Deevee Newsletter
          </p>

          <h1 style="margin:0; font-size:30px; line-height:1.1; color:#151515; letter-spacing:-0.04em;">
            ${escapeHtml(cleanSubject)}
          </h1>

          <div
            style="
              margin-top:24px;
              padding:24px;
              border-radius:22px;
              background:#111111;
              color:#ffffff;
            "
          >
            <div
              style="
                font-size:15px;
                line-height:1.4;
                color:#f4efe8;
                white-space:pre-line;
              "
            >
              ${safeMessage}
            </div>
          </div>

          <p style="margin:26px 0 0; font-size:13px; line-height:1.7; color:#777;">
            Du erhältst diese E-Mail, weil du Deevee Updates abonniert hast.
          </p>
        </div>
      </div>
    </div>
  </div>
`;


    const results = await Promise.all(
  emails.map(async (email) => {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: cleanSubject,
      html,
    });

    console.log("Resend result for", email, result);

    return result;
  })
);

      const sentCount = results.filter((result) => result.data?.id).length;
const failedCount = results.filter((result) => result.error).length;

if (sentCount === 0 && failedCount > 0) {
  return NextResponse.json(
    { error: results[0]?.error?.message || "No emails were sent." },
    { status: 400 }
  );
}
    return NextResponse.json({
        success: true,
        sentCount,
        failedCount,
        results,
        });
  } catch (error) {
    console.error("Send newsletter error:", error.message);

    return NextResponse.json(
      { error: "Failed to send newsletter." },
      { status: 500 }
    );
  }
}