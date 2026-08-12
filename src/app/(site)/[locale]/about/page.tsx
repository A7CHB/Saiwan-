import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getContent, getMaterials } from "@/lib/data/catalog";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CanopyRadial } from "@/components/icons/canopy";

const MEDIA_FALLBACK = {
  heroImage: "/media/hero-dusk.svg",
  portraitImage: "/media/portrait-terrace.svg",
  detailImage: "/media/detail-hardware.svg",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/about",
    title: d.about.title,
    description: d.about.lead,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, materials, media] = await Promise.all([
    getDictionary(locale),
    getMaterials(locale),
    getContent("about.media", locale, MEDIA_FALLBACK),
  ]);

  const sections = [
    d.about.sections.origin,
    d.about.sections.approach,
    d.about.sections.standard,
    d.about.sections.commitment,
  ];

  return (
    <>
      {/* Opening statement over a held frame */}
      <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 -z-10">
          <Media
            src={media.heroImage}
            alt={d.about.title}
            priority
            quality={88}
            sizes="100vw"
            className="absolute inset-0 size-full"
          />
          <div className="absolute inset-0 scrim-full" aria-hidden="true" />
        </div>

        <div className="shell relative pb-16 pt-32">
          <p className="eyebrow mb-6 text-white/60">{d.about.eyebrow}</p>
          <h1 className="display max-w-4xl text-hero text-white text-balance">{d.about.lead}</h1>
        </div>
      </section>

      {/* The four positions, as an editorial column against a drifting plate */}
      <section className="section relative overflow-hidden">
        <CanopyRadial className="pointer-events-none absolute -start-48 top-1/3 size-[38rem] text-accent opacity-[0.05]" />

        <div className="shell relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="flex flex-col gap-14">
            {sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 60} className="border-t border-line pt-7">
                <div className="flex items-baseline gap-5">
                  <span
                    aria-hidden="true"
                    className="display shrink-0 text-[1.75rem] leading-none text-line-strong"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="display text-heading leading-snug">{section.title}</h2>
                    <p className="mt-4 max-w-lg leading-relaxed text-muted">{section.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal kind="image" className="lg:pt-12">
            <Parallax speed={0.1}>
              <Media
                src={media.portraitImage}
                alt={d.about.title}
                ratio="3 / 4"
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="w-full"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* The standard, expressed as the material list */}
      {materials.length > 0 ? (
        <section className="section bg-sunken">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-6">{d.home.craft.eyebrow}</p>
              <h2 className="display max-w-3xl text-title text-balance">{d.about.sections.standard.title}</h2>
            </Reveal>

            <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {materials.map((material, index) => (
                <Reveal key={material.id} delay={index * 70} className="border-t border-line pt-6">
                  <dt className="display text-heading leading-snug">{material.name}</dt>
                  {material.description ? (
                    <dd className="mt-3.5 max-w-md leading-relaxed text-muted">{material.description}</dd>
                  ) : null}
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="section border-t border-line">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="display text-title text-balance">{d.about.cta.title}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-md leading-relaxed text-muted">{d.about.cta.body}</p>
          </Reveal>
          <Reveal delay={140}>
            <WhatsAppButton variant="ink" size="lg" label={d.about.cta.button} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
