-- New copy for the shade-structure categories and their products. Each category
-- now says why its shade matters where summers pass 40–45°C, and each product
-- says where it suits, in English, Arabic and Kurdish. The umbrella categories
-- are unchanged. prisma/seed.ts carries the same text so a fresh database
-- matches.
--
-- Update-only, and each field only where it still holds the original wording:
-- anything already rewritten in the dashboard is left as it is.

UPDATE "CategoryTranslation" SET "tagline" = 'Cover for every car, through the hottest summers'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "tagline" = 'Cover for every bay';

UPDATE "CategoryTranslation" SET "description" = 'Across Kurdistan and Iraq, summer temperatures regularly pass 40–45°C, and a car parked in full sun becomes far hotter inside than the air around it. Steering wheels and seats become too hot to touch, dashboards crack and fade, and paint, tyres and electronics wear out years early. Our car parking shades keep vehicles out of the direct sun all day, protecting the car and making it comfortable to get into — whether at home, at the office, at a hotel or across a large car park. Every structure is built to measure and engineered for local heat and dust.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "description" = 'Steel-framed shade over parking bays that keeps cars, and the people getting into them, out of the midday sun.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('Across Kurdistan and Iraq, summer temperatures regularly pass 40–45°C, and a car parked in full sun becomes far hotter inside than the air around it. Steering wheels and seats become too hot to touch, dashboards crack and fade, and paint, tyres and electronics wear out years early. Our car parking shades keep vehicles out of the direct sun all day, protecting the car and making it comfortable to get into — whether at home, at the office, at a hotel or across a large car park. Every structure is built to measure and engineered for local heat and dust.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'en' AND "metaDescription" = left('Steel-framed shade over parking bays that keeps cars, and the people getting into them, out of the midday sun.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'حمايةٌ لكل سيارة في أشدّ أيام الصيف حرارة'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "tagline" = 'غطاءٌ لكل موقف';

UPDATE "CategoryTranslation" SET "description" = 'تتجاوز درجات الحرارة صيفًا في إقليم كوردستان والعراق ٤٠–٤٥ درجة مئوية بانتظام، وحين تُركن السيارة تحت أشعة الشمس المباشرة تصبح حرارتها من الداخل أعلى بكثير من حرارة الهواء المحيط بها؛ فيغدو المقود والمقاعد ساخنةً لا تُلمس، وتتشقّق لوحة القيادة ويبهت لونها، ويتلف الطلاء والإطارات والأجهزة الإلكترونية قبل أوانها بسنوات. تُبقي مظلات مواقف السيارات لدينا المركبات بعيدةً عن أشعة الشمس المباشرة طوال اليوم، فتحمي السيارة وتجعل ركوبها مريحًا — سواء في المنزل أو المكتب أو الفندق أو في مواقف السيارات الكبيرة. تُصمَّم كل منشأة حسب المقاس، وتُهندَس لتتحمّل حرارة المنطقة وغبارها.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "description" = 'مظلات بإطاراتٍ فولاذية فوق مواقف السيارات تحمي السيارات ومن يركبها من شمس الظهيرة.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('تتجاوز درجات الحرارة صيفًا في إقليم كوردستان والعراق ٤٠–٤٥ درجة مئوية بانتظام، وحين تُركن السيارة تحت أشعة الشمس المباشرة تصبح حرارتها من الداخل أعلى بكثير من حرارة الهواء المحيط بها؛ فيغدو المقود والمقاعد ساخنةً لا تُلمس، وتتشقّق لوحة القيادة ويبهت لونها، ويتلف الطلاء والإطارات والأجهزة الإلكترونية قبل أوانها بسنوات. تُبقي مظلات مواقف السيارات لدينا المركبات بعيدةً عن أشعة الشمس المباشرة طوال اليوم، فتحمي السيارة وتجعل ركوبها مريحًا — سواء في المنزل أو المكتب أو الفندق أو في مواقف السيارات الكبيرة. تُصمَّم كل منشأة حسب المقاس، وتُهندَس لتتحمّل حرارة المنطقة وغبارها.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ar' AND "metaDescription" = left('مظلات بإطاراتٍ فولاذية فوق مواقف السيارات تحمي السيارات ومن يركبها من شمس الظهيرة.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'پاراستن بۆ هەموو ئۆتۆمبێلێک، لە گەرمترین هاوینەکاندا'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "tagline" = 'داپۆشین بۆ هەموو شوێنێکی وەستان';

UPDATE "CategoryTranslation" SET "description" = 'لە هەرێمی کوردستان و سەرانسەری عێراقدا، پلەی گەرمی هاوینان بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، و ئۆتۆمبێلێک کە لە ژێر تیشکی ڕاستەوخۆی خۆردا وەستێنرابێت، ناوەوەی زۆر لە هەوای دەوروبەری گەرمتر دەبێت. سوکان و کورسییەکان ئەوەندە گەرم دەبن کە دەستیان لێ نادرێت، داشبۆرد درز دەبات و ڕەنگی کاڵ دەبێتەوە، و بۆیە و تایە و ئامێرە ئەلیکترۆنییەکان چەندین ساڵ زووتر لە کاتی خۆیان تێکدەچن. سێبەرەکانی پارکینگی ئێمە ئۆتۆمبێلەکان بە درێژایی ڕۆژ لە تیشکی ڕاستەوخۆی خۆر دەپارێزن، ئۆتۆمبێلەکە دەپارێزن و سواربوونی ئاسوودە دەکەن — جا لە ماڵەوە بێت یان ئۆفیس یان هۆتێل یان پارکینگێکی گەورە. هەموو بنیاتێک بەپێی پێوانە دروست دەکرێت و بۆ بەرگەگرتنی گەرما و تۆزی ناوچەکە ئەندازیاری دەکرێت.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "description" = 'سێبەری چوارچێوە پۆڵایی بەسەر شوێنی وەستانی ئۆتۆمبێلەکاندا کە ئۆتۆمبێلەکان و ئەو کەسانەی سواریان دەبن لە خۆری نیوەڕۆ دەپارێزێت.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('لە هەرێمی کوردستان و سەرانسەری عێراقدا، پلەی گەرمی هاوینان بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، و ئۆتۆمبێلێک کە لە ژێر تیشکی ڕاستەوخۆی خۆردا وەستێنرابێت، ناوەوەی زۆر لە هەوای دەوروبەری گەرمتر دەبێت. سوکان و کورسییەکان ئەوەندە گەرم دەبن کە دەستیان لێ نادرێت، داشبۆرد درز دەبات و ڕەنگی کاڵ دەبێتەوە، و بۆیە و تایە و ئامێرە ئەلیکترۆنییەکان چەندین ساڵ زووتر لە کاتی خۆیان تێکدەچن. سێبەرەکانی پارکینگی ئێمە ئۆتۆمبێلەکان بە درێژایی ڕۆژ لە تیشکی ڕاستەوخۆی خۆر دەپارێزن، ئۆتۆمبێلەکە دەپارێزن و سواربوونی ئاسوودە دەکەن — جا لە ماڵەوە بێت یان ئۆفیس یان هۆتێل یان پارکینگێکی گەورە. هەموو بنیاتێک بەپێی پێوانە دروست دەکرێت و بۆ بەرگەگرتنی گەرما و تۆزی ناوچەکە ئەندازیاری دەکرێت.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'car-parking-shades') AND "locale" = 'ckb' AND "metaDescription" = left('سێبەری چوارچێوە پۆڵایی بەسەر شوێنی وەستانی ئۆتۆمبێلەکاندا کە ئۆتۆمبێلەکان و ئەو کەسانەی سواریان دەبن لە خۆری نیوەڕۆ دەپارێزێت.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'Architectural shade for the hottest public spaces'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'en' AND "tagline" = 'Fabric held in tension';

UPDATE "CategoryTranslation" SET "description" = 'In a climate where summer temperatures pass 40–45°C, outdoor spaces only work if they are properly shaded. Tensile structures stretch a strong, lightweight membrane between steel masts, arches and cables to cover large areas without columns in the way — courtyards, stages, plazas, stadiums and entrances. The membrane blocks the direct sun while staying bright underneath, and its sculptural forms become landmarks in their own right. Every structure is designed for its site and engineered for local heat, wind and dust.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'en' AND "description" = 'Membrane canopies tensioned between masts and cables to cover large spans with a light, sculptural roof.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('In a climate where summer temperatures pass 40–45°C, outdoor spaces only work if they are properly shaded. Tensile structures stretch a strong, lightweight membrane between steel masts, arches and cables to cover large areas without columns in the way — courtyards, stages, plazas, stadiums and entrances. The membrane blocks the direct sun while staying bright underneath, and its sculptural forms become landmarks in their own right. Every structure is designed for its site and engineered for local heat, wind and dust.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'en' AND "metaDescription" = left('Membrane canopies tensioned between masts and cables to cover large spans with a light, sculptural roof.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'تظليلٌ معماري لأكثر الأماكن العامة حرارة'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ar' AND "tagline" = 'قماشٌ مشدود بإحكام';

UPDATE "CategoryTranslation" SET "description" = 'في مناخٍ تتجاوز فيه درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، لا تصلح المساحات الخارجية للاستخدام إلا إذا كانت مظلّلة كما ينبغي. تشدّ منشآت الشد الإنشائي غشاءً متينًا وخفيف الوزن بين أعمدةٍ وأقواسٍ وكابلات فولاذية، لتغطي مساحاتٍ واسعة دون أعمدة تعترض المكان — من الأفنية والمسارح إلى الساحات والملاعب والمداخل. يحجب الغشاء أشعة الشمس المباشرة مع بقاء المكان أسفله مضيئًا، وتتحوّل أشكاله النحتية إلى معالم بحدّ ذاتها. تُصمَّم كل منشأة وفق موقعها، وتُهندَس لتتحمّل حرارة المنطقة ورياحها وغبارها.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ar' AND "description" = 'أغشية مشدودة بين الأعمدة والكابلات لتغطية مساحاتٍ واسعة بسقفٍ خفيفٍ ذي طابعٍ نحتي.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('في مناخٍ تتجاوز فيه درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، لا تصلح المساحات الخارجية للاستخدام إلا إذا كانت مظلّلة كما ينبغي. تشدّ منشآت الشد الإنشائي غشاءً متينًا وخفيف الوزن بين أعمدةٍ وأقواسٍ وكابلات فولاذية، لتغطي مساحاتٍ واسعة دون أعمدة تعترض المكان — من الأفنية والمسارح إلى الساحات والملاعب والمداخل. يحجب الغشاء أشعة الشمس المباشرة مع بقاء المكان أسفله مضيئًا، وتتحوّل أشكاله النحتية إلى معالم بحدّ ذاتها. تُصمَّم كل منشأة وفق موقعها، وتُهندَس لتتحمّل حرارة المنطقة ورياحها وغبارها.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ar' AND "metaDescription" = left('أغشية مشدودة بين الأعمدة والكابلات لتغطية مساحاتٍ واسعة بسقفٍ خفيفٍ ذي طابعٍ نحتي.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'سێبەری تەلارسازی بۆ گەرمترین شوێنە گشتییەکان'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ckb' AND "tagline" = 'قوماش بە ڕاکێشان ڕاگیراو';

UPDATE "CategoryTranslation" SET "description" = 'لە کەشوهەوایەکدا کە پلەی گەرمی هاوینان لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، شوێنە کراوەکان تەنها کاتێک بەکاردێن کە بە باشی سێبەر کرابن. بنیاتی کێشراو پەردەیەکی بەهێز و سووک لە نێوان کۆڵەکە و کەوانە و کێبڵی پۆڵاییدا ڕادەکێشێت، بۆ داپۆشینی ڕووبەری فراوان بەبێ ئەوەی کۆڵەکە ڕێگر بێت — لە حەوشە و شانۆوە تا گۆڕەپان و یاریگا و دەروازەکان. پەردەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ژێرەوەی هەر ڕووناک دەمێنێتەوە، و شێوە پەیکەرئاساکانی خۆیان دەبنە نیشانەیەکی دیار. هەموو بنیاتێک بەپێی شوێنەکەی دیزاین دەکرێت و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە ئەندازیاری دەکرێت.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ckb' AND "description" = 'پەردەی قوماش کە لە نێوان کۆڵەکە و کێبڵەکاندا ڕادەکێشرێن بۆ داپۆشینی ماوەی گەورە بە سەقفێکی سووک و پەیکەرئاسا.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('لە کەشوهەوایەکدا کە پلەی گەرمی هاوینان لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، شوێنە کراوەکان تەنها کاتێک بەکاردێن کە بە باشی سێبەر کرابن. بنیاتی کێشراو پەردەیەکی بەهێز و سووک لە نێوان کۆڵەکە و کەوانە و کێبڵی پۆڵاییدا ڕادەکێشێت، بۆ داپۆشینی ڕووبەری فراوان بەبێ ئەوەی کۆڵەکە ڕێگر بێت — لە حەوشە و شانۆوە تا گۆڕەپان و یاریگا و دەروازەکان. پەردەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ژێرەوەی هەر ڕووناک دەمێنێتەوە، و شێوە پەیکەرئاساکانی خۆیان دەبنە نیشانەیەکی دیار. هەموو بنیاتێک بەپێی شوێنەکەی دیزاین دەکرێت و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە ئەندازیاری دەکرێت.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'tensile-structures') AND "locale" = 'ckb' AND "metaDescription" = left('پەردەی قوماش کە لە نێوان کۆڵەکە و کێبڵەکاندا ڕادەکێشرێن بۆ داپۆشینی ماوەی گەورە بە سەقفێکی سووک و پەیکەرئاسا.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'Walk in the shade, even at midday'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'en' AND "tagline" = 'Shade from door to door';

UPDATE "CategoryTranslation" SET "description" = 'When summer temperatures pass 40–45°C, even a short walk across an open path or car park becomes exhausting. Walkway shades keep people covered from the car to the door, between buildings and along campus paths — protecting them from the midday sun in summer and from rain in winter. We build fabric, louvred and solid-roof walkways to measure for schools, hospitals, hotels, residential communities and factories, engineered for local conditions.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'en' AND "description" = 'Continuous cover along paths, entrances and connecting walkways, so moving between buildings never means stepping into full sun.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('When summer temperatures pass 40–45°C, even a short walk across an open path or car park becomes exhausting. Walkway shades keep people covered from the car to the door, between buildings and along campus paths — protecting them from the midday sun in summer and from rain in winter. We build fabric, louvred and solid-roof walkways to measure for schools, hospitals, hotels, residential communities and factories, engineered for local conditions.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'en' AND "metaDescription" = left('Continuous cover along paths, entrances and connecting walkways, so moving between buildings never means stepping into full sun.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'امشِ في الظل حتى في عزّ الظهيرة'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ar' AND "tagline" = 'ظلٌّ من بابٍ إلى باب';

UPDATE "CategoryTranslation" SET "description" = 'حين تتجاوز درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، يصبح حتى المشي القصير عبر ممرٍّ مكشوف أو موقف سيارات أمرًا مرهقًا. تُبقي مظلات الممرات الناس محميّين من السيارة حتى الباب، وبين المباني وعلى طول ممرات الحرم — فتقيهم شمس الظهيرة صيفًا والمطر شتاءً. ننفّذ ممراتٍ بالقماش أو بالشرائح أو بالأسقف الصلبة حسب المقاس للمدارس والمستشفيات والفنادق والمجمّعات السكنية والمصانع، مُهندَسة لظروف المنطقة.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ar' AND "description" = 'غطاءٌ متصل على امتداد الممرات والمداخل وطرق الربط، فلا يعني التنقّل بين المباني الخروج إلى الشمس المباشرة.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('حين تتجاوز درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، يصبح حتى المشي القصير عبر ممرٍّ مكشوف أو موقف سيارات أمرًا مرهقًا. تُبقي مظلات الممرات الناس محميّين من السيارة حتى الباب، وبين المباني وعلى طول ممرات الحرم — فتقيهم شمس الظهيرة صيفًا والمطر شتاءً. ننفّذ ممراتٍ بالقماش أو بالشرائح أو بالأسقف الصلبة حسب المقاس للمدارس والمستشفيات والفنادق والمجمّعات السكنية والمصانع، مُهندَسة لظروف المنطقة.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ar' AND "metaDescription" = left('غطاءٌ متصل على امتداد الممرات والمداخل وطرق الربط، فلا يعني التنقّل بين المباني الخروج إلى الشمس المباشرة.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'لە ژێر سێبەردا بڕۆ، تەنانەت لە نیوەڕۆشدا'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ckb' AND "tagline" = 'سێبەر لە دەرگاوە بۆ دەرگا';

UPDATE "CategoryTranslation" SET "description" = 'کاتێک پلەی گەرمی هاوین لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، تەنانەت ڕۆیشتنێکی کورتیش بە ڕێگایەکی کراوە یان پارکینگێکدا ماندووکەر دەبێت. سێبەری ڕێڕەو خەڵک لە ئۆتۆمبێلەوە تا دەرگا، لە نێوان باڵەخانەکاندا و بە درێژایی ڕێگاکانی کەمپەس داپۆشراو دەهێڵێتەوە — لە هاویندا لە خۆری نیوەڕۆ و لە زستاندا لە باران دەیانپارێزێت. ڕێڕەوی قوماشی و لووڤەری و سەقف پتەو بەپێی پێوانە دروست دەکەین بۆ قوتابخانە و نەخۆشخانە و هۆتێل و کۆمەڵگە نیشتەجێبوونەکان و کارگەکان، کە بۆ بارودۆخی ناوچەکە ئەندازیاری کراون.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ckb' AND "description" = 'داپۆشینی بەردەوام بە درێژایی ڕێگا و دەروازە و ڕێڕەوە پەیوەندکەرەکان، بۆ ئەوەی جووڵە لە نێوان باڵەخانەکاندا هەرگیز بە مانای چوونە ناو خۆری ڕاستەوخۆ نەبێت.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('کاتێک پلەی گەرمی هاوین لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، تەنانەت ڕۆیشتنێکی کورتیش بە ڕێگایەکی کراوە یان پارکینگێکدا ماندووکەر دەبێت. سێبەری ڕێڕەو خەڵک لە ئۆتۆمبێلەوە تا دەرگا، لە نێوان باڵەخانەکاندا و بە درێژایی ڕێگاکانی کەمپەس داپۆشراو دەهێڵێتەوە — لە هاویندا لە خۆری نیوەڕۆ و لە زستاندا لە باران دەیانپارێزێت. ڕێڕەوی قوماشی و لووڤەری و سەقف پتەو بەپێی پێوانە دروست دەکەین بۆ قوتابخانە و نەخۆشخانە و هۆتێل و کۆمەڵگە نیشتەجێبوونەکان و کارگەکان، کە بۆ بارودۆخی ناوچەکە ئەندازیاری کراون.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'walkway-shades') AND "locale" = 'ckb' AND "metaDescription" = left('داپۆشینی بەردەوام بە درێژایی ڕێگا و دەروازە و ڕێڕەوە پەیوەندکەرەکان، بۆ ئەوەی جووڵە لە نێوان باڵەخانەکاندا هەرگیز بە مانای چوونە ناو خۆری ڕاستەوخۆ نەبێت.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'Outdoor living, even in the summer heat'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'en' AND "tagline" = 'Architecture for outdoor rooms';

UPDATE "CategoryTranslation" SET "description" = 'Pergolas and louvred roofs turn terraces, gardens and rooftops into outdoor rooms you can use through the long Kurdish and Iraqi summer. Louvred roofs filter the strong sun while letting air move through, keeping terraces comfortable even on 45°C days. Designed and built to measure for villas, restaurants, cafés and hotels.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'en' AND "description" = 'Fixed frames with open or adjustable louvred roofs that turn a terrace into a room you can use in sun or shade.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('Pergolas and louvred roofs turn terraces, gardens and rooftops into outdoor rooms you can use through the long Kurdish and Iraqi summer. Louvred roofs filter the strong sun while letting air move through, keeping terraces comfortable even on 45°C days. Designed and built to measure for villas, restaurants, cafés and hotels.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'en' AND "metaDescription" = left('Fixed frames with open or adjustable louvred roofs that turn a terrace into a room you can use in sun or shade.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'حياةٌ في الهواء الطلق حتى في حرّ الصيف'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ar' AND "tagline" = 'عمارةٌ للغرف الخارجية';

UPDATE "CategoryTranslation" SET "description" = 'تحوّل البرغولات والأسقف ذات الشرائح التراسات والحدائق والأسطح إلى غرفٍ خارجية تستمتع بها طوال صيف كوردستان والعراق الطويل. تُرشّح الأسقف ذات الشرائح أشعة الشمس القوية وتسمح بمرور الهواء، فتبقى التراسات مريحة حتى في أيامٍ تبلغ فيها الحرارة ٤٥ درجة. تُصمَّم وتُنفَّذ حسب المقاس للفلل والمطاعم والمقاهي والفنادق.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ar' AND "description" = 'هياكل ثابتة بأسقفٍ مفتوحة أو بشرائح قابلة للتعديل تحوّل التراس إلى غرفةٍ تُستعمل في الشمس والظل.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('تحوّل البرغولات والأسقف ذات الشرائح التراسات والحدائق والأسطح إلى غرفٍ خارجية تستمتع بها طوال صيف كوردستان والعراق الطويل. تُرشّح الأسقف ذات الشرائح أشعة الشمس القوية وتسمح بمرور الهواء، فتبقى التراسات مريحة حتى في أيامٍ تبلغ فيها الحرارة ٤٥ درجة. تُصمَّم وتُنفَّذ حسب المقاس للفلل والمطاعم والمقاهي والفنادق.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ar' AND "metaDescription" = left('هياكل ثابتة بأسقفٍ مفتوحة أو بشرائح قابلة للتعديل تحوّل التراس إلى غرفةٍ تُستعمل في الشمس والظل.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'ژیان لە دەرەوە، تەنانەت لە گەرمای هاویندا'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ckb' AND "tagline" = 'تەلارسازی بۆ ژووری دەرەوە';

UPDATE "CategoryTranslation" SET "description" = 'پێرگۆلا و سەقفی لووڤەری تەراس و باخچە و سەربانەکان دەگۆڕن بۆ ژووری دەرەوە کە بە درێژایی هاوینی درێژی کوردستان و عێراق بەکاریان بهێنیت. سەقفی لووڤەری خۆری بەهێز دەپاڵێوێت و ڕێگە بە تێپەڕبوونی هەوا دەدات، بۆیە تەراسەکان تەنانەت لە ڕۆژانی ٤٥ پلەشدا ئاسوودە دەمێننەوە. بەپێی پێوانە دیزاین و دروست دەکرێن بۆ ڤێلا و چێشتخانە و کافێ و هۆتێل.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ckb' AND "description" = 'چوارچێوەی جێگیر بە سەقفی کراوە یان لووڤەری گۆڕاو کە تەراسێک دەکاتە ژوورێک کە لە خۆر و سێبەردا بەکاربهێنرێت.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('پێرگۆلا و سەقفی لووڤەری تەراس و باخچە و سەربانەکان دەگۆڕن بۆ ژووری دەرەوە کە بە درێژایی هاوینی درێژی کوردستان و عێراق بەکاریان بهێنیت. سەقفی لووڤەری خۆری بەهێز دەپاڵێوێت و ڕێگە بە تێپەڕبوونی هەوا دەدات، بۆیە تەراسەکان تەنانەت لە ڕۆژانی ٤٥ پلەشدا ئاسوودە دەمێننەوە. بەپێی پێوانە دیزاین و دروست دەکرێن بۆ ڤێلا و چێشتخانە و کافێ و هۆتێل.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'pergolas-louvres') AND "locale" = 'ckb' AND "metaDescription" = left('چوارچێوەی جێگیر بە سەقفی کراوە یان لووڤەری گۆڕاو کە تەراسێک دەکاتە ژوورێک کە لە خۆر و سێبەردا بەکاربهێنرێت.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'Large-scale shade for public and commercial projects'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'en' AND "tagline" = 'Engineered for public spaces';

UPDATE "CategoryTranslation" SET "description" = 'Schools, hospitals, shopping centres, government buildings and public spaces across Kurdistan and Iraq need reliable shade through summers that regularly pass 40–45°C. We design, engineer and build permanent shade structures for large commercial and public projects — from playgrounds and waiting areas to plazas and loading zones — built to measure and made for local heat, wind and dust.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'en' AND "description" = 'Permanent shade structures for schools, hospitality, retail and public projects, specified to the site and its loads.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('Schools, hospitals, shopping centres, government buildings and public spaces across Kurdistan and Iraq need reliable shade through summers that regularly pass 40–45°C. We design, engineer and build permanent shade structures for large commercial and public projects — from playgrounds and waiting areas to plazas and loading zones — built to measure and made for local heat, wind and dust.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'en' AND "metaDescription" = left('Permanent shade structures for schools, hospitality, retail and public projects, specified to the site and its loads.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'تظليلٌ واسع النطاق للمشاريع العامة والتجارية'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ar' AND "tagline" = 'مُهندَسة للمساحات العامة';

UPDATE "CategoryTranslation" SET "description" = 'تحتاج المدارس والمستشفيات والمراكز التجارية والمباني الحكومية والأماكن العامة في كوردستان والعراق إلى تظليلٍ موثوق خلال صيفٍ تتجاوز حرارته ٤٠–٤٥ درجة مئوية بانتظام. نصمّم ونهندس وننفّذ منشآت تظليل دائمة للمشاريع التجارية والعامة الكبيرة — من ساحات اللعب ومناطق الانتظار إلى الساحات العامة ومناطق التحميل — حسب المقاس، ومصمّمة لتتحمّل حرارة المنطقة ورياحها وغبارها.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ar' AND "description" = 'منشآت تظليل دائمة للمدارس والضيافة والتجزئة والمشاريع العامة، تُحدَّد وفق الموقع وأحماله.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('تحتاج المدارس والمستشفيات والمراكز التجارية والمباني الحكومية والأماكن العامة في كوردستان والعراق إلى تظليلٍ موثوق خلال صيفٍ تتجاوز حرارته ٤٠–٤٥ درجة مئوية بانتظام. نصمّم ونهندس وننفّذ منشآت تظليل دائمة للمشاريع التجارية والعامة الكبيرة — من ساحات اللعب ومناطق الانتظار إلى الساحات العامة ومناطق التحميل — حسب المقاس، ومصمّمة لتتحمّل حرارة المنطقة ورياحها وغبارها.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ar' AND "metaDescription" = left('منشآت تظليل دائمة للمدارس والضيافة والتجزئة والمشاريع العامة، تُحدَّد وفق الموقع وأحماله.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'سێبەری گەورە بۆ پڕۆژە گشتی و بازرگانییەکان'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ckb' AND "tagline" = 'بۆ شوێنە گشتییەکان ئەندازیاری کراوە';

UPDATE "CategoryTranslation" SET "description" = 'قوتابخانە و نەخۆشخانە و سەنتەرە بازرگانییەکان و باڵەخانە حکومییەکان و شوێنە گشتییەکان لە سەرانسەری کوردستان و عێراقدا پێویستیان بە سێبەرێکی متمانەپێکراوە لە هاوینانێکدا کە پلەی گەرمی بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت. ئێمە بنیاتی سێبەری هەمیشەیی بۆ پڕۆژە بازرگانی و گشتییە گەورەکان دیزاین و ئەندازیاری و دروست دەکەین — لە یاریگای منداڵان و شوێنی چاوەڕوانییەوە تا گۆڕەپان و شوێنی بارکردن — بەپێی پێوانە و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ckb' AND "description" = 'بنیاتی سێبەری هەمیشەیی بۆ قوتابخانە و میوانداری و فرۆشگا و پڕۆژە گشتییەکان، بەپێی شوێنەکە و بارەکانی دیاری دەکرێن.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('قوتابخانە و نەخۆشخانە و سەنتەرە بازرگانییەکان و باڵەخانە حکومییەکان و شوێنە گشتییەکان لە سەرانسەری کوردستان و عێراقدا پێویستیان بە سێبەرێکی متمانەپێکراوە لە هاوینانێکدا کە پلەی گەرمی بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت. ئێمە بنیاتی سێبەری هەمیشەیی بۆ پڕۆژە بازرگانی و گشتییە گەورەکان دیزاین و ئەندازیاری و دروست دەکەین — لە یاریگای منداڵان و شوێنی چاوەڕوانییەوە تا گۆڕەپان و شوێنی بارکردن — بەپێی پێوانە و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'commercial-shade-structures') AND "locale" = 'ckb' AND "metaDescription" = left('بنیاتی سێبەری هەمیشەیی بۆ قوتابخانە و میوانداری و فرۆشگا و پڕۆژە گشتییەکان، بەپێی شوێنەکە و بارەکانی دیاری دەکرێن.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'Simple, elegant shade for any space'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'en' AND "tagline" = 'Shade drawn in clean lines';

UPDATE "CategoryTranslation" SET "description" = 'Shade sails are tensioned fabric sails fixed between posts and walls — a light, flexible and attractive way to shade courtyards, playgrounds, gardens, pools and terraces. The fabric blocks the direct sun while letting air move freely, keeping spaces comfortable in the summer heat. Available in many shapes and sizes, and made to measure.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'en' AND "description" = 'Tensioned fabric sails fixed between posts and walls — a light, flexible way to shade courtyards, play areas and terraces.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('Shade sails are tensioned fabric sails fixed between posts and walls — a light, flexible and attractive way to shade courtyards, playgrounds, gardens, pools and terraces. The fabric blocks the direct sun while letting air move freely, keeping spaces comfortable in the summer heat. Available in many shapes and sizes, and made to measure.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'en' AND "metaDescription" = left('Tensioned fabric sails fixed between posts and walls — a light, flexible way to shade courtyards, play areas and terraces.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'تظليلٌ بسيط وأنيق لأي مساحة'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ar' AND "tagline" = 'ظلٌّ مرسومٌ بخطوطٍ نقية';

UPDATE "CategoryTranslation" SET "description" = 'أشرعة التظليل أشرعةٌ قماشية مشدودة تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة وجذّابة لتظليل الأفنية وساحات اللعب والحدائق والمسابح والتراسات. يحجب القماش أشعة الشمس المباشرة ويسمح بحركة الهواء بحرية، فتبقى المساحات مريحة في حرّ الصيف. متوفّرة بأشكالٍ ومقاساتٍ متعدّدة، وتُنفَّذ حسب المقاس.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ar' AND "description" = 'أشرعة من القماش المشدود تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة لتظليل الأفنية ومناطق اللعب والتراسات.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('أشرعة التظليل أشرعةٌ قماشية مشدودة تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة وجذّابة لتظليل الأفنية وساحات اللعب والحدائق والمسابح والتراسات. يحجب القماش أشعة الشمس المباشرة ويسمح بحركة الهواء بحرية، فتبقى المساحات مريحة في حرّ الصيف. متوفّرة بأشكالٍ ومقاساتٍ متعدّدة، وتُنفَّذ حسب المقاس.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ar' AND "metaDescription" = left('أشرعة من القماش المشدود تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة لتظليل الأفنية ومناطق اللعب والتراسات.', 155);

UPDATE "CategoryTranslation" SET "tagline" = 'سێبەرێکی سادە و جوان بۆ هەر شوێنێک'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ckb' AND "tagline" = 'سێبەر بە هێڵی ڕوون کێشراو';

UPDATE "CategoryTranslation" SET "description" = 'چارۆکەی سێبەر چارۆکەی قوماشی ڕاکێشراون کە لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم و سەرنجڕاکێش بۆ سێبەرکردنی حەوشە و یاریگای منداڵان و باخچە و مەلەوانگە و تەراس. قوماشەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ڕێگە دەدات هەوا بە ئازادی بجووڵێت، بۆیە شوێنەکان لە گەرمای هاویندا ئاسوودە دەمێننەوە. بە چەندین شێوە و قەبارەی جیاواز بەردەستە و بەپێی پێوانە دروست دەکرێت.'
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ckb' AND "description" = 'چارۆکەی قوماشی ڕاکێشراو لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم بۆ سێبەرکردنی حەوشە و شوێنی یاری و تەراس.';

UPDATE "CategoryTranslation" SET "metaDescription" = left('چارۆکەی سێبەر چارۆکەی قوماشی ڕاکێشراون کە لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم و سەرنجڕاکێش بۆ سێبەرکردنی حەوشە و یاریگای منداڵان و باخچە و مەلەوانگە و تەراس. قوماشەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ڕێگە دەدات هەوا بە ئازادی بجووڵێت، بۆیە شوێنەکان لە گەرمای هاویندا ئاسوودە دەمێننەوە. بە چەندین شێوە و قەبارەی جیاواز بەردەستە و بەپێی پێوانە دروست دەکرێت.', 155)
WHERE "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'shade-sails') AND "locale" = 'ckb' AND "metaDescription" = left('چارۆکەی قوماشی ڕاکێشراو لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم بۆ سێبەرکردنی حەوشە و شوێنی یاری و تەراس.', 155);

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

UPDATE "ProductTranslation" SET "description" = 'Curved steel arches carry a tensioned membrane in one sweeping span, covering a stage, seating area or courtyard without a single column in the middle. Guests stay in the shade through long summer afternoons, and the open span keeps every view clear. Ideal for amphitheatres, event spaces, schools and heritage sites.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'arched-membrane-canopy') AND "locale" = 'en' AND "description" = 'Curved steel arches carry a tensioned membrane in one sweeping span, sheltering a stage, seating or a courtyard without columns in the middle.';

UPDATE "ProductTranslation" SET "description" = 'تحمل أقواسٌ فولاذية منحنية غشاءً مشدودًا في امتدادٍ واحد منساب، يغطي مسرحًا أو منطقة جلوس أو فناءً دون عمودٍ واحد في الوسط. يبقى الضيوف في الظل طوال ساعات العصر الطويلة في الصيف، ويُبقي الامتداد المفتوح كل الإطلالات واضحة. مثالية للمدرّجات المفتوحة وأماكن الفعاليات والمدارس والمواقع التراثية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'arched-membrane-canopy') AND "locale" = 'ar' AND "description" = 'أقواس فولاذية منحنية تحمل غشاءً مشدودًا في امتدادٍ واحد منساب، تظلّل مسرحًا أو مقاعد أو فناءً دون أعمدة في الوسط.';

UPDATE "ProductTranslation" SET "description" = 'کەوانەی پۆڵایی چەماوە پەردەیەکی ڕاکێشراو لە یەک ماوەی ڕەواندا هەڵدەگرن، شانۆیەک یان شوێنی دانیشتن یان حەوشەیەک دادەپۆشن بەبێ تاکە کۆڵەکەیەک لە ناوەڕاستدا. میوانەکان لە ئێوارە درێژەکانی هاویندا لە سێبەردا دەمێننەوە، و ماوە کراوەکە هەموو دیمەنێک ڕوون دەهێڵێتەوە. گونجاوە بۆ ئەمفیتیاتر و شوێنی بۆنەکان و قوتابخانە و شوێنە مێژووییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'arched-membrane-canopy') AND "locale" = 'ckb' AND "description" = 'کەوانەی پۆڵایی چەماوە پەردەیەکی ڕاکێشراو لە یەک ماوەی ڕەواندا هەڵدەگرن، سێبەر بۆ شانۆ یان شوێنی دانیشتن یان حەوشە دەکەن بەبێ کۆڵەکە لە ناوەڕاستدا.';

UPDATE "ProductTranslation" SET "description" = 'Two cone-shaped membranes rise from central masts to shade cafés, courtyards and outdoor seating. The high peaks let warm air rise away from guests, and the low anchor points keep the space open on every side. A favourite for restaurants, hotels and heritage courtyards that stay busy all summer.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'twin-peak-canopy') AND "locale" = 'en' AND "description" = 'Two cone-shaped membranes rise from central masts to shade cafés, courtyards and outdoor seating, with low anchor points that keep the space open.';

UPDATE "ProductTranslation" SET "description" = 'يرتفع غشاءان مخروطيان من أعمدةٍ مركزية لتظليل المقاهي والأفنية وجلسات الهواء الطلق. تسمح القمم العالية بصعود الهواء الدافئ بعيدًا عن الضيوف، وتُبقي نقاط التثبيت المنخفضة المكان مفتوحًا من كل الجهات. خيارٌ مفضّل للمطاعم والفنادق والأفنية التراثية التي تبقى مزدحمة طوال الصيف.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'twin-peak-canopy') AND "locale" = 'ar' AND "description" = 'غشاءان مخروطيان يرتفعان من أعمدة مركزية لتظليل المقاهي والأفنية وجلسات الهواء الطلق، مع نقاط تثبيت منخفضة تُبقي المكان مفتوحًا.';

UPDATE "ProductTranslation" SET "description" = 'دوو پەردەی قووچەکی لە کۆڵەکەی ناوەندییەوە بەرز دەبنەوە بۆ سێبەرکردنی کافێ و حەوشە و شوێنی دانیشتنی دەرەوە. لووتکە بەرزەکان ڕێگە دەدەن هەوای گەرم بەرز ببێتەوە و لە میوانەکان دوور بکەوێتەوە، و خاڵە نزمەکانی بەستنەوە شوێنەکە لە هەموو لایەکەوە کراوە دەهێڵنەوە. هەڵبژاردەیەکی دڵخوازە بۆ چێشتخانە و هۆتێل و حەوشە مێژووییەکان کە بە درێژایی هاوین قەرەباڵغن.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'twin-peak-canopy') AND "locale" = 'ckb' AND "description" = 'دوو پەردەی قووچەکی لە کۆڵەکەی ناوەندییەوە بەرز دەبنەوە بۆ سێبەرکردنی کافێ و حەوشە و شوێنی دانیشتنی دەرەوە، بە خاڵی بەستنەوەی نزم کە شوێنەکە کراوە دەهێڵنەوە.';

UPDATE "ProductTranslation" SET "description" = 'A single sculptural membrane stretched between tall masts and cables, rising and falling across an entrance, plaza or drop-off area. It gives arriving guests shade from the summer sun and gives the building a memorable landmark. Suits hotels, resorts, cultural centres and government buildings.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-mast-membrane') AND "locale" = 'en' AND "description" = 'A single membrane stretched between tall masts and cables into a sculptural, high-and-low form — a landmark over an entrance, plaza or drop-off.';

UPDATE "ProductTranslation" SET "description" = 'غشاءٌ نحتي واحد مشدود بين أعمدةٍ عالية وكابلات، يعلو ويهبط فوق مدخلٍ أو ساحةٍ أو منطقة إنزال. يمنح الضيوف عند وصولهم ظلًّا من شمس الصيف، ويمنح المبنى معلمًا لا يُنسى. يناسب الفنادق والمنتجعات والمراكز الثقافية والمباني الحكومية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-mast-membrane') AND "locale" = 'ar' AND "description" = 'غشاءٌ واحد مشدود بين أعمدة عالية وكابلات بشكلٍ نحتي يعلو ويهبط — معلمٌ فوق مدخل أو ساحة أو منطقة إنزال.';

UPDATE "ProductTranslation" SET "description" = 'یەک پەردەی پەیکەرئاسا لە نێوان کۆڵەکەی بەرز و کێبڵەکاندا ڕاکێشراوە، بەسەر دەروازەیەک یان گۆڕەپانێک یان شوێنی دابەزاندندا بەرز و نزم دەبێتەوە. سێبەر لە خۆری هاوین دەبەخشێتە میوانانی تازەگەیشتوو، و نیشانەیەکی لەبیرنەکراو دەبەخشێتە باڵەخانەکە. گونجاوە بۆ هۆتێل و ڕیزۆرت و سەنتەرە ڕۆشنبیرییەکان و باڵەخانە حکومییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-mast-membrane') AND "locale" = 'ckb' AND "description" = 'یەک پەردە لە نێوان کۆڵەکەی بەرز و کێبڵەکاندا ڕادەکێشرێت بۆ شێوەیەکی پەیکەرئاسای بەرز و نزم — نیشانەیەک بەسەر دەروازە یان گۆڕەپان یان شوێنی دابەزاندندا.';

UPDATE "ProductTranslation" SET "description" = 'Steel trusses carry a tensioned membrane over spectator stands, keeping the summer sun off every row while leaving a clear view of the pitch. Spectators can watch afternoon matches and events in comfort. Built for stadiums, school and university sports grounds, and club facilities.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'grandstand-roof') AND "locale" = 'en' AND "description" = 'Steel trusses carry a tensioned membrane over spectator stands, keeping the sun off every row while leaving the view of the field clear.';

UPDATE "ProductTranslation" SET "description" = 'تحمل جمالوناتٌ فولاذية غشاءً مشدودًا فوق مدرّجات المتفرجين، فتحجب شمس الصيف عن كل الصفوف وتُبقي رؤية الملعب واضحة. يتابع المتفرجون مباريات العصر والفعاليات براحة. مصمّم للملاعب والمنشآت الرياضية في المدارس والجامعات والأندية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'grandstand-roof') AND "locale" = 'ar' AND "description" = 'جمالونات فولاذية تحمل غشاءً مشدودًا فوق مدرّجات المتفرجين، فتحجب الشمس عن كل صف وتُبقي رؤية الملعب واضحة.';

UPDATE "ProductTranslation" SET "description" = 'خەرپای پۆڵایی پەردەیەکی ڕاکێشراو بەسەر سەکۆی تەماشاکەراندا هەڵدەگرن، خۆری هاوین لە هەموو ڕیزەکان دوور دەخەنەوە و دیمەنی یاریگاکە ڕوون دەهێڵنەوە. تەماشاکەران دەتوانن یارییەکانی ئێوارە و بۆنەکان بە ئاسوودەیی ببینن. بۆ یاریگا و مەیدانە وەرزشییەکانی قوتابخانە و زانکۆ و یانەکان دروست کراوە.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'grandstand-roof') AND "locale" = 'ckb' AND "description" = 'خەرپای پۆڵایی پەردەیەکی ڕاکێشراو بەسەر سەکۆی تەماشاکەراندا هەڵدەگرن، خۆر لە هەموو ڕیزێک دەگرێتەوە و دیمەنی یاریگاکە ڕوون دەهێڵێتەوە.';

UPDATE "ProductTranslation" SET "description" = 'A row of linked conical peaks on slender masts covers amphitheatres, event spaces and public gathering places. Visible from far away, it turns a hot, open square into a shaded place people want to stay. Suits parks, cultural venues, resorts and municipal projects.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-peak-canopy') AND "locale" = 'en' AND "description" = 'Linked conical peaks on slender masts cover amphitheatres, event spaces and public gathering places — a landmark you can see from far away.';

UPDATE "ProductTranslation" SET "description" = 'صفٌّ من القمم المخروطية المتصلة على أعمدةٍ رشيقة يغطي المدرّجات المفتوحة وأماكن الفعاليات والتجمّعات العامة. يُرى من بعيد، ويحوّل الساحة المفتوحة الحارّة إلى مكانٍ مظلّل يرغب الناس في البقاء فيه. يناسب الحدائق والأماكن الثقافية والمنتجعات ومشاريع البلديات.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-peak-canopy') AND "locale" = 'ar' AND "description" = 'قممٌ مخروطية متصلة على أعمدة رشيقة تغطي المدرّجات المفتوحة وأماكن الفعاليات والتجمّعات العامة — معلمٌ يُرى من بعيد.';

UPDATE "ProductTranslation" SET "description" = 'ڕیزێک لووتکەی قووچەکی بەیەکەوە بەستراو لەسەر کۆڵەکەی باریک، ئەمفیتیاتر و شوێنی بۆنەکان و شوێنی کۆبوونەوەی گشتی دادەپۆشێت. لە دوورەوە دەبینرێت، و گۆڕەپانێکی کراوەی گەرم دەگۆڕێت بۆ شوێنێکی سێبەردار کە خەڵک حەز دەکەن تێیدا بمێننەوە. گونجاوە بۆ پارک و شوێنە ڕۆشنبیرییەکان و ڕیزۆرت و پڕۆژەکانی شارەوانی.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'multi-peak-canopy') AND "locale" = 'ckb' AND "description" = 'لووتکەی قووچەکی بەیەکەوە بەستراو لەسەر کۆڵەکەی باریک ئەمفیتیاتر و شوێنی بۆنەکان و شوێنی کۆبوونەوەی گشتی دادەپۆشن — نیشانەیەک کە لە دوورەوە دەبینرێت.';

UPDATE "ProductTranslation" SET "description" = 'Freestanding funnel-shaped shades on a single column, each finished with a steel ring at the rim. Set in groups across parks, plazas and public squares, they create pools of shade where people can stop and rest away from the summer heat.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'inverted-cone-canopy') AND "locale" = 'en' AND "description" = 'Freestanding funnels on a single column, each with a steel ring at the rim — set in groups across parks, plazas and public squares.';

UPDATE "ProductTranslation" SET "description" = 'مظلاتٌ قائمة بذاتها على شكل قِمع فوق عمودٍ واحد، تنتهي كلٌّ منها بحلقةٍ فولاذية عند الحافة. توزَّع في مجموعات عبر الحدائق والساحات والميادين العامة، فتصنع بقعًا من الظل يتوقّف فيها الناس ويستريحون بعيدًا عن حرّ الصيف.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'inverted-cone-canopy') AND "locale" = 'ar' AND "description" = 'مظلات قائمة بذاتها على شكل قِمع فوق عمودٍ واحد، لكلٍّ منها حلقة فولاذية عند الحافة — تُوزَّع في مجموعات عبر الحدائق والساحات العامة.';

UPDATE "ProductTranslation" SET "description" = 'سێبەری سەربەخۆ بە شێوەی قیف لەسەر یەک کۆڵەکە، کە هەریەکەیان بە ئەڵقەیەکی پۆڵایی لە لێوارەکەیدا تەواو دەبێت. بە کۆمەڵ لە پارک و گۆڕەپان و مەیدانە گشتییەکاندا دادەنرێن، و پەڵەی سێبەر دروست دەکەن کە خەڵک تێیدا ڕادەوەستن و لە گەرمای هاوین پشوو دەدەن.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'inverted-cone-canopy') AND "locale" = 'ckb' AND "description" = 'سێبەری سەربەخۆ بە شێوەی قیف لەسەر یەک کۆڵەکە، هەریەکە بە ئەڵقەیەکی پۆڵایی لە لێوارەکەیدا — بە کۆمەڵ لە پارک و گۆڕەپان و مەیدانە گشتییەکاندا دادەنرێن.';

UPDATE "ProductTranslation" SET "description" = 'A continuous canopy that follows the paths through a residential community or campus, branching wherever the routes do, so residents, students and staff stay in the shade from door to door. Ideal for long routes where walking in the open summer sun is not an option.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'continuous-walkway-canopy') AND "locale" = 'en' AND "description" = 'A continuous canopy that follows the paths through a residential community or campus, branching where the routes do, so people stay in the shade from door to door.';

UPDATE "ProductTranslation" SET "description" = 'مظلةٌ متصلة تتبع الممرات عبر المجمّع السكني أو الحرم الجامعي، وتتفرّع حيثما تتفرّع الطرق، ليبقى السكان والطلاب والموظفون في الظل من بابٍ إلى باب. مثالية للمسارات الطويلة حيث لا يمكن المشي تحت شمس الصيف المكشوفة.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'continuous-walkway-canopy') AND "locale" = 'ar' AND "description" = 'مظلة متصلة تتبع الممرات عبر المجمّعات السكنية والحرم الجامعية، وتتفرّع حيث تتفرّع الطرق ليبقى الناس في الظل من بابٍ إلى باب.';

UPDATE "ProductTranslation" SET "description" = 'سێبەرێکی بەردەوام کە بەدوای ڕێگاکانی ناو کۆمەڵگەیەکی نیشتەجێبوون یان کەمپەسێکدا دەڕوات و لە هەر شوێنێک ڕێگاکان لق ببنەوە ئەویش لق دەبێتەوە، بۆ ئەوەی دانیشتووان و قوتابیان و کارمەندان لە دەرگاوە بۆ دەرگا لە سێبەردا بمێننەوە. گونجاوە بۆ ڕێگا درێژەکان کە ڕۆیشتن لە ژێر خۆری کراوەی هاویندا ئەستەمە.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'continuous-walkway-canopy') AND "locale" = 'ckb' AND "description" = 'سێبەرێکی بەردەوام کە بەدوای ڕێگاکانی ناو کۆمەڵگەیەکی نیشتەجێبوون یان کەمپەسێکدا دەڕوات، و لەو شوێنانەی ڕێگاکان لق دەبنەوە ئەویش لق دەبێتەوە، بۆ ئەوەی خەڵک لە دەرگاوە بۆ دەرگا لە سێبەردا بمێننەوە.';

UPDATE "ProductTranslation" SET "description" = 'A louvred roof with a warm timber-look finish on slender posts, casting soft striped shade along park and garden paths. It brings the look of natural wood to the garden. Suits villas, parks, gardens and residential compounds.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'timber-look-louvre-walkway') AND "locale" = 'en' AND "description" = 'A louvred roof with a warm timber-look finish on slender posts, casting striped shade along park and garden paths.';

UPDATE "ProductTranslation" SET "description" = 'سقفٌ بشرائح بمظهرٍ خشبي دافئ على أعمدةٍ رشيقة، يلقي ظلًّا مخطّطًا ناعمًا على ممرات الحدائق والمتنزّهات، ويضفي على الحديقة مظهر الخشب الطبيعي. يناسب الفلل والمتنزّهات والحدائق والمجمّعات السكنية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'timber-look-louvre-walkway') AND "locale" = 'ar' AND "description" = 'سقفٌ بشرائح بمظهرٍ خشبي دافئ على أعمدة رشيقة، يلقي ظلًّا مخطّطًا على ممرات الحدائق والمتنزّهات.';

UPDATE "ProductTranslation" SET "description" = 'سەقفێکی لووڤەری بە ڕووکارێکی گەرمی دار لەسەر کۆڵەکەی باریک، سێبەرێکی نەرمی هێڵدار دەخاتە سەر ڕێگاکانی پارک و باخچە، و ڕووخساری داری سروشتی دەبەخشێتە باخچەکە. گونجاوە بۆ ڤێلا و پارک و باخچە و کۆمەڵگە نیشتەجێبوونەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'timber-look-louvre-walkway') AND "locale" = 'ckb' AND "description" = 'سەقفێکی لووڤەری بە ڕووکارێکی گەرمی دار لەسەر کۆڵەکەی باریک، سێبەرێکی هێڵدار دەخاتە سەر ڕێگاکانی پارک و باخچە.';

UPDATE "ProductTranslation" SET "description" = 'Hard-wearing steel posts and a corrugated metal roof give practical cover between car parks and the entrances of warehouses, factories and logistics sites. Workers stay out of the summer sun and winter rain at every shift change. A durable, low-maintenance solution for industrial sites.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'industrial-covered-walkway') AND "locale" = 'en' AND "description" = 'Steel posts and a corrugated metal roof give hard-wearing cover between car parks and the doors of warehouses, factories and logistics sites.';

UPDATE "ProductTranslation" SET "description" = 'أعمدةٌ فولاذية متينة وسقفٌ من الألواح المعدنية المموّجة توفّر غطاءً عمليًا بين مواقف السيارات ومداخل المستودعات والمصانع والمواقع اللوجستية. يبقى العمّال بعيدين عن شمس الصيف ومطر الشتاء عند كل تبديلٍ للورديات. حلٌّ متين وقليل الصيانة للمواقع الصناعية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'industrial-covered-walkway') AND "locale" = 'ar' AND "description" = 'أعمدة فولاذية وسقف من الألواح المعدنية المموّجة توفّر غطاءً متينًا بين المواقف وأبواب المستودعات والمصانع والمواقع اللوجستية.';

UPDATE "ProductTranslation" SET "description" = 'کۆڵەکەی پۆڵایی بەرگەگر و سەقفێکی پەڕەی کانزایی شەپۆلی، داپۆشینێکی کرداری لە نێوان پارکینگ و دەروازەی کۆگا و کارگە و شوێنە لۆجستییەکاندا دابین دەکەن. کرێکاران لە هەموو گۆڕینێکی شەفتدا لە خۆری هاوین و بارانی زستان دوور دەمێننەوە. چارەسەرێکی بەرگەگر و کەم چاککردنەوەیە بۆ شوێنە پیشەسازییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'industrial-covered-walkway') AND "locale" = 'ckb' AND "description" = 'کۆڵەکەی پۆڵایی و سەقفێکی پەڕەی کانزایی شەپۆلی داپۆشینێکی بەرگەگر لە نێوان پارکینگ و دەرگای کۆگا و کارگە و شوێنە لۆجستییەکاندا دابین دەکەن.';

UPDATE "ProductTranslation" SET "description" = 'A white louvred roof on slim columns lets soft light filter through while keeping the strong sun off — a calm, elegant passage connecting the buildings of hotels, resorts and private residences. Its light colour reflects much of the sun''s heat.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'white-louvre-walkway') AND "locale" = 'en' AND "description" = 'A white louvred roof on slim columns lets light filter through while keeping the sun off — a calm connecting passage for hotels, resorts and residences.';

UPDATE "ProductTranslation" SET "description" = 'سقفٌ أبيض بشرائح على أعمدةٍ نحيلة يسمح بتسلّل ضوءٍ ناعم ويحجب الشمس القوية — ممرٌّ هادئ وأنيق يربط مباني الفنادق والمنتجعات والمساكن الخاصة. ويعكس لونه الفاتح جزءًا كبيرًا من حرارة الشمس.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'white-louvre-walkway') AND "locale" = 'ar' AND "description" = 'سقفٌ أبيض بشرائح على أعمدة نحيلة يسمح بمرور الضوء ويحجب الشمس — ممرٌّ هادئ يربط بين أجزاء الفنادق والمنتجعات والمساكن.';

UPDATE "ProductTranslation" SET "description" = 'سەقفێکی لووڤەری سپی لەسەر کۆڵەکەی باریک ڕێگە دەدات ڕووناکییەکی نەرم تێبپەڕێت و خۆری بەهێز ڕادەگرێت — ڕێڕەوێکی ئارام و جوان کە باڵەخانەکانی هۆتێل و ڕیزۆرت و نیشتەجێگا تایبەتەکان بە یەکەوە دەبەستێتەوە. ڕەنگە کاڵەکەی بەشێکی زۆری گەرمای خۆر دەداتەوە.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'white-louvre-walkway') AND "locale" = 'ckb' AND "description" = 'سەقفێکی لووڤەری سپی لەسەر کۆڵەکەی باریک ڕێگە بە تێپەڕبوونی ڕووناکی دەدات و خۆر ڕادەگرێت — ڕێڕەوێکی ئارام بۆ پەیوەندکردنی بەشەکانی هۆتێل و ڕیزۆرت و نیشتەجێگا.';

UPDATE "ProductTranslation" SET "description" = 'Overlapping fabric sails stretched between tall posts shade a long path in a light, open rhythm. Air moves freely between the sails, keeping the path comfortable on hot days. An attractive, open way to cover routes across campuses, parks and public grounds.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'sail-walkway-shade') AND "locale" = 'en' AND "description" = 'Overlapping fabric sails stretched between tall posts shade a long path in a light, open rhythm — at home on campuses and in public grounds.';

UPDATE "ProductTranslation" SET "description" = 'أشرعةٌ قماشية متداخلة مشدودة بين أعمدةٍ عالية تظلّل ممرًّا طويلًا بإيقاعٍ خفيف ومفتوح. يتحرّك الهواء بحرية بين الأشرعة، فيبقى الممر مريحًا في الأيام الحارّة. طريقةٌ جذّابة ومفتوحة لتغطية المسارات في الحرم الجامعية والمتنزّهات والمساحات العامة.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'sail-walkway-shade') AND "locale" = 'ar' AND "description" = 'أشرعة قماشية متداخلة مشدودة بين أعمدة عالية تظلّل ممرًّا طويلًا بإيقاعٍ خفيف ومفتوح — مثالية للحرم الجامعية والمساحات العامة.';

UPDATE "ProductTranslation" SET "description" = 'چارۆکەی قوماشی یەکتربڕ کە لە نێوان کۆڵەکەی بەرزدا ڕاکێشراون، ڕێگایەکی درێژ بە ڕیتمێکی سووک و کراوە سێبەر دەکەن. هەوا بە ئازادی لە نێوان چارۆکەکاندا دەجووڵێت، بۆیە ڕێگاکە لە ڕۆژە گەرمەکاندا ئاسوودە دەمێنێتەوە. ڕێگایەکی سەرنجڕاکێش و کراوەیە بۆ داپۆشینی ڕێگاکانی کەمپەس و پارک و شوێنە گشتییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'sail-walkway-shade') AND "locale" = 'ckb' AND "description" = 'چارۆکەی قوماشی یەکتربڕ کە لە نێوان کۆڵەکەی بەرزدا ڕاکێشراون ڕێگایەکی درێژ بە ڕیتمێکی سووک و کراوە سێبەر دەکەن — گونجاو بۆ کەمپەس و شوێنە گشتییەکان.';

UPDATE "ProductTranslation" SET "description" = 'A steel frame with a solid panel roof and built-in rainwater downpipes links buildings across a campus, keeping off the summer sun and winter rain alike. Clean, durable and low-maintenance — ideal for schools, hospitals, universities and government buildings.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-frame-covered-walkway') AND "locale" = 'en' AND "description" = 'A steel frame with a solid panel roof and built-in rainwater downpipes links buildings across a campus, keeping off sun and rain alike.';

UPDATE "ProductTranslation" SET "description" = 'هيكلٌ فولاذي بسقفٍ من الألواح الصلبة ومواسير مدمجة لتصريف مياه الأمطار، يربط المباني عبر الحرم ويحمي من شمس الصيف ومطر الشتاء على حدٍّ سواء. نظيفٌ ومتين وقليل الصيانة — مثالي للمدارس والمستشفيات والجامعات والمباني الحكومية.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-frame-covered-walkway') AND "locale" = 'ar' AND "description" = 'هيكل فولاذي بسقفٍ من الألواح الصلبة ومواسير تصريف مدمجة لمياه الأمطار، يربط المباني عبر الحرم ويحمي من الشمس والمطر معًا.';

UPDATE "ProductTranslation" SET "description" = 'چوارچێوەیەکی پۆڵایی بە سەقفی پانێڵی پتەو و بۆری تێکەڵکراوی ئاوی باران، باڵەخانەکانی ناو کەمپەسێک بە یەکەوە دەبەستێتەوە و بە هەمان شێوە لە خۆری هاوین و بارانی زستان دەپارێزێت. پاک و بەرگەگر و کەم چاککردنەوە — گونجاوە بۆ قوتابخانە و نەخۆشخانە و زانکۆ و باڵەخانە حکومییەکان.'
WHERE "productId" = (SELECT "id" FROM "Product" WHERE "slug" = 'steel-frame-covered-walkway') AND "locale" = 'ckb' AND "description" = 'چوارچێوەیەکی پۆڵایی بە سەقفی پانێڵی پتەو و بۆری ئاوی بارانی تێکەڵکراو، باڵەخانەکانی ناو کەمپەسێک بە یەکەوە دەبەستێتەوە و لە خۆر و باران دەپارێزێت.';
