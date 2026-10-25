-- New copy for Car Parking Shades and its five products: the category now
-- says why parking shade matters in a 40–45°C summer, and each product says
-- where it suits, in English, Arabic and Kurdish. prisma/seed.ts carries the
-- same text so a fresh database matches.
--
-- Update-only, and each field only where it still holds the original wording:
-- anything already rewritten in the dashboard is left as it is.

UPDATE "CategoryTranslation" SET "tagline" = 'Cover for every car, through the hottest summers'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "tagline" = 'Cover for every bay';

UPDATE "CategoryTranslation" SET "description" = 'Across Kurdistan and Iraq, summer temperatures regularly pass 40–45°C, and a car parked in full sun becomes far hotter inside than the air around it. Steering wheels and seats become too hot to touch, dashboards crack and fade, and paint, tyres and electronics wear out years early. Our car parking shades keep vehicles out of the direct sun all day, protecting the car and making it comfortable to get into — whether at home, at the office, at a hotel or across a large car park. Every structure is built to measure, engineered for local heat and dust, and installed by our team.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "description" = 'Steel-framed shade over parking bays that keeps cars, and the people getting into them, out of the midday sun.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('Across Kurdistan and Iraq, summer temperatures regularly pass 40–45°C, and a car parked in full sun becomes far hotter inside than the air around it. Steering wheels and seats become too hot to touch, dashboards crack and fade, and paint, tyres and electronics wear out years early. Our car parking shades keep vehicles out of the direct sun all day, protecting the car and making it comfortable to get into — whether at home, at the office, at a hotel or across a large car park. Every structure is built to measure, engineered for local heat and dust, and installed by our team.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "metaDescription" = left('Steel-framed shade over parking bays that keeps cars, and the people getting into them, out of the midday sun.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'حمايةٌ لكل سيارة في أشدّ أيام الصيف حرارة'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "tagline" = 'غطاءٌ لكل موقف';

UPDATE "CategoryTranslation" SET "description" = 'تتجاوز درجات الحرارة صيفًا في إقليم كوردستان والعراق ٤٠–٤٥ درجة مئوية بانتظام، وحين تُركن السيارة تحت أشعة الشمس المباشرة تصبح حرارتها من الداخل أعلى بكثير من حرارة الهواء المحيط بها؛ فيغدو المقود والمقاعد ساخنةً لا تُلمس، وتتشقّق لوحة القيادة ويبهت لونها، ويتلف الطلاء والإطارات والأجهزة الإلكترونية قبل أوانها بسنوات. تُبقي مظلات مواقف السيارات لدينا المركبات بعيدةً عن أشعة الشمس المباشرة طوال اليوم، فتحمي السيارة وتجعل ركوبها مريحًا — سواء في المنزل أو المكتب أو الفندق أو في مواقف السيارات الكبيرة. تُصمَّم كل منشأة حسب المقاس، وتُهندَس لتتحمّل حرارة المنطقة وغبارها، ويتولّى فريقنا تركيبها.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "description" = 'مظلات بإطاراتٍ فولاذية فوق مواقف السيارات تحمي السيارات ومن يركبها من شمس الظهيرة.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('تتجاوز درجات الحرارة صيفًا في إقليم كوردستان والعراق ٤٠–٤٥ درجة مئوية بانتظام، وحين تُركن السيارة تحت أشعة الشمس المباشرة تصبح حرارتها من الداخل أعلى بكثير من حرارة الهواء المحيط بها؛ فيغدو المقود والمقاعد ساخنةً لا تُلمس، وتتشقّق لوحة القيادة ويبهت لونها، ويتلف الطلاء والإطارات والأجهزة الإلكترونية قبل أوانها بسنوات. تُبقي مظلات مواقف السيارات لدينا المركبات بعيدةً عن أشعة الشمس المباشرة طوال اليوم، فتحمي السيارة وتجعل ركوبها مريحًا — سواء في المنزل أو المكتب أو الفندق أو في مواقف السيارات الكبيرة. تُصمَّم كل منشأة حسب المقاس، وتُهندَس لتتحمّل حرارة المنطقة وغبارها، ويتولّى فريقنا تركيبها.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "metaDescription" = left('مظلات بإطاراتٍ فولاذية فوق مواقف السيارات تحمي السيارات ومن يركبها من شمس الظهيرة.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'پاراستن بۆ هەموو ئۆتۆمبێلێک، لە گەرمترین هاوینەکاندا'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "tagline" = 'داپۆشین بۆ هەموو شوێنێکی وەستان';

UPDATE "CategoryTranslation" SET "description" = 'لە هەرێمی کوردستان و سەرانسەری عێراقدا، پلەی گەرمی هاوینان بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، و ئۆتۆمبێلێک کە لە ژێر تیشکی ڕاستەوخۆی خۆردا وەستێنرابێت، ناوەوەی زۆر لە هەوای دەوروبەری گەرمتر دەبێت. سوکان و کورسییەکان ئەوەندە گەرم دەبن کە دەستیان لێ نادرێت، داشبۆرد درز دەبات و ڕەنگی کاڵ دەبێتەوە، و بۆیە و تایە و ئامێرە ئەلیکترۆنییەکان چەندین ساڵ زووتر لە کاتی خۆیان تێکدەچن. سێبەرەکانی پارکینگی ئێمە ئۆتۆمبێلەکان بە درێژایی ڕۆژ لە تیشکی ڕاستەوخۆی خۆر دەپارێزن، ئۆتۆمبێلەکە دەپارێزن و سواربوونی ئاسوودە دەکەن — جا لە ماڵەوە بێت یان ئۆفیس یان هۆتێل یان پارکینگێکی گەورە. هەموو بنیاتێک بەپێی پێوانە دروست دەکرێت، بۆ بەرگەگرتنی گەرما و تۆزی ناوچەکە ئەندازیاری دەکرێت، و تیمەکەمان خۆی دایدەمەزرێنێت.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "description" = 'سێبەری چوارچێوە پۆڵایی بەسەر شوێنی وەستانی ئۆتۆمبێلەکاندا کە ئۆتۆمبێلەکان و ئەو کەسانەی سواریان دەبن لە خۆری نیوەڕۆ دەپارێزێت.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('لە هەرێمی کوردستان و سەرانسەری عێراقدا، پلەی گەرمی هاوینان بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، و ئۆتۆمبێلێک کە لە ژێر تیشکی ڕاستەوخۆی خۆردا وەستێنرابێت، ناوەوەی زۆر لە هەوای دەوروبەری گەرمتر دەبێت. سوکان و کورسییەکان ئەوەندە گەرم دەبن کە دەستیان لێ نادرێت، داشبۆرد درز دەبات و ڕەنگی کاڵ دەبێتەوە، و بۆیە و تایە و ئامێرە ئەلیکترۆنییەکان چەندین ساڵ زووتر لە کاتی خۆیان تێکدەچن. سێبەرەکانی پارکینگی ئێمە ئۆتۆمبێلەکان بە درێژایی ڕۆژ لە تیشکی ڕاستەوخۆی خۆر دەپارێزن، ئۆتۆمبێلەکە دەپارێزن و سواربوونی ئاسوودە دەکەن — جا لە ماڵەوە بێت یان ئۆفیس یان هۆتێل یان پارکینگێکی گەورە. هەموو بنیاتێک بەپێی پێوانە دروست دەکرێت، بۆ بەرگەگرتنی گەرما و تۆزی ناوچەکە ئەندازیاری دەکرێت، و تیمەکەمان خۆی دایدەمەزرێنێت.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "metaDescription" = left('سێبەری چوارچێوە پۆڵایی بەسەر شوێنی وەستانی ئۆتۆمبێلەکاندا کە ئۆتۆمبێلەکان و ئەو کەسانەی سواریان دەبن لە خۆری نیوەڕۆ دەپارێزێت.', 155);

UPDATE "ProductTranslation" SET "description" = 'Tall masts and steel cables hold a continuous fabric canopy over the whole row, so the bays underneath stay open. Doors swing freely, cars turn in easily, and every vehicle stays in the shade through the hottest hours of the day. Ideal for long frontages, streets and commercial car parks.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cable-stayed-parking-shade') AND "locale" = 'en' AND "description" = 'Tall masts and cables suspend a continuous fabric canopy over the row, keeping the bays open so doors swing and cars turn freely.';

UPDATE "ProductTranslation" SET "description" = 'تحمل أعمدةٌ عالية وكابلاتٌ فولاذية مظلةً قماشية متصلة فوق الصف بأكمله، فتبقى المواقف أسفلها مفتوحة بالكامل. تُفتح الأبواب بحرية، وتدخل السيارات بسهولة، وتبقى كل مركبة في الظل طوال ساعات النهار الأشدّ حرارة. مثالية للواجهات الطويلة والشوارع ومواقف السيارات التجارية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cable-stayed-parking-shade') AND "locale" = 'ar' AND "description" = 'أعمدةٌ عالية وكابلات تحمل غطاءً قماشيًا متصلًا فوق صف المواقف، فتبقى المواقف مفتوحة لتُفتح الأبواب وتدور السيارات بحرية.';

UPDATE "ProductTranslation" SET "description" = 'کۆڵەکەی بەرز و کێبڵی پۆڵایی سێبەرێکی قوماشی بەردەوام بەسەر تەواوی ڕیزەکەدا هەڵدەگرن، بۆیە شوێنەکانی وەستان لە ژێرەوە بە تەواوی کراوە دەمێننەوە. دەرگاکان بە ئازادی دەکرێنەوە، ئۆتۆمبێلەکان بە ئاسانی دەچنە ژێرەوە، و هەموو ئۆتۆمبێلێک لە گەرمترین کاتژمێرەکانی ڕۆژدا لە سێبەردا دەمێنێتەوە. گونجاوە بۆ ڕووکاری درێژ و شەقام و پارکینگە بازرگانییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cable-stayed-parking-shade') AND "locale" = 'ckb' AND "description" = 'کۆڵەکەی بەرز و کێبڵەکان داپۆشینێکی قوماشی بەردەوام بەسەر ڕیزی شوێنی وەستاندا هەڵدەواسن، بۆ ئەوەی شوێنەکان کراوە بمێننەوە و دەرگاکان بە ئازادی بکرێنەوە و ئۆتۆمبێلەکان بسووڕێنەوە.';

