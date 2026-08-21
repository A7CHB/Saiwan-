"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics-client";

/**
 * Counts a product view from the browser instead of during the render.
 *
 * It used to be counted on the server, which meant reading the visitor cookie,
 * and reading a cookie opts a route out of static rendering entirely. That one
 * analytics call was quietly making every product page — the pages that sell —
 * render on demand: a serverless function and a round trip to the database on
 * every single tap, instead of a file already sitting on the CDN.
 *
 * Moving it here costs nothing that matters. The view is still attributed to
 * the same httpOnly visitor cookie, because the browser sends that cookie with
 * the beacon and the API reads it server-side; the only view now missed is one
 * from a visitor with JavaScript disabled, which is a rounding error against
 * making the page instant for everyone else.
 */
export function ProductViewTracker({ productId }: { productId: string }) {
  const counted = useRef<string | null>(null);

  useEffect(() => {
    // Strict mode mounts effects twice in development, and a client-side
    // navigation back to the same product should not count twice either.
    if (counted.current === productId) return;
    counted.current = productId;
    track("product_view", { productId });
  }, [productId]);

  return null;
}
