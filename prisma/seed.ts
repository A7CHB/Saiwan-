/**
 * Seed — demonstration content.
 *
 * IMPORTANT: every product, price, dimension and specification below is
 * *sample* data written to exercise the interface, not real Saiwan product
 * information. Names, sizes and specs should be replaced from the admin panel
 * (Products → Edit) with the real catalogue before launch. The imagery points at
 * the generated brand plates in /public/media for the same reason.
 *
 * Run: npm run db:seed   (or `npm run db:reset` to start from an empty file)
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

type Tri = { en: string; ar: string; ckb: string };
const LOCALES = ["en", "ar", "ckb"] as const;

const tri = (en: string, ar: string, ckb: string): Tri => ({ en, ar, ckb });

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    slug: "cantilever",
    image: "/media/scene-villa.svg",
    name: tri("Cantilever Umbrellas", "المظلات الكابولية", "چەتری کانتیلیڤەر"),
    tagline: tri(
      "Shade without a pole in the way",
      "ظلٌّ دون عمودٍ يعترض الطريق",
      "سێبەر بەبێ کۆڵەکەیەک لە ڕێگادا",
    ),
    description: tri(
      "Side-mounted masts leave the space beneath entirely clear — the right answer wherever a dining table, a lounge set or a walkway needs the floor to itself.",
      "أعمدة جانبية تترك المساحة تحتها خالية تمامًا — الجواب الصحيح حيثما احتاجت طاولة طعام أو جلسة أو ممر إلى أرضٍ خالية.",
      "کۆڵەکەی لاتەنیشت بۆشایی ژێرەوە بە تەواوی بەتاڵ دەهێڵێتەوە — وەڵامی دروست لە هەر شوێنێک کە مێزی نان یان شوێنی دانیشتن یان ڕێڕەو زەوییەکەی بۆ خۆی دەوێت.",
    ),
  },
  {
    slug: "center-pole",
    image: "/media/scene-garden.svg",
    name: tri("Centre Pole Umbrellas", "مظلات العمود المركزي", "چەتری کۆڵەکەی ناوەڕاست"),
    tagline: tri("The classic, held to a higher standard", "الكلاسيكية بمعيارٍ أعلى", "کلاسیکەکە، بە پێوەرێکی بەرزتر"),
    description: tri(
      "The oldest and most efficient way to hold a canopy. Mast, hub and ribs are sized as one structure so the piece stays taut in wind that folds lesser umbrellas.",
      "أقدم الطرق وأكفأها لحمل مظلّة. يُحدَّد العمود والمحور والأضلاع كبنيةٍ واحدة لتبقى القطعة مشدودة في رياحٍ تطوي ما هو أقل منها.",
      "کۆنترین و کاراترین ڕێگا بۆ هەڵگرتنی چەترێک. کۆڵەکە و ناوەند و پەراسووەکان وەک یەک بنیات پێوانە دەکرێن بۆ ئەوەی لەو بایەدا ڕاکێشراو بمێنێتەوە کە چەتری لاوازتر دەشکێنێت.",
    ),
  },
  {
    slug: "commercial",
    image: "/media/scene-restaurant.svg",
    name: tri("Commercial Umbrellas", "المظلات التجارية", "چەتری بازرگانی"),
    tagline: tri("Specified for daily service", "مُحدَّدة للخدمة اليومية", "بۆ خزمەتی ڕۆژانە دیاری کراوە"),
    description: tri(
      "Built for restaurants, hotels and venues where a canopy is opened and closed every day of the season. Heavier sections, serviceable fixings, replaceable canopies.",
      "مبنيّة للمطاعم والفنادق والمنشآت حيث تُفتح المظلّة وتُغلق كل يوم من الموسم. مقاطع أثقل، ومثبّتات قابلة للصيانة، وأقمشة قابلة للاستبدال.",
      "بۆ چێشتخانە و هۆتێل و شوێنەکان دروستکراوە کە چەترەکە هەموو ڕۆژێکی وەرزەکە دەکرێتەوە و دادەخرێت. بەشی قورستر، بەندەری چاککار، و قوماشی گۆڕانکار.",
    ),
  },
  {
    slug: "poolside",
    image: "/media/scene-poolside.svg",
    name: tri("Poolside Umbrellas", "مظلات المسابح", "چەتری کەناری مەلەوانگە"),
    tagline: tri("Finishes that survive chlorine and salt", "تشطيباتٌ تصمد أمام الكلور والملح", "تەواوکاری کە بەرگەی کلۆر و خوێ دەگرێت"),
    description: tri(
      "Every fixing is stainless and every surface is specified for a wet, reflective, chemically aggressive environment. Nothing on a poolside piece is allowed to bloom or pit.",
      "كل مثبّتٍ ستانلس وكل سطحٍ مُحدَّد لبيئةٍ رطبة وعاكسة وكيميائيًا قاسية. لا يُسمح لأي جزءٍ في قطعة المسبح بالتآكل أو التنقّر.",
      "هەموو بەندەرێک ستەینلێسە و هەموو ڕوویەک بۆ ژینگەیەکی شێ و ڕەنگدانەوە و کیمیایی توند دیاری کراوە. هیچ بەشێکی بەرهەمی کەناری مەلەوانگە بۆی نییە بزەوێت یان کون ببێت.",
    ),
  },
  {
    slug: "garden",
    image: "/media/scene-garden.svg",
    name: tri("Garden Umbrellas", "مظلات الحدائق", "چەتری باخچە"),
    tagline: tri("Quieter pieces for private ground", "قطعٌ أهدأ لأرضٍ خاصة", "بەرهەمی هێمنتر بۆ زەوی تایبەت"),
    description: tri(
      "Scaled for domestic terraces and planted gardens, in finishes chosen to recede into greenery rather than compete with it.",
      "بمقاسٍ يناسب التراسات المنزلية والحدائق المزروعة، بتشطيباتٍ اختيرت لتتوارى داخل الخضرة لا لتنافسها.",
      "بە قەبارەی تەراسی ماڵ و باخچەی چاندراو، بە تەواوکارییەک کە هەڵبژێردراوە بۆ ئەوەی لە ناو سەوزاییدا بشاردرێتەوە نەک ڕکابەری بکات.",
    ),
  },
  {
    slug: "large-shade",
    image: "/media/scene-hotel.svg",
    name: tri("Large Shade Systems", "أنظمة التظليل الكبيرة", "سیستەمی سێبەری گەورە"),
    tagline: tri("When one canopy is not enough", "حين لا تكفي مظلّة واحدة", "کاتێک یەک چەتر بەس نییە"),
    description: tri(
      "Modular structures that link into continuous cover across courtyards, terraces and event spaces, engineered as a single span rather than a row of umbrellas.",
      "بنى معيارية تتصل لتشكّل غطاءً متصلًا عبر الأفنية والتراسات ومساحات الفعاليات، مُهندَسة كامتدادٍ واحد لا كصفٍّ من المظلات.",
      "بنیاتی مۆدیوڵار کە پێکەوە دەبەسترێن بۆ داپۆشینێکی بەردەوام بەسەر حەوشە و تەراس و شوێنی بۆنەکاندا، وەک یەک ماوە ئەندازیاری کراوە نەک وەک ڕیزێک چەتر.",
    ),
  },
  {
    slug: "accessories",
    image: "/media/product-base.svg",
    name: tri("Accessories", "الملحقات", "پێداویستییەکان"),
    tagline: tri("Bases, covers and light", "قواعد وأغطية وإضاءة", "بنکە و داپۆشەر و ڕووناکی"),
    description: tri(
      "The parts that make a canopy work in a real space — weighted bases, protective covers and integrated light for the hours after sunset.",
      "الأجزاء التي تجعل المظلّة تعمل في مساحةٍ حقيقية — قواعد موزونة، وأغطية واقية، وإضاءة مدمجة لساعات ما بعد الغروب.",
      "ئەو بەشانەی وا دەکەن چەترێک لە بۆشاییەکی ڕاستەقینەدا کار بکات — بنکەی قورس، داپۆشەری پارێزەر، و ڕووناکی تێکەڵکراو بۆ کاتژمێرەکانی دوای ئاوابوونی خۆر.",
    ),
  },
  // Shade structures. Added to the live catalogue by the
  // 20261020120000_shade_structure_categories migration; kept here so a fresh
  // database matches it. No image yet — none of the plates show these.
  {
    slug: "car-parking-shades",
    image: null,
    name: tri("Car Parking Shades", "مظلات مواقف السيارات", "سێبەری پارکینگی ئۆتۆمبێل"),
    tagline: tri(
      "Cover for every car, through the hottest summers",
      "حمايةٌ لكل سيارة في أشدّ أيام الصيف حرارة",
      "پاراستن بۆ هەموو ئۆتۆمبێلێک، لە گەرمترین هاوینەکاندا",
    ),
    description: tri(
      "Across Kurdistan and Iraq, summer temperatures regularly pass 40–45°C, and a car parked in full sun becomes far hotter inside than the air around it. Steering wheels and seats become too hot to touch, dashboards crack and fade, and paint, tyres and electronics wear out years early. Our car parking shades keep vehicles out of the direct sun all day, protecting the car and making it comfortable to get into — whether at home, at the office, at a hotel or across a large car park. Every structure is built to measure and engineered for local heat and dust.",
      "تتجاوز درجات الحرارة صيفًا في إقليم كوردستان والعراق ٤٠–٤٥ درجة مئوية بانتظام، وحين تُركن السيارة تحت أشعة الشمس المباشرة تصبح حرارتها من الداخل أعلى بكثير من حرارة الهواء المحيط بها؛ فيغدو المقود والمقاعد ساخنةً لا تُلمس، وتتشقّق لوحة القيادة ويبهت لونها، ويتلف الطلاء والإطارات والأجهزة الإلكترونية قبل أوانها بسنوات. تُبقي مظلات مواقف السيارات لدينا المركبات بعيدةً عن أشعة الشمس المباشرة طوال اليوم، فتحمي السيارة وتجعل ركوبها مريحًا — سواء في المنزل أو المكتب أو الفندق أو في مواقف السيارات الكبيرة. تُصمَّم كل منشأة حسب المقاس، وتُهندَس لتتحمّل حرارة المنطقة وغبارها.",
      "لە هەرێمی کوردستان و سەرانسەری عێراقدا، پلەی گەرمی هاوینان بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، و ئۆتۆمبێلێک کە لە ژێر تیشکی ڕاستەوخۆی خۆردا وەستێنرابێت، ناوەوەی زۆر لە هەوای دەوروبەری گەرمتر دەبێت. سوکان و کورسییەکان ئەوەندە گەرم دەبن کە دەستیان لێ نادرێت، داشبۆرد درز دەبات و ڕەنگی کاڵ دەبێتەوە، و بۆیە و تایە و ئامێرە ئەلیکترۆنییەکان چەندین ساڵ زووتر لە کاتی خۆیان تێکدەچن. سێبەرەکانی پارکینگی ئێمە ئۆتۆمبێلەکان بە درێژایی ڕۆژ لە تیشکی ڕاستەوخۆی خۆر دەپارێزن، ئۆتۆمبێلەکە دەپارێزن و سواربوونی ئاسوودە دەکەن — جا لە ماڵەوە بێت یان ئۆفیس یان هۆتێل یان پارکینگێکی گەورە. هەموو بنیاتێک بەپێی پێوانە دروست دەکرێت و بۆ بەرگەگرتنی گەرما و تۆزی ناوچەکە ئەندازیاری دەکرێت.",
    ),
  },
  {
    slug: "tensile-structures",
    image: null,
    name: tri("Tensile Structures", "مظلات الشد الإنشائي", "بنیاتی کێشراو"),
    tagline: tri(
      "Architectural shade for the hottest public spaces",
      "تظليلٌ معماري لأكثر الأماكن العامة حرارة",
      "سێبەری تەلارسازی بۆ گەرمترین شوێنە گشتییەکان",
    ),
    description: tri(
      "In a climate where summer temperatures pass 40–45°C, outdoor spaces only work if they are properly shaded. Tensile structures stretch a strong, lightweight membrane between steel masts, arches and cables to cover large areas without columns in the way — courtyards, stages, plazas, stadiums and entrances. The membrane blocks the direct sun while staying bright underneath, and its sculptural forms become landmarks in their own right. Every structure is designed for its site and engineered for local heat, wind and dust.",
      "في مناخٍ تتجاوز فيه درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، لا تصلح المساحات الخارجية للاستخدام إلا إذا كانت مظلّلة كما ينبغي. تشدّ منشآت الشد الإنشائي غشاءً متينًا وخفيف الوزن بين أعمدةٍ وأقواسٍ وكابلات فولاذية، لتغطي مساحاتٍ واسعة دون أعمدة تعترض المكان — من الأفنية والمسارح إلى الساحات والملاعب والمداخل. يحجب الغشاء أشعة الشمس المباشرة مع بقاء المكان أسفله مضيئًا، وتتحوّل أشكاله النحتية إلى معالم بحدّ ذاتها. تُصمَّم كل منشأة وفق موقعها، وتُهندَس لتتحمّل حرارة المنطقة ورياحها وغبارها.",
      "لە کەشوهەوایەکدا کە پلەی گەرمی هاوینان لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، شوێنە کراوەکان تەنها کاتێک بەکاردێن کە بە باشی سێبەر کرابن. بنیاتی کێشراو پەردەیەکی بەهێز و سووک لە نێوان کۆڵەکە و کەوانە و کێبڵی پۆڵاییدا ڕادەکێشێت، بۆ داپۆشینی ڕووبەری فراوان بەبێ ئەوەی کۆڵەکە ڕێگر بێت — لە حەوشە و شانۆوە تا گۆڕەپان و یاریگا و دەروازەکان. پەردەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ژێرەوەی هەر ڕووناک دەمێنێتەوە، و شێوە پەیکەرئاساکانی خۆیان دەبنە نیشانەیەکی دیار. هەموو بنیاتێک بەپێی شوێنەکەی دیزاین دەکرێت و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە ئەندازیاری دەکرێت.",
    ),
  },
  {
    slug: "walkway-shades",
    image: null,
    name: tri("Walkway Shades", "مظلات الممرات", "سێبەری ڕێڕەو"),
    tagline: tri(
      "Walk in the shade, even at midday",
      "امشِ في الظل حتى في عزّ الظهيرة",
      "لە ژێر سێبەردا بڕۆ، تەنانەت لە نیوەڕۆشدا",
    ),
    description: tri(
      "When summer temperatures pass 40–45°C, even a short walk across an open path or car park becomes exhausting. Walkway shades keep people covered from the car to the door, between buildings and along campus paths — protecting them from the midday sun in summer and from rain in winter. We build fabric, louvred and solid-roof walkways to measure for schools, hospitals, hotels, residential communities and factories, engineered for local conditions.",
      "حين تتجاوز درجات الحرارة صيفًا ٤٠–٤٥ درجة مئوية، يصبح حتى المشي القصير عبر ممرٍّ مكشوف أو موقف سيارات أمرًا مرهقًا. تُبقي مظلات الممرات الناس محميّين من السيارة حتى الباب، وبين المباني وعلى طول ممرات الحرم — فتقيهم شمس الظهيرة صيفًا والمطر شتاءً. ننفّذ ممراتٍ بالقماش أو بالشرائح أو بالأسقف الصلبة حسب المقاس للمدارس والمستشفيات والفنادق والمجمّعات السكنية والمصانع، مُهندَسة لظروف المنطقة.",
      "کاتێک پلەی گەرمی هاوین لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت، تەنانەت ڕۆیشتنێکی کورتیش بە ڕێگایەکی کراوە یان پارکینگێکدا ماندووکەر دەبێت. سێبەری ڕێڕەو خەڵک لە ئۆتۆمبێلەوە تا دەرگا، لە نێوان باڵەخانەکاندا و بە درێژایی ڕێگاکانی کەمپەس داپۆشراو دەهێڵێتەوە — لە هاویندا لە خۆری نیوەڕۆ و لە زستاندا لە باران دەیانپارێزێت. ڕێڕەوی قوماشی و لووڤەری و سەقف پتەو بەپێی پێوانە دروست دەکەین بۆ قوتابخانە و نەخۆشخانە و هۆتێل و کۆمەڵگە نیشتەجێبوونەکان و کارگەکان، کە بۆ بارودۆخی ناوچەکە ئەندازیاری کراون.",
    ),
  },
  {
    slug: "pergolas-louvres",
    image: null,
    name: tri("Pergolas & Louvres", "البرغولات والسقوف الشرائحية", "پێرگۆلا و لووڤەر"),
    tagline: tri(
      "Outdoor living, even in the summer heat",
      "حياةٌ في الهواء الطلق حتى في حرّ الصيف",
      "ژیان لە دەرەوە، تەنانەت لە گەرمای هاویندا",
    ),
    description: tri(
      "Pergolas and louvred roofs turn terraces, gardens and rooftops into outdoor rooms you can use through the long Kurdish and Iraqi summer. Louvred roofs filter the strong sun while letting air move through, keeping terraces comfortable even on 45°C days. Designed and built to measure for villas, restaurants, cafés and hotels.",
      "تحوّل البرغولات والأسقف ذات الشرائح التراسات والحدائق والأسطح إلى غرفٍ خارجية تستمتع بها طوال صيف كوردستان والعراق الطويل. تُرشّح الأسقف ذات الشرائح أشعة الشمس القوية وتسمح بمرور الهواء، فتبقى التراسات مريحة حتى في أيامٍ تبلغ فيها الحرارة ٤٥ درجة. تُصمَّم وتُنفَّذ حسب المقاس للفلل والمطاعم والمقاهي والفنادق.",
      "پێرگۆلا و سەقفی لووڤەری تەراس و باخچە و سەربانەکان دەگۆڕن بۆ ژووری دەرەوە کە بە درێژایی هاوینی درێژی کوردستان و عێراق بەکاریان بهێنیت. سەقفی لووڤەری خۆری بەهێز دەپاڵێوێت و ڕێگە بە تێپەڕبوونی هەوا دەدات، بۆیە تەراسەکان تەنانەت لە ڕۆژانی ٤٥ پلەشدا ئاسوودە دەمێننەوە. بەپێی پێوانە دیزاین و دروست دەکرێن بۆ ڤێلا و چێشتخانە و کافێ و هۆتێل.",
    ),
  },
  {
    slug: "commercial-shade-structures",
    image: null,
    name: tri("Commercial Shade Structures", "منشآت التظليل التجارية", "بنیاتی سێبەری بازرگانی"),
    tagline: tri(
      "Large-scale shade for public and commercial projects",
      "تظليلٌ واسع النطاق للمشاريع العامة والتجارية",
      "سێبەری گەورە بۆ پڕۆژە گشتی و بازرگانییەکان",
    ),
    description: tri(
      "Schools, hospitals, shopping centres, government buildings and public spaces across Kurdistan and Iraq need reliable shade through summers that regularly pass 40–45°C. We design, engineer and build permanent shade structures for large commercial and public projects — from playgrounds and waiting areas to plazas and loading zones — built to measure and made for local heat, wind and dust.",
      "تحتاج المدارس والمستشفيات والمراكز التجارية والمباني الحكومية والأماكن العامة في كوردستان والعراق إلى تظليلٍ موثوق خلال صيفٍ تتجاوز حرارته ٤٠–٤٥ درجة مئوية بانتظام. نصمّم ونهندس وننفّذ منشآت تظليل دائمة للمشاريع التجارية والعامة الكبيرة — من ساحات اللعب ومناطق الانتظار إلى الساحات العامة ومناطق التحميل — حسب المقاس، ومصمّمة لتتحمّل حرارة المنطقة ورياحها وغبارها.",
      "قوتابخانە و نەخۆشخانە و سەنتەرە بازرگانییەکان و باڵەخانە حکومییەکان و شوێنە گشتییەکان لە سەرانسەری کوردستان و عێراقدا پێویستیان بە سێبەرێکی متمانەپێکراوە لە هاوینانێکدا کە پلەی گەرمی بە بەردەوامی لە ٤٠–٤٥ پلەی سەدی تێدەپەڕێت. ئێمە بنیاتی سێبەری هەمیشەیی بۆ پڕۆژە بازرگانی و گشتییە گەورەکان دیزاین و ئەندازیاری و دروست دەکەین — لە یاریگای منداڵان و شوێنی چاوەڕوانییەوە تا گۆڕەپان و شوێنی بارکردن — بەپێی پێوانە و بۆ بەرگەگرتنی گەرما و با و تۆزی ناوچەکە.",
    ),
  },
  {
    slug: "shade-sails",
    image: null,
    name: tri("Shade Sails", "أشرعة التظليل", "چارۆکەی سێبەر"),
    tagline: tri(
      "Simple, elegant shade for any space",
      "تظليلٌ بسيط وأنيق لأي مساحة",
      "سێبەرێکی سادە و جوان بۆ هەر شوێنێک",
    ),
    description: tri(
      "Shade sails are tensioned fabric sails fixed between posts and walls — a light, flexible and attractive way to shade courtyards, playgrounds, gardens, pools and terraces. The fabric blocks the direct sun while letting air move freely, keeping spaces comfortable in the summer heat. Available in many shapes and sizes, and made to measure.",
      "أشرعة التظليل أشرعةٌ قماشية مشدودة تُثبَّت بين الأعمدة والجدران — طريقةٌ خفيفة ومرنة وجذّابة لتظليل الأفنية وساحات اللعب والحدائق والمسابح والتراسات. يحجب القماش أشعة الشمس المباشرة ويسمح بحركة الهواء بحرية، فتبقى المساحات مريحة في حرّ الصيف. متوفّرة بأشكالٍ ومقاساتٍ متعدّدة، وتُنفَّذ حسب المقاس.",
      "چارۆکەی سێبەر چارۆکەی قوماشی ڕاکێشراون کە لە نێوان کۆڵەکە و دیوارەکاندا جێگیر دەکرێن — ڕێگایەکی سووک و نەرم و سەرنجڕاکێش بۆ سێبەرکردنی حەوشە و یاریگای منداڵان و باخچە و مەلەوانگە و تەراس. قوماشەکە تیشکی ڕاستەوخۆی خۆر ڕادەگرێت و ڕێگە دەدات هەوا بە ئازادی بجووڵێت، بۆیە شوێنەکان لە گەرمای هاویندا ئاسوودە دەمێننەوە. بە چەندین شێوە و قەبارەی جیاواز بەردەستە و بەپێی پێوانە دروست دەکرێت.",
    ),
  },
];

const COLORS = [
  { slug: "ivory", hex: "#EDE6D8", name: tri("Ivory", "عاجي", "عاجی") },
  { slug: "sand", hex: "#D6C7AC", name: tri("Sand", "رملي", "لمی") },
  { slug: "taupe", hex: "#A2968A", name: tri("Taupe", "بني رمادي", "قاوەیی خۆڵەمێشی") },
  { slug: "olive", hex: "#6A6C54", name: tri("Olive", "زيتوني", "زەیتوونی") },
  // Sampled from the canopy in product-solis.webp rather than guessed, so the
  // swatch and the photograph are the same green.
  { slug: "forest", hex: "#17382E", name: tri("Forest", "أخضر داكن", "سەوزی تۆخ") },
  { slug: "terracotta", hex: "#A86A4A", name: tri("Terracotta", "طيني", "خشتی") },
  { slug: "charcoal", hex: "#3A3630", name: tri("Charcoal", "فحمي", "خەڵووزی") },
];

const SIZES = [
  { slug: "250-round", label: "2.5 m ⌀", shape: "ROUND", widthCm: 250, depthCm: null, areaM2: 4.9 },
  { slug: "300-square", label: "3.0 × 3.0 m", shape: "SQUARE", widthCm: 300, depthCm: 300, areaM2: 9 },
  { slug: "350-round", label: "3.5 m ⌀", shape: "ROUND", widthCm: 350, depthCm: null, areaM2: 9.6 },
  { slug: "400-square", label: "4.0 × 4.0 m", shape: "SQUARE", widthCm: 400, depthCm: 400, areaM2: 16 },
  { slug: "400-300-rect", label: "4.0 × 3.0 m", shape: "RECTANGLE", widthCm: 400, depthCm: 300, areaM2: 12 },
  { slug: "500-octagon", label: "5.0 m ⌀", shape: "OCTAGON", widthCm: 500, depthCm: null, areaM2: 19.6 },
  { slug: "600-400-rect", label: "6.0 × 4.0 m", shape: "RECTANGLE", widthCm: 600, depthCm: 400, areaM2: 24 },
  { slug: "800-400-rect", label: "8.0 × 4.0 m", shape: "RECTANGLE", widthCm: 800, depthCm: 400, areaM2: 32 },
];

const MATERIALS = [
  {
    slug: "anodised-aluminium",
    name: tri("Marine-grade anodised aluminium", "ألمنيوم مؤكسد بمواصفات بحرية", "ئەلەمینیۆمی ئەنۆدایزکراوی دەریایی"),
    description: tri(
      "Anodising grows the protective layer out of the metal itself rather than laying paint on top of it. It cannot chip, and it does not lift at an edge after a hot summer.",
      "الأكسدة تُنمّي الطبقة الواقية من المعدن نفسه بدل وضع طلاءٍ فوقه. لا يمكن أن تتقشّر، ولا ترتفع عند الحافة بعد صيفٍ حار.",
      "ئەنۆدایزکردن چینی پارێزەر لە خودی کانزاکەوە دەڕوێنێت لە جیاتی ئەوەی بۆیەیەکی لەسەر دابنێت. ناتوانێت بشکێت، و دوای هاوینێکی گەرم لە لێوارەکەوە هەڵناستێت.",
    ),
  },
  {
    slug: "solution-dyed-acrylic",
    name: tri("Solution-dyed acrylic canopy", "قماش أكريليك مصبوغ في المحلول", "قوماشی ئەکریلیکی ڕەنگکراو لە چارەسەردا"),
    description: tri(
      "The colour is added while the fibre is still liquid, so it runs through the thread instead of sitting on its surface. Fading is measured in years, not seasons.",
      "يُضاف اللون والليف ما يزال سائلًا، فيسري داخل الخيط بدل أن يجلس على سطحه. يُقاس بهتانه بالسنوات لا بالمواسم.",
      "ڕەنگەکە کاتێک زیاد دەکرێت کە تاڵەکە هێشتا شلە، بۆیە بە ناو دەزووەکەدا دەڕوات نەک لەسەر ڕووەکەی دادەنیشێت. کاڵبوونەوەی بە ساڵ دەپێورێت، نەک بە وەرز.",
    ),
  },
  {
    slug: "stainless-fixings",
    name: tri("Stainless steel fixings", "مثبّتات فولاذ ستانلس", "بەندەری پۆڵای ستەینلێس"),
    description: tri(
      "Every bolt, pin and cable is stainless throughout — not plated. Plating is the first thing to fail near a pool, and it takes the joint with it.",
      "كل برغي ومسمار وكابل ستانلس بالكامل — لا مطليّ. الطلاء أول ما يفشل قرب المسبح، ويأخذ الوصلة معه.",
      "هەموو بورغی و دەرزی و کێبڵێک بە تەواوی ستەینلێسە — نەک ڕووکەشکراو. ڕووکەشکردن یەکەم شتە کە لە نزیک مەلەوانگە شکست دەهێنێت، و بەندەکەش لەگەڵ خۆی دەبات.",
    ),
  },
  {
    slug: "teak",
    name: tri("FSC teak", "خشب الساج المعتمد", "دارتەکی FSC"),
    description: tri(
      "Used where a canopy should read as furniture rather than structure. Left unfinished it silvers evenly; oiled, it holds its honey tone.",
      "يُستخدم حيث ينبغي أن تُقرأ المظلّة كأثاثٍ لا كبنية. إن تُرك دون تشطيب اكتسى فضّةً متساوية؛ وإن زُيّت حافظ على لونه العسلي.",
      "لەو شوێنانەدا بەکاردەهێنرێت کە چەترەکە دەبێت وەک کەلوپەل خوێندنەوەی بۆ بکرێت نەک وەک بنیات. ئەگەر بێ تەواوکاری بهێڵدرێتەوە بە یەکسانی زیوی دەبێت؛ ئەگەر ڕۆنی لێبدرێت ڕەنگە هەنگوینییەکەی دەپارێزێت.",
    ),
  },
];

// ---------------------------------------------------------------------------
// Products (sample catalogue)
// ---------------------------------------------------------------------------

type ProductSeed = {
  slug: string;
  sku: string;
  category: string;
  status?: string;
  featured?: boolean;
  order: number;
  price: number | null;
  showPrice?: boolean;
  availability?: string;
  leadTimeDays?: number;
  style: string;
  segment: string;
  useCases: string[];
  coverageM2: number;
  priceTier: number;
  /**
   * A plain URL, or one bound to the colourway it photographs, or one with its
   * dimensions recorded so it is shown whole rather than cropped (photoRatio).
   */
  images: (string | { url: string; color?: string; width?: number; height?: number })[];
  colors: string[];
  sizes: string[];
  materials: string[];
  accessories?: string[];
  name: Tri;
  tagline: Tri;
  description: Tri;
  features: { en: string[]; ar: string[]; ckb: string[] };
  specs: { en: [string, string][]; ar: [string, string][]; ckb: [string, string][] };
};

