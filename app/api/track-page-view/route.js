import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      path,
      pageType,
      visitorId,
      sessionId,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    } = body;

    if (!path || !pageType) {
      return NextResponse.json(
        { error: "Missing tracking data." },
        { status: 400 },
      );
    }

    const userAgent = request.headers.get("user-agent") || null;

    const THIRTY_MINUTES_AGO = new Date(Date.now() - 1000 * 60 * 30).toISOString();

const { data: recentView, error: recentViewError } = await supabaseAdmin
  .from("page_views")
  .select("id")
  .eq("visitor_id", visitorId)
  .eq("page_type", pageType)
  .gte("created_at", THIRTY_MINUTES_AGO)
  .maybeSingle();

    if (recentViewError) throw recentViewError;

    if (recentView) {
    return NextResponse.json({ success: true, skipped: true });
    }

    const { error } = await supabaseAdmin.from("page_views").insert({
      path,
      page_type: pageType,
      visitor_id: visitorId || null,
      session_id: sessionId || null,
      referrer: referrer || null,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      user_agent: userAgent,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track page view error:", error.message);

    return NextResponse.json(
      { error: "Failed to track page view." },
      { status: 500 },
    );
  }
}