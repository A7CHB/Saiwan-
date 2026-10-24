import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";

/**
 * Shade structures — car parks, tensile roofs and the rest of the built-to-
 * measure range — given their own place on the home page, after the umbrella
 * collection rather than inside it.
 *
 * The cards are the catalogue's own, so a wide site photograph keeps its shape
 * here exactly as it does in the collection. Every structure category that has
 * something to show gets a link beneath, so the section grows with the range
 * without being edited.
 */
export function StructuresShowcase({
  d,
  locale,
  products,
  categories,
}: {
  d: Dictionary;
  locale: Locale;
  products: ProductCardModel[];
  categories: { slug: string; name: string }[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="section" aria-labelledby="structures-heading">
      <div className="shell">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <p className="eyebrow mb-5">{d.home.structures.eyebrow}</p>
          <h2 id="structures-heading" className="display text-title text-balance">
            {d.home.structures.title}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{d.home.structures.body}</p>
        </div>

        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {products.map((product, index) => (
            <Reveal as="li" key={product.id} delay={(index % 2) * 90}>
              <ProductCard product={product} index={index} />
            </Reveal>
          ))}
        </ul>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={localePath(locale, `/collection?category=${category.slug}`)}
                className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-accent rtl:text-sm rtl:normal-case rtl:tracking-normal"
              >
                <span className="link-underline">{category.name}</span>
                <ArrowRight
                  className="size-3.5 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
