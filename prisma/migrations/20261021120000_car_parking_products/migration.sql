-- Five car parking shade designs, one per photograph, in the Car Parking
-- Shades category.
--
-- Insert-only, like shade_structure_categories before it: nothing existing is
-- updated or deleted. A product is skipped if its slug or English name is
-- already taken, or if there is no category with the slug car-parking-shades
-- to put it in. prisma/seed.ts carries the same five so a fresh database
-- matches.
--
-- Only a database that already has a catalogue is touched. On an empty one
-- (a first deploy, a new development database) these would be its only
-- products, and prisma/bootstrap.ts would take that for a catalogue and skip
-- the seed — no sample products, no administrator. There the seed adds them.

INSERT INTO "Product" ("id", "slug", "sku", "categoryId", "status", "isFeatured", "order", "price", "showPrice",
  "availability", "style", "useCases", "segment", "coverageM2", "priceTier", "updatedAt")
SELECT p.id, p.slug, p.sku, c."id", 'PUBLISHED', false, p.ord, NULL, false,
  p.availability, p.style, p.use_cases, p.segment, p.coverage, p.tier, CURRENT_TIMESTAMP
FROM (VALUES
  ('prd0cablestayedparkingsha', 'cable-stayed-parking-shade', 'SW-CPS-01', 30, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Cable-Stayed Parking Shade'),
  ('prd0pyramidparkingshade00', 'pyramid-parking-shade', 'SW-CPS-02', 31, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Pyramid Parking Shade'),
  ('prd0cantileverparkingshad', 'cantilever-parking-shade', 'SW-CPS-03', 32, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Cantilever Parking Shade'),
  ('prd0steelroofcarport00000', 'steel-roof-carport', 'SW-CPS-04', 33, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Steel Roof Carport'),
  ('prd0doublearchparkingshad', 'double-arch-parking-shade', 'SW-CPS-05', 34, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Double Arch Parking Shade')
) AS p(id, slug, sku, ord, availability, style, use_cases, segment, coverage, tier, name_en)
JOIN "Category" c ON c."slug" = 'car-parking-shades'
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductTranslation" t
  WHERE t."locale" = 'en' AND lower(t."name") = lower(p.name_en)
)
AND EXISTS (SELECT 1 FROM "Product")
ON CONFLICT ("slug") DO NOTHING;

-- Translations and photographs only for the rows created above.
INSERT INTO "ProductTranslation" ("id", "productId", "locale", "name", "tagline", "description", "features", "specs",
  "metaTitle", "metaDescription")
SELECT t.product_id || t.locale, t.product_id, t.locale, t.name, t.tagline, t.description, t.features, t.specs,
  t.name || ' · Saiwan', t.tagline
FROM (VALUES
  ('prd0cablestayedparkingsha', 'en', 'Cable-Stayed Parking Shade', 'Clear bays, held from above', 'Tall masts and cables suspend a continuous fabric canopy over the row, keeping the bays open so doors swing and cars turn freely.', '["Masts and cables carry the canopy","Continuous cover along the whole row","Made to measure for each site"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Tensioned shade fabric"},{"label":"Layout","value":"Continuous row"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0cablestayedparkingsha', 'ar', 'مظلة مواقف معلّقة بالكابلات', 'مواقف خالية، محمولة من الأعلى', 'أعمدةٌ عالية وكابلات تحمل غطاءً قماشيًا متصلًا فوق صف المواقف، فتبقى المواقف مفتوحة لتُفتح الأبواب وتدور السيارات بحرية.', '["أعمدة وكابلات تحمل الغطاء","تغطية متصلة على طول الصف","حسب المقاس لكل موقع"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"قماش تظليل مشدود"},{"label":"التكوين","value":"صف متصل"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0cablestayedparkingsha', 'ckb', 'سێبەری پارکینگی هەڵواسراو بە کێبڵ', 'شوێنی وەستانی بەتاڵ، لە سەرەوە هەڵگیراو', 'کۆڵەکەی بەرز و کێبڵەکان داپۆشینێکی قوماشی بەردەوام بەسەر ڕیزی شوێنی وەستاندا هەڵدەواسن، بۆ ئەوەی شوێنەکان کراوە بمێننەوە و دەرگاکان بە ئازادی بکرێنەوە و ئۆتۆمبێلەکان بسووڕێنەوە.', '["کۆڵەکە و کێبڵ داپۆشینەکە هەڵدەگرن","داپۆشینی بەردەوام بە درێژایی ڕیزەکە","بەپێی پێوانەی هەر شوێنێک"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"قوماشی سێبەری ڕاکێشراو"},{"label":"ڕێکخستن","value":"ڕیزی بەردەوام"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0pyramidparkingshade00', 'en', 'Pyramid Parking Shade', 'Rows of peaks for large car parks', 'Repeating pyramid canopies on a shared frame — the classic way to shade a large car park row by row, with rain running off every peak.', '["Repeating pyramid canopies","Sheds rain from every peak","Scales to car parks of any size"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Tensioned shade fabric"},{"label":"Layout","value":"Single or multiple rows"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0pyramidparkingshade00', 'ar', 'مظلة مواقف هرمية', 'صفوفٌ من القمم لمواقف السيارات الكبيرة', 'مظلات هرمية متكرّرة على هيكلٍ مشترك — الطريقة الكلاسيكية لتظليل مواقف السيارات الكبيرة صفًّا بعد صف، ينساب المطر عن كل قمة.', '["مظلات هرمية متكرّرة","تصريف المطر من كل قمة","تتوسّع لمواقف بأي حجم"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"قماش تظليل مشدود"},{"label":"التكوين","value":"صف واحد أو عدة صفوف"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0pyramidparkingshade00', 'ckb', 'سێبەری پارکینگی هەرەمی', 'ڕیزی لووتکە بۆ پارکینگی گەورە', 'سێبەری هەرەمی دووبارەبووەوە لەسەر چوارچێوەیەکی هاوبەش — ڕێگای کلاسیکی بۆ سێبەرکردنی پارکینگی گەورە ڕیز بە ڕیز، باران لە هەموو لووتکەیەکەوە دەڕژێتە خوارەوە.', '["سێبەری هەرەمی دووبارەبووەوە","باران لە هەموو لووتکەیەک دەڕژێنێت","بۆ پارکینگی هەر قەبارەیەک گونجاوە"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"قوماشی سێبەری ڕاکێشراو"},{"label":"ڕێکخستن","value":"یەک ڕیز یان چەند ڕیزێک"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0cantileverparkingshad', 'en', 'Cantilever Parking Shade', 'Posts at the back, open at the front', 'Single posts stand at the rear of the bays and the canopy reaches forward, leaving the front open for an easy way in — at home beside a building''s entrance.', '["Posts kept to the rear of the bays","Open front for easy parking","Suits building entrances and frontages"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Tensioned shade fabric"},{"label":"Layout","value":"Single row, posts at the rear"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0cantileverparkingshad', 'ar', 'مظلة مواقف كابولية', 'أعمدة في الخلف، وواجهة مفتوحة', 'أعمدة مفردة تقف في مؤخرة المواقف ويمتد الغطاء إلى الأمام، فتبقى الواجهة مفتوحة لدخولٍ سهل — مثالية بجوار مدخل المبنى.', '["الأعمدة في مؤخرة المواقف","واجهة مفتوحة لركنٍ سهل","تناسب مداخل المباني وواجهاتها"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"قماش تظليل مشدود"},{"label":"التكوين","value":"صف واحد، الأعمدة في الخلف"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0cantileverparkingshad', 'ckb', 'سێبەری پارکینگی کانتیلیڤەر', 'کۆڵەکە لە دواوە، کراوە لە پێشەوە', 'کۆڵەکەی تاک لە دواوەی شوێنی وەستانەکان ڕادەوەستن و داپۆشینەکە بەرەو پێشەوە درێژ دەبێتەوە، بەشی پێشەوە بۆ چوونەژوورەوەی ئاسان کراوە دەهێڵێتەوە — گونجاو لە تەنیشت دەروازەی باڵەخانە.', '["کۆڵەکەکان لە دواوەی شوێنەکانن","پێشەوەی کراوە بۆ وەستانی ئاسان","گونجاو بۆ دەروازە و ڕووکاری باڵەخانە"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"قوماشی سێبەری ڕاکێشراو"},{"label":"ڕێکخستن","value":"یەک ڕیز، کۆڵەکە لە دواوە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0steelroofcarport00000', 'en', 'Steel Roof Carport', 'A solid roof for every season', 'A steel frame under a metal panel roof, for sites that want fully solid cover against sun and rain, in clean lines that suit offices and hospitals.', '["Solid metal roof","Shelter from sun and rain","Clean lines for offices and hospitals"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Metal roof panels"},{"label":"Layout","value":"Single or multiple rows"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0steelroofcarport00000', 'ar', 'مظلة مواقف بسقف معدني', 'سقفٌ صلب لكل المواسم', 'هيكل فولاذي تحت سقفٍ من الألواح المعدنية، للمواقع التي تريد غطاءً صلبًا بالكامل من الشمس والمطر، بخطوطٍ نظيفة تناسب المكاتب والمستشفيات.', '["سقف معدني صلب","حماية من الشمس والمطر","خطوط نظيفة للمكاتب والمستشفيات"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"ألواح سقف معدنية"},{"label":"التكوين","value":"صف واحد أو عدة صفوف"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0steelroofcarport00000', 'ckb', 'سێبەری پارکینگی بە سەقفی کانزایی', 'سەقفێکی پتەو بۆ هەموو وەرزێک', 'چوارچێوەیەکی پۆڵایی لە ژێر سەقفێکی پانێڵی کانزاییدا، بۆ ئەو شوێنانەی داپۆشینێکی تەواو پتەویان دەوێت دژی خۆر و باران، بە هێڵی پاک کە لەگەڵ ئۆفیس و نەخۆشخانەکان دەگونجێت.', '["سەقفی کانزایی پتەو","پاراستن لە خۆر و باران","هێڵی پاک بۆ ئۆفیس و نەخۆشخانە"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"پانێڵی سەقفی کانزایی"},{"label":"ڕێکخستن","value":"یەک ڕیز یان چەند ڕیزێک"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0doublearchparkingshad', 'en', 'Double Arch Parking Shade', 'Two rows from one line of posts', 'Curved canopies reach out to both sides of a central line of posts, covering two rows of bays at once with a single structure.', '["Covers two rows of bays at once","One central line of posts","Curved canopies on both sides"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Tensioned shade fabric"},{"label":"Layout","value":"Two rows, central posts"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0doublearchparkingshad', 'ar', 'مظلة مواقف مقوّسة مزدوجة', 'صفّان من خطٍّ واحد من الأعمدة', 'أغطية مقوّسة تمتد إلى جانبَي خطٍّ مركزي من الأعمدة، فتغطي صفّين من المواقف في آنٍ واحد ببنيةٍ واحدة.', '["يغطي صفّين من المواقف معًا","خط مركزي واحد من الأعمدة","أغطية مقوّسة على الجانبين"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"قماش تظليل مشدود"},{"label":"التكوين","value":"صفّان، أعمدة في الوسط"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0doublearchparkingshad', 'ckb', 'سێبەری پارکینگی کەوانەیی دووانە', 'دوو ڕیز لە یەک هێڵی کۆڵەکە', 'داپۆشینی کەوانەیی بۆ هەردوو لای هێڵێکی ناوەندی کۆڵەکە درێژ دەبنەوە، و بە یەک بنیات دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشن.', '["دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشێت","یەک هێڵی ناوەندی کۆڵەکە","داپۆشینی کەوانەیی لە هەردوو لا"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"قوماشی سێبەری ڕاکێشراو"},{"label":"ڕێکخستن","value":"دوو ڕیز، کۆڵەکە لە ناوەڕاست"},{"label":"قەبارە","value":"بەپێی پێوانە"}]')
) AS t(product_id, locale, name, tagline, description, features, specs)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = t.product_id)
ON CONFLICT ("productId", "locale") DO NOTHING;

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order")
SELECT i.product_id || 'img0', i.product_id, i.url, i.alt, 0
FROM (VALUES
  ('prd0cablestayedparkingsha', '/media/parking-cable-stayed.jpg', 'Cable-Stayed Parking Shade — primary view'),
  ('prd0pyramidparkingshade00', '/media/parking-pyramid.jpg', 'Pyramid Parking Shade — primary view'),
  ('prd0cantileverparkingshad', '/media/parking-cantilever.jpg', 'Cantilever Parking Shade — primary view'),
  ('prd0steelroofcarport00000', '/media/parking-steel-roof.jpg', 'Steel Roof Carport — primary view'),
  ('prd0doublearchparkingshad', '/media/parking-double-arch.jpg', 'Double Arch Parking Shade — primary view')
) AS i(product_id, url, alt)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = i.product_id)
ON CONFLICT ("id") DO NOTHING;
