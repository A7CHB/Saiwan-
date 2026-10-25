-- Six covered walkway designs, one per project photograph, in the Walkway
-- Shades category.
--
-- Insert-only, like tensile_products before it: nothing existing is updated
-- or deleted. A product is skipped if its slug or English name is already
-- taken, or if there is no category with the slug walkway-shades to put it
-- in. prisma/seed.ts carries the same six so a fresh database matches.
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
  ('prd0continuouswalkwaycano', 'continuous-walkway-canopy', 'SW-WLK-01', 50, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Continuous Walkway Canopy'),
  ('prd0timberlooklouvrewalkw', 'timber-look-louvre-walkway', 'SW-WLK-02', 51, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Timber-Look Louvre Walkway'),
  ('prd0industrialcoveredwalk', 'industrial-covered-walkway', 'SW-WLK-03', 52, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Industrial Covered Walkway'),
  ('prd0whitelouvrewalkway000', 'white-louvre-walkway', 'SW-WLK-04', 53, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'White Louvre Walkway'),
  ('prd0sailwalkwayshade00000', 'sail-walkway-shade', 'SW-WLK-05', 54, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Sail Walkway Shade'),
  ('prd0steelframecoveredwalk', 'steel-frame-covered-walkway', 'SW-WLK-06', 55, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Steel Frame Covered Walkway')
) AS p(id, slug, sku, ord, availability, style, use_cases, segment, coverage, tier, name_en)
JOIN "Category" c ON c."slug" = 'walkway-shades'
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
  ('prd0continuouswalkwaycano', 'en', 'Continuous Walkway Canopy', 'Shade along every path', 'A continuous canopy that follows the paths through a residential community or campus, branching where the routes do, so people stay in the shade from door to door.', '["Follows and branches with the paths","Long continuous runs","Suits residential communities and campuses"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Tensioned shade fabric"},{"label":"Setting","value":"Communities and campuses"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0continuouswalkwaycano', 'ar', 'مظلة ممرات متصلة', 'ظلٌّ على امتداد كل ممر', 'مظلة متصلة تتبع الممرات عبر المجمّعات السكنية والحرم الجامعية، وتتفرّع حيث تتفرّع الطرق ليبقى الناس في الظل من بابٍ إلى باب.', '["تتبع الممرات وتتفرّع معها","امتدادات طويلة متصلة","تناسب المجمّعات السكنية والحرم الجامعية"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"قماش تظليل مشدود"},{"label":"الموقع","value":"المجمّعات والحرم الجامعية"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0continuouswalkwaycano', 'ckb', 'سێبەری ڕێڕەوی بەردەوام', 'سێبەر بە درێژایی هەموو ڕێگایەک', 'سێبەرێکی بەردەوام کە بەدوای ڕێگاکانی ناو کۆمەڵگەیەکی نیشتەجێبوون یان کەمپەسێکدا دەڕوات، و لەو شوێنانەی ڕێگاکان لق دەبنەوە ئەویش لق دەبێتەوە، بۆ ئەوەی خەڵک لە دەرگاوە بۆ دەرگا لە سێبەردا بمێننەوە.', '["بەدوای ڕێگاکاندا دەڕوات و لق دەبێتەوە","ماوەی درێژی بەردەوام","گونجاو بۆ کۆمەڵگەی نیشتەجێبوون و کەمپەس"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"قوماشی سێبەری ڕاکێشراو"},{"label":"شوێن","value":"کۆمەڵگە و کەمپەس"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0timberlooklouvrewalkw', 'en', 'Timber-Look Louvre Walkway', 'Warm slatted shade for garden paths', 'A louvred roof with a warm timber-look finish on slender posts, casting striped shade along park and garden paths.', '["Louvred roof with a timber-look finish","Slender posts","Suits parks and garden paths"]', '[{"label":"Structure","value":"Steel posts"},{"label":"Covering","value":"Louvres, timber-look finish"},{"label":"Setting","value":"Parks and gardens"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0timberlooklouvrewalkw', 'ar', 'ممر بشرائح بمظهر خشبي', 'ظلٌّ دافئ بالشرائح لممرات الحدائق', 'سقفٌ بشرائح بمظهرٍ خشبي دافئ على أعمدة رشيقة، يلقي ظلًّا مخطّطًا على ممرات الحدائق والمتنزّهات.', '["سقف بشرائح بمظهر خشبي","أعمدة رشيقة","يناسب الحدائق وممراتها"]', '[{"label":"الهيكل","value":"أعمدة فولاذية"},{"label":"الغطاء","value":"شرائح بمظهر خشبي"},{"label":"الموقع","value":"الحدائق والمتنزّهات"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0timberlooklouvrewalkw', 'ckb', 'ڕێڕەوی لووڤەری بە ڕووکاری دار', 'سێبەری گەرمی شریتی بۆ ڕێگاکانی باخچە', 'سەقفێکی لووڤەری بە ڕووکارێکی گەرمی دار لەسەر کۆڵەکەی باریک، سێبەرێکی هێڵدار دەخاتە سەر ڕێگاکانی پارک و باخچە.', '["سەقفی لووڤەری بە ڕووکاری دار","کۆڵەکەی باریک","گونجاو بۆ پارک و ڕێگاکانی باخچە"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی"},{"label":"داپۆشین","value":"لووڤەر بە ڕووکاری دار"},{"label":"شوێن","value":"پارک و باخچە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0industrialcoveredwalk', 'en', 'Industrial Covered Walkway', 'Practical cover from door to door', 'Steel posts and a corrugated metal roof give hard-wearing cover between car parks and the doors of warehouses, factories and logistics sites.', '["Corrugated metal roof","Hard-wearing steel posts","Suits warehouses and factories"]', '[{"label":"Structure","value":"Steel posts"},{"label":"Covering","value":"Corrugated metal sheet"},{"label":"Setting","value":"Warehouses and factories"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0industrialcoveredwalk', 'ar', 'ممر مسقوف صناعي', 'غطاءٌ عملي من بابٍ إلى باب', 'أعمدة فولاذية وسقف من الألواح المعدنية المموّجة توفّر غطاءً متينًا بين المواقف وأبواب المستودعات والمصانع والمواقع اللوجستية.', '["سقف معدني مموّج","أعمدة فولاذية متينة","يناسب المستودعات والمصانع"]', '[{"label":"الهيكل","value":"أعمدة فولاذية"},{"label":"الغطاء","value":"ألواح معدنية مموّجة"},{"label":"الموقع","value":"المستودعات والمصانع"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0industrialcoveredwalk', 'ckb', 'ڕێڕەوی داپۆشراوی پیشەسازی', 'داپۆشینێکی کرداری لە دەرگاوە بۆ دەرگا', 'کۆڵەکەی پۆڵایی و سەقفێکی پەڕەی کانزایی شەپۆلی داپۆشینێکی بەرگەگر لە نێوان پارکینگ و دەرگای کۆگا و کارگە و شوێنە لۆجستییەکاندا دابین دەکەن.', '["سەقفی کانزایی شەپۆلی","کۆڵەکەی پۆڵایی بەرگەگر","گونجاو بۆ کۆگا و کارگە"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی"},{"label":"داپۆشین","value":"پەڕەی کانزایی شەپۆلی"},{"label":"شوێن","value":"کۆگا و کارگە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0whitelouvrewalkway000', 'en', 'White Louvre Walkway', 'A bright, cool passage between buildings', 'A white louvred roof on slim columns lets light filter through while keeping the sun off — a calm connecting passage for hotels, resorts and residences.', '["White louvred roof","Light filters through, sun stays out","Suits hotels, resorts and residences"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Louvred roof"},{"label":"Setting","value":"Hotels and residences"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0whitelouvrewalkway000', 'ar', 'ممر بشرائح بيضاء', 'ممرّ مضيء وبارد بين المباني', 'سقفٌ أبيض بشرائح على أعمدة نحيلة يسمح بمرور الضوء ويحجب الشمس — ممرٌّ هادئ يربط بين أجزاء الفنادق والمنتجعات والمساكن.', '["سقف أبيض بشرائح","يمرّ الضوء وتُحجب الشمس","يناسب الفنادق والمنتجعات والمساكن"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"سقف بشرائح"},{"label":"الموقع","value":"الفنادق والمساكن"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0whitelouvrewalkway000', 'ckb', 'ڕێڕەوی لووڤەری سپی', 'ڕێڕەوێکی ڕووناک و فێنک لە نێوان باڵەخانەکاندا', 'سەقفێکی لووڤەری سپی لەسەر کۆڵەکەی باریک ڕێگە بە تێپەڕبوونی ڕووناکی دەدات و خۆر ڕادەگرێت — ڕێڕەوێکی ئارام بۆ پەیوەندکردنی بەشەکانی هۆتێل و ڕیزۆرت و نیشتەجێگا.', '["سەقفی لووڤەری سپی","ڕووناکی تێدەپەڕێت و خۆر ڕادەگیرێت","گونجاو بۆ هۆتێل و ڕیزۆرت و نیشتەجێگا"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"سەقفی لووڤەری"},{"label":"شوێن","value":"هۆتێل و نیشتەجێگا"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0sailwalkwayshade00000', 'en', 'Sail Walkway Shade', 'Sails in a row along the path', 'Overlapping fabric sails stretched between tall posts shade a long path in a light, open rhythm — at home on campuses and in public grounds.', '["Overlapping sails along the path","Tall steel posts","Suits campuses and public grounds"]', '[{"label":"Structure","value":"Steel posts"},{"label":"Covering","value":"Tensioned shade sails"},{"label":"Setting","value":"Campuses and public grounds"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0sailwalkwayshade00000', 'ar', 'مظلة ممرات بالأشرعة', 'أشرعة متتالية على امتداد الممر', 'أشرعة قماشية متداخلة مشدودة بين أعمدة عالية تظلّل ممرًّا طويلًا بإيقاعٍ خفيف ومفتوح — مثالية للحرم الجامعية والمساحات العامة.', '["أشرعة متداخلة على طول الممر","أعمدة فولاذية عالية","تناسب الحرم الجامعية والمساحات العامة"]', '[{"label":"الهيكل","value":"أعمدة فولاذية"},{"label":"الغطاء","value":"أشرعة تظليل مشدودة"},{"label":"الموقع","value":"الحرم الجامعية والمساحات العامة"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0sailwalkwayshade00000', 'ckb', 'سێبەری ڕێڕەو بە چارۆکە', 'چارۆکەی ڕیزکراو بە درێژایی ڕێگاکە', 'چارۆکەی قوماشی یەکتربڕ کە لە نێوان کۆڵەکەی بەرزدا ڕاکێشراون ڕێگایەکی درێژ بە ڕیتمێکی سووک و کراوە سێبەر دەکەن — گونجاو بۆ کەمپەس و شوێنە گشتییەکان.', '["چارۆکەی یەکتربڕ بە درێژایی ڕێگا","کۆڵەکەی پۆڵایی بەرز","گونجاو بۆ کەمپەس و شوێنی گشتی"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی"},{"label":"داپۆشین","value":"چارۆکەی سێبەری ڕاکێشراو"},{"label":"شوێن","value":"کەمپەس و شوێنی گشتی"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0steelframecoveredwalk', 'en', 'Steel Frame Covered Walkway', 'Solid cover with clean lines', 'A steel frame with a solid panel roof and built-in rainwater downpipes links buildings across a campus, keeping off sun and rain alike.', '["Solid panel roof","Built-in rainwater downpipes","Suits schools, hospitals and campuses"]', '[{"label":"Structure","value":"Steel frame"},{"label":"Covering","value":"Solid roof panels"},{"label":"Setting","value":"Schools and hospitals"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0steelframecoveredwalk', 'ar', 'ممر مسقوف بهيكل فولاذي', 'غطاءٌ صلب بخطوطٍ نظيفة', 'هيكل فولاذي بسقفٍ من الألواح الصلبة ومواسير تصريف مدمجة لمياه الأمطار، يربط المباني عبر الحرم ويحمي من الشمس والمطر معًا.', '["سقف من ألواح صلبة","مواسير مدمجة لتصريف الأمطار","يناسب المدارس والمستشفيات والحرم الجامعية"]', '[{"label":"الهيكل","value":"هيكل فولاذي"},{"label":"الغطاء","value":"ألواح سقف صلبة"},{"label":"الموقع","value":"المدارس والمستشفيات"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0steelframecoveredwalk', 'ckb', 'ڕێڕەوی داپۆشراو بە چوارچێوەی پۆڵایی', 'داپۆشینی پتەو بە هێڵی پاک', 'چوارچێوەیەکی پۆڵایی بە سەقفی پانێڵی پتەو و بۆری ئاوی بارانی تێکەڵکراو، باڵەخانەکانی ناو کەمپەسێک بە یەکەوە دەبەستێتەوە و لە خۆر و باران دەپارێزێت.', '["سەقفی پانێڵی پتەو","بۆری ئاوی بارانی تێکەڵکراو","گونجاو بۆ قوتابخانە و نەخۆشخانە و کەمپەس"]', '[{"label":"چوارچێوە","value":"چوارچێوەی پۆڵایی"},{"label":"داپۆشین","value":"پانێڵی سەقفی پتەو"},{"label":"شوێن","value":"قوتابخانە و نەخۆشخانە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]')
) AS t(product_id, locale, name, tagline, description, features, specs)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = t.product_id)
ON CONFLICT ("productId", "locale") DO NOTHING;

-- Wide project photographs, so their dimensions are recorded: that is what frames them
-- whole on the card and the product page instead of cropping them to 3:4.
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "width", "height")
SELECT i.product_id || 'img0', i.product_id, i.url, i.alt, 0, i.width, i.height
FROM (VALUES
  ('prd0continuouswalkwaycano', '/media/walkway-continuous.webp', 'Continuous Walkway Canopy — primary view', 1024, 576),
  ('prd0timberlooklouvrewalkw', '/media/walkway-timber-louvre.webp', 'Timber-Look Louvre Walkway — primary view', 1024, 576),
  ('prd0industrialcoveredwalk', '/media/walkway-industrial.webp', 'Industrial Covered Walkway — primary view', 1024, 576),
  ('prd0whitelouvrewalkway000', '/media/walkway-white-louvre.webp', 'White Louvre Walkway — primary view', 1024, 576),
  ('prd0sailwalkwayshade00000', '/media/walkway-sails.webp', 'Sail Walkway Shade — primary view', 1024, 576),
  ('prd0steelframecoveredwalk', '/media/walkway-steel-frame.jpg', 'Steel Frame Covered Walkway — primary view', 2000, 1125)
) AS i(product_id, url, alt, width, height)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = i.product_id)
ON CONFLICT ("id") DO NOTHING;
