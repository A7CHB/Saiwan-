import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

/** A 404 must never be indexed, whatever status code carries it. */
export const metadata: Metadata = {
  title: "Page not found · Saiwan",
  robots: { index: false, follow: false },
};

/**
 * App-level 404.
 *
 * Reached only for paths outside both root layouts — the locale catch-all
 * handles everything under `/{locale}/…`. Next supplies the document shell for
 * this file when multiple root layouts are in use, so it must NOT render its own
 * <html>/<body>: doing so nests one document inside another.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 py-20 text-center text-fg">
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-5 text-2xl tracking-tight sm:text-3xl">Page not found</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        The page you are looking for has moved or never existed. Choose a language to continue.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/en"
          className="inline-flex h-12 items-center rounded-xs bg-fg px-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent hover:text-accent-fg"
        >
          English
        </Link>
        <Link
          href="/ar"
          className="inline-flex h-12 items-center rounded-xs border border-line-strong px-8 text-[0.9375rem] transition-colors hover:border-fg"
        >
          العربية
        </Link>
        <Link
          href="/ckb"
          className="inline-flex h-12 items-center rounded-xs border border-line-strong px-8 text-[0.9375rem] transition-colors hover:border-fg"
        >
          کوردی
        </Link>
      </div>
    </div>
  );
}
