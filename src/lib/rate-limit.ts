import "server-only";

/**
 * Fixed-window rate limiter, in process memory.
 *
 * Deliberately simple: it protects sign-in and inquiry submission from casual
 * brute force on a single-instance deployment. Behind more than one instance
 * this needs to move to Redis or the platform's own limiter — the interface is
 * kept narrow so that swap is a one-file change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterMs: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    // Cheap eviction — the map only grows under attack, and this bounds it.
    if (buckets.size > MAX_KEYS) {
      for (const [existingKey, existing] of buckets) {
        if (existing.resetAt <= now) buckets.delete(existingKey);
      }
      if (buckets.size > MAX_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: windowMs };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return { ok: bucket.count <= limit, remaining, retryAfterMs: bucket.resetAt - now };
}

/** Clears a bucket after a successful attempt so honest users are never held. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Best-effort client address from the usual proxy headers. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
