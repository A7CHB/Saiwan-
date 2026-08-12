import "server-only";
import { prisma } from "@/lib/db";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { parseJson } from "@/lib/utils";

/**
 * Reporting queries for the admin.
 *
 * Everything is derived from the first-party `AnalyticsEvent` table — no third
 * party, no cookies beyond an anonymous id. Ranges are computed as two adjacent
 * windows so every figure can be shown with an honest period-over-period delta
 * rather than a bare number.
 */

export type Range = 7 | 30 | 90;

function windows(days: Range) {
  const now = Date.now();
  const start = new Date(now - days * 86_400_000);
  const previousStart = new Date(now - days * 2 * 86_400_000);
  return { start, previousStart, end: new Date(now) };
}

function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null; // "new", not "+∞"
  return Math.round(((current - previous) / previous) * 100);
}

export type Overview = {
  visitors: { value: number; delta: number | null };
  productViews: { value: number; delta: number | null };
  whatsappClicks: { value: number; delta: number | null };
  inquiries: { value: number; delta: number | null };
  /** WhatsApp clicks per product view, as a percentage. */
  conversionRate: number;
  series: { label: string; value: number }[];
};

export async function getOverview(days: Range = 30): Promise<Overview> {
  const { start, previousStart } = windows(days);

  const [current, previous] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: start } },
      select: { type: true, visitorId: true, createdAt: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: previousStart, lt: start } },
      select: { type: true, visitorId: true },
    }),
  ]);

  const count = (rows: { type: string }[], type: string) => rows.filter((row) => row.type === type).length;
  const uniqueVisitors = (rows: { visitorId: string | null }[]) =>
    new Set(rows.map((row) => row.visitorId).filter(Boolean)).size;

  const productViews = count(current, "product_view");
  const whatsappClicks = count(current, "whatsapp_click");

  // Daily buckets, zero-filled so the chart shows quiet days as flat rather
  // than as a gap.
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86_400_000);
    buckets.set(date.toISOString().slice(0, 10), 0);
  }
  for (const event of current) {
    if (event.type !== "product_view" && event.type !== "page_view") continue;
    const key = event.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return {
    visitors: { value: uniqueVisitors(current), delta: delta(uniqueVisitors(current), uniqueVisitors(previous)) },
    productViews: { value: productViews, delta: delta(productViews, count(previous, "product_view")) },
    whatsappClicks: {
      value: whatsappClicks,
      delta: delta(whatsappClicks, count(previous, "whatsapp_click")),
    },
    inquiries: { value: count(current, "inquiry"), delta: delta(count(current, "inquiry"), count(previous, "inquiry")) },
    conversionRate: productViews === 0 ? 0 : Math.round((whatsappClicks / productViews) * 1000) / 10,
    series: Array.from(buckets.entries()).map(([label, value]) => ({
      label: label.slice(5), // MM-DD
      value,
    })),
  };
}

export async function getTopProducts(locale: Locale, days: Range = 30, take = 8) {
  const { start } = windows(days);

  const grouped = await prisma.analyticsEvent.groupBy({
    by: ["productId"],
    where: { type: "product_view", createdAt: { gte: start }, productId: { not: null } },
    _count: { productId: true },
    orderBy: { _count: { productId: "desc" } },
    take,
  });

  const ids = grouped.map((row) => row.productId).filter((id): id is string => Boolean(id));
  if (ids.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
  });

  return grouped
    .map((row) => {
      const product = products.find((item) => item.id === row.productId);
      if (!product) return null;
      const name =
        product.translations.find((t) => t.locale === locale)?.name ??
        product.translations.find((t) => t.locale === defaultLocale)?.name ??
        product.slug;
      return { id: product.id, label: name, value: row._count.productId, href: `/admin/products/${product.id}` };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
}

export async function getTopWhatsAppProducts(locale: Locale, take = 8) {
  const products = await prisma.product.findMany({
    where: { whatsappCount: { gt: 0 } },
    orderBy: { whatsappCount: "desc" },
    take,
    select: { id: true, slug: true, whatsappCount: true, translations: { select: { locale: true, name: true } } },
  });

  return products.map((product) => ({
    label:
      product.translations.find((t) => t.locale === locale)?.name ??
      product.translations.find((t) => t.locale === defaultLocale)?.name ??
      product.slug,
    value: product.whatsappCount,
    href: `/admin/products/${product.id}`,
  }));
}

export async function getTopCategories(locale: Locale, days: Range = 30) {
  const { start } = windows(days);

  const events = await prisma.analyticsEvent.findMany({
    where: { type: "product_view", createdAt: { gte: start }, productId: { not: null } },
    select: { product: { select: { category: { select: { slug: true, translations: true } } } } },
  });

  const counts = new Map<string, { label: string; value: number }>();
  for (const event of events) {
    const category = event.product?.category;
    if (!category) continue;
    const label =
      category.translations.find((t) => t.locale === locale)?.name ??
      category.translations.find((t) => t.locale === defaultLocale)?.name ??
      category.slug;
    const existing = counts.get(category.slug);
    counts.set(category.slug, { label, value: (existing?.value ?? 0) + 1 });
  }

  return Array.from(counts.values()).sort((a, b) => b.value - a.value);
}

/** What customers typed that the catalogue may not answer. */
export async function getTopSearches(days: Range = 30, take = 10) {
  const { start } = windows(days);

  const events = await prisma.analyticsEvent.findMany({
    where: { type: "search", createdAt: { gte: start } },
    select: { meta: true },
    take: 2000,
  });

  const counts = new Map<string, { value: number; resultCount: number }>();
  for (const event of events) {
    const meta = parseJson<{ query?: string; resultCount?: number }>(event.meta, {});
    const query = meta.query?.trim().toLowerCase();
    if (!query) continue;
    const existing = counts.get(query);
    counts.set(query, {
      value: (existing?.value ?? 0) + 1,
      resultCount: meta.resultCount ?? existing?.resultCount ?? 0,
    });
  }

  return Array.from(counts.entries())
    .map(([label, data]) => ({ label, value: data.value, resultCount: data.resultCount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, take);
}

export async function getLocaleSplit(days: Range = 30) {
  const { start } = windows(days);
  const grouped = await prisma.analyticsEvent.groupBy({
    by: ["locale"],
    where: { createdAt: { gte: start } },
    _count: { locale: true },
  });
  return grouped
    .map((row) => ({ label: row.locale.toUpperCase(), value: row._count.locale }))
    .sort((a, b) => b.value - a.value);
}

export async function getInquiryFunnel() {
  const grouped = await prisma.inquiry.groupBy({ by: ["status"], _count: { status: true } });
  return Object.fromEntries(grouped.map((row) => [row.status, row._count.status])) as Record<string, number>;
}
