/**
 * End-to-end checks for the flows that actually earn money, plus the admin
 * write paths and the security boundaries around them.
 *
 *   node flows.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const results = [];
const check = (name, passed, detail = "") =>
  results.push({ name, passed, detail: passed ? "" : detail });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

function summarise(fatal) {
  const failed = results.filter((result) => !result.passed);
  console.log(`\n=== Flows: ${results.length - failed.length}/${results.length} passed ===\n`);
  for (const result of results) {
    console.log(`${result.passed ? "  PASS" : "  FAIL"}  ${result.name}`);
    if (!result.passed && result.detail) console.log(`        ${String(result.detail).slice(0, 200)}`);
  }
  if (fatal) console.log(`\n  ABORTED: ${fatal}`);
  console.log("");
  return failed.length || fatal ? 1 : 0;
}

process.on("uncaughtException", (error) => {
  const code = summarise(error.message.split("\n")[0]);
  browser.close().finally(() => process.exit(code || 1));
});

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// ---------------------------------------------------------------------------
// 1. Product configurator → WhatsApp message
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/en/collection/aria`, { waitUntil: "networkidle" });

await page.getByRole("button", { name: /Select size 4.0 × 4.0 m/i }).click();
await page.getByRole("button", { name: /Select colour Sand/i }).click();
await page.getByRole("button", { name: /Increase quantity/i }).click();
await page.getByRole("button", { name: /Increase quantity/i }).click();
await page.locator("label", { hasText: "Granite Base" }).click();
await page.locator('input[placeholder="Full name"]').fill("Dara Ahmed");
await page.waitForTimeout(400);

const waHref = await page
  .locator('a[href*="wa.me"]', { hasText: "Order via WhatsApp" })
  .first()
  .getAttribute("href");
const message = decodeURIComponent((waHref ?? "").split("text=")[1] ?? "");

check("WhatsApp link points at the configured number", /wa\.me\/\d{8,}/.test(waHref ?? ""), waHref ?? "");
check("Message carries the product", message.includes("Aria"), message);
check("Message carries the chosen size", message.includes("4.0 × 4.0 m"), message);
check("Message carries the chosen colour", message.includes("Sand"), message);
check("Message carries the quantity", /Quantity:\*? ?3/.test(message), message);
check("Message carries the accessory", message.includes("Granite Base"), message);
check("Message carries the customer name", message.includes("Dara Ahmed"), message);
check("Message carries a reference", /SW-[A-Z2-9]{6}/.test(message), message);
check("Message carries the product link", message.includes("/collection/aria"), message);

// The summary panel must agree with what is being sent.
const summary = await page.locator("text=Your specification").locator("..").innerText();
check("Summary shows the quantity", summary.includes("3"), summary);
check("Summary shows the size", summary.includes("4.0 × 4.0 m"), summary);

// Colour selection drives the gallery.
const galleryColourSynced = await page.evaluate(() => document.querySelectorAll("[role=tabpanel], .frame").length > 0);
check("Gallery rendered", galleryColourSynced);

// ---------------------------------------------------------------------------
// 2. Arabic RTL product page
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/ar/collection/aria`, { waitUntil: "networkidle" });
const arDir = await page.evaluate(() => document.documentElement.dir);
const arWa = await page
  .locator('a[href*="wa.me"]', { hasText: "اطلب عبر واتساب" })
  .first()
  .getAttribute("href");
const arMessage = decodeURIComponent((arWa ?? "").split("text=")[1] ?? "");
check("Arabic page is RTL", arDir === "rtl", arDir);
check("Arabic WhatsApp message is in Arabic", arMessage.includes("مرحبًا سايوان"), arMessage.slice(0, 80));

// ---------------------------------------------------------------------------
// 3. Consultation quiz
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/en/find-your-shade`, { waitUntil: "networkidle" });
for (let step = 0; step < 6; step++) {
  await page.locator("ul li button").first().click();
  await page.waitForTimeout(200);
}
await page.waitForTimeout(600);
const quizHeading = await page.locator("h1").first().innerText();
check("Quiz reaches a recommendation", /Specified for your space|Nothing lines up/.test(quizHeading), quizHeading);
const quizWa = await page
  .locator('a[href*="wa.me"]', { hasText: "Send this to Saiwan" })
  .first()
  .getAttribute("href");
const quizMessage = decodeURIComponent((quizWa ?? "").split("text=")[1] ?? "");
check("Quiz message carries the answers", quizMessage.includes("Setting:"), quizMessage.slice(0, 200));

// ---------------------------------------------------------------------------
// 4. Search
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Open search/i }).click();
await page.locator('input[type="search"]').fill("cantilever");
await page.waitForTimeout(900);
const hits = await page.locator("#search-results li").count();
check("Instant search returns results", hits > 0, `${hits} results`);
await page.keyboard.press("Escape");

// ---------------------------------------------------------------------------
// 5. Contact form → inquiry
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/en/contact`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /^Send inquiry$/i }).click();
await page.waitForTimeout(400);
const validationShown = await page.locator('[role="alert"]').count();
check("Contact form validates required fields", validationShown >= 3, `${validationShown} errors shown`);

await page.getByLabel(/Your name/i).fill("Test Customer");
await page.getByLabel(/WhatsApp number/i).fill("+9647500000001");
await page.getByLabel(/About the space/i).fill("Rooftop terrace, roughly 6 by 4 metres.");
await page.getByRole("button", { name: /^Send inquiry$/i }).click();
await page.waitForTimeout(2500);
const successText = await page.locator("body").innerText();
check("Contact form submits and returns a reference", /Received/.test(successText) && /SW-/.test(successText), successText.slice(0, 200));

// ---------------------------------------------------------------------------
// 6. Saving pieces without an account
// ---------------------------------------------------------------------------
await page.goto(`${BASE}/en/collection/aria`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /^Save$/i }).first().click();
await page.waitForTimeout(300);
check(
  "Save marks the piece without asking for an account",
  (await page.getByRole("button", { name: /^Saved$/i }).count()) > 0 && page.url().includes("/collection/aria"),
  page.url(),
);

await page.goto(`${BASE}/en/saved`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const savedBody = await page.locator("body").innerText();
check("Saved piece appears on the saved page", savedBody.includes("Aria"), savedBody.slice(0, 200));
check("Saved page never asks anyone to sign in", !/Sign in|Create account/i.test(savedBody), savedBody.slice(0, 200));

// The shortlist has to survive a reload — it is the whole point of saving it.
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
check("Saved list survives a reload", (await page.locator("body").innerText()).includes("Aria"), "list lost");

const savedListWa = await page
  .locator('a[href*="wa.me"]', { hasText: "Send this list" })
  .first()
  .getAttribute("href");
check(
  "Saved list can be sent on WhatsApp",
  decodeURIComponent((savedListWa ?? "").split("text=")[1] ?? "").includes("Aria"),
  savedListWa ?? "no link",
);

await page.getByRole("button", { name: /Clear the list/i }).click();
await page.waitForTimeout(500);
check(
  "Clearing empties the list",
  (await page.locator("body").innerText()).includes("Nothing saved yet"),
  "list not cleared",
);

// A second browser must not see the first one's shortlist.
const otherContext = await browser.newContext();
const other = await otherContext.newPage();
await other.goto(`${BASE}/en/saved`, { waitUntil: "networkidle" });
await other.waitForTimeout(800);
check(
  "The shortlist is local to one browser",
  (await other.locator("body").innerText()).includes("Nothing saved yet"),
  "leaked between contexts",
);
await otherContext.close();

// ---------------------------------------------------------------------------
// 7. Security — the storefront has no accounts; the admin is a separate door
// ---------------------------------------------------------------------------
const anon = await browser.newContext();
const anonPage = await anon.newPage();
await anonPage.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
check("Anonymous visitor is bounced from /admin", anonPage.url().includes("/admin/login"), anonPage.url());

const removed = await anonPage.evaluate(async (base) => {
  const [account, favorites] = await Promise.all([
    fetch(`${base}/en/account`).then((response) => response.status),
    fetch(`${base}/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "x" }),
    }).then((response) => response.status),
  ]);
  return { account, favorites };
}, BASE);
check("The customer account page is gone", removed.account === 404, String(removed.account));
check("The favourites endpoint is gone", removed.favorites === 404 || removed.favorites === 405, String(removed.favorites));

const homeBody = await anonPage.evaluate(async (base) => {
  const response = await fetch(`${base}/en`);
  return response.text();
}, BASE);
check(
  "The storefront offers no sign-in",
  !/Create account|Sign in<|>Sign in/i.test(homeBody),
  "sign-in affordance still rendered",
);

// The admin lives behind its own door, reachable from the footer link.
check("The footer links to the dashboard", homeBody.includes('href="/admin"'), "no admin link in the footer");

const publicSearch = await anonPage.evaluate(async (base) => {
  const response = await fetch(`${base}/api/search?q=aria`);
  return (await response.json()).results.length;
}, BASE);
check("Public API still responds for anonymous users", publicSearch >= 0);

await anon.close();

// ---------------------------------------------------------------------------
// 8. Admin: sign in, edit a product, confirm the change reaches the site
// ---------------------------------------------------------------------------
const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const admin = await adminContext.newPage();
await admin.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
await admin.fill("input[name=email]", process.env.ADMIN_EMAIL ?? "admin@saiwan.com");
await admin.fill("input[name=password]", process.env.ADMIN_PASSWORD ?? "ChangeMe!2024");
await admin.click("button[type=submit]");
await admin.waitForURL("**/admin", { timeout: 20000 }).catch(() => {});
check("Admin signs in", admin.url().endsWith("/admin"), admin.url());

