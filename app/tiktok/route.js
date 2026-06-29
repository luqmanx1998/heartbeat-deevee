// app/tiktok/route.js
import { redirect } from "next/navigation";

export function GET() {
  redirect(
    "/?utm_source=tiktok&utm_medium=bio&utm_campaign=heartbeat_launch",
  );
}