"use client";

import { Fragment, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealKind = "rise" | "fade" | "mask" | "scale-x" | "image" | "depth";

/**
 * Scroll-triggered reveal.
 *
 * The visual work is entirely CSS (see the `[data-reveal]` block in
 * globals.css); this component only decides *when* to flip `data-visible`. That
 * keeps the animation off the main thread and means the reduced-motion media
 * query can neutralise it without any JavaScript branching.
 *
 * It reveals once and then disconnects — repeating reveals on scroll-up read as
 * a gimmick rather than as craft.
 */
export function Reveal({
  children,
  as: Tag = "div",
  ref: forwarded,
  kind = "rise",
  delay = 0,
  threshold = 0.18,
  rootMargin = "0px 0px -8% 0px",
  className,
  ...rest
}: {
  /** Optional — a Reveal is also used as a bare animated rule with no content. */
  children?: ReactNode;
  as?: ElementType;
  kind?: RevealKind;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  /** Forwarded so a caller can measure the element it just animated. */
  ref?: React.RefObject<HTMLElement | null>;
} & Record<string, unknown>) {
  const own = useRef<HTMLElement>(null);
  const ref = forwarded ?? own;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer (very old browsers, or JSDOM): show the content immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Already in view on mount — reveal on the next frame so the transition runs.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      data-reveal={kind}
      data-visible={visible ? "true" : "false"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline reveal: each word rises out of its own clipping box, staggered.
 * Words (not letters) — letter-by-letter reads as a tech demo and breaks
 * screen-reader word boundaries. The full string is exposed to assistive tech
 * via aria-label while the visual spans are hidden from it.
 */
export function RevealText({
  text,
  className,
  wordClassName,
  as: Tag = "span",
  stagger = 55,
  delay = 0,
  accentFrom,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  as?: ElementType;
  stagger?: number;
  delay?: number;
  /** Index from which words switch to the accent colour. */
  accentFrom?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} aria-label={text} data-visible={visible ? "true" : "false"}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {/* The clipping box wraps ink only — the inter-word space sits
              outside it, otherwise `overflow: hidden` collapses it. */}
          <span className="text-reveal" aria-hidden="true">
            <span
              className={cn(wordClassName, accentFrom !== undefined && index >= accentFrom && "text-accent")}
              style={{ "--word-delay": `${delay + index * stagger}ms` } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? <span aria-hidden="true"> </span> : null}
        </Fragment>
      ))}
    </Tag>
  );
}
