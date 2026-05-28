import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, status, stripe_payment_intent_id")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status === "refunded") {
      return NextResponse.json({ error: "Order already refunded." }, { status: 400 });
    }

    if (!order.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: "No Stripe PaymentIntent found for this order." },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      reason: "requested_by_customer",
      metadata: {
        order_id: order.id,
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        stripe_refund_id: refund.id,
      })
      .eq("id", order.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Refund order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refund order." },
      { status: 500 }
    );
  }
}