"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fine = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * A 3D stage.
 *
 * Not a scrubbed video and not a stack of hand-tuned parallax speeds: the stage
 * is a real perspective volume, its children stand at real distances inside it
 * (`Plane`, via `--z`), and the only things that change are the camera's
 * position and angle. Separation between the planes is then the projection's
 * doing, which is why near objects overtake far ones correctly and why the
 * angle of a rib changes as you move rather than the whole picture sliding.
 *
 * Two inputs drive the camera, both written as custom properties on the stage
 * so a single rAF write per frame re-lays out everything inside it:
 *
 *   --t     0 → 1, the stage's travel through the viewport (scroll)
 *   --yaw   -1 → 1, pointer offset from the centre, horizontally
 *   --pitch -1 → 1, the same vertically
 *
 * Reduced motion disables all of it, and coarse pointers keep the scroll axis
 * but drop the pointer axis — a thumb has no hover, and a phone gyro effect
 * costs battery for nothing.
 */
export function Stage({
  children,
  as: Tag = "div",
  perspective = 1100,
  className,
  style,
  /** Degrees of camera yaw/pitch at full pointer deflection. */
  swing = 3,
}: {
  children: ReactNode;
  as?: ElementType;
  perspective?: number;
  className?: string;
  style?: CSSProperties;
  swing?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced()) return;

    const pointer = fine();
    let frame = 0;
    let inView = true;
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;

    const write = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 while the stage sits at the top of the viewport, 1 once it has
      // travelled a full screen upward. Clamped so nothing runs away.
      const t = Math.min(1, Math.max(0, -rect.top / Math.max(1, viewport)));
      node.style.setProperty("--t", t.toFixed(4));

      if (pointer) {
        // Ease toward the pointer rather than snapping: the camera has mass.
        yaw += (targetYaw - yaw) * 0.08;
        pitch += (targetPitch - pitch) * 0.08;
        node.style.setProperty("--yaw", yaw.toFixed(4));
        node.style.setProperty("--pitch", pitch.toFixed(4));
        if (Math.abs(targetYaw - yaw) > 0.001 || Math.abs(targetPitch - pitch) > 0.001) {
          frame = requestAnimationFrame(write);
        }
      }
    };

    const schedule = () => {
      if (!frame && inView) frame = requestAnimationFrame(write);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetYaw = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) || 0;
      targetPitch = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) || 0;
      schedule();
    };

    const onPointerLeave = () => {
      targetYaw = 0;
      targetPitch = 0;
      schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(node);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    if (pointer) {
      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerleave", onPointerLeave);
    }
    write();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [swing]);

  return (
    <Tag
      ref={ref}
      className={cn("stage", className)}
      style={
        {
          perspective: `${perspective}px`,
          "--swing": `${swing}deg`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/**
 * One plane inside a `Stage`, standing `z` pixels from the camera.
 *
 * `lift` is how far the plane travels vertically over the stage's scroll
 * range — the deliberate part of the composition, on top of the parallax the
 * perspective already gives for free. Planes are scaled to compensate for their
 * distance so the frame stays filled at every depth.
 */
export function Plane({
  children,
  z = 0,
  lift = 0,
  className,
  style,
}: {
  children: ReactNode;
  z?: number;
  /** Pixels of travel across the stage's scroll range; negative moves up. */
  lift?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("plane", className)}
      style={
        {
          "--z": `${z}px`,
          "--lift": `${lift}px`,
          // A plane at -600px would otherwise shrink; this puts it back to the
          // size it would have been at z = 0 for the default perspective.
          "--fill": String(1 + Math.max(0, -z) / 1200),
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/**
 * A single object that tilts toward the pointer in 3D.
 *
 * Used on the featured plates: the card is a thing standing in space, so it
 * turns to face you rather than sliding under a gloss overlay. Pointer-fine
 * only, and the rotation is small enough that type never distorts.
 */
export function Tilt({
  children,
  max = 6,
  className,
}: {
  children: ReactNode;
  /** Maximum rotation in degrees on either axis. */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced() || !fine()) return;

    let frame = 0;
    let rx = 0;
    let ry = 0;

    const render = () => {
      frame = 0;
      node.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      node.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      ry = x * max;
      rx = -y * max;
      node.dataset.tilting = "true";
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      rx = 0;
      ry = 0;
      delete node.dataset.tilting;
      if (!frame) frame = requestAnimationFrame(render);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt", className)}>
      {children}
    </div>
  );
}
