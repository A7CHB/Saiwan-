/**
 * Turns the three hero source renders into the plates the 3D stage uses.
 *
 * The hero is a diorama: a backdrop that never moves, and two cut-out planes
 * standing in front of it at different distances. The sources are photographic
 * renders — a terrace, an umbrella on a flat studio grey, planting on the same
 * grey — so two of them need their background removed before they can stand in
 * front of anything.
 *
 * Keying is done here rather than by hand because it is repeatable: the studio
 * background is neutral (saturation ≈ 0) and the subjects are not, which is a
 * far more reliable signal than luminance alone. The umbrella is keyed on
 * distance from its flat grey; the planting on saturation, because its foliage
 * is *darker* than the wall behind it and a luminance key would cut the subject
 * out instead of the background.
 *
 * Sources are not committed — they are 18 MB of PNG for 400 kB of output. Point
 * the script at wherever they are:
 *
 *   node scripts/hero-photos.mjs ~/Downloads/hero-src
 *
 * expecting terrace.png, umbrella.png and planting.png inside it.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SRC = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..", "hero-src");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");

/** Output edge, in pixels. Square: the crop differs from a phone to a desktop. */
const SIZE = 1800;
/**
 * The cut-out plates are smaller, because they are shipped as-is.
 *
 * They bypass Next's image optimiser (see the hero), so their file size is
 * whatever is written here — and a foreground element does not need the
 * backdrop's resolution to hold up.
 */
const CUTOUT_SIZE = 1400;

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
/** 0 below `from`, 1 above `to`, linear between — the feathered edge. */
const ramp = (value, from, to) => clamp01((value - from) / (to - from));

/**
 * Replace the alpha channel using a per-pixel decision, then feather it.
 *
 * The feather matters more than the threshold: a hard cut reads as a sticker
 * against the backdrop, and a single-pixel blur on the alpha alone is what makes
 * the plate sit in the scene.
 */
async function key(file, decide, { feather = 1.2 } = {}) {
  const image = sharp(file).resize(CUTOUT_SIZE, CUTOUT_SIZE, { fit: "cover" });
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const alpha = Buffer.alloc(info.width * info.height);
  for (let i = 0, p = 0; i < data.length; i += info.channels, p += 1) {
    alpha[p] = Math.round(255 * decide(data[i], data[i + 1], data[i + 2]));
  }

  // `blur` can hand back a three-channel greyscale, so the mask's own stride
  // has to be read from its info rather than assumed to be one byte per pixel.
  // Assuming it is what smears the cutout into diagonal stripes.
  const { data: softened, info: mask } = await sharp(alpha, {
    raw: { width: info.width, height: info.height, channels: 1 },
  })
    .blur(feather)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  const out = Buffer.alloc(pixels * 4);
  for (let p = 0; p < pixels; p += 1) {
    const i = p * info.channels;
    out[p * 4] = data[i];
    out[p * 4 + 1] = data[i + 1];
    out[p * 4 + 2] = data[i + 2];
    out[p * 4 + 3] = softened[p * mask.channels];
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

const saturation = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

// ---------------------------------------------------------------------------

const files = readdirSync(SRC);
const find = (name) => {
  const match = files.find((file) => file.toLowerCase().includes(name));
  if (!match) throw new Error(`No source matching "${name}" in ${SRC}`);
  return join(SRC, match);
};

// 1. Backdrop — no alpha, just a resize and a re-encode.
await sharp(find("terrace"))
  .resize(SIZE, SIZE, { fit: "cover" })
  .webp({ quality: 82 })
  .toFile(join(OUT, "hero-terrace.webp"));

// 2. The umbrella, off its studio grey. The background is flat rgb(138,138,138)
//    and perfectly neutral, so distance from that colour separates it from a
//    subject whose brightest fabric and whitest mast are both far away from it.
const GREY = 138;
const umbrella = await key(find("umbrella"), (r, g, b) => {
  const distance = Math.max(Math.abs(r - GREY), Math.abs(g - GREY), Math.abs(b - GREY));
  return ramp(distance, 10, 26);
});
await umbrella.webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(join(OUT, "hero-umbrella.webp"));

// 3. The planting. Its foliage is darker than the wall behind it, so this keys
//    on colour rather than brightness: the wall is neutral, everything growing
//    on it is not. The luminance term only catches the deepest shadow inside
//    the olive, which carries no colour to key on either.
const planting = await key(find("planting"), (r, g, b) => {
  const colour = ramp(saturation(r, g, b), 9, 20);
  const shadow = ramp(70 - (0.2126 * r + 0.7152 * g + 0.0722 * b), 0, 14);
  return Math.max(colour, shadow);
});
await planting.webp({ quality: 74, alphaQuality: 90, effort: 6 }).toFile(join(OUT, "hero-planting.webp"));

console.log(`Wrote hero-terrace.webp, hero-umbrella.webp and hero-planting.webp to ${OUT}`);