const PRODUCTS: ProductSeed[] = [
  {
    slug: "aria",
    sku: "SW-ARI",
    category: "cantilever",
    featured: true,
    order: 1,
    price: 2400,
    showPrice: true,
    availability: "MADE_TO_ORDER",
    leadTimeDays: 21,
    style: "MODERN",
    segment: "BOTH",
    useCases: ["terrace", "garden", "pool", "restaurant"],
    coverageM2: 16,
    priceTier: 2,
    images: ["/media/product-aria.webp"],
    colors: [],
    sizes: ["300-square", "400-square", "400-300-rect"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "stainless-fixings"],
    accessories: ["base-granite", "cover-canopy", "light-ring"],
    name: tri("Aria", "أريا", "ئاریا"),
    tagline: tri(
      "A cantilever that disappears above the table",
      "مظلّة كابولية تختفي فوق الطاولة",
      "کانتیلیڤەرێک کە لەسەر مێزەکە ون دەبێت",
    ),
    description: tri(
      "Aria carries a four-metre canopy from a single side mast, leaving the floor beneath entirely free. The arm is drawn as one continuous curve, so from beneath there is nothing to read but the underside of the canopy.",
      "تحمل أريا مظلّةً بأربعة أمتار من عمودٍ جانبي واحد، تاركةً الأرض تحتها خالية تمامًا. رُسم الذراع كمنحنى متصل واحد، فلا يُرى من الأسفل سوى باطن المظلّة.",
      "ئاریا چەترێکی چوار مەتری لە یەک کۆڵەکەی لاتەنیشتەوە هەڵدەگرێت، و زەوی ژێرەوەی بە تەواوی ئازاد دەهێڵێتەوە. بازووەکە وەک یەک چەماوەی بەردەوام کێشراوە، بۆیە لە خوارەوە هیچ نییە بخوێنرێتەوە جگە لە ژێری چەترەکە.",
    ),
    features: {
      en: [
        "360° rotation on a sealed base bearing",
        "Crank lift with a locking pin at full extension",
        "Canopy removable for winter storage without tools",
        "Optional in-mast LED ring",
      ],
      ar: [
        "دوران ٣٦٠° على محمل قاعدة مغلق",
        "رفع بمرفاع مع مسمار قفل عند الامتداد الكامل",
        "قماش قابل للفكّ للتخزين الشتوي دون أدوات",
        "حلقة LED اختيارية داخل العمود",
      ],
      ckb: [
        "سووڕانەوەی ٣٦٠° لەسەر بەیرینگی داخراوی بنکە",
        "بەرزکردنەوە بە کرانک لەگەڵ دەرزیی قوفڵ لە درێژبوونەوەی تەواودا",
        "قوماشی هەڵگیراو بۆ هەڵگرتنی زستان بەبێ ئامێر",
        "بازنەی LED ئارەزوومەندانە لە ناو کۆڵەکەدا",
      ],
    },
    specs: {
      en: [
        ["Frame", "Marine-grade anodised aluminium"],
        ["Canopy", "Solution-dyed acrylic, 300 g/m²"],
        ["Mast", "Side mast, 80 mm section"],
        ["Rotation", "360°, sealed bearing"],
        ["Recommended base", "Granite or in-ground socket"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد بمواصفات بحرية"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٣٠٠ غ/م²"],
        ["العمود", "عمود جانبي، مقطع ٨٠ ملم"],
        ["الدوران", "٣٦٠°، محمل مغلق"],
        ["القاعدة الموصى بها", "غرانيت أو مقبس أرضي"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراوی دەریایی"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٣٠٠ گ/م²"],
        ["کۆڵەکە", "کۆڵەکەی لاتەنیشت، بەشی ٨٠ ملم"],
        ["سووڕانەوە", "٣٦٠°، بەیرینگی داخراو"],
        ["بنکەی پێشنیارکراو", "گرانیت یان سۆکێتی ناو زەوی"],
      ],
    },
  },
  {
    slug: "orbis",
    sku: "SW-ORB",
    category: "center-pole",
    featured: true,
    order: 2,
    price: 1450,
    showPrice: true,
    style: "CLASSIC",
    segment: "RESIDENTIAL",
    useCases: ["garden", "terrace", "balcony"],
    coverageM2: 9.6,
    priceTier: 1,
    images: [
      { url: "/media/product-orbis.webp", color: "ivory" },
      { url: "/media/product-solis.webp", color: "forest" },
    ],
    colors: ["ivory", "forest"],
    sizes: ["250-round", "300-square", "350-round"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "teak"],
    accessories: ["base-granite", "cover-canopy"],
    name: tri("Orbis", "أوربِس", "ئۆربیس"),
    tagline: tri("The round canopy, properly made", "المظلّة الدائرية، مصنوعة كما ينبغي", "چەترە خڕەکە، بە دروستی دروستکراو"),
    description: tri(
      "A centre-pole umbrella at domestic scale, with a teak mast and an eight-rib canopy that opens with a single pull. Intended for a garden table and the hours around it.",
      "مظلّة بعمودٍ مركزي بمقاسٍ منزلي، بعمود ساج ومظلّة بثمانية أضلاع تُفتح بسحبةٍ واحدة. مخصّصة لطاولة الحديقة وللساعات من حولها.",
      "چەترێکی کۆڵەکەی ناوەڕاست بە قەبارەی ماڵەوە، بە کۆڵەکەیەکی دارتەک و چەترێکی هەشت پەراسوو کە بە یەک ڕاکێشان دەکرێتەوە. بۆ مێزی باخچە و ئەو کاتژمێرانەی دەوروبەری تەرخانکراوە.",
    ),
    features: {
      en: ["Pulley lift, no crank", "FSC teak mast, unsealed", "Eight pinned ribs, individually replaceable", "Fits a standard 48 mm table aperture"],
      ar: ["رفع ببكرة دون مرفاع", "عمود ساج معتمد FSC دون إغلاق", "ثمانية أضلاع مثبّتة قابلة للاستبدال منفردة", "يناسب فتحة طاولة قياسية ٤٨ ملم"],
      ckb: ["بەرزکردنەوە بە بەکرە، بێ کرانک", "کۆڵەکەی دارتەکی FSC، بێ داخستن", "هەشت پەراسووی دەرزیدراو، هەریەکە بە تەنها گۆڕانکارە", "لەگەڵ کونی مێزی ستانداردی ٤٨ ملم دەگونجێت"],
    },
    specs: {
      en: [
        ["Frame", "Aluminium ribs, teak mast"],
        ["Canopy", "Solution-dyed acrylic, 280 g/m²"],
        ["Mast diameter", "48 mm"],
        ["Ribs", "8, pinned"],
        ["Lift", "Pulley and cleat"],
      ],
      ar: [
        ["الهيكل", "أضلاع ألمنيوم، عمود ساج"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٢٨٠ غ/م²"],
        ["قطر العمود", "٤٨ ملم"],
        ["الأضلاع", "٨، مثبّتة بمسامير"],
        ["الرفع", "بكرة ومثبّت"],
      ],
      ckb: [
        ["چوارچێوە", "پەراسووی ئەلەمینیۆم، کۆڵەکەی دارتەک"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٢٨٠ گ/م²"],
        ["تیرەی کۆڵەکە", "٤٨ ملم"],
        ["پەراسوو", "٨، دەرزیدراو"],
        ["بەرزکردنەوە", "بەکرە و بەندەر"],
      ],
    },
  },
  {
    slug: "meridian",
    sku: "SW-MER",
    category: "large-shade",
    featured: true,
    order: 3,
    price: null,
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["hotel", "restaurant", "rooftop"],
    coverageM2: 32,
    priceTier: 3,
    images: ["/media/product-meridian.webp"],
    colors: [],
    sizes: ["600-400-rect", "800-400-rect", "500-octagon"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "stainless-fixings"],
    accessories: ["light-ring", "cover-canopy"],
    name: tri("Meridian", "ميريديان", "مێریدیان"),
    tagline: tri("Continuous cover, engineered as one span", "غطاءٌ متصل مُهندَس كامتدادٍ واحد", "داپۆشینی بەردەوام، وەک یەک ماوە ئەندازیاری کراوە"),
    description: tri(
      "A modular system for hotel terraces and restaurant floors. Units link along a shared beam so the shadow line runs unbroken across the whole space, with no gaps between canopies.",
      "نظام معياري لتراسات الفنادق وصالات المطاعم. تتصل الوحدات على عارضةٍ مشتركة فيمتدّ خط الظل دون انقطاع عبر المساحة كلها، بلا فجواتٍ بين المظلات.",
      "سیستەمێکی مۆدیوڵار بۆ تەراسی هۆتێل و زەوی چێشتخانە. یەکەکان لەسەر تیرێکی هاوبەش بەیەکەوە دەبەسترێن بۆ ئەوەی هێڵی سێبەر بێ پچڕان بەسەر هەموو بۆشاییەکەدا بڕوات، بەبێ بۆشایی لە نێوان چەترەکاندا.",
    ),
    features: {
      en: ["Units link along a shared structural beam", "Integrated gutter between bays", "Wind-release fixing on every canopy", "Specified per site after a wind assessment"],
      ar: ["وحدات تتصل على عارضة إنشائية مشتركة", "مزراب مدمج بين الوحدات", "مثبّت تحرير عند الرياح على كل مظلّة", "تُحدَّد لكل موقع بعد تقييم الرياح"],
      ckb: ["یەکەکان لەسەر تیرێکی بنیاتی هاوبەش بەیەکەوە دەبەسترێن", "ئاوەڕۆی تێکەڵکراو لە نێوان بەشەکاندا", "بەندەری ئازادکردنی با لەسەر هەموو چەترێک", "بۆ هەر شوێنێک دوای هەڵسەنگاندنی با دیاری دەکرێت"],
    },
    specs: {
      en: [
        ["Frame", "Anodised aluminium, structural section"],
        ["Canopy", "Solution-dyed acrylic, 340 g/m²"],
        ["Configuration", "Single, twin or continuous run"],
        ["Fixing", "Bolt-down or in-ground"],
        ["Wind rating", "Assessed per site"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد، مقطع إنشائي"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٣٤٠ غ/م²"],
        ["التكوين", "مفرد أو مزدوج أو امتداد متصل"],
        ["التثبيت", "برغي أرضي أو مدفون"],
        ["تصنيف الرياح", "يُقيَّم لكل موقع"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراو، بەشی بنیاتی"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٣٤٠ گ/م²"],
        ["ڕێکخستن", "تاک، دووانە یان درێژایی بەردەوام"],
        ["بەندکردن", "بە بورغی یان ناو زەوی"],
        ["پلەی با", "بۆ هەر شوێنێک هەڵدەسەنگێنرێت"],
      ],
    },
  },
  {
    slug: "atrium",
    sku: "SW-ATR",
    category: "center-pole",
    order: 5,
    price: 1720,
    showPrice: true,
    style: "MINIMAL",
    segment: "BOTH",
    useCases: ["terrace", "rooftop", "restaurant"],
    coverageM2: 16,
    priceTier: 2,
    images: ["/media/product-atrium.webp"],
    colors: [],
    sizes: ["300-square", "400-square"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "stainless-fixings"],
    accessories: ["light-ring", "base-granite"],
    name: tri("Atrium", "أتريوم", "ئەتریۆم"),
    tagline: tri("A square canopy with nothing left over", "مظلّة مربّعة بلا زوائد", "چەترێکی چوارگۆشە بەبێ هیچ زیادەیەک"),
    description: tri(
      "Atrium is the most reduced piece in the collection: a square canopy, a straight mast, no valance and no visible hardware. It is intended for architecture that does not want to be interrupted.",
      "أتريوم أكثر القطع اختزالًا في المجموعة: مظلّة مربّعة، وعمود مستقيم، بلا حاشية ولا أجزاء ظاهرة. مخصّصة لعمارةٍ لا تريد أن تُقاطَع.",
      "ئەتریۆم کەمکراوەترین بەرهەمی کۆمەڵەکەیە: چەترێکی چوارگۆشە، کۆڵەکەیەکی ڕاست، بێ لێواری قوماش و بێ کەرەستەی دیار. بۆ تەلارسازییەک تەرخانکراوە کە نایەوێت بپچڕێت.",
    ),
    features: {
      en: ["No valance — a clean canopy edge", "Concealed crank behind a flush cover", "Square 400 mm footprint at the base", "Optional under-canopy LED ring"],
      ar: ["بلا حاشية — حافة قماش نظيفة", "مرفاع مخفيّ خلف غطاءٍ مستوٍ", "بصمة قاعدة مربّعة ٤٠٠ ملم", "حلقة LED اختيارية تحت القماش"],
      ckb: ["بێ لێواری قوماش — لێوارێکی پاکی چەتر", "کرانکی شاردراوە لە پشت داپۆشەرێکی تەختدا", "شوێنپێی چوارگۆشەی ٤٠٠ ملم لە بنکەدا", "بازنەی LED ئارەزوومەندانە لە ژێر چەتردا"],
    },
    specs: {
      en: [
        ["Frame", "Anodised aluminium"],
        ["Canopy", "Solution-dyed acrylic, 320 g/m²"],
        ["Mast", "Straight, 60 mm square"],
        ["Valance", "None"],
        ["Lift", "Concealed crank"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٣٢٠ غ/م²"],
        ["العمود", "مستقيم، مربّع ٦٠ ملم"],
        ["الحاشية", "بلا"],
        ["الرفع", "مرفاع مخفيّ"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراو"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٣٢٠ گ/م²"],
        ["کۆڵەکە", "ڕاست، چوارگۆشەی ٦٠ ملم"],
        ["لێواری قوماش", "نییە"],
        ["بەرزکردنەوە", "کرانکی شاردراوە"],
      ],
    },
  },
  {
    slug: "solis",
    sku: "SW-SOL",
    category: "garden",
    order: 6,
    price: 980,
    showPrice: true,
    style: "CLASSIC",
    segment: "RESIDENTIAL",
    useCases: ["garden", "balcony", "terrace"],
    coverageM2: 4.9,
    priceTier: 1,
    images: [
      { url: "/media/product-solis.webp", color: "forest" },
      { url: "/media/product-orbis.webp", color: "ivory" },
    ],
    colors: ["forest", "ivory"],
    sizes: ["250-round", "300-square"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic"],
    accessories: ["base-granite", "cover-canopy"],
    name: tri("Solis", "سوليس", "سۆلیس"),
    tagline: tri("The small canopy, taken seriously", "المظلّة الصغيرة، مأخوذة على محمل الجدّ", "چەترە بچووکەکە، بە جدی وەرگیراو"),
    description: tri(
      "Solis is scaled for a balcony or a two-seat garden table — the situations where most umbrellas are treated as disposable. It uses the same canopy fabric as pieces four times its size.",
      "صُمّمت سوليس لشرفة أو طاولة حديقة بمقعدين — المواقف التي تُعامَل فيها معظم المظلات كأشياء تُرمى. تستخدم القماش نفسه المستخدم في قطعٍ بأربعة أضعاف حجمها.",
      "سۆلیس بۆ بەلکۆنێک یان مێزی باخچەی دوو کورسی قەبارە کراوە — ئەو دۆخانەی زۆربەی چەترەکان تێیدا وەک شتی فڕێدراو مامەڵەیان لەگەڵ دەکرێت. هەمان قوماشی چەتر بەکاردەهێنێت کە بەرهەمی چوار ئەوەندە گەورەتر بەکاری دەهێنن.",
    ),
    features: {
      en: ["Push-up lift, no moving parts to service", "Fits balcony rail and table clamps", "Full canopy fabric specification", "Four garden-tuned colourways"],
      ar: ["رفع بالدفع، بلا أجزاء متحرّكة تحتاج صيانة", "يناسب مشابك سياج الشرفة والطاولات", "مواصفة قماش كاملة", "أربع تدرّجات لونية مناسبة للحدائق"],
      ckb: ["بەرزکردنەوەی پاڵدان، بێ بەشی جووڵاو کە چاککردنی بوێت", "لەگەڵ گیرەی بەلکۆن و مێزدا دەگونجێت", "دیاریکراوی تەواوی قوماشی چەتر", "چوار ڕەنگی گونجاو بۆ باخچە"],
    },
    specs: {
      en: [
        ["Frame", "Anodised aluminium"],
        ["Canopy", "Solution-dyed acrylic, 280 g/m²"],
        ["Mast diameter", "38 mm"],
        ["Lift", "Push-up"],
        ["Ribs", "8"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٢٨٠ غ/م²"],
        ["قطر العمود", "٣٨ ملم"],
        ["الرفع", "بالدفع"],
        ["الأضلاع", "٨"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراو"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٢٨٠ گ/م²"],
        ["تیرەی کۆڵەکە", "٣٨ ملم"],
        ["بەرزکردنەوە", "پاڵدان"],
        ["پەراسوو", "٨"],
      ],
    },
  },
  {
    slug: "vela",
    sku: "SW-VEL",
    category: "commercial",
    order: 7,
    price: null,
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["restaurant", "hotel", "rooftop", "pool"],
    coverageM2: 24,
    priceTier: 3,
    images: ["/media/product-vela.webp"],
    colors: [],
    sizes: ["500-octagon", "600-400-rect"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "stainless-fixings"],
    accessories: ["light-ring", "cover-canopy"],
    name: tri("Vela", "فيلا", "ڤێلا"),
    tagline: tri("Opened and closed every day of the season", "تُفتح وتُغلق كل يومٍ من الموسم", "هەموو ڕۆژێکی وەرزەکە دەکرێتەوە و دادەخرێت"),
    description: tri(
      "Vela is the piece specified where a canopy is part of the daily routine — opened at service, closed at night, for an entire season. The mechanism is rated for that cycle rather than for occasional use.",
      "فيلا هي القطعة التي تُحدَّد حيث تكون المظلّة جزءًا من الروتين اليومي — تُفتح مع الخدمة وتُغلق ليلًا، طوال موسمٍ كامل. الآلية مصنّفة لتلك الدورة لا للاستخدام العرضي.",
      "ڤێلا ئەو بەرهەمەیە کە لەو شوێنانەدا دیاری دەکرێت کە چەترەکە بەشێکە لە ڕووتینی ڕۆژانە — لە کاتی خزمەتدا دەکرێتەوە، شەوانە دادەخرێت، بۆ وەرزێکی تەواو. میکانیزمەکە بۆ ئەو سووڕە پلەبەندی کراوە نەک بۆ بەکارهێنانی کاتوکات.",
    ),
    features: {
      en: ["Geared crank rated for daily cycling", "Canopy replaceable on site", "Wind-release at the rib tips", "Specified per venue"],
      ar: ["مرفاع مُسنّن مصنّف للتشغيل اليومي", "قماش قابل للاستبدال في الموقع", "تحرير عند أطراف الأضلاع في الرياح", "تُحدَّد لكل منشأة"],
      ckb: ["کرانکی دەندانەدار بۆ سووڕی ڕۆژانە پلەبەندی کراوە", "قوماشی گۆڕانکار لە شوێنەکەدا", "ئازادکردنی با لە سەری پەراسووەکاندا", "بۆ هەر شوێنێک دیاری دەکرێت"],
    },
    specs: {
      en: [
        ["Frame", "Anodised aluminium, heavy section"],
        ["Canopy", "Solution-dyed acrylic, 340 g/m²"],
        ["Lift", "Geared crank"],
        ["Canopy service", "Replaceable on site"],
        ["Wind rating", "Assessed per venue"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد، مقطع ثقيل"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٣٤٠ غ/م²"],
        ["الرفع", "مرفاع مُسنّن"],
        ["خدمة القماش", "قابل للاستبدال في الموقع"],
        ["تصنيف الرياح", "يُقيَّم لكل منشأة"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراو، بەشی قورس"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٣٤٠ گ/م²"],
        ["بەرزکردنەوە", "کرانکی دەندانەدار"],
        ["خزمەتی قوماش", "لە شوێنەکەدا گۆڕانکارە"],
        ["پلەی با", "بۆ هەر شوێنێک هەڵدەسەنگێنرێت"],
      ],
    },
  },
  // --- Accessories ---------------------------------------------------------
  {
    slug: "base-granite",
    sku: "SW-ACC-01",
    category: "accessories",
    order: 20,
    price: 320,
    showPrice: true,
    style: "MINIMAL",
    segment: "BOTH",
    useCases: ["terrace", "garden", "pool"],
    coverageM2: 0,
    priceTier: 1,
    images: ["/media/product-base.svg"],
    colors: [],
    sizes: [],
    materials: ["stainless-fixings"],
    name: tri("Granite Base", "قاعدة غرانيت", "بنکەی گرانیت"),
    tagline: tri("Weight, without a plastic tub", "ثقلٌ دون حوضٍ بلاستيكي", "قورسی، بەبێ تەشتی پلاستیکی"),
    description: tri(
      "A solid granite base with a stainless collar. Specified because a canopy is only as stable as the thing holding it down, and most bases are an afterthought.",
      "قاعدة غرانيت صلبة بطوقٍ ستانلس. حُدِّدت لأن ثبات المظلّة لا يتجاوز ثبات ما يمسكها، ومعظم القواعد فكرةٌ لاحقة.",
      "بنکەیەکی گرانیتی ڕەق بە ملوانکەیەکی ستەینلێس. دیاری کراوە چونکە چەترێک تەنها بەو ئەندازەیە جێگیرە کە ئەو شتەی دایدەگرێت، و زۆربەی بنکەکان بیرۆکەیەکی دواترن.",
    ),
    features: {
      en: ["Solid granite, 60 kg", "Stainless collar and levelling screws", "Felt underside to protect stone and tile"],
      ar: ["غرانيت صلب، ٦٠ كغ", "طوق ستانلس وبراغي تسوية", "باطن لبّادي لحماية الحجر والبلاط"],
      ckb: ["گرانیتی ڕەق، ٦٠ کگم", "ملوانکەی ستەینلێس و بورغیی تەختکردنەوە", "ژێرەوەی لبد بۆ پاراستنی بەرد و کاشی"],
    },
    specs: {
      en: [["Weight", "60 kg"], ["Material", "Granite, stainless collar"], ["Fits", "38–80 mm masts"]],
      ar: [["الوزن", "٦٠ كغ"], ["المادة", "غرانيت، طوق ستانلس"], ["يناسب", "أعمدة ٣٨–٨٠ ملم"]],
      ckb: [["کێش", "٦٠ کگم"], ["کەرەستە", "گرانیت، ملوانکەی ستەینلێس"], ["دەگونجێت لەگەڵ", "کۆڵەکەی ٣٨–٨٠ ملم"]],
    },
  },
  {
    slug: "cover-canopy",
    sku: "SW-ACC-02",
    category: "accessories",
    order: 21,
    price: 140,
    showPrice: true,
    style: "MINIMAL",
    segment: "BOTH",
    useCases: ["terrace", "garden", "pool", "rooftop"],
    coverageM2: 0,
    priceTier: 1,
    images: ["/media/product-cover.svg"],
    colors: [],
    sizes: [],
    materials: ["solution-dyed-acrylic"],
    name: tri("Protective Cover", "غطاء واقٍ", "داپۆشەری پارێزەر"),
    tagline: tri("For the months it stands closed", "للأشهر التي تبقى فيها مغلقة", "بۆ ئەو مانگانەی داخراو ڕادەوەستێت"),
    description: tri(
      "A fitted cover in the same acrylic as the canopies, with a stainless zip. Most canopy damage happens out of season, not in it.",
      "غطاء مفصّل من الأكريليك نفسه المستخدم في المظلات، بسحّابٍ ستانلس. معظم أضرار القماش تحدث خارج الموسم لا فيه.",
      "داپۆشەرێکی گونجاو لە هەمان ئەکریلیکی چەترەکان، بە زیپێکی ستەینلێس. زۆربەی زیانی قوماش لە دەرەوەی وەرزەکەدا ڕوودەدات، نەک تێیدا.",
    ),
    features: {
      en: ["Same solution-dyed acrylic as the canopies", "Stainless zip and drawcord", "Sized to each piece"],
      ar: ["الأكريليك المصبوغ نفسه المستخدم في المظلات", "سحّاب ستانلس وحبل شدّ", "بمقاس كل قطعة"],
      ckb: ["هەمان ئەکریلیکی ڕەنگکراوی چەترەکان", "زیپی ستەینلێس و گوریسی ڕاکێشان", "بە قەبارەی هەر بەرهەمێک"],
    },
    specs: {
      en: [["Material", "Solution-dyed acrylic"], ["Closure", "Stainless zip"], ["Sizing", "Per piece"]],
      ar: [["المادة", "أكريليك مصبوغ في المحلول"], ["الإغلاق", "سحّاب ستانلس"], ["المقاس", "لكل قطعة"]],
      ckb: [["کەرەستە", "ئەکریلیکی ڕەنگکراو لە چارەسەردا"], ["داخستن", "زیپی ستەینلێس"], ["قەبارە", "بۆ هەر بەرهەمێک"]],
    },
  },
  {
    slug: "light-ring",
    sku: "SW-ACC-03",
    category: "accessories",
    order: 22,
    price: 260,
    showPrice: true,
    style: "MODERN",
    segment: "BOTH",
    useCases: ["terrace", "restaurant", "rooftop", "hotel"],
    coverageM2: 0,
    priceTier: 2,
    images: ["/media/product-light.svg"],
    colors: [],
    sizes: [],
    materials: ["anodised-aluminium", "stainless-fixings"],
    name: tri("Canopy Light Ring", "حلقة إضاءة المظلّة", "بازنەی ڕووناکی چەتر"),
    tagline: tri("Warm light, aimed down", "ضوءٌ دافئ موجَّه للأسفل", "ڕووناکی گەرم، بەرەو خوارەوە ئاڕاستەکراو"),
    description: tri(
      "A dimmable ring that mounts inside the hub and throws warm light onto the table rather than into the eye. 2700 K, because outdoor spaces read cold at anything higher.",
      "حلقة قابلة للتعتيم تُركّب داخل المحور وتلقي ضوءًا دافئًا على الطاولة لا في العين. ٢٧٠٠ كلفن، لأن المساحات الخارجية تبدو باردة عند أي درجةٍ أعلى.",
      "بازنەیەکی کەمکەرەوە کە لە ناو ناوەندەکەدا دادەنرێت و ڕووناکی گەرم دەخاتە سەر مێزەکە نەک بۆ ناو چاو. ٢٧٠٠ کێلڤن، چونکە بۆشایی دەرەوە لە هەر پلەیەکی بەرزتردا سارد دەردەکەوێت.",
    ),
    features: {
      en: ["2700 K, dimmable", "IP65, rated for open weather", "Runs from the mast — no visible cable"],
      ar: ["٢٧٠٠ كلفن، قابلة للتعتيم", "IP65، مصنّفة للطقس المكشوف", "تعمل من داخل العمود — بلا كابل ظاهر"],
      ckb: ["٢٧٠٠ کێلڤن، کەمکەرەوە", "IP65، بۆ کەشی کراوە پلەبەندی کراوە", "لە ناو کۆڵەکەوە کار دەکات — بێ کێبڵی دیار"],
    },
    specs: {
      en: [["Colour temperature", "2700 K"], ["Rating", "IP65"], ["Control", "Dimmable"]],
      ar: [["درجة حرارة اللون", "٢٧٠٠ كلفن"], ["التصنيف", "IP65"], ["التحكّم", "قابلة للتعتيم"]],
      ckb: [["پلەی گەرمی ڕەنگ", "٢٧٠٠ کێلڤن"], ["پلەبەندی", "IP65"], ["کۆنترۆڵ", "کەمکەرەوە"]],
    },
  },
  // --- Car parking shades ---------------------------------------------------
  // Added to the live catalogue by the 20261021120000_car_parking_products
  // migration; kept here so a fresh database matches it. Built to measure, so
  // no price, sizes or colours. The "parking" setting is what the consultation
  // offers them for, and coverage 0 keeps them out of the umbrella questions
  // (see isRecommendable). The photographs are wide site shots with their
  // dimensions recorded, so they are framed whole rather than cropped.
  {
    slug: "cable-stayed-parking-shade",
    sku: "SW-CPS-01",
    category: "car-parking-shades",
    order: 30,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["parking"],
    coverageM2: 0,
    priceTier: 3,
    // The full site photograph, then three views cut from it: the mast and
    // cables, the bays under the canopy, and the row along the palms.
    images: [
      { url: "/media/parking-cable-stayed.jpg", width: 2000, height: 1130 },
      { url: "/media/parking-cable-stayed-detail.jpg", width: 840, height: 475 },
      { url: "/media/parking-cable-stayed-bays.jpg", width: 1100, height: 622 },
      { url: "/media/parking-cable-stayed-row.jpg", width: 1000, height: 565 },
    ],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Cable-Stayed Parking Shade", "مظلة مواقف معلّقة بالكابلات", "سێبەری پارکینگی هەڵواسراو بە کێبڵ"),
    tagline: tri("Clear bays, held from above", "مواقف خالية، محمولة من الأعلى", "شوێنی وەستانی بەتاڵ، لە سەرەوە هەڵگیراو"),
    description: tri(
      "Tall masts and steel cables hold a continuous fabric canopy over the whole row, so the bays underneath stay open. Doors swing freely, cars turn in easily, and every vehicle stays in the shade through the hottest hours of the day. Ideal for long frontages, streets and commercial car parks.",
      "تحمل أعمدةٌ عالية وكابلاتٌ فولاذية مظلةً قماشية متصلة فوق الصف بأكمله، فتبقى المواقف أسفلها مفتوحة بالكامل. تُفتح الأبواب بحرية، وتدخل السيارات بسهولة، وتبقى كل مركبة في الظل طوال ساعات النهار الأشدّ حرارة. مثالية للواجهات الطويلة والشوارع ومواقف السيارات التجارية.",
      "کۆڵەکەی بەرز و کێبڵی پۆڵایی سێبەرێکی قوماشی بەردەوام بەسەر تەواوی ڕیزەکەدا هەڵدەگرن، بۆیە شوێنەکانی وەستان لە ژێرەوە بە تەواوی کراوە دەمێننەوە. دەرگاکان بە ئازادی دەکرێنەوە، ئۆتۆمبێلەکان بە ئاسانی دەچنە ژێرەوە، و هەموو ئۆتۆمبێلێک لە گەرمترین کاتژمێرەکانی ڕۆژدا لە سێبەردا دەمێنێتەوە. گونجاوە بۆ ڕووکاری درێژ و شەقام و پارکینگە بازرگانییەکان.",
    ),
    features: {
      en: ["Masts and cables carry the canopy", "Continuous cover along the whole row", "Made to measure for each site"],
      ar: ["أعمدة وكابلات تحمل الغطاء", "تغطية متصلة على طول الصف", "حسب المقاس لكل موقع"],
      ckb: ["کۆڵەکە و کێبڵ داپۆشینەکە هەڵدەگرن", "داپۆشینی بەردەوام بە درێژایی ڕیزەکە", "بەپێی پێوانەی هەر شوێنێک"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Tensioned shade fabric"], ["Layout", "Continuous row"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "قماش تظليل مشدود"], ["التكوين", "صف متصل"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "قوماشی سێبەری ڕاکێشراو"], ["ڕێکخستن", "ڕیزی بەردەوام"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "pyramid-parking-shade",
    sku: "SW-CPS-02",
    category: "car-parking-shades",
    order: 31,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["parking"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/parking-pyramid.jpg", width: 2000, height: 1125 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Pyramid Parking Shade", "مظلة مواقف هرمية", "سێبەری پارکینگی هەرەمی"),
    tagline: tri("Rows of peaks for large car parks", "صفوفٌ من القمم لمواقف السيارات الكبيرة", "ڕیزی لووتکە بۆ پارکینگی گەورە"),
    description: tri(
      "Repeating pyramid canopies on a shared steel frame — the most popular way to shade a large car park row by row. The peaked shape lets hot air rise and escape and sheds rain quickly, keeping cars cooler underneath in summer and drier in winter. Suits offices, hospitals, universities and shopping centres.",
      "مظلاتٌ هرمية متتالية على هيكلٍ فولاذي مشترك — وهي الطريقة الأكثر شيوعًا لتظليل مواقف السيارات الكبيرة صفًّا بعد صف. يسمح شكلها المدبّب بصعود الهواء الساخن وخروجه، ويصرّف مياه الأمطار بسرعة، فتبقى السيارات أسفلها أبرد صيفًا وأكثر جفافًا شتاءً. تناسب المكاتب والمستشفيات والجامعات والمراكز التجارية.",
      "سێبەری هەرەمی بەدوای یەکدا لەسەر چوارچێوەیەکی پۆڵایی هاوبەش — باوترین ڕێگا بۆ سێبەرکردنی پارکینگە گەورەکان ڕیز بە ڕیز. شێوە لووتکەییەکەی ڕێگە دەدات هەوای گەرم بەرز ببێتەوە و دەربچێت، و ئاوی باران بە خێرایی دەڕژێنێتە خوارەوە، بۆیە ئۆتۆمبێلەکانی ژێرەوەی لە هاویندا فێنکتر و لە زستاندا وشکتر دەمێننەوە. گونجاوە بۆ ئۆفیس و نەخۆشخانە و زانکۆ و سەنتەرە بازرگانییەکان.",
    ),
    features: {
      en: ["Repeating pyramid canopies", "Sheds rain from every peak", "Scales to car parks of any size"],
      ar: ["مظلات هرمية متكرّرة", "تصريف المطر من كل قمة", "تتوسّع لمواقف بأي حجم"],
      ckb: ["سێبەری هەرەمی دووبارەبووەوە", "باران لە هەموو لووتکەیەک دەڕژێنێت", "بۆ پارکینگی هەر قەبارەیەک گونجاوە"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Tensioned shade fabric"], ["Layout", "Single or multiple rows"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "قماش تظليل مشدود"], ["التكوين", "صف واحد أو عدة صفوف"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "قوماشی سێبەری ڕاکێشراو"], ["ڕێکخستن", "یەک ڕیز یان چەند ڕیزێک"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "cantilever-parking-shade",
    sku: "SW-CPS-03",
    category: "car-parking-shades",
    order: 32,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "BOTH",
    useCases: ["parking"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/parking-cantilever.jpg", width: 2000, height: 1109 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Cantilever Parking Shade", "مظلة مواقف كابولية", "سێبەری پارکینگی کانتیلیڤەر"),
    tagline: tri("Posts at the back, open at the front", "أعمدة في الخلف، وواجهة مفتوحة", "کۆڵەکە لە دواوە، کراوە لە پێشەوە"),
    description: tri(
      "Single posts stand at the back of the bays and the canopy reaches forward, leaving the front completely open for easy parking. A clean, modern look that suits villas, building entrances and smaller car parks where every car still needs protection from the summer sun.",
      "تقف أعمدةٌ مفردة في مؤخرة المواقف وتمتد المظلة إلى الأمام، فتبقى الواجهة مفتوحة تمامًا لركنٍ سهل. تصميمٌ عصري أنيق يناسب الفلل ومداخل المباني ومواقف السيارات الصغيرة، حيث تحتاج كل سيارة مع ذلك إلى الحماية من شمس الصيف.",
      "کۆڵەکەی تاک لە دواوەی شوێنەکانی وەستان ڕادەوەستن و سێبەرەکە بەرەو پێشەوە درێژ دەبێتەوە، بەمەش بەشی پێشەوە بە تەواوی کراوە دەمێنێتەوە بۆ وەستانێکی ئاسان. شێوەیەکی مۆدێرن و ڕێکوپێک کە لەگەڵ ڤێلا و دەروازەی باڵەخانە و پارکینگە بچووکەکاندا دەگونجێت، کە هەموو ئۆتۆمبێلێکیان هێشتا پێویستی بە پاراستن لە خۆری هاوین هەیە.",
    ),
    features: {
      en: ["Posts kept to the rear of the bays", "Open front for easy parking", "Suits building entrances and frontages"],
      ar: ["الأعمدة في مؤخرة المواقف", "واجهة مفتوحة لركنٍ سهل", "تناسب مداخل المباني وواجهاتها"],
      ckb: ["کۆڵەکەکان لە دواوەی شوێنەکانن", "پێشەوەی کراوە بۆ وەستانی ئاسان", "گونجاو بۆ دەروازە و ڕووکاری باڵەخانە"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Tensioned shade fabric"], ["Layout", "Single row, posts at the rear"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "قماش تظليل مشدود"], ["التكوين", "صف واحد، الأعمدة في الخلف"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "قوماشی سێبەری ڕاکێشراو"], ["ڕێکخستن", "یەک ڕیز، کۆڵەکە لە دواوە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "steel-roof-carport",
    sku: "SW-CPS-04",
    category: "car-parking-shades",
    order: 33,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "BOTH",
    useCases: ["parking"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/parking-steel-roof.jpg", width: 2000, height: 1120 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Steel Roof Carport", "مظلة مواقف بسقف معدني", "سێبەری پارکینگی بە سەقفی کانزایی"),
    tagline: tri("A solid roof for every season", "سقفٌ صلب لكل المواسم", "سەقفێکی پتەو بۆ هەموو وەرزێک"),
    description: tri(
      "A steel frame with a solid metal roof gives full cover from the strong summer sun and from winter rain and dust. A durable, low-maintenance choice for homes, offices, hospitals and government buildings that want a permanent, clean-lined structure.",
      "هيكلٌ فولاذي بسقفٍ معدني صلب يوفّر حمايةً كاملة من شمس الصيف القوية ومن أمطار الشتاء والغبار. خيارٌ متين وقليل الصيانة للمنازل والمكاتب والمستشفيات والمباني الحكومية التي تبحث عن منشأةٍ دائمة بخطوطٍ نظيفة.",
      "چوارچێوەیەکی پۆڵایی لەگەڵ سەقفێکی کانزایی پتەو پاراستنێکی تەواو دابین دەکات لە خۆری بەهێزی هاوین و لە بارانی زستان و تۆز. هەڵبژاردنێکی بەرگەگر و کەم چاککردنەوەیە بۆ ماڵ و ئۆفیس و نەخۆشخانە و باڵەخانە حکومییەکان کە بنیاتێکی هەمیشەیی و ڕێکوپێکیان دەوێت.",
    ),
    features: {
      en: ["Solid metal roof", "Shelter from sun and rain", "Clean lines for offices and hospitals"],
      ar: ["سقف معدني صلب", "حماية من الشمس والمطر", "خطوط نظيفة للمكاتب والمستشفيات"],
      ckb: ["سەقفی کانزایی پتەو", "پاراستن لە خۆر و باران", "هێڵی پاک بۆ ئۆفیس و نەخۆشخانە"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Metal roof panels"], ["Layout", "Single or multiple rows"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "ألواح سقف معدنية"], ["التكوين", "صف واحد أو عدة صفوف"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "پانێڵی سەقفی کانزایی"], ["ڕێکخستن", "یەک ڕیز یان چەند ڕیزێک"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "double-arch-parking-shade",
    sku: "SW-CPS-05",
    category: "car-parking-shades",
    order: 34,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["parking"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/parking-double-arch.jpg", width: 2000, height: 1101 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Double Arch Parking Shade", "مظلة مواقف مقوّسة مزدوجة", "سێبەری پارکینگی کەوانەیی دووانە"),
    tagline: tri("Two rows from one line of posts", "صفّان من خطٍّ واحد من الأعمدة", "دوو ڕیز لە یەک هێڵی کۆڵەکە"),
    description: tri(
      "Curved canopies reach out to both sides of a single central line of posts, covering two rows of bays at once. Fewer posts means more space to manoeuvre, and the arched shape gives a striking, modern look to large car parks at hotels, malls and public buildings.",
      "تمتد مظلاتٌ مقوّسة إلى جانبَي خطٍّ مركزي واحد من الأعمدة، فتغطي صفّين من المواقف في آنٍ واحد. أعمدةٌ أقل تعني مساحةً أكبر للمناورة، ويمنح الشكل المقوّس مواقف السيارات الكبيرة في الفنادق والمولات والمباني العامة مظهرًا عصريًا لافتًا.",
      "سێبەری کەوانەیی بۆ هەردوو لای یەک هێڵی ناوەندی کۆڵەکە درێژ دەبنەوە و دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشن. کۆڵەکەی کەمتر واتە بۆشایی زیاتر بۆ جووڵەی ئۆتۆمبێل، و شێوە کەوانەییەکەی ڕووکارێکی مۆدێرن و سەرنجڕاکێش دەبەخشێتە پارکینگە گەورەکانی هۆتێل و مۆڵ و باڵەخانە گشتییەکان.",
    ),
    features: {
      en: ["Covers two rows of bays at once", "One central line of posts", "Curved canopies on both sides"],
      ar: ["يغطي صفّين من المواقف معًا", "خط مركزي واحد من الأعمدة", "أغطية مقوّسة على الجانبين"],
      ckb: ["دوو ڕیز شوێنی وەستان پێکەوە دادەپۆشێت", "یەک هێڵی ناوەندی کۆڵەکە", "داپۆشینی کەوانەیی لە هەردوو لا"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Tensioned shade fabric"], ["Layout", "Two rows, central posts"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "قماش تظليل مشدود"], ["التكوين", "صفّان، أعمدة في الوسط"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "قوماشی سێبەری ڕاکێشراو"], ["ڕێکخستن", "دوو ڕیز، کۆڵەکە لە ناوەڕاست"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  // --- Tensile structures -------------------------------------------------
  // Added to the live catalogue by the 20261025120000_tensile_products
  // migration; kept here so a fresh database matches it. Built to measure for
  // each project, so no price, sizes or colours. With coverage 0 the
  // consultation treats them as built to measure: offered for the settings
  // they are tagged with, and for larger areas (see isBuiltToMeasure). The
  // grandstand roof suits none of those settings, so it stays out. Wide
  // project photographs with their dimensions recorded, so they are framed
  // whole rather than cropped.
  {
    slug: "arched-membrane-canopy",
    sku: "SW-TEN-01",
    category: "tensile-structures",
    order: 40,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["hotel", "restaurant", "terrace", "garden"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-arched.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Arched Membrane Canopy", "مظلة غشائية مقوّسة", "سێبەری پەردەیی کەوانەیی"),
    tagline: tri("A sweeping roof on curved steel arches", "سقفٌ منساب على أقواس فولاذية", "سەقفێکی ڕەوان لەسەر کەوانەی پۆڵایی"),
    description: tri(
      "Curved steel arches carry a tensioned membrane in one sweeping span, covering a stage, seating area or courtyard without a single column in the middle. Guests stay in the shade through long summer afternoons, and the open span keeps every view clear. Ideal for amphitheatres, event spaces, schools and heritage sites.",
      "تحمل أقواسٌ فولاذية منحنية غشاءً مشدودًا في امتدادٍ واحد منساب، يغطي مسرحًا أو منطقة جلوس أو فناءً دون عمودٍ واحد في الوسط. يبقى الضيوف في الظل طوال ساعات العصر الطويلة في الصيف، ويُبقي الامتداد المفتوح كل الإطلالات واضحة. مثالية للمدرّجات المفتوحة وأماكن الفعاليات والمدارس والمواقع التراثية.",
      "کەوانەی پۆڵایی چەماوە پەردەیەکی ڕاکێشراو لە یەک ماوەی ڕەواندا هەڵدەگرن، شانۆیەک یان شوێنی دانیشتن یان حەوشەیەک دادەپۆشن بەبێ تاکە کۆڵەکەیەک لە ناوەڕاستدا. میوانەکان لە ئێوارە درێژەکانی هاویندا لە سێبەردا دەمێننەوە، و ماوە کراوەکە هەموو دیمەنێک ڕوون دەهێڵێتەوە. گونجاوە بۆ ئەمفیتیاتر و شوێنی بۆنەکان و قوتابخانە و شوێنە مێژووییەکان.",
    ),
    features: {
      en: ["Curved steel arches", "Open span with no central columns", "Suits stages, amphitheatres and courtyards"],
      ar: ["أقواس فولاذية منحنية", "امتداد مفتوح دون أعمدة وسطى", "يناسب المسارح والمدرّجات والأفنية"],
      ckb: ["کەوانەی پۆڵایی چەماوە", "ماوەی کراوە بەبێ کۆڵەکەی ناوەڕاست", "گونجاو بۆ شانۆ و ئەمفیتیاتر و حەوشە"],
    },
    specs: {
      en: [["Structure", "Curved steel arches"], ["Covering", "Tensioned membrane"], ["Setting", "Stages and courtyards"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أقواس فولاذية منحنية"], ["الغطاء", "غشاء مشدود"], ["الموقع", "المسارح والأفنية"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کەوانەی پۆڵایی چەماوە"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "شانۆ و حەوشە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "twin-peak-canopy",
    sku: "SW-TEN-02",
    category: "tensile-structures",
    order: 41,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["restaurant", "hotel", "terrace", "rooftop"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-twin-peak.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Twin Peak Canopy", "مظلة القمّتين", "سێبەری دوو لووتکە"),
    tagline: tri("Two peaks over a shaded courtyard", "قمّتان فوق فناءٍ مظلّل", "دوو لووتکە بەسەر حەوشەیەکی سێبەرداردا"),
    description: tri(
      "Two cone-shaped membranes rise from central masts to shade cafés, courtyards and outdoor seating. The high peaks let warm air rise away from guests, and the low anchor points keep the space open on every side. A favourite for restaurants, hotels and heritage courtyards that stay busy all summer.",
      "يرتفع غشاءان مخروطيان من أعمدةٍ مركزية لتظليل المقاهي والأفنية وجلسات الهواء الطلق. تسمح القمم العالية بصعود الهواء الدافئ بعيدًا عن الضيوف، وتُبقي نقاط التثبيت المنخفضة المكان مفتوحًا من كل الجهات. خيارٌ مفضّل للمطاعم والفنادق والأفنية التراثية التي تبقى مزدحمة طوال الصيف.",
      "دوو پەردەی قووچەکی لە کۆڵەکەی ناوەندییەوە بەرز دەبنەوە بۆ سێبەرکردنی کافێ و حەوشە و شوێنی دانیشتنی دەرەوە. لووتکە بەرزەکان ڕێگە دەدەن هەوای گەرم بەرز ببێتەوە و لە میوانەکان دوور بکەوێتەوە، و خاڵە نزمەکانی بەستنەوە شوێنەکە لە هەموو لایەکەوە کراوە دەهێڵنەوە. هەڵبژاردەیەکی دڵخوازە بۆ چێشتخانە و هۆتێل و حەوشە مێژووییەکان کە بە درێژایی هاوین قەرەباڵغن.",
    ),
    features: {
      en: ["Two cone-shaped peaks", "Low anchor points around the edge", "Suits cafés, courtyards and outdoor seating"],
      ar: ["قمّتان مخروطيتان", "نقاط تثبيت منخفضة على الأطراف", "تناسب المقاهي والأفنية والجلسات الخارجية"],
      ckb: ["دوو لووتکەی قووچەکی", "خاڵی بەستنەوەی نزم لە دەوروبەر", "گونجاو بۆ کافێ و حەوشە و دانیشتنی دەرەوە"],
    },
    specs: {
      en: [["Structure", "Steel masts and cables"], ["Covering", "Tensioned membrane"], ["Setting", "Cafés and courtyards"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية وكابلات"], ["الغطاء", "غشاء مشدود"], ["الموقع", "المقاهي والأفنية"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی و کێبڵ"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "کافێ و حەوشە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "multi-mast-membrane",
    sku: "SW-TEN-03",
    category: "tensile-structures",
    order: 42,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["hotel", "pool", "terrace", "rooftop"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-multi-mast.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Multi-Mast Membrane", "غشاء متعدد الأعمدة", "پەردەی فرە کۆڵەکە"),
    tagline: tri("A sculptural roof held by masts and cables", "سقفٌ نحتي تحمله أعمدة وكابلات", "سەقفێکی پەیکەرئاسا کە کۆڵەکە و کێبڵ هەڵیدەگرن"),
    description: tri(
      "A single sculptural membrane stretched between tall masts and cables, rising and falling across an entrance, plaza or drop-off area. It gives arriving guests shade from the summer sun and gives the building a memorable landmark. Suits hotels, resorts, cultural centres and government buildings.",
      "غشاءٌ نحتي واحد مشدود بين أعمدةٍ عالية وكابلات، يعلو ويهبط فوق مدخلٍ أو ساحةٍ أو منطقة إنزال. يمنح الضيوف عند وصولهم ظلًّا من شمس الصيف، ويمنح المبنى معلمًا لا يُنسى. يناسب الفنادق والمنتجعات والمراكز الثقافية والمباني الحكومية.",
      "یەک پەردەی پەیکەرئاسا لە نێوان کۆڵەکەی بەرز و کێبڵەکاندا ڕاکێشراوە، بەسەر دەروازەیەک یان گۆڕەپانێک یان شوێنی دابەزاندندا بەرز و نزم دەبێتەوە. سێبەر لە خۆری هاوین دەبەخشێتە میوانانی تازەگەیشتوو، و نیشانەیەکی لەبیرنەکراو دەبەخشێتە باڵەخانەکە. گونجاوە بۆ هۆتێل و ڕیزۆرت و سەنتەرە ڕۆشنبیرییەکان و باڵەخانە حکومییەکان.",
    ),
    features: {
      en: ["Tall masts with tension cables", "High and low points in one membrane", "Suits entrances, plazas and drop-offs"],
      ar: ["أعمدة عالية مع كابلات شدّ", "نقاط عالية ومنخفضة في غشاءٍ واحد", "يناسب المداخل والساحات ومناطق الإنزال"],
      ckb: ["کۆڵەکەی بەرز لەگەڵ کێبڵی ڕاکێشان", "خاڵی بەرز و نزم لە یەک پەردەدا", "گونجاو بۆ دەروازە و گۆڕەپان و شوێنی دابەزاندن"],
    },
    specs: {
      en: [["Structure", "Steel masts and cables"], ["Covering", "Tensioned membrane"], ["Setting", "Entrances and plazas"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية وكابلات"], ["الغطاء", "غشاء مشدود"], ["الموقع", "المداخل والساحات"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی و کێبڵ"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "دەروازە و گۆڕەپان"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "grandstand-roof",
    sku: "SW-TEN-04",
    category: "tensile-structures",
    order: 43,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: [],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-grandstand.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Grandstand Roof", "سقف المدرّجات", "سەقفی سەکۆی تەماشاکەران"),
    tagline: tri("Cover for every seat in the stand", "غطاءٌ لكل مقعد في المدرّج", "داپۆشین بۆ هەموو کورسییەک لە سەکۆکەدا"),
    description: tri(
      "Steel trusses carry a tensioned membrane over spectator stands, keeping the summer sun off every row while leaving a clear view of the pitch. Spectators can watch afternoon matches and events in comfort. Built for stadiums, school and university sports grounds, and club facilities.",
      "تحمل جمالوناتٌ فولاذية غشاءً مشدودًا فوق مدرّجات المتفرجين، فتحجب شمس الصيف عن كل الصفوف وتُبقي رؤية الملعب واضحة. يتابع المتفرجون مباريات العصر والفعاليات براحة. مصمّم للملاعب والمنشآت الرياضية في المدارس والجامعات والأندية.",
      "خەرپای پۆڵایی پەردەیەکی ڕاکێشراو بەسەر سەکۆی تەماشاکەراندا هەڵدەگرن، خۆری هاوین لە هەموو ڕیزەکان دوور دەخەنەوە و دیمەنی یاریگاکە ڕوون دەهێڵنەوە. تەماشاکەران دەتوانن یارییەکانی ئێوارە و بۆنەکان بە ئاسوودەیی ببینن. بۆ یاریگا و مەیدانە وەرزشییەکانی قوتابخانە و زانکۆ و یانەکان دروست کراوە.",
    ),
    features: {
      en: ["Steel truss frame", "Shades every row of seating", "Clear view of the field"],
      ar: ["هيكل جمالونات فولاذية", "يظلّل كل صفوف المقاعد", "رؤية واضحة للملعب"],
      ckb: ["چوارچێوەی خەرپای پۆڵایی", "سێبەر بۆ هەموو ڕیزەکانی دانیشتن", "دیمەنی ڕوونی یاریگا"],
    },
    specs: {
      en: [["Structure", "Steel trusses"], ["Covering", "Tensioned membrane"], ["Setting", "Stadiums and sports grounds"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "جمالونات فولاذية"], ["الغطاء", "غشاء مشدود"], ["الموقع", "الملاعب والمنشآت الرياضية"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "خەرپای پۆڵایی"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "یاریگا و شوێنە وەرزشییەکان"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "multi-peak-canopy",
    sku: "SW-TEN-05",
    category: "tensile-structures",
    order: 44,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["hotel", "garden", "terrace", "pool"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-multi-peak.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Multi-Peak Canopy", "مظلة متعددة القمم", "سێبەری فرە لووتکە"),
    tagline: tri("A row of peaks over a gathering place", "صفٌّ من القمم فوق مكان التجمّع", "ڕیزێک لووتکە بەسەر شوێنی کۆبوونەوەدا"),
    description: tri(
      "A row of linked conical peaks on slender masts covers amphitheatres, event spaces and public gathering places. Visible from far away, it turns a hot, open square into a shaded place people want to stay. Suits parks, cultural venues, resorts and municipal projects.",
      "صفٌّ من القمم المخروطية المتصلة على أعمدةٍ رشيقة يغطي المدرّجات المفتوحة وأماكن الفعاليات والتجمّعات العامة. يُرى من بعيد، ويحوّل الساحة المفتوحة الحارّة إلى مكانٍ مظلّل يرغب الناس في البقاء فيه. يناسب الحدائق والأماكن الثقافية والمنتجعات ومشاريع البلديات.",
      "ڕیزێک لووتکەی قووچەکی بەیەکەوە بەستراو لەسەر کۆڵەکەی باریک، ئەمفیتیاتر و شوێنی بۆنەکان و شوێنی کۆبوونەوەی گشتی دادەپۆشێت. لە دوورەوە دەبینرێت، و گۆڕەپانێکی کراوەی گەرم دەگۆڕێت بۆ شوێنێکی سێبەردار کە خەڵک حەز دەکەن تێیدا بمێننەوە. گونجاوە بۆ پارک و شوێنە ڕۆشنبیرییەکان و ڕیزۆرت و پڕۆژەکانی شارەوانی.",
    ),
    features: {
      en: ["Linked conical peaks", "Slender masts", "Suits amphitheatres and event spaces"],
      ar: ["قمم مخروطية متصلة", "أعمدة رشيقة", "تناسب المدرّجات المفتوحة وأماكن الفعاليات"],
      ckb: ["لووتکەی قووچەکی بەیەکەوە بەستراو", "کۆڵەکەی باریک", "گونجاو بۆ ئەمفیتیاتر و شوێنی بۆنەکان"],
    },
    specs: {
      en: [["Structure", "Steel masts and cables"], ["Covering", "Tensioned membrane"], ["Setting", "Amphitheatres and events"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية وكابلات"], ["الغطاء", "غشاء مشدود"], ["الموقع", "المدرّجات والفعاليات"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی و کێبڵ"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "ئەمفیتیاتر و بۆنەکان"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "inverted-cone-canopy",
    sku: "SW-TEN-06",
    category: "tensile-structures",
    order: 45,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["garden", "pool", "rooftop", "hotel", "restaurant"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/tensile-inverted-cone.webp", width: 1024, height: 572 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Inverted Cone Canopy", "مظلة مخروطية مقلوبة", "سێبەری قووچەکی هەڵگەڕاوە"),
    tagline: tri("Shade that opens like a flower", "ظلٌّ يتفتّح كالزهرة", "سێبەرێک وەک گوڵ دەکرێتەوە"),
    description: tri(
      "Freestanding funnel-shaped shades on a single column, each finished with a steel ring at the rim. Set in groups across parks, plazas and public squares, they create pools of shade where people can stop and rest away from the summer heat.",
      "مظلاتٌ قائمة بذاتها على شكل قِمع فوق عمودٍ واحد، تنتهي كلٌّ منها بحلقةٍ فولاذية عند الحافة. توزَّع في مجموعات عبر الحدائق والساحات والميادين العامة، فتصنع بقعًا من الظل يتوقّف فيها الناس ويستريحون بعيدًا عن حرّ الصيف.",
      "سێبەری سەربەخۆ بە شێوەی قیف لەسەر یەک کۆڵەکە، کە هەریەکەیان بە ئەڵقەیەکی پۆڵایی لە لێوارەکەیدا تەواو دەبێت. بە کۆمەڵ لە پارک و گۆڕەپان و مەیدانە گشتییەکاندا دادەنرێن، و پەڵەی سێبەر دروست دەکەن کە خەڵک تێیدا ڕادەوەستن و لە گەرمای هاوین پشوو دەدەن.",
    ),
    features: {
      en: ["Single central column", "Steel ring at the rim", "Suits parks, plazas and public squares"],
      ar: ["عمود مركزي واحد", "حلقة فولاذية عند الحافة", "تناسب الحدائق والساحات العامة"],
      ckb: ["یەک کۆڵەکەی ناوەندی", "ئەڵقەی پۆڵایی لە لێوار", "گونجاو بۆ پارک و گۆڕەپان و مەیدانی گشتی"],
    },
    specs: {
      en: [["Structure", "Steel column and rim ring"], ["Covering", "Tensioned membrane"], ["Setting", "Parks and plazas"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "عمود وحلقة فولاذية"], ["الغطاء", "غشاء مشدود"], ["الموقع", "الحدائق والساحات"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکە و ئەڵقەی پۆڵایی"], ["داپۆشین", "پەردەی ڕاکێشراو"], ["شوێن", "پارک و گۆڕەپان"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  // --- Walkway shades -----------------------------------------------------
  // Added to the live catalogue by the 20261026120000_walkway_products
  // migration; kept here so a fresh database matches it. Built to measure for
  // each site, so no price, sizes or colours. The "walkway" setting is the
  // consultation path they are offered on (STRUCTURE_PATHS in lib/quiz.ts);
  // the louvre walkways also suit homes. Wide project photographs with their
  // dimensions recorded, framed whole.
  {
    slug: "continuous-walkway-canopy",
    sku: "SW-WLK-01",
    category: "walkway-shades",
    order: 50,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/walkway-continuous.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Continuous Walkway Canopy", "مظلة ممرات متصلة", "سێبەری ڕێڕەوی بەردەوام"),
    tagline: tri("Shade along every path", "ظلٌّ على امتداد كل ممر", "سێبەر بە درێژایی هەموو ڕێگایەک"),
    description: tri(
      "A continuous canopy that follows the paths through a residential community or campus, branching wherever the routes do, so residents, students and staff stay in the shade from door to door. Ideal for long routes where walking in the open summer sun is not an option.",
      "مظلةٌ متصلة تتبع الممرات عبر المجمّع السكني أو الحرم الجامعي، وتتفرّع حيثما تتفرّع الطرق، ليبقى السكان والطلاب والموظفون في الظل من بابٍ إلى باب. مثالية للمسارات الطويلة حيث لا يمكن المشي تحت شمس الصيف المكشوفة.",
      "سێبەرێکی بەردەوام کە بەدوای ڕێگاکانی ناو کۆمەڵگەیەکی نیشتەجێبوون یان کەمپەسێکدا دەڕوات و لە هەر شوێنێک ڕێگاکان لق ببنەوە ئەویش لق دەبێتەوە، بۆ ئەوەی دانیشتووان و قوتابیان و کارمەندان لە دەرگاوە بۆ دەرگا لە سێبەردا بمێننەوە. گونجاوە بۆ ڕێگا درێژەکان کە ڕۆیشتن لە ژێر خۆری کراوەی هاویندا ئەستەمە.",
    ),
    features: {
      en: ["Follows and branches with the paths", "Long continuous runs", "Suits residential communities and campuses"],
      ar: ["تتبع الممرات وتتفرّع معها", "امتدادات طويلة متصلة", "تناسب المجمّعات السكنية والحرم الجامعية"],
      ckb: ["بەدوای ڕێگاکاندا دەڕوات و لق دەبێتەوە", "ماوەی درێژی بەردەوام", "گونجاو بۆ کۆمەڵگەی نیشتەجێبوون و کەمپەس"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Tensioned shade fabric"], ["Setting", "Communities and campuses"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "قماش تظليل مشدود"], ["الموقع", "المجمّعات والحرم الجامعية"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "قوماشی سێبەری ڕاکێشراو"], ["شوێن", "کۆمەڵگە و کەمپەس"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "timber-look-louvre-walkway",
    sku: "SW-WLK-02",
    category: "walkway-shades",
    order: 51,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "BOTH",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/walkway-timber-louvre.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Timber-Look Louvre Walkway", "ممر بشرائح بمظهر خشبي", "ڕێڕەوی لووڤەری بە ڕووکاری دار"),
    tagline: tri("Warm slatted shade for garden paths", "ظلٌّ دافئ بالشرائح لممرات الحدائق", "سێبەری گەرمی شریتی بۆ ڕێگاکانی باخچە"),
    description: tri(
      "A louvred roof with a warm timber-look finish on slender posts, casting soft striped shade along park and garden paths. It brings the look of natural wood to the garden. Suits villas, parks, gardens and residential compounds.",
      "سقفٌ بشرائح بمظهرٍ خشبي دافئ على أعمدةٍ رشيقة، يلقي ظلًّا مخطّطًا ناعمًا على ممرات الحدائق والمتنزّهات، ويضفي على الحديقة مظهر الخشب الطبيعي. يناسب الفلل والمتنزّهات والحدائق والمجمّعات السكنية.",
      "سەقفێکی لووڤەری بە ڕووکارێکی گەرمی دار لەسەر کۆڵەکەی باریک، سێبەرێکی نەرمی هێڵدار دەخاتە سەر ڕێگاکانی پارک و باخچە، و ڕووخساری داری سروشتی دەبەخشێتە باخچەکە. گونجاوە بۆ ڤێلا و پارک و باخچە و کۆمەڵگە نیشتەجێبوونەکان.",
    ),
    features: {
      en: ["Louvred roof with a timber-look finish", "Slender posts", "Suits parks and garden paths"],
      ar: ["سقف بشرائح بمظهر خشبي", "أعمدة رشيقة", "يناسب الحدائق وممراتها"],
      ckb: ["سەقفی لووڤەری بە ڕووکاری دار", "کۆڵەکەی باریک", "گونجاو بۆ پارک و ڕێگاکانی باخچە"],
    },
    specs: {
      en: [["Structure", "Steel posts"], ["Covering", "Louvres, timber-look finish"], ["Setting", "Parks and gardens"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية"], ["الغطاء", "شرائح بمظهر خشبي"], ["الموقع", "الحدائق والمتنزّهات"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی"], ["داپۆشین", "لووڤەر بە ڕووکاری دار"], ["شوێن", "پارک و باخچە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "industrial-covered-walkway",
    sku: "SW-WLK-03",
    category: "walkway-shades",
    order: 52,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/walkway-industrial.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Industrial Covered Walkway", "ممر مسقوف صناعي", "ڕێڕەوی داپۆشراوی پیشەسازی"),
    tagline: tri("Practical cover from door to door", "غطاءٌ عملي من بابٍ إلى باب", "داپۆشینێکی کرداری لە دەرگاوە بۆ دەرگا"),
    description: tri(
      "Hard-wearing steel posts and a corrugated metal roof give practical cover between car parks and the entrances of warehouses, factories and logistics sites. Workers stay out of the summer sun and winter rain at every shift change. A durable, low-maintenance solution for industrial sites.",
      "أعمدةٌ فولاذية متينة وسقفٌ من الألواح المعدنية المموّجة توفّر غطاءً عمليًا بين مواقف السيارات ومداخل المستودعات والمصانع والمواقع اللوجستية. يبقى العمّال بعيدين عن شمس الصيف ومطر الشتاء عند كل تبديلٍ للورديات. حلٌّ متين وقليل الصيانة للمواقع الصناعية.",
      "کۆڵەکەی پۆڵایی بەرگەگر و سەقفێکی پەڕەی کانزایی شەپۆلی، داپۆشینێکی کرداری لە نێوان پارکینگ و دەروازەی کۆگا و کارگە و شوێنە لۆجستییەکاندا دابین دەکەن. کرێکاران لە هەموو گۆڕینێکی شەفتدا لە خۆری هاوین و بارانی زستان دوور دەمێننەوە. چارەسەرێکی بەرگەگر و کەم چاککردنەوەیە بۆ شوێنە پیشەسازییەکان.",
    ),
    features: {
      en: ["Corrugated metal roof", "Hard-wearing steel posts", "Suits warehouses and factories"],
      ar: ["سقف معدني مموّج", "أعمدة فولاذية متينة", "يناسب المستودعات والمصانع"],
      ckb: ["سەقفی کانزایی شەپۆلی", "کۆڵەکەی پۆڵایی بەرگەگر", "گونجاو بۆ کۆگا و کارگە"],
    },
    specs: {
      en: [["Structure", "Steel posts"], ["Covering", "Corrugated metal sheet"], ["Setting", "Warehouses and factories"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية"], ["الغطاء", "ألواح معدنية مموّجة"], ["الموقع", "المستودعات والمصانع"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی"], ["داپۆشین", "پەڕەی کانزایی شەپۆلی"], ["شوێن", "کۆگا و کارگە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "white-louvre-walkway",
    sku: "SW-WLK-04",
    category: "walkway-shades",
    order: 53,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "BOTH",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/walkway-white-louvre.webp", width: 1024, height: 576 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("White Louvre Walkway", "ممر بشرائح بيضاء", "ڕێڕەوی لووڤەری سپی"),
    tagline: tri("A bright, cool passage between buildings", "ممرّ مضيء وبارد بين المباني", "ڕێڕەوێکی ڕووناک و فێنک لە نێوان باڵەخانەکاندا"),
    description: tri(
      "A white louvred roof on slim columns lets soft light filter through while keeping the strong sun off — a calm, elegant passage connecting the buildings of hotels, resorts and private residences. Its light colour reflects much of the sun's heat.",
      "سقفٌ أبيض بشرائح على أعمدةٍ نحيلة يسمح بتسلّل ضوءٍ ناعم ويحجب الشمس القوية — ممرٌّ هادئ وأنيق يربط مباني الفنادق والمنتجعات والمساكن الخاصة. ويعكس لونه الفاتح جزءًا كبيرًا من حرارة الشمس.",
      "سەقفێکی لووڤەری سپی لەسەر کۆڵەکەی باریک ڕێگە دەدات ڕووناکییەکی نەرم تێبپەڕێت و خۆری بەهێز ڕادەگرێت — ڕێڕەوێکی ئارام و جوان کە باڵەخانەکانی هۆتێل و ڕیزۆرت و نیشتەجێگا تایبەتەکان بە یەکەوە دەبەستێتەوە. ڕەنگە کاڵەکەی بەشێکی زۆری گەرمای خۆر دەداتەوە.",
    ),
    features: {
      en: ["White louvred roof", "Light filters through, sun stays out", "Suits hotels, resorts and residences"],
      ar: ["سقف أبيض بشرائح", "يمرّ الضوء وتُحجب الشمس", "يناسب الفنادق والمنتجعات والمساكن"],
      ckb: ["سەقفی لووڤەری سپی", "ڕووناکی تێدەپەڕێت و خۆر ڕادەگیرێت", "گونجاو بۆ هۆتێل و ڕیزۆرت و نیشتەجێگا"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Louvred roof"], ["Setting", "Hotels and residences"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "سقف بشرائح"], ["الموقع", "الفنادق والمساكن"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "سەقفی لووڤەری"], ["شوێن", "هۆتێل و نیشتەجێگا"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "sail-walkway-shade",
    sku: "SW-WLK-05",
    category: "walkway-shades",
    order: 54,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    // The path, then the owner's close-up of a sail's corner fitting and an
    // aerial view of the row — taller shapes, fitted whole inside the frame.
    images: [
      { url: "/media/walkway-sails.webp", width: 1024, height: 576 },
      { url: "/media/walkway-sails-fitting.jpg", width: 664, height: 425 },
      { url: "/media/walkway-sails-aerial.jpg", width: 665, height: 502 },
    ],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Sail Walkway Shade", "مظلة ممرات بالأشرعة", "سێبەری ڕێڕەو بە چارۆکە"),
    tagline: tri("Sails in a row along the path", "أشرعة متتالية على امتداد الممر", "چارۆکەی ڕیزکراو بە درێژایی ڕێگاکە"),
    description: tri(
      "Overlapping fabric sails stretched between tall posts shade a long path in a light, open rhythm. Air moves freely between the sails, keeping the path comfortable on hot days. An attractive, open way to cover routes across campuses, parks and public grounds.",
      "أشرعةٌ قماشية متداخلة مشدودة بين أعمدةٍ عالية تظلّل ممرًّا طويلًا بإيقاعٍ خفيف ومفتوح. يتحرّك الهواء بحرية بين الأشرعة، فيبقى الممر مريحًا في الأيام الحارّة. طريقةٌ جذّابة ومفتوحة لتغطية المسارات في الحرم الجامعية والمتنزّهات والمساحات العامة.",
      "چارۆکەی قوماشی یەکتربڕ کە لە نێوان کۆڵەکەی بەرزدا ڕاکێشراون، ڕێگایەکی درێژ بە ڕیتمێکی سووک و کراوە سێبەر دەکەن. هەوا بە ئازادی لە نێوان چارۆکەکاندا دەجووڵێت، بۆیە ڕێگاکە لە ڕۆژە گەرمەکاندا ئاسوودە دەمێنێتەوە. ڕێگایەکی سەرنجڕاکێش و کراوەیە بۆ داپۆشینی ڕێگاکانی کەمپەس و پارک و شوێنە گشتییەکان.",
    ),
    features: {
      en: ["Overlapping sails along the path", "Tall steel posts", "Suits campuses and public grounds"],
      ar: ["أشرعة متداخلة على طول الممر", "أعمدة فولاذية عالية", "تناسب الحرم الجامعية والمساحات العامة"],
      ckb: ["چارۆکەی یەکتربڕ بە درێژایی ڕێگا", "کۆڵەکەی پۆڵایی بەرز", "گونجاو بۆ کەمپەس و شوێنی گشتی"],
    },
    specs: {
      en: [["Structure", "Steel posts"], ["Covering", "Tensioned shade sails"], ["Setting", "Campuses and public grounds"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "أعمدة فولاذية"], ["الغطاء", "أشرعة تظليل مشدودة"], ["الموقع", "الحرم الجامعية والمساحات العامة"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "کۆڵەکەی پۆڵایی"], ["داپۆشین", "چارۆکەی سێبەری ڕاکێشراو"], ["شوێن", "کەمپەس و شوێنی گشتی"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
  {
    slug: "steel-frame-covered-walkway",
    sku: "SW-WLK-06",
    category: "walkway-shades",
    order: 55,
    price: null,
    availability: "MADE_TO_ORDER",
    style: "MODERN",
    segment: "COMMERCIAL",
    useCases: ["walkway"],
    coverageM2: 0,
    priceTier: 3,
    images: [{ url: "/media/walkway-steel-frame.jpg", width: 2000, height: 1125 }],
    colors: [],
    sizes: [],
    materials: [],
    name: tri("Steel Frame Covered Walkway", "ممر مسقوف بهيكل فولاذي", "ڕێڕەوی داپۆشراو بە چوارچێوەی پۆڵایی"),
    tagline: tri("Solid cover with clean lines", "غطاءٌ صلب بخطوطٍ نظيفة", "داپۆشینی پتەو بە هێڵی پاک"),
    description: tri(
      "A steel frame with a solid panel roof and built-in rainwater downpipes links buildings across a campus, keeping off the summer sun and winter rain alike. Clean, durable and low-maintenance — ideal for schools, hospitals, universities and government buildings.",
      "هيكلٌ فولاذي بسقفٍ من الألواح الصلبة ومواسير مدمجة لتصريف مياه الأمطار، يربط المباني عبر الحرم ويحمي من شمس الصيف ومطر الشتاء على حدٍّ سواء. نظيفٌ ومتين وقليل الصيانة — مثالي للمدارس والمستشفيات والجامعات والمباني الحكومية.",
      "چوارچێوەیەکی پۆڵایی بە سەقفی پانێڵی پتەو و بۆری تێکەڵکراوی ئاوی باران، باڵەخانەکانی ناو کەمپەسێک بە یەکەوە دەبەستێتەوە و بە هەمان شێوە لە خۆری هاوین و بارانی زستان دەپارێزێت. پاک و بەرگەگر و کەم چاککردنەوە — گونجاوە بۆ قوتابخانە و نەخۆشخانە و زانکۆ و باڵەخانە حکومییەکان.",
    ),
    features: {
      en: ["Solid panel roof", "Built-in rainwater downpipes", "Suits schools, hospitals and campuses"],
      ar: ["سقف من ألواح صلبة", "مواسير مدمجة لتصريف الأمطار", "يناسب المدارس والمستشفيات والحرم الجامعية"],
      ckb: ["سەقفی پانێڵی پتەو", "بۆری ئاوی بارانی تێکەڵکراو", "گونجاو بۆ قوتابخانە و نەخۆشخانە و کەمپەس"],
    },
    specs: {
      en: [["Structure", "Steel frame"], ["Covering", "Solid roof panels"], ["Setting", "Schools and hospitals"], ["Size", "Made to measure"]],
      ar: [["الهيكل", "هيكل فولاذي"], ["الغطاء", "ألواح سقف صلبة"], ["الموقع", "المدارس والمستشفيات"], ["المقاس", "حسب المقاس"]],
      ckb: [["چوارچێوە", "چوارچێوەی پۆڵایی"], ["داپۆشین", "پانێڵی سەقفی پتەو"], ["شوێن", "قوتابخانە و نەخۆشخانە"], ["قەبارە", "بەپێی پێوانە"]],
    },
  },
];

const GALLERY = [
  { url: "/media/scene-villa.svg", tag: "villa", span: "WIDE", caption: tri("Private villa terrace", "تراس فيلا خاصة", "تەراسی ڤێلای تایبەت"), location: tri("Residential", "سكني", "نیشتەجێبوون") },
  { url: "/media/scene-poolside.svg", tag: "pool", span: "NORMAL", caption: tri("Pool deck, morning", "سطح المسبح صباحًا", "سەکۆی مەلەوانگە، بەیانی"), location: tri("Residential", "سكني", "نیشتەجێبوون") },
  { url: "/media/scene-restaurant.svg", tag: "restaurant", span: "TALL", caption: tri("Dining without walls", "طعامٌ بلا جدران", "نانخواردن بەبێ دیوار"), location: tri("Hospitality", "ضيافة", "میوانداری") },
  { url: "/media/scene-hotel.svg", tag: "hotel", span: "NORMAL", caption: tri("Hotel terrace, continuous cover", "تراس فندق بغطاءٍ متصل", "تەراسی هۆتێل، داپۆشینی بەردەوام"), location: tri("Hospitality", "ضيافة", "میوانداری") },
  { url: "/media/scene-rooftop.svg", tag: "rooftop", span: "WIDE", caption: tri("Rooftop at dusk", "سطح علوي عند الغسق", "سەربان لە کاتی ئێواران"), location: tri("Commercial", "تجاري", "بازرگانی") },
  { url: "/media/scene-garden.svg", tag: "garden", span: "NORMAL", caption: tri("Planted garden", "حديقة مزروعة", "باخچەی چاندراو"), location: tri("Residential", "سكني", "نیشتەجێبوون") },
  { url: "/media/scene-aerial.svg", tag: "hotel", span: "NORMAL", caption: tri("Terrace from above", "التراس من الأعلى", "تەراس لە سەرەوە"), location: tri("Hospitality", "ضيافة", "میوانداری") },
  { url: "/media/scene-night.svg", tag: "restaurant", span: "NORMAL", caption: tri("After service", "بعد الخدمة", "دوای خزمەت"), location: tri("Hospitality", "ضيافة", "میوانداری") },
  { url: "/media/portrait-terrace.svg", tag: "villa", span: "TALL", caption: tri("Terrace, late light", "تراس في ضوءٍ متأخر", "تەراس، ڕووناکی درەنگ"), location: tri("Residential", "سكني", "نیشتەجێبوون") },
  { url: "/media/detail-fabric.svg", tag: "villa", span: "NORMAL", caption: tri("Canopy underside", "باطن المظلّة", "ژێری چەتر"), location: tri("Detail", "تفصيل", "وردەکاری") },
  { url: "/media/detail-frame.svg", tag: "pool", span: "NORMAL", caption: tri("Frame junction", "وصلة الهيكل", "بەندی چوارچێوە"), location: tri("Detail", "تفصيل", "وردەکاری") },
  { url: "/media/hero-pool.svg", tag: "pool", span: "WIDE", caption: tri("Reflected light", "ضوءٌ منعكس", "ڕووناکی ڕەنگدراوە"), location: tri("Residential", "سكني", "نیشتەجێبوون") },
];

// ---------------------------------------------------------------------------

async function main() {
  console.log("→ Seeding Saiwan (sample content)");

  // Colours
  for (const [index, color] of COLORS.entries()) {
    await prisma.color.upsert({
      where: { slug: color.slug },
      update: { hex: color.hex, order: index },
      create: {
        slug: color.slug,
        hex: color.hex,
        order: index,
        translations: { create: LOCALES.map((locale) => ({ locale, name: color.name[locale] })) },
      },
    });
  }

  // Sizes
  for (const [index, size] of SIZES.entries()) {
    await prisma.size.upsert({
      where: { slug: size.slug },
      update: { label: size.label, shape: size.shape, order: index },
      create: { ...size, order: index },
    });
  }

  // Materials
  for (const [index, material] of MATERIALS.entries()) {
    await prisma.material.upsert({
      where: { slug: material.slug },
      update: { order: index },
      create: {
        slug: material.slug,
        order: index,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            name: material.name[locale],
            description: material.description[locale],
          })),
        },
      },
    });
  }

  // Categories
  for (const [index, category] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { order: index, imageUrl: category.image },
      create: {
        slug: category.slug,
        order: index,
        imageUrl: category.image,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            name: category.name[locale],
            tagline: category.tagline[locale],
            description: category.description[locale],
            metaTitle: `${category.name[locale]} · Saiwan`,
            metaDescription: category.description[locale].slice(0, 155),
          })),
        },
      },
    });
  }

  const categoryIds = Object.fromEntries(
    (await prisma.category.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]),
  );
  const colorIds = Object.fromEntries(
    (await prisma.color.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]),
  );
  const sizeIds = Object.fromEntries(
    (await prisma.size.findMany({ select: { id: true, slug: true } })).map((s) => [s.slug, s.id]),
  );
  const materialIds = Object.fromEntries(
    (await prisma.material.findMany({ select: { id: true, slug: true } })).map((m) => [m.slug, m.id]),
  );

  // Products
  for (const product of PRODUCTS) {
    const data = {
      sku: product.sku,
      categoryId: categoryIds[product.category],
      status: product.status ?? "PUBLISHED",
      isFeatured: product.featured ?? false,
      order: product.order,
      price: product.price,
      showPrice: product.showPrice ?? false,
      availability: product.availability ?? "IN_STOCK",
      leadTimeDays: product.leadTimeDays ?? null,
      style: product.style,
      segment: product.segment,
      useCases: JSON.stringify(product.useCases),
      coverageM2: product.coverageM2,
      priceTier: product.priceTier,
    };

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { slug: product.slug, ...data },
      select: { id: true },
    });

    // Translations, images and links are rewritten wholesale so re-seeding is
    // idempotent without accumulating duplicates.
    await prisma.productTranslation.deleteMany({ where: { productId: record.id } });
    await prisma.productTranslation.createMany({
      data: LOCALES.map((locale) => ({
        productId: record.id,
        locale,
        name: product.name[locale],
        tagline: product.tagline[locale],
        description: product.description[locale],
        features: JSON.stringify(product.features[locale]),
        specs: JSON.stringify(product.specs[locale].map(([label, value]) => ({ label, value }))),
        metaTitle: `${product.name[locale]} · Saiwan`,
        metaDescription: product.tagline[locale],
      })),
    });

    await prisma.productImage.deleteMany({ where: { productId: record.id } });
    await prisma.productImage.createMany({
      data: product.images.map((image, index) => {
        // An image that names a colourway is bound to it, which is what makes
        // picking a swatch swap the photograph — and picking a photograph
        // select the swatch. Nothing is inferred from position any more: a
        // guess about which image showed which colour was only ever right by
        // accident, and it is wrong the moment a product has one photograph.
        const { url, color, width, height } = typeof image === "string" ? { url: image } : image;
        return {
          productId: record.id,
          url,
          alt: `${product.name.en} — ${index === 0 ? "primary view" : `view ${index + 1}`}`,
          order: index,
          colorId: color ? (colorIds[color] ?? null) : null,
          width: width ?? null,
          height: height ?? null,
        };
      }),
    });

    await prisma.productColor.deleteMany({ where: { productId: record.id } });
    await prisma.productColor.createMany({
      data: product.colors.map((slug, index) => ({
        productId: record.id,
        colorId: colorIds[slug],
        order: index,
      })),
    });

    await prisma.productSize.deleteMany({ where: { productId: record.id } });
    if (product.sizes.length) {
      await prisma.productSize.createMany({
        data: product.sizes.map((slug, index) => ({
          productId: record.id,
          sizeId: sizeIds[slug],
          order: index,
        })),
      });
    }

    await prisma.productMaterial.deleteMany({ where: { productId: record.id } });
    await prisma.productMaterial.createMany({
      data: product.materials.map((slug) => ({ productId: record.id, materialId: materialIds[slug] })),
    });
  }

  // Accessory links (second pass — every product now exists).
  const productIds = Object.fromEntries(
    (await prisma.product.findMany({ select: { id: true, slug: true } })).map((p) => [p.slug, p.id]),
  );
  for (const product of PRODUCTS) {
    if (!product.accessories?.length) continue;
    await prisma.productAccessory.deleteMany({ where: { productId: productIds[product.slug] } });
    await prisma.productAccessory.createMany({
      data: product.accessories
        .filter((slug) => productIds[slug])
        .map((slug, index) => ({
          productId: productIds[product.slug],
          accessoryId: productIds[slug],
          order: index,
        })),
    });
  }

  // Gallery
  await prisma.galleryItemTranslation.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  for (const [index, item] of GALLERY.entries()) {
    await prisma.galleryItem.create({
      data: {
        url: item.url,
        alt: item.caption.en,
        tag: item.tag,
        span: item.span,
        order: index,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            caption: item.caption[locale],
            location: item.location[locale],
          })),
        },
      },
    });
  }

  // Home page media — editable from the admin (Content) without a deploy.
  const homeMedia = {
    heroPlanes: {
      backdrop: "/media/hero-terrace.webp",
      mid: "/media/hero-umbrella.webp",
      near: "/media/hero-planting.webp",
    },
    quizImage: "/media/hero-dusk.svg",
  };
  for (const locale of LOCALES) {
    await prisma.contentBlock.upsert({
      where: { key_locale: { key: "home.media", locale } },
      update: { value: JSON.stringify(homeMedia) },
      create: { key: "home.media", locale, value: JSON.stringify(homeMedia) },
    });
  }

  // Settings
  const settings: Record<string, string> = {
    "contact.whatsapp": process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    "contact.email": "hello@saiwan.example",
    "contact.address": "",
    "brand.currency": "USD",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  // Bootstrap administrator
  const email = (process.env.ADMIN_EMAIL ?? "admin@saiwan.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024";
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", isActive: true },
    create: {
      email,
      passwordHash: await hashPassword(password),
      name: "Saiwan Administrator",
      role: "ADMIN",
      locale: "en",
    },
  });

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    gallery: await prisma.galleryItem.count(),
  };

  console.log(`✓ ${counts.categories} categories, ${counts.products} products, ${counts.gallery} gallery items`);
  console.log(`✓ Admin: ${email}`);
  console.log("  Sample catalogue content — replace from /admin before launch.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
