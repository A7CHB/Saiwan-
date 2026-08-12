"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCompare } from "@/components/product/compare-provider";
import { useLocale } from "@/components/i18n/locale-provider";
import { Media } from "@/components/ui/media";
import { cn } from "@/lib/utils";

type Preview = { id: string; name: string; image: string | null; slug: string };

/**
 * Slides up from the bottom edge once a piece is added. Sits above the
 * WhatsApp bubble's row on mobile by leaving the end corner clear.
 */
export function CompareTray() {
  const { ids, remove, clear, limit } = useCompare();
  const { d, href } = useLocale();
  const [items, setItems] = useState<Preview[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/products/preview?ids=${ids.join(",")}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { products: [] }))
      .then((data: { products: Preview[] }) => setItems(data.products ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, [ids]);

  const open = ids.length > 0;

  return (
    <div
      data-print-hide
      aria-hidden={!open}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="shell pb-4 pe-24 sm:pe-32">
        <div className="glass flex items-center gap-4 border border-line p-3 shadow-[0_-10px_40px_-16px_rgb(var(--shadow-color)/0.35)]">
          <p className="eyebrow hidden shrink-0 ps-2 text-[0.5625rem] sm:block">
            {d.product.compareTitle} {ids.length}/{limit}
          </p>

          <ul className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {items.map((item) => (
              <li key={item.id} className="relative shrink-0">
                <Link href={href(`/collection/${item.slug}`)} className="block">
                  <Media src={item.image} alt={item.name} className="size-14" sizes="56px" />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`${d.product.compareRemove}: ${item.name}`}
                  className="absolute -end-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-line bg-elevated text-muted transition-colors hover:text-fg"
                >
                  <X className="size-3" strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={clear}
              className="px-2 text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg rtl:text-xs rtl:normal-case rtl:tracking-normal"
            >
              {d.common.clear}
            </button>
            <Link
              href={href(`/compare?ids=${ids.join(",")}`)}
              className="inline-flex h-10 items-center rounded-xs bg-fg px-5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent hover:text-accent-fg rtl:text-xs rtl:normal-case rtl:tracking-normal"
            >
              {d.product.compare}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