UPDATE "ProductTranslation" SET "description" = 'Repeating pyramid canopies on a shared steel frame — the most popular way to shade a large car park row by row. The peaked shape lets hot air rise and escape and sheds rain quickly, keeping cars cooler underneath in summer and drier in winter. Suits offices, hospitals, universities and shopping centres.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'pyramid-parking-shade') AND "locale" = 'en' AND "description" = 'Repeating pyramid canopies on a shared frame — the classic way to shade a large car park row by row, with rain running off every peak.';

UPDATE "ProductTranslation" SET "description" = 'مظلاتٌ هرمية متتالية على هيكلٍ فولاذي مشترك — وهي الطريقة الأكثر شيوعًا لتظليل مواقف السيارات الكبيرة صفًّا بعد صف. يسمح شكلها المدبّب بصعود الهواء الساخن وخروجه، ويصرّف مياه الأمطار بسرعة، فتبقى السيارات أسفلها أبرد صيفًا وأكثر جفافًا شتاءً. تناسب المكاتب والمستشفيات والجامعات والمراكز التجارية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'pyramid-parking-shade') AND "locale" = 'ar' AND "description" = 'مظلات هرمية متكرّرة على هيكلٍ مشترك — الطريقة الكلاسيكية لتظليل مواقف السيارات الكبيرة صفًّا بعد صف، ينساب المطر عن كل قمة.';

