/**
 * Generates the placeholder art direction in /public/media.
 *
 * These are not stock photographs and are not pretending to be. They are
 * composed brand plates — warm graded skies, architectural planes, canopy
 * silhouettes — built from the same palette as the site so the layout can be
 * designed, reviewed and shipped before real photography exists. Every one is
 * replaceable from the admin (Products → Images, Gallery → Image URL) by
 * pasting a URL or uploading a file; nothing about the design depends on them.
 *
 * Run: node scripts/generate-plates.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");
mkdirSync(OUT, { recursive: true });

/** Graded skies, each a moment of day on a warm palette. */
const MOODS = {
  dawn: { sky: ["#F6E5D2", "#E8C9A8", "#C79A6E"], ground: "#8A6849", accent: "#F2D6B0", sun: "#FFF2E0" },
  midday: { sky: ["#DCE6EA", "#C9D8DE", "#A8BFC7"], ground: "#9A9384", accent: "#EDE6D8", sun: "#FFFFFF" },
  golden: { sky: ["#F3D9AE", "#E0AC71", "#B87642"], ground: "#6E4E33", accent: "#FFE3B8", sun: "#FFF0CE" },
  dusk: { sky: ["#6E5F6E", "#4A4152", "#2B2733"], ground: "#211D22", accent: "#C08B52", sun: "#E8B87A" },
  night: { sky: ["#1D2028", "#14161C", "#0B0C10"], ground: "#0A0A0C", accent: "#C58F53", sun: "#3A424E" },
  stone: { sky: ["#EFEAE1", "#E2DACD", "#CFC4B2"], ground: "#A79A85", accent: "#B98E5C", sun: "#FBF7F0" },
  olive: { sky: ["#E4E3D4", "#CBCBB4", "#A6A88C"], ground: "#6A6C54", accent: "#C0A06A", sun: "#F4F1E2" },
  terracotta: { sky: ["#F2DCCF", "#DDAF95", "#B87458"], ground: "#7A4A38", accent: "#E8C4A4", sun: "#FFEBD9" },
};

