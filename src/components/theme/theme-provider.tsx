"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { THEME_COOKIE } from "@/lib/constants";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  /** What the user chose. */
  preference: ThemePreference;
  /** What is actually painted right now. */
  resolved: "light" | "dark";
  setPreference: (value: ThemePreference) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function persist(value: ThemePreference) {
  try {
    localStorage.setItem(THEME_COOKIE, value);
  } catch {
    /* private browsing */
  }
  // Mirrored to a cookie so the server can render the right palette on the
  // first response for a returning visitor.
  document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start from whatever ThemeScript already decided — avoids a second flash.
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const initial = (root.dataset.theme as ThemePreference) || "system";
    setPreferenceState(initial);
    setResolved(root.classList.contains("dark") ? "dark" : "light");
  }, []);

  const apply = useCallback((value: ThemePreference) => {
    const next = value === "system" ? systemTheme() : value;
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    root.dataset.theme = value;
    setResolved(next);
  }, []);

  const setPreference = useCallback(
    (value: ThemePreference) => {
      setPreferenceState(value);
      persist(value);
      apply(value);
    },
    [apply],
  );

  // Track the OS only while the user is on "system".
  useEffect(() => {
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference, apply]);

  const toggle = useCallback(() => {
    setPreference(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPreference]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, toggle }),
    [preference, resolved, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
