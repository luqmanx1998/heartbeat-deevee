import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/app/lib/email/sendOrderEmail";

export async function GET() {
  await sendOrderEmail({
    to: "your@email.com",
    orderId: "TEST-ORDER-123456",
    total: 21.98,
    shippingAddress: `Luqman Hakim
123 Test Street
12345 Berlin
Deutschland`,
    orderAccessToken: "test-token",
    items: [
      {
        product_name: "Heartbeat : Die andere Seite",
        product_image: "/book.jpg",
        quantity: 1,
        subtotal: 17.99,
      },
    ],
  });

  return NextResponse.json({ success: true });
}