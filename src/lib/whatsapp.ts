import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { normalisePhone } from "@/lib/utils";

/**
 * Everything WhatsApp-related lives here so every CTA on the site produces one
 * consistently formatted message. The customer should never have to retype what
 * they already told the interface.
 */

export type WhatsAppLine = { label: string; value: string };

export type WhatsAppPayload = {
  /** Opening line under the greeting. */
  intro: string;
  lines: WhatsAppLine[];
  /** Free-text note the customer typed. */
  note?: string;
  /** Canonical URL of the piece being discussed. */
  link?: string;
  reference?: string;
};

export function getWhatsAppNumber(): string {
  return normalisePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
}

export function hasWhatsApp(): boolean {
  return getWhatsAppNumber().length >= 8;
}

/**
 * Compose the message body. Uses WhatsApp's `*bold*` markup for labels so the
 * message reads as a structured brief in the business inbox, not a wall of text.
 */
export function composeMessage(d: Dictionary, payload: WhatsAppPayload): string {
  const parts: string[] = [d.whatsapp.messageIntro, "", payload.intro];

  const lines = payload.lines.filter((line) => line.value.trim().length > 0);
  if (lines.length) {
    parts.push("");
    for (const line of lines) parts.push(`• *${line.label}:* ${line.value}`);
  }

  if (payload.note?.trim()) {
    parts.push("", `*${d.whatsapp.messageFields.notes}:* ${payload.note.trim()}`);
  }
  if (payload.reference) {
    parts.push("", `*${d.whatsapp.messageFields.reference}:* ${payload.reference}`);
  }
  if (payload.link) {
    parts.push("", `${d.whatsapp.messageFields.link}: ${payload.link}`);
  }

  return parts.join("\n");
}

/**
 * Build the deep link. `wa.me` is used rather than `api.whatsapp.com` because it
 * resolves to the native app on mobile and to WhatsApp Web on desktop without
 * an interstitial.
 */
export function buildWhatsAppUrl(message: string, number = getWhatsAppNumber()): string {
  const encoded = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

export function whatsAppLink(d: Dictionary, payload: WhatsAppPayload): string {
  return buildWhatsAppUrl(composeMessage(d, payload));
}

// ---------------------------------------------------------------------------
// Payload builders — one per conversion surface.
// ---------------------------------------------------------------------------

export type ProductInquiryInput = {
  productName: string;
  categoryName?: string;
  sizeLabel?: string;
  colorName?: string;
  quantity?: number;
  accessories?: string[];
  customerName?: string;
  note?: string;
  url?: string;
  reference?: string;
};

export function productInquiryPayload(d: Dictionary, input: ProductInquiryInput): WhatsAppPayload {
  const f = d.whatsapp.messageFields;
  return {
    intro: d.whatsapp.messageProduct,
    lines: [
      { label: f.product, value: input.productName },
      { label: f.category, value: input.categoryName ?? "" },
      { label: f.size, value: input.sizeLabel ?? "" },
      { label: f.color, value: input.colorName ?? "" },
      { label: f.quantity, value: input.quantity && input.quantity > 1 ? String(input.quantity) : "" },
      { label: f.accessories, value: input.accessories?.join(", ") ?? "" },
      { label: f.name, value: input.customerName ?? "" },
    ],
    note: input.note,
    link: input.url,
    reference: input.reference,
  };
}

export type QuizInquiryInput = {
  placement?: string;
  area?: string;
  segment?: string;
  style?: string;
  color?: string;
  tier?: string;
  recommended?: string[];
  customerName?: string;
  note?: string;
  url?: string;
};

export function quizInquiryPayload(d: Dictionary, input: QuizInquiryInput): WhatsAppPayload {
  const f = d.whatsapp.messageFields;
  return {
    intro: d.whatsapp.messageQuiz,
    lines: [
      { label: f.placement, value: input.placement ?? "" },
      { label: f.area, value: input.area ?? "" },
      { label: f.segment, value: input.segment ?? "" },
      { label: f.style, value: input.style ?? "" },
      { label: f.color, value: input.color ?? "" },
      { label: f.budget, value: input.tier ?? "" },
      { label: f.product, value: input.recommended?.join(", ") ?? "" },
      { label: f.name, value: input.customerName ?? "" },
    ],
    note: input.note,
    link: input.url,
  };
}

/** The saved page: a shortlist of pieces sent as one message. */
export function shortlistPayload(
  d: Dictionary,
  input: { productNames: string[]; customerName?: string; note?: string; url?: string },
): WhatsAppPayload {
  const f = d.whatsapp.messageFields;
  return {
    intro: d.whatsapp.messageShortlist,
    lines: [
      { label: f.product, value: input.productNames.join(" · ") },
      { label: f.name, value: input.customerName ?? "" },
    ],
    note: input.note,
    link: input.url,
  };
}

export function generalInquiryPayload(
  d: Dictionary,
  input: { customerName?: string; note?: string; url?: string; reference?: string } = {},
): WhatsAppPayload {
  return {
    intro: d.whatsapp.messageGeneral,
    lines: [{ label: d.whatsapp.messageFields.name, value: input.customerName ?? "" }],
    note: input.note,
    link: input.url,
    reference: input.reference,
  };
}
