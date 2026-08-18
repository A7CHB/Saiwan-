import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { INQUIRY_SOURCES, VISITOR_COOKIE } from "@/lib/constants";
import { locales } from "@/lib/i18n/config";
import { inquiryReference, isValidPhone, normalisePhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  // Generated client-side so the WhatsApp message and the stored record share
  // one reference. Re-validated here, and replaced if it collides.
  reference: z
    .string()
    .regex(/^SW-[A-Z2-9]{6}$/)
    .optional(),
  productId: z.string().max(40).nullish(),
  customerName: z.string().max(80).nullish(),
  customerPhone: z.string().max(30).nullish(),
  customerEmail: z.string().email().max(160).nullish().or(z.literal("")),
  locale: z.enum(locales).default("en"),
  source: z.enum(INQUIRY_SOURCES).default("PRODUCT"),
  message: z.string().max(2000).nullish(),
  configuration: z.record(z.string(), z.unknown()).default({}),
});

/**
 * Records an inquiry.
 *
 * Two callers with different needs: the product configurator fires this via
 * `sendBeacon` on its way to WhatsApp (no phone number yet — WhatsApp supplies
 * it), and the contact form posts it directly and needs the reference back.
 * Both land in the same pipeline so the admin sees one list.
 */
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 400 });
  }

  const input = parsed.data;

  // Phone is required from the contact form, optional from WhatsApp flows where
  // the customer's number arrives with the message itself.
  const phone = input.customerPhone ? normalisePhone(input.customerPhone) : "";
  if (input.source === "CONTACT" && !isValidPhone(phone)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  try {
    let validProductId: string | null = null;
    if (input.productId) {
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
        select: { id: true },
      });
      validProductId = product?.id ?? null;
    }

    const reference = input.reference ?? inquiryReference();
    const existing = await prisma.inquiry.findUnique({ where: { reference }, select: { id: true } });

    const inquiry = await prisma.inquiry.create({
      data: {
        reference: existing ? inquiryReference() : reference,
        productId: validProductId,
        customerName: (input.customerName || "—").slice(0, 80),
        customerPhone: phone,
        customerEmail: input.customerEmail || null,
        locale: input.locale,
        source: input.source,
        message: input.message || null,
        configuration: JSON.stringify(input.configuration).slice(0, 4000),
        events: { create: { status: "NEW", note: "Created from the website" } },
      },
      select: { id: true, reference: true },
    });

    await prisma.analyticsEvent.create({
      data: {
        type: "inquiry",
        productId: validProductId,
        locale: input.locale,
        visitorId: request.cookies.get(VISITOR_COOKIE)?.value ?? null,
        meta: JSON.stringify({ source: input.source, reference: inquiry.reference }),
      },
    });

    return NextResponse.json({ ok: true, reference: inquiry.reference }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
