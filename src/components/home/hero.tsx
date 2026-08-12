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
 * One photograph at full bleed, a two-line headline that arrives word by word,
 * and exactly two actions. The image is `priority` and everything layered over
 * it is text or SVG, so the largest contentful paint is the photograph itself
 * rather than a hero that waits on JavaScript.
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
      {/* A very slow scale gives the still image the feel of a held shot.
          Two crops rather than one: a landscape frame reduced to a phone's
          aspect ratio keeps only its middle third, which is rarely where the
          subject is. Only the matching one is ever fetched, because the hidden
          element is display:none before the browser starts the request. */}
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

      <div className="shell relative pb-16 pt-32 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl">
          <p
            className="eyebrow mb-6 animate-fade text-white/70 [animation-delay:200ms]"
            style={{ animationFillMode: "both" }}
          >
            {eyebrow}
          </p>

          <h1 className="display text-hero text-white text-balance">
            <RevealText text={title} as="span" delay={120} stagger={60} className="block" />
            <RevealText
              text={titleAccent}
              as="span"
              delay={120 + title.split(" ").length * 60}
              stagger={60}
              className="block italic text-champagne"
            />
          </h1>

          <p
            className="mt-7 max-w-xl animate-fade text-lead leading-relaxed text-white/75 [animation-delay:900ms]"
            style={{ animationFillMode: "both" }}
          >
            {body}
          </p>

          <div
            className="mt-10 flex animate-fade flex-col gap-3 sm:flex-row sm:items-center [animation-delay:1100ms]"
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

      {/* Scroll cue: a rule that fills downward on a loop. */}
      <div
        aria-hidden="true"
        className="shell relative hidden animate-fade pb-10 [animation-delay:1400ms] lg:block"
        style={{ animationFillMode: "both" }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[0.5625rem] font-medium uppercase tracking-[0.24em] text-white/50 rtl:text-[0.6875rem] rtl:normal-case rtl:tracking-normal">
            {d.home.hero.scrollHint}
          </span>
          <span className="relative h-px w-24 overflow-hidden bg-white/20">
            <span className="scroll-cue absolute inset-y-0 start-0 w-1/3 bg-white/70 [animation:saiwan-scroll-cue_2.6s_ease-in-out_infinite]" />
          </span>
        </div>
      </div>
    </section>
  );
}
