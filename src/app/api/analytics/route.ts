import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ANALYTICS_EVENTS, LOCALE_COOKIE, VISITOR_COOKIE } from "@/lib/constants";
import { resolveLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const schema = z.object({
  type: z.enum(ANALYTICS_EVENTS),
  productId: z.string().max(40).optional(),
  path: z.string().max(400).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

/**
 * First-party analytics sink.
 *
 * Stores no personal data: the only identifier is the httpOnly `visitorId`
 * cookie set by middleware, which exists purely to de-duplicate views. Always
 * answers 204 — a client should never retry, and an analytics failure must be
 * invisible to the customer.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return new NextResponse(null, { status: 204 });

    const { type, productId, path, meta } = parsed.data;
    const locale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
    const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? null;

    // Guard against a forged product id breaking the foreign key.
    let validProductId: string | null = null;
    if (productId) {
      const exists = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
      validProductId = exists?.id ?? null;
    }

    await prisma.$transaction([
      prisma.analyticsEvent.create({
        data: {
          type,
          productId: validProductId,
          path: path ?? null,
          locale,
          visitorId,
          meta: meta ? JSON.stringify(meta).slice(0, 1000) : null,
        },
      }),
      // Denormalised counter on the product so admin lists can sort without a
      // group-by across the whole event table.
      ...(type === "whatsapp_click" && validProductId
        ? [prisma.product.update({ where: { id: validProductId }, data: { whatsappCount: { increment: 1 } } })]
        : []),
    ]);
  } catch {
    /* swallowed by design */
  }

  return new NextResponse(null, { status: 204 });
}
