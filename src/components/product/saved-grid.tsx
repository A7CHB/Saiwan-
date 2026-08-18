"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/locale-provider";
import { useFavorites } from "@/components/product/favorites-provider";
import { ProductCard } from "@/components/product/product-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Reveal } from "@/components/motion/reveal";
import { shortlistPayload } from "@/lib/whatsapp";
import type { ProductCard as ProductCardModel } from "@/lib/data/products";

/**
 * The saved shortlist.
 *
 * The ids live on the device, so the products they refer to have to be fetched
 * after mount — one request for the whole list, not one per card. Ids that no
 * longer resolve (a piece withdrawn from the catalogue since it was saved) are
 * quietly dropped from storage rather than left to fail forever.
 */
export function SavedGrid() {
  const { d, href, locale } = useLocale();
  const { ids, ready, remove, clear } = useFavorites();
  const [products, setProducts] = useState<ProductCardModel[] | null>(null);

  // `remove` changes identity on every render; a ref keeps the pruning effect
  // dependent on the fetched data alone.
  const removeRef = useRef(remove);
  removeRef.current = remove;

  useEffect(() => {
    if (!ready) return;
    if (ids.length === 0) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/products/preview?detail=card&ids=${encodeURIComponent(ids.join(","))}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { products: ProductCardModel[] }) => {
        setProducts(data.products);
        const found = new Set(data.products.map((product) => product.id));
        for (const id of ids) if (!found.has(id)) removeRef.current(id);
      })
      .catch(() => {
        // Offline or a failed request: keep whatever is already on screen.
        setProducts((current) => current ?? []);
      });

    return () => controller.abort();
    // `ids` is a new array each change, but its contents are what matter.
  }, [ready, ids]);

  if (!ready || products === null) {
    return (
      <div className="py-20 text-center text-sm text-muted" role="status">
        {d.saved.loading}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-20 text-center">
        <p className="display text-heading">{d.saved.empty.title}</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">{d.saved.empty.body}</p>
        <Link
          href={href("/collection")}
          className="mt-8 inline-flex h-12 items-center rounded-xs border border-line-strong px-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
        >
          {d.saved.empty.cta}
        </Link>
      </div>
    );
  }

  const canonical =
    typeof window === "undefined" ? undefined : `${window.location.origin}/${locale}/collection`;

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <p className="text-sm text-muted tabular-nums">
          {d.saved.count.replace("{count}", String(products.length))}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <WhatsAppButton
            variant="outline"
            size="sm"
            label={d.saved.sendList}
            payload={shortlistPayload(d, {
              productNames: products.map((product) => product.name),
              url: canonical,
            })}
          />
          <button
            type="button"
            onClick={clear}
            className="link-underline text-sm text-muted transition-colors hover:text-fg"
          >
            {d.saved.clear}
          </button>
        </div>
      </div>

      <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Reveal as="li" key={product.id} delay={(index % 3) * 80}>
            <ProductCard product={product} index={index} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
