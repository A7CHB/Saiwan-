"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/data/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductConfigurator } from "@/components/product/product-configurator";

/**
 * Owns the one piece of state the gallery and the configurator have to agree
 * on: the selected colourway. Choosing a swatch reveals that colour's plate;
 * paging to a colour-tagged plate selects the swatch. Keeping this here means
 * neither child has to know about the other.
 */
export function ProductExperience({ product }: { product: ProductDetail }) {
  const [colorId, setColorId] = useState<string | null>(product.colors[0]?.id ?? null);
  const [imageId, setImageId] = useState<string | null>(product.images[0]?.id ?? null);

  const onColorChange = (nextColorId: string) => {
    setColorId(nextColorId);
    const match = product.images.find((image) => image.colorId === nextColorId);
    if (match) setImageId(match.id);
  };

  const onImageChange = (nextImageId: string) => {
    setImageId(nextImageId);
    const image = product.images.find((item) => item.id === nextImageId);
    if (image?.colorId) setColorId(image.colorId);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-24">
        <ProductGallery
          images={product.images}
          activeId={imageId}
          onActiveChange={onImageChange}
          productName={product.name}
        />
      </div>

      <ProductConfigurator product={product} selectedColorId={colorId} onColorChange={onColorChange} />
    </div>
  );
}
