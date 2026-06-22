import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { orderId, token, action, note } = await request.json();

    if (!orderId || !token || !action) {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("order_access_token", token)
      .maybeSingle();

    if (orderError) throw new Error(orderError.message);
    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden." },
        { status: 404 },
      );
    }

    if (
      order.order_access_token_expires_at &&
      new Date(order.order_access_token_expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: "Dieser Bestelllink ist abgelaufen." },
        { status: 403 },
      );
    }

    const status = String(order.status || "").toLowerCase();

    if (action === "cancel") {
      if (status !== "paid") {
        return NextResponse.json(
          { error: "Diese Bestellung kann nicht automatisch storniert werden." },
          { status: 400 },
        );
      }

      if (!order.stripe_payment_intent_id) {
        return NextResponse.json(
          { error: "Keine Stripe-Zahlung gefunden." },
          { status: 400 },
        );
      }

      const refund = await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent_id,
        reason: "requested_by_customer",
        metadata: {
          order_id: order.id,
          source: "guest_cancel_button",
        },
      });

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "cancelled",
          refunded_at: new Date().toISOString(),
          stripe_refund_id: refund.id,
        })
        .eq("id", order.id);

      if (updateError) throw new Error(updateError.message);

      return NextResponse.json({
        success: true,
        status: "cancelled",
        message: "Die Bestellung wurde storniert und zurückerstattet.",
      });
    }

    if (action === "withdrawal") {
      if (!["shipped", "delivered"].includes(status)) {
        return NextResponse.json(
          { error: "Für diese Bestellung kann kein Widerruf angefordert werden." },
          { status: 400 },
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

      return NextResponse.json({
        success: true,
        status,
        message: "Dein Widerruf wurde übermittelt.",
      });
    }

    return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Aktion fehlgeschlagen." },
      { status: 500 },
    );
  }
}