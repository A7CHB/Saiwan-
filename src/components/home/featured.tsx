import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";

/**
 * Featured pieces, laid out editorially rather than as a uniform grid.
 *
 * The lead piece is set large and offset; the rest fall into a staggered
 * three-up beneath it, each column nudged vertically so the eye travels
 * diagonally instead of scanning rows. With fewer than three products the
 * layout degrades to a plain row rather than leaving holes.
 */
export function FeaturedCollection({
  d,
  locale,
  products,
}: {
  d: Dictionary;
  locale: Locale;
  products: ProductCardModel[];
}) {
  if (products.length === 0) return null;

  const [lead, ...rest] = products;
  const stagger = ["lg:mt-0", "lg:mt-16", "lg:mt-8"];

  return (
    <section className="section bg-sunken">
      <div className="shell">
        <SectionHeader
          eyebrow={d.home.featured.eyebrow}
          title={d.home.featured.title}
          body={d.home.featured.body}
          cta={{ href: localePath(locale, "/collection"), label: d.home.featured.cta }}
          className="mb-16 lg:mb-20"
        />

        {/* Lead piece — the image column is held to the smaller share of the
            grid so a 4:5 plate never grows taller than the viewport on a wide
            desktop, and the copy sits centred against it rather than dropping
            to the baseline and leaving a void. */}
        <Reveal kind="rise" className="mb-16 lg:mb-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <ProductCard product={lead} size="large" priority index={0} showTagline={false} />

            <div>
              <p className="eyebrow mb-5">{d.common.featured}</p>
              <p className="display text-title leading-[1.15] text-balance">
                {lead.tagline ?? d.home.featured.body}
              </p>

              <dl className="mt-9 grid max-w-xl gap-x-10 gap-y-5 sm:grid-cols-2">
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.segmentLabel}</dt>
                  <dd className="text-sm text-muted">{d.product.segments[lead.segment]}</dd>
                </div>
                {lead.coverageM2 ? (
                  <div className="border-t border-line pt-4">
                    <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.coverage}</dt>
                    <dd className="text-sm text-muted tabular-nums">{lead.coverageM2} m²</dd>
                  </div>
                ) : null}
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow mb-2 text-[0.5625rem]">{d.collection.style}</dt>
                  <dd className="text-sm text-muted">{d.product.styles[lead.style]}</dd>
                </div>
                <div className="border-t border-line pt-4">
                  <dt className="eyebrow mb-2 text-[0.5625rem]">{d.product.availability}</dt>
                  <dd className="text-sm text-muted">{d.product.availabilityStates[lead.availability]}</dd>
                </div>
              </dl>

              <Link
                href={localePath(locale, `/collection/${lead.slug}`)}
                className="group mt-9 inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-fg transition-colors hover:text-accent rtl:text-sm rtl:normal-case rtl:tracking-normal"
              >
                <span className="link-underline">{d.common.viewProduct}</span>
                <ArrowRight
                  className="size-3.5 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </Reveal>

        {rest.length > 0 ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 3).map((product, index) => (
              <Reveal key={product.id} delay={index * 110} className={stagger[index % stagger.length]}>
                <ProductCard product={product} index={index + 1} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
