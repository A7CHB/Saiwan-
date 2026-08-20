"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/locale-provider";
import { CanopyMark } from "@/components/icons/canopy";

/**
 * Every photograph on the site goes through here.
 *
 * Three states are handled explicitly rather than left to the browser:
 * loading (a warm shimmer in the frame's own colour), loaded (a soft scale-in
 * so images arrive rather than pop) and broken (the canopy motif with a
 * translated label, so a dead URL reads as a placeholder rather than a bug).
 *
 * The arrival is a CSS animation, deliberately, and this matters more than it
 * looks. It used to be a React state: the image rendered at `opacity: 0` and
 * became visible when `onLoad` set state to "ready". That makes every image on
 * the site invisible until the client bundle hydrates — and if hydration never
 * happens, which is a blocked chunk, a slow connection, an extension, a browser
 * that chokes on the bundle, or JavaScript simply being off, *nothing on the
 * site is ever visible*. The markup was always correct; it was painted
 * transparent. An animation runs without JavaScript, so the image is visible
 * whatever the script does, and `onLoad` is left to do the one thing only
 * JavaScript can: notice that a URL is dead.
 */
export function Media({
  src,
  alt,
  className,
  imgClassName,
  fill = true,
  sizes = "100vw",
  priority,
  quality = 82,
  ratio,
  objectPosition,
  unoptimized,
  transparent = false,
  ...rest
}: Omit<ImageProps, "src" | "alt" | "fill" | "className"> & {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
  ratio?: string;
  objectPosition?: string;
  /** Skip the image optimiser. See the hero for the one reason to. */
  unoptimized?: boolean;
  /**
   * The image is a cut-out with real transparency.
   *
   * Suppresses the frame's fill and its loading shimmer, both of which would
   * otherwise paint a grey rectangle in the shape of the frame — behind the
   * subject, but in front of whatever the cut-out is standing in.
   */
  transparent?: boolean;
}) {
  const { d } = useLocale();
  const [state, setState] = useState<"loading" | "ready" | "error">(src ? "loading" : "error");

  return (
    <div
      className={cn("frame", transparent && "bg-transparent", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-state={state}
    >
      {/* Behind the image, not in place of it: an image that has not painted
          yet shows the shimmer through, and one that has covers it. */}
      {state === "loading" && !transparent ? (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      ) : null}

      {state === "error" || !src ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sunken text-subtle"
          role="img"
          aria-label={alt || d.error.imageAlt}
        >
          <CanopyMark className="size-10 opacity-25" aria-hidden="true" />
          <span className="eyebrow text-[0.5625rem]">{d.error.imageAlt}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          quality={quality}
          // The generated brand plates are SVG: they are already tiny and
          // resolution-independent, so routing them through the optimiser
          // would cost a request and gain nothing.
          unoptimized={unoptimized ?? src.endsWith(".svg")}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={cn("object-cover media-in", imgClassName)}
          style={objectPosition ? { objectPosition } : undefined}
          {...rest}
        />
      )}
    </div>
  );
}
