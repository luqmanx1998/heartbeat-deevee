import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const token = searchParams.get("token");

    if (!orderId || !token) {
      return NextResponse.json({ error: "Ungültiger Link." }, { status: 400 });
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

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });

    if (itemsError) throw new Error(itemsError.message);

    return NextResponse.json({
      order,
      items: items ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Bestellung konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}