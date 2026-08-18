/**
 * Manual QA sweep.
 *
 * Walks every customer route in all three languages plus the whole admin, in
 * both themes and at three viewports, and reports console errors, page errors,
 * broken images, horizontal overflow and missing landmarks. Run against a
 * running dev or production server:
 *
 *   node qa.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const LOCALES = ["en", "ar", "ckb"];

const CUSTOMER_ROUTES = [
  "",
  "/collection",
  "/collection/aria",
  "/collection?category=cantilever&style=MODERN",
  "/find-your-shade",
  "/inspiration",
  "/inspiration?tag=pool",
  "/about",
  "/contact",
  "/search?q=cantilever",
  "/search?q=zzzzzz",
  "/saved",
  "/compare",
  "/this-route-does-not-exist",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/products",
  "/admin/products/new",
  "/admin/categories",
  "/admin/inquiries",
  "/admin/team",
  "/admin/gallery",
  "/admin/content",
  "/admin/translations",
  "/admin/analytics",
  "/admin/settings",
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

const issues = [];
const report = (severity, where, message) => issues.push({ severity, where, message });

/** Checks that hold on every page, whatever it is. */
async function auditPage(page, where) {
  const audit = await page.evaluate(() => {
    const doc = document.documentElement;
    const broken = Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src);
    const noAlt = Array.from(document.images).filter((img) => !img.hasAttribute("alt")).length;

    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) =>
      Number(h.tagName[1]),
    );
    let skipped = null;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        skipped = `h${headings[i - 1]} → h${headings[i]}`;
        break;
      }
    }

    return {
      dir: doc.getAttribute("dir"),
      lang: doc.getAttribute("lang"),
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      hasMain: Boolean(document.querySelector("main")),
      broken,
      noAlt,
      skipped,
      // A page must never scroll sideways; wide content scrolls inside its own box.
      overflowX: doc.scrollWidth - doc.clientWidth,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });

  if (audit.broken.length) report("error", where, `broken images: ${audit.broken.slice(0, 3).join(", ")}`);
  if (audit.noAlt) report("error", where, `${audit.noAlt} <img> without alt`);
  if (audit.overflowX > 2) report("error", where, `horizontal overflow of ${audit.overflowX}px`);
  if (!audit.title) report("error", where, "empty <title>");
  if (audit.h1Count === 0) report("warn", where, "no <h1>");
  if (audit.h1Count > 1) report("warn", where, `${audit.h1Count} <h1> elements`);
  if (audit.skipped) report("warn", where, `heading level skipped (${audit.skipped})`);
  if (audit.bodyBg === "rgba(0, 0, 0, 0)") report("error", where, "body has no background colour");

  return audit;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const scheme of ["light", "dark"]) {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: scheme,
    });

    // Sign in once per context so the admin routes are reachable.
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(`PAGEERROR ${error.message}`));

    await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
    await page.fill("input[name=email]", process.env.ADMIN_EMAIL ?? "admin@saiwan.com");
    await page.fill("input[name=password]", process.env.ADMIN_PASSWORD ?? "ChangeMe!2024");
    await page.click("button[type=submit]");
    await page.waitForURL("**/admin", { timeout: 30000 }).catch(() => {
      report("error", "admin/login", "sign-in did not reach the dashboard");
    });

    const routes = [
      ...LOCALES.flatMap((locale) => CUSTOMER_ROUTES.map((route) => `/${locale}${route}`)),
      ...ADMIN_ROUTES,
    ];

    for (const route of routes) {
      const where = `${scheme}/${viewport.name} ${route}`;
      consoleErrors.length = 0;

      const response = await page
        .goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 45000 })
        .catch((error) => {
          report("error", where, `navigation failed: ${error.message}`);
          return null;
        });

      if (!response) continue;

      const status = response.status();
      const expect404 = route.includes("this-route-does-not-exist");
      if (expect404 ? status !== 404 : status >= 400) {
        report("error", where, `HTTP ${status}`);
      }

      await page.waitForTimeout(250);
      const audit = await auditPage(page, where);

      // Language routes must carry the right direction and lang.
      const locale = route.split("/")[1];
      if (LOCALES.includes(locale) && !expect404) {
        const expectedDir = locale === "en" ? "ltr" : "rtl";
        if (audit.dir !== expectedDir) report("error", where, `dir="${audit.dir}", expected "${expectedDir}"`);
        if (!audit.lang?.startsWith(locale === "ckb" ? "ckb" : locale)) {
          report("error", where, `lang="${audit.lang}", expected "${locale}"`);
        }
        if (!audit.hasMain) report("warn", where, "no <main> landmark");
      }

      const noisy = consoleErrors.filter(
        (message) =>
          !message.includes("Download the React DevTools") &&
          !message.includes("Failed to load resource") &&
          !message.includes("favicon"),
      );
      if (noisy.length) report("error", where, `console: ${noisy.slice(0, 2).join(" | ")}`);
    }

    await context.close();
  }
}

await browser.close();

// ---------------------------------------------------------------------------

const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warn");

const summarise = (list) => {
  const grouped = new Map();
  for (const issue of list) {
    const existing = grouped.get(issue.message) ?? [];
    existing.push(issue.where);
    grouped.set(issue.message, existing);
  }
  return Array.from(grouped.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([message, where]) => `  ${where.length}× ${message}\n      e.g. ${where[0]}`)
    .join("\n");
};

console.log(`\n=== QA sweep: ${errors.length} errors, ${warnings.length} warnings ===\n`);
if (errors.length) console.log("ERRORS\n" + summarise(errors) + "\n");
if (warnings.length) console.log("WARNINGS\n" + summarise(warnings) + "\n");
if (!issues.length) console.log("No issues found.\n");

process.exit(errors.length ? 1 : 0);
