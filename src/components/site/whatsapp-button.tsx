"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/locale-provider";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { track } from "@/lib/analytics-client";
import {
  buildWhatsAppUrl,
  composeMessage,
  generalInquiryPayload,
  type WhatsAppPayload,
} from "@/lib/whatsapp";

type Variant = "solid" | "outline" | "ghost-light" | "brand" | "ink";

const variants: Record<Variant, string> = {
  solid: "bg-fg text-bg border border-fg hover:bg-accent hover:border-accent hover:text-accent-fg",
  ink: "bg-accent text-accent-fg border border-accent hover:bg-accent-hover hover:border-accent-hover",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg",
  "ghost-light": "border border-white/35 text-white hover:bg-white hover:text-black",
  brand: "bg-[#25D366] text-[#04150b] border border-[#25D366] hover:bg-[#1fbe59] hover:border-[#1fbe59]",
};

const sizes = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-12 px-7 text-[0.75rem]",
  lg: "h-14 px-9 text-[0.8125rem]",
};

/**
 * The site's conversion primitive. Every WhatsApp CTA — hero, product, quiz,
 * footer, floating bubble — routes through this component so the message format
 * and the click tracking are identical everywhere.
 */
export function WhatsAppButton({
  payload,
  label,
  variant = "solid",
  size = "md",
  className,
  productId,
  fullWidth,
  showIcon = true,
  onBeforeOpen,
}: {
  /** Omit for a generic "talk to us" link. */
  payload?: WhatsAppPayload;
  label?: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  productId?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
  /** Return false to cancel (used by the product form to validate first). */
  onBeforeOpen?: () => boolean | void;
}) {
  const { d } = useLocale();

  const url = useMemo(
    () => buildWhatsAppUrl(composeMessage(d, payload ?? generalInquiryPayload(d))),
    [d, payload],
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={d.a11y.openWhatsApp}
      onClick={(event) => {
        if (onBeforeOpen && onBeforeOpen() === false) {
          event.preventDefault();
          return;
        }
        track("whatsapp_click", { productId, meta: { label: label ?? "generic" } });
      }}
      className={cn(
        "group/wa inline-flex items-center justify-center gap-2.5 rounded-xs font-sans font-medium uppercase tracking-[0.14em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rtl:normal-case rtl:tracking-normal",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {showIcon ? (
        <WhatsAppIcon className="size-4 shrink-0 transition-transform duration-500 group-hover/wa:scale-110" />
      ) : null}
      <span>{label ?? d.whatsapp.inquire}</span>
    </a>
  );
}
