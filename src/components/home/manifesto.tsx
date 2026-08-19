import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Reveal } from "@/components/motion/reveal";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * The statement band between the hero and the products.
 *
 * Reduced to type. It began as a full chapter — a half-width plate, a body
 * paragraph and a row of three figures — which is a destination, and this is a
 * beat: one line of brand thesis with its supporting sentence set beside it,
 * read in the time it takes to scroll past. The hero above and the pieces below
 * carry the imagery; a third photograph here only added height.
 */
export function Manifesto({ d }: { d: Dictionary }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <CanopyRadial className="pointer-events-none absolute -start-40 -top-40 size-[32rem] text-accent opacity-[0.05]" />

      <div className="shell relative">
        <Reveal kind="scale-x" className="mb-8 h-px w-14 bg-line-strong" />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-6">{d.home.intro.eyebrow}</p>
            <h2 className="display max-w-3xl text-title text-balance">{d.home.intro.title}</h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="max-w-lg text-lead leading-relaxed text-muted lg:pb-2">{d.home.intro.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
