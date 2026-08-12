import { THEME_COOKIE } from "@/lib/constants";

/**
 * Runs before first paint so the page never flashes the wrong palette.
 * Order of authority: explicit cookie/localStorage choice → OS preference.
 * Kept as a raw string because it must execute synchronously in <head>.
 */
const script = `
(function () {
  try {
    var key = "${THEME_COOKIE}";
    var stored = null;
    try { stored = localStorage.getItem(key); } catch (e) {}
    if (!stored) {
      var match = document.cookie.match(new RegExp("(?:^|; )" + key + "=([^;]*)"));
      if (match) stored = decodeURIComponent(match[1]);
    }
    var theme = stored === "light" || stored === "dark" ? stored : null;
    var resolved = theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    root.dataset.theme = theme || "system";
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
