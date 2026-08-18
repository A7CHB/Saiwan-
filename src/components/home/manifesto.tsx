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
    <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <CanopyRadial className="pointer-events-none absolute -start-40 -top-40 size-[28rem] text-accent opacity-[0.05]" />

      <div className="shell relative">
        <Reveal kind="scale-x" className="mb-7 h-px w-14 bg-line-strong" />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">{d.home.intro.eyebrow}</p>
            <h2 className="display max-w-2xl text-title text-balance">{d.home.intro.title}</h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="max-w-lg leading-relaxed text-muted lg:pb-1.5">{d.home.intro.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
