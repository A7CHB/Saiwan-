import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata, breadcrumbSchema, JsonLd, absoluteUrl } from "@/lib/seo";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/product-card";
import { CollectionFilters } from "@/components/product/collection-filters";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

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
    path: "/collection",
    title: d.collection.title,
    description: d.collection.intro,
    keywords: d.meta.keywords,
  });
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const query = await searchParams;
  const filters = {
    category: one(query.category),
    style: one(query.style),
    useCase: one(query.use),
    tier: one(query.tier) ? Number(one(query.tier)) : undefined,
    sort: one(query.sort),
  };

  const [d, products, categories] = await Promise.all([
    getDictionary(locale),
    getProducts(locale, filters),
    getCategories(locale),
  ]);

  const activeCategory = filters.category
    ? categories.find((category) => category.slug === filters.category)
    : undefined;

  return (
    <>
      {/* Masthead — a text-led opening rather than another hero image, so the
          collection reads as a catalogue index. */}
      <header className="shell pb-10 pt-32 sm:pt-40">
        <Reveal>
          <p className="eyebrow mb-6">{d.collection.eyebrow}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display max-w-4xl text-display text-balance">
            {activeCategory?.name ?? d.collection.title}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-7 max-w-xl text-lead leading-relaxed text-muted">
            {activeCategory?.description ?? d.collection.intro}
          </p>
        </Reveal>
      </header>

      <div className="shell">
        <CollectionFilters
          categories={categories.map((category) => ({ value: category.slug, label: category.name }))}
          resultCount={products.length}
        />
      </div>

      <div className="shell pb-24 pt-14 sm:pb-32">
        {products.length === 0 ? (
          // Empty state: never a dead end — the two ways forward are always offered.
          <div className="mx-auto max-w-md py-20 text-center">
            <h2 className="display text-heading">{d.collection.empty.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{d.collection.empty.body}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={localePath(locale, "/collection")}
                className="inline-flex h-12 items-center rounded-xs border border-line-strong px-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
              >
                {d.collection.empty.cta}
              </Link>
              <WhatsAppButton variant="ink" label={d.whatsapp.speak} />
            </div>
          </div>
        ) : (
          <>
            {/* Product names are h3; this keeps the outline h1 → h2 → h3
                without adding a visual heading the design does not want. */}
            <h2 className="sr-only">{d.collection.title}</h2>
            <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal as="li" key={product.id} delay={(index % 3) * 90}>
                <ProductCard product={product} index={index} priority={index < 3} />
              </Reveal>
              ))}
            </ul>
          </>
        )}
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, url: absoluteUrl(`/${locale}`) },
          { name: d.collection.title, url: absoluteUrl(`/${locale}/collection`) },
          ...(activeCategory
            ? [
                {
                  name: activeCategory.name,
                  url: absoluteUrl(`/${locale}/collection?category=${activeCategory.slug}`),
                },
              ]
            : []),
        ])}
      />
    </>
  );
}
