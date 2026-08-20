import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Four propositions, set as a numbered editorial list rather than four boxes.
 *
 * The only visual furniture is a hairline above each item and an oversized
 * numeral — no cards, no icons. Restraint here is what keeps the page from
 * sliding into template territory.
 */
export function Difference({ d }: { d: Dictionary }) {
  const items = [
    d.home.difference.items.engineering,
    d.home.difference.items.materials,
    d.home.difference.items.proportion,
    d.home.difference.items.service,
  ];

  return (
    <section className="section">
      <div className="shell">
        <SectionHeader
          eyebrow={d.home.difference.eyebrow}
          title={d.home.difference.title}
          className="mb-10 lg:mb-14"
        />

        {/* Four across on a wide screen rather than two rows of two: the same
            four propositions in half the height, and they read as a set. */}
        <ol className="depth-group grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90} kind="depth" as="li" className="group border-t border-line pt-5">
              <span
                aria-hidden="true"
                className="display mb-3 block text-[1.75rem] leading-none text-line-strong transition-colors duration-700 group-hover:text-accent"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-[1.375rem] leading-snug">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
