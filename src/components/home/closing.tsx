import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { Reveal } from "@/components/motion/reveal";
import { Media } from "@/components/ui/media";
import { Stage, Plane } from "@/components/motion/stage";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * The consultation teaser. Sells the quiz as a service rather than a form —
 * "six questions, a considered recommendation" — because that is what makes a
 * customer start it.
 */
export function QuizTeaser({ d, locale, image }: { d: Dictionary; locale: Locale; image: string | null }) {
  return (
    <Stage as="section" perspective={1400} swing={1.6} className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <div className="stage-camera">
          {/* The picture stands a long way back, so it drifts under the type as
              the page moves rather than travelling with it. */}
          <Plane z={-260} lift={140}>
            <Media src={image} alt="" sizes="100vw" className="absolute inset-0 size-full" />
          </Plane>
        </div>
        <div className="absolute inset-0 bg-[rgb(var(--c-overlay)/0.72)]" aria-hidden="true" />
      </div>

      <div className="shell section relative z-10 text-center">
        <Reveal>
          <p className="eyebrow mb-6 text-white/60">{d.home.quiz.eyebrow}</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="display mx-auto max-w-3xl text-display text-white text-balance">
            {d.home.quiz.title}
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-xl text-lead leading-relaxed text-white/70">{d.home.quiz.body}</p>
        </Reveal>

        <Reveal delay={240} className="mt-10 flex flex-col items-center gap-4">
          <Link
            href={localePath(locale, "/find-your-shade")}
            className="group inline-flex h-14 items-center gap-3 rounded-xs bg-white px-9 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-black transition-colors duration-500 hover:bg-champagne rtl:normal-case rtl:tracking-normal"
          >
            {d.home.quiz.cta}
            <ArrowRight
              className="size-4 flip-rtl transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
          <p className="inline-flex items-center gap-2 text-xs text-white/50">
            <Clock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            {d.home.quiz.duration}
          </p>
        </Reveal>
      </div>
    </Stage>
  );
}
