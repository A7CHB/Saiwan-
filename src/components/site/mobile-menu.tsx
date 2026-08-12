"use client";

import Link from "next/link";
import { Search as SearchIcon, User, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useLocale } from "@/components/i18n/locale-provider";
import { SaiwanLogo, CanopyRadial } from "@/components/icons/canopy";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import type { HeaderCategory } from "@/components/site/header";

/**
 * Full-screen navigation, not a dropdown. Links are set at display scale and
 * arrive in sequence — on mobile this is the brand's main stage, so it gets the
 * same typographic treatment as the desktop hero.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  categories,
  signedIn,
  userName,
  onOpenSearch,
}: {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  categories: HeaderCategory[];
  signedIn: boolean;
  userName: string | null;
  onOpenSearch: () => void;
}) {
  const { d, href } = useLocale();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={d.nav.menu}
      variant="full"
      className="p-0 sm:p-0"
      panelClassName="w-full"
    >
      <div className="relative flex h-dvh w-full flex-col overflow-y-auto bg-bg">
        <CanopyRadial className="pointer-events-none absolute -end-24 -top-24 size-[28rem] text-accent opacity-[0.07]" />

        <div className="shell flex h-16 shrink-0 items-center justify-between">
          <SaiwanLogo />
          <button
            type="button"
            onClick={onClose}
            aria-label={d.nav.closeMenu}
            data-autofocus
            className="flex size-10 items-center justify-center transition-opacity hover:opacity-60"
          >
            <X className="size-5" strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label={d.nav.primary} className="shell flex flex-1 flex-col justify-center py-10">
          <ul className="flex flex-col">
            {links.map((link, index) => (
              <li key={link.href} className="overflow-hidden border-b border-line last:border-b-0">
                <Link
                  href={href(link.href)}
                  onClick={onClose}
                  className="group flex items-baseline justify-between gap-4 py-5 animate-rise"
                  style={{ animationDelay: `${60 + index * 55}ms` }}
                >
                  <span className="display text-[clamp(2rem,9vw,3.25rem)] leading-[1.05] transition-colors duration-300 group-hover:text-accent">
                    {link.label}
                  </span>
                  <span className="eyebrow shrink-0 text-[0.5625rem] opacity-40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {categories.length > 0 ? (
            <div className="mt-10 animate-rise" style={{ animationDelay: "380ms" }}>
              <p className="eyebrow mb-4">{d.nav.categories}</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={href(`/collection?category=${category.slug}`)}
                      onClick={onClose}
                      className="link-underline text-sm text-muted transition-colors hover:text-fg"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </nav>

        <div className="shell shrink-0 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label={d.search.open}
                className="flex size-10 items-center justify-center transition-opacity hover:opacity-60"
              >
                <SearchIcon className="size-[18px]" strokeWidth={1.4} aria-hidden="true" />
              </button>
              <ThemeToggle />
              <Link
                href={href("/account")}
                onClick={onClose}
                className="flex h-10 items-center gap-2 px-2 text-sm transition-opacity hover:opacity-60"
              >
                <User className="size-[18px]" strokeWidth={1.4} aria-hidden="true" />
                <span className="max-w-28 truncate">{signedIn && userName ? userName : d.nav.account}</span>
              </Link>
            </div>
            <LanguageSwitcher />
          </div>

          <WhatsAppButton variant="brand" size="md" fullWidth label={d.whatsapp.speak} />
        </div>
      </div>
    </Dialog>
  );
}
