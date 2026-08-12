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

export type QuizAnswers = {
  placement?: UseCase;
  area?: AreaBand;
  segment?: Exclude<Segment, "BOTH">;
  style?: Style;
  color?: string;
  tier?: 1 | 2 | 3;
};

const WEIGHTS = {
  placement: 30,
  area: 26,
  segment: 18,
  style: 14,
  tier: 12,
} as const;

export type Recommendation = { product: ProductCard; score: number };

export function scoreProducts(products: ProductCard[], answers: QuizAnswers): Recommendation[] {
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
        if (coverage >= band.min && coverage < band.max) earned += WEIGHTS.area;
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
  };
  return map[useCase] ?? [];
}

/** Accessories are add-ons, never a recommendation in their own right. */
export function isRecommendable(product: ProductCard): boolean {
  return product.categorySlug !== "accessories" && (product.coverageM2 ?? 0) > 0;
}
