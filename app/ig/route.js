// app/ig/route.js
import { redirect } from "next/navigation";

export function GET() {
  redirect(
    "/?utm_source=instagram&utm_medium=bio&utm_campaign=heartbeat_launch",
  );
}