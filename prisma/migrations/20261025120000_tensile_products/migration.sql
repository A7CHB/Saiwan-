-- Six tensile structure designs, one per project photograph, in the Tensile
-- Structures category.
--
-- Insert-only, like car_parking_products before it: nothing existing is
-- updated or deleted. A product is skipped if its slug or English name is
-- already taken, or if there is no category with the slug tensile-structures
-- to put it in. prisma/seed.ts carries the same six so a fresh database
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
  ('prd0archedmembranecanopy0', 'arched-membrane-canopy', 'SW-TEN-01', 40, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Arched Membrane Canopy'),
  ('prd0twinpeakcanopy0000000', 'twin-peak-canopy', 'SW-TEN-02', 41, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Twin Peak Canopy'),
  ('prd0multimastmembrane0000', 'multi-mast-membrane', 'SW-TEN-03', 42, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Multi-Mast Membrane'),
  ('prd0grandstandroof0000000', 'grandstand-roof', 'SW-TEN-04', 43, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Grandstand Roof'),
  ('prd0multipeakcanopy000000', 'multi-peak-canopy', 'SW-TEN-05', 44, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Multi-Peak Canopy'),
  ('prd0invertedconecanopy000', 'inverted-cone-canopy', 'SW-TEN-06', 45, 'MADE_TO_ORDER', 'MODERN', '[]', 'COMMERCIAL', 0, 3, 'Inverted Cone Canopy')
) AS p(id, slug, sku, ord, availability, style, use_cases, segment, coverage, tier, name_en)
JOIN "Category" c ON c."slug" = 'tensile-structures'
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
  ('prd0archedmembranecanopy0', 'en', 'Arched Membrane Canopy', 'A sweeping roof on curved steel arches', 'Curved steel arches carry a tensioned membrane in one sweeping span, sheltering a stage, seating or a courtyard without columns in the middle.', '["Curved steel arches","Open span with no central columns","Suits stages, amphitheatres and courtyards"]', '[{"label":"Structure","value":"Curved steel arches"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Stages and courtyards"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0archedmembranecanopy0', 'ar', 'مظلة غشائية مقوّسة', 'سقفٌ منساب على أقواس فولاذية', 'أقواس فولاذية منحنية تحمل غشاءً مشدودًا في امتدادٍ واحد منساب، تظلّل مسرحًا أو مقاعد أو فناءً دون أعمدة في الوسط.', '["أقواس فولاذية منحنية","امتداد مفتوح دون أعمدة وسطى","يناسب المسارح والمدرّجات والأفنية"]', '[{"label":"الهيكل","value":"أقواس فولاذية منحنية"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"المسارح والأفنية"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0archedmembranecanopy0', 'ckb', 'سێبەری پەردەیی کەوانەیی', 'سەقفێکی ڕەوان لەسەر کەوانەی پۆڵایی', 'کەوانەی پۆڵایی چەماوە پەردەیەکی ڕاکێشراو لە یەک ماوەی ڕەواندا هەڵدەگرن، سێبەر بۆ شانۆ یان شوێنی دانیشتن یان حەوشە دەکەن بەبێ کۆڵەکە لە ناوەڕاستدا.', '["کەوانەی پۆڵایی چەماوە","ماوەی کراوە بەبێ کۆڵەکەی ناوەڕاست","گونجاو بۆ شانۆ و ئەمفیتیاتر و حەوشە"]', '[{"label":"چوارچێوە","value":"کەوانەی پۆڵایی چەماوە"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"شانۆ و حەوشە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0twinpeakcanopy0000000', 'en', 'Twin Peak Canopy', 'Two peaks over a shaded courtyard', 'Two cone-shaped membranes rise from central masts to shade cafés, courtyards and outdoor seating, with low anchor points that keep the space open.', '["Two cone-shaped peaks","Low anchor points around the edge","Suits cafés, courtyards and outdoor seating"]', '[{"label":"Structure","value":"Steel masts and cables"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Cafés and courtyards"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0twinpeakcanopy0000000', 'ar', 'مظلة القمّتين', 'قمّتان فوق فناءٍ مظلّل', 'غشاءان مخروطيان يرتفعان من أعمدة مركزية لتظليل المقاهي والأفنية وجلسات الهواء الطلق، مع نقاط تثبيت منخفضة تُبقي المكان مفتوحًا.', '["قمّتان مخروطيتان","نقاط تثبيت منخفضة على الأطراف","تناسب المقاهي والأفنية والجلسات الخارجية"]', '[{"label":"الهيكل","value":"أعمدة فولاذية وكابلات"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"المقاهي والأفنية"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0twinpeakcanopy0000000', 'ckb', 'سێبەری دوو لووتکە', 'دوو لووتکە بەسەر حەوشەیەکی سێبەرداردا', 'دوو پەردەی قووچەکی لە کۆڵەکەی ناوەندییەوە بەرز دەبنەوە بۆ سێبەرکردنی کافێ و حەوشە و شوێنی دانیشتنی دەرەوە، بە خاڵی بەستنەوەی نزم کە شوێنەکە کراوە دەهێڵنەوە.', '["دوو لووتکەی قووچەکی","خاڵی بەستنەوەی نزم لە دەوروبەر","گونجاو بۆ کافێ و حەوشە و دانیشتنی دەرەوە"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی و کێبڵ"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"کافێ و حەوشە"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0multimastmembrane0000', 'en', 'Multi-Mast Membrane', 'A sculptural roof held by masts and cables', 'A single membrane stretched between tall masts and cables into a sculptural, high-and-low form — a landmark over an entrance, plaza or drop-off.', '["Tall masts with tension cables","High and low points in one membrane","Suits entrances, plazas and drop-offs"]', '[{"label":"Structure","value":"Steel masts and cables"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Entrances and plazas"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0multimastmembrane0000', 'ar', 'غشاء متعدد الأعمدة', 'سقفٌ نحتي تحمله أعمدة وكابلات', 'غشاءٌ واحد مشدود بين أعمدة عالية وكابلات بشكلٍ نحتي يعلو ويهبط — معلمٌ فوق مدخل أو ساحة أو منطقة إنزال.', '["أعمدة عالية مع كابلات شدّ","نقاط عالية ومنخفضة في غشاءٍ واحد","يناسب المداخل والساحات ومناطق الإنزال"]', '[{"label":"الهيكل","value":"أعمدة فولاذية وكابلات"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"المداخل والساحات"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0multimastmembrane0000', 'ckb', 'پەردەی فرە کۆڵەکە', 'سەقفێکی پەیکەرئاسا کە کۆڵەکە و کێبڵ هەڵیدەگرن', 'یەک پەردە لە نێوان کۆڵەکەی بەرز و کێبڵەکاندا ڕادەکێشرێت بۆ شێوەیەکی پەیکەرئاسای بەرز و نزم — نیشانەیەک بەسەر دەروازە یان گۆڕەپان یان شوێنی دابەزاندندا.', '["کۆڵەکەی بەرز لەگەڵ کێبڵی ڕاکێشان","خاڵی بەرز و نزم لە یەک پەردەدا","گونجاو بۆ دەروازە و گۆڕەپان و شوێنی دابەزاندن"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی و کێبڵ"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"دەروازە و گۆڕەپان"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0grandstandroof0000000', 'en', 'Grandstand Roof', 'Cover for every seat in the stand', 'Steel trusses carry a tensioned membrane over spectator stands, keeping the sun off every row while leaving the view of the field clear.', '["Steel truss frame","Shades every row of seating","Clear view of the field"]', '[{"label":"Structure","value":"Steel trusses"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Stadiums and sports grounds"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0grandstandroof0000000', 'ar', 'سقف المدرّجات', 'غطاءٌ لكل مقعد في المدرّج', 'جمالونات فولاذية تحمل غشاءً مشدودًا فوق مدرّجات المتفرجين، فتحجب الشمس عن كل صف وتُبقي رؤية الملعب واضحة.', '["هيكل جمالونات فولاذية","يظلّل كل صفوف المقاعد","رؤية واضحة للملعب"]', '[{"label":"الهيكل","value":"جمالونات فولاذية"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"الملاعب والمنشآت الرياضية"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0grandstandroof0000000', 'ckb', 'سەقفی سەکۆی تەماشاکەران', 'داپۆشین بۆ هەموو کورسییەک لە سەکۆکەدا', 'خەرپای پۆڵایی پەردەیەکی ڕاکێشراو بەسەر سەکۆی تەماشاکەراندا هەڵدەگرن، خۆر لە هەموو ڕیزێک دەگرێتەوە و دیمەنی یاریگاکە ڕوون دەهێڵێتەوە.', '["چوارچێوەی خەرپای پۆڵایی","سێبەر بۆ هەموو ڕیزەکانی دانیشتن","دیمەنی ڕوونی یاریگا"]', '[{"label":"چوارچێوە","value":"خەرپای پۆڵایی"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"یاریگا و شوێنە وەرزشییەکان"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0multipeakcanopy000000', 'en', 'Multi-Peak Canopy', 'A row of peaks over a gathering place', 'Linked conical peaks on slender masts cover amphitheatres, event spaces and public gathering places — a landmark you can see from far away.', '["Linked conical peaks","Slender masts","Suits amphitheatres and event spaces"]', '[{"label":"Structure","value":"Steel masts and cables"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Amphitheatres and events"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0multipeakcanopy000000', 'ar', 'مظلة متعددة القمم', 'صفٌّ من القمم فوق مكان التجمّع', 'قممٌ مخروطية متصلة على أعمدة رشيقة تغطي المدرّجات المفتوحة وأماكن الفعاليات والتجمّعات العامة — معلمٌ يُرى من بعيد.', '["قمم مخروطية متصلة","أعمدة رشيقة","تناسب المدرّجات المفتوحة وأماكن الفعاليات"]', '[{"label":"الهيكل","value":"أعمدة فولاذية وكابلات"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"المدرّجات والفعاليات"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0multipeakcanopy000000', 'ckb', 'سێبەری فرە لووتکە', 'ڕیزێک لووتکە بەسەر شوێنی کۆبوونەوەدا', 'لووتکەی قووچەکی بەیەکەوە بەستراو لەسەر کۆڵەکەی باریک ئەمفیتیاتر و شوێنی بۆنەکان و شوێنی کۆبوونەوەی گشتی دادەپۆشن — نیشانەیەک کە لە دوورەوە دەبینرێت.', '["لووتکەی قووچەکی بەیەکەوە بەستراو","کۆڵەکەی باریک","گونجاو بۆ ئەمفیتیاتر و شوێنی بۆنەکان"]', '[{"label":"چوارچێوە","value":"کۆڵەکەی پۆڵایی و کێبڵ"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"ئەمفیتیاتر و بۆنەکان"},{"label":"قەبارە","value":"بەپێی پێوانە"}]'),
  ('prd0invertedconecanopy000', 'en', 'Inverted Cone Canopy', 'Shade that opens like a flower', 'Freestanding funnels on a single column, each with a steel ring at the rim — set in groups across parks, plazas and public squares.', '["Single central column","Steel ring at the rim","Suits parks, plazas and public squares"]', '[{"label":"Structure","value":"Steel column and rim ring"},{"label":"Covering","value":"Tensioned membrane"},{"label":"Setting","value":"Parks and plazas"},{"label":"Size","value":"Made to measure"}]'),
  ('prd0invertedconecanopy000', 'ar', 'مظلة مخروطية مقلوبة', 'ظلٌّ يتفتّح كالزهرة', 'مظلات قائمة بذاتها على شكل قِمع فوق عمودٍ واحد، لكلٍّ منها حلقة فولاذية عند الحافة — تُوزَّع في مجموعات عبر الحدائق والساحات العامة.', '["عمود مركزي واحد","حلقة فولاذية عند الحافة","تناسب الحدائق والساحات العامة"]', '[{"label":"الهيكل","value":"عمود وحلقة فولاذية"},{"label":"الغطاء","value":"غشاء مشدود"},{"label":"الموقع","value":"الحدائق والساحات"},{"label":"المقاس","value":"حسب المقاس"}]'),
  ('prd0invertedconecanopy000', 'ckb', 'سێبەری قووچەکی هەڵگەڕاوە', 'سێبەرێک وەک گوڵ دەکرێتەوە', 'سێبەری سەربەخۆ بە شێوەی قیف لەسەر یەک کۆڵەکە، هەریەکە بە ئەڵقەیەکی پۆڵایی لە لێوارەکەیدا — بە کۆمەڵ لە پارک و گۆڕەپان و مەیدانە گشتییەکاندا دادەنرێن.', '["یەک کۆڵەکەی ناوەندی","ئەڵقەی پۆڵایی لە لێوار","گونجاو بۆ پارک و گۆڕەپان و مەیدانی گشتی"]', '[{"label":"چوارچێوە","value":"کۆڵەکە و ئەڵقەی پۆڵایی"},{"label":"داپۆشین","value":"پەردەی ڕاکێشراو"},{"label":"شوێن","value":"پارک و گۆڕەپان"},{"label":"قەبارە","value":"بەپێی پێوانە"}]')
) AS t(product_id, locale, name, tagline, description, features, specs)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = t.product_id)
ON CONFLICT ("productId", "locale") DO NOTHING;

-- Wide project photographs, so their dimensions are recorded: that is what frames them
-- whole on the card and the product page instead of cropping them to 3:4.
INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "order", "width", "height")
SELECT i.product_id || 'img0', i.product_id, i.url, i.alt, 0, i.width, i.height
FROM (VALUES
  ('prd0archedmembranecanopy0', '/media/tensile-arched.webp', 'Arched Membrane Canopy — primary view', 1024, 576),
  ('prd0twinpeakcanopy0000000', '/media/tensile-twin-peak.webp', 'Twin Peak Canopy — primary view', 1024, 576),
  ('prd0multimastmembrane0000', '/media/tensile-multi-mast.webp', 'Multi-Mast Membrane — primary view', 1024, 576),
  ('prd0grandstandroof0000000', '/media/tensile-grandstand.webp', 'Grandstand Roof — primary view', 1024, 576),
  ('prd0multipeakcanopy000000', '/media/tensile-multi-peak.webp', 'Multi-Peak Canopy — primary view', 1024, 576),
  ('prd0invertedconecanopy000', '/media/tensile-inverted-cone.webp', 'Inverted Cone Canopy — primary view', 1024, 572)
) AS i(product_id, url, alt, width, height)
WHERE EXISTS (SELECT 1 FROM "Product" p WHERE p."id" = i.product_id)
ON CONFLICT ("id") DO NOTHING;
