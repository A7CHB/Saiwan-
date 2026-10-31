import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata, breadcrumbSchema, JsonLd, absoluteUrl } from "@/lib/seo";
import { getProducts } from "@/lib/data/products";
import { getColors } from "@/lib/data/catalog";
import { ShadeFinder } from "@/components/quiz/shade-finder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/find-your-shade",
    title: d.quiz.title,
    description: d.quiz.intro,
  });
}

export default async function FindYourShadePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  // The whole catalogue is sent to the client once. At this scale that is a few
  // kilobytes and buys instant, offline-capable scoring — far better than a
  // round trip per answer.
  const [products, colors, d] = await Promise.all([
    getProducts(locale),
    getColors(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <ShadeFinder products={products} colors={colors} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, url: absoluteUrl(`/${locale}`) },
          { name: d.quiz.title, url: absoluteUrl(`/${locale}/find-your-shade`) },
        ])}
      />
    </>
  );
}
