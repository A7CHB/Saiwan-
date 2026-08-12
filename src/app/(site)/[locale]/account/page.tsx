import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/lib/auth/actions";
import { prisma } from "@/lib/db";
import { getProductsByIds } from "@/lib/data/products";
import { formatDate } from "@/lib/i18n/format";
import { parseJson } from "@/lib/utils";

import { AuthPanel, ProfileForm } from "@/components/account/auth-forms";
import { ProductCard } from "@/components/product/product-card";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Reveal } from "@/components/motion/reveal";
import type { InquiryStatus } from "@/lib/constants";

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
    path: "/account",
    title: d.account.title,
    description: d.auth.signInBody,
    noIndex: true,
  });
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [d, user, query] = await Promise.all([getDictionary(locale), getSessionUser(), searchParams]);

  // ---------------------------------------------------------- signed out
  if (!user) {
    const redirectTo = Array.isArray(query.redirect) ? query.redirect[0] : query.redirect;
    return (
      <div className="shell flex min-h-[80svh] items-center py-32">
        <AuthPanel redirectTo={redirectTo ? localePath(locale, redirectTo) : undefined} />
      </div>
    );
  }

  // ----------------------------------------------------------- signed in
  const [favorites, inquiries] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { productId: true },
    }),
    prisma.inquiry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        reference: true,
        status: true,
        createdAt: true,
        configuration: true,
        product: { select: { slug: true, translations: { select: { locale: true, name: true } } } },
      },
    }),
  ]);

  const savedProducts = await getProductsByIds(
    favorites.map((favorite) => favorite.productId),
    locale,
  );

  return (
    <div className="shell pb-28 pt-32 sm:pt-40">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10">
        <div>
          <p className="eyebrow mb-5">{d.account.title}</p>
          <h1 className="display text-title text-balance">
            {d.account.greeting.replace("{name}", user.name)}
          </h1>
        </div>
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-xs border border-line-strong px-6 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:text-sm rtl:normal-case rtl:tracking-normal"
          >
            {d.auth.signOut}
          </button>
        </form>
      </header>

      {/* Saved pieces */}
      <section className="py-14" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="eyebrow mb-8">
          {d.account.favorites}
        </h2>

        {savedProducts.length === 0 ? (
          <EmptyState
            title={d.account.favoritesEmpty.title}
            body={d.account.favoritesEmpty.body}
            ctaLabel={d.account.favoritesEmpty.cta}
            ctaHref={localePath(locale, "/collection")}
          />
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product, index) => (
              <Reveal as="li" key={product.id} delay={(index % 3) * 80}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      {/* Inquiries */}
      <section className="border-t border-line py-14" aria-labelledby="inquiries-heading">
        <h2 id="inquiries-heading" className="eyebrow mb-8">
          {d.account.inquiries}
        </h2>

        {inquiries.length === 0 ? (
          <EmptyState
            title={d.account.inquiriesEmpty.title}
            body={d.account.inquiriesEmpty.body}
            ctaLabel={d.account.inquiriesEmpty.cta}
            ctaHref={localePath(locale, "/find-your-shade")}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-3 pe-4 text-start">
                    <span className="eyebrow text-[0.5625rem]">{d.common.reference}</span>
                  </th>
                  <th scope="col" className="py-3 pe-4 text-start">
                    <span className="eyebrow text-[0.5625rem]">{d.account.inquiryProduct}</span>
                  </th>
                  <th scope="col" className="py-3 pe-4 text-start">
                    <span className="eyebrow text-[0.5625rem]">{d.account.inquiryDate}</span>
                  </th>
                  <th scope="col" className="py-3 text-start">
                    <span className="eyebrow text-[0.5625rem]">{d.account.inquiryStatus}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => {
                  const config = parseJson<{ productName?: string }>(inquiry.configuration, {});
                  const productName =
                    inquiry.product?.translations.find((translation) => translation.locale === locale)?.name ??
                    config.productName ??
                    "—";
                  return (
                    <tr key={inquiry.id} className="border-b border-line last:border-b-0">
                      <td className="py-4 pe-4 tabular-nums">{inquiry.reference}</td>
                      <td className="py-4 pe-4">
                        {inquiry.product ? (
                          <Link
                            href={localePath(locale, `/collection/${inquiry.product.slug}`)}
                            className="link-underline transition-colors hover:text-accent"
                          >
                            {productName}
                          </Link>
                        ) : (
                          <span className="text-muted">{productName}</span>
                        )}
                      </td>
                      <td className="py-4 pe-4 text-muted tabular-nums">
                        {formatDate(inquiry.createdAt, locale)}
                      </td>
                      <td className="py-4">
                        <span className="inline-block rounded-xs border border-line px-2.5 py-1 text-xs text-muted">
                          {d.inquiryStatus[inquiry.status as InquiryStatus] ?? inquiry.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Profile + preferences */}
      <section className="grid gap-14 border-t border-line py-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="eyebrow mb-3">{d.account.profile}</h2>
          <p className="mb-8 text-sm leading-relaxed text-muted">{d.account.profileBody}</p>
          <ProfileForm name={user.name} phone={user.phone} />
        </div>

        <div>
          <h2 className="eyebrow mb-3">{d.account.preferences}</h2>
          <p className="mb-8 text-sm leading-relaxed text-muted">{d.account.preferencesBody}</p>

          <dl className="flex flex-col divide-y divide-line border-y border-line">
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm">{d.common.language}</dt>
              <dd>
                <LanguageSwitcher />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm">{d.common.theme}</dt>
              <dd>
                <ThemeToggle />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm">{d.account.contactUs}</dt>
              <dd>
                <WhatsAppButton variant="outline" size="sm" label={d.whatsapp.speak} />
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="border border-dashed border-line px-6 py-14 text-center">
      <p className="display text-heading">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      <Link
        href={ctaHref}
        className="mt-7 inline-flex h-11 items-center rounded-xs border border-line-strong px-6 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors hover:border-fg hover:bg-fg hover:text-bg rtl:text-sm rtl:normal-case rtl:tracking-normal"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
