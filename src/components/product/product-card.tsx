"use client";

import Link from "next/link";
import { ArrowRight, GitCompare } from "lucide-react";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCompare } from "@/components/product/compare-provider";
import { Media } from "@/components/ui/media";
import { formatPrice } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

/**
 * The catalogue's repeating unit — an editorial plate, not a boxed card.
 *
 * There is no border, no shadow and no fill: the photograph is the object and
 * everything else is caption. Hover lifts the image very slightly and draws a
 * rule under the name; the utility controls only materialise on hover (and are
 * always reachable by keyboard).
 */
export function ProductCard({
  product,
  priority = false,
  size = "default",
  index = 0,
  showTagline = true,
}: {
  product: ProductCardModel;
  priority?: boolean;
  size?: "default" | "large" | "compact";
  index?: number;
  /** Off where the surrounding layout already sets the tagline as a pull-quote. */
  showTagline?: boolean;
}) {
  const { d, href, locale } = useLocale();
  const { has, toggle, isFull } = useCompare();
  const inCompare = has(product.id);

  const ratio = size === "large" ? "4 / 5" : size === "compact" ? "1 / 1" : "3 / 4";
  const sizes =
    size === "large"
      ? "(max-width: 768px) 100vw, 50vw"
      : size === "compact"
        ? "(max-width: 640px) 50vw, 220px"
        : "(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 26vw";

  return (
    <article className="group relative">
      <Link href={href(`/collection/${product.slug}`)} className="block focus-visible:outline-offset-4">
        <div className="frame frame-zoom relative" style={{ aspectRatio: ratio }}>
          <Media
            src={product.image}
            alt={product.imageAlt}
            sizes={sizes}
            priority={priority}
            className="absolute inset-0 size-full"
          />

          {/* Corner badges — status the customer needs before clicking. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-col gap-1.5">
              {product.isFeatured ? (
                <span className="glass-dark px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-white rtl:text-[0.6875rem] rtl:normal-case rtl:tracking-normal">
                  {d.common.featured}
                </span>
              ) : null}
              {product.availability === "MADE_TO_ORDER" ? (
                <span className="glass-dark px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-white rtl:text-[0.6875rem] rtl:normal-case rtl:tracking-normal">
                  {d.product.availabilityStates.MADE_TO_ORDER}
                </span>
              ) : null}
            </div>
          </div>

          {/* Read-more affordance, revealed on hover only. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 scrim p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="inline-flex items-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-white rtl:text-xs rtl:normal-case rtl:tracking-normal">
              {d.common.viewProduct}
              <ArrowRight className="size-3.5 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>

      {/* The compare control sits outside the link so it is independently
          focusable. */}
      <div className="absolute end-3 top-3 opacity-0 transition-opacity duration-500 focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
        <button
          type="button"
          onClick={() => toggle(product.id)}
          disabled={!inCompare && isFull}
          title={inCompare ? d.product.compareRemove : isFull ? d.product.compareFull : d.product.compareAdd}
          aria-label={inCompare ? d.product.compareRemove : d.product.compareAdd}
          aria-pressed={inCompare}
          className={cn(
            "glass-dark flex size-9 items-center justify-center text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40",
            inCompare && "bg-accent/90 text-accent-fg",
          )}
        >
          <GitCompare className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1.5 text-[0.5625rem]">{product.categoryName}</p>
          <h3 className="display text-[1.375rem] leading-tight">
            <Link href={href(`/collection/${product.slug}`)} className="link-underline">
              {product.name}
            </Link>
          </h3>
          {showTagline && product.tagline ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.tagline}</p>
          ) : null}
        </div>

        <p className="shrink-0 pt-5 text-sm text-muted tabular-nums">
          {product.showPrice && product.price != null
            ? `${d.common.from} ${formatPrice(product.price, locale, product.currency)}`
            : d.common.priceOnRequest}
        </p>
      </div>

      {/* Hairline index marker — a quiet editorial detail, decorative only. */}
      <div aria-hidden="true" className="mt-4 flex items-center gap-3">
        <span className="text-[0.625rem] tabular-nums text-subtle">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px flex-1 origin-[left_center] scale-x-0 bg-line-strong transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 rtl:origin-[right_center]" />
      </div>
    </article>
  );
}
