import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getProductsByIds } from "@/lib/data/products";
import { COMPARE_LIMIT } from "@/lib/constants";
import { Media } from "@/components/ui/media";
import { formatPrice } from "@/lib/i18n/format";
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
  return buildMetadata({
    locale,
    path: "/compare",
    title: d.product.compareTitle,
    description: d.product.compareEmpty,
    noIndex: true,
  });
}

/**
 * Side-by-side comparison.
 *
 * A real table (not a grid of divs) so the row headers are announced with each
 * cell. It scrolls horizontally inside its own container on narrow screens
 * rather than forcing the page to scroll sideways.
 */
export default async function ComparePage({
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
  const ids = ((Array.isArray(query.ids) ? query.ids[0] : query.ids) ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, COMPARE_LIMIT);

  const [d, products] = await Promise.all([getDictionary(locale), getProductsByIds(ids, locale)]);

  const rows: { label: string; value: (p: (typeof products)[number]) => string }[] = [
    { label: d.collection.category, value: (p) => p.categoryName },
    { label: d.collection.style, value: (p) => d.product.styles[p.style] },
    { label: d.product.segmentLabel, value: (p) => d.product.segments[p.segment] },
    { label: d.product.coverage, value: (p) => (p.coverageM2 ? `${p.coverageM2} m²` : "—") },
    { label: d.collection.priceTier, value: (p) => d.product.tiers[String(p.priceTier) as "1" | "2" | "3"] },
    { label: d.product.availability, value: (p) => d.product.availabilityStates[p.availability] },
    {
      label: d.collection.setting,
      value: (p) => p.useCases.map((useCase) => d.product.settings[useCase]).join(", ") || "—",
    },
    {
      label: d.common.from,
      value: (p) =>
        p.showPrice && p.price != null ? formatPrice(p.price, locale, p.currency) : d.common.priceOnRequest,
    },
  ];

  return (
    <div className="shell pb-28 pt-32 sm:pt-40">
      <p className="eyebrow mb-6">{d.product.compare}</p>
      <h1 className="display text-display text-balance">{d.product.compareTitle}</h1>

      {products.length === 0 ? (
        <div className="max-w-md py-16">
          <p className="text-lead leading-relaxed text-muted">{d.product.compareEmpty}</p>
          <Link
            href={localePath(locale, "/collection")}
            className="mt-8 inline-flex h-12 items-center rounded-xs border border-line-strong px-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
          >
            {d.common.exploreCollection}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-3xl border-collapse text-sm">
              <caption className="sr-only">{d.product.compareTitle}</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-40 p-0 text-start align-bottom">
                    <span className="sr-only">{d.product.specifications}</span>
                  </th>
                  {products.map((product) => (
                    <th key={product.id} scope="col" className="p-3 text-start align-bottom font-normal">
                      <Link href={localePath(locale, `/collection/${product.slug}`)} className="group block">
                        <Media
                          src={product.image}
                          alt={product.imageAlt}
                          ratio="3 / 4"
                          sizes="(max-width: 768px) 45vw, 280px"
                          className="mb-4 w-full"
                        />
                        <span className="display block text-[1.25rem] leading-tight transition-colors group-hover:text-accent">
                          {product.name}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="py-4 pe-4 text-start align-top">
                      <span className="eyebrow text-[0.5625rem]">{row.label}</span>
                    </th>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 align-top text-muted">
                        {row.value(product)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <th scope="row" className="py-5 pe-4 text-start align-top">
                    <span className="sr-only">{d.whatsapp.inquire}</span>
                  </th>
                  {products.map((product) => (
                    <td key={product.id} className="p-3 align-top">
                      <WhatsAppButton
                        variant="outline"
                        size="sm"
                        productId={product.id}
                        label={d.whatsapp.inquire}
                        fullWidth
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-14 border-t border-line pt-10">
            <Link
              href={localePath(locale, "/collection")}
              className="link-underline text-sm text-muted transition-colors hover:text-fg"
            >
              {d.common.exploreCollection}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
