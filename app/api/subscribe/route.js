import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const { email, source = "website" } = await request.json();

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabaseAdmin
        .from("profiles")
        .update({ marketing_emails: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    const { error: subscriberError } = await supabaseAdmin
      .from("subscribers")
      .upsert(
        {
          email: normalizedEmail,
          status: "confirmed",
          source,
          user_id: user?.id ?? null,
          confirmed_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (subscriberError) throw subscriberError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error.message);

    return NextResponse.json(
      { error: "Failed to subscribe." },
      { status: 500 }
    );
  }
}