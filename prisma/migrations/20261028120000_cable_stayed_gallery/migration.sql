-- Three more views for the Cable-Stayed Parking Shade, cut from its site
-- photograph: the mast and cables up close, the bays under the canopy, and
-- the row along the palms. Each keeps the original's shape, with its size
-- recorded so it is framed whole like the lead image.
--
-- Insert-only: nothing existing is changed. A view is skipped if the product
-- is missing (a fresh database, where prisma/seed.ts adds the same images) or
-- if that photograph is already attached, say from the dashboard.

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "width", "height")
SELECT v.id, p."id", v.url, v.alt, v.ord, v.width, v.height
FROM (VALUES
  ('prd0cablestayedparkingshaimg1', '/media/parking-cable-stayed-detail.jpg', 'Cable-Stayed Parking Shade — view 2', 1, 840, 475),
  ('prd0cablestayedparkingshaimg2', '/media/parking-cable-stayed-bays.jpg', 'Cable-Stayed Parking Shade — view 3', 2, 1100, 622),
  ('prd0cablestayedparkingshaimg3', '/media/parking-cable-stayed-row.jpg', 'Cable-Stayed Parking Shade — view 4', 3, 1000, 565)
) AS v(id, url, alt, ord, width, height)
JOIN "Product" p ON p."slug" = 'cable-stayed-parking-shade'
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductImage" i WHERE i."productId" = p."id" AND i."url" = v.url
)
ON CONFLICT ("id") DO NOTHING;
