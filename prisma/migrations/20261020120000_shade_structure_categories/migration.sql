-- Six shade-structure categories beside the existing umbrella ones.
--
-- A data migration, like tidy_catalogue, because the seed only runs against an
-- empty database and these need to reach the live catalogue. prisma/seed.ts
-- carries the same six so a fresh database matches.
--
-- Insert-only. Nothing existing is updated or deleted, and a category is
-- skipped if its slug — or its English name, in any case — is already taken,
-- so one created by hand in the dashboard is never duplicated. They go after
-- whatever order the dashboard has set, in the order listed here.

INSERT INTO "Category" ("id", "slug", "order", "isActive", "imageUrl", "updatedAt")
SELECT c.id, c.slug, base.max_order + c.position, true, NULL, CURRENT_TIMESTAMP
FROM (VALUES
  ('cat0carparkingshades0001', 'car-parking-shades',          1, 'Car Parking Shades'),
  ('cat0tensilestructures001', 'tensile-structures',          2, 'Tensile Structures'),
  ('cat0walkwayshades0000001', 'walkway-shades',              3, 'Walkway Shades'),
  ('cat0pergolaslouvres00001', 'pergolas-louvres',            4, 'Pergolas & Louvres'),
  ('cat0commercialshade00001', 'commercial-shade-structures', 5, 'Commercial Shade Structures'),
  ('cat0shadesails0000000001', 'shade-sails',                 6, 'Shade Sails')
) AS c(id, slug, position, name_en)
CROSS JOIN (SELECT COALESCE(MAX("order"), -1) AS max_order FROM "Category") AS base
WHERE NOT EXISTS (
  SELECT 1 FROM "CategoryTranslation" t
  WHERE t."locale" = 'en' AND lower(t."name") = lower(c.name_en)
)
ON CONFLICT ("slug") DO NOTHING;

-- Translations only for the rows created above (matched by their ids), never
-- for a same-slug category that already existed.
INSERT INTO "CategoryTranslation"
  ("id", "categoryId", "locale", "name", "tagline", "description", "metaTitle", "metaDescription")
SELECT t.category_id || t.locale, t.category_id, t.locale, t.name, t.tagline, t.description,
       t.name || ' · Saiwan', left(t.description, 155)
