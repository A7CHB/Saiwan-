/**
 * The five environments the home showroom stands its umbrella in.
 *
 * These are drawn, not photographed. They are placeholders for real
 * photography of installed work, but they are not sketches: the home page's
 * whole idea is that the same object transforms five different spaces, and
 * that only lands if each space reads as a place — a floor you could walk on,
 * a wall with light behind it, furniture at a believable size.
 *
 * So the vocabulary here is perspective rather than shapes. A vanishing point
 * sits on the horizon; paving converges to it, walls are drawn as trapezoids
 * that recede toward it, and everything standing on the floor is scaled by how
 * far away it is. That is what separates "an abstract warm rectangle" from
 * "a terrace at golden hour".
 *
 * Three rules every plate follows, because the showroom depends on them:
 *
 *   1. Square. The crop differs from a phone to a wide desktop.
 *   2. Horizon at 0.58, vanishing point at the centre. A replacement
 *      photograph must match this or the umbrella will float.
 *   3. No canopy, no parasol, nothing overhead in the middle. The umbrella is
 *      composited on top; anything drawn there gives the scene two.
 *
 * Run: node scripts/generate-environments.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");
mkdirSync(OUT, { recursive: true });

const SIZE = 2000;
const HORIZON = SIZE * 0.58;
const VP = SIZE * 0.5; // vanishing point, on the horizon

/** Deterministic PRNG, so re-running never churns the assets. */
const rand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const n = (value) => Number(value).toFixed(1);

/**
 * Palettes. Each is a moment of light rather than a colour scheme — the sun
 * position and the ground tone come from the same decision.
 */
const LIGHT = {
  midday: {
    sky: ["#CFE0E6", "#B9CFD8", "#93AEB9"],
    sun: "#FFFFFF",
    sunAt: [0.74, 0.3],
    floor: ["#E8E0D2", "#C9BCA6"],
    mass: "#9D9382",
    warm: "#E9DCC4",
    water: ["#9FC2CC", "#6E97A6"],
    green: "#7C8B66",
  },
  golden: {
    sky: ["#F6DFB6", "#E5B77E", "#B87C4A"],
    sun: "#FFF2D8",
    sunAt: [0.68, 0.34],
    floor: ["#D8C3A4", "#A98A66"],
    mass: "#6E5641",
    warm: "#FFD9A0",
    water: ["#D9B489", "#A97F55"],
    green: "#6E7355",
  },
  dusk: {
    sky: ["#6E6478", "#4A4457", "#2A2734"],
    sun: "#E7B279",
    sunAt: [0.24, 0.36],
    floor: ["#3A3540", "#221F29"],
    mass: "#2A2532",
    warm: "#F2C182",
    water: ["#3E4258", "#23263A"],
    green: "#3C4440",
  },
  evening: {
    sky: ["#6B5647", "#42332C", "#241B18"],
    sun: "#FFD9A2",
    sunAt: [0.5, 0.28],
    floor: ["#6B5947", "#3A2F27"],
    mass: "#3A2F28",
    warm: "#FFCF97",
    water: ["#5A4A3C", "#33291F"],
    green: "#4C5140",
  },
  olive: {
    sky: ["#E7E6D6", "#D2D3BB", "#A9AC90"],
    sun: "#F6F2DF",
    sunAt: [0.7, 0.26],
    floor: ["#DCD3BE", "#B0A88F"],
    mass: "#7C7A62",
    warm: "#EDE0BE",
    water: ["#A9B49A", "#7E8B74"],
    green: "#5F6B4B",
  },
};

// ---------------------------------------------------------------------------
// Drawing vocabulary. Everything takes the palette and returns SVG.
// ---------------------------------------------------------------------------

/** Depth 0 is the horizon, 1 is the bottom of the frame. */
const depthY = (depth) => HORIZON + (SIZE - HORIZON) * depth;

/** How much smaller something is at that depth — pure perspective. */
const depthScale = (depth) => 0.12 + depth * 0.95;

/**
 * The floor: lines converging on the vanishing point, crossed by courses that
 * compress toward the horizon. This one element does most of the work of
 * making a plate read as a place.
 */
