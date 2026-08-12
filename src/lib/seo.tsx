import type { Metadata } from "next";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Canonical + hreflang for a page that exists in all three languages.
 * `path` is the route *without* the locale prefix, e.g. "/collection/aria".
 */
export function localeAlternates(locale: Locale, path = "") {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].htmlLang] = absoluteUrl(`/${l}${clean}`);
  languages["x-default"] = absoluteUrl(`/en${clean}`);
  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages,
  };
}

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  keywords,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string;
}): Metadata {
  const url = absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
  const ogImage = image ?? absoluteUrl("/og-default.svg");

  return {
    title,
    description,
    keywords,
    alternates: localeAlternates(locale, path),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "Saiwan",
      locale: localeMeta[locale].htmlLang,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].htmlLang),
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export function organizationSchema(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl()}/#organization`,
    name,
    url: absoluteUrl(`/${locale}`),
    description,
    logo: absoluteUrl("/icon.svg"),
    sameAs: [] as string[],
  };
}

export function websiteSchema(locale: Locale, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    name,
    url: absoluteUrl(`/${locale}`),
    inLanguage: localeMeta[locale].htmlLang,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(`/${locale}/search?q={search_term_string}`),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema({
  locale,
  name,
  description,
  slug,
  images,
  category,
  price,
  currency,
  availability,
  brand = "Saiwan",
  materials,
}: {
  locale: Locale;
  name: string;
  description: string;
  slug: string;
  images: string[];
  category?: string;
  price?: number | null;
  currency?: string;
  availability: string;
  brand?: string;
  materials?: string[];
}) {
  const schemaAvailability =
    availability === "IN_STOCK"
      ? "https://schema.org/InStock"
      : availability === "MADE_TO_ORDER"
        ? "https://schema.org/PreOrder"
        : availability === "DISCONTINUED"
          ? "https://schema.org/Discontinued"
          : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    category,
    material: materials?.join(", "),
    brand: { "@type": "Brand", name: brand },
    url: absoluteUrl(`/${locale}/collection/${slug}`),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/${locale}/collection/${slug}`),
      availability: schemaAvailability,
      priceCurrency: currency ?? "USD",
      // Omitted rather than guessed when the business has not published a price.
      ...(typeof price === "number" ? { price } : {}),
      seller: { "@type": "Organization", name: brand },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Renders a JSON-LD block. Kept in one place so escaping is handled once. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one sequence that can break
      // out of a <script> element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