const rand = (seed) => {
  // Deterministic PRNG so re-running the script never churns the assets.
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

/**
 * A canopy silhouette.
 *
 * The pitch is deliberately shallow — a domed shape reads as a beach parasol,
 * while a low, taut pitch with a deep scalloped valance and a visible finial is
 * what distinguishes a specified outdoor canopy. Ribs are drawn as hairlines so
 * the structure is legible without turning the plate into a diagram.
 */
function canopy(cx, baseY, width, height, fill, opacity = 1, light = "#ffffff") {
  const half = width / 2;
  const pitch = height * 0.42; // rise from edge to apex
  const scallop = height * 0.1;
  const edgeY = baseY - height + pitch;
  const apexY = baseY - height;
  const mastBottom = baseY;

  // Rib hairlines from the apex out to evenly spaced points along the edge.
  const ribs = [-0.72, -0.36, 0, 0.36, 0.72]
    .map((f) => {
      const x = cx + half * f;
      const y = edgeY - pitch * (1 - f * f) * 0.98;
      return `<line x1="${cx.toFixed(1)}" y1="${(apexY + pitch * 0.06).toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${light}" stroke-width="${(width * 0.0035).toFixed(2)}" opacity="0.16"/>`;
    })
    .join("");

  return `
    <g opacity="${opacity}">
      <ellipse cx="${cx.toFixed(1)}" cy="${(mastBottom + height * 0.03).toFixed(1)}" rx="${(half * 0.62).toFixed(1)}" ry="${(height * 0.035).toFixed(1)}" fill="${fill}" opacity="0.28"/>
      <path fill="${fill}" d="
        M ${(cx - half).toFixed(1)} ${edgeY.toFixed(1)}
        C ${(cx - half * 0.62).toFixed(1)} ${(edgeY - pitch * 0.86).toFixed(1)} ${(cx - half * 0.22).toFixed(1)} ${apexY.toFixed(1)} ${cx.toFixed(1)} ${apexY.toFixed(1)}
        C ${(cx + half * 0.22).toFixed(1)} ${apexY.toFixed(1)} ${(cx + half * 0.62).toFixed(1)} ${(edgeY - pitch * 0.86).toFixed(1)} ${(cx + half).toFixed(1)} ${edgeY.toFixed(1)}
        C ${(cx + half * 0.66).toFixed(1)} ${(edgeY + scallop).toFixed(1)} ${(cx + half * 0.34).toFixed(1)} ${(edgeY + scallop).toFixed(1)} ${cx.toFixed(1)} ${(edgeY + scallop * 0.15).toFixed(1)}
        C ${(cx - half * 0.34).toFixed(1)} ${(edgeY + scallop).toFixed(1)} ${(cx - half * 0.66).toFixed(1)} ${(edgeY + scallop).toFixed(1)} ${(cx - half).toFixed(1)} ${edgeY.toFixed(1)}
        Z" />
      ${ribs}
      <rect x="${(cx - width * 0.008).toFixed(1)}" y="${(apexY - height * 0.11).toFixed(1)}" width="${(width * 0.016).toFixed(1)}" height="${(height * 0.12).toFixed(1)}" fill="${fill}"/>
      <rect x="${(cx - width * 0.011).toFixed(1)}" y="${apexY.toFixed(1)}" width="${(width * 0.022).toFixed(1)}" height="${(mastBottom - apexY).toFixed(1)}" fill="${fill}"/>
      <rect x="${(cx - width * 0.075).toFixed(1)}" y="${mastBottom.toFixed(1)}" width="${(width * 0.15).toFixed(1)}" height="${(height * 0.03).toFixed(1)}" fill="${fill}"/>
    </g>`;
}

function plate({ name, width, height, mood, variant, seed }) {
  const m = MOODS[mood];
  const random = rand(seed);
  const horizon = height * (variant === "aerial" ? 0.34 : 0.72);

  const layers = [];

  // Sun / light source
  const sunX = width * (0.18 + random() * 0.64);
  const sunY = horizon * (0.28 + random() * 0.4);
  layers.push(
    `<circle cx="${sunX}" cy="${sunY}" r="${width * 0.055}" fill="${m.sun}" opacity="0.5" filter="url(#soft)"/>`,
  );

  // Distant architecture — flat stone planes reading as a villa skyline.
  if (variant !== "aerial") {
    let x = -width * 0.05;
    let index = 0;
    while (x < width * 1.05) {
      const w = width * (0.08 + random() * 0.16);
      const h = height * (0.05 + random() * 0.16);
      layers.push(
        `<rect x="${x.toFixed(1)}" y="${(horizon - h).toFixed(1)}" width="${w.toFixed(1)}" height="${(h + 4).toFixed(1)}" fill="${m.ground}" opacity="${(0.16 + (index % 3) * 0.05).toFixed(2)}"/>`,
      );
      x += w * (0.82 + random() * 0.5);
      index += 1;
    }
  }

  // Ground plane
  layers.push(
    `<rect x="0" y="${horizon}" width="${width}" height="${height - horizon}" fill="url(#ground)"/>`,
  );

  // Water band — the pool/terrace reflection variants.
  if (variant === "pool") {
    const waterTop = horizon + (height - horizon) * 0.32;
    layers.push(
      `<rect x="0" y="${waterTop}" width="${width}" height="${height - waterTop}" fill="url(#water)"/>`,
    );
    for (let i = 0; i < 7; i++) {
      const y = waterTop + (height - waterTop) * (0.12 + i * 0.12);
      layers.push(
        `<rect x="${(width * random() * 0.3).toFixed(1)}" y="${y.toFixed(1)}" width="${(width * (0.25 + random() * 0.55)).toFixed(1)}" height="1.5" fill="${m.accent}" opacity="0.22"/>`,
      );
    }
  }

  // Canopies — the subject.
  if (variant === "aerial") {
    // Looking down on a terrace: overlapping canopy discs.
    for (let i = 0; i < 5; i++) {
      const cx = width * (0.12 + i * 0.19 + random() * 0.05);
      const cy = height * (0.4 + random() * 0.35);
      const r = width * (0.09 + random() * 0.05);
      const ribs = Array.from({ length: 12 }, (_, k) => {
        const angle = (k * Math.PI * 2) / 12;
        return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(angle) * r).toFixed(1)}" y2="${(cy + Math.sin(angle) * r).toFixed(1)}" stroke="${m.sky[0]}" stroke-width="0.75" opacity="0.35"/>`;
      }).join("");
      layers.push(
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${m.ground}" opacity="0.5"/>${ribs}`,
      );
    }
  } else if (variant === "detail") {
    // Close crop: one canopy edge filling the frame.
    layers.push(canopy(width * 0.5, height * 1.62, width * 1.9, height * 1.5, m.ground, 0.85, m.sun));
  } else {
    const count = variant === "wide" ? 3 : 1;
    for (let i = 0; i < count; i++) {
      const cx = count === 1 ? width * 0.5 : width * (0.24 + i * 0.26);
      const h = height * (count === 1 ? 0.44 : 0.3) * (0.9 + random() * 0.2);
      const w = h * 2.35;
      layers.push(canopy(cx, horizon + (height - horizon) * 0.4, w, h, m.ground, i === 0 ? 0.92 : 0.6, m.sun));
    }
  }

  // Atmospheric haze at the horizon and a light sweep across the frame.
  layers.push(
    `<rect x="0" y="${horizon - height * 0.16}" width="${width}" height="${height * 0.22}" fill="url(#haze)"/>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#sweep)"/>`,
    `<rect x="0" y="0" width="${width}" height="${height}" filter="url(#grain)" opacity="0.055"/>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m.sky[0]}"/>
      <stop offset="55%" stop-color="${m.sky[1]}"/>
      <stop offset="100%" stop-color="${m.sky[2]}"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m.ground}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${m.ground}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m.sky[1]}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${m.sky[2]}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m.sky[1]}" stop-opacity="0"/>
      <stop offset="70%" stop-color="${m.sky[1]}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${m.sky[1]}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${m.accent}" stop-opacity="0.16"/>
      <stop offset="50%" stop-color="${m.accent}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${m.ground}" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${(width * 0.045).toFixed(1)}"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky)"/>
  ${layers.join("\n  ")}
</svg>`;
}

