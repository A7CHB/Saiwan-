import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Media } from "@/components/ui/media";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * The statement chapter, immediately after the hero.
 *
 * An asymmetric two-column setting: an oversized pull-quote against a tall
 * portrait plate that drifts on scroll. The three figures underneath are the
 * only "stats" on the page and they are qualitative on purpose — inventing
 * numbers for a business we cannot verify would be worse than saying nothing.
 */
export function Manifesto({ d, image, imageAlt }: { d: Dictionary; image: string | null; imageAlt: string }) {
  const figures = [
    { value: d.home.intro.stat1Value, label: d.home.intro.stat1Label },
    { value: d.home.intro.stat2Value, label: d.home.intro.stat2Label },
    { value: d.home.intro.stat3Value, label: d.home.intro.stat3Label },
  ];

  return (
    <section className="section relative overflow-hidden">
      <CanopyRadial className="pointer-events-none absolute -start-40 top-1/4 size-[38rem] text-accent opacity-[0.05]" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="flex flex-col justify-center">
            <Reveal kind="scale-x" className="mb-8 h-px w-16 bg-line-strong" />

            <Reveal>
              <p className="eyebrow mb-7">{d.home.intro.eyebrow}</p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="display text-title text-balance">{d.home.intro.title}</h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-lead leading-relaxed text-muted">{d.home.intro.body}</p>
            </Reveal>

            <dl className="mt-14 grid gap-8 sm:grid-cols-3">
              {figures.map((figure, index) => (
                <Reveal key={figure.label} delay={220 + index * 90} className="border-t border-line pt-5">
                  <dt className="display text-heading leading-tight">{figure.value}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{figure.label}</dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal kind="image" className="lg:pt-16">
            <Parallax speed={0.1}>
              <Media
                src={image}
                alt={imageAlt}
                ratio="3 / 4"
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="w-full"
              />
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
