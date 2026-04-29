import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature failed:", error.message);

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillCheckout(event.data.object.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook fulfillment failed:", error.message);

    return NextResponse.json(
      { error: "Webhook fulfillment failed" },
      { status: 500 }
    );
  }
}


async function fulfillCheckout(sessionId) {
  console.log("Fulfilling checkout:", sessionId);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    console.log("Payment not paid yet:", session.payment_status);
    return;
  }

  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new Error("Missing order_id in Stripe session metadata.");
  }

  const shipping = session.shipping_details;
const customer = session.customer_details;

const address = shipping?.address || customer?.address;
const name = shipping?.name || customer?.name;

const formattedShippingAddress = address
  ? [
      name,
      address.line1,
      address.line2,
      `${address.postal_code || ""} ${address.city || ""}`.trim(),
      address.state,
      address.country,
    ]
      .filter(Boolean)
      .join("\n")
  : null;

  const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
    .from("orders")
    .select("id, fulfilled_at")
    .eq("id", orderId)
    .maybeSingle();

  if (existingOrderError) {
    throw new Error(existingOrderError.message);
  }

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  if (existingOrder.fulfilled_at) {
    console.log("Order already fulfilled:", orderId);
    return;
  }

  const { data: order, error: updateOrderError } = await supabaseAdmin
    .from("orders")
    .update({
  status: "paid",
  stripe_session_id: session.id,
  stripe_payment_intent_id:
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null,
  shipping_address: formattedShippingAddress,
  fulfilled_at: new Date().toISOString(),
})
    .eq("id", orderId)
    .select("id")
    .single();

  if (updateOrderError) {
    throw new Error(updateOrderError.message);
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", order.id);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  for (const item of items ?? []) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (productError) {
      throw new Error(productError.message);
    }

    const nextStock = Math.max(
      0,
      Number(product.stock ?? 0) - Number(item.quantity ?? 0)
    );

    const { error: stockError } = await supabaseAdmin
      .from("products")
      .update({ stock: nextStock })
      .eq("id", item.product_id);

    if (stockError) {
      throw new Error(stockError.message);
    }
  }

  console.log("Order fulfilled:", orderId);
}

