"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { useFavorites } from "@/components/product/favorites-provider";
import { cn } from "@/lib/utils";

/**
 * Save / unsave a piece.
 *
 * Reads its state from `FavoritesProvider`, which the server seeded — this
 * component makes no request until someone actually clicks it. A signed-out
 * visitor is sent to the account page with a redirect back, rather than being
 * blocked by a modal mid-browse.
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
  const { d, href } = useLocale();
  const { has, toggle, signedIn } = useFavorites();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const active = has(productId);

  const onClick = async () => {
    if (!signedIn) {
      startTransition(() => router.push(href(`/account?redirect=/collection/`)));
      return;
    }

    const result = await toggle(productId);
    if (result === "unauthorized") {
      // The session expired while the page was open.
      startTransition(() => router.push(href("/account")));
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? d.product.removeFromFavorites : d.product.saveToFavorites}
      title={signedIn ? (active ? d.product.removeFromFavorites : d.product.saveToFavorites) : d.product.signInToSave}
      className={cn(
        "flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50",
        withLabel
          ? "h-12 px-5 text-[0.75rem] uppercase tracking-[0.14em] rtl:normal-case rtl:tracking-normal"
          : "size-9",
        tone === "overlay" ? "glass-dark text-white" : "border border-line-strong text-fg hover:border-fg",
        active && tone === "overlay" && "bg-accent/90 text-accent-fg",
        active && tone === "default" && "border-accent text-accent",
        pending && "opacity-60",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform duration-300", active && "scale-110 fill-current")}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {withLabel ? <span>{active ? d.product.removeFromFavorites : d.product.saveToFavorites}</span> : null}
    </button>
  );
}