function paving(light, { rows = 13, columns = 15, opacity = 0.14 } = {}) {
  const parts = [];
  for (let i = 0; i <= columns; i += 1) {
    const t = i / columns;
    const x = -SIZE * 0.75 + t * SIZE * 2.5;
    parts.push(
      `<line x1="${n(x)}" y1="${n(SIZE)}" x2="${n(VP)}" y2="${n(HORIZON)}" stroke="${light.mass}" stroke-width="2" opacity="${opacity}"/>`,
    );
  }
  for (let i = 1; i <= rows; i += 1) {
    // Squared spacing: courses bunch up as they recede, as they do in life.
    const y = depthY(Math.pow(i / rows, 2.1));
    parts.push(
      `<line x1="0" y1="${n(y)}" x2="${SIZE}" y2="${n(y)}" stroke="${light.mass}" stroke-width="2" opacity="${(opacity * 0.85).toFixed(3)}"/>`,
    );
  }
  return parts.join("");
}

/**
 * A wall running away from the camera on one side, drawn as a trapezoid whose
 * top and bottom edges point at the vanishing point. Openings are cut as
 * lighter panels, which is what gives a plate its architecture.
 */
function wall(light, { side = "start", openings = 3, glow = 0.5, height = 0.42 } = {}) {
  const near = side === "start" ? SIZE * 0.02 : SIZE * 0.98;
  const far = side === "start" ? SIZE * 0.3 : SIZE * 0.7;
  const nearTop = HORIZON - SIZE * height;
  const farTop = HORIZON - SIZE * height * 0.38;
  const nearBottom = SIZE * 1.05;
  const farBottom = HORIZON + SIZE * 0.05;

  const panels = [];
  for (let i = 0; i < openings; i += 1) {
    const t0 = 0.1 + (i / openings) * 0.8;
    const t1 = t0 + 0.8 / openings - 0.03;
    const x0 = near + (far - near) * t0;
    const x1 = near + (far - near) * t1;
    const topA = nearTop + (farTop - nearTop) * t0;
    const topB = nearTop + (farTop - nearTop) * t1;
    const botA = nearBottom + (farBottom - nearBottom) * (t0 + 0.06);
    const botB = nearBottom + (farBottom - nearBottom) * (t1 + 0.06);
    panels.push(
      `<path d="M ${n(x0)} ${n(topA + SIZE * 0.04)} L ${n(x1)} ${n(topB + SIZE * 0.04)} L ${n(x1)} ${n(botB - SIZE * 0.12)} L ${n(x0)} ${n(botA - SIZE * 0.12)} Z" fill="${light.warm}" opacity="${glow}"/>`,
    );
  }

  // The soffit: a deep overhang above the openings. It is what makes the mass
  // read as a building rather than as a flat panel standing on its edge.
  const eaveNear = nearTop - SIZE * 0.055;
  const eaveFar = farTop - SIZE * 0.022;

  return `<g>
    <path d="M ${n(near)} ${n(nearTop)} L ${n(far)} ${n(farTop)} L ${n(far)} ${n(farBottom)} L ${n(near)} ${n(nearBottom)} Z" fill="${light.mass}" opacity="0.94"/>
    ${panels.join("")}
    <path d="M ${n(near)} ${n(eaveNear)} L ${n(far)} ${n(eaveFar)} L ${n(far)} ${n(farTop)} L ${n(near)} ${n(nearTop)} Z" fill="${light.mass}" opacity="0.99"/>
    <path d="M ${n(near)} ${n(eaveNear)} L ${n(far)} ${n(eaveFar)} L ${n(far)} ${n(eaveFar + SIZE * 0.006)} L ${n(near)} ${n(eaveNear + SIZE * 0.012)} Z" fill="${light.warm}" opacity="0.4"/>
  </g>`;
}

