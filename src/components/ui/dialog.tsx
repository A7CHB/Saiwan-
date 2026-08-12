"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/locale-provider";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal surface used by search, the image viewer, the mobile menu and the
 * admin's destructive confirmations.
 *
 * Handles the four things a hand-rolled dialog usually gets wrong: focus is
 * moved in and trapped, focus is restored to the trigger on close, Escape
 * closes, and the background is both scroll-locked and hidden from assistive
 * technology via aria-modal on a role="dialog" element.
 */
export function Dialog({
  open,
  onClose,
  children,
  label,
  className,
  panelClassName,
  variant = "center",
  closeOnBackdrop = true,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  className?: string;
  panelClassName?: string;
  variant?: "center" | "sheet" | "full" | "top";
  closeOnBackdrop?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const { dir } = useLocale();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    // Compensate for the removed scrollbar so the page does not jump.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    document.addEventListener("keydown", handleKeyDown, true);

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
      target.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, handleKeyDown]);

  if (!open || typeof document === "undefined") return null;

  const position =
    variant === "sheet"
      ? "items-end sm:items-center"
      : variant === "full"
        ? "items-stretch"
        : variant === "top"
          ? "items-start pt-[10vh]"
          : "items-center";

  const panelMotion =
    variant === "sheet"
      ? "w-full sm:max-w-lg animate-rise"
      : variant === "full"
        ? "w-full animate-fade"
        : "w-full max-w-lg animate-rise";

  return createPortal(
    <div
      dir={dir}
      className={cn("fixed inset-0 z-[100] flex justify-center px-4 py-4 sm:px-6", position, className)}
    >
      <div
        className="absolute inset-0 bg-[rgb(var(--c-overlay)/0.62)] backdrop-blur-[3px] animate-fade"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn("relative outline-none", panelMotion, panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
