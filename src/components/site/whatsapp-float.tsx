"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/locale-provider";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { track } from "@/lib/analytics-client";
import { buildWhatsAppUrl, composeMessage, generalInquiryPayload } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Persistent WhatsApp affordance.
 *
 * Held back until the visitor has scrolled past the hero — appearing instantly
 * over a cinematic first frame would undercut it. The label expands on hover on
 * pointer devices and stays a bare circle on touch, where screen space is
 * scarce and the icon is already unambiguous.
 */
export function WhatsAppFloat() {
  const { d } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const url = buildWhatsAppUrl(composeMessage(d, generalInquiryPayload(d)));

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-print-hide
      onClick={() => track("whatsapp_click", { meta: { label: "float" } })}
      aria-label={d.a11y.openWhatsApp}
      className={cn(
        "group fixed bottom-5 end-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-[#04150b] shadow-[0_16px_40px_-12px_rgba(37,211,102,0.6)]",
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1fbe59]",
        "sm:bottom-8 sm:end-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[0.6875rem] font-medium uppercase tracking-[0.16em] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[16rem] group-hover:opacity-100 rtl:normal-case rtl:tracking-normal rtl:text-xs lg:inline">
        {d.whatsapp.float}
      </span>
    </a>
  );
}
