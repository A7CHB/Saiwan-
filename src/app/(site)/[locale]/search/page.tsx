import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { after } from "next/server";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { searchProducts, recordSearch } from "@/lib/data/search";
import { getCategories } from "@/lib/data/catalog";
import { VISITOR_COOKIE } from "@/lib/constants";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = await getDictionary(locale);
  // A results page is never worth indexing — it duplicates the collection.
  return buildMetadata({
    locale,
    path: "/search",
    title: d.search.title,
    description: d.collection.intro,
    noIndex: true,
  });
}

export default async function SearchPage({
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
  const term = ((Array.isArray(query.q) ? query.q[0] : query.q) ?? "").slice(0, 120).trim();

  const [d, results, categories, cookieStore] = await Promise.all([
    getDictionary(locale),
    term.length >= 2 ? searchProducts(term, locale, 24) : Promise.resolve([]),
    getCategories(locale),
    cookies(),
  ]);

  if (term.length >= 2) {
    after(() => recordSearch(term, locale, results.length, cookieStore.get(VISITOR_COOKIE)?.value));
  }

  return (
    <>
      <header className="shell pb-10 pt-32 sm:pt-40">
        <Reveal>
          <p className="eyebrow mb-6">{d.search.title}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display max-w-3xl text-title text-balance">
            {term ? d.search.resultsFor.replace("{query}", term) : d.search.hint}
          </h1>
        </Reveal>
        {term && results.length > 0 ? (
          <Reveal delay={120}>
            <p className="mt-5 text-sm text-muted tabular-nums">
              {results.length === 1
                ? d.collection.resultsCountOne
                : d.collection.resultsCount.replace("{count}", String(results.length))}
            </p>
          </Reveal>
        ) : null}
      </header>

      <div className="shell pb-28">
        {term.length >= 2 && results.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <h2 className="display text-heading">{d.search.noResults.replace("{query}", term)}</h2>
            <p className="mt-4 leading-relaxed text-muted">{d.search.noResultsBody}</p>

            {/* Suggestions rather than a dead end. */}
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={localePath(locale, `/collection?category=${category.slug}`)}
                    className="inline-block rounded-xs border border-line px-3.5 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <WhatsAppButton variant="ink" label={d.whatsapp.speak} />
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Product names are h3 — this keeps the outline h1 → h2 → h3. */}
            <h2 className="sr-only">{d.search.title}</h2>
            <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product, index) => (
              <Reveal as="li" key={product.id} delay={(index % 3) * 80}>
                <ProductCard product={product} index={index} priority={index < 3} />
              </Reveal>
              ))}
            </ul>
          </>
        ) : (
          <div className="py-16">
            <p className="eyebrow mb-6">{d.search.suggestions}</p>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={localePath(locale, `/collection?category=${category.slug}`)}
                    className="inline-block rounded-xs border border-line px-3.5 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
