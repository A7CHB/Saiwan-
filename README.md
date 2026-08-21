# Saiwan

Premium outdoor shade — a trilingual storefront and a separate business admin.

Two products in one codebase:

- **The storefront** (`/en`, `/ar`, `/ckb`) — an editorial, photography-led site whose purpose is to get a
  qualified conversation started on WhatsApp.
- **The admin** (`/admin`) — a dense, neutral dashboard for running the catalogue, the inquiry pipeline and
  the content behind the site. It deliberately looks nothing like the storefront.

---

## Quick start

```bash
npm install
cp .env.example .env          # then edit — see "Environment" below
npm run db:push               # apply the schema
npm run db:bootstrap          # sample catalogue + the first administrator
npm run dev
```

- Storefront: <http://localhost:3000> (redirects to your best-matching language)
- Admin: <http://localhost:3000/admin> — signs in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`

Needs a Postgres to point `DATABASE_URL` at. The least work is a free
[Neon](https://neon.tech) database — nothing to install, and the same URL works
locally and deployed. **[DEPLOY.md](DEPLOY.md)** covers creating one and putting
the site on Vercel.

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Use the **pooled** one on serverless hosting. |
| `AUTH_SECRET` | Session signing key. **Must be 32+ characters** — the app refuses to sign tokens otherwise. `openssl rand -base64 48`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used once by the seed to create the first administrator. Change the password immediately after first sign-in. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, digits only (`9647500000000`). **Every WhatsApp button on the site reads this.** |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Used for `hreflang`, Open Graph, JSON-LD and the sitemap. |

---

## Architecture

```
src/
  app/
    (site)/[locale]/…      root layout #1 — storefront, RTL-aware, three languages
    (admin)/admin/…        root layout #2 — English, LTR, its own palette
    api/…                  search · analytics · product lookups · inquiries
    sitemap.ts robots.ts
  components/
    site/ product/ home/ quiz/   storefront
    admin/                        dashboard
    ui/ motion/ icons/            shared primitives
  lib/
    i18n/        locales, dictionaries, formatting
    data/        read models (products, catalogue, search, analytics)
    auth/        password hashing and sessions — the dashboard only
    admin/       admin server actions + form shaping
    whatsapp.ts  every outbound message is composed here
  proxy.ts       locale routing, visitor id, admin gate
```

Two root layouts (Next's route-group pattern) are what let the admin be a genuinely different product rather
than the storefront in a different skin.

**Data flows one way.** `lib/data/*` returns plain, fully-resolved view models — translations already picked,
JSON columns already parsed — so no page or component ever touches a Prisma row or reasons about locale
fallback.

### Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma + Postgres · `jose` for session tokens ·
`zod` for input validation. No UI kit, no animation library, no charting library — see "Deliberate decisions".

---

## Localisation

Three languages: **English**, **Arabic**, **Kurdish Sorani**. Arabic and Kurdish are right-to-left throughout —
not a mirrored stylesheet but logical properties (`ms-*`, `pe-*`, `start-*`) used everywhere, so layouts,
dropdown positions, icon directions and animation origins all flip correctly.

- Strings live in `src/lib/i18n/dictionaries/{en,ar,ckb}.ts`. English is the source of truth: `ar` and `ckb` are
  type-checked against it, so a missing key is a **build error**, never a blank space on a live page.
- Server components receive `d` (the dictionary) as a prop; client components read it from `LocaleProvider`.
  No component hardcodes a translated string.
- The business can override **any** string, in any language, from **Admin → Translations** without a deploy.
  Overrides are layered on top of the compiled dictionary at request time.
- Product, category, material, colour and gallery content is translated per-locale in the database, with an
  automatic fallback chain of `locale → English → whatever exists`.
- Typography switches with direction: Instrument Serif + Inter for Latin, IBM Plex Sans Arabic for both RTL
  scripts, with looser heading leading and no letterspaced micro-caps (which read as broken in Arabic).

Prices, dates and numbers are formatted with `Intl`, but **currency symbols are composed manually** — Node and
the browser ship different ICU data, and `style: "currency"` renders `US$ 2,400` on the server and `$2,400` in
Chrome, which is a hydration mismatch on every price.

---

## The WhatsApp flow

This is the product's conversion engine, and every CTA on the site routes through `src/lib/whatsapp.ts` so the
message format is identical everywhere.

Configuring a piece and tapping **Order via WhatsApp** opens a chat pre-filled with the product, size, colour,
quantity, accessories, the customer's name, their note, a reference code and a link back to the page. The
customer types nothing.

The same configuration is posted to `/api/inquiries` on the way out — via `sendBeacon`, because the click
navigates the tab away and a normal `fetch` would be cancelled, losing the most valuable event on the site.
That is what turns WhatsApp from a black hole into a pipeline the admin can work.

---

## Security

- **Sessions are server-side and revocable.** The cookie holds an opaque random token plus a signed JWT; the
  authority is always the `Session` row. Revoking it kills the session instantly, which a stateless JWT cannot.
- **The proxy is not authorisation.** It signature-checks the token to bounce anonymous traffic from `/admin`
  quickly. Every admin page and every server action independently calls `requireRole()` / `authorize()`, which
  re-reads the session row and the user's *live* role and active flag.
- **Server actions are public endpoints.** Every one of them starts with an authorisation call and parses its
  input with Zod, so a hand-crafted POST cannot set a column the form never exposed (`role`, `status`, …).
- **The storefront has no accounts at all.** Nobody signs in to browse, save or inquire, so there is no customer
  credential to leak, no password reset to abuse and no session to hijack. Accounts exist only for `/admin`.
- Passwords use scrypt at OWASP parameters. Admin sign-in is rate limited per IP, answers with one message for
  every failure mode, and computes a dummy hash for unknown accounts so response timing cannot enumerate users.
- Deleting is `ADMIN`-only and separated from the editors; `STAFF` can archive but not destroy.
- Changing a password or disabling an account signs that user out of every device immediately.
- Every mutation is written to `AuditLog`, visible in **Admin → Settings**.

---

## Performance & accessibility

- Animation is CSS; JavaScript only flips a `data-visible` attribute from an `IntersectionObserver`, so reveals
  never run on the main thread. `prefers-reduced-motion` disables all of it — and the reduced-motion block
  forces revealed content **visible**, so nothing can be hidden by an observer that never fires.
- **Nothing on the site needs JavaScript to be visible.** Hiding content is only safe while something is
  guaranteed to be around to unhide it, so every hidden reveal state is gated on a flag the head script sets and
  then withdraws if the app never signals that it hydrated. A bundle blocked by an extension, a stale cache or a
  chunk that 404s costs the animation, not the page. Images arrive the same way — a CSS animation, not a state
  update — so they paint before hydration and with it disabled.
- Images are AVIF/WebP through `next/image`, sized to the layout's real breakpoints, with explicit loading,
  loaded and **broken** states. The two exceptions are the home showroom's cut-out plates, which are served as
  authored WebP: Safari mishandles alpha in AVIF, and an opaque umbrella would cover the scene it stands in.
- The home showroom scrubs on scroll but renders once per *scene*, not per frame — every value the scroll
  drives is written straight to the node as opacity or transform. Its first frame is composed in the markup,
  so the opening shot is correct before any script runs.
- Keyboard support throughout: focus is trapped and restored in dialogs, the search and detail explorers are
  full arrow-key widgets, and visually-hidden checkboxes render their focus ring on the box beside them.
- Charts in the admin are hand-drawn SVG with a screen-reader table of the same numbers.
- `scripts/qa.mjs` asserts, on every route × 3 languages × 2 themes × 3 viewports: no console errors, no broken
  images, no missing `alt`, no horizontal overflow, correct `dir`/`lang`, and a sane heading outline.

---

## SEO

Per-page titles and descriptions in all three languages, canonical URLs, `hreflang` (including `x-default`),
Open Graph and Twitter cards, an auto-generated multilingual sitemap with alternates, `robots.txt`, and JSON-LD
for Organization, WebSite, Product and BreadcrumbList. The admin is `noindex` at both the header and metadata
level.

---

## Testing

```bash
npm run typecheck
npm run qa         # 25 routes × 3 languages × 2 themes × 3 viewports
npm run qa:flows   # 30 end-to-end assertions
```

`qa:flows` covers the configurator → WhatsApp message contents, RTL product pages, the consultation quiz,
instant search, contact-form validation and submission, the admin sign-in → product edit → propagation to
the site, the inquiry pipeline, **and** that anonymous visitors cannot reach `/admin`.

Both scripts need a running server (`npm run dev`) and exit non-zero on failure.

---

## The home page

**One object. Infinite spaces.** A single umbrella stands still while five environments — villa, resort,
dining, rooftop, garden — pass behind it. Scroll is the camera: it moves *into* the canopy at each boundary
until the fabric fills the frame, changes the world behind it, and pulls back out. That is why the umbrella is
a cut-out plate rather than part of each picture, and why the environments are generated umbrella-free.

`src/lib/home-scenes.ts` is the whole asset configuration: five entries, each an image, a crop and the
`Product.useCases` it stands for. Swapping a placeholder plate for a photograph is one line there and nothing
else — no component knows a path. The same `useCases` drive **Where will yours live?**, so the story ends in
the real catalogue rather than in a second, hand-kept list.

Four of the five environments are drawn, not photographed — `scripts/generate-environments.mjs`. They are
placeholders for photography of installed work, but they are not sketches: the vocabulary is perspective, so
paving converges on a vanishing point, walls recede as trapezoids toward it, and everything standing on the
floor is scaled by its depth. That is what makes a plate read as a place rather than as an abstract warm
rectangle, and a place is the minimum the concept needs.

Every plate follows three rules, because the showroom depends on them: square (the crop differs from a phone
to a desktop), horizon at 0.58 with the vanishing point centred (a replacement photograph must match this or
the umbrella will float), and nothing overhead in the middle (the umbrella is composited there — anything
drawn gives the scene two).

---

## Deliberate decisions

**No UI kit, animation library or charting library.** The visual identity is the product here; a component
library would have to be fought rather than used. Motion is ~120 lines of CSS plus an observer; the three
admin chart types are ~100 lines of SVG against ~100 kB of dependency that would still need restyling.

**WhatsApp instead of checkout.** Nothing about the data model prevents adding payments later — `Inquiry`
already carries the full configuration — but a cart would add friction to a business that closes on chat.

**The admin is English-only.** It is an internal tool, and a mistranslated status label costs more than it
saves. The storefront is fully trilingual.

**No customer accounts, anywhere.** Buying here means sending a WhatsApp message, and a sign-up wall in front
of that would only cost inquiries. The only piece of visitor state the site keeps is the comparison tray, in
the browser's own storage: no requests, no personal data on the server.

**The dashboard is a separate door.** `/admin` is its own root layout, its own palette and its own sign-in,
linked discreetly from the footer. The proxy bounces anonymous traffic and every page re-checks the live role.

**Features and specs are JSON on the translation row**, not separate tables. They are translated text belonging
to one product in one language, and modelling them as entities would buy nothing.

---

## Known limitations

- **404 status codes.** A genuinely unmatched URL returns a correct `404`. A programmatic `notFound()` renders
  the 404 page but responds `200` in this version of Next — so the product page handles a missing piece itself,
  with a localised "no longer listed" page and `noindex`, which is the signal that actually matters.
- **Rate limiting is in-process.** Fine for a single instance; behind more than one, move `lib/rate-limit.ts`
  to Redis or the platform's limiter. The interface is deliberately narrow so that is a one-file change.
- **Image uploads.** The admin takes image **URLs** (local paths or an allowed remote host). There is no upload
  widget yet; `public/uploads/` and the `remotePatterns` allowlist in `next.config.ts` are ready for one.
- **Postgres** everywhere, because the site deploys to serverless hosting where the filesystem is read-only
  and per-invocation. No model uses a provider-specific type, so the database is interchangeable.

---

## Before launch

The site is complete and functional; what it needs is **real content**.

1. **WhatsApp number** — set `NEXT_PUBLIC_WHATSAPP_NUMBER` and the matching field in Admin → Settings. Until
   then, buttons open WhatsApp with the message but no recipient.
2. **`AUTH_SECRET`** — replace the placeholder, and change the seeded admin password.
3. **Photography** — `public/media/*.svg` are composed brand plates, not photographs. They exist so the design
   could be built and reviewed before a shoot; replace them in Admin → Products/Gallery/Content. Prioritise
   villas, poolsides, rooftop terraces and restaurants.
4. **The catalogue** — every product, price, dimension and specification in the seed is *sample* data written
   to exercise the interface. Replace it with the real range before launch, or start from an empty database.
5. **Categories** — the seven shipped are a plausible structure, not an assertion about the business. Rename,
   reorder or replace them in Admin → Categories.
6. **Contact details** — studio address, email and response hours in Admin → Settings.
7. **Translation review** — the Arabic and Kurdish copy is written for the brand's register but should be read
   by a native speaker before launch. Anything can be corrected in Admin → Translations without a deploy.
