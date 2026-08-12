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
  ...rest
}: Omit<ImageProps, "src" | "alt" | "fill" | "className"> & {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
  ratio?: string;
  objectPosition?: string;
}) {
  const { d } = useLocale();
  const [state, setState] = useState<"loading" | "ready" | "error">(src ? "loading" : "error");

  return (
    <div
      className={cn("frame", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
      data-state={state}
    >
      {state === "loading" ? (
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
          unoptimized={src.endsWith(".svg")}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={cn(
            "object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            state === "ready" ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]",
            imgClassName,
          )}
          style={objectPosition ? { objectPosition } : undefined}
          {...rest}
        />
      )}
    </div>
  );
}
