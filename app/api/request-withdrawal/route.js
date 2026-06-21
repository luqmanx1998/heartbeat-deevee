import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function POST(request) {
  try {
    const { orderId, note } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Bestellnummer fehlt." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
    }

    const status = String(order.status || "").toLowerCase();

    if (!["shipped", "delivered"].includes(status)) {
      return NextResponse.json(
        { error: "Für diese Bestellung kann kein Widerruf angefordert werden." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        withdrawal_requested_at: new Date().toISOString(),
        withdrawal_status: "requested",
        withdrawal_notes: String(note || "").trim() || null,
      })
      .eq("id", order.id);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdrawal request error:", error.message);
    return NextResponse.json(
      { error: error.message || "Widerruf konnte nicht angefordert werden." },
      { status: 500 }
    );
  }
}