UPDATE "ProductTranslation" SET "description" = 'سێبەری هەرەمی بەدوای یەکدا لەسەر چوارچێوەیەکی پۆڵایی هاوبەش — باوترین ڕێگا بۆ سێبەرکردنی پارکینگە گەورەکان ڕیز بە ڕیز. شێوە لووتکەییەکەی ڕێگە دەدات هەوای گەرم بەرز ببێتەوە و دەربچێت، و ئاوی باران بە خێرایی دەڕژێنێتە خوارەوە، بۆیە ئۆتۆمبێلەکانی ژێرەوەی لە هاویندا فێنکتر و لە زستاندا وشکتر دەمێننەوە. گونجاوە بۆ ئۆفیس و نەخۆشخانە و زانکۆ و سەنتەرە بازرگانییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'pyramid-parking-shade') AND "locale" = 'ckb' AND "description" = 'سێبەری هەرەمی دووبارەبووەوە لەسەر چوارچێوەیەکی هاوبەش — ڕێگای کلاسیکی بۆ سێبەرکردنی پارکینگی گەورە ڕیز بە ڕیز، باران لە هەموو لووتکەیەکەوە دەڕژێتە خوارەوە.';

UPDATE "ProductTranslation" SET "description" = 'Single posts stand at the back of the bays and the canopy reaches forward, leaving the front completely open for easy parking. A clean, modern look that suits villas, building entrances and smaller car parks where every car still needs protection from the summer sun.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cantilever-parking-shade') AND "locale" = 'en' AND "description" = 'Single posts stand at the rear of the bays and the canopy reaches forward, leaving the front open for an easy way in — at home beside a building''s entrance.';

