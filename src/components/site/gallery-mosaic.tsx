"use client";

import { useState } from "react";
import { Expand, X } from "lucide-react";
import type { GalleryView } from "@/lib/data/catalog";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/motion/reveal";
import { Dialog } from "@/components/ui/dialog";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

/**
 * The installed-work mosaic, shared by the home page and /inspiration.
 *
 * Tile spans come from the database (`span`), so an admin can compose the
 * rhythm of the wall without touching CSS. Clicking a tile opens a lightbox
 * with ← → navigation; the grid itself stays a plain list for screen readers.
 */
export function GalleryMosaic({
  items,
  dense = false,
  scroller = false,
  className,
}: {
  items: GalleryView[];
  dense?: boolean;
  /** One horizontal row that scrolls, with the next frame peeking at the edge.
   *  Used on the home page: a wall of installed work belongs on /inspiration,
   *  and a row shows more of it than a grid does for a fraction of the height. */
  scroller?: boolean;
  className?: string;
}) {
  const { d, t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const spanClass = (span: GalleryView["span"]) =>
    scroller
      ? "w-[72%] shrink-0 snap-start aspect-4/3 sm:w-[44%] lg:w-[30%]"
      : span === "WIDE"
      ? "sm:col-span-2 aspect-4/3"
      : span === "TALL"
        ? "row-span-2 aspect-3/4 sm:aspect-auto"
        : "aspect-square";

  const step = (delta: number) => {
    setOpenIndex((current) => {
      if (current === null) return null;
      return (current + delta + items.length) % items.length;
    });
  };

  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul
        className={cn(
          scroller
            ? "flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 no-scrollbar sm:gap-3"
            : cn("grid auto-rows-auto grid-cols-2 gap-2 sm:gap-3", dense ? "lg:grid-cols-4" : "lg:grid-cols-3"),
          className,
        )}
      >
        {items.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            delay={(index % 4) * 80}
            kind="image"
            className={cn("group relative", spanClass(item.span))}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="frame frame-zoom absolute inset-0 size-full text-start"
              aria-label={item.caption ?? item.alt ?? d.inspiration.title}
            >
              <Media
                src={item.url}
                alt={item.alt || item.caption || ""}
                sizes={scroller ? "(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 30vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
                className="absolute inset-0 size-full"
              />

              <span className="pointer-events-none absolute inset-0 scrim opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="min-w-0">
                  {item.caption ? (
                    <span className="block truncate text-sm text-white">{item.caption}</span>
                  ) : null}
                  {item.location ? (
                    <span className="mt-0.5 block truncate text-[0.6875rem] uppercase tracking-[0.16em] text-white/60 rtl:normal-case rtl:tracking-normal">
                      {item.location}
                    </span>
                  ) : null}
                </span>
                <Expand className="size-4 shrink-0 text-white/80" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <Dialog
        open={current !== null}
        onClose={() => setOpenIndex(null)}
        label={current?.caption ?? d.inspiration.title}
        variant="full"
        panelClassName="w-full max-w-6xl"
      >
        {current ? (
          <div className="flex h-full flex-col justify-center">
            <div className="relative aspect-4/3 w-full">
              <Media
                src={current.url}
                alt={current.alt || current.caption || ""}
                sizes="90vw"
                quality={90}
                className="absolute inset-0 size-full"
                imgClassName="object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0">
                {current.caption ? <p className="truncate text-sm">{current.caption}</p> : null}
                {current.location ? (
                  <p className="mt-1 truncate text-[0.6875rem] uppercase tracking-[0.16em] text-white/55 rtl:normal-case rtl:tracking-normal">
                    {current.location}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="me-3 text-xs tabular-nums text-white/50">
                  {t(d.product.imageOf, { index: (openIndex ?? 0) + 1, total: items.length })}
                </span>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={d.a11y.previousImage}
                  className="flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <span aria-hidden="true" className="flip-rtl">
                    ←
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={d.a11y.nextImage}
                  className="flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <span aria-hidden="true" className="flip-rtl">
                    →
                  </span>
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpenIndex(null)}
                  aria-label={d.product.zoomClose}
                  className="ms-2 flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
                >
                  <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
