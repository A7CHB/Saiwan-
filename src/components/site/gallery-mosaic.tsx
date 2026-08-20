"use client";

import { useEffect, useRef, useState } from "react";
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

  // Matches the featured row exactly, so the two read as siblings.
  const tileClass = "w-[74%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]";

  const spanClass = (span: GalleryView["span"]) =>
    span === "WIDE"
      ? "sm:col-span-2 aspect-4/3"
      : span === "TALL"
        ? "row-span-2 aspect-3/4 sm:aspect-auto"
        : "aspect-square";

  // Each tile's rotation comes from where it sits in the row, so scrolling the
  // row swings the frames past the camera instead of sliding a flat strip. One
  // rAF-throttled listener writes one custom property per tile.
  const rowRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const write = () => {
      frame = 0;
      const box = row.getBoundingClientRect();
      const centre = box.left + box.width / 2;
      for (const tile of Array.from(row.children) as HTMLElement[]) {
        const rect = tile.getBoundingClientRect();
        // -1 at the left edge of the row, +1 at the right.
        const offset = (rect.left + rect.width / 2 - centre) / (box.width / 2 || 1);
        tile.style.setProperty("--swing", Math.max(-1, Math.min(1, offset)).toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    row.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    write();
    return () => {
      row.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scroller, items.length]);

  const step = (delta: number) => {
    setOpenIndex((current) => {
      if (current === null) return null;
      return (current + delta + items.length) % items.length;
    });
  };

  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      {/* The scrolling row reveals as one block. Revealing tile by tile looks
          right in a grid, but in a horizontal row anything past the container's
          edge never crosses the observer's threshold, so it stays at opacity 0
          — you scroll sideways to a column of blank frames. */}
      <Reveal
        as="ul"
        ref={rowRef}
        kind="fade"
        className={cn(
          scroller
            ? "row-3d flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 no-scrollbar sm:gap-8"
            : cn("grid auto-rows-auto grid-cols-2 gap-2 sm:gap-3", dense ? "lg:grid-cols-4" : "lg:grid-cols-3"),
          className,
        )}
      >
        {items.map((item, index) => {
          const frame = (
            <>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className={cn(
                  "frame frame-zoom text-start",
                  scroller ? "relative block w-full" : "absolute inset-0 size-full",
                )}
                style={scroller ? { aspectRatio: "4 / 3" } : undefined}
                aria-label={item.caption ?? item.alt ?? d.inspiration.title}
              >
                <Media
                  src={item.url}
                  alt={item.alt || item.caption || ""}
                  sizes={
                    scroller
                      ? "(max-width: 640px) 74vw, (max-width: 1024px) 46vw, 31vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  }
                  className="absolute inset-0 size-full"
                />

                <span className="pointer-events-none absolute inset-0 scrim opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {/* In the row the caption is set under the frame instead, so
                      only the expand affordance is drawn over the image. */}
                  <span className="min-w-0">
                    {!scroller && item.caption ? (
                      <span className="block truncate text-sm text-white">{item.caption}</span>
                    ) : null}
                    {!scroller && item.location ? (
                      <span className="mt-0.5 block truncate text-[0.6875rem] uppercase tracking-[0.16em] text-white/60 rtl:normal-case rtl:tracking-normal">
                        {item.location}
                      </span>
                    ) : null}
                  </span>
                  <Expand className="size-4 shrink-0 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>

              {/* Caption under the frame, always visible — the same shape as the
                  product cards in the row above it, and the only version a touch
                  device ever sees. */}
              {scroller && (item.caption || item.location) ? (
                <div className="mt-4">
                  {item.location ? <p className="eyebrow mb-1.5 text-[0.5625rem]">{item.location}</p> : null}
                  {item.caption ? <p className="display text-[1.375rem] leading-tight">{item.caption}</p> : null}
                </div>
              ) : null}
            </>
          );

          return (
            <li
              key={item.id}
              className={cn("group relative", scroller ? cn("tile-3d", tileClass) : spanClass(item.span))}
            >
              {frame}
            </li>
          );
        })}
      </Reveal>

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
