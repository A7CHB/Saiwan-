import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * The questions people ask before they send the first message.
 *
 * Built on `<details>` rather than a React accordion for a specific reason:
 * the answers are in the DOM whether or not they are open, and whether or not
 * JavaScript ran. A crawler reads them, a reader can find them with ⌘F, and the
 * matching FAQPage schema describes text that is genuinely on the page — which
 * is the condition Google attaches to the rich result.
 *
 * The open/closed state is the browser's own, so there is no hydration cost and
 * nothing to get out of step.
 */
export function Faq({ d }: { d: Dictionary }) {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-line">
      <div className="shell py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow mb-6">{d.contact.faq.eyebrow}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="faq-heading" className="display max-w-2xl text-display text-balance">
            {d.contact.faq.title}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">{d.contact.faq.intro}</p>
        </Reveal>

        <Reveal delay={180} className="mt-12">
          <dl className="divide-y divide-line border-y border-line">
            {d.contact.faq.items.map((item) => (
              <details key={item.q} name="saiwan-faq" className="group">
                {/* dt/dd inside details keeps the definition-list semantics a
                    question-and-answer list wants, while summary keeps the
                    native disclosure behaviour and keyboard handling. */}
                <summary className="flex cursor-pointer list-none items-start gap-5 py-6 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  <dt className="flex-1 text-base leading-relaxed">{item.q}</dt>
                  <span
                    aria-hidden="true"
                    className="mt-1.5 grid size-5 shrink-0 place-items-center text-subtle transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.25">
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <dd className="max-w-2xl pb-7 pe-10 leading-relaxed text-muted">{item.a}</dd>
              </details>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
