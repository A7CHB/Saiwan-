/**
 * Turns the three hero source renders into the plates the 3D stage uses.
 *
 * The hero is a diorama: a backdrop that never moves, and two cut-out planes
 * standing in front of it at different distances. The sources are photographic
 * renders — a terrace, and an umbrella on a flat studio grey — so the umbrella
 * needs its background removed before it can stand in front of anything.
 *
 * Keying is done here rather than by hand because it is repeatable: the studio
 * background is flat and perfectly neutral, so distance from that one colour
 * separates it from a subject whose brightest fabric and whitest mast are both
 * far away from it.
 *
 * Sources are not committed — they are megabytes of PNG for a few hundred kB of
 * output. Point the script at wherever they are:
 *
 *   node scripts/hero-photos.mjs ~/Downloads/hero-src
 *
 * expecting terrace.png and umbrella.png inside it.
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
 * The umbrella is shipped as authored — it bypasses Next's image optimiser,
 * because Safari mishandles alpha in AVIF and an opaque plate would cover the
 * scene it is standing in. So its file size is whatever is written here.
 *
 * It is generous because the showroom scales it well past 1:1 at the peak of
 * each transition, when the canopy fills the frame and becomes the surface the
 * environments change behind. At 1400px that moment was visibly soft.
 */
const CUTOUT_SIZE = 2000;

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

console.log(`Wrote hero-terrace.webp and hero-umbrella.webp to ${OUT}`);
