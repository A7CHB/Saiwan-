/**
 * Enum-like values. SQLite has no native enums, so these string unions are the
 * single source of truth shared by Prisma columns, Zod schemas and the UI.
 */

/**
 * Only the dashboard has accounts, so every role is a staff role. A visitor to
 * the storefront has no role at all — the storefront asks for none.
 */
export const ROLES = ["STAFF", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

/** Rank used for authorisation comparisons — higher wins. */
export const ROLE_RANK: Record<Role, number> = { STAFF: 1, ADMIN: 2 };

export function hasRole(role: string | undefined | null, required: Role): boolean {
  if (!role || !(role in ROLE_RANK)) return false;
  return ROLE_RANK[role as Role] >= ROLE_RANK[required];
}

export const PRODUCT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const AVAILABILITIES = ["IN_STOCK", "MADE_TO_ORDER", "OUT_OF_STOCK", "DISCONTINUED"] as const;
export type Availability = (typeof AVAILABILITIES)[number];

export const STYLES = ["MODERN", "CLASSIC", "MINIMAL", "RESORT"] as const;
export type Style = (typeof STYLES)[number];

export const SEGMENTS = ["RESIDENTIAL", "COMMERCIAL", "BOTH"] as const;
export type Segment = (typeof SEGMENTS)[number];

export const USE_CASES = [
  "garden",
  "pool",
  "restaurant",
  "hotel",
  "rooftop",
  "terrace",
  "balcony",
] as const;
export type UseCase = (typeof USE_CASES)[number];

export const GALLERY_TAGS = ["villa", "pool", "restaurant", "hotel", "rooftop", "garden"] as const;
export type GalleryTag = (typeof GALLERY_TAGS)[number];

export const SHAPES = ["SQUARE", "ROUND", "RECTANGLE", "OCTAGON"] as const;
export type Shape = (typeof SHAPES)[number];

export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_SOURCES = ["PRODUCT", "QUIZ", "CONTACT", "GENERAL"] as const;
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export const ANALYTICS_EVENTS = [
  "page_view",
  "product_view",
  "whatsapp_click",
  "inquiry",
  "search",
  "quiz_complete",
] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[number];

export const PRICE_TIERS = [1, 2, 3] as const;

export const IMAGE_SPANS = ["NORMAL", "WIDE", "TALL"] as const;

/** Statuses a customer-facing surface is allowed to see. */
export const PUBLIC_PRODUCT_WHERE = { status: "PUBLISHED" as const };

/**
 * Categories that exist to be *added to an order*, not browsed.
 *
 * A granite base and a canopy cover are real products with real prices, and
 * they still appear on every umbrella's page as add-ons that carry through into
 * the WhatsApp message. What they are not is pieces: standing a base next to a
 * six-metre cantilever in the collection makes the collection look like a parts
 * list. So they are kept out of the browse surfaces — the listing and the
 * category filter — and left everywhere they actually sell.
 */
export const ADD_ON_CATEGORIES = ["accessories"] as const;

export const SESSION_COOKIE = "saiwan_session";
export const THEME_COOKIE = "saiwan_theme";
export const LOCALE_COOKIE = "saiwan_locale";
export const VISITOR_COOKIE = "saiwan_visitor";
export const SESSION_TTL_DAYS = 30;
export const COMPARE_LIMIT = 3;
