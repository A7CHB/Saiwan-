import type { UseCase } from "@/lib/constants";

/**
 * The home showroom: one object, infinite spaces.
 *
 * The homepage stands a single umbrella in front of five environments and
 * changes the world behind it. That only works if the environments are
 * *umbrella-free* and share a geometry — horizon roughly two fifths down, the
 * centre foreground left clear — so the same object can stand in all of them
 * without floating or colliding with something already in the frame.
 *
 * This file is the whole asset configuration. Swapping a placeholder plate for
 * real photography is a one-line change here and nothing else: no component
 * knows a path, and the copy comes from the dictionaries by key.
 *
 * `useCases` is what connects the story to the catalogue — it is the existing
 * `Product.useCases` vocabulary, so "where will yours live?" filters real
 * products rather than a second, hand-maintained list.
 */
export type SceneKey = "villa" | "dining" | "rooftop" | "garden";

export type Scene = {
  key: SceneKey;
  /** Full-bleed environment plate, 1:1 so the crop holds from phone to desktop. */
  image: string;
  /** Focal point for the crop, matched to where each plate's horizon sits. */
  position: string;
  /**
   * Placeholder art, awaiting photography of a real installation. The scenes
   * marked here are the brand's own vector plates; replace `image` with a
   * photograph shot to the same geometry and nothing else changes.
   */
  placeholder: boolean;
  /** Which catalogue use-cases this environment stands for. */
  useCases: UseCase[];
};

export const SCENES: Scene[] = [
  {
    key: "villa",
    image: "/media/hero-terrace.webp",
    position: "center 58%",
    placeholder: false,
    useCases: ["terrace", "pool"],
  },
  {
    key: "dining",
    image: "/media/env-dining.svg",
    position: "center 70%",
    placeholder: true,
    useCases: ["restaurant"],
  },
  {
    key: "rooftop",
    image: "/media/env-rooftop.svg",
    position: "center 70%",
    placeholder: true,
    useCases: ["rooftop", "balcony"],
  },
  {
    key: "garden",
    image: "/media/env-garden.svg",
    position: "center 70%",
    placeholder: true,
    useCases: ["garden"],
  },
];

/**
 * The constant. One cut-out plate, standing in every scene.
 *
 * Served as authored rather than through the image optimiser: Safari mishandles
 * alpha in AVIF, and an opaque umbrella would cover the environment it is
 * supposed to be standing in.
 */
export const UMBRELLA_PLATE = "/media/hero-umbrella.webp";

export const sceneKeys = SCENES.map((scene) => scene.key);
