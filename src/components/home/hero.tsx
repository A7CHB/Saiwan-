"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Media } from "@/components/ui/media";
import { RevealText } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Magnetic } from "@/components/motion/parallax";
import { Stage, Plane } from "@/components/motion/stage";

/**
 * The first frame — a 3D diorama, not a photograph with a parallax speed.
 *
 * Three photographs standing at real distances inside a perspective volume: a
 * terrace at golden hour as the backdrop, the canopy itself in the middle, and
 * the planting along the terrace wall closest to the camera. The last two were
 * shot against a studio background and cut out (see `scripts/hero-photos.mjs`),
 * which is what lets them stand in front of the terrace instead of being part
 * of the same flat picture.
 *
 * Because the depth is real, scrolling and moving the pointer do what a camera
 * does — near planes overtake far ones, and the whole volume shears when it
 * turns. That is the difference between this and a scrubbed video: nothing
 * here is a pre-rendered frame, and the scene responds to a pointer that never
 * scrolls at all.
 *
 * The backdrop is deliberately outside the volume and carries no transform, so
 * the hero degrades to a still photograph rather than to nothing when a
 * browser refuses the 3D. It is also the largest contentful paint: everything
 * over it is text or SVG, so nothing here waits on JavaScript.
 */
export function Hero({
  planes,
  imageAlt,
  eyebrow,
  title,
  titleAccent,
  body,
}: {
  /** Three image paths, back to front. Editable in Admin → Content. */
  planes: { backdrop: string; mid: string; near: string };
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
}) {
  const { d, href } = useLocale();

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black">
      {/* The backdrop carries no transform and lives outside the 3D volume, so
          it renders whatever happens to the stage above it. If a browser
          refuses the perspective — Safari drops 3D descendants of a clipping
          element, extensions disable transforms, JavaScript never runs — the
          hero is still a photograph rather than a black rectangle. */}
      <div className="absolute inset-0">
        <Media
          src={planes.backdrop}
          alt={imageAlt}
          priority
          quality={88}
          sizes="100vw"
          className="absolute inset-0 size-full"
          imgClassName="animate-image-in [animation-duration:2.4s]"
          objectPosition="center 56%"
        />
      </div>

      {/* The stage is never the element that clips: `overflow: hidden` forces
          `transform-style` to `flat`, and the section above has to clip. */}
      <Stage perspective={1200} swing={3.2} className="absolute inset-0">
        <div className="stage-camera">
          {/* Distances are in the same units as the perspective, so these read
              as metres would on a set: the skyline is far away, the ground is
              under your feet. `lift` is the composed movement on top of that.

              Every plane shares one object-position with the backdrop. They
              have to: the three were composed as one frame, and cropping them
              differently would pull the umbrella off its mast. The plates are
              square so the same crop works on a phone and on a wide desktop. */}
          <Plane z={-70} lift={150}>
            <Media
              src={planes.mid}
              alt=""
              priority
              sizes="100vw"
              className="absolute inset-0 size-full"
              objectPosition="center 56%"
            />
          </Plane>

          <Plane z={80} lift={-110}>
            <Media
              src={planes.near}
              alt=""
              sizes="100vw"
              className="absolute inset-0 size-full"
              objectPosition="center 56%"
            />
          </Plane>
        </div>
      </Stage>

      <div className="absolute inset-0 scrim-full" aria-hidden="true" />
      <div className="absolute inset-0 scrim-side" aria-hidden="true" />

      {/* The block sits well clear of the bottom edge: the buttons were landing
          on the border, which reads as a cropped screen rather than a composed
          one. The space below them is part of the frame. */}
      <div className="shell relative z-10 pb-28 pt-32 sm:pb-32 lg:pb-40">
        <div className="max-w-3xl">
          {/* The same hairline that opens every other chapter, so the hero
              belongs to the page rather than sitting on top of it. */}
          <div
            aria-hidden="true"
            className="mb-8 h-px w-14 origin-[left_center] animate-[saiwan-scale-x_1s_var(--ease-out-expo)_both] bg-white/40 [animation-delay:150ms] rtl:origin-[right_center]"
          />

          <p
            className="eyebrow mb-7 animate-fade text-white/65 [animation-delay:250ms]"
            style={{ animationFillMode: "both" }}
          >
            {eyebrow}
          </p>

          <h1 className="display text-hero text-white text-balance">
            <RevealText text={title} as="span" delay={150} stagger={60} className="block" />
            <RevealText
              text={titleAccent}
              as="span"
              delay={150 + title.split(" ").length * 60}
              stagger={60}
              className="block italic text-champagne"
            />
          </h1>

          <p
            className="mt-9 max-w-md animate-fade text-lead leading-relaxed text-white/70 [animation-delay:950ms]"
            style={{ animationFillMode: "both" }}
          >
            {body}
          </p>

          <div
            className="mt-11 flex animate-fade flex-col gap-3 sm:flex-row sm:items-center [animation-delay:1150ms]"
            style={{ animationFillMode: "both" }}
          >
            <Magnetic strength={0.18}>
              <Link
                href={href("/collection")}
                className="group/cta inline-flex h-14 items-center justify-center gap-3 rounded-xs bg-white px-9 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-black transition-colors duration-500 hover:bg-champagne rtl:normal-case rtl:tracking-normal"
              >
                {d.home.hero.primaryCta}
                <ArrowRight
                  className="size-4 flip-rtl transition-transform duration-500 group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </Magnetic>

            <WhatsAppButton variant="ghost-light" size="lg" label={d.home.hero.secondaryCta} />
          </div>
        </div>
      </div>
    </section>
  );
}