/** A still band of water, with the sky lying on it. */
function water(light, { from = 0.18, to = 0.62, lines = 9, seed = 7 } = {}) {
  const random = rand(seed);
  const top = depthY(from);
  const bottom = depthY(to);
  const rows = [];
  for (let i = 0; i < lines; i += 1) {
    const t = i / lines;
    const y = top + (bottom - top) * Math.pow(t, 1.6);
    const w = SIZE * (0.18 + random() * 0.5);
    rows.push(
      `<rect x="${n(SIZE * (0.08 + random() * 0.5))}" y="${n(y)}" width="${n(w)}" height="${n(2 + t * 5)}" fill="${light.sun}" opacity="${(0.28 - t * 0.16).toFixed(3)}"/>`,
    );
  }
  return `<g>
    <rect x="0" y="${n(top)}" width="${SIZE}" height="${n(bottom - top)}" fill="url(#water)"/>
    ${rows.join("")}
    <rect x="0" y="${n(top)}" width="${SIZE}" height="3" fill="${light.warm}" opacity="0.35"/>
  </g>`;
}

/** A sun lounger, seen side-on. Scaled by depth. */
function lounger(light, { x, depth, flip = false }) {
  const s = depthScale(depth) * SIZE * 0.09;
  const y = depthY(depth);
  const dir = flip ? -1 : 1;
  return `<g opacity="0.9">
    <path d="M ${n(x - s * dir)} ${n(y)} L ${n(x + s * 1.6 * dir)} ${n(y)} L ${n(x + s * 1.5 * dir)} ${n(y - s * 0.34)} L ${n(x - s * 0.9 * dir)} ${n(y - s * 0.3)} Z" fill="${light.warm}" opacity="0.85"/>
    <path d="M ${n(x - s * 0.9 * dir)} ${n(y - s * 0.3)} L ${n(x - s * 1.5 * dir)} ${n(y - s * 0.92)} L ${n(x - s * 1.15 * dir)} ${n(y - s * 0.96)} L ${n(x - s * 0.55 * dir)} ${n(y - s * 0.32)} Z" fill="${light.warm}" opacity="0.85"/>
    <rect x="${n(x - s * 0.8)} " y="${n(y)}" width="${n(s * 1.9)}" height="${n(s * 0.09)}" fill="${light.mass}" opacity="0.5"/>
  </g>`;
}

/** A laid table with two chairs. */
function table(light, { x, depth }) {
  const s = depthScale(depth) * SIZE * 0.075;
  const y = depthY(depth);
  const chair = (cx, w) =>
    `<g><rect x="${n(cx - w * 0.5)}" y="${n(y - s * 0.95)}" width="${n(w)}" height="${n(s * 0.95)}" rx="${n(w * 0.16)}" fill="${light.mass}" opacity="0.8"/>` +
    `<rect x="${n(cx - w * 0.5)}" y="${n(y - s * 0.95)}" width="${n(w)}" height="${n(s * 0.14)}" rx="${n(w * 0.16)}" fill="${light.warm}" opacity="0.45"/></g>`;
  return `<g>
    ${chair(x - s * 1.25, s * 0.5)}
    ${chair(x + s * 1.25, s * 0.5)}
    <ellipse cx="${n(x)}" cy="${n(y - s * 0.78)}" rx="${n(s * 0.95)}" ry="${n(s * 0.2)}" fill="${light.warm}" opacity="0.9"/>
    <rect x="${n(x - s * 0.05)}" y="${n(y - s * 0.78)}" width="${n(s * 0.1)}" height="${n(s * 0.78)}" fill="${light.mass}" opacity="0.7"/>
    <ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(s * 0.42)}" ry="${n(s * 0.08)}" fill="${light.mass}" opacity="0.45"/>
    <ellipse cx="${n(x + s * 0.3)}" cy="${n(y - s * 0.88)}" rx="${n(s * 0.07)}" ry="${n(s * 0.14)}" fill="${light.sun}" opacity="0.9"/>
    <ellipse cx="${n(x)}" cy="${n(y - s * 0.2)}" rx="${n(s * 2.2)}" ry="${n(s * 0.7)}" fill="${light.warm}" opacity="0.12"/>
  </g>`;
}

/** A low outdoor sofa, seen side-on. */
function sofa(light, { x, depth }) {
  const s = depthScale(depth) * SIZE * 0.1;
  const y = depthY(depth);
  return `<g opacity="0.92">
    <rect x="${n(x - s)}" y="${n(y - s * 0.42)}" width="${n(s * 2)}" height="${n(s * 0.3)}" rx="${n(s * 0.08)}" fill="${light.warm}" opacity="0.8"/>
    <rect x="${n(x - s)}" y="${n(y - s * 0.78)}" width="${n(s * 2)}" height="${n(s * 0.4)}" rx="${n(s * 0.1)}" fill="${light.warm}" opacity="0.62"/>
    <rect x="${n(x - s)}" y="${n(y - s * 0.12)}" width="${n(s * 2)}" height="${n(s * 0.12)}" fill="${light.mass}" opacity="0.6"/>
    <ellipse cx="${n(x)}" cy="${n(y + s * 0.03)}" rx="${n(s * 1.15)}" ry="${n(s * 0.1)}" fill="${light.mass}" opacity="0.4"/>
  </g>`;
}

