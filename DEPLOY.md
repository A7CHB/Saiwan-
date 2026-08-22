# Deploying Saiwan

The site runs on Vercel with a Postgres database, plus a Blob store if you want
to upload product photographs from the dashboard. Nothing else is required —
no image CDN, no queue. The catalogue's own images ship with the code.

Budget about fifteen minutes for the first deploy. Afterwards, deploys are a
`git push`.

---

## 1. Create the database

In the [Vercel dashboard](https://vercel.com) → **Storage** → **Create
Database** → **Neon** (Postgres). The free tier is well beyond what this site
needs.

Once created, open the database's **Quickstart** tab and copy the connection
string. It looks like:

```
postgresql://neondb_owner:xxxx@ep-something-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Use the one with **`-pooler`** in the hostname. Serverless hosting starts a new
instance per request, and without pooling those connections pile up until the
database refuses new ones.

---

## 2. Import the repository

Vercel → **Add New** → **Project** → import `A7CHB/Saiwan-`, and pick the branch
you want to deploy.

Leave the framework preset and build command alone. Vercel detects Next.js, and
`package.json` already runs migrations and the first-run seed before building:

```
prisma generate && prisma migrate deploy && tsx prisma/bootstrap.ts && next build
```

---

## 3. Set the environment variables

Before the first deploy, add these under **Settings → Environment Variables**.
Tick all three environments (Production, Preview, Development) unless noted.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | The pooled connection string from step 1. |
| `AUTH_SECRET` | A long random string. Generate with `openssl rand -base64 48`. |
| `ADMIN_EMAIL` | The address you want to sign in to the dashboard with. |
| `ADMIN_PASSWORD` | The password for that account. Change it after first sign-in. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | The business number, digits only, international format — e.g. `9647501234567`. No `+`, spaces or dashes. |
| `NEXT_PUBLIC_SITE_URL` | The deployed address, e.g. `https://saiwan.vercel.app`. Production only. |

`NEXT_PUBLIC_SITE_URL` is the one that is easy to forget and easy to spot: it
feeds canonical URLs, the sitemap and the WhatsApp share links, so if it still
says `localhost` in production the share cards will point at nothing.

---

## 4. Deploy

Hit **Deploy**. The first build will:

1. apply the schema to the empty database,
2. seed the sample catalogue and create the admin account,
3. prerender the storefront in all three languages.

Then open the deployment URL. The dashboard is at `/admin`, and the footer links
to it.

---

## Image uploads

The dashboard can upload product photographs straight from your computer, but
it needs somewhere to put them. Vercel's filesystem is read-only and thrown away
after each request, so an uploaded file has to go to storage.

In the Vercel dashboard: **Storage → Create Database → Blob**, then connect it
to the `saiwan` project. That sets `BLOB_READ_WRITE_TOKEN` for you. Redeploy and
the Upload button works.

Until you do, the button answers with exactly what is missing, and you can still
paste an image URL — nothing else in the dashboard is affected.

Uploads are limited to 8 MB and to formats a browser can display (JPEG, PNG,
WebP, AVIF, GIF), and only a signed-in member of staff can post to the endpoint.
Running locally with `npm run dev` needs no storage at all: files go to
`public/uploads`, which is gitignored.

---

## After the first deploy

**Deploys never touch your content.** The seed only runs against a database with
no products in it (`prisma/bootstrap.ts`), because re-seeding rewrites products,
translations and images wholesale — running it on a live site would throw away
everything edited in the dashboard. Once there is a catalogue, every later build
skips it and only applies migrations that have not run yet.

**Changing the schema.** Edit `prisma/schema.prisma`, then generate a migration
locally and commit it:

```bash
npx prisma migrate dev --name what-changed
```

The next deploy applies it. Do not use `prisma db push` against production — it
has no record of what it did and no way back.

**Starting the catalogue over.** `npm run db:reset` drops everything and
re-seeds. It is destructive and it does not ask twice, so point it at a
development database, never production.

---

## Running it locally

The simplest setup is to point local development at the same Neon database —
then there is no database to install, start or keep in sync:

```bash
git clone https://github.com/A7CHB/Saiwan-.git
cd Saiwan-
npm install
cp .env.example .env      # then paste your DATABASE_URL and AUTH_SECRET in
npm run dev
```

Open <http://localhost:3000>. If the database is empty, run `npm run
db:bootstrap` once first.

Be aware that this is the live content: an edit in your local dashboard is an
edit on the deployed site. If you would rather keep them apart, create a second
free Neon database for development and use that connection string in `.env`.

---

## Checking a deploy

Two harnesses run against any URL, local or deployed:

```bash
npm run qa       -- https://your-deployment.vercel.app   # every route × 3 languages × 2 themes × 3 viewports
npm run qa:flows -- https://your-deployment.vercel.app   # 42 end-to-end checks
```

`qa:flows` signs into the dashboard, edits a product and files an inquiry, so
run it against a preview deployment rather than production.
