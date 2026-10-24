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
};

export type QuizStepKey = "placement" | "area" | "segment" | "style" | "color" | "tier" | "cars" | "roof";

/**
 * The questions, in order. A car park is a different structure from an
 * umbrella, so choosing it swaps the umbrella questions (area in m², style,
 * canopy colour) for the two that actually decide a parking shade: how many
 * cars, and fabric or a solid roof.
 */
export const UMBRELLA_STEPS: QuizStepKey[] = ["placement", "area", "segment", "style", "color", "tier"];
export const PARKING_STEPS: QuizStepKey[] = ["placement", "cars", "segment", "roof", "tier"];

export const isParking = (answers: QuizAnswers) => answers.placement === "parking";

export const stepsFor = (answers: QuizAnswers) => (isParking(answers) ? PARKING_STEPS : UMBRELLA_STEPS);

/**
 * What each parking design suits. These are structural facts about the type
 * (a cantilever row suits a frontage, a double arch two rows of bays), not
 * something the dashboard holds, so they live here beside the weights. A
 * parking product added in the dashboard without an entry is still offered,
 * scored on the answers it can be judged on.
 */
const PARKING_PROFILES: Record<string, { roof: Roof; cars: CarsBand[] }> = {
  "cable-stayed-parking-shade": { roof: "FABRIC", cars: ["some", "many"] },
  "pyramid-parking-shade": { roof: "FABRIC", cars: ["many", "fleet"] },
  "cantilever-parking-shade": { roof: "FABRIC", cars: ["few", "some"] },
  "steel-roof-carport": { roof: "METAL", cars: ["few", "some", "many"] },
  "double-arch-parking-shade": { roof: "FABRIC", cars: ["many", "fleet"] },
};

const CARS_ORDER: CarsBand[] = ["few", "some", "many", "fleet"];

const PARKING_WEIGHTS = {
  cars: 30,
  roof: 24,
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
  if (isParking(answers)) return scoreParking(products, answers);

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
 * Car parks: every candidate is already a parking structure, so the setting
 * earns nothing to tell them apart. Bays, roof, use and tier do, with the same
 * answered-questions-only denominator as above.
 */
function scoreParking(products: ProductCard[], answers: QuizAnswers): Recommendation[] {
  const possible =
    (answers.cars ? PARKING_WEIGHTS.cars : 0) +
    (answers.roof ? PARKING_WEIGHTS.roof : 0) +
    (answers.segment ? PARKING_WEIGHTS.segment : 0) +
    (answers.tier ? PARKING_WEIGHTS.tier : 0);

  return products
    .map((product) => {
      // Skipping everything after "car parking" is still a fair answer: every
      // design is a match for the setting.
      if (possible === 0) return { product, score: 100 };

      const profile = PARKING_PROFILES[product.slug];
      let earned = 0;

      if (answers.cars) {
        if (!profile) earned += PARKING_WEIGHTS.cars * 0.5;
        else if (profile.cars.includes(answers.cars)) earned += PARKING_WEIGHTS.cars;
        else {
          // One band away is a stretch, not a mismatch.
          const wanted = CARS_ORDER.indexOf(answers.cars);
          const gap = Math.min(...profile.cars.map((band) => Math.abs(CARS_ORDER.indexOf(band) - wanted)));
          if (gap === 1) earned += PARKING_WEIGHTS.cars * 0.4;
        }
      }

      if (answers.roof) {
        if (!profile) earned += PARKING_WEIGHTS.roof * 0.5;
        else if (profile.roof === answers.roof) earned += PARKING_WEIGHTS.roof;
      }

      if (answers.segment) {
        if (product.segment === answers.segment) earned += PARKING_WEIGHTS.segment;
        else if (product.segment === "BOTH") earned += PARKING_WEIGHTS.segment * 0.8;
      }

      if (answers.tier) {
        const gap = Math.abs(product.priceTier - answers.tier);
        earned += PARKING_WEIGHTS.tier * (gap === 0 ? 1 : gap === 1 ? 0.5 : 0);
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
  };
  return map[useCase] ?? [];
}

/**
 * What the consultation may put forward for these answers. Accessories are
 * add-ons, never a recommendation in their own right; a car park gets parking
 * structures and nothing else, and the umbrella questions never get them.
 */
export function isRecommendable(product: ProductCard, answers: QuizAnswers = {}): boolean {
  if (isParking(answers)) return product.useCases.includes("parking");
  if (product.categorySlug === "accessories" || product.useCases.includes("parking")) return false;
  return (product.coverageM2 ?? 0) > 0 || isBuiltToMeasure(product);
}

/**
 * A structure with no fixed canopy size — a tensile roof, say — that is still
 * offered for the settings it is tagged with. Untagged, it stays out of the
 * consultation, as a grandstand roof does: no setting here is a stadium.
 */
function isBuiltToMeasure(product: ProductCard): boolean {
  return (product.coverageM2 ?? 0) <= 0 && product.useCases.length > 0 && !product.useCases.includes("parking");
}
