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
          className="mb-16 lg:mb-24"
        />

        <ol className="grid gap-x-14 gap-y-12 md:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90} as="li" className="group border-t border-line pt-7">
              <div className="flex items-baseline gap-5">
                <span
                  aria-hidden="true"
                  className="display shrink-0 text-[2.25rem] leading-none text-line-strong transition-colors duration-700 group-hover:text-accent"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-heading leading-snug">{item.title}</h3>
                  <p className="mt-3.5 max-w-md leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