UPDATE "ProductTranslation" SET "description" = 'تقف أعمدةٌ مفردة في مؤخرة المواقف وتمتد المظلة إلى الأمام، فتبقى الواجهة مفتوحة تمامًا لركنٍ سهل. تصميمٌ عصري أنيق يناسب الفلل ومداخل المباني ومواقف السيارات الصغيرة، حيث تحتاج كل سيارة مع ذلك إلى الحماية من شمس الصيف.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cantilever-parking-shade') AND "locale" = 'ar' AND "description" = 'أعمدة مفردة تقف في مؤخرة المواقف ويمتد الغطاء إلى الأمام، فتبقى الواجهة مفتوحة لدخولٍ سهل — مثالية بجوار مدخل المبنى.';

UPDATE "ProductTranslation" SET "description" = 'کۆڵەکەی تاک لە دواوەی شوێنەکانی وەستان ڕادەوەستن و سێبەرەکە بەرەو پێشەوە درێژ دەبێتەوە، بەمەش بەشی پێشەوە بە تەواوی کراوە دەمێنێتەوە بۆ وەستانێکی ئاسان. شێوەیەکی مۆدێرن و ڕێکوپێک کە لەگەڵ ڤێلا و دەروازەی باڵەخانە و پارکینگە بچووکەکاندا دەگونجێت، کە هەموو ئۆتۆمبێلێکیان هێشتا پێویستی بە پاراستن لە خۆری هاوین هەیە.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'cantilever-parking-shade') AND "locale" = 'ckb' AND "description" = 'کۆڵەکەی تاک لە دواوەی شوێنی وەستانەکان ڕادەوەستن و داپۆشینەکە بەرەو پێشەوە درێژ دەبێتەوە، بەشی پێشەوە بۆ چوونەژوورەوەی ئاسان کراوە دەهێڵێتەوە — گونجاو لە تەنیشت دەروازەی باڵەخانە.';

UPDATE "ProductTranslation" SET "description" = 'A steel frame with a solid metal roof gives full cover from the strong summer sun and from winter rain and dust. A durable, low-maintenance choice for homes, offices, hospitals and government buildings that want a permanent, clean-lined structure.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-roof-carport') AND "locale" = 'en' AND "description" = 'A steel frame under a metal panel roof, for sites that want fully solid cover against sun and rain, in clean lines that suit offices and hospitals.';

