import "server-only";
import { prisma } from "@/lib/db";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ProductCard } from "./products";
import { parseJson } from "@/lib/utils";
import type { Availability, Segment, Style, UseCase } from "@/lib/constants";

export type SearchResult = ProductCard & { matchedOn: "name" | "category" | "material" | "setting" };

/**
 * Catalogue search.
 *
 * SQLite's LIKE is case-insensitive for ASCII and case is meaningless in Arabic
 * and Kurdish, so a `contains` scan covers all three languages without an
 * extension. Matching runs against *every* locale's translations, so a customer
 * browsing in Kurdish still finds a piece by typing its English name.
 */
export async function searchProducts(query: string, locale: Locale, limit = 12): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { slug: { contains: q } },
        { sku: { contains: q } },
        { translations: { some: { OR: [{ name: { contains: q } }, { tagline: { contains: q } }, { description: { contains: q } }] } } },
        { category: { translations: { some: { name: { contains: q } } } } },
        { materials: { some: { material: { translations: { some: { name: { contains: q } } } } } } },
        { useCases: { contains: q.toLowerCase() } },
      ],
    },
    include: {
      category: { select: { slug: true, translations: true } },
      translations: true,
      images: { orderBy: { order: "asc" }, take: 1 },
      materials: { include: { material: { include: { translations: true } } } },
    },
    take: limit,
  });

  const lower = q.toLowerCase();

  return rows
    .map((row) => {
      const t =
        row.translations.find((x) => x.locale === locale) ??
        row.translations.find((x) => x.locale === defaultLocale) ??
        row.translations[0];
      const c =
        row.category.translations.find((x) => x.locale === locale) ??
        row.category.translations.find((x) => x.locale === defaultLocale) ??
        row.category.translations[0];

      const name = t?.name ?? row.slug;
      const nameHit = row.translations.some((x) => x.name.toLowerCase().includes(lower));
      const categoryHit = row.category.translations.some((x) => x.name.toLowerCase().includes(lower));
      const materialHit = row.materials.some((m) =>
        m.material.translations.some((x) => x.name.toLowerCase().includes(lower)),
      );

      return {
        id: row.id,
        slug: row.slug,
        name,
        tagline: t?.tagline ?? null,
        categoryName: c?.name ?? row.category.slug,
        categorySlug: row.category.slug,
        image: row.images[0]?.url ?? null,
        imageAlt: row.images[0]?.alt ?? name,
        price: row.price,
        currency: row.currency,
        showPrice: row.showPrice,
        availability: row.availability as Availability,
        style: row.style as Style,
        segment: row.segment as Segment,
        useCases: parseJson<UseCase[]>(row.useCases, []),
        coverageM2: row.coverageM2,
        priceTier: row.priceTier,
        isFeatured: row.isFeatured,
        matchedOn: (nameHit ? "name" : categoryHit ? "category" : materialHit ? "material" : "setting") as
          | "name"
          | "category"
          | "material"
          | "setting",
      };
    })
    // Name matches first — they are what the customer almost always meant.
    .sort((a, b) => {
      const rank = { name: 0, category: 1, material: 2, setting: 3 } as const;
      return rank[a.matchedOn] - rank[b.matchedOn];
    });
}

/** Logged so the admin can see what customers ask for that we do not stock. */
export async function recordSearch(query: string, locale: Locale, resultCount: number, visitorId?: string | null) {
  if (query.trim().length < 2) return;
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: "search",
        locale,
        visitorId: visitorId ?? null,
        meta: JSON.stringify({ query: query.trim().slice(0, 120), resultCount }),
      },
    });
  } catch {
    /* non-critical */
  }
}
