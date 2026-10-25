import type { ProductCard } from "@/lib/data/products";
import type { Segment, Style, UseCase } from "@/lib/constants";

/**
 * "Find your shade" — the recommendation engine.
 *
 * A transparent weighted score rather than a black box, because the result has
 * to be defensible: a specifier can look at these weights and agree with them.
 * Placement and area carry the most weight because they are the two answers
 * that actually constrain the structure; style and colour are preferences and
 * are weighted accordingly.
 */

export type AreaBand = "small" | "medium" | "large" | "xlarge";

export const AREA_BANDS: Record<AreaBand, { min: number; max: number }> = {
  small: { min: 0, max: 9 },
  medium: { min: 9, max: 20 },
  large: { min: 20, max: 40 },
  xlarge: { min: 40, max: Infinity },
};

export type CarsBand = "few" | "some" | "many" | "fleet";
export type Roof = "FABRIC" | "METAL";
export type LengthBand = "short" | "medium" | "long" | "extended";
export type Cover = "FABRIC" | "LOUVRE" | "SOLID";

export type QuizAnswers = {
  placement?: UseCase;
  area?: AreaBand;
  segment?: Exclude<Segment, "BOTH">;
  style?: Style;
  color?: string;
  tier?: 1 | 2 | 3;
  // Car park questions — asked instead of area, style and colour.
  cars?: CarsBand;
  roof?: Roof;
  // Covered walkway questions — likewise.
  length?: LengthBand;
  cover?: Cover;
};

export type QuizStepKey =
  | "placement"
  | "area"
  | "segment"
  | "style"
  | "color"
  | "tier"
  | "cars"
  | "roof"
  | "length"
  | "cover";

/**
 * A setting that is a different kind of structure from an umbrella, and so
 * gets its own questions: one about size (bays, or metres of path) and one
 * about the covering, in place of area in m², style and canopy colour.
 * Choosing it recommends only products tagged with that setting.
 *
 * Each design's profile is a structural fact about the type (a cantilever row
 * suits a frontage, a double arch two rows of bays), not something the
 * dashboard holds, so it lives here beside the weights. A product added in the
 * dashboard without one is still offered, scored on what it can be judged on.
 */
type StructurePath = {
  steps: QuizStepKey[];
  sizeKey: "cars" | "length";
  typeKey: "roof" | "cover";
  sizeOrder: string[];
  profiles: Record<string, { type: string; sizes: string[] }>;
};

const STRUCTURE_PATHS: Partial<Record<UseCase, StructurePath>> = {
  parking: {
    steps: ["placement", "cars", "segment", "roof", "tier"],
    sizeKey: "cars",
    typeKey: "roof",
    sizeOrder: ["few", "some", "many", "fleet"] satisfies CarsBand[],
    profiles: {
      "cable-stayed-parking-shade": { type: "FABRIC", sizes: ["some", "many"] },
      "pyramid-parking-shade": { type: "FABRIC", sizes: ["many", "fleet"] },
      "cantilever-parking-shade": { type: "FABRIC", sizes: ["few", "some"] },
      "steel-roof-carport": { type: "METAL", sizes: ["few", "some", "many"] },
      "double-arch-parking-shade": { type: "FABRIC", sizes: ["many", "fleet"] },
    },
  },
  walkway: {
    steps: ["placement", "length", "segment", "cover", "tier"],
    sizeKey: "length",
    typeKey: "cover",
    sizeOrder: ["short", "medium", "long", "extended"] satisfies LengthBand[],
    profiles: {
      "continuous-walkway-canopy": { type: "FABRIC", sizes: ["long", "extended"] },
      "timber-look-louvre-walkway": { type: "LOUVRE", sizes: ["short", "medium"] },
      "industrial-covered-walkway": { type: "SOLID", sizes: ["short", "medium", "long"] },
      "white-louvre-walkway": { type: "LOUVRE", sizes: ["short", "medium"] },
      "sail-walkway-shade": { type: "FABRIC", sizes: ["medium", "long"] },
      "steel-frame-covered-walkway": { type: "SOLID", sizes: ["medium", "long", "extended"] },
    },
  },
};

