"use client";

import type { AnalyticsEventType } from "@/lib/constants";

/**
 * Fire-and-forget client analytics.
 *
 * `sendBeacon` is used first because a WhatsApp click immediately navigates the
 * tab away — a normal fetch would be cancelled and the most valuable event on
 * the site would be lost. `fetch(keepalive)` is the fallback.
 */
export function track(
  type: AnalyticsEventType,
  payload: { productId?: string; path?: string; meta?: Record<string, unknown> } = {},
) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    type,
    productId: payload.productId,
    path: payload.path ?? window.location.pathname,
    meta: payload.meta,
  });

  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never surface an error to the customer */
  }
}
