-- Two more photographs for the Sail Walkway Shade: a close-up of a sail's
-- corner fitting on its post, and an aerial view of the sails along the path.
-- Their sizes are recorded so the gallery shows each one whole.
--
-- Insert-only: nothing existing is changed. A photograph is skipped if the
-- product is missing (a fresh database, where prisma/seed.ts adds the same
-- images) or if it is already attached, say from the dashboard.

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "width", "height")
SELECT v.id, p."id", v.url, v.alt, v.ord, v.width, v.height
FROM (VALUES
  ('prd0sailwalkwayshade00000img1', '/media/walkway-sails-fitting.jpg', 'Sail Walkway Shade — view 2', 1, 664, 425),
  ('prd0sailwalkwayshade00000img2', '/media/walkway-sails-aerial.jpg', 'Sail Walkway Shade — view 3', 2, 665, 502)
) AS v(id, url, alt, ord, width, height)
JOIN "Product" p ON p."slug" = 'sail-walkway-shade'
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductImage" i WHERE i."productId" = p."id" AND i."url" = v.url
)
ON CONFLICT ("id") DO NOTHING;
