import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { Availability, ProductStatus, Segment, Style, UseCase } from "@/lib/constants";

/**
 * The read side of the catalogue.
 *
 * Everything here returns a plain, fully-resolved view model — translations
 * already picked, JSON columns already parsed — so pages and components never
 * touch Prisma rows or worry about locale fallback.
 */

type TranslationRow = { locale: string } & Record<string, unknown>;

/** locale → English → whatever exists. A page must never render a blank name. */
function pick<T extends TranslationRow>(rows: T[], locale: Locale): T | undefined {
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === defaultLocale) ?? rows[0];
}

export type Spec = { label: string; value: string };

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  categoryName: string;
  categorySlug: string;
  image: string | null;
  imageAlt: string;
  price: number | null;
  currency: string;
  showPrice: boolean;
  availability: Availability;
  style: Style;
  segment: Segment;
  useCases: UseCase[];
  coverageM2: number | null;
  priceTier: number;
  isFeatured: boolean;
};

export type ProductColorOption = { id: string; slug: string; hex: string; name: string; imageUrl: string | null };
export type ProductSizeOption = {
  id: string;
  slug: string;
  label: string;
  shape: string;
  widthCm: number | null;
  depthCm: number | null;
  areaM2: number | null;
  price: number | null;
};

export type ProductDetail = ProductCard & {
  sku: string | null;
  description: string | null;
  features: string[];
  specs: Spec[];
  metaTitle: string | null;
  metaDescription: string | null;
  leadTimeDays: number | null;
  images: { id: string; url: string; alt: string; colorId: string | null }[];
  colors: ProductColorOption[];
  sizes: ProductSizeOption[];
  materials: { id: string; slug: string; name: string; description: string | null }[];
  accessories: ProductCard[];
};

const cardInclude = {
  category: { select: { slug: true, translations: true } },
  translations: true,
  images: { orderBy: { order: "asc" }, take: 1 },
} as const;

type CardRow = {
  id: string;
  slug: string;
  price: number | null;
  currency: string;
  showPrice: boolean;
  availability: string;
  style: string;
  segment: string;
  useCases: string;
  coverageM2: number | null;
  priceTier: number;
  isFeatured: boolean;
  category: { slug: string; translations: TranslationRow[] };
  translations: TranslationRow[];
  images: { url: string; alt: string | null }[];
};

function toCard(row: CardRow, locale: Locale): ProductCard {
  const t = pick(row.translations, locale);
  const c = pick(row.category.translations, locale);
  const name = (t?.name as string) ?? row.slug;

  return {
    id: row.id,
    slug: row.slug,
    name,
    tagline: (t?.tagline as string) ?? null,
    categoryName: (c?.name as string) ?? row.category.slug,
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
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getFeaturedProducts = cache(async (locale: Locale, take = 4): Promise<ProductCard[]> => {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: cardInclude,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take,
  });
  return rows.map((row) => toCard(row as unknown as CardRow, locale));
});

export type CollectionFilters = {
  category?: string;
  style?: string;
  segment?: string;
  useCase?: string;
  tier?: number;
  sort?: string;
};

export const getProducts = cache(
  async (locale: Locale, filters: CollectionFilters = {}): Promise<ProductCard[]> => {
    const orderBy =
      filters.sort === "newest"
        ? [{ createdAt: "desc" as const }]
        : filters.sort === "price-asc"
          ? [{ price: "asc" as const }]
          : filters.sort === "price-desc"
            ? [{ price: "desc" as const }]
            : filters.sort === "coverage"
              ? [{ coverageM2: "desc" as const }]
              : [{ isFeatured: "desc" as const }, { order: "asc" as const }, { createdAt: "desc" as const }];

    const rows = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(filters.category ? { category: { slug: filters.category } } : {}),
        ...(filters.style ? { style: filters.style } : {}),
        ...(filters.segment ? { OR: [{ segment: filters.segment }, { segment: "BOTH" }] } : {}),
        ...(filters.tier ? { priceTier: filters.tier } : {}),
        // useCases is a JSON array in a text column; SQLite has no JSON
        // operators through Prisma, so a substring match on the quoted token is
        // both correct (tokens are quoted) and index-free but cheap at this scale.
        ...(filters.useCase ? { useCases: { contains: `"${filters.useCase}"` } } : {}),
      },
      include: cardInclude,
      orderBy,
    });

    const cards = rows.map((row) => toCard(row as unknown as CardRow, locale));

    // Name sorting has to happen after translation resolution.
    if (filters.sort === "name-asc") {
      return cards.sort((a, b) => a.name.localeCompare(b.name, locale));
    }
    return cards;
  },
);

