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

function saveUtmIfPresent(key, value) {
  if (value) {
    sessionStorage.setItem(key, value);
  }
}

export default function PageViewTracker({ pageType }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const visitorId = getOrCreateId("deevee_visitor_id");
    const sessionId = getOrCreateId("deevee_session_id");

    const currentUtmSource = searchParams.get("utm_source");
    const currentUtmMedium = searchParams.get("utm_medium");
    const currentUtmCampaign = searchParams.get("utm_campaign");
    const currentUtmContent = searchParams.get("utm_content");
    const currentUtmTerm = searchParams.get("utm_term");

    saveUtmIfPresent("deevee_utm_source", currentUtmSource);
    saveUtmIfPresent("deevee_utm_medium", currentUtmMedium);
    saveUtmIfPresent("deevee_utm_campaign", currentUtmCampaign);
    saveUtmIfPresent("deevee_utm_content", currentUtmContent);
    saveUtmIfPresent("deevee_utm_term", currentUtmTerm);

    const utmSource =
      currentUtmSource || sessionStorage.getItem("deevee_utm_source");

    const utmMedium =
      currentUtmMedium || sessionStorage.getItem("deevee_utm_medium");

    const utmCampaign =
      currentUtmCampaign || sessionStorage.getItem("deevee_utm_campaign");

    const utmContent =
      currentUtmContent || sessionStorage.getItem("deevee_utm_content");

    const utmTerm =
      currentUtmTerm || sessionStorage.getItem("deevee_utm_term");

    const hasUtmInUrl =
      currentUtmSource ||
      currentUtmMedium ||
      currentUtmCampaign ||
      currentUtmContent ||
      currentUtmTerm;

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
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
      }),
    })
      .then(() => {
        if (hasUtmInUrl) {
          window.history.replaceState({}, "", window.location.pathname);
        }
      })
      .catch((error) => {
        console.error("Page view tracking failed:", error);
      });
  }, [pathname, searchParams, pageType]);

  return null;
}