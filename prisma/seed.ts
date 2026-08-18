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
];

const COLORS = [
  { slug: "ivory", hex: "#EDE6D8", name: tri("Ivory", "عاجي", "عاجی") },
  { slug: "sand", hex: "#D6C7AC", name: tri("Sand", "رملي", "لمی") },
  { slug: "taupe", hex: "#A2968A", name: tri("Taupe", "بني رمادي", "قاوەیی خۆڵەمێشی") },
  { slug: "olive", hex: "#6A6C54", name: tri("Olive", "زيتوني", "زەیتوونی") },
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
  images: string[];
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
    images: ["/media/product-aria.svg", "/media/product-aria-alt.svg", "/media/scene-villa.svg", "/media/detail-frame.svg"],
    colors: ["ivory", "sand", "taupe", "charcoal"],
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
    images: ["/media/product-orbis.svg", "/media/product-orbis-alt.svg", "/media/scene-garden.svg"],
    colors: ["ivory", "sand", "olive", "terracotta"],
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
    images: ["/media/product-meridian.svg", "/media/product-meridian-alt.svg", "/media/scene-hotel.svg", "/media/scene-aerial.svg"],
    colors: ["ivory", "taupe", "charcoal"],
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
    slug: "cala",
    sku: "SW-CAL",
    category: "poolside",
    featured: true,
    order: 4,
    price: 1980,
    showPrice: true,
    style: "RESORT",
    segment: "BOTH",
    useCases: ["pool", "hotel", "terrace"],
    coverageM2: 12,
    priceTier: 2,
    images: ["/media/product-cala.svg", "/media/product-cala-alt.svg", "/media/scene-poolside.svg"],
    colors: ["ivory", "sand", "taupe"],
    sizes: ["300-square", "350-round", "400-300-rect"],
    materials: ["anodised-aluminium", "solution-dyed-acrylic", "stainless-fixings"],
    accessories: ["base-granite", "cover-canopy"],
    name: tri("Cala", "كالا", "کالا"),
    tagline: tri("Drawn for water and reflected light", "مرسومة للماء والضوء المنعكس", "بۆ ئاو و ڕووناکی ڕەنگدراوە کێشراوە"),
    description: tri(
      "A poolside piece with a tilting canopy, specified end to end in stainless. The underside is finished in a soft ivory that bounces reflected light back down rather than glaring.",
      "قطعة لحافة المسبح بمظلّةٍ قابلة للإمالة، مُحدَّدة بالكامل بالستانلس. باطنها بتشطيبٍ عاجيّ ناعم يعيد الضوء المنعكس إلى الأسفل بدل الوهج.",
      "بەرهەمێکی کەناری مەلەوانگە بە چەترێکی لارکەرەوە، سەرتاسەری بە ستەینلێس دیاری کراوە. ژێرەوەی بە عاجییەکی نەرم تەواو کراوە کە ڕووناکی ڕەنگدراوە بەرەو خوارەوە دەگەڕێنێتەوە لە جیاتی بریسکەدانەوە.",
    ),
    features: {
      en: ["Canopy tilts to 30° on a locking collar", "A4 stainless fixings throughout", "Ivory underside to soften reflected glare", "Base weighted for open, exposed decks"],
      ar: ["إمالة القماش حتى ٣٠° على طوقٍ قافل", "مثبّتات ستانلس A4 في كل موضع", "باطن عاجيّ لتخفيف الوهج المنعكس", "قاعدة موزونة للأسطح المكشوفة"],
      ckb: ["چەترەکە تا ٣٠° لار دەبێتەوە لەسەر ملوانکەیەکی قوفڵ", "بەندەری ستەینلێسی A4 لە هەموو شوێنێک", "ژێرەوەی عاجی بۆ نەرمکردنی بریسکەی ڕەنگدراوە", "بنکەی قورس بۆ سەکۆی کراوە و بەربەرەکانێ"],
    },
    specs: {
      en: [
        ["Frame", "Anodised aluminium"],
        ["Canopy", "Solution-dyed acrylic, 300 g/m²"],
        ["Tilt", "0–30°, locking collar"],
        ["Fixings", "A4 stainless"],
        ["Base", "60 kg granite recommended"],
      ],
      ar: [
        ["الهيكل", "ألمنيوم مؤكسد"],
        ["القماش", "أكريليك مصبوغ في المحلول، ٣٠٠ غ/م²"],
        ["الإمالة", "٠–٣٠°، طوق قافل"],
        ["المثبّتات", "ستانلس A4"],
        ["القاعدة", "يُوصى بغرانيت ٦٠ كغ"],
      ],
      ckb: [
        ["چوارچێوە", "ئەلەمینیۆمی ئەنۆدایزکراو"],
        ["قوماش", "ئەکریلیکی ڕەنگکراو لە چارەسەردا، ٣٠٠ گ/م²"],
        ["لاربوونەوە", "٠–٣٠°، ملوانکەی قوفڵ"],
        ["بەندەرەکان", "ستەینلێسی A4"],
        ["بنکە", "گرانیتی ٦٠ کگم پێشنیار دەکرێت"],
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
    images: ["/media/product-atrium.svg", "/media/product-atrium-alt.svg", "/media/scene-rooftop.svg"],
    colors: ["charcoal", "taupe", "ivory"],
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
    images: ["/media/product-solis.svg", "/media/product-solis-alt.svg", "/media/scene-garden.svg"],
    colors: ["olive", "terracotta", "sand", "ivory"],
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
    images: ["/media/product-vela.svg", "/media/product-vela-alt.svg", "/media/scene-night.svg"],
    colors: ["charcoal", "taupe", "ivory"],
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
    colors: ["charcoal"],
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
    colors: ["taupe", "charcoal"],
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
    colors: ["charcoal"],
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
      data: product.images.map((url, index) => ({
        productId: record.id,
        url,
        alt: `${product.name.en} — ${index === 0 ? "primary view" : `view ${index + 1}`}`,
        order: index,
        // Bind the second image to the first colourway so the configurator has
        // something to swap to out of the box.
        colorId: index === 1 && product.colors[1] ? colorIds[product.colors[1]] : null,
      })),
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
    heroImage: "/media/hero-terrace.svg",
    heroImageMobile: "/media/portrait-terrace.svg",
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
