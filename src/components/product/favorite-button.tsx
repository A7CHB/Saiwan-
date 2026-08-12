"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

/**
 * Saving is optimistic — the heart fills instantly and rolls back if the
 * request fails. A signed-out visitor is sent to the account page with a
 * redirect back, rather than being blocked by a modal mid-browse.
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
  const router = useRouter();
  const [saved, setSaved] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/favorites?productId=${productId}`)
      .then((response) => (response.ok ? response.json() : { saved: false }))
      .then((data: { saved: boolean }) => {
        if (!cancelled) setSaved(Boolean(data.saved));
      })
      .catch(() => {
        if (!cancelled) setSaved(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const onClick = async () => {
    const next = !saved;
    setSaved(next);

    try {
      const response = await fetch("/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        setSaved(false);
        startTransition(() => router.push(href(`/account?redirect=/collection`)));
        return;
      }
      if (!response.ok) setSaved(!next);
      else startTransition(() => router.refresh());
    } catch {
      setSaved(!next);
    }
  };

  const active = saved === true;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? d.product.removeFromFavorites : d.product.saveToFavorites}
      title={active ? d.product.removeFromFavorites : d.product.saveToFavorites}
      className={cn(
        "flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50",
        withLabel ? "h-12 px-5 text-[0.75rem] uppercase tracking-[0.14em] rtl:normal-case rtl:tracking-normal" : "size-9",
        tone === "overlay"
          ? "glass-dark text-white"
          : "border border-line-strong text-fg hover:border-fg",
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
