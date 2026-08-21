-- Offer a colour only where there is genuinely a choice.
--
-- Every product carried a list of canopy colours, but only one piece is
-- actually made in more than one: the fringed parasol, in forest and ivory.
-- Everywhere else the swatches were a promise the catalogue could not keep —
-- four colours offered, one photograph, and whatever arrived was a surprise.
--
-- Solis and Orbis are that same parasol. So they each show both photographs,
-- bound to the colourway each one is, which is what makes a swatch swap the
-- picture and a picture select the swatch.

-- The green, sampled from the canopy in the photograph rather than guessed.
INSERT INTO "Color" ("id", "slug", "hex", "order")
VALUES ('clr0forest000000000000001', 'forest', '#17382E', 6)
ON CONFLICT ("slug") DO UPDATE SET "hex" = EXCLUDED."hex";

INSERT INTO "ColorTranslation" ("id", "colorId", "locale", "name")
SELECT 'clrt0forest0000000000' || l.locale, c."id", l.locale, l.name
FROM "Color" c
CROSS JOIN (VALUES ('en', 'Forest'), ('ar', 'أخضر داكن'), ('ckb', 'سەوزی تۆخ')) AS l(locale, name)
WHERE c."slug" = 'forest'
ON CONFLICT ("colorId", "locale") DO UPDATE SET "name" = EXCLUDED."name";

-- Drop every offered colour, then give the two colourways back. Simpler than
-- reconciling per product, and correct whatever state the catalogue was in.
DELETE FROM "ProductColor";

INSERT INTO "ProductColor" ("id", "productId", "colorId", "order")
SELECT 'pc0' || p."slug" || '0' || c."slug", p."id", c."id",
       CASE WHEN (p."slug" = 'solis') = (c."slug" = 'forest') THEN 0 ELSE 1 END
FROM "Product" p
JOIN "Color" c ON c."slug" IN ('forest', 'ivory')
WHERE p."slug" IN ('solis', 'orbis');

-- Each of the two shows both photographs, its own first.
DELETE FROM "ProductImage" WHERE "productId" IN (SELECT "id" FROM "Product" WHERE "slug" IN ('solis', 'orbis'));

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "colorId")
SELECT 'pi0' || p."slug" || '0' || v.shot, p."id", v.url, v.alt,
       CASE WHEN v.shot = p."slug" THEN 0 ELSE 1 END,
       (SELECT "id" FROM "Color" WHERE "slug" = v.colour)
FROM "Product" p
CROSS JOIN (VALUES
  ('solis', '/media/product-solis.webp', 'Fringed parasol in forest', 'forest'),
  ('orbis', '/media/product-orbis.webp', 'Fringed parasol in ivory',  'ivory')
) AS v(shot, url, alt, colour)
WHERE p."slug" IN ('solis', 'orbis');
