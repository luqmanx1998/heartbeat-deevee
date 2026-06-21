import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { orderId } = await request.json();

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

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Diese Bestellung kann nicht automatisch storniert werden." },
        { status: 400 }
      );
    }

    if (!order.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: "Keine Stripe-Zahlung gefunden." },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      reason: "requested_by_customer",
      metadata: {
        order_id: order.id,
        user_id: user.id,
        source: "customer_cancel_button",
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

    return NextResponse.json({ success: true, refund });
  } catch (error) {
    console.error("Customer cancel order error:", error.message);
    return NextResponse.json(
      { error: error.message || "Stornierung fehlgeschlagen." },
      { status: 500 }
    );
  }
}