const STRUCTURE_USE_CASES = Object.keys(STRUCTURE_PATHS) as UseCase[];

/** The structure path these answers are on, if the setting is one. */
export const structurePath = (placement?: UseCase) => (placement ? STRUCTURE_PATHS[placement] : undefined);

/** The questions, in order. Umbrella settings ask about area, style and colour. */
export const UMBRELLA_STEPS: QuizStepKey[] = ["placement", "area", "segment", "style", "color", "tier"];

export const stepsFor = (answers: QuizAnswers) => structurePath(answers.placement)?.steps ?? UMBRELLA_STEPS;

const STRUCTURE_WEIGHTS = {
  size: 30,
  type: 24,
  segment: 18,
  tier: 12,
} as const;

const WEIGHTS = {
  placement: 30,
  area: 26,
  segment: 18,
  style: 14,
  tier: 12,
} as const;

export type Recommendation = { product: ProductCard; score: number };

export function scoreProducts(products: ProductCard[], answers: QuizAnswers): Recommendation[] {
  const path = structurePath(answers.placement);
  if (path) return scoreStructure(path, products, answers);

  // Only the questions actually answered count towards the denominator, so
  // skipping a question lowers confidence rather than penalising every product.
  const possible =
    (answers.placement ? WEIGHTS.placement : 0) +
    (answers.area ? WEIGHTS.area : 0) +
    (answers.segment ? WEIGHTS.segment : 0) +
    (answers.style ? WEIGHTS.style : 0) +
    (answers.tier ? WEIGHTS.tier : 0);

  if (possible === 0) {
    return products.map((product) => ({ product, score: 0 }));
  }

  return products
    .map((product) => {
      let earned = 0;

      if (answers.placement) {
        if (product.useCases.includes(answers.placement)) earned += WEIGHTS.placement;
        // Adjacent settings still deserve partial credit — a poolside piece is
        // rarely wrong on a terrace.
        else if (adjacent(answers.placement).some((useCase) => product.useCases.includes(useCase))) {
          earned += WEIGHTS.placement * 0.45;
        }
      }

      if (answers.area) {
        const band = AREA_BANDS[answers.area];
        const coverage = product.coverageM2 ?? 0;
        if (isBuiltToMeasure(product)) {
          // No fixed canopy: sized to the project, so it suits a large area
          // fully, a medium one partly, and is too much structure for a small
          // terrace or balcony.
          earned += WEIGHTS.area * (band.min >= 20 ? 1 : band.min >= 9 ? 0.5 : 0);
        } else if (coverage >= band.min && coverage < band.max) earned += WEIGHTS.area;
        else {
          // Distance from the band, expressed as a proportion of the band width.
          const distance = coverage < band.min ? band.min - coverage : coverage - band.max;
          const span = Number.isFinite(band.max) ? band.max - band.min : 20;
          earned += WEIGHTS.area * Math.max(0, 1 - distance / span) * 0.6;
        }
      }

      if (answers.segment) {
        if (product.segment === answers.segment) earned += WEIGHTS.segment;
        else if (product.segment === "BOTH") earned += WEIGHTS.segment * 0.8;
      }

      if (answers.style && product.style === answers.style) earned += WEIGHTS.style;

      if (answers.tier) {
        const gap = Math.abs(product.priceTier - answers.tier);
        earned += WEIGHTS.tier * (gap === 0 ? 1 : gap === 1 ? 0.5 : 0);
      }

      return { product, score: Math.round((earned / possible) * 100) };
    })
    .sort((a, b) => b.score - a.score || Number(b.product.isFeatured) - Number(a.product.isFeatured));
}

/**
 * Car parks and walkways: every candidate is already that kind of structure,
 * so the setting earns nothing to tell them apart. Size, covering, use and
 * tier do, with the same answered-questions-only denominator as above.
 */
