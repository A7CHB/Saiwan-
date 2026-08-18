import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SavedGrid } from "@/components/product/saved-grid";

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
    path: "/saved",
    title: d.saved.title,
    description: d.saved.intro,
    // Personal to one browser, and different on every device: nothing here is
    // worth indexing.
    noIndex: true,
  });
}

/**
 * Saved pieces.
 *
 * Deliberately account-free. The shortlist is kept in the browser, so the shell
 * renders on the server and the list itself is filled in on the client — see
 * `FavoritesProvider` for why saving never asks anyone to sign in.
 */
export default async function SavedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = await getDictionary(locale);

  return (
    <div className="shell pb-28 pt-32 sm:pt-40">
      <header className="max-w-2xl">
        <p className="eyebrow mb-6">{d.saved.eyebrow}</p>
        <h1 className="display text-display text-balance">{d.saved.title}</h1>
        <p className="mt-6 text-lead leading-relaxed text-muted">{d.saved.intro}</p>
      </header>

      <section className="mt-16" aria-label={d.saved.title}>
        <SavedGrid />
      </section>
    </div>
  );
}
