"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { CanopyRadial } from "@/components/icons/canopy";

/**
 * Route-level error boundary. Sits inside the locale layout, so it still has a
 * dictionary and renders in the customer's language.
 */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { d } = useLocale();

  useEffect(() => {
    // The digest is the only safe handle on a production error — log it so it
    // can be matched against the server logs.
    console.error("Route error", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <CanopyRadial className="pointer-events-none absolute size-[34rem] text-accent opacity-[0.06]" />
      <div className="relative">
        <p className="eyebrow mb-6">500</p>
        <h1 className="display text-title text-balance">{d.error.serverTitle}</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">{d.error.serverBody}</p>
        <Button onClick={reset} size="lg" className="mt-9">
          {d.error.serverCta}
        </Button>
      </div>
    </div>
  );
}
