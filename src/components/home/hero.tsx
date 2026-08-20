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
 * The scene is cut into four planes standing at real distances inside a
 * perspective volume: sky at the back, a blurred skyline behind that plane,
 * the subject canopies in the middle, and the ground the viewer stands on
 * closest to the camera. The headline sits on its own plane in front of all of
 * them.
 *
 * Because the depth is real, scrolling and moving the pointer do what a camera
 * does — near planes overtake far ones, and the whole volume shears when it
 * turns. That is the difference between this and a scrubbed video: nothing
 * here is a pre-rendered frame, and the scene responds to a pointer that never
 * scrolls at all.
 *
 * The sky plane is `priority`; everything over it is text or SVG, so the
 * largest contentful paint is the picture rather than a hero waiting on
 * JavaScript. With JavaScript off, or under reduced motion, the planes stack
 * into exactly the composition you see at rest.
 */
export function Hero({
  planes,
  imageAlt,
  eyebrow,
  title,
  titleAccent,
  body,
}: {
  /** Four image paths, back to front. Editable in Admin → Content. */
  planes: { sky: string; far: string; mid: string; near: string };
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
}) {
  const { d, href } = useLocale();

  return (
    <Stage
      as="section"
      perspective={1200}
      swing={3.2}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black"
    >
      {/* No negative z-index here: `perspective` on the section makes it a 3D
          rendering context, and a negative index inside one paints behind the
          section's own background rather than behind its content. The content
          is lifted above the scene instead. */}
      <div className="absolute inset-0">
        <div className="stage-camera">
          {/* Distances are in the same units as the perspective, so these read
              as metres would on a set: the sky is far away, the ground is under
              your feet. `lift` is the composed movement on top of that.

              Every plane shares one object-position. They have to: the planes
              are registered to each other, and cropping them differently would
              shear the scene apart on a narrow screen. The art is square and
              composed from the centre so the same crop works on a phone and on
              a wide desktop. */}
          <Plane z={-420} lift={70}>
            <Media
              src={planes.sky}
              alt={imageAlt}
              priority
              quality={88}
              sizes="100vw"
              className="absolute inset-0 size-full"
              imgClassName="animate-image-in [animation-duration:2.4s]"
              objectPosition="center 56%"
            />
          </Plane>

          <Plane z={-260} lift={130} className="opacity-90">
            <Media
              src={planes.far}
              alt=""
              priority
              sizes="100vw"
              className="absolute inset-0 size-full"
              objectPosition="center 56%"
            />
          </Plane>

          <Plane z={-90} lift={210}>
            <Media
              src={planes.mid}
              alt=""
              priority
              sizes="100vw"
              className="absolute inset-0 size-full"
              objectPosition="center 56%"
            />
          </Plane>

          <Plane z={60} lift={-90}>
            <Media
              src={planes.near}
              alt=""
              sizes="100vw"
              className="absolute inset-0 size-full"
              objectPosition="center 56%"
            />
          </Plane>
        </div>

        <div className="absolute inset-0 scrim-full" aria-hidden="true" />
      </div>

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
    </Stage>
  );
}
