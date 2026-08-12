import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { MaterialView } from "@/lib/data/catalog";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Media } from "@/components/ui/media";
import { Parallax } from "@/components/motion/parallax";

/**
 * Materials & craftsmanship.
 *
 * Alternating full-width bands rather than a card row — each material gets a
 * plate of its own and the direction flips on every second item, which gives
 * the section a rhythm as the page scrolls. Content comes from the `Material`
 * table so the admin can add, reorder or rewrite these without a deploy.
 */
export function Craft({
  d,
  materials,
  images,
}: {
  d: Dictionary;
  materials: MaterialView[];
  images: string[];
}) {
  if (materials.length === 0) return null;

  return (
    <section className="section">
      <div className="shell">
        <SectionHeader
          eyebrow={d.home.craft.eyebrow}
          title={d.home.craft.title}
          body={d.home.craft.body}
          className="mb-16 lg:mb-24"
        />

        <div className="flex flex-col gap-16 lg:gap-28">
          {materials.slice(0, 3).map((material, index) => {
            const flipped = index % 2 === 1;
            return (
              <div
                key={material.id}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal
                  kind="image"
                  className={flipped ? "lg:order-2" : undefined}
                >
                  <Parallax speed={0.08}>
                    <Media
                      src={images[index] ?? null}
                      alt={material.name}
                      ratio="16 / 11"
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="w-full"
                    />
                  </Parallax>
                </Reveal>

                <Reveal delay={100} className={flipped ? "lg:order-1 lg:pe-10" : "lg:ps-10"}>
                  <span
                    aria-hidden="true"
                    className="display block text-[2.25rem] leading-none text-line-strong"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-4 text-heading leading-snug">{material.name}</h3>
                  {material.description ? (
                    <p className="mt-4 max-w-md leading-relaxed text-muted">{material.description}</p>
                  ) : null}
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
