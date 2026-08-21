/**
 * Derive every brand asset from the two masters in `brand/`.
 *
 * `brand/saiwan-logo.pdf` is the identity as the designer delivered it: two
 * pages, dark-on-cream and cream-on-dark. `brand/saiwan-products.pdf` is six
 * product renders, each already cut out against transparency.
 *
 * Nothing here is traced by hand and nothing is redrawn. The point of keeping
 * the masters in the repository and generating from them is that the logo on
 * the site can be proven to be *the* logo — re-run this and the output is
 * byte-identical, so a designer handing over a revised PDF is a one-command
 * update rather than an afternoon in a vector editor.
 *
 * Two decisions worth knowing about:
 *
 *   The logo is vectorised, not exported as a bitmap. The delivered PDF is a
 *   Canva export whose artwork is flattened raster, so the letterforms are
 *   traced back to outlines with potrace. That buys a mark that is sharp at
 *   any size and — because the paths carry no colour — one that can be painted
 *   with `currentColor`. Light mode and dark mode are then the same asset,
 *   which is why there is no `logo-dark.svg` here despite the master having a
 *   dark page. The second page was checked against the first; the artwork is
 *   identical and only the colours are swapped.
 *
 *   The product renders keep their alpha and are written as WebP. They are
 *   photographic-weight images of an object with a soft edge, so PNG would be
 *   several megabytes and a JPEG cannot hold the cut-out at all.
 *
 * Requires poppler-utils (pdftoppm, pdfimages) and potrace on PATH.
 *
 * Run: npm run brand
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = join(ROOT, "brand");
const MEDIA = join(ROOT, "public", "media");
const PUBLIC = join(ROOT, "public");
const ICONS = join(ROOT, "src", "components", "icons");

const work = mkdtempSync(join(tmpdir(), "saiwan-brand-"));
const scratch = (name) => join(work, name);

mkdirSync(MEDIA, { recursive: true });

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------

/**
 * The lockup is dark artwork on a cream field, so a luminance threshold
 * separates ink from paper exactly. 200dpi over a 1500pt page gives a ~4200px
 * bitmap — far more than the tracer needs, which is the point: the curve fit
 * should be limited by the artwork, not by the raster it was sampled from.
 */
const LOGO_DPI = 200;
const INK = 128;

execFileSync("pdftoppm", ["-png", "-r", String(LOGO_DPI), "-f", "1", "-l", "1",
  join(BRAND, "saiwan-logo.pdf"), scratch("logo")]);

const page = sharp(scratch("logo-1.png")).greyscale();
const { data, info } = await page.raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;

/** 1 where there is ink. The tracer wants black on white, so it is inverted on write. */
const ink = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) ink[i] = data[i * C] < INK ? 1 : 0;

const bounds = (predicate) => {
  let minX = W;
  let minY = H;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!ink[y * W + x] || !predicate(x, y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
};

const all = bounds(() => true);

/**
 * Split the wordmark from the tagline on the widest empty band of rows between
 * them. Measuring the gap rather than hardcoding a fraction means a re-issued
 * logo with different leading still splits in the right place.
 */
const rowHas = new Uint8Array(H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (ink[y * W + x]) { rowHas[y] = 1; break; }
  }
}
let gapStart = -1;
let best = { start: -1, len: 0 };
for (let y = all.minY; y <= all.maxY; y++) {
  if (!rowHas[y]) {
    if (gapStart < 0) gapStart = y;
  } else if (gapStart >= 0) {
    const len = y - gapStart;
    if (len > best.len) best = { start: gapStart, len };
    gapStart = -1;
  }
}
if (best.start < 0) throw new Error("no blank band between wordmark and tagline");
const split = best.start + Math.floor(best.len / 2);

/**
 * The umbrella glyph stands in for the "I". It is the connected shape that
 * reaches highest on the page, so a flood fill from the topmost ink pixel
 * isolates it without needing to know where it sits.
 */
const glyph = new Uint8Array(W * H);
{
  let seed = -1;
  for (let i = 0; i < W * H && seed < 0; i++) if (ink[i]) seed = i;
  const stack = [seed];
  glyph[seed] = 1;
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p - x) / W;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (ink[q] && !glyph[q]) { glyph[q] = 1; stack.push(q); }
      }
    }
  }
}
const glyphBox = bounds((x, y) => glyph[y * W + x] === 1);

