import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/stage";

/**
 * Three featured pieces, one row.
 *
 * This was an editorial arrangement — a large lead piece with its
 * specification beside it, then a staggered pair — which read well but cost
 * two full screens of scroll for three products. A home page's job here is to
 * make someone open the collection, and a plain row does that in half the
 * height. The specification belongs on the product page, where it is read.
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

  return (
    <section className="section bg-sunken">
      <div className="shell">
        <SectionHeader
          eyebrow={d.home.featured.eyebrow}
          title={d.home.featured.title}
          cta={{ href: localePath(locale, "/collection"), label: d.home.featured.cta }}
          className="mb-10 lg:mb-12"
        />

        {/* One row on every screen. Below `lg` it scrolls sideways with snap
            points instead of stacking: three plates down a phone is two extra
            screens of scroll, and a peeking edge says "there is more" better
            than a stack does.

            The row reveals as one block rather than card by card — a card past
            the container's edge never crosses the observer's threshold, so it
            would stay invisible until you scrolled to a blank space. */}
        <Reveal
          as="ul"
          kind="fade"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 no-scrollbar sm:gap-8 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
        >
          {products.slice(0, 3).map((product, index) => (
            <li key={product.id} className="w-[74%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
              {/* Each plate is an object standing in space rather than a flat
                  card: it turns to face the pointer. */}
              <Tilt max={5}>
                <ProductCard product={product} index={index} priority={index === 0} showTagline={false} />
              </Tilt>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
