"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type ShowcaseItem = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
};

/**
 * "Look closer" — an interactive detail explorer.
 *
 * Implemented as a proper tablist (roving focus, arrow-key navigation) rather
 * than a set of buttons, because it behaves like one. All panels stay mounted
 * and cross-fade, so switching details never re-downloads an image or shows a
 * flash of empty frame.
 */
export function Showcase({ items }: { items: ShowcaseItem[] }) {
  const { d } = useLocale();
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const back = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!forward && !back) return;
    event.preventDefault();
    const next = forward
      ? (active + 1) % items.length
      : (active - 1 + items.length) % items.length;
    setActive(next);
    document.getElementById(`showcase-tab-${next}`)?.focus();
  };

  return (
    <section className="section overflow-hidden bg-fg text-white dark:bg-sunken">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col justify-center">
            <Reveal kind="scale-x" className="mb-8 h-px w-16 bg-white/25" />
            <Reveal>
              <p className="eyebrow mb-5 text-white/55">{d.home.showcase.eyebrow}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-title text-balance">{d.home.showcase.title}</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-md leading-relaxed text-white/65">{d.home.showcase.body}</p>
            </Reveal>

            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label={d.home.showcase.hint}
              onKeyDown={onKeyDown}
              className="mt-10 flex flex-col"
            >
              {items.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    id={`showcase-tab-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`showcase-panel-${index}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    className="group border-t border-white/15 py-5 text-start last:border-b"
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "text-[0.625rem] tabular-nums transition-colors duration-500",
                          selected ? "text-champagne" : "text-white/35",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "display text-[1.5rem] leading-tight transition-colors duration-500",
                          selected ? "text-white" : "text-white/45 group-hover:text-white/80",
                        )}
                      >
                        {item.name}
                      </span>
                    </span>

                    {/* The description belongs to the selected detail only —
                        collapsing it keeps the list scannable. */}
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="mt-3 block max-w-sm ps-8 text-sm leading-relaxed text-white/60">
                          {item.description}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Reveal kind="image" className="relative">
            <div className="relative aspect-4/5 w-full">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  id={`showcase-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`showcase-tab-${index}`}
                  // `inert` rather than `hidden`: it removes the inactive panel
                  // from the a11y tree and the tab order while leaving it in the
                  // layout, which is what makes the cross-fade possible.
                  inert={index !== active}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    index === active ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Media
                    src={item.image}
                    alt={item.name}
                    sizes="(max-width: 1024px) 92vw, 55vw"
                    className="absolute inset-0 size-full"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
