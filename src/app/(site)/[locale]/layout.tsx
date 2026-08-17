import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";

import { locales, localeMeta, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";
import { getCategories } from "@/lib/data/catalog";
import { getSessionUser } from "@/lib/auth/session";
import { getFavoriteProductIds } from "@/lib/data/favorites";

import { ThemeScript } from "@/components/theme/theme-script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { CompareProvider } from "@/components/product/compare-provider";
import { FavoritesProvider } from "@/components/product/favorites-provider";
import { CompareTray } from "@/components/product/compare-tray";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EB" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0C0A" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = await getDictionary(locale);

  return {
    ...buildMetadata({
      locale,
      path: "",
      title: d.meta.defaultTitle,
      description: d.meta.defaultDescription,
      keywords: d.meta.keywords,
    }),
    title: { default: d.meta.defaultTitle, template: `%s · ${d.meta.siteName}` },
    applicationName: d.meta.siteName,
    formatDetection: { telephone: false },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      // Safari and iOS request this path by convention, with or without a
      // <link> tag, so it is served rather than 404ing on every page view.
      other: [{ rel: "apple-touch-icon-precomposed", url: "/apple-icon.png" }],
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, categories, user] = await Promise.all([
    getDictionary(locale),
    getCategories(locale),
    getSessionUser(),
  ]);

  // Fetched once here rather than once per product card on the client.
  const favoriteIds = user ? await getFavoriteProductIds(user.id) : [];

  const { dir, htmlLang } = localeMeta[locale];

  return (
    <html
      lang={htmlLang}
      dir={dir}
      className={fontVariables}
      // Declares the `scroll-behavior: smooth` set in globals.css, so Next can
      // suppress it during route transitions instead of warning about it.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="grain min-h-dvh bg-bg text-fg antialiased">
        <LocaleProvider locale={locale} dictionary={d}>
          <ThemeProvider>
            <CompareProvider>
              <FavoritesProvider initialIds={favoriteIds} signedIn={Boolean(user)}>
              {/* Keyboard users land here first; it is the only element before
                  the header in the tab order. */}
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:bg-fg focus:px-5 focus:py-3 focus:text-bg focus:text-sm"
              >
                {d.nav.skipToContent}
              </a>

              <SiteHeader
                categories={categories.map((c) => ({ slug: c.slug, name: c.name, count: c.productCount }))}
                signedIn={Boolean(user)}
                userName={user?.name ?? null}
              />

              <main id="main" className="min-h-[60vh]">
                {children}
              </main>

              <SiteFooter locale={locale} d={d} categories={categories.slice(0, 5)} />
              <WhatsAppFloat />
              <CompareTray />
              </FavoritesProvider>
            </CompareProvider>
          </ThemeProvider>
        </LocaleProvider>

        <JsonLd
          data={[
            organizationSchema(locale, d.meta.siteName, d.meta.defaultDescription),
            websiteSchema(locale, d.meta.siteName),
          ]}
        />
      </body>
    </html>
  );
}
