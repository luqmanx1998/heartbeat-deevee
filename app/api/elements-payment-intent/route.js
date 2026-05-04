import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { cart, shipping } = await request.json();

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
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    // 🔍 Get products from DB
    const cartProductIds = cart.map((item) => item.id);

    const { data: products, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select("id, name, price, stock, active, image")
        .in("id", cartProductIds);

    if (productsError) throw new Error(productsError.message);

    const productMap = new Map(
      products.map((p) => [p.id, p])
    );

    const validatedItems = cart.map((item) => {
      const product = productMap.get(item.id);

      if (!product) throw new Error("Invalid product.");
      if (!product.active) throw new Error("Product unavailable.");

      const quantity = Math.max(1, Number(item.quantity || 1));

      if (product.stock < quantity) {
        throw new Error("Not enough stock.");
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      return {
        product_id: product.id,
        name: product.name,
        quantity,
        image:product.image,
        unitPrice,
        subtotal,
      };
    });

    const total = validatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const amount = Math.round(total * 100); // cents

    // 🧾 Create order (same pattern as before)
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert({
          user_id: user.id,
          customer_email: user.email,
          status: "pending",
          total,
        })
        .select("id")
        .single();

    if (orderError) throw new Error(orderError.message);

    // 🧾 Order items
    await supabaseAdmin.from("order_items").insert(
      validatedItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }))
    );

    // 💳 Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
         amount,
        currency: "eur",
        receipt_email: user.email,
        payment_method_types: ["card", "paypal"],

        description: validatedItems
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", "),

        metadata: {
            source: "custom_checkout",
            order_id: order.id,
            user_id: user.id,
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
        });

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

        const { error: paymentIntentUpdateError } = await supabaseAdmin
        .from("orders")
        .update({
            stripe_payment_intent_id: paymentIntent.id,
            shipping_address: formattedShippingAddress,
        })
        .eq("id", order.id);

        if (paymentIntentUpdateError) {
        throw new Error(paymentIntentUpdateError.message);
        }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("PaymentIntent error:", error.message);

    return NextResponse.json(
      { error: error.message || "Failed." },
      { status: 500 }
    );
  }
}