/** Trace one rectangle of the page and return potrace's path data and viewBox. */
const trace = (box, mask) => {
  const w = box.maxX - box.minX + 1;
  const h = box.maxY - box.minY + 1;
  const px = Buffer.alloc(w * h, 255);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y + box.minY) * W + (x + box.minX);
      if (ink[p] && (!mask || mask[p])) px[y * w + x] = 0;
    }
  }
  writeFileSync(scratch("t.pgm"), Buffer.concat([Buffer.from(`P5\n${w} ${h}\n255\n`), px]));
  execFileSync("potrace", [scratch("t.pgm"), "-s", "-o", scratch("t.svg"),
    "--turdsize", "3", "--alphamax", "1", "--opttolerance", "0.2"]);

  const svg = readFileSync(scratch("t.svg"), "utf8");
  // potrace emits the artwork inside a <g> that flips the y axis and scales
  // from its internal units. Keeping that transform verbatim and adopting its
  // viewBox is exact; re-deriving the numbers would only invite drift.
  const g = svg.match(/<g([^>]*)>([\s\S]*?)<\/g>/);
  const view = svg.match(/viewBox="([^"]+)"/);
  if (!g || !view) throw new Error("unexpected potrace output");
  // potrace hard-wraps its path data; the newlines are legal in SVG but not
  // inside a quoted TypeScript string, so they are collapsed on the way out.
  const d = [...g[2].matchAll(/ d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, " ").trim());
  return {
    viewBox: view[1].replace(/\.0+(?=\s|$)/g, ""),
    transform: (g[1].match(/transform="([^"]+)"/) ?? [, ""])[1],
    paths: d,
  };
};

const mark = trace(glyphBox, glyph);
const wordmark = trace({ ...all, maxY: split }, null);
const tagline = trace({ ...all, minY: split }, null);

/**
 * Emitted as a module of path data rather than as .svg files because the
 * header renders the logo inline: an <img> cannot inherit `currentColor`, and
 * a logo that needs one file per theme is a logo that will eventually be wrong
 * in one of them.
 */
const literal = (name, part) => `export const ${name} = {
  viewBox: "${part.viewBox}",
  transform: "${part.transform}",
  paths: [
${part.paths.map((d) => `    "${d}",`).join("\n")}
  ],
} as const;`;

writeFileSync(join(ICONS, "logo-art.ts"), `/**
 * Outlines traced from brand/saiwan-logo.pdf. Generated — do not edit by hand.
 *
 * The paths carry no colour, so whatever renders them decides: the site paints
 * with \`currentColor\` and gets light and dark mode from one set of outlines.
 *
 * Regenerate with: npm run brand
 */

export type LogoArt = {
  readonly viewBox: string;
  readonly transform: string;
  readonly paths: readonly string[];
};

/** The cantilever umbrella that stands in for the "I". */
${literal("MARK_ART", mark)}

/** SAIWAN, umbrella included. */
${literal("WORDMARK_ART", wordmark)}

/** OUTDOOR UMBRELLA. */
${literal("TAGLINE_ART", tagline)}
`);

