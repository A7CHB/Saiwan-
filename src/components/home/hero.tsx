"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Media } from "@/components/ui/media";
import { RevealText } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Magnetic } from "@/components/motion/parallax";

/**
 * The first frame.
 *
 * Five elements and nothing else: a rule, a label, the headline, one line, two
 * actions. Everything that was competing with the headline has been taken out —
 * a hero earns its full screen by being the calmest thing on the page, not the
 * busiest.
 *
 * The image is `priority` and everything over it is text or SVG, so the largest
 * contentful paint is the photograph rather than a hero waiting on JavaScript.
 */
export function Hero({
  image,
  imageMobile,
  imageAlt,
  eyebrow,
  title,
  titleAccent,
  body,
}: {
  image: string | null;
  /** Portrait crop for phones. Falls back to `image` when not set. */
  imageMobile?: string | null;
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
}) {
  const { d, href } = useLocale();

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black">
      {/* Two crops rather than one: a landscape frame reduced to a phone's
          aspect ratio keeps only its middle third, which is rarely where the
          subject is. Only the matching one is fetched — the hidden element is
          display:none before the browser starts the request. */}
      <div className="absolute inset-0 -z-10">
        <Media
          src={imageMobile ?? image}
          alt={imageAlt}
          priority
          quality={88}
          sizes="100vw"
          className="absolute inset-0 size-full sm:hidden"
          imgClassName="animate-image-in [animation-duration:2.4s]"
          objectPosition="center 55%"
        />
        <Media
          src={image}
          alt={imageAlt}
          priority
          quality={88}
          sizes="100vw"
          className="absolute inset-0 hidden size-full sm:block"
          imgClassName="animate-image-in [animation-duration:2.4s]"
          objectPosition="center 42%"
        />
        <div className="absolute inset-0 scrim-full" aria-hidden="true" />
      </div>

      {/* The block sits well clear of the bottom edge: the buttons were landing
          on the border, which reads as a cropped screen rather than a composed
          one. The space below them is part of the frame. */}
      <div className="shell relative pb-28 pt-32 sm:pb-32 lg:pb-40">
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
