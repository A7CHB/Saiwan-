-- Two more photographs for the Cantilever Parking Shade: an aerial view of a
-- covered row of bays, and a close-up of the cantilever arm's fixing to its
-- post. Their sizes are recorded so the gallery shows each one whole.
--
-- Insert-only: nothing existing is changed. A photograph is skipped if the
-- product is missing (a fresh database, where prisma/seed.ts adds the same
-- images) or if it is already attached, say from the dashboard.

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "width", "height")
SELECT v.id, p."id", v.url, v.alt, v.ord, v.width, v.height
FROM (VALUES
  ('prd0cantileverparkingshadimg1', '/media/parking-cantilever-aerial.jpg', 'Cantilever Parking Shade — view 2', 1, 772, 463),
  ('prd0cantileverparkingshadimg2', '/media/parking-cantilever-fitting.jpg', 'Cantilever Parking Shade — view 3', 2, 758, 461)
) AS v(id, url, alt, ord, width, height)
JOIN "Product" p ON p."slug" = 'cantilever-parking-shade'
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductImage" i WHERE i."productId" = p."id" AND i."url" = v.url
)
ON CONFLICT ("id") DO NOTHING;