export const getProductBySlug = cache(
  async (slug: string, locale: Locale, includeUnpublished = false): Promise<ProductDetail | null> => {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { slug: true, translations: true } },
        translations: true,
        images: { orderBy: { order: "asc" } },
        colors: {
          orderBy: { order: "asc" },
          include: { color: { include: { translations: true } } },
        },
        sizes: { orderBy: { order: "asc" }, include: { size: true } },
        materials: { include: { material: { include: { translations: true } } } },
        accessories: {
          orderBy: { order: "asc" },
          include: { accessory: { include: cardInclude } },
        },
      },
    });

    if (!row) return null;
    if (!includeUnpublished && row.status !== "PUBLISHED") return null;

    const card = toCard(row as unknown as CardRow, locale);
    const t = pick(row.translations, locale);

    return {
      ...card,
      sku: row.sku,
      description: (t?.description as string) ?? null,
      features: parseJson<string[]>((t?.features as string) ?? null, []),
      specs: parseJson<Spec[]>((t?.specs as string) ?? null, []),
      metaTitle: (t?.metaTitle as string) ?? null,
      metaDescription: (t?.metaDescription as string) ?? null,
      leadTimeDays: row.leadTimeDays,
      images: row.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt ?? card.name,
        colorId: image.colorId,
      })),
      colors: row.colors.map((link) => {
        const ct = pick(link.color.translations, locale);
        return {
          id: link.color.id,
          slug: link.color.slug,
          hex: link.color.hex,
          name: (ct?.name as string) ?? link.color.slug,
          imageUrl: row.images.find((image) => image.colorId === link.color.id)?.url ?? null,
        };
      }),
      sizes: row.sizes.map((link) => ({
        id: link.size.id,
        slug: link.size.slug,
        label: link.size.label,
        shape: link.size.shape,
        widthCm: link.size.widthCm,
        depthCm: link.size.depthCm,
        areaM2: link.size.areaM2,
        price: link.price ?? null,
      })),
      materials: row.materials.map((link) => {
        const mt = pick(link.material.translations, locale);
        return {
          id: link.material.id,
          slug: link.material.slug,
          name: (mt?.name as string) ?? link.material.slug,
          description: (mt?.description as string) ?? null,
        };
      }),
      accessories: row.accessories
        .filter((link) => link.accessory.status === "PUBLISHED")
        .map((link) => toCard(link.accessory as unknown as CardRow, locale)),
    };
  },
);

/** Same category first, then anything else featured — never an empty rail. */
export const getRelatedProducts = cache(
  async (productId: string, categorySlug: string, locale: Locale, take = 3): Promise<ProductCard[]> => {
    const rows = await prisma.product.findMany({
      where: { status: "PUBLISHED", id: { not: productId }, category: { slug: categorySlug } },
      include: cardInclude,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take,
    });

    if (rows.length >= take) return rows.map((row) => toCard(row as unknown as CardRow, locale));

    const filler = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: [productId, ...rows.map((r) => r.id)] },
      },
      include: cardInclude,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: take - rows.length,
    });

    return [...rows, ...filler].map((row) => toCard(row as unknown as CardRow, locale));
  },
);

export const getProductSlugs = cache(async (): Promise<{ slug: string; updatedAt: Date }[]> => {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
});

export const getProductsByIds = cache(async (ids: string[], locale: Locale): Promise<ProductCard[]> => {
  if (ids.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids }, status: "PUBLISHED" },
    include: cardInclude,
  });
  const cards = rows.map((row) => toCard(row as unknown as CardRow, locale));
  // Preserve the caller's order (comparison trays, favourites).
  return ids.map((id) => cards.find((card) => card.id === id)).filter((c): c is ProductCard => Boolean(c));
});

/** Increment the view counter and log the event. Fire-and-forget from pages. */
export async function recordProductView(productId: string, locale: Locale, visitorId?: string | null) {
  try {
    await prisma.$transaction([
      prisma.product.update({ where: { id: productId }, data: { viewCount: { increment: 1 } } }),
      prisma.analyticsEvent.create({
        data: { type: "product_view", productId, locale, visitorId: visitorId ?? null },
      }),
    ]);
  } catch {
    // Analytics must never break a product page.
  }
}

export type { ProductStatus };
