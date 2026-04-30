import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { cart } = await request.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
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
        { error: "You must be logged in to checkout." },
        { status: 401 }
      );
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const imageBaseUrl = publicSiteUrl || origin;

    const cartProductIds = cart.map((item) => item.id);

    const { data: products, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select("id, name, slug, type, price, stock, image, active")
        .in("id", cartProductIds);

    if (productsError) {
      throw new Error(productsError.message);
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    const validatedItems = cart.map((item) => {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error(`Invalid product: ${item.id}`);
      }

      if (!product.active) {
        throw new Error(`${product.name} is not available.`);
      }

      const quantity = Math.max(
        1,
        Number(item.quantity || 1)
      );

      if (Number(product.stock ?? 0) < quantity) {
        throw new Error(
          `${product.name} does not have enough stock.`
        );
      }

      const unitPrice = Number(product.price);
      const unitAmount = Math.round(unitPrice * 100);
      const subtotal = unitPrice * quantity;

      return {
        product_id: product.id,
        name: product.name,
        image: product.image,
        type: product.type,
        quantity,
        unitPrice,
        unitAmount,
        subtotal,
      };
    });

    const total = validatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const { data: order, error: orderError } =
      await supabaseAdmin
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

    const orderItemsPayload = validatedItems.map(
      (item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      })
    );

    const { error: itemsError } =
      await supabaseAdmin
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
      description:
        item.type === "Bundle"
          ? "Limitierte Buchbox aus dem offiziellen Deevee Store."
          : "Paperback aus dem offiziellen Deevee Store.",
      images: item.image
        ? [new URL(item.image, imageBaseUrl).toString()]
        : [],
    },
    unit_amount: item.unitAmount,
  },
  quantity: item.quantity,
}));

    const session =
      await stripe.checkout.sessions.create({
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

    const { error: sessionUpdateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          stripe_session_id: session.id,
        })
        .eq("id", order.id);

    if (sessionUpdateError) {
      throw new Error(sessionUpdateError.message);
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Checkout error:",
      error.message
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to create checkout session.",
      },
      { status: 500 }
    );
  }
}