UPDATE "ProductTranslation" SET "description" = 'هيكلٌ فولاذي بسقفٍ معدني صلب يوفّر حمايةً كاملة من شمس الصيف القوية ومن أمطار الشتاء والغبار. خيارٌ متين وقليل الصيانة للمنازل والمكاتب والمستشفيات والمباني الحكومية التي تبحث عن منشأةٍ دائمة بخطوطٍ نظيفة.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-roof-carport') AND "locale" = 'ar' AND "description" = 'هيكل فولاذي تحت سقفٍ من الألواح المعدنية، للمواقع التي تريد غطاءً صلبًا بالكامل من الشمس والمطر، بخطوطٍ نظيفة تناسب المكاتب والمستشفيات.';

UPDATE "ProductTranslation" SET "description" = 'چوارچێوەیەکی پۆڵایی لەگەڵ سەقفێکی کانزایی پتەو پاراستنێکی تەواو دابین دەکات لە خۆری بەهێزی هاوین و لە بارانی زستان و تۆز. هەڵبژاردنێکی بەرگەگر و کەم چاککردنەوەیە بۆ ماڵ و ئۆفیس و نەخۆشخانە و باڵەخانە حکومییەکان کە بنیاتێکی هەمیشەیی و ڕێکوپێکیان دەوێت.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-roof-carport') AND "locale" = 'ckb' AND "description" = 'چوارچێوەیەکی پۆڵایی لە ژێر سەقفێکی پانێڵی کانزاییدا، بۆ ئەو شوێنانەی داپۆشینێکی تەواو پتەویان دەوێت دژی خۆر و باران، بە هێڵی پاک کە لەگەڵ ئۆفیس و نەخۆشخانەکان دەگونجێت.';

UPDATE "ProductTranslation" SET "description" = 'Curved canopies reach out to both sides of a single central line of posts, covering two rows of bays at once. Fewer posts means more space to manoeuvre, and the arched shape gives a striking, modern look to large car parks at hotels, malls and public buildings.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'double-arch-parking-shade') AND "locale" = 'en' AND "description" = 'Curved canopies reach out to both sides of a central line of posts, covering two rows of bays at once with a single structure.';

UPDATE "ProductTranslation" SET "description" = 'تمتد مظلاتٌ مقوّسة إلى جانبَي خطٍّ مركزي واحد من الأعمدة، فتغطي صفّين من المواقف في آنٍ واحد. أعمدةٌ أقل تعني مساحةً أكبر للمناورة، ويمنح الشكل المقوّس مواقف السيارات الكبيرة في الفنادق والمولات والمباني العامة مظهرًا عصريًا لافتًا.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'double-arch-parking-shade') AND "locale" = 'ar' AND "description" = 'أغطية مقوّسة تمتد إلى جانبَي خطٍّ مركزي من الأعمدة، فتغطي صفّين من المواقف في آنٍ واحد ببنيةٍ واحدة.';

UPDATE "ProductTranslation" SET "description" = 'سێبەری کەوانەیی بۆ هەردوو لای یەک هێڵی ناوەندی کۆڵەکە درێژ دەبنەوە و دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشن. کۆڵەکەی کەمتر واتە بۆشایی زیاتر بۆ جووڵەی ئۆتۆمبێل، و شێوە کەوانەییەکەی ڕووکارێکی مۆدێرن و سەرنجڕاکێش دەبەخشێتە پارکینگە گەورەکانی هۆتێل و مۆڵ و باڵەخانە گشتییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'double-arch-parking-shade') AND "locale" = 'ckb' AND "description" = 'داپۆشینی کەوانەیی بۆ هەردوو لای هێڵێکی ناوەندی کۆڵەکە درێژ دەبنەوە، و بە یەک بنیات دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشن.';
