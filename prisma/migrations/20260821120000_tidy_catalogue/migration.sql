-- Show only what has been photographed.
--
-- A data migration rather than a change to the seed, because the seed only ever
-- runs against an empty database: by the time this ships there is a live
-- catalogue, and it is the live catalogue that needs tidying. Both are updated
-- so a fresh database and the deployed one end up identical.

-- Cala was specified but never photographed, so its card was drawn placeholder
-- art. Everything hanging off it cascades; inquiries that referenced it keep
-- their history, because Inquiry.productId is SetNull rather than Cascade.
DELETE FROM "Product" WHERE "slug" = 'cala';

-- Every photographed piece keeps its packshot and nothing else. The scene and
-- detail plates beside it were placeholders too, and a real photograph followed
-- by two drawn ones reads worse than a single real photograph.
DELETE FROM "ProductImage" AS img
WHERE img."url" NOT LIKE '%.webp'
  AND EXISTS (
    SELECT 1 FROM "ProductImage" AS keep
    WHERE keep."productId" = img."productId"
      AND keep."url" LIKE '%.webp'
  );
