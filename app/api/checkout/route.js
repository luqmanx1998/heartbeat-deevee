import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const allowedProducts = {
  heartbeat_buchbox: {
    product_id: "60961c91-f0b1-47db-8111-3fa69ac48dff",
    name: "Heartbeat I Buchbox",
    image: "/buchbox2.jpg",
    price: 2999,
    type: "Bundle",
  },
  heartbeat_book_1: {
    product_id: "d346dcfc-c7d9-47da-b2a9-e2e09aa37914",
    name: "Heartbeat – Die andere Seite",
    image: "/book3.jpeg",
    price: 1699,
    type: "book",
  },
};

export async function POST(request) {
  try {
    const { cart } = await request.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to checkout." },
        { status: 401 }
      );
    }

    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

    const validatedItems = cart.map((item) => {
      const product = allowedProducts[item.id];

      if (!product) {
        throw new Error(`Invalid product: ${item.id}`);
      }

      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitAmount = product.price;
      const subtotal = (unitAmount / 100) * quantity;

      return {
        ...product,
        quantity,
        unitAmount,
        subtotal,
      };
    });

    const total = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        customer_email: user.email,
        status: "pending",
        total,
        shipping_address: null,
      })
      .select("id")
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    const orderItemsPayload = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      unit_price: item.unitAmount / 100,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    const lineItems = validatedItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [`${origin}${item.image}`],
        },
        unit_amount: item.unitAmount,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/cart`,
      shipping_address_collection: {
        allowed_countries: ["DE"],
      },
      billing_address_collection: "auto",
      customer_email: user.email,
      metadata: {
        source: "heartbeat_store",
        order_id: order.id,
        user_id: user.id,
      },
    });

    const { error: sessionUpdateError } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    if (sessionUpdateError) {
      throw new Error(sessionUpdateError.message);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error.message);

    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}