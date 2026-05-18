import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function POST(request) {
  try {
    const { marketingEmails } = await request.json();

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

    const enabled = Boolean(marketingEmails);
    const now = new Date().toISOString();

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        marketing_emails: enabled,
        updated_at: now,
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    if (enabled) {
      const { error: subscriberError } = await supabaseAdmin
        .from("subscribers")
        .upsert(
          {
            email: user.email.toLowerCase(),
            user_id: user.id,
            status: "confirmed",
            source: "profile",
            confirmed_at: now,
            unsubscribed_at: null,
          },
          { onConflict: "email" }
        );

      if (subscriberError) throw subscriberError;
    } else {
      const { error: unsubscribeError } = await supabaseAdmin
        .from("subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: now,
        })
        .eq("email", user.email.toLowerCase());

      if (unsubscribeError) throw unsubscribeError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Marketing preference error:", error.message);

    return NextResponse.json(
      { error: "Failed to update marketing preference." },
      { status: 500 }
    );
  }
}