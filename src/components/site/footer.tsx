import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { CategoryView } from "@/lib/data/catalog";
import { CanopyRadial } from "@/components/icons/canopy";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { LanguageSwitcher } from "@/components/site/language-switcher";

/**
 * A server component: the footer is almost entirely static links, so shipping
 * it as client JavaScript would be waste. Only the language switcher and the
 * WhatsApp button (which tracks clicks) are interactive islands.
 */
export function SiteFooter({
  locale,
  d,
  categories,
}: {
  locale: Locale;
  d: Dictionary;
  categories: CategoryView[];
}) {
  const p = (path: string) => localePath(locale, path);
  const year = new Date().getFullYear();

  const columns = [
    {
      title: d.footer.explore,
      links: [
        { href: "/collection", label: d.nav.collection },
        { href: "/find-your-shade", label: d.nav.findYourShade },
        { href: "/inspiration", label: d.nav.inspiration },
        { href: "/saved", label: d.nav.saved },
        { href: "/search", label: d.common.search },
      ],
    },
    {
      title: d.nav.categories,
      links: categories.map((category) => ({
        href: `/collection?category=${category.slug}`,
        label: category.name,
      })),
    },
    {
      title: d.footer.company,
      links: [
        { href: "/about", label: d.nav.about },
        { href: "/contact", label: d.nav.contact },
      ],
    },
  ];

  return (
    <footer data-print-hide className="relative overflow-hidden border-t border-line bg-sunken">
      <CanopyRadial className="pointer-events-none absolute -bottom-40 -end-32 size-[34rem] text-accent opacity-[0.06]" />

      {/* Conversion panel — the last thing a scrolling visitor sees. */}
      <div className="shell relative border-b border-line py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow mb-5">{d.contact.eyebrow}</p>
            <h2 className="display max-w-2xl text-title text-balance">{d.about.cta.title}</h2>
            <p className="mt-5 max-w-md text-muted leading-relaxed">{d.about.cta.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <WhatsAppButton variant="ink" size="lg" label={d.whatsapp.speak} />
            <Link
              href={p("/contact")}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xs border border-line-strong px-9 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 hover:border-fg hover:bg-fg hover:text-bg rtl:normal-case rtl:tracking-normal"
            >
              {d.nav.contact}
            </Link>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="shell relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-14">
        <div>
          <p className="display text-[clamp(2rem,5vw,3rem)] leading-none tracking-[0.16em]">SAIWAN</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{d.footer.tagline}</p>
          <div className="mt-7">
            <p className="eyebrow mb-2 text-[0.5625rem]">{d.contact.hours}</p>
            <p className="text-sm text-muted">{d.contact.hoursValue}</p>
          </div>
        </div>

        {columns.map((column) =>
          column.links.length === 0 ? null : (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="eyebrow mb-5">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      href={p(link.href)}
                      className="link-underline text-sm text-muted transition-colors duration-300 hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ),
        )}
      </div>

      {/* Bottom bar */}
      <div className="shell relative flex flex-col gap-5 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">
          © {year} {d.meta.siteName}. {d.footer.rights}
        </p>

        <div className="flex flex-wrap items-center gap-5">
          <p className="hidden text-xs text-subtle sm:block">{d.footer.madeIn}</p>
          <a
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-subtle transition-colors hover:text-accent"
          >
            Admin
            <ArrowUpRight className="size-3 flip-rtl" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