/** Grasses and shrubs: a clump of tapering blades. */
function planting(light, { x, depth, spread = 1, seed = 3 }) {
  const random = rand(seed);
  const s = depthScale(depth) * SIZE * 0.11 * spread;
  const y = depthY(depth);
  const blades = [];
  for (let i = 0; i < 16; i += 1) {
    const a = (random() - 0.5) * 1.5;
    const h = s * (0.6 + random() * 0.9);
    blades.push(
      `<path d="M ${n(x)} ${n(y)} Q ${n(x + a * s * 0.5)} ${n(y - h * 0.6)} ${n(x + a * s)} ${n(y - h)}" stroke="${light.green}" stroke-width="${n(s * 0.045)}" fill="none" opacity="${(0.5 + random() * 0.4).toFixed(2)}"/>`,
    );
  }
  return `<g>${blades.join("")}</g>`;
}

/** A tree: a trunk and layered foliage. Used at the frame's edges only. */
function tree(light, { x, depth, height = 1, seed = 5 }) {
  const random = rand(seed);
  const s = depthScale(depth) * SIZE * 0.42 * height;
  const y = depthY(depth);
  const clumps = [];
  for (let i = 0; i < 7; i += 1) {
    const cx = x + (random() - 0.5) * s * 0.8;
    const cy = y - s * (0.62 + random() * 0.42);
    const r = s * (0.16 + random() * 0.14);
    clumps.push(
      `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r * 1.25)}" ry="${n(r)}" fill="${light.green}" opacity="${(0.55 + random() * 0.35).toFixed(2)}"/>`,
    );
  }
  return `<g>
    <path d="M ${n(x - s * 0.035)} ${n(y)} L ${n(x + s * 0.035)} ${n(y)} L ${n(x + s * 0.02)} ${n(y - s * 0.62)} L ${n(x - s * 0.02)} ${n(y - s * 0.62)} Z" fill="${light.mass}" opacity="0.8"/>
    ${clumps.join("")}
  </g>`;
}

/** A clipped hedge running across the plate, behind everything on the floor. */
function hedge(light, { depth = 0.12, height = 0.09 }) {
  const y = depthY(depth);
  const h = SIZE * height;
  return `<g>
    <rect x="-20" y="${n(y - h)}" width="${SIZE + 40}" height="${n(h)}" rx="${n(h * 0.12)}" fill="${light.green}" opacity="0.7"/>
    <rect x="-20" y="${n(y - h)}" width="${SIZE + 40}" height="${n(h * 0.16)}" fill="${light.sun}" opacity="0.14"/>
  </g>`;
}

/** A city, far enough away to be nearly flat. Windows carry the light. */
function skyline(light, { seed = 11 }) {
  const random = rand(seed);
  const towers = [];
  let x = -SIZE * 0.05;
  while (x < SIZE * 1.05) {
    const w = SIZE * (0.045 + random() * 0.075);
    const h = SIZE * (0.08 + random() * 0.3);
    const top = HORIZON - h;
    const windows = [];
    const cols = Math.max(2, Math.round(w / (SIZE * 0.022)));
    const rows = Math.max(3, Math.round(h / (SIZE * 0.03)));
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        if (random() > 0.42) continue;
        windows.push(
          `<rect x="${n(x + (c + 0.3) * (w / cols))}" y="${n(top + (r + 0.35) * (h / rows))}" width="${n(w / cols * 0.4)}" height="${n(h / rows * 0.3)}" fill="${light.warm}" opacity="${(0.3 + random() * 0.55).toFixed(2)}"/>`,
        );
      }
    }
    towers.push(
      `<g><rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(h + 4)}" fill="${light.mass}" opacity="0.9"/>${windows.join("")}</g>`,
    );
    x += w * (1.02 + random() * 0.3);
  }
  return `<g>${towers.join("")}</g>`;
}

