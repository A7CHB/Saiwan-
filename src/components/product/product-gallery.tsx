"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Media } from "@/components/ui/media";
import { Dialog } from "@/components/ui/dialog";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

export type GalleryImage = { id: string; url: string; alt: string; colorId: string | null };

/**
 * Product imagery.
 *
 * Desktop gets a stacked film-strip beside a large plate; mobile gets a
 * snap-scrolling carousel, because a thumbnail rail on a phone wastes the only
 * dimension that matters. Selecting a colourway in the configurator drives
 * `activeId` from the parent, so the picture always agrees with the specification.
 */
export function ProductGallery({
  images,
  activeId,
  onActiveChange,
  productName,
}: {
  images: GalleryImage[];
  activeId?: string | null;
  onActiveChange?: (id: string) => void;
  productName: string;
}) {
  const { d, t, isRtl } = useLocale();
  const [internalId, setInternalId] = useState(images[0]?.id ?? "");
  const [zoomed, setZoomed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const currentId = activeId ?? internalId;
  const index = Math.max(
    0,
    images.findIndex((image) => image.id === currentId),
  );
  const current = images[index] ?? images[0];

  const select = (id: string) => {
    setInternalId(id);
    onActiveChange?.(id);
  };

  const step = (delta: number) => {
    const next = images[(index + delta + images.length) % images.length];
    if (next) select(next.id);
  };

  // Keep the mobile carousel in sync when a colour swatch changes the image.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [index]);

  if (images.length === 0) {
    return <Media src={null} alt={productName} ratio="3 / 4" className="w-full" />;
  }

  return (
    <>
      {/* Mobile: snap carousel */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto"
          onScroll={(event) => {
            const track = event.currentTarget;
            const width = track.clientWidth;
            if (!width) return;
            const nextIndex = Math.round(Math.abs(track.scrollLeft) / width);
            const next = images[nextIndex];
            if (next && next.id !== currentId) setInternalId(next.id);
          }}
        >
          {images.map((image) => (
            <div key={image.id} className="w-full shrink-0 snap-center">
              <Media
                src={image.url}
                alt={image.alt}
                ratio="3 / 4"
                sizes="100vw"
                priority={image.id === images[0].id}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((image, dotIndex) => (
            <button
              key={image.id}
              type="button"
              onClick={() => select(image.id)}
              aria-label={t(d.a11y.goToSlide, { index: dotIndex + 1 })}
              aria-current={dotIndex === index}
              className={cn(
                "h-px w-8 transition-colors duration-300",
                dotIndex === index ? "bg-fg" : "bg-line-strong",
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: film strip + plate */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[5.5rem_1fr]">
        <ul className="flex flex-col gap-3" aria-label={d.product.gallery}>
          {images.map((image, thumbIndex) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => select(image.id)}
                aria-current={thumbIndex === index}
                aria-label={t(d.product.imageOf, { index: thumbIndex + 1, total: images.length })}
                className={cn(
                  "block w-full transition-opacity duration-300",
                  thumbIndex === index ? "opacity-100" : "opacity-45 hover:opacity-80",
                )}
              >
                <Media src={image.url} alt="" ratio="3 / 4" sizes="88px" className="w-full" />
              </button>
            </li>
          ))}
        </ul>

        <div className="group relative">
          {/* All plates stay mounted and cross-fade so switching a colourway
              never shows an empty frame. */}
          <div className="relative aspect-3/4 w-full">
            {images.map((image, plateIndex) => (
              <div
                key={image.id}
                inert={plateIndex !== index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  plateIndex === index ? "opacity-100" : "opacity-0",
                )}
              >
                <Media
                  src={image.url}
                  alt={image.alt}
                  sizes="(max-width: 1280px) 55vw, 45vw"
                  priority={plateIndex === 0}
                  quality={88}
                  className="absolute inset-0 size-full"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={d.product.zoomHint}
            className="glass-dark absolute end-4 top-4 flex size-10 items-center justify-center text-white opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Maximize2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>

          {images.length > 1 ? (
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => step(isRtl ? 1 : -1)}
                aria-label={d.a11y.previousImage}
                className="glass-dark flex size-10 items-center justify-center text-white"
              >
                <ChevronLeft className="size-4 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <span className="glass-dark px-3 py-1.5 text-[0.625rem] tabular-nums text-white">
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => step(isRtl ? -1 : 1)}
                aria-label={d.a11y.nextImage}
                className="glass-dark flex size-10 items-center justify-center text-white"
              >
                <ChevronRight className="size-4 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <Dialog
        open={zoomed}
        onClose={() => setZoomed(false)}
        label={`${productName} — ${d.product.gallery}`}
        variant="full"
        panelClassName="w-full max-w-6xl"
      >
        <div className="flex h-full flex-col justify-center">
          <div className="relative aspect-3/4 max-h-[78vh] w-full">
            <Media
              src={current?.url}
              alt={current?.alt ?? productName}
              sizes="90vw"
              quality={90}
              className="absolute inset-0 size-full"
              imgClassName="object-contain"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={d.a11y.previousImage}
              className="flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
            >
              <ChevronLeft className="size-4 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <span className="px-3 text-xs tabular-nums text-white/70">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={d.a11y.nextImage}
              className="flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
            >
              <ChevronRight className="size-4 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              data-autofocus
              onClick={() => setZoomed(false)}
              aria-label={d.product.zoomClose}
              className="ms-2 flex size-10 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
