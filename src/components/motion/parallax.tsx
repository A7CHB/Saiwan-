"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Vertical parallax driven by a single rAF-throttled scroll listener.
 *
 * Deliberately conservative: `speed` is a fraction of the element's own height,
 * transforms are composited-only, and the whole effect is skipped for
 * reduced-motion users and on coarse pointers where it costs more than it adds.
 */
export function Parallax({
  children,
  speed = 0.12,
  className,
  disabled = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || disabled || prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let inView = false;

    const update = () => {
      frame = 0;
      if (!inView) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // -1 when the element is just below the fold, +1 when just above it.
      const progress = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2);
      node.style.transform = `translate3d(0, ${(progress * speed * rect.height).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(node);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      node.style.transform = "";
    };
  }, [speed, disabled]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/**
 * Pointer-following displacement — the "magnetic" feel on primary buttons.
 * Applies to the wrapper only, so the label stays crisp and no layout is
 * recalculated. Pointer-fine only; taps get nothing, which is correct.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let target = { x: 0, y: 0 };

    const render = () => {
      frame = 0;
      node.style.transform = `translate3d(${target.x.toFixed(2)}px, ${target.y.toFixed(2)}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      target = {
        x: (event.clientX - (rect.left + rect.width / 2)) * strength,
        y: (event.clientY - (rect.top + rect.height / 2)) * strength,
      };
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      target = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(render);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={cn("inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", className)}
    >
      {children}
    </div>
  );
}
