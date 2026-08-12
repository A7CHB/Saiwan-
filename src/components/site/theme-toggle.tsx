"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { useLocale } from "@/components/i18n/locale-provider";

/**
 * Single-tap light/dark switch. The two glyphs are cross-faded and rotated
 * rather than swapped, so the control never jumps between paints.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const { d } = useLocale();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={d.a11y.themeToggle}
      aria-pressed={isDark}
      title={isDark ? d.common.light : d.common.dark}
      className={cn(
        "relative flex size-10 items-center justify-center transition-opacity duration-300 hover:opacity-60",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-[18px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute size-[18px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
        strokeWidth={1.4}
        aria-hidden="true"
      />
    </button>
  );
}
