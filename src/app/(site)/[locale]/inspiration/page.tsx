import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getGallery } from "@/lib/data/catalog";
import { GALLERY_TAGS } from "@/lib/constants";
import { GalleryMosaic } from "@/components/site/gallery-mosaic";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { cn } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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
    path: "/inspiration",
    title: d.inspiration.title,
    description: d.inspiration.intro,
  });
}

export default async function InspirationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const query = await searchParams;
  const tagParam = Array.isArray(query.tag) ? query.tag[0] : query.tag;
  const tag = tagParam && GALLERY_TAGS.includes(tagParam as never) ? tagParam : undefined;

  const [d, items] = await Promise.all([getDictionary(locale), getGallery(locale, tag)]);

  return (
    <>
      <header className="shell pb-12 pt-32 sm:pt-40">
        <Reveal>
          <p className="eyebrow mb-6">{d.inspiration.eyebrow}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display max-w-3xl text-display text-balance">{d.inspiration.title}</h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-7 max-w-xl text-lead leading-relaxed text-muted">{d.inspiration.intro}</p>
        </Reveal>
      </header>

      {/* Setting filter — plain links, so each view is its own crawlable URL. */}
      <nav aria-label={d.inspiration.filterAll} className="shell border-y border-line py-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <Link
              href={localePath(locale, "/inspiration")}
              aria-current={!tag ? "page" : undefined}
              className={cn(
                "text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors rtl:text-sm rtl:normal-case rtl:tracking-normal",
                !tag ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {d.inspiration.filterAll}
            </Link>
          </li>
          {GALLERY_TAGS.map((option) => (
            <li key={option}>
              <Link
                href={localePath(locale, `/inspiration?tag=${option}`)}
                aria-current={tag === option ? "page" : undefined}
                className={cn(
                  "text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors rtl:text-sm rtl:normal-case rtl:tracking-normal",
                  tag === option ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {d.inspiration.tags[option]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shell py-14">
        {items.length === 0 ? (
          <p className="py-24 text-center text-muted">{d.inspiration.empty}</p>
        ) : (
          <GalleryMosaic items={items} dense />
        )}
      </div>

      <section className="section border-t border-line">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="display text-title text-balance">{d.inspiration.cta.title}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-md leading-relaxed text-muted">{d.inspiration.cta.body}</p>
          </Reveal>
          <Reveal delay={140}>
            <WhatsAppButton variant="ink" size="lg" label={d.inspiration.cta.button} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
