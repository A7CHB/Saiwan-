"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/locale-provider";
import { SaiwanWordmark } from "@/components/icons/logo";
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
        {/* White type over a hero is only legible while the hero happens to be
            dark behind it, and the showroom's sky is not. A short scrim under
            the bar costs nothing visually and stops the logo dissolving into a
            cloud — most visible on a phone, where the bar sits over the
            brightest part of the frame. */}
        {transparent ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-black/45 via-black/20 to-transparent"
          />
        ) : null}

        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            href={href("/")}
            className="shrink-0 transition-opacity duration-300 hover:opacity-70"
            aria-label={d.meta.siteName}
          >
            <SaiwanWordmark className="h-9 w-auto lg:h-12" />
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

            {/* Both of these are in the mobile menu, so the phone header can
                stay down to the two things you actually reach for. */}
            <div className="hidden items-center gap-1 lg:flex sm:gap-2">
              <LanguageSwitcher compact />
              <ThemeToggle />
            </div>

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