// name → [width, height, mood, variant]
const PLATES = [
  ["hero-terrace", 2000, 1250, "golden", "wide"],
  ["hero-pool", 2000, 1250, "dawn", "pool"],
  ["hero-dusk", 2000, 1250, "dusk", "wide"],
  ["scene-villa", 1600, 1200, "stone", "single"],
  ["scene-poolside", 1600, 1200, "midday", "pool"],
  ["scene-rooftop", 1600, 1200, "dusk", "wide"],
  ["scene-restaurant", 1600, 1200, "golden", "wide"],
  ["scene-hotel", 1600, 1200, "olive", "aerial"],
  ["scene-garden", 1600, 1200, "olive", "single"],
  ["scene-aerial", 1600, 1200, "terracotta", "aerial"],
  ["scene-night", 1600, 1200, "night", "wide"],
  ["portrait-canopy", 1200, 1600, "golden", "single"],
  ["portrait-mast", 1200, 1600, "stone", "detail"],
  ["portrait-terrace", 1200, 1600, "dawn", "single"],
  ["detail-fabric", 1400, 1400, "terracotta", "detail"],
  ["detail-frame", 1400, 1400, "stone", "detail"],
  ["detail-hardware", 1400, 1400, "night", "detail"],
  ["product-aria", 1200, 1600, "stone", "single"],
  ["product-aria-alt", 1200, 1600, "golden", "detail"],
  ["product-orbis", 1200, 1600, "midday", "single"],
  ["product-orbis-alt", 1200, 1600, "dawn", "detail"],
  ["product-meridian", 1200, 1600, "olive", "single"],
  ["product-meridian-alt", 1200, 1600, "stone", "detail"],
  ["product-cala", 1200, 1600, "dawn", "single"],
  ["product-cala-alt", 1200, 1600, "terracotta", "detail"],
  ["product-atrium", 1200, 1600, "dusk", "single"],
  ["product-atrium-alt", 1200, 1600, "night", "detail"],
  ["product-solis", 1200, 1600, "terracotta", "single"],
  ["product-solis-alt", 1200, 1600, "golden", "detail"],
  ["product-vela", 1200, 1600, "night", "single"],
  ["product-vela-alt", 1200, 1600, "dusk", "detail"],
  ["product-base", 1200, 1600, "stone", "detail"],
  ["product-cover", 1200, 1600, "olive", "detail"],
  ["product-light", 1200, 1600, "night", "detail"],
];

let seed = 20240815;
for (const [name, width, height, mood, variant] of PLATES) {
  seed += 7919;
  const svg = plate({ name, width, height, mood, variant, seed });
  writeFileSync(join(OUT, `${name}.svg`), svg.trim());
}

// Open Graph card — the social preview, in the brand's own language.
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A1611"/>
      <stop offset="60%" stop-color="#241D15"/>
      <stop offset="100%" stop-color="#0E0C0A"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(600 250)" stroke="#C58F53" stroke-width="1.6" fill="none" opacity="0.85"
     stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-90 -90) scale(5.6)">
      <path d="M2 18.6C2 10.5 8.3 3.9 16 3.9s14 6.6 14 14.7c-4.7 3-8.7 3-14-.3-5.3 3.3-9.3 3.3-14 .3Z"/>
      <path d="M16 3.9v14.4M16 3.9 6.1 16.4M16 3.9l9.9 12.5" opacity="0.5"/>
      <path d="M16 18.3v9.8M12.3 28.1h7.4"/>
    </g>
  </g>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="76"
        letter-spacing="26" fill="#F3EEE5">SAIWAN</text>
  <text x="600" y="530" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="19"
        letter-spacing="7" fill="#A79D8D">ARCHITECTURAL SHADE</text>
</svg>`;
writeFileSync(join(OUT, "..", "og-default.svg"), og);

// Favicon / app icon
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="4" fill="#16130F"/>
  <g stroke="#C58F53" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"
     transform="translate(1.5 1.5) scale(0.906)">
    <path d="M2 18.6C2 10.5 8.3 3.9 16 3.9s14 6.6 14 14.7c-4.7 3-8.7 3-14-.3-5.3 3.3-9.3 3.3-14 .3Z"/>
    <path d="M16 18.3v9.8M12.3 28.1h7.4"/>
  </g>
</svg>`;
writeFileSync(join(OUT, "..", "icon.svg"), icon);

console.log(`Wrote ${PLATES.length} plates to public/media, plus og-default.svg and icon.svg`);
