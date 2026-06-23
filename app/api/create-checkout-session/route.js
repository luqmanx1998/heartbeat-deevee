import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { randomUUID } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SHIPPING_COST = 3.99;

export async function POST(request) {
  try {
    const { cart, shipping, guestEmail, signatureRequest } =
      await request.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customerEmail = user?.email || guestEmail;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const cartProductIds = cart.map((item) => item.id);

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock, active, image")
      .in("id", cartProductIds);

    if (productsError) throw new Error(productsError.message);

    const productMap = new Map(products.map((p) => [p.id, p]));

    const validatedItems = [];

    for (const item of cart) {
      const product = productMap.get(item.id);

      if (!product) {
        return NextResponse.json(
          { error: "Produkt wurde nicht gefunden." },
          { status: 400 },
        );
      }

      if (!product.active) {
        return NextResponse.json(
          { error: "Dieses Produkt ist aktuell nicht verfügbar." },
          { status: 400 },
        );
      }

      const quantity = Math.max(1, Number(item.quantity || 1));

      if (Number(product.stock ?? 0) < quantity) {
        return NextResponse.json(
          {
            code: "OUT_OF_STOCK",
            error:
              "Dieser Artikel ist leider nicht mehr in ausreichender Menge verfügbar.",
          },
          { status: 409 },
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        quantity,
        image: product.image,
        unitPrice,
        subtotal,
      });
    }

    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const total = subtotal + SHIPPING_COST;
    const orderAccessToken = randomUUID();

    const formattedShippingAddress = shipping
      ? [
          shipping.fullName,
          shipping.line1,
          shipping.line2,
          `${shipping.postalCode || ""} ${shipping.city || ""}`.trim(),
          "DE",
        ]
          .filter(Boolean)
          .join("\n")
      : null;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_email: customerEmail,
        signature_request: String(signatureRequest || "").trim() || null,
        status: "pending",
        total,
        shipping_address: formattedShippingAddress,
        order_access_token: orderAccessToken,
        order_access_token_expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
      })
      .select("id")
      .single();

    if (orderError) throw new Error(orderError.message);

    await supabaseAdmin.from("order_items").insert(
      validatedItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      })),
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      payment_method_types: ["card", "paypal"],
      success_url: `${siteUrl}/store/success`,
      cancel_url: `${siteUrl}/store/cart`,

      line_items: [
        ...validatedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: {
              name: item.name,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(SHIPPING_COST * 100),
            product_data: {
              name: "Versand",
            },
          },
        },
      ],

      metadata: {
        source: "stripe_checkout",
        order_id: order.id,
        user_id: user?.id ?? "guest",
      },

      payment_intent_data: {
        receipt_email: customerEmail,
        metadata: {
          source: "stripe_checkout",
          order_id: order.id,
          user_id: user?.id ?? "guest",
        },
        shipping: shipping
          ? {
              name: shipping.fullName,
              address: {
                line1: shipping.line1,
                line2: shipping.line2 || undefined,
                postal_code: shipping.postalCode,
                city: shipping.city,
                country: "DE",
              },
            }
          : undefined,
      },
    });

    await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout Session error:", error.message);

    return NextResponse.json(
      { error: error.message || "Checkout konnte nicht vorbereitet werden." },
      { status: 500 },
    );
  }
}