/** A glass balustrade along the edge of a terrace. */
function balustrade(light, { depth = 0.16 }) {
  const y = depthY(depth);
  const h = SIZE * 0.085;
  const posts = [];
  for (let i = 0; i <= 12; i += 1) {
    const x = (i / 12) * SIZE;
    posts.push(
      `<rect x="${n(x)}" y="${n(y - h)}" width="4" height="${n(h)}" fill="${light.mass}" opacity="0.55"/>`,
    );
  }
  return `<g>
    <rect x="0" y="${n(y - h)}" width="${SIZE}" height="${n(h)}" fill="${light.sun}" opacity="0.1"/>
    ${posts.join("")}
    <rect x="0" y="${n(y - h)}" width="${SIZE}" height="6" fill="${light.warm}" opacity="0.5"/>
  </g>`;
}

/** Strung lights, the one detail that makes an evening terrace read as one. */
function festoon(light, { seed = 13 }) {
  const random = rand(seed);
  const y = SIZE * 0.16;
  const sag = SIZE * 0.06;
  const bulbs = [];
  for (let i = 0; i <= 14; i += 1) {
    const t = i / 14;
    const x = t * SIZE;
    const by = y + Math.sin(t * Math.PI) * sag;
    bulbs.push(
      `<circle cx="${n(x)}" cy="${n(by)}" r="${n(SIZE * 0.0055)}" fill="${light.sun}" opacity="${(0.7 + random() * 0.3).toFixed(2)}"/>`,
      `<circle cx="${n(x)}" cy="${n(by)}" r="${n(SIZE * 0.02)}" fill="${light.warm}" opacity="0.18"/>`,
    );
  }
  return `<g>
    <ellipse cx="${n(SIZE * 0.5)}" cy="${n(depthY(0.5))}" rx="${n(SIZE * 0.62)}" ry="${n(SIZE * 0.2)}" fill="${light.warm}" opacity="0.1"/>
    <path d="M 0 ${n(y)} Q ${n(SIZE * 0.5)} ${n(y + sag * 1.4)} ${SIZE} ${n(y)}" stroke="${light.mass}" stroke-width="3" fill="none" opacity="0.5"/>
    ${bulbs.join("")}
  </g>`;
}

// ---------------------------------------------------------------------------

function plate(light, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light.sky[0]}"/>
      <stop offset="58%" stop-color="${light.sky[1]}"/>
      <stop offset="100%" stop-color="${light.sky[2]}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light.floor[0]}"/>
      <stop offset="100%" stop-color="${light.floor[1]}"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light.water[0]}"/>
      <stop offset="100%" stop-color="${light.water[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${light.sunAt[0]}" cy="${light.sunAt[1]}" r="0.55">
      <stop offset="0%" stop-color="${light.sun}" stop-opacity="0.75"/>
      <stop offset="60%" stop-color="${light.sun}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${light.sun}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light.sky[1]}" stop-opacity="0"/>
      <stop offset="65%" stop-color="${light.sky[1]}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${light.sky[1]}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.52" r="0.75">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.34"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/></filter>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" fill="url(#sky)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
  <rect x="0" y="${n(HORIZON)}" width="${SIZE}" height="${n(SIZE - HORIZON)}" fill="url(#floor)"/>
  ${body}
  <rect x="0" y="${n(HORIZON - SIZE * 0.13)}" width="${SIZE}" height="${n(SIZE * 0.2)}" fill="url(#haze)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#vignette)"/>
  <rect width="${SIZE}" height="${SIZE}" filter="url(#grain)" opacity="0.045"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// The five spaces.
// ---------------------------------------------------------------------------

