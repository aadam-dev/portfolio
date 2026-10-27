export type ProjectCategory =
  | "edtech"
  | "fintech"
  | "ecommerce"
  | "proptech"
  | "restaurant"
  | "sports"
  | "corporate"
  | "automotive"
  | "desktop"
  | "healthcare"
  | "hospitality"
  | "fashion"
  | "community"
  | "creative"
  | "enterprise";

export interface ProjectScreen {
  id: string;
  label: string;
}

export interface ProjectOutcome {
  value: string;
  label: string;
}

export interface CaseStudyGalleryItem {
  /** Screen id to pull the image from screenImages, or an explicit src. */
  screen?: string;
  src?: string;
  caption: string;
}

/** Long-form case-study narrative. Optional: the case study degrades gracefully without it. */
export interface ProjectStudy {
  challenge: string;
  approach: string;
  result: string;
  /** Headline metrics rendered as a strip; falls back to `outcomes` when omitted. */
  metrics?: ProjectOutcome[];
  gallery?: CaseStudyGalleryItem[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  org?: string;
}

/** Silent live recording of the real system UI, played on the case study. */
export interface ProjectWalkthrough {
  id: string;
  title: string;
  caption: string;
  /** Path under /public, e.g. /walkthroughs/an-nur-laundry.mp4 */
  src: string;
  /** Poster frame (reuse a screen capture under /public). */
  poster: string;
  /** Display duration, e.g. "2:23". */
  duration: string;
}

export interface Project {
  id: string;
  /** URL slug for /work/[slug]. Defaults to id. */
  slug?: string;
  name: string;
  tagline: string;
  description: string;
  /** Localized overrides (English is the base; fall back to it when absent). */
  taglineFr?: string;
  taglineAr?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  /** Optional long-form case-study narrative. */
  study?: ProjectStudy;
  role?: string;
  /** Year / year-range, used for the editorial index line. */
  year?: string;
  /** Location / region, used for the editorial index line. */
  location?: string;
  /** Short services tag list used in case study. */
  services?: string[];
  impact?: string[];
  outcomes?: ProjectOutcome[];
  testimonial?: ProjectTestimonial;
  category: ProjectCategory;
  categoryLabel: string;
  stack: string[];
  screens: ProjectScreen[];
  accentColor: string;
  accentGlow: string;
  featured?: boolean;
  flagship?: boolean;
  /** Temporarily hidden from all listings (still routable directly). */
  hidden?: boolean;
  isLead?: boolean;
  imagePath?: string;
  /**
   * Real screenshots of the actual app, keyed by screen id (paths under /public).
   * When present for a screen, previews render the real capture instead of the coded mockup.
   */
  screenImages?: Record<string, string>;
  /** Screen to open first in flagship/preview contexts (defaults to the first screen). */
  defaultScreen?: string;
  /** Optional phone-framed captures rendered as an "On mobile" strip in the case study. */
  mobileShowcase?: { src: string; label: string }[];
  /** When set, the case study exposes a Live site tab that iframes the real project. */
  liveBaseUrl?: string;
  /** Map screen id → path (e.g. landing → "/", courses → "/courses"). Used with liveBaseUrl. */
  liveScreenPaths?: Record<string, string>;
  /** Set false when the deploy sends X-Frame-Options/frame-ancestors DENY: hides the Live tab, keeps the outbound link. */
  liveEmbeddable?: boolean;
  /** Silent live walkthroughs of the real system, shown on the case study. */
  walkthroughs?: ProjectWalkthrough[];
}

export function projectSlug(p: Project): string {
  return p.slug ?? p.id;
}

/** Pick locale-specific tagline/description, falling back to English. */
export function localizedProject(
  p: Project,
  locale: string
): { tagline: string; description: string } {
  const pick = (base: string, fr?: string, ar?: string) =>
    locale === "fr" ? fr ?? base : locale === "ar" ? ar ?? base : base;
  return {
    tagline: pick(p.tagline, p.taglineFr, p.taglineAr),
    description: pick(p.description, p.descriptionFr, p.descriptionAr),
  };
}

/** Projects shown in listings (index, flagship, sitemap). */
export const visibleProjects = () => projects.filter((p) => !p.hidden);

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => projectSlug(p) === slug);
}