const svgFile = (part, colour) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${part.viewBox}" fill="${colour}">
<g transform="${part.transform}">
${part.paths.map((d) => `<path d="${d}"/>`).join("\n")}
</g>
</svg>
`;

// A standalone file for the places that cannot inline: favicons, OG cards,
// e-mail. These do need an explicit colour, so they get the brand ink.
const INK_HEX = "#2E2519";
writeFileSync(join(PUBLIC, "icon.svg"), svgFile(mark, INK_HEX));
writeFileSync(join(MEDIA, "logo-mark.svg"), svgFile(mark, "currentColor"));
writeFileSync(join(MEDIA, "logo-wordmark.svg"), svgFile(wordmark, "currentColor"));

// Raster icons. Padded to 12% so the glyph is not cropped by the rounded mask
// iOS applies, and flattened onto the brand cream because a transparent home
// screen icon renders black on most devices.
const CREAM = "#EFE6D8";
const markPng = async (size, pad, background) => {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(Buffer.from(svgFile(mark, INK_HEX)))
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  }).composite([{ input: art, gravity: "center" }]).png().toBuffer();
};

const apple = await markPng(180, 0.12, CREAM);
writeFileSync(join(PUBLIC, "apple-icon.png"), apple);
writeFileSync(join(PUBLIC, "apple-touch-icon.png"), apple);
writeFileSync(join(PUBLIC, "apple-touch-icon-precomposed.png"), apple);

console.log(`logo    mark ${mark.paths.length} paths, wordmark ${wordmark.paths.length}, tagline ${tagline.paths.length}`);

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/**
 * Each page of the product master is one render on transparency, sitting among
 * the layout's own furniture: a watermark, two type plates, and on some pages a
 * full-bleed backdrop photograph.
 *
 * The product is the biggest image *that carries a soft mask*. Size alone is
 * not enough — page five's marble backdrop is larger than the umbrella standing
 * on it — but the backdrop is opaque, and only a cut-out has alpha.
 *
 * Order follows the master. The catalogue slug each one is assigned to is
 * recorded here so the mapping lives next to the extraction rather than only
 * in the seed.
 */
const PRODUCTS = [
  { file: "product-atrium", note: "square centre-post, sand canopy, wheeled base" },
  { file: "product-meridian", note: "twin cantilever, two canopies on one mast" },
  { file: "product-vela", note: "four-post frame, bronze, sand canopy" },
  { file: "product-aria", note: "single cantilever, bronze arm, marble base" },
  { file: "product-solis", note: "octagonal parasol, fringed, forest canopy" },
  { file: "product-orbis", note: "octagonal parasol, fringed, ivory canopy" },
];

const listing = execFileSync("pdfimages", ["-list", join(BRAND, "saiwan-products.pdf")]).toString();
const rows = listing.split("\n").slice(2).filter(Boolean).map((line) => {
  const f = line.trim().split(/\s+/);
  return { page: Number(f[0]), num: Number(f[1]), type: f[2], w: Number(f[3]), h: Number(f[4]) };
});

for (let i = 0; i < PRODUCTS.length; i++) {
  const pageNo = i + 1;
  const onPage = rows.filter((r) => r.page === pageNo);
  // A soft mask is listed directly after the image it belongs to, at the same
  // size. Pair them up, then take the largest pair.
  const masked = onPage.flatMap((row, n) => {
    const next = onPage[n + 1];
    if (row.type !== "image" || next?.type !== "smask") return [];
    if (next.w !== row.w || next.h !== row.h) return [];
    return [{ image: row, mask: next }];
  });
  if (masked.length === 0) throw new Error(`page ${pageNo}: no cut-out found`);
  const chosen = masked.reduce((a, b) => (a.image.w * a.image.h >= b.image.w * b.image.h ? a : b));

  execFileSync("pdfimages", ["-f", String(pageNo), "-l", String(pageNo), "-png",
    join(BRAND, "saiwan-products.pdf"), scratch(`pg${pageNo}`)]);

  // Extracting a single page renumbers the files from zero, so the listing's
  // running object number has to be rebased onto the first object of this page.
  const base = onPage[0].num;
  const pad = (n) => String(n).padStart(3, "0");
  const colour = sharp(scratch(`pg${pageNo}-${pad(chosen.image.num - base)}.png`));
  const meta = await colour.metadata();
  const maskRaw = await sharp(scratch(`pg${pageNo}-${pad(chosen.mask.num - base)}.png`))
    .resize(meta.width, meta.height).greyscale().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.from(await colour.ensureAlpha().raw().toBuffer());
  // sharp returns greyscale as three channels often enough that assuming one
  // stride silently shears the mask; read the stride it actually used.
  for (let p = 0; p < meta.width * meta.height; p++) {
    rgba[p * 4 + 3] = maskRaw.data[p * maskRaw.info.channels];
  }

  const out = join(MEDIA, `${PRODUCTS[i].file}.webp`);
  await sharp(rgba, { raw: { width: meta.width, height: meta.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ width: 1600, height: 1600, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 86, alphaQuality: 90, effort: 6 })
    .toFile(out);

  console.log(`product ${PRODUCTS[i].file.padEnd(18)} ${meta.width}x${meta.height}  ${PRODUCTS[i].note}`);
}

rmSync(work, { recursive: true, force: true });
