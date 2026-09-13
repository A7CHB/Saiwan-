import type { Metadata } from "next";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";

/**
 * The address this site is published at.
 *
 * This is a fact about the site, not about the machine that happens to be
 * building it, so it lives in the repository where it is reviewed and
 * versioned rather than in a dashboard field. It was a dashboard field, and
 * the field went on saying `saiwan.vercel.app` long after the site moved to
 * its own domain — which is the one setting here where being wrong is
 * expensive and invisible: it is what every canonical tag, hreflang
 * alternate, sitemap entry, robots `host` and share card claims as the
 * site's identity. Pointing it at the wrong one of two working hostnames
 * asks search engines to index the other address instead of this one.
 *
 * Only production is pinned. Local and preview builds still answer with
 * whatever `NEXT_PUBLIC_SITE_URL` says, so they go on describing themselves.
 *
 * It must name the hostname that *serves* the site, not the one that
 * redirects to it. Both `saiwan.store` and `www.saiwan.store` answer, but
 * only one of them answers with a page: the other returns a 308. Naming the
 * redirecting one tells search engines the canonical page is at an address
 * that immediately sends them somewhere else, which is a contradiction they
 * resolve by guessing. `www` is primary in the Vercel project, so `www` is
 * what belongs here — change both together or neither.
 */
const CANONICAL_ORIGIN = "https://www.saiwan.store";

export function siteUrl(): string {
  const raw =
    process.env.VERCEL_ENV === "production"
      ? CANONICAL_ORIGIN
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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

/**
 * What the brand is called in the scripts its customers actually type.
 *
 * "Saiwan" in Latin letters is a hard thing to own: it is a common Kurdish
 * given name before it is a business. Declaring the Arabic and Kurdish
 * spellings — the ones already used throughout the dictionaries — is how a
 * search engine is told that all three strings name one organisation, rather
 * than treating the Latin one as the only form of the name and every search
 * in the local scripts as being about somebody else.
 */
const BRAND_ALTERNATE_NAMES = ["سايوان", "سایوان"];

export function organizationSchema(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl()}/#organization`,
    name,
    // Every spelling except the one this locale already calls it.
    alternateName: BRAND_ALTERNATE_NAMES.filter((n) => n !== name),
    url: absoluteUrl(`/${locale}`),
    description,
    logo: absoluteUrl("/icon.svg"),
    // The profiles that prove this organisation is a real one. Google uses
    // them to reconcile the entity across the web — with nothing here, the
    // brand is a string on a page rather than a business it knows about.
    // Worth adding the Facebook page and Google Business Profile as they
    // exist; the list is the point, not any single entry.
    sameAs: ["https://www.instagram.com/saiwan.official/"],
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
  // Several entities on one page are emitted as a single document with an
  // `@graph`, not as a top-level JSON array. Both are valid JSON-LD, but a bare
  // array has no `@context` at the root, and consumers that read
  // `data["@context"]` before anything else throw on it.
  const payload = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map((entity) => {
          const { ["@context"]: _context, ...rest } = entity as Record<string, unknown>;
          return rest;
        }),
      }
    : data;

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one sequence that can break
      // out of a <script> element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}
