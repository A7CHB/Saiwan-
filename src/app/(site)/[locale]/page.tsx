import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProducts, getProducts, type ProductCard } from "@/lib/data/products";
import { getContent } from "@/lib/data/catalog";
import { SCENES } from "@/lib/home-scenes";

import { Showroom } from "@/components/home/showroom";
import { CollectionEditorial } from "@/components/home/collection-editorial";
import { SpaceExplorer } from "@/components/home/space-explorer";
import { QuizTeaser } from "@/components/home/closing";

/** Media defaults — overridden by the `home.media` content block. */
const MEDIA_FALLBACK = {
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

/**
 * One object. Infinite spaces.
 *
 * The home page is a showroom rather than a catalogue page: a single umbrella
 * standing in five environments, then the collection, then a way to choose by
 * the space a piece is for. Everything it shows comes from systems that already
 * exist — products from the catalogue, copy from the dictionaries, the spaces
 * from `Product.useCases` — so nothing here is a second source of truth.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, featured, media, spaceProducts] = await Promise.all([
    getDictionary(locale),
    getFeaturedProducts(locale, 3),
    getContent("home.media", locale, MEDIA_FALLBACK),
    // One query per use-case, against the same filter the collection page uses.
    // `getProducts` is request-cached, so a use-case shared by two scenes costs
    // one query rather than two.
    Promise.all(
      SCENES.map(async (scene) => {
        const lists = await Promise.all(
          scene.useCases.map((useCase) => getProducts(locale, { useCase })),
        );
        const seen = new Set<string>();
        const merged: ProductCard[] = [];
        for (const product of lists.flat()) {
          if (seen.has(product.id)) continue;
          seen.add(product.id);
          merged.push(product);
        }
        return merged;
      }),
    ),
  ]);

  const scenes = SCENES.map((scene) => ({
    key: scene.key,
    image: scene.image,
    position: scene.position,
    name: d.home.scenes[scene.key].name,
    body: d.home.scenes[scene.key].body,
  }));

  const spaces = SCENES.map((scene, index) => ({
    key: scene.key,
    name: d.home.scenes[scene.key].name,
    image: scene.image,
    position: scene.position,
    useCase: scene.useCases[0],
    products: spaceProducts[index],
  }));

  return (
    <>
      <Showroom
        scenes={scenes}
        eyebrow={d.home.hero.eyebrow}
        titleTop={d.home.hero.title}
        titleBottom={d.home.hero.titleAccent}
        intro={d.home.hero.body}
        primaryCta={d.home.hero.primaryCta}
        secondaryCta={d.home.hero.secondaryCta}
        collectionHref={localePath(locale, "/collection")}
        navLabel={d.home.scenesNav}
      />

      <CollectionEditorial d={d} locale={locale} products={featured} />

      <SpaceExplorer spaces={spaces} />

      <QuizTeaser d={d} locale={locale} image={media.quizImage} />
    </>
  );
}
