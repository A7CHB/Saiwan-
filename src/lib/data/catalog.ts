import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { ADD_ON_CATEGORIES } from "@/lib/constants";
import type { GalleryTag } from "@/lib/constants";

function pick<T extends { locale: string }>(rows: T[], locale: Locale): T | undefined {
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === defaultLocale) ?? rows[0];
}

export type CategoryView = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
};

/**
 * The categories a customer browses.
 *
 * Add-on categories are left out (see ADD_ON_CATEGORIES): they feed the
 * accessory picker on a product page, and offering "Accessories" as a way to
 * browse a collection of umbrellas only ever leads somewhere disappointing.
 */
export const getCategories = cache(async (locale: Locale): Promise<CategoryView[]> => {
  const rows = await prisma.category.findMany({
    where: { isActive: true, slug: { notIn: [...ADD_ON_CATEGORIES] } },
    include: {
      translations: true,
      _count: { select: { products: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { order: "asc" },
  });

  return rows.map((row) => {
    const t = pick(row.translations, locale);
    return {
      id: row.id,
      slug: row.slug,
      name: t?.name ?? row.slug,
      tagline: t?.tagline ?? null,
      description: t?.description ?? null,
      imageUrl: row.imageUrl,
      productCount: row._count.products,
    };
  });
});

export const getCategoryBySlug = cache(
  async (slug: string, locale: Locale): Promise<CategoryView | null> => {
    const categories = await getCategories(locale);
    return categories.find((c) => c.slug === slug) ?? null;
  },
);

export type MaterialView = { id: string; slug: string; name: string; description: string | null };

export const getMaterials = cache(async (locale: Locale): Promise<MaterialView[]> => {
  const rows = await prisma.material.findMany({
    include: { translations: true },
    orderBy: { order: "asc" },
  });
  return rows.map((row) => {
    const t = pick(row.translations, locale);
    return {
      id: row.id,
      slug: row.slug,
      name: t?.name ?? row.slug,
      description: t?.description ?? null,
    };
  });
});

export type ColorView = { id: string; slug: string; hex: string; name: string };

export const getColors = cache(async (locale: Locale): Promise<ColorView[]> => {
  const rows = await prisma.color.findMany({ include: { translations: true }, orderBy: { order: "asc" } });
  return rows.map((row) => {
    const t = pick(row.translations, locale);
    return { id: row.id, slug: row.slug, hex: row.hex, name: t?.name ?? row.slug };
  });
});

export type GalleryView = {
  id: string;
  url: string;
  alt: string;
  tag: GalleryTag;
  span: "NORMAL" | "WIDE" | "TALL";
  caption: string | null;
  location: string | null;
};

export const getGallery = cache(async (locale: Locale, tag?: string): Promise<GalleryView[]> => {
  const rows = await prisma.galleryItem.findMany({
    where: { isActive: true, ...(tag && tag !== "all" ? { tag } : {}) },
    include: { translations: true },
    orderBy: { order: "asc" },
  });

  return rows.map((row) => {
    const t = pick(row.translations, locale);
    return {
      id: row.id,
      url: row.url,
      alt: row.alt ?? t?.caption ?? "",
      tag: row.tag as GalleryTag,
      span: row.span as GalleryView["span"],
      caption: t?.caption ?? null,
      location: t?.location ?? null,
    };
  });
});

/**
 * Admin-authored content blocks, returned as a plain object. Callers pass their
 * own defaults so a page renders correctly before the admin has touched it.
 */
export const getContent = cache(
  async <T extends Record<string, unknown>>(key: string, locale: Locale, fallback: T): Promise<T> => {
    try {
      const row =
        (await prisma.contentBlock.findUnique({ where: { key_locale: { key, locale } } })) ??
        (await prisma.contentBlock.findUnique({ where: { key_locale: { key, locale: defaultLocale } } }));
      if (!row) return fallback;
      const parsed = JSON.parse(row.value) as Partial<T>;
      return { ...fallback, ...parsed };
    } catch {
      return fallback;
    }
  },
);

export const getSetting = cache(async (key: string): Promise<string | null> => {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
});

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
});
