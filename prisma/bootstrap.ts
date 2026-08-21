/**
 * Seed a database that has never been seeded, and leave every other one alone.
 *
 * This runs as part of the deploy build, which is the only way the first deploy
 * of a brand new database can produce anything but empty pages: the storefront
 * is prerendered, so the catalogue has to exist *before* `next build` renders
 * it, and there is no earlier moment on the host to reach in and do that.
 *
 * The guard is the whole point. `db:seed` rewrites products, translations and
 * images wholesale so that re-running it never accumulates duplicates — which
 * also means running it against a live database would throw away everything
 * that has been edited in the dashboard since launch. So this asks one question
 * first, and does nothing at all if the answer is "there is already a
 * catalogue here".
 *
 * Run: npm run db:bootstrap
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.count();
  if (products > 0) {
    console.log(`→ Database already has ${products} products — leaving it untouched.`);
    return;
  }

  console.log("→ Empty database — seeding the sample catalogue.");
  await import("./seed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
