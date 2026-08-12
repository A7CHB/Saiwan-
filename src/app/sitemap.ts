import type { MetadataRoute } from "next";
import { locales, localeMeta } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo";
import { prisma } from "@/lib/db";

/**
 * Every public route in every language, with `alternates.languages` so search
 * engines connect the three versions of each page rather than treating them as
 * duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/collection", priority: 0.9, changeFrequency: "weekly" },
    { path: "/find-your-shade", priority: 0.8, changeFrequency: "monthly" },
    { path: "/inspiration", priority: 0.7, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  ];

  let products: { slug: string; updatedAt: Date }[] = [];
  let categories: { slug: string; updatedAt: Date }[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // A database hiccup should still produce a valid sitemap of static routes.
  }

  const languagesFor = (path: string) =>
    Object.fromEntries(
      locales.map((locale) => [localeMeta[locale].htmlLang, absoluteUrl(`/${locale}${path}`)]),
    );

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const entry of staticPaths) {
      entries.push({
        url: absoluteUrl(`/${locale}${entry.path}`),
        lastModified: new Date(),
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: { languages: languagesFor(entry.path) },
      });
    }

    for (const category of categories) {
      const path = `/collection?category=${category.slug}`;
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const product of products) {
      const path = `/collection/${product.slug}`;
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: product.updatedAt,
        changeFrequency: "monthly",
        priority: 0.85,
        alternates: { languages: languagesFor(path) },
      });
    }
  }

  return entries;
}
