"use client";

import { Heart } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { useFavorites } from "@/components/product/favorites-provider";
import { cn } from "@/lib/utils";

/**
 * Save / unsave a piece.
 *
 * One click, no account, no request — the shortlist lives on the device. Until
 * localStorage has been read the button renders in its unsaved state and is
 * marked busy, which is a few hundred milliseconds at most and avoids claiming
 * something is unsaved when it is not.
 */
export function FavoriteButton({
  productId,
  tone = "default",
  withLabel = false,
  className,
}: {
  productId: string;
  tone?: "default" | "overlay";
  withLabel?: boolean;
  className?: string;
}) {
  const { d } = useLocale();
  const { has, toggle, ready } = useFavorites();

  const active = ready && has(productId);
  const label = active ? d.product.removeFromFavorites : d.product.saveToFavorites;

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-busy={!ready}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center justify-center gap-2 transition-colors duration-300",
        withLabel
          ? "h-12 px-5 text-[0.75rem] uppercase tracking-[0.14em] rtl:normal-case rtl:tracking-normal"
          : "size-9",
        tone === "overlay" ? "glass-dark text-white" : "border border-line-strong text-fg hover:border-fg",
        active && tone === "overlay" && "bg-accent/90 text-accent-fg",
        active && tone === "default" && "border-accent text-accent",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-300", active && "scale-110 fill-current")}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {withLabel ? <span>{label}</span> : null}
    </button>
  );
}
