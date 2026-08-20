import type { Metadata } from "next";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProducts } from "@/lib/data/products";
import { getContent, getGallery } from "@/lib/data/catalog";

import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { FeaturedCollection } from "@/components/home/featured";
import { Difference } from "@/components/home/difference";
import { QuizTeaser } from "@/components/home/closing";
import { SectionHeader } from "@/components/ui/section-header";
import { GalleryMosaic } from "@/components/site/gallery-mosaic";
import { notFound } from "next/navigation";

/** Media defaults — overridden by the `home.media` content block. */
const MEDIA_FALLBACK = {
  // The hero is a 3D scene, so its art arrives as four planes, back to front.
  heroPlanes: {
    sky: "/media/hero-plane-sky.svg",
    far: "/media/hero-plane-far.svg",
    mid: "/media/hero-plane-mid.svg",
    near: "/media/hero-plane-near.svg",
  },
  quizImage: "/media/hero-dusk.svg",
};

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
    path: "",
    title: d.meta.defaultTitle,
    description: d.meta.defaultDescription,
    keywords: d.meta.keywords,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, featured, gallery, media] = await Promise.all([
    getDictionary(locale),
    getFeaturedProducts(locale, 3),
    getGallery(locale),
    getContent("home.media", locale, MEDIA_FALLBACK),
  ]);

  return (
    <>
      <Hero
        planes={media.heroPlanes ?? MEDIA_FALLBACK.heroPlanes}
        imageAlt={d.meta.tagline}
        eyebrow={d.home.hero.eyebrow}
        title={d.home.hero.title}
        titleAccent={d.home.hero.titleAccent}
        body={d.home.hero.body}
      />

      <Manifesto d={d} />

      <FeaturedCollection d={d} locale={locale} products={featured} />

      <Difference d={d} />

      {/* Inspiration — a scrolling row of installed work: a trailer for
          /inspiration rather than a duplicate of it. */}
      {gallery.length > 0 ? (
        <section className="section">
          <div className="shell">
            <SectionHeader
              eyebrow={d.home.inspiration.eyebrow}
              title={d.home.inspiration.title}
              body={d.home.inspiration.body}
              cta={{ href: localePath(locale, "/inspiration"), label: d.home.inspiration.cta }}
              className="mb-10"
            />
            <GalleryMosaic items={gallery.slice(0, 8)} scroller />
          </div>
        </section>
      ) : null}

      <QuizTeaser d={d} locale={locale} image={media.quizImage} />
    </>
  );
}
