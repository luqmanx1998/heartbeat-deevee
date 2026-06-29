"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getOrCreateId(key) {
  let value = localStorage.getItem(key);

  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }

  return value;
}

export default function PageViewTracker({ pageType }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const visitorId = getOrCreateId("deevee_visitor_id");
    const sessionId = getOrCreateId("deevee_session_id");

    fetch("/api/track-page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname,
        pageType,
        visitorId,
        sessionId,
        referrer: document.referrer || null,
        utmSource: searchParams.get("utm_source"),
        utmMedium: searchParams.get("utm_medium"),
        utmCampaign: searchParams.get("utm_campaign"),
        utmContent: searchParams.get("utm_content"),
        utmTerm: searchParams.get("utm_term"),
      }),
    }).catch((error) => {
      console.error("Page view tracking failed:", error);
    });
  }, [pathname, searchParams, pageType]);

  return null;
}