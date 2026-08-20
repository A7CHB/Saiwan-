import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { ProductCard } from "@/lib/data/products";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

/**
 * The collection, set as an editorial spread rather than a grid of cards.
 *
 * Three pieces on an asymmetric measure: a tall lead, a smaller piece dropped
 * below it, and a wide plate that runs to the end of the shell. The rhythm is
 * the point — a row of three equal boxes is a catalogue, and the catalogue
 * already exists one click away.
 *
 * A server component. Every link goes to the existing product page; nothing is
 * duplicated here.
 */
export function CollectionEditorial({
  d,
  locale,
  products,
}: {
  d: Dictionary;
  locale: Locale;
  products: ProductCard[];
}) {
  if (products.length === 0) return null;

  const shown = products.slice(0, 3);
  // Each piece gets its own measure and offset, so the column edges never line
  // up into a grid.
  const layout = [
    { span: "lg:col-span-6", ratio: "4 / 5", offset: "", sizes: "(max-width: 1024px) 92vw, 46vw" },
    { span: "lg:col-span-4 lg:col-start-9 lg:mt-28", ratio: "3 / 4", offset: "", sizes: "(max-width: 1024px) 92vw, 30vw" },
    { span: "lg:col-span-12", ratio: "21 / 9", offset: "", sizes: "92vw" },
  ];

  return (
    <section className="section" aria-labelledby="collection-heading">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div className="max-w-xl">
            <p className="eyebrow mb-5">{d.home.collection.eyebrow}</p>
            <h2 id="collection-heading" className="display text-title text-balance">
              {d.home.collection.title}
            </h2>
          </div>
          <Link
            href={localePath(locale, "/collection")}
            className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-accent rtl:text-sm rtl:normal-case rtl:tracking-normal"
          >
            <span className="link-underline">{d.home.collection.cta}</span>
            <ArrowRight
              className="size-3.5 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          {shown.map((product, index) => {
            const style = layout[index] ?? layout[0];
            return (
              <Reveal as="li" key={product.id} kind="fade" className={cn(style.span, style.offset)}>
                <Link href={localePath(locale, `/collection/${product.slug}`)} className="group block">
                  <div className="frame frame-zoom relative" style={{ aspectRatio: style.ratio }}>
                    <Media
                      src={product.image}
                      alt={product.imageAlt}
                      sizes={style.sizes}
                      className="absolute inset-0 size-full"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="eyebrow mb-2 text-[0.5625rem]">{product.categoryName}</p>
                      <h3 className="display text-heading leading-tight transition-colors duration-500 group-hover:text-accent">
                        {product.name}
                      </h3>
                      {product.tagline ? (
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{product.tagline}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 pt-6 text-sm text-muted tabular-nums">
                      {product.showPrice && product.price != null
                        ? `${d.common.from} ${formatPrice(product.price, locale, product.currency)}`
                        : d.common.priceOnRequest}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
