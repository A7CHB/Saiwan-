"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Media } from "@/components/ui/media";
import { formatPrice } from "@/lib/i18n/format";
import type { ProductCard } from "@/lib/data/products";
import type { SceneKey } from "@/lib/home-scenes";
import { cn } from "@/lib/utils";

export type ExplorerSpace = {
  key: SceneKey;
  name: string;
  image: string;
  position: string;
  /** The catalogue filter this space opens — `use` on /collection. */
  useCase: string;
  products: ProductCard[];
};

/**
 * Where will yours live?
 *
 * The turn from story into catalogue: the five environments from the showroom,
 * now as a way to choose. Picking one shows the pieces the catalogue already
 * marks as suited to it — this reads `Product.useCases`, the same field the
 * collection filters use, so there is no second list to keep in step.
 *
 * Every space is rendered at once and switched with a class, so choosing costs
 * no request and no layout thrash. The panels are a tab set with real roles,
 * because that is what this is.
 */
export function SpaceExplorer({ spaces }: { spaces: ExplorerSpace[] }) {
  const { d, href, locale } = useLocale();
  const [active, setActive] = useState(0);

  if (spaces.length === 0) return null;
  const current = spaces[active];

  return (
    <section className="section bg-sunken" aria-labelledby="explorer-heading">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{d.home.explorer.eyebrow}</p>
          <h2 id="explorer-heading" className="display text-title text-balance">
            {d.home.explorer.title}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">{d.home.explorer.body}</p>
        </div>

        <div
          role="tablist"
          aria-label={d.home.explorer.title}
          className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-b border-line pb-5"
        >
          {spaces.map((space, index) => {
            const selected = index === active;
            return (
              <button
                key={space.key}
                type="button"
                role="tab"
                id={`space-tab-${space.key}`}
                aria-selected={selected}
                aria-controls={`space-panel-${space.key}`}
                onClick={() => setActive(index)}
                className={cn(
                  "flex items-baseline gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 rtl:text-sm rtl:normal-case rtl:tracking-normal",
                  selected ? "text-fg" : "text-subtle hover:text-muted",
                )}
              >
                <span className="tabular-nums text-[0.5625rem] opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={cn(selected && "link-underline")}>{space.name}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`space-panel-${current.key}`}
          aria-labelledby={`space-tab-${current.key}`}
          className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14"
        >
          <div className="frame relative" style={{ aspectRatio: "4 / 3" }}>
            {/* All five plates stay mounted; switching is opacity, so a space
                the visitor has already seen never reloads. */}
            {spaces.map((space, index) => (
              <Media
                key={space.key}
                src={space.image}
                alt=""
                sizes="(max-width: 1024px) 92vw, 46vw"
                className={cn(
                  "absolute inset-0 size-full transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  index === active ? "opacity-100" : "opacity-0",
                )}
                objectPosition={space.position}
              />
            ))}
          </div>

          <div>
            {current.products.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted">{d.home.explorer.empty}</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {current.products.slice(0, 4).map((product) => (
                  <li key={product.id}>
                    <Link
                      href={href(`/collection/${product.slug}`)}
                      className="group flex items-center gap-5 py-4 transition-colors"
                    >
                      <div className="frame relative size-16 shrink-0">
                        <Media
                          src={product.image}
                          alt=""
                          sizes="64px"
                          className="absolute inset-0 size-full"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="eyebrow mb-1 text-[0.5625rem]">{product.categoryName}</p>
                        <p className="display text-[1.25rem] leading-tight transition-colors duration-300 group-hover:text-accent">
                          {product.name}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm text-muted tabular-nums">
                        {product.showPrice && product.price != null
                          ? formatPrice(product.price, locale, product.currency)
                          : d.common.priceOnRequest}
                      </p>

                      <ArrowRight
                        className="size-4 shrink-0 flip-rtl text-subtle transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={href(`/collection?use=${current.useCase}`)}
              className="mt-8 inline-flex h-12 items-center rounded-xs border border-line-strong px-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
            >
              {d.home.explorer.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
