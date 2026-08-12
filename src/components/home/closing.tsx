import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { Reveal } from "@/components/motion/reveal";
import { Media } from "@/components/ui/media";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * The consultation teaser. Sells the quiz as a service rather than a form —
 * "six questions, a considered recommendation" — because that is what makes a
 * customer start it.
 */
export function QuizTeaser({ d, locale, image }: { d: Dictionary; locale: Locale; image: string | null }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Media src={image} alt="" sizes="100vw" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 bg-[rgb(var(--c-overlay)/0.72)]" aria-hidden="true" />
      </div>

      <div className="shell section relative text-center">
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
    </section>
  );
}

/**
 * The final conversion panel. Deliberately the plainest section on the page:
 * by this point the work is done and the only job left is to make starting a
 * conversation effortless.
 */
export function ClosingCta({ d, locale }: { d: Dictionary; locale: Locale }) {
  return (
    <section className="section relative overflow-hidden border-t border-line">
      <CanopyRadial className="pointer-events-none absolute -top-52 start-1/2 size-[46rem] -translate-x-1/2 text-accent opacity-[0.06]" />

      <div className="shell relative text-center">
        <Reveal>
          <p className="eyebrow mb-6">{d.home.cta.eyebrow}</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="display mx-auto max-w-3xl text-display text-balance">{d.home.cta.title}</h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-lg text-lead leading-relaxed text-muted">{d.home.cta.body}</p>
        </Reveal>

        <Reveal delay={240} className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton variant="ink" size="lg" label={d.home.cta.primary} />
          <Link
            href={localePath(locale, "/collection")}
            className="inline-flex h-14 items-center justify-center rounded-xs border border-line-strong px-9 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
          >
            {d.home.cta.secondary}
          </Link>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-7 text-xs text-subtle">{d.home.cta.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