FROM (VALUES
  ('cat0carparkingshades0001', 'en', 'Car Parking Shades', 'Cover for every bay',
   'Steel-framed shade over parking bays that keeps cars, and the people getting into them, out of the midday sun.'),
  ('cat0carparkingshades0001', 'ar', 'مظلات مواقف السيارات', 'غطاءٌ لكل موقف',
   'مظلات بإطاراتٍ فولاذية فوق مواقف السيارات تحمي السيارات ومن يركبها من شمس الظهيرة.'),
  ('cat0carparkingshades0001', 'ckb', 'سێبەری پارکینگی ئۆتۆمبێل', 'داپۆشین بۆ هەموو شوێنێکی وەستان',
   'سێبەری چوارچێوە پۆڵایی بەسەر شوێنی وەستانی ئۆتۆمبێلەکاندا کە ئۆتۆمبێلەکان و ئەو کەسانەی سواریان دەبن لە خۆری نیوەڕۆ دەپارێزێت.'),

  ('cat0tensilestructures001', 'en', 'Tensile Structures', 'Fabric held in tension',
   'Membrane canopies tensioned between masts and cables to cover large spans with a light, sculptural roof.'),
  ('cat0tensilestructures001', 'ar', 'المنشآت الشدّية', 'قماشٌ مشدود بإحكام',
   'أغشية مشدودة بين الأعمدة والكابلات لتغطية مساحاتٍ واسعة بسقفٍ خفيفٍ ذي طابعٍ نحتي.'),
  ('cat0tensilestructures001', 'ckb', 'بنیاتی کێشراو', 'قوماش بە ڕاکێشان ڕاگیراو',
   'پەردەی قوماش کە لە نێوان کۆڵەکە و کێبڵەکاندا ڕادەکێشرێن بۆ داپۆشینی ماوەی گەورە بە سەقفێکی سووک و پەیکەرئاسا.'),

  ('cat0walkwayshades0000001', 'en', 'Walkway Shades', 'Shade from door to door',
   'Continuous cover along paths, entrances and connecting walkways, so moving between buildings never means stepping into full sun.'),
  ('cat0walkwayshades0000001', 'ar', 'مظلات الممرات', 'ظلٌّ من بابٍ إلى باب',
   'غطاءٌ متصل على امتداد الممرات والمداخل وطرق الربط، فلا يعني التنقّل بين المباني الخروج إلى الشمس المباشرة.'),
  ('cat0walkwayshades0000001', 'ckb', 'سێبەری ڕێڕەو', 'سێبەر لە دەرگاوە بۆ دەرگا',
   'داپۆشینی بەردەوام بە درێژایی ڕێگا و دەروازە و ڕێڕەوە پەیوەندکەرەکان، بۆ ئەوەی جووڵە لە نێوان باڵەخانەکاندا هەرگیز بە مانای چوونە ناو خۆری ڕاستەوخۆ نەبێت.'),

  ('cat0pergolaslouvres00001', 'en', 'Pergolas & Louvres', 'Architecture for outdoor rooms',
   'Fixed frames with open or adjustable louvred roofs that turn a terrace into a room you can use in sun or shade.'),
  ('cat0pergolaslouvres00001', 'ar', 'البرغولات والسقوف الشرائحية', 'عمارةٌ للغرف الخارجية',
   'هياكل ثابتة بأسقفٍ مفتوحة أو بشرائح قابلة للتعديل تحوّل التراس إلى غرفةٍ تُستعمل في الشمس والظل.'),
  ('cat0pergolaslouvres00001', 'ckb', 'پێرگۆلا و لووڤەر', 'تەلارسازی بۆ ژووری دەرەوە',
   'چوارچێوەی جێگیر بە سەقفی کراوە یان لووڤەری گۆڕاو کە تەراسێک دەکاتە ژوورێک کە لە خۆر و سێبەردا بەکاربهێنرێت.'),

  ('cat0commercialshade00001', 'en', 'Commercial Shade Structures', 'Engineered for public spaces',
   'Permanent shade structures for schools, hospitality, retail and public projects, specified to the site and its loads.'),
  ('cat0commercialshade00001', 'ar', 'منشآت التظليل التجارية', 'مُهندَسة للمساحات العامة',
   'منشآت تظليل دائمة للمدارس والضيافة والتجزئة والمشاريع العامة، تُحدَّد وفق الموقع وأحماله.'),
  ('cat0commercialshade00001', 'ckb', 'بنیاتی سێبەری بازرگانی', 'بۆ شوێنە گشتییەکان ئەندازیاری کراوە',
   'بنیاتی سێبەری هەمیشەیی بۆ قوتابخانە و میوانداری و فرۆشگا و پڕۆژە گشتییەکان، بەپێی شوێنەکە و بارەکانی دیاری دەکرێن.'),

  ('cat0shadesails0000000001', 'en', 'Shade Sails', 'Shade drawn in clean lines',
   'Tensioned fabric sails fixed between posts and walls — a light, flexible way to shade courtyards, play areas and terraces.'),
  ('cat0shadesails0000000001', 'ar', 'أشرعة التظليل', 'ظلٌّ مرسومٌ بخطوطٍ نقية',
   'أشرعة من القماش المشدود تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة لتظليل الأفنية ومناطق اللعب والتراسات.'),
  ('cat0shadesails0000000001', 'ckb', 'چارۆکەی سێبەر', 'سێبەر بە هێڵی ڕوون کێشراو',
   'چارۆکەی قوماشی ڕاکێشراو لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم بۆ سێبەرکردنی حەوشە و شوێنی یاری و تەراس.')
) AS t(category_id, locale, name, tagline, description)
WHERE EXISTS (SELECT 1 FROM "Category" c WHERE c."id" = t.category_id)
ON CONFLICT ("categoryId", "locale") DO NOTHING;
