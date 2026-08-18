"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, localeMeta, isLocale, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/locale-provider";
import { LOCALE_COOKIE } from "@/lib/constants";

/**
 * Swaps the locale segment in place, so a customer reading a product page in
 * English lands on the same product in Kurdish rather than back at the home
 * page. Query strings (filters, search terms) are preserved for the same reason.
 *
 * The query is read from `window.location` inside the click handler rather than
 * with `useSearchParams()`: this component sits in the header and footer of
 * every page, and that hook would opt all of them out of static rendering.
 */
export function LanguageSwitcher({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { locale, d } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;

    const segments = pathname.split("/");
    if (isLocale(segments[1])) segments[1] = next;
    else segments.splice(1, 0, next);

    const query = window.location.search;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.push(`${segments.join("/")}${query}`);
      router.refresh();
    });
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={d.a11y.languageSwitcher}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 transition-opacity duration-300 hover:opacity-60",
          compact ? "h-10 px-2" : "h-10 px-3 border border-line",
          pending && "opacity-50",
        )}
      >
        <Globe className="size-[18px]" strokeWidth={1.4} aria-hidden="true" />
        <span className="text-[0.6875rem] font-medium tracking-[0.16em]">{localeMeta[locale].short}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={d.common.language}
          // `end-0` keeps the panel inside the viewport in both directions.
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 min-w-44 border border-line bg-elevated py-1.5 shadow-[0_20px_60px_-20px_rgb(var(--shadow-color)/0.35)] animate-rise"
        >
          {locales.map((option) => {
            const selected = option === locale;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  lang={localeMeta[option].htmlLang}
                  dir={localeMeta[option].dir}
                  onClick={() => switchTo(option)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-4 py-2.5 text-start text-sm transition-colors duration-200",
                    selected ? "text-accent" : "text-fg/80 hover:bg-sunken hover:text-fg",
                  )}
                >
                  <span>{localeMeta[option].label}</span>
                  {selected ? <Check className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
