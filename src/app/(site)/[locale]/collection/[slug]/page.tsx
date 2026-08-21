import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { isLocale, localePath, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import {
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  JsonLd,
  productSchema,
} from "@/lib/seo";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/data/products";

import { ProductExperience } from "@/components/product/product-experience";
import { ProductViewTracker } from "@/components/product/product-view-tracker";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Media } from "@/components/ui/media";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

/** Pre-render the catalogue in every language — these are the money pages. */
export async function generateStaticParams() {
  const products = await getProductSlugs();
  return locales.flatMap((locale) => products.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const [d, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug, locale)]);
  if (!product) {
    return buildMetadata({
      locale,
      path: `/collection/${slug}`,
      title: d.product.notFound.title,
      description: d.product.notFound.body,
      noIndex: true,
    });
  }

  return buildMetadata({
    locale,
    path: `/collection/${product.slug}`,
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.tagline ?? d.meta.defaultDescription,
    image: product.image ? absoluteUrl(product.image) : null,
    imageAlt: product.imageAlt,
    type: "article",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, product] = await Promise.all([getDictionary(locale), getProductBySlug(slug, locale)]);

  // A piece that has been archived, unpublished or renamed gets a localised
  // "no longer listed" page inside the site chrome rather than a bare 404.
  //
  // Note on status codes: in this version of Next, a programmatic `notFound()`
  // renders the 404 boundary but still responds 200, while a genuinely
  // unmatched URL responds 404 correctly. Since the status is the same either
  // way here, the useful SEO signal is `noindex` — which `generateMetadata`
  // already sets for this branch — and the better outcome for the customer is a
  // page that keeps the navigation and offers a way back.
  if (!product) {
    return (
      <div className="shell flex min-h-[70svh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="display text-title text-balance">{d.product.notFound.title}</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">{d.product.notFound.body}</p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={localePath(locale, "/collection")}
            className="inline-flex h-12 items-center rounded-xs bg-fg px-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent hover:text-accent-fg rtl:text-sm rtl:normal-case rtl:tracking-normal"
          >
            {d.product.notFound.cta}
          </Link>
          <WhatsAppButton variant="outline" label={d.whatsapp.speak} />
        </div>
      </div>
    );
  }

  const related = await getRelatedProducts(product.id, product.categorySlug, locale, 3);

  const crumbs = [
    { name: d.nav.home, href: localePath(locale, "/") },
    { name: d.collection.title, href: localePath(locale, "/collection") },
    { name: product.categoryName, href: localePath(locale, `/collection?category=${product.categorySlug}`) },
  ];

  return (
    <>
      <ProductViewTracker productId={product.id} />

      <div className="shell pt-28 sm:pt-32">
        <nav aria-label={d.a11y.breadcrumb} className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <Link href={crumb.href} className="transition-colors hover:text-fg">
                  {crumb.name}
                </Link>
                <ChevronRight className="size-3 flip-rtl text-subtle" strokeWidth={1.5} aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="text-fg">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Title block — set above the fold so the piece is named before the
            configurator asks anything of the customer. */}
        <header className="mb-12 max-w-4xl">
          <p className="eyebrow mb-4">{product.categoryName}</p>
          <h1 className="display text-display text-balance">{product.name}</h1>
          {product.tagline ? (
            <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">{product.tagline}</p>
          ) : null}
        </header>

        <ProductExperience product={product} />
      </div>

      {/* Description + specification */}
      <div className="shell mt-20 sm:mt-28">
        <div className="grid gap-12 border-t border-line pt-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="eyebrow mb-6">{d.product.overview}</h2>
            </Reveal>
            {product.description ? (
              <Reveal delay={60}>
                <p className="text-lead leading-relaxed text-fg/85">{product.description}</p>
              </Reveal>
            ) : null}

            {product.features.length > 0 ? (
              <Reveal delay={120} className="mt-10">
                <h3 className="eyebrow mb-5">{d.product.features}</h3>
                <ul className="flex flex-col gap-3.5">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-3.5 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {product.materials.length > 0 ? (
              <Reveal delay={160} className="mt-10">
                <h3 className="eyebrow mb-5">{d.product.materials}</h3>
                <ul className="flex flex-col divide-y divide-line border-y border-line">
                  {product.materials.map((material) => (
                    <li key={material.id} className="py-4">
                      <p className="text-sm text-fg">{material.name}</p>
                      {material.description ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{material.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <div>
            {product.specs.length > 0 ? (
              <Reveal>
                <h2 className="eyebrow mb-6">{d.product.specifications}</h2>
                <dl className="flex flex-col divide-y divide-line border-y border-line">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-6 py-4">
                      <dt className="shrink-0 text-sm text-muted">{spec.label}</dt>
                      <dd className="text-end text-sm text-fg">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            <Reveal delay={80} className="mt-10">
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.availability}</dt>
                  <dd className="text-sm text-fg">{d.product.availabilityStates[product.availability]}</dd>
                </div>
                {product.leadTimeDays ? (
                  <div className="border-t border-line pt-4">
                    <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.leadTime}</dt>
                    <dd className="text-sm text-fg tabular-nums">
                      {d.product.leadTimeDays.replace("{days}", String(product.leadTimeDays))}
                    </dd>
                  </div>
                ) : null}
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.segmentLabel}</dt>
                  <dd className="text-sm text-fg">{d.product.segments[product.segment]}</dd>
                </div>
                {product.sku ? (
                  <div className="border-t border-line pt-4">
                    <dt className="eyebrow mb-2 text-[0.5625rem]">SKU</dt>
                    <dd className="text-sm text-fg tabular-nums">{product.sku}</dd>
                  </div>
                ) : null}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="section">
          <div className="shell">
            <SectionHeader
              eyebrow={d.collection.eyebrow}
              title={d.product.related}
              cta={{ href: localePath(locale, "/collection"), label: d.nav.allProducts }}
              className="mb-14"
            />
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.id} delay={index * 90}>
                  <ProductCard product={item} index={index} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={[
          productSchema({
            locale,
            name: product.name,
            description: product.metaDescription ?? product.tagline ?? product.description ?? product.name,
            slug: product.slug,
            images: product.images.map((image) => absoluteUrl(image.url)),
            category: product.categoryName,
            price: product.showPrice ? product.price : null,
            currency: product.currency,
            availability: product.availability,
            materials: product.materials.map((material) => material.name),
          }),
          breadcrumbSchema([
            ...crumbs.map((crumb) => ({ name: crumb.name, url: absoluteUrl(crumb.href) })),
            { name: product.name, url: absoluteUrl(`/${locale}/collection/${product.slug}`) },
          ]),
        ]}
      />
    </>
  );
}
