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
  /**
   * Where this space puts the object.
   *
   * The same umbrella stands in every scene, but the scenes were not shot from
   * the same distance, and an object composited at one fixed size only ever
   * belongs in one of them. `scale` matches it to the furniture it is shading;
   * `x` and `y` are percentages of its own size, moving its foot onto the floor
   * that furniture is standing on rather than one in front of it.
   *
   * Omitting it stands the object dead centre at full size.
   */
  stand?: { scale?: number; x?: number; y?: number };
};

export const SCENES: Scene[] = [
  {
    key: "villa",
    image: "/media/env-villa.webp",
    // Each crop is set to its own picture. What has to land in frame is the
    // furniture the canopy is shading, and every plate sits it at a different
    // height, so there is no house value to share.
    position: "center 54%",
    placeholder: false,
    useCases: ["terrace", "pool"],
    // The mast is cantilevered off to the left, so the object is pushed left
    // until its foot is on open paving beside the loungers rather than through
    // the nearer one, and widened until the canopy reaches across both.
    stand: { scale: 1, x: -7, y: -6 },
  },
  {
    key: "dining",
    image: "/media/env-dining.webp",
    position: "center 50%",
    placeholder: false,
    useCases: ["restaurant"],
    // The table sits up on a platform behind a step, so the object is lifted
    // onto it and pulled back — at the default it stood on the lower terrace
    // and shaded a table on a different floor.
    stand: { scale: 0.72, x: 6, y: -19 },
  },
  {
    key: "rooftop",
    image: "/media/env-rooftop.webp",
    position: "center 62%",
    placeholder: false,
    useCases: ["rooftop", "balcony"],
    // This lounge is the closest to camera of the four, so the object is the
    // largest here: at the size the others use, the canopy read as narrower
    // than the sofa it is meant to be shading.
    stand: { scale: 1.15, x: -6, y: -16 },
  },
  {
    key: "garden",
    image: "/media/env-garden.webp",
    position: "center 56%",
    placeholder: false,
    useCases: ["garden"],
    stand: { scale: 0.88, x: 3, y: -6 },
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
