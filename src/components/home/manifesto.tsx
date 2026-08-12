import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Reveal } from "@/components/motion/reveal";
import { Media } from "@/components/ui/media";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * The statement chapter, immediately after the hero.
 *
 * A landscape plate rather than the tall portrait it started as: a 3:4 image in
 * a half-width column is close to a full screen on its own, and this section is
 * a beat between the hero and the products, not a destination. The three
 * figures are qualitative on purpose — inventing numbers for a business we
 * cannot verify would be worse than saying nothing.
 */
export function Manifesto({ d, image, imageAlt }: { d: Dictionary; image: string | null; imageAlt: string }) {
  const figures = [
    { value: d.home.intro.stat1Value, label: d.home.intro.stat1Label },
    { value: d.home.intro.stat2Value, label: d.home.intro.stat2Label },
    { value: d.home.intro.stat3Value, label: d.home.intro.stat3Label },
  ];

  return (
    <section className="section relative overflow-hidden">
      <CanopyRadial className="pointer-events-none absolute -start-40 top-1/4 size-[34rem] text-accent opacity-[0.05]" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Reveal kind="scale-x" className="mb-7 h-px w-14 bg-line-strong" />

            <Reveal>
              <p className="eyebrow mb-6">{d.home.intro.eyebrow}</p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="display text-title text-balance">{d.home.intro.title}</h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-lg leading-relaxed text-muted">{d.home.intro.body}</p>
            </Reveal>
          </div>

          <Reveal kind="image">
            <Media
              src={image}
              alt={imageAlt}
              ratio="5 / 4"
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="w-full"
            />
          </Reveal>
        </div>

        <dl className="mt-12 grid gap-8 sm:grid-cols-3 lg:mt-16">
          {figures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 90} className="border-t border-line pt-5">
              <dt className="display text-heading leading-tight">{figure.value}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{figure.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
