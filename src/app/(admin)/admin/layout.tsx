import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { ThemeScript } from "@/components/theme/theme-script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { FavoritesProvider } from "@/components/product/favorites-provider";
import en from "@/lib/i18n/dictionaries/en";

export const metadata: Metadata = {
  title: { default: "Saiwan Admin", template: "%s · Saiwan Admin" },
  // Belt and braces with the X-Robots-Tag header in next.config.ts.
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7F9" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1015" },
  ],
};

/**
 * The admin's own root layout.
 *
 * The app uses Next's multiple-root-layouts pattern: `(site)` and `(admin)` are
 * route groups that each own an `<html>` element. That is what lets the admin be
 * a different product — always English, always LTR, its own palette — rather
 * than the storefront wearing a different skin.
 *
 * Authorisation is NOT done here. Every admin page calls `requireRole()` itself,
 * because a layout is not a security boundary in the App Router: it can be
 * bypassed by a client-side navigation that only re-renders the page segment.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="admin min-h-dvh bg-bg text-fg antialiased">
        {/* The admin is English-only by decision: it is an internal business
            tool, and a mistranslated status label costs more than it saves.
            The provider is still present so shared components (theme toggle,
            media, dialogs) find the strings they expect. */}
        <LocaleProvider locale="en" dictionary={en}>
          <ThemeProvider>
            {/* The admin never saves pieces, but it shares components that read
                the context; the provider keeps them working. */}
            <FavoritesProvider>{children}</FavoritesProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
