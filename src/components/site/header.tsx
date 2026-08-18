"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/locale-provider";
import { useFavorites } from "@/components/product/favorites-provider";
import { SaiwanLogo } from "@/components/icons/canopy";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SearchDialog } from "@/components/site/search-dialog";
import { MobileMenu } from "@/components/site/mobile-menu";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export type HeaderCategory = { slug: string; name: string; count: number };

/**
 * The header is transparent while the hero fills the viewport and settles into
 * a hairline-bordered glass bar once the page has moved. It never hides on
 * scroll-down: a luxury site should keep the way out visible at all times.
 */
export function SiteHeader({ categories }: { categories: HeaderCategory[] }) {
  const { d, href } = useLocale();
  const { count } = useFavorites();
  const pathname = usePathname();
  const [settled, setSettled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Routes that render their own full-bleed hero start with a transparent bar.
  const overHero = /^\/[a-z-]+(\/)?$/.test(pathname) || /\/(inspiration|about)$/.test(pathname);

  useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/collection", label: d.nav.collection },
    { href: "/find-your-shade", label: d.nav.findYourShade },
    { href: "/inspiration", label: d.nav.inspiration },
    { href: "/about", label: d.nav.about },
    { href: "/contact", label: d.nav.contact },
  ];

  const transparent = overHero && !settled;

  return (
    <>
      <header
        data-print-hide
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          transparent
            ? "border-b border-transparent bg-transparent text-white"
            : "border-b border-line bg-[rgb(var(--c-bg)/0.82)] text-fg backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            href={href("/")}
            className="shrink-0 transition-opacity duration-300 hover:opacity-70"
            aria-label={d.meta.siteName}
          >
            <SaiwanLogo />
          </Link>

          <nav aria-label={d.nav.primary} className="hidden items-center gap-8 lg:flex xl:gap-10">
            {links.map((link) => {
              const active = pathname.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={href(link.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 rtl:text-sm rtl:normal-case rtl:tracking-normal",
                    active ? "opacity-100" : "opacity-70 hover:opacity-100",
                    active && "link-retract",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={d.search.open}
              className="flex size-10 items-center justify-center transition-opacity duration-300 hover:opacity-60"
            >
              <SearchIcon className="size-[18px]" strokeWidth={1.4} aria-hidden="true" />
            </button>

            <LanguageSwitcher compact />
            <ThemeToggle />

            <Link
              href={href("/saved")}
              aria-label={count > 0 ? d.saved.count.replace("{count}", String(count)) : d.nav.saved}
              className="relative hidden size-10 items-center justify-center transition-opacity duration-300 hover:opacity-60 sm:flex"
            >
              <Heart className="size-[18px]" strokeWidth={1.4} aria-hidden="true" />
              {count > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute end-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.5625rem] font-medium leading-4 text-accent-fg tabular-nums"
                >
                  {count}
                </span>
              ) : null}
            </Link>

            <WhatsAppButton
              variant={transparent ? "ghost-light" : "outline"}
              className="ms-1 hidden xl:inline-flex"
              size="sm"
              label={d.whatsapp.speak}
            />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={d.nav.openMenu}
              aria-expanded={menuOpen}
              className="flex size-10 items-center justify-center transition-opacity duration-300 hover:opacity-60 lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={links}
        categories={categories}
        onOpenSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}