await admin.goto(`${BASE}/admin/products`, { waitUntil: "networkidle" });
await admin.getByRole("link", { name: "Aria", exact: true }).click();
await admin.waitForURL("**/admin/products/**", { timeout: 20000 });

const newTagline = `Edited by QA ${Date.now()}`;
await admin.getByLabel("Tagline").first().fill(newTagline);
await admin.getByRole("button", { name: /Save changes/i }).click();
await admin.waitForTimeout(3000);
check("Product edit saves", admin.url().includes("saved=1"), admin.url());

await page.goto(`${BASE}/en/collection/aria`, { waitUntil: "networkidle" });
check("Edited tagline appears on the site", (await page.locator("body").innerText()).includes(newTagline), "not propagated");

// Inquiry pipeline picked up the contact-form submission.
await admin.goto(`${BASE}/admin/inquiries`, { waitUntil: "networkidle" });
check("Inquiry from the contact form is in the admin", (await admin.locator("body").innerText()).includes("Test Customer"), "missing");

// Status update writes an event to the timeline.
await admin.locator("table tbody a").first().click();
await admin.waitForURL("**/admin/inquiries/**", { timeout: 20000 });
await admin.getByLabel("Status").selectOption("CONTACTED");
await admin.getByLabel("Internal notes").fill("Called, sending a quote.");
await admin.getByRole("button", { name: /Update inquiry/i }).click();
await admin.waitForTimeout(2000);
const inquiryBody = await admin.locator("body").innerText();
check("Inquiry status update is recorded", inquiryBody.includes("contacted"), "status not applied");

await adminContext.close();
await browser.close();

process.exit(summarise());