export const projects: Project[] = [
  {
    id: "koyi",
    name: "Kōyi",
    tagline: "Exam pathways, schools and Madrasah",
    taglineFr: "Filières d'examen, écoles et madrasa",
    taglineAr: "مسارات الامتحانات والمدارس والمدرسة",
    imagePath: "/images/projects/koyi.webp",
    year: "2024",
    location: "Ghana · West Africa",
    services: ["Product strategy", "Information architecture", "Full-stack engineering"],
    description:
      "Learning platform for Ghana and West Africa. The Knowledge Hub explains BECE, WASSCE, CSSPS, JAMB, BAC, university and career routes, with a school explorer and grade tools. Madrasah covers Islamic studies subjects. English, French and Arabic.",
    descriptionFr:
      "Plateforme d'apprentissage pour le Ghana et l'Afrique de l'Ouest. Le Knowledge Hub explique les filières BECE, WASSCE, CSSPS, JAMB, BAC, université et carrière, avec un explorateur d'écoles et des outils de notes. La madrasa couvre les matières d'études islamiques. Anglais, français et arabe.",
    descriptionAr:
      "منصّة تعلّم لغانا وغرب أفريقيا. يشرح مركز المعرفة مسارات BECE وWASSCE وCSSPS وJAMB وBAC والجامعة والمهنة، مع مستكشف مدارس وأدوات للدرجات. وتغطي المدرسة مواد الدراسات الإسلامية. بالإنجليزية والفرنسية والعربية.",
    study: {
      challenge:
        "Learners preparing for BECE, WASSCE, JAMB or a madrasah were piecing the next step together from scattered PDFs, WhatsApp forwards and school rumour. The routes exist. A single place that explains them, in the languages people actually study in, did not.",
      approach:
        "We built the public layer around the decisions, not a course grid. The Knowledge Hub holds pathway guides (BECE, WASSCE, CSSPS placement, JAMB, BAC, university, career), a school explorer, and grade tools, each marked as planning information rather than official advice. Madrasah sits beside it: Quran, Arabic, Aqeedah, Fiqh and the rest of the subjects. The interface is English, French and Arabic.",
      result:
        "A live hub students can open before they pick a school or a subject: seven exam and career pathways, a filterable school explorer, grade tools, and a Madrasah with ten subjects. Course lessons sit behind sign-in and are still being filled in.",
    },
    role: "Product strategist & full‑stack developer",
    impact: [
      "Turned exam routes across Ghana and West Africa into guides a student can read without a counsellor in the room.",
      "Added a school explorer and grade tools next to the pathway pages, with clear limits on what is official advice.",
      "Shipped Madrasah as its own subject catalogue, separate from the exam pathways.",
    ],
    outcomes: [
      { value: "7", label: "Exam pathways" },
      { value: "10", label: "Madrasah subjects" },
      { value: "3", label: "Languages" },
    ],
    category: "edtech",
    categoryLabel: "EdTech · Learning",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    accentColor: "#0d9488",
    accentGlow: "rgba(13, 148, 136, 0.15)",
    featured: true,
    flagship: true,
    defaultScreen: "hub",
    screens: [
      { id: "hub", label: "Knowledge Hub" },
      { id: "pathway", label: "WASSCE" },
      { id: "schools", label: "Schools" },
      { id: "madrasah", label: "Madrasah" },
    ],
    screenImages: {
      hub: "/previews/koyi/hub.webp",
      pathway: "/previews/koyi/pathway.webp",
      schools: "/previews/koyi/schools.webp",
      madrasah: "/previews/koyi/madrasah.webp",
    },
    liveBaseUrl: "https://koyi-web.vercel.app",
    liveScreenPaths: {
      hub: "/en/hub",
      pathway: "/en/hub/pathways/wassce",
      schools: "/en/hub/schools",
      madrasah: "/en/madrasah",
    },
  },
  {
    id: "munamuse",
    name: "Muna Muse",
    tagline: "African print, finished on WhatsApp",
    taglineFr: "Tissu africain, commande sur WhatsApp",
    taglineAr: "أقمشة أفريقية، والطلب يكتمل على واتساب",
    imagePath: "/images/projects/munamuse.webp",
    year: "2026",
    location: "New York · US & Ghana",
    services: ["Storefront design", "Dual-market pricing", "Full-stack engineering"],
    outcomes: [
      { value: "USD + GHS", label: "Prices set per market" },
      { value: "WhatsApp", label: "The bag is the order" },
    ],
    description:
      "WhatsApp-first storefront for Muna Muse: adire, batik and ankara, cut into maxi dresses, kaftans, boubous and patchwork, hand-picked in West Africa and shipped from New York to the US and Ghana. A shopper builds a bag on the site. Send turns the whole order into a WhatsApp message. There is no card checkout. Every piece carries a dollar price and a cedi price, each set for its market rather than converted live.",
    descriptionFr:
      "Boutique WhatsApp pour Muna Muse : adire, batik et ankara, en robes longues, kaftans, boubous et patchwork, choisis en Afrique de l'Ouest et expédiés depuis New York vers les États-Unis et le Ghana. Le sac se transforme en message WhatsApp. Pas de paiement par carte. Chaque pièce a un prix en dollars et un prix en cedis, fixé pour son marché.",
    descriptionAr:
      "واجهة متجر عبر واتساب لـ Muna Muse: أديري وباتيك وأنقرة، فساتين ماكسي وقفطان وبوبو ورقع، تُختار في غرب أفريقيا وتُشحن من نيويورك إلى الولايات المتحدة وغانا. تتحوّل الحقيبة إلى رسالة واتساب. لا دفع بالبطاقة. لكل قطعة سعر بالدولار وسعر بالسيدي، يُحدَّد لسوقه.",
    role: "Storefront design & full-stack build",
    impact: [
      "Designed a shop where the bag is the order: sizing, shipping and payment finish in the WhatsApp thread.",
      "Kept USD and GHS as two real prices, so a Ghana order is not a converted New York price.",
    ],
    category: "fashion",
    categoryLabel: "Fashion · Storefront",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Vercel Blob"],
    accentColor: "#C08552",
    accentGlow: "rgba(192, 133, 82, 0.16)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "shop", label: "Shop" },
      { id: "product", label: "Piece" },
      { id: "about", label: "Story" },
    ],
    screenImages: {
      landing: "/previews/munamuse/landing.webp",
      shop: "/previews/munamuse/shop.webp",
      product: "/previews/munamuse/product.webp",
      about: "/previews/munamuse/about.webp",
    },
    liveBaseUrl: "https://temporarymunamusedomain.vercel.app",
    liveScreenPaths: {
      landing: "/",
      shop: "/shop",
      product: "/product/emerald-feather-kaftan",
      about: "/about",
    },
  },
  {
    id: "zainas",
    name: "Zaina's Couture",
    tagline: "Curated fashion, delivered in Accra",
    taglineFr: "Mode choisie, livrée à Accra",
    taglineAr: "أزياء منتقاة، تُسلَّم في أكرا",
    imagePath: "/images/projects/zainas.webp",
    year: "2026",
    location: "Adenta · Accra",
    services: ["Boutique storefront", "WhatsApp & MoMo checkout", "Owner catalogue"],
    outcomes: [
      { value: "Fri-Sun", label: "Accra delivery" },
      { value: "MoMo", label: "Payment on WhatsApp" },
    ],
    description:
      "Boutique for Zaina's Couture in Adenta. Drops of dresses, sets and daywear, sourced overseas and ready in Accra. Shoppers browse, build a bag, and finish on WhatsApp with Mobile Money. Delivery runs Friday to Sunday across Greater Accra. Pickup at the Adenta base is free. Zaina updates stock, prices and photos herself, and the change is on the shop immediately.",
    descriptionFr:
      "Boutique de Zaina's Couture à Adenta. Des collections de robes, ensembles et tenues de jour, sourcées à l'étranger et prêtes à Accra. Le sac se termine sur WhatsApp avec Mobile Money. Livraison du vendredi au dimanche dans le Grand Accra. Le retrait à Adenta est gratuit. Zaina met à jour stock, prix et photos elle-même.",
    descriptionAr:
      "بوتيك Zaina's Couture في أدنتا. دفعات من الفساتين والأطقم وملابس النهار، تُجلب من الخارج وتكون جاهزة في أكرا. تكتمل الحقيبة على واتساب عبر موبايل موني. التوصيل من الجمعة إلى الأحد في أكرا الكبرى. الاستلام من أدنتا مجاني. تحدّث زينا المخزون والأسعار والصور بنفسها.",
    role: "Storefront design & full-stack build",
    impact: [
      "Built the shop around a weekend delivery run and Mobile Money, not a card checkout.",
      "Gave the owner a catalogue she can edit, so a sold-out piece leaves the floor the same day.",
    ],
    category: "fashion",
    categoryLabel: "Fashion · Boutique",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Drizzle", "Neon"],
    accentColor: "#A84F63",
    accentGlow: "rgba(168, 79, 99, 0.16)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "shop", label: "Shop" },
      { id: "product", label: "Piece" },
      { id: "about", label: "Story" },
    ],
    screenImages: {
      landing: "/previews/zainas/landing.webp",
      shop: "/previews/zainas/shop.webp",
      product: "/previews/zainas/product.webp",
      about: "/previews/zainas/about.webp",
    },
    liveBaseUrl: "https://temporaryzainascouturedomain.vercel.app",
    liveScreenPaths: {
      landing: "/",
      shop: "/shop",
      product: "/product/naa-corset-midi",
      about: "/about",
    },
    walkthroughs: [
      {
        id: "zainas-ops",
        title: "Storefront & owner catalogue",
        caption:
          "Live recording of the real boutique: home, shop, a piece, the bag, then Zaina’s admin catalogue, inventory, and orders.",
        src: "/walkthroughs/zainas-ops.mp4",
        poster: "/previews/zainas/shop.webp",
        duration: "3:13",
      },
    ],
  },
  {
    id: "siif",
    name: "SIIF",
    tagline: "Savannah Institute for Innovative Finance",
    imagePath: "/images/projects/siif.webp",
    year: "2025",
    location: "West Africa · Institutional",
    services: ["Brand identity", "Editorial design", "Front-end engineering"],
    description:
      "Institutional finance platform focused on emerging market capital. Bridging institutional rigor with high-growth innovation in West Africa.",
    role: "Lead Interface Engineer",
    impact: [
      "Designed the institutional narrative and visual identity for SIIF.",
      "Built a high-fidelity academy and intelligence portal for investors.",
    ],
    outcomes: [
      { value: "3", label: "Portals shipped" },
      { value: "100%", label: "Custom identity" },
    ],
    category: "community",
    categoryLabel: "Finance · Intelligence",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
    accentColor: "#C59E47",
    accentGlow: "rgba(197, 158, 71, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "academy", label: "Academy" },
      { id: "intelligence", label: "Intelligence" },
    ],
  },
  {
    id: "chalesocks",
    name: "Chale Socks",
    tagline: "Premium Afro-Luxury E-Commerce",
    imagePath: "/images/projects/chalesocks-live.webp",
    year: "2025",
    location: "Global",
    services: ["Brand positioning", "Front-end engineering", "Commerce design"],
    description:
      "The global home for Chale Socks, transforming an African gift brand into an international luxury staple through immersive storytelling and high-fidelity UX.",
    role: "Lead Fullstack & Design",
    outcomes: [
      { value: "1", label: "Global rollout" },
      { value: "Luxury", label: "Positioning" },
    ],
    category: "fashion",
    categoryLabel: "Fashion · Luxury",
    stack: ["Next.js 15", "Tailwind CSS", "Framer Motion", "Sanity CMS", "Shopify"],
    accentColor: "#EAB308",
    accentGlow: "rgba(234, 179, 8, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "story", label: "The Story" },
    ],
    screenImages: {
      landing: "/previews/chalesocks/landing.webp",
      story: "/previews/chalesocks/story.webp",
    },
    liveBaseUrl: "https://chalesocks.vercel.app",
    liveScreenPaths: { landing: "/", story: "/#our-story" },
  },
  {
    id: "primehub",
    slug: "primetijara",
    name: "PrimeTijara",
    tagline: "B2B Building Materials Supply Desk",
    taglineFr: "Comptoir d'approvisionnement B2B en matériaux de construction",
    taglineAr: "مكتب توريد مواد البناء بين الشركات",
    imagePath: "/images/projects/primetijara-landing.webp",
    year: "2025",
    location: "Ghana · B2B",
    services: ["Product architecture", "Procurement workflows", "POS & back office", "Full-stack engineering"],
    description:
      "The supply desk for Ghanaian businesses and builders. PrimeTijara unifies competitive stock, formal proformas, approvals, deliveries and an in-house POS into one verified procurement flow, fronted by a storefront and run from an Odoo-style back office.",
    descriptionFr:
      "Le comptoir d'approvisionnement des entreprises et artisans ghanéens. PrimeTijara réunit stock compétitif, proformas formels, approbations, livraisons et une caisse (POS) interne dans un flux d'achat vérifié, avec une vitrine en façade et un back-office façon Odoo.",
    descriptionAr:
      "مكتب التوريد للشركات والبنّائين في غانا. يوحّد PrimeTijara المخزون التنافسي وعروض الأسعار الرسمية والموافقات والتسليم ونقطة بيع داخلية في مسار شراء موثّق، بواجهة متجر ومكتب خلفي بأسلوب Odoo.",
    study: {
      challenge:
        "Ghanaian contractors and businesses buy building materials through scattered WhatsApp chats and paper proformas: no verified pricing, no approval trail, and counter sales that never reconcile with stock or cash. Owners couldn't tell whether they were actually making money.",
      approach:
        "We modelled approval and proforma flows around how contractors work on site, then built an Odoo-style back office (orders, inventory, purchasing, accounting, payroll and POS shifts) wired to a storefront and courier settlement so every counter sale hits one source of stock and cash truth.",
      result:
        "One procurement OS replacing the WhatsApp-and-paper workflow: 20+ back-office modules, an in-house POS and a public storefront kept in sync, giving the business a single real-time view of stock, orders and cash.",
    },
    role: "Product, architecture & full-stack engineering",
    impact: [
      "Modelled approval and proforma flows around how contractors actually work on site.",
      "Built an Odoo-style back office covering orders, inventory, purchasing, accounting, payroll and POS shifts.",
      "Wired the storefront, courier settlement and counter POS to a single source of stock and cash truth.",
    ],
    outcomes: [
      { value: "GHS 177K", label: "Sales in the first month" },
      { value: "20+", label: "Back-office modules" },
      { value: "POS", label: "+ storefront in sync" },
    ],
    category: "ecommerce",
    categoryLabel: "E-Commerce · B2B",
    stack: ["Next.js", "TypeScript", "Tailwind v4", "Drizzle", "Neon PG", "Better Auth"],
    accentColor: "#EAB308",
    accentGlow: "rgba(234, 179, 8, 0.15)",
    featured: true,
    flagship: true,
    defaultScreen: "admin",
    screens: [
      { id: "landing", label: "Home" },
      { id: "products", label: "Products" },
      { id: "admin", label: "Back office" },
      { id: "orders", label: "Orders" },
      { id: "inventory", label: "Inventory" },
      { id: "pos", label: "POS" },
    ],
    screenImages: {
      landing: "/previews/primehub/landing.webp",
      products: "/previews/primehub/products.webp",
      categories: "/previews/primehub/categories.webp",
      admin: "/previews/primehub/admin.webp",
      orders: "/previews/primehub/orders.webp",
      inventory: "/previews/primehub/inventory.webp",
      pos: "/previews/primehub/pos.webp",
    },
    liveBaseUrl: "https://primehubgh.vercel.app",
    liveScreenPaths: { landing: "/", products: "/products", categories: "/categories" },
    walkthroughs: [
      {
        id: "primetijara-ops",
        title: "Storefront, POS & back office",
        caption:
          "Live recording of the real PrimeTijara UI: storefront, back office, a counter sale, orders, and inventory.",
        src: "/walkthroughs/primetijara-ops.mp4",
        poster: "/previews/primehub/pos.webp",
        duration: "2:45",
      },
    ],
  },
  {
    id: "alboyut",
    slug: "al-boyut",
    name: "Al Boyut",
    tagline: "Builder's Merchant: Brand, Storefront and Counter Operations",
    taglineFr: "Négoce de matériaux : marque, boutique et opérations de comptoir",
    taglineAr: "تاجر مواد بناء: الهوية والموقع وتشغيل الكاونتر",
    year: "2026",
    location: "Lakeside Estate, Accra · Ghana",
    services: [
      "Brand identity & logo system",
      "Storefront & commerce design",
      "POS, orders & inventory operations",
      "Google Business Profile & local discovery",
      "Stock counts & ongoing support",
      "Full-stack engineering",
    ],
    description:
      "Everything customer-facing and behind the counter for an Accra builder's merchant: the logo and identity system, the live storefront at alboyut.com with a 450+ item catalogue and WhatsApp-first ordering, and the staff platform that runs the shop. A touch POS register, a cashier queue that calls each order out loud by the salesperson who raised it, an orders workstation, stock-controlled inventory with physical stock-takes, a sales dashboard and branded receipts, all on one Postgres source of truth. Plus a verified Google Business Profile and ongoing stock-counting and support.",
    descriptionFr:
      "Tout le visible et l'arrière-comptoir d'un négoce de matériaux d'Accra : le logo et le système d'identité, la boutique en ligne alboyut.com avec un catalogue de 450+ références et la commande par WhatsApp, et la plateforme d'équipe qui fait tourner le magasin. Une caisse tactile, une file caissier qui annonce chaque commande à voix haute au nom du vendeur qui l'a saisie, un poste de commandes, un stock contrôlé avec inventaires physiques, un tableau de bord des ventes et des reçus à la marque, le tout sur une seule source Postgres. Plus une fiche Google Business vérifiée et un accompagnement continu, comptage de stock inclus.",
    descriptionAr:
      "كل ما يراه العميل وما خلف الكاونتر لتاجر مواد بناء في أكرا: الشعار ونظام الهوية، والمتجر المباشر على alboyut.com بكتالوج يضم أكثر من 450 صنفًا وطلب عبر واتساب، ومنصّة الموظفين التي تُدير المحل. نقطة بيع باللمس، وطابور للكاشير ينادي كل طلب بصوت عالٍ باسم البائع الذي أنشأه، ومحطة طلبات، ومخزون مضبوط مع جرد فعلي، ولوحة مبيعات وإيصالات بالهوية، كلها على مصدر Postgres واحد. إضافةً إلى ملف تجاري موثّق على Google ودعم تشغيلي مستمر يشمل جرد المخزون.",
    study: {
      challenge:
        "Al Boyut sold pipes, cement, roofing and tools over a counter on Lakeside Estate with no logo, no website, and no Google Business Profile. Customers who searched for it found nothing on Maps, prices lived in WhatsApp threads, and sales at the counter never reconciled with stock. A salesperson would raise a ticket and then have to physically walk it to the cashier for collection.",
      approach:
        "We started with the identity: a hexagonal AB mark, wordmark and lockups with reverse, mono and receipt variants, plus a written design system and brand voice. That identity carries a Next.js storefront (450+ item catalogue, search, 'Ask for price' on WhatsApp, counter pickup or Accra delivery) and the staff platform that actually runs the counter: a touch POS register, an orders workstation for POS and online sales, stock-controlled inventory with physical stock-takes, and analytics, all on one Drizzle/Postgres source of truth. The detail that makes the floor flow: when a salesperson sends a ticket to the cashier, the cashier's screen chimes and speaks the salesperson's name aloud, 'New order from Baria', so a ticket is claimed across a noisy shop floor without anyone leaving the till. We also created and verified the Google Business Profile, with categories and NAP held identical to the site.",
      result:
        "One brand and one system, counter to cash: a live site at alboyut.com; a POS register, orders, inventory and analytics on a single Postgres truth; branded receipts; and a verified Business Profile so people searching for building materials on Lakeside Estate find the shop. We stay on as ongoing support, including physical stock counts.",
      metrics: [
        { value: "450+", label: "Catalogue items live" },
        { value: "6", label: "Materials surfaces" },
        { value: "Spoken", label: "Cashier handoff" },
        { value: "Verified", label: "Google Business Profile" },
      ],
    },
    role: "Brand, product & full-stack engineering",
    impact: [
      "Designed the logo and identity system: mark, wordmark, lockups, reverse and receipt variants, plus a written design system and brand voice.",
      "Built the live storefront at alboyut.com: 450+ item catalogue, search and filters, WhatsApp-first ordering, counter pickup or delivery.",
      "Built the staff platform on one Drizzle/Postgres source of truth: a touch POS register, an orders workstation across POS and online, stock-controlled inventory with physical stock-takes, and a sales dashboard.",
      "Gave the counter a voice: when a salesperson sends a ticket to the cashier, the cashier's screen chimes and announces the salesperson's name aloud, so orders are claimed without leaving the till (mutable, with a chime-and-banner fallback).",
      "Created and verified the Google Business Profile, and stay on for ongoing operational support, including physical stock counts.",
    ],
    outcomes: [
      { value: "450+", label: "Catalogue items live" },
      { value: "6", label: "Materials surfaces" },
      { value: "GBP", label: "Verified on Maps" },
    ],
    category: "ecommerce",
    categoryLabel: "E-Commerce · Brand & Operations",
    stack: ["Next.js", "TypeScript", "Drizzle", "PostgreSQL", "Better Auth", "Vercel Blob"],
    accentColor: "#B4552F",
    accentGlow: "rgba(180, 85, 47, 0.16)",
    featured: true,
    imagePath: "/previews/alboyut/landing.webp",
    screens: [
      { id: "landing", label: "Storefront" },
      { id: "products", label: "Catalogue" },
      { id: "pos", label: "POS register" },
      { id: "queue", label: "To collect" },
      { id: "orders", label: "Orders" },
      { id: "inventory", label: "Inventory" },
      { id: "sales", label: "Sales" },
    ],
    screenImages: {
      landing: "/previews/alboyut/landing.webp",
      products: "/previews/alboyut/products.webp",
      pos: "/previews/alboyut/pos.webp",
      queue: "/previews/alboyut/queue.webp",
      orders: "/previews/alboyut/orders.webp",
      inventory: "/previews/alboyut/inventory.webp",
      sales: "/previews/alboyut/sales.webp",
    },
    mobileShowcase: [
      { src: "/previews/alboyut/mobile/pos.webp", label: "POS register" },
      { src: "/previews/alboyut/mobile/queue.webp", label: "Cashier queue" },
      { src: "/previews/alboyut/mobile/inventory.webp", label: "Inventory" },
      { src: "/previews/alboyut/mobile/products.webp", label: "Catalogue" },
    ],
    liveBaseUrl: "https://alboyut.com",
    liveScreenPaths: {
      landing: "/",
      products: "/products",
      pos: "/pos/terminal",
      queue: "/pos/terminal",
      orders: "/admin/orders",
      inventory: "/admin/inventory",
      sales: "/admin/analytics",
    },
    // alboyut.com sends X-Frame-Options: DENY, so the embedded live tab would be blank.
    liveEmbeddable: false,
    walkthroughs: [
      {
        id: "an-nur-laundry",
        title: "An-Nur laundry ops",
        caption:
          "Live recording of the real laundry counter: drop-off, workstation stages, scan, collect, reports, and public tracking.",
        src: "/walkthroughs/an-nur-laundry.mp4",
        poster: "/previews/alboyut/laundry.webp",
        duration: "2:23",
      },
      {
        id: "al-boyut-counter",
        title: "Counter & back office",
        caption:
          "Live recording of the real shop floor: storefront, open register, salesperson basket, send to cashier, orders, inventory, and sales.",
        src: "/walkthroughs/al-boyut-counter.mp4",
        poster: "/previews/alboyut/pos.webp",
        duration: "6:15",
      },
    ],
  },
  {
    id: "enterprise-erp",
    slug: "enterprise-erp",
    name: "Delish Restaurant",
    tagline: "Restaurant website + Odoo 19 ERP",
    year: "2026",
    location: "Accra · Ghana",
    services: [
      "Marketing website",
      "Process mapping",
      "Odoo 19 configuration",
      "Custom addon development",
      "Stock reconciliation & training",
    ],
    description:
      "The full stack for Delish, a restaurant at the University of Ghana poolside in Accra: a marketing website with menu and table booking, plus a live Odoo 19 back office replacing a fragmented Appsol POS and manual spreadsheets with one system for point of sale, recipes, stock and purchasing.",
    role: "Website & ERP implementation lead",
    study: {
      challenge:
        "Delish ran on a fragmented Appsol POS and manual spreadsheets. Stock never reconciled with sales, suppliers delivered in packs (crates, sacks, kirks) that didn't map to how ingredients were counted, and the numbers stopped adding up at month-end.",
      approach:
        "I mapped every POS, stock and purchasing workflow onto Odoo 19 before configuring a field, then built it around how Delish works: a POS menu with categories, prices, staff PINs and a two-step waiter → cashier flow; phantom Bills of Materials so selling a dish deducts its exact ingredients; and pack → piece unit conversions (crate, sack, kirk = 53 bottles, beef by the gram per dish) so receipts match how suppliers sell.",
      result:
        "Delish now runs on one live Odoo 19 instance: 130+ menu items on POS, recipes deducting stock on every sale, and physical counts reconciled in across three dated sessions with an auditable formula. Training manuals and monitoring runbooks were handed over so the team runs it without me.",
    },
    impact: [
      "Mapped every POS, stock and purchasing workflow onto Odoo 19 before configuring a single field.",
      "Built phantom Bills of Materials so selling a dish deducts its exact ingredients from stock.",
      "Configured pack → piece unit conversions (crate, sack, kirk = 53 bottles, beef by the gram) so receipts match how suppliers actually sell.",
      "Reconciled physical stock counts into Odoo across three dated sessions, then handed over training manuals and monitoring runbooks.",
    ],
    outcomes: [
      { value: "130+", label: "Menu items on POS" },
      { value: "77", label: "Ingredients mapped to recipes" },
      { value: "3", label: "Physical count sessions" },
      { value: "Odoo 19", label: "Live instance" },
    ],
    category: "enterprise",
    categoryLabel: "Enterprise · ERP",
    stack: [
      "Odoo 19",
      "Python",
      "QWeb / XML",
      "PostgreSQL",
      "XML-RPC",
    ],
    accentColor: "#8B5CF6",
    accentGlow: "rgba(139, 92, 246, 0.18)",
    featured: true,
    imagePath: "/previews/delish/site.webp",
    screens: [
      { id: "site", label: "Website" },
      { id: "menu", label: "Menu" },
      { id: "backend", label: "Odoo Backend" },
    ],
    screenImages: {
      site: "/previews/delish/site.webp",
      menu: "/previews/delish/menu.webp",
      backend: "/images/projects/enterprise-erp.webp",
    },
    liveBaseUrl: "https://delish-rho.vercel.app",
    liveScreenPaths: { site: "/", menu: "/menu" },
  },
  {
    id: "redrow",
    name: "Redrow Minimart",
    tagline: "Premium Daily Essentials",
    imagePath: "/images/projects/redrow.webp",
    year: "2025",
    location: "Ghana",
    services: ["Brand direction", "Full-stack engineering"],
    outcomes: [
      { value: "15–25min", label: "Delivery promise" },
      { value: "1", label: "Curated storefront" },
    ],
    description:
      "A clean, modern digital storefront for a premium community minimart. Focused on fast discovery, 15-25 minute delivery estimations, and a curated selection of daily essentials.",
    role: "Lead Fullstack & Branding",
    category: "ecommerce",
    categoryLabel: "E-Commerce · Retail",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
    accentColor: "#059669",
    accentGlow: "rgba(5, 150, 105, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "shop", label: "Shop" },
    ],
  },
  {
    id: "ethika",
    name: "Ethika Finance",
    tagline: "Non-interest finance intelligence",
    imagePath: "/images/projects/ethika.webp",
    year: "2025",
    location: "Ghana",
    services: ["Information architecture", "Regulatory research", "Front-end engineering"],
    outcomes: [
      { value: "BoG", label: "Source-led regulation" },
      { value: "4", label: "Decision tools" },
    ],
    description:
      "Institutional guide to non-interest finance in Ghana. A Bank of Ghana regulatory hub, a Knowledge Vault, assumption-led tools (loan versus murabaha, mudarabah, zakat, product comparison), and a bank directory. Bilingual, English and French. Built as education around official sources, not a product brochure.",
    role: "Researcher, information architect & engineer",
    impact: [
      "Rebuilt the public site around Bank of Ghana source rails, the Knowledge Vault, and decision tools.",
      "Put Ghana-specific comparisons (conventional loan versus murabaha, zakat, mudarabah) where a reader can change the assumptions and see the result.",
    ],
    category: "fintech",
    categoryLabel: "FinTech · RegTech",
    stack: ["Next.js 14", "TypeScript", "Supabase", "Framer Motion", "next-intl", "Recharts"],
    accentColor: "#EA580C",
    accentGlow: "rgba(234, 88, 12, 0.15)",
    featured: true,
    flagship: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "regulation", label: "Regulation" },
      { id: "vault", label: "Knowledge" },
      { id: "tools", label: "Tools" },
    ],
    screenImages: {
      landing: "/previews/ethika/landing.webp",
      regulation: "/previews/ethika/regulation.webp",
      vault: "/previews/ethika/vault.webp",
      tools: "/previews/ethika/tools.webp",
    },
    liveBaseUrl: "https://ethika.vercel.app",
    liveScreenPaths: {
      landing: "/en",
      regulation: "/en/regulation",
      vault: "/en/education",
      tools: "/en/tools",
    },
    liveEmbeddable: false,
  },
  {
    id: "anisfoods",
    name: "Anis Food & Drink",
    tagline: "Ghanaian Restaurant · POS & Back Office",
    imagePath: "/images/projects/anisfoods-live.webp",
    year: "2024",
    location: "Accra · Ghana",
    services: ["Systems design", "POS & back-office", "Financial reporting"],
    outcomes: [
      { value: "4", label: "Integrated surfaces" },
      { value: "P&L", label: "Real-time reporting" },
    ],
    description:
      "Public website, cashier POS, and full back-office suite for an Accra restaurant. Real-time orders, financial reports (P&L, cash flow, payroll), multi-role access.",
    role: "Systems designer & full‑stack implementer",
    impact: [
      "Designed POS, reporting and kitchen flows directly from the owner's daily operations.",
      "Modelled P&L, category sales and staff metrics to answer real finance questions.",
    ],
    category: "restaurant",
    categoryLabel: "Restaurant · POS",
    stack: ["Next.js 16", "NextAuth v5", "Prisma", "Supabase", "React PDF"],
    accentColor: "#D21F3C",
    accentGlow: "rgba(210, 31, 60, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Website" },
      { id: "pos", label: "POS" },
      { id: "dashboard", label: "Dashboard" },
      { id: "reports", label: "Reports" },
    ],
    screenImages: {
      landing: "/previews/anisfoods/landing.webp",
    },
    liveBaseUrl: "https://aniseatery.netlify.app",
    liveScreenPaths: { landing: "/", pos: "/", dashboard: "/", reports: "/" },
    walkthroughs: [
      {
        id: "anis-ops",
        title: "Website, POS & back office",
        caption:
          "Live recording of the real Anis system: public site, cashier POS, owner dashboard, orders, and reports.",
        src: "/walkthroughs/anis-ops.mp4",
        poster: "/previews/anisfoods/landing.webp",
        duration: "2:08",
      },
    ],
  },
  {
    id: "rentcheck",
    name: "Rentcheck Ghana",
    tagline: "Verified Rental Platform",
    description:
      "Scout-inspected listings, Ghana Card KYC, viewing-fee escrow, utility bill transparency, landlord ratings, and digital tenancy agreements for the Accra rental market.",
    role: "Product designer & UX for trust",
    impact: [
      "Turned unstructured rental pain points (viewing fees, hidden bills) into clear UI patterns.",
      "Designed identity, escrow and disclosure flows around Ghana Card and local practice.",
    ],
    category: "proptech",
    categoryLabel: "PropTech · Rentals",
    stack: ["React", "NestJS", "Prisma", "Paystack MoMo", "Dojah KYC", "TypeScript"],
    accentColor: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.15)",
    featured: true,
    imagePath: "/previews/rentcheck/landing.webp",
    screens: [
      { id: "landing", label: "Home" },
      { id: "listings", label: "Listings" },
      { id: "detail", label: "Property" },
    ],
    screenImages: {
      landing: "/previews/rentcheck/landing.webp",
      listings: "/previews/rentcheck/listings.webp",
      detail: "/previews/rentcheck/detail.webp",
    },
    liveBaseUrl: "https://rentcheck-ghana.vercel.app",
    liveScreenPaths: { landing: "/", listings: "/search", detail: "/property/r1" },
  },
  {
    id: "lenus",
    name: "Lenus Pharmacy",
    tagline: "Online Pharmacy & Delivery",
    description:
      "2000+ products, NEPP-registered, GhanaPostGPS delivery across Greater Accra, WhatsApp prescription handling. Branches in Botwe, Lakeside Estates, and Madina.",
    role: "Platform architecture & DX",
    impact: [
      "Structured pharmacy catalogue, search and checkout for walk‑in and delivery customers.",
      "Modelled branch operations and delivery zones around real Accra neighbourhoods.",
    ],
    category: "healthcare",
    categoryLabel: "Healthcare · E-Commerce",
    stack: ["Next.js 14", "Fastify", "Prisma", "PostgreSQL", "Turborepo"],
    accentColor: "#0d9488",
    accentGlow: "rgba(13, 148, 136, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "shop", label: "Products" },
      { id: "checkout", label: "Checkout" },
    ],
  },
  {
    id: "ladyangel",
    name: "Lady Angel Network",
    tagline: "Private Investment Network for Women",
    imagePath: "/previews/ladyangel/landing.webp",
    screenImages: {
      landing: "/previews/ladyangel/landing.webp",
      membership: "/previews/ladyangel/membership.webp",
      portfolio: "/previews/ladyangel/portfolio.webp",
    },
    liveBaseUrl: "https://lady-angel.vercel.app",
    liveScreenPaths: { landing: "/", membership: "/membership", portfolio: "/investments" },
    year: "2025",
    location: "Pan-Africa",
    services: ["Investment workflow", "Deal-flow UX", "Front-end"],
    outcomes: [
      { value: "5", label: "Investment models" },
      { value: "1", label: "Private network" },
    ],
    description:
      "Invitation-only platform for women deploying capital into women-led ventures. Structured deal flow pipeline, 5 investment models, mentorship bootcamps, and a Pan-African portfolio.",
    role: "Investment workflow designer & front‑end",
    impact: [
      "Mapped the full deal‑flow pipeline from first contact to portfolio monitoring.",
      "Designed member‑facing pages that balance exclusivity with clarity for founders.",
    ],
    category: "community",
    categoryLabel: "Finance · Investment",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Playfair Display"],
    accentColor: "#FB7C06",
    accentGlow: "rgba(251, 124, 6, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "membership", label: "Membership" },
      { id: "portfolio", label: "Portfolio" },
    ],
  },
  {
    id: "jireh",
    name: "Jireh Natural Foods",
    tagline: "Restaurant Platform · Website, POS & Back Office",
    imagePath: "/images/projects/jireh-live.webp",
    year: "2024",
    location: "Adenta · Accra",
    services: ["Conversion UX", "Front-end", "Cashier POS", "Back-office system"],
    outcomes: [
      { value: "4", label: "Order channels" },
      { value: "POS", label: "+ full back office" },
      { value: "11", label: "Admin modules" },
    ],
    description:
      "End-to-end platform for Jireh Natural Foods in Adenta: a conversion-focused ordering website, a cashier POS, and a NextAuth-secured back office covering orders, menu, inventory, purchasing, payroll and financial reports.",
    role: "Product design, full-stack build & operations tooling",
    impact: [
      "Structured menu storytelling and CTAs for faster food discovery and order intent.",
      "Connected web traffic to direct channels (WhatsApp, call, Bolt Food, socials).",
      "Built the cashier POS and a role-based back office for orders, stock, BOMs, payroll and reporting.",
    ],
    category: "restaurant",
    categoryLabel: "Restaurant · POS & Back Office",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "NextAuth", "Prisma", "Supabase"],
    accentColor: "#5ecf4f",
    accentGlow: "rgba(94, 207, 79, 0.15)",
    featured: true,
    defaultScreen: "menu",
    screens: [
      { id: "landing", label: "Website" },
      { id: "menu", label: "Menu manager" },
      { id: "pos", label: "POS" },
      { id: "orders", label: "Orders" },
      { id: "inventory", label: "Inventory" },
      { id: "dashboard", label: "Dashboard" },
    ],
    screenImages: {
      landing: "/previews/jireh/landing.webp",
      menu: "/previews/jireh/menu.webp",
      pos: "/previews/jireh/pos.webp",
      orders: "/previews/jireh/orders.webp",
      inventory: "/previews/jireh/inventory.webp",
      dashboard: "/previews/jireh/dashboard.webp",
    },
    liveBaseUrl: "https://jirehnaturalfoods.vercel.app",
    liveScreenPaths: { landing: "/" },
  },
  {
    id: "madinabasketball",
    name: "Madina Basketball",
    tagline: "Community Court Platform",
    imagePath: "/images/projects/madinabasketball-live.webp",
    year: "2024",
    location: "Madina · Ghana",
    services: ["Community ops", "Transparency dashboards", "Full-stack"],
    outcomes: [
      { value: "GHS 40K+", label: "Raised from 11 donors" },
      { value: "1", label: "Solar-powered court" },
    ],
    description:
      "Libya Quarters' solar-powered basketball court hub: event management, player registration, court booking, transparency reports, and team highlights for Zurak Basketball & Madina Old Gees.",
    role: "Community organiser, co‑lead & builder",
    impact: [
      "Co‑led the renovation of an inactive community court into a solar‑powered hub, from early planning through launch and ongoing operations.",
      "Designed donation, sponsorship and transparency flows for donors, players and local leaders.",
      "Turned the court into a digital hub with events, registrations and transparent reporting.",
    ],
    category: "sports",
    categoryLabel: "Sports · Community",
    stack: ["Next.js 14", "TypeScript", "Supabase", "react-youtube", "html2canvas", "jspdf"],
    accentColor: "#EAB308",
    accentGlow: "rgba(234, 179, 8, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "court", label: "The Court" },
      { id: "events", label: "Events" },
    ],
    screenImages: {
      landing: "/previews/madinabasketball/landing.webp",
      court: "/previews/madinabasketball/court.webp",
      events: "/previews/madinabasketball/events.webp",
    },
    liveBaseUrl: "https://madinabball.vercel.app",
    liveScreenPaths: { landing: "/", court: "/court", events: "/media" },
  },
  {
    id: "pronaj",
    name: "Pronaj",
    tagline: "Digital, Living and Global",
    imagePath: "/images/projects/pronaj-live.webp",
    year: "2026",
    location: "Accra · Ghana",
    services: ["Brand system", "Editorial web", "Narrative design"],
    outcomes: [
      { value: "3", label: "Sectors" },
      { value: "25+", label: "Export markets" },
    ],
    description:
      "Accra company site at pronajgh.com. Three sectors under one brand: Digital (IT and software), Living (modular housing), and Global (agri-trade and export, including Gold Coast Croire). Registered in Ghana, with export reach across Africa, Europe and the Middle East. English, French and Arabic.",
    role: "Brand system & web experience",
    impact: [
      "Held Digital, Living and Global in one industrial system instead of three unrelated sites.",
      "Moved the public site onto pronajgh.com, with sector pages, services, and a contact desk in Accra.",
    ],
    category: "corporate",
    categoryLabel: "Corporate · Brand",
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Framer Motion", "next-intl"],
    accentColor: "#EA580C",
    accentGlow: "rgba(234, 88, 12, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "digital", label: "Digital" },
      { id: "global", label: "Global" },
      { id: "contact", label: "Contact" },
    ],
    screenImages: {
      landing: "/previews/pronaj/landing.webp",
      digital: "/previews/pronaj/digital.webp",
      global: "/previews/pronaj/global.webp",
      contact: "/previews/pronaj/contact.webp",
    },
    liveBaseUrl: "https://pronajgh.com",
    liveScreenPaths: {
      landing: "/",
      digital: "/digital",
      global: "/global",
      contact: "/contact",
    },
    liveEmbeddable: false,
  },
  {
    id: "makossa",
    name: "The Makossa Shop",
    tagline: "Mini mart on Makossa Street",
    imagePath: "/images/projects/makossa-landing.webp",
    year: "2026",
    location: "Adenta Housing Down · Accra",
    services: ["Storefront", "Catalogue", "WhatsApp ordering"],
    outcomes: [
      { value: "WhatsApp", label: "Basket, then collect" },
      { value: "7 days", label: "Open on Makossa Street" },
    ],
    description:
      "Neighbourhood mini mart at AY 85 Makossa Avenue, Adenta Housing Down. Shoppers browse the aisles online, send the basket on WhatsApp, and collect in store. Cash and Mobile Money at the counter. The public site carries the shelves, the map pin, and opening hours so a customer knows the shop before they walk in.",
    role: "Storefront design & full-stack build",
    impact: [
      "Turned the corner shop into a catalogue people can search before they leave the house.",
      "Closed the order on WhatsApp and pickup, which is how the counter already sells.",
    ],
    category: "ecommerce",
    categoryLabel: "Commerce · Mini mart",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase"],
    accentColor: "#146B3A",
    accentGlow: "rgba(20, 107, 58, 0.16)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "catalog", label: "Aisles" },
      { id: "locations", label: "Find us" },
    ],
    screenImages: {
      landing: "/previews/makossa/landing.webp",
      catalog: "/previews/makossa/catalog.webp",
      locations: "/previews/makossa/locations.webp",
    },
    liveBaseUrl: "https://makossashop.vercel.app",
    liveScreenPaths: {
      landing: "/en",
      catalog: "/en/catalog",
      locations: "/en/locations",
    },
  },
  {
    id: "rockmotion",
    name: "Rockmotion Auto Group",
    tagline: "US Automotive Export Platform",
    imagePath: "/images/projects/rockmotion-live.webp",
    year: "2025",
    location: "Atlanta → 40+ countries",
    services: ["Brand identity", "UX", "Full-stack engineering"],
    outcomes: [
      { value: "40+", label: "Countries served" },
      { value: "1", label: "Global export flow" },
    ],
    description:
      "Licensed US car dealer and broker that sources, verifies, and ships any American vehicle to 40+ countries. VIN history, crash analysis, port loading with marine insurance, and real-time tracking.",
    role: "Brand identity, UX & full‑stack build",
    impact: [
      "Designed a global-first car-buying flow for customers who can't visit the US in person.",
      "Built shipping calculator and inventory system for an Atlanta-based export operation.",
    ],
    category: "automotive",
    categoryLabel: "Automotive · Export",
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Framer Motion", "Outfit/JetBrains Mono"],
    accentColor: "#2563EB",
    accentGlow: "rgba(37, 99, 235, 0.15)",
    isLead: true,
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "inventory", label: "Inventory" },
      { id: "process", label: "Process" },
    ],
    screenImages: {
      landing: "/previews/rockmotion/landing.webp",
      inventory: "/previews/rockmotion/inventory.webp",
      process: "/previews/rockmotion/process.webp",
    },
    liveBaseUrl: "https://rockmotion.vercel.app",
    liveScreenPaths: { landing: "/", inventory: "/inventory", process: "/shipping" },
  },
  {
    id: "gaskiya",
    hidden: true,
    name: "Gaskiya",
    tagline: "Luxury West African Fashion",
    description:
      "Premium African cultural attire with editorial collections by occasion (Eid, Weddings, Corporate, Holidays). DM Sans + Cormorant Garamond, global shipping, GDPR-compliant checkout.",
    role: "Creative direction & UX",
    impact: [
      "Positioned Gaskiya as premium West African fashion through typography and layout.",
      "Designed occasion‑based navigation for Eid, weddings, corporate and holidays.",
    ],
    category: "fashion",
    categoryLabel: "Fashion · E-Commerce",
    isLead: true,
    stack: ["Next.js 14", "React", "Tailwind CSS", "Framer Motion", "TypeScript"],
    accentColor: "#D4AF37",
    accentGlow: "rgba(212, 175, 55, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "collections", label: "Collections" },
      { id: "product", label: "Product" },
    ],
  },
  {
    id: "thepalms",
    hidden: true,
    name: "The Palms by Eagles",
    tagline: "Luxury Hotel Website",
    description:
      "4-star Accra hotel with room gallery, amenities, 4.3★ Google rating, sticky booking CTA, and Maps integration. Opposite Association School, +233 55 661 6100.",
    role: "Hotel brand & booking UX",
    impact: [
      "Designed a booking flow that keeps CTAs visible without feeling aggressive.",
      "Surfaced the right trust signals for international and local guests.",
    ],
    category: "hospitality",
    categoryLabel: "Hospitality · Hotel",
    isLead: true,
    stack: ["Next.js 14", "React", "Tailwind CSS", "Framer Motion", "DM Sans"],
    accentColor: "#0D9488",
    accentGlow: "rgba(13, 148, 136, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "rooms", label: "Rooms" },
      { id: "amenities", label: "Amenities" },
    ],
  },
  {
    id: "magilo",
    name: "Magilo Art College",
    tagline: "Art School, Design & Printing Hub",
    imagePath: "/images/projects/magilo-live.webp",
    year: "2024",
    location: "Adenta · Accra",
    services: ["Storytelling", "Information design", "Front-end"],
    outcomes: [
      { value: "1000+", label: "Projects surfaced" },
      { value: "25yr+", label: "Legacy reframed" },
    ],
    description:
      "25+ years of creative excellence in Adenta, Accra. SHS Visual Arts support, graphic design training, industrial printing, business consulting. 1000+ projects, 500+ clients.",
    role: "Storytelling & information design",
    impact: [
      "Reframed decades of print work into a modern digital story for students and SMEs.",
      "Separated college, services and portfolio so each audience finds themselves quickly.",
    ],
    category: "creative",
    categoryLabel: "Creative · Education",
    stack: ["Next.js 14", "React", "Tailwind CSS", "Framer Motion", "Inter/Montserrat"],
    accentColor: "#EA580C",
    accentGlow: "rgba(234, 88, 12, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "services", label: "Services" },
      { id: "college", label: "College" },
    ],
    screenImages: {
      landing: "/previews/magilo/landing.webp",
      services: "/previews/magilo/services.webp",
      college: "/previews/magilo/college.webp",
    },
    liveBaseUrl: "https://magiloartcollege.com",
    liveScreenPaths: { landing: "/", services: "/services", college: "/college" },
  },
];

export const categoryColors: Record<ProjectCategory, string> = {
  edtech: "#0d9488",
  fintech: "#EA580C",
  ecommerce: "#d97706",
  proptech: "#F59E0B",
  restaurant: "#D21F3C",
  sports: "#EAB308",
  corporate: "#2563EB",
  automotive: "#2563EB",
  desktop: "#7C3AED",
  healthcare: "#0d9488",
  hospitality: "#0D9488",
  fashion: "#D4AF37",
  community: "#FB7C06",
  creative: "#EA580C",
  enterprise: "#8B5CF6",
};