function scoreStructure(path: StructurePath, products: ProductCard[], answers: QuizAnswers): Recommendation[] {
  const size = answers[path.sizeKey];
  const type = answers[path.typeKey];
  const possible =
    (size ? STRUCTURE_WEIGHTS.size : 0) +
    (type ? STRUCTURE_WEIGHTS.type : 0) +
    (answers.segment ? STRUCTURE_WEIGHTS.segment : 0) +
    (answers.tier ? STRUCTURE_WEIGHTS.tier : 0);

  return products
    .map((product) => {
      // Skipping everything after the setting is still a fair answer: every
      // design is a match for it.
      if (possible === 0) return { product, score: 100 };

      const profile = path.profiles[product.slug];
      let earned = 0;

      if (size) {
        if (!profile) earned += STRUCTURE_WEIGHTS.size * 0.5;
        else if (profile.sizes.includes(size)) earned += STRUCTURE_WEIGHTS.size;
        else {
          // One band away is a stretch, not a mismatch.
          const wanted = path.sizeOrder.indexOf(size);
          const gap = Math.min(...profile.sizes.map((band) => Math.abs(path.sizeOrder.indexOf(band) - wanted)));
          if (gap === 1) earned += STRUCTURE_WEIGHTS.size * 0.4;
        }
      }

      if (type) {
        if (!profile) earned += STRUCTURE_WEIGHTS.type * 0.5;
        else if (profile.type === type) earned += STRUCTURE_WEIGHTS.type;
      }

      if (answers.segment) {
        if (product.segment === answers.segment) earned += STRUCTURE_WEIGHTS.segment;
        else if (product.segment === "BOTH") earned += STRUCTURE_WEIGHTS.segment * 0.8;
      }

      if (answers.tier) {
        const gap = Math.abs(product.priceTier - answers.tier);
        earned += STRUCTURE_WEIGHTS.tier * (gap === 0 ? 1 : gap === 1 ? 0.5 : 0);
      }

      return { product, score: Math.round((earned / possible) * 100) };
    })
    .sort((a, b) => b.score - a.score || Number(b.product.isFeatured) - Number(a.product.isFeatured));
}

/** Settings that behave similarly enough to earn partial credit. */
function adjacent(useCase: UseCase): UseCase[] {
  const map: Record<UseCase, UseCase[]> = {
    garden: ["terrace", "balcony"],
    pool: ["terrace", "hotel"],
    restaurant: ["hotel", "rooftop"],
    hotel: ["restaurant", "pool", "rooftop"],
    rooftop: ["terrace", "restaurant"],
    terrace: ["garden", "rooftop", "balcony"],
    balcony: ["terrace", "garden"],
    parking: [],
    walkway: [],
  };
  return map[useCase] ?? [];
}

const onStructurePath = (product: ProductCard) =>
  product.useCases.some((useCase) => STRUCTURE_USE_CASES.includes(useCase));

/**
 * What the consultation may put forward for these answers. Accessories are
 * add-ons, never a recommendation in their own right; a car park or a walkway
 * gets structures tagged for it and nothing else, and the umbrella questions
 * never get those.
 */
export function isRecommendable(product: ProductCard, answers: QuizAnswers = {}): boolean {
  if (structurePath(answers.placement)) return product.useCases.includes(answers.placement!);
  if (product.categorySlug === "accessories" || onStructurePath(product)) return false;
  return (product.coverageM2 ?? 0) > 0 || isBuiltToMeasure(product);
}

/**
 * A structure with no fixed canopy size — a tensile roof, say — that is still
 * offered for the settings it is tagged with. Untagged, it stays out of the
 * consultation, as a grandstand roof does: no setting here is a stadium.
 */
function isBuiltToMeasure(product: ProductCard): boolean {
  return (product.coverageM2 ?? 0) <= 0 && product.useCases.length > 0 && !onStructurePath(product);
}