const ENVIRONMENTS = {
  /** Kept for parity — the villa scene ships a photograph, this is its stand-in. */
  villa: () => {
    const l = LIGHT.golden;
    return plate(l, [
      water(l, { from: -0.02, to: 0.06, lines: 5, seed: 21 }),
      wall(l, { side: "start", openings: 3, glow: 0.45, height: 0.46 }),
      paving(l, { opacity: 0.13 }),
      hedge(l, { depth: 0.08, height: 0.05 }),
      water(l, { from: 0.34, to: 0.62, lines: 8, seed: 23 }),
      lounger(l, { x: SIZE * 0.2, depth: 0.5 }),
      lounger(l, { x: SIZE * 0.86, depth: 0.42, flip: true }),
      planting(l, { x: SIZE * 0.06, depth: 0.62, spread: 1.2, seed: 31 }),
      planting(l, { x: SIZE * 0.96, depth: 0.7, spread: 1.4, seed: 37 }),
    ].join("\n  "));
  },

  resort: () => {
    const l = LIGHT.midday;
    return plate(l, [
      water(l, { from: -0.04, to: 0.02, lines: 4, seed: 41 }),
      hedge(l, { depth: 0.06, height: 0.045 }),
      paving(l, { opacity: 0.12 }),
      water(l, { from: 0.26, to: 0.66, lines: 10, seed: 43 }),
      tree(l, { x: SIZE * 0.08, depth: 0.34, height: 1.15, seed: 47 }),
      tree(l, { x: SIZE * 0.93, depth: 0.3, height: 1, seed: 53 }),
      lounger(l, { x: SIZE * 0.17, depth: 0.72 }),
      lounger(l, { x: SIZE * 0.31, depth: 0.72 }),
      lounger(l, { x: SIZE * 0.83, depth: 0.78, flip: true }),
      planting(l, { x: SIZE * 0.99, depth: 0.84, spread: 1.5, seed: 59 }),
    ].join("\n  "));
  },

  dining: () => {
    const l = LIGHT.evening;
    return plate(l, [
      wall(l, { side: "end", openings: 4, glow: 0.62, height: 0.5 }),
      paving(l, { opacity: 0.1 }),
      hedge(l, { depth: 0.1, height: 0.06 }),
      festoon(l, { seed: 61 }),
      table(l, { x: SIZE * 0.19, depth: 0.46 }),
      table(l, { x: SIZE * 0.8, depth: 0.52 }),
      table(l, { x: SIZE * 0.12, depth: 0.78 }),
      table(l, { x: SIZE * 0.9, depth: 0.86 }),
      planting(l, { x: SIZE * 0.02, depth: 0.66, spread: 1.1, seed: 67 }),
    ].join("\n  "));
  },

  rooftop: () => {
    const l = LIGHT.dusk;
    return plate(l, [
      skyline(l, { seed: 71 }),
      balustrade(l, { depth: 0.14 }),
      paving(l, { opacity: 0.12 }),
      sofa(l, { x: SIZE * 0.16, depth: 0.6 }),
      sofa(l, { x: SIZE * 0.87, depth: 0.66 }),
      planting(l, { x: SIZE * 0.04, depth: 0.8, spread: 1.3, seed: 73 }),
      planting(l, { x: SIZE * 0.97, depth: 0.74, spread: 1.2, seed: 79 }),
      table(l, { x: SIZE * 0.5, depth: 0.94 }),
    ].join("\n  "));
  },

  garden: () => {
    const l = LIGHT.olive;
    return plate(l, [
      hedge(l, { depth: 0.04, height: 0.12 }),
      paving(l, { opacity: 0.1 }),
      tree(l, { x: SIZE * 0.05, depth: 0.28, height: 1.35, seed: 83 }),
      tree(l, { x: SIZE * 0.95, depth: 0.24, height: 1.2, seed: 89 }),
      tree(l, { x: SIZE * 0.2, depth: 0.16, height: 0.8, seed: 97 }),
      planting(l, { x: SIZE * 0.09, depth: 0.66, spread: 1.5, seed: 101 }),
      planting(l, { x: SIZE * 0.9, depth: 0.72, spread: 1.6, seed: 103 }),
      planting(l, { x: SIZE * 0.98, depth: 0.9, spread: 1.8, seed: 107 }),
      sofa(l, { x: SIZE * 0.78, depth: 0.5 }),
    ].join("\n  "));
  },
};

for (const [name, build] of Object.entries(ENVIRONMENTS)) {
  writeFileSync(join(OUT, `env-${name}.svg`), build().trim());
}

console.log(`Wrote ${Object.keys(ENVIRONMENTS).length} environment plates to ${OUT}`);
