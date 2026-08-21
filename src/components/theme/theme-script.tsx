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

  // Scroll reveals hide their content until an observer switches them on, so
  // they must only ever hide when something is alive to switch them back. This
  // marks that scripts run at all, and then watches for the app to say it
  // actually hydrated — if the bundle never arrives, is blocked by an
  // extension, or throws on the way up, the flag is dropped and every revealed
  // block simply renders. A page that is merely un-animated beats a blank one.
  try {
    var el = document.documentElement;
    el.dataset.js = "";
    setTimeout(function () {
      if (!el.hasAttribute("data-hydrated")) delete el.dataset.js;
    }, 2500);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
