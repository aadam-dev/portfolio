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

/** Long-form case-study narrative. Optional — the case study degrades gracefully without it. */
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
  /** When set, the case study exposes a Live site tab that iframes the real project. */
  liveBaseUrl?: string;
  /** Map screen id → path (e.g. landing → "/", courses → "/courses"). Used with liveBaseUrl. */
  liveScreenPaths?: Record<string, string>;
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
    tagline: "Online Learning Platform",
    taglineFr: "Plateforme d'apprentissage en ligne",
    taglineAr: "منصة التعلّم عبر الإنترنت",
    imagePath: "/images/projects/koyi.webp",
    year: "2024",
    location: "Ghana · West Africa",
    services: ["Product strategy", "Information architecture", "Full-stack engineering"],
    description:
      "LMS built for Ghana and West Africa, covering WASSCE, BECE, university bridging, and career courses. Multilingual (EN/FR/AR), video streaming, certificates, and role-based access.",
    descriptionFr:
      "LMS conçu pour le Ghana et l'Afrique de l'Ouest — WASSCE, BECE, mise à niveau universitaire et cours professionnels. Multilingue (EN/FR/AR), streaming vidéo, certificats et accès selon les rôles.",
    descriptionAr:
      "نظام إدارة تعلّم مبني لغانا وغرب أفريقيا، يغطي امتحانات WASSCE وBECE والجسور الجامعية والدورات المهنية. متعدّد اللغات (الإنجليزية/الفرنسية/العربية)، بثّ فيديو، وشهادات، وصلاحيات حسب الدور.",
    study: {
      challenge:
        "Students across Ghana and West Africa prepare for WASSCE and BECE with fragmented materials, in three languages, on low-end phones and unreliable connections. No single platform mapped the actual national curriculum in a way that worked on the devices learners really own.",
      approach:
        "We designed the academic pathways with Ghanaian teachers first, then built the LMS around them — WASSCE, BECE, university-bridging and career tracks — with EN/FR/AR from the ground up, adaptive video streaming, certificates, and role-based access for students, tutors and admins.",
      result:
        "A production LMS with 420+ courses mapped across four pathways and three languages, structured by the people who actually teach the curriculum — built to scale to schools and independent learners across the region.",
    },
    role: "Product strategist & full‑stack developer",
    impact: [
      "Designed the academic pathways and course structure with Ghanaian teachers.",
      "Prototyped the full LMS flows end‑to‑end (student, tutor, admin).",
    ],
    outcomes: [
      { value: "420+", label: "Courses mapped" },
      { value: "3", label: "Languages" },
      { value: "4", label: "Pathways" },
    ],
    category: "edtech",
    categoryLabel: "EdTech · LMS",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "AWS S3", "Redis"],
    accentColor: "#0d9488",
    accentGlow: "rgba(13, 148, 136, 0.15)",
    featured: true,
    flagship: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "courses", label: "Courses" },
      { id: "lesson", label: "Lesson" },
      { id: "dashboard", label: "Dashboard" },
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
      "The supply desk for Ghanaian businesses and builders. PrimeTijara unifies competitive stock, formal proformas, approvals, deliveries and an in-house POS into one verified procurement flow — fronted by a storefront and run from an Odoo-style back office.",
    descriptionFr:
      "Le comptoir d'approvisionnement des entreprises et artisans ghanéens. PrimeTijara réunit stock compétitif, proformas formels, approbations, livraisons et une caisse (POS) interne dans un flux d'achat vérifié — avec une vitrine en façade et un back-office façon Odoo.",
    descriptionAr:
      "مكتب التوريد للشركات والبنّائين في غانا. يوحّد PrimeTijara المخزون التنافسي وعروض الأسعار الرسمية والموافقات والتسليم ونقطة بيع داخلية في مسار شراء موثّق — بواجهة متجر ومكتب خلفي بأسلوب Odoo.",
    study: {
      challenge:
        "Ghanaian contractors and businesses buy building materials through scattered WhatsApp chats and paper proformas — no verified pricing, no approval trail, and counter sales that never reconcile with stock or cash. Owners couldn't tell whether they were actually making money.",
      approach:
        "We modelled approval and proforma flows around how contractors work on site, then built an Odoo-style back office — orders, inventory, purchasing, accounting, payroll and POS shifts — wired to a storefront and courier settlement so every counter sale hits one source of stock and cash truth.",
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
      { value: "1", label: "Procurement OS" },
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
  },
  {
    id: "alboyut",
    slug: "al-boyut",
    name: "Al-Boyut",
    tagline: "Building Materials & Laundry Counter Platform",
    year: "2026",
    location: "Accra · Ghana",
    services: [
      "Brand identity",
      "Commerce design",
      "POS & back office",
      "Full-stack engineering",
    ],
    description:
      "Storefront and operations platform for an Accra building-materials merchant with a laundry counter. WhatsApp-first ordering with counter pickup and delivery, a role-based back office, POS, supplier portal and laundry operations — carried by a laterite-and-steel identity rooted in Accra's red earth.",
    role: "Product, brand & full-stack engineering",
    impact: [
      "Gave a template-cloned storefront its own hard-wearing 'builder's merchant' identity — flat, committed, WCAG AA verified.",
      "Modelled WhatsApp ordering, counter pickup and delivery around how Accra customers actually buy materials.",
      "Built admin, POS, supplier and laundry-ops surfaces on one Drizzle/Postgres source of truth.",
    ],
    outcomes: [
      { value: "5", label: "Operational surfaces" },
      { value: "2", label: "Businesses, one system" },
      { value: "AA", label: "Contrast verified" },
    ],
    category: "ecommerce",
    categoryLabel: "E-Commerce · Operations",
    stack: ["Next.js", "TypeScript", "Drizzle", "PostgreSQL", "Better Auth", "Vercel Blob"],
    accentColor: "#A8462A",
    accentGlow: "rgba(168, 70, 42, 0.16)",
    featured: false,
    hidden: true,
    imagePath: "/previews/alboyut/landing.webp",
    screens: [
      { id: "landing", label: "Storefront" },
      { id: "products", label: "Products" },
      { id: "laundry", label: "Laundry" },
    ],
    screenImages: {
      landing: "/previews/alboyut/landing.webp",
      products: "/previews/alboyut/products.webp",
      laundry: "/previews/alboyut/laundry.webp",
    },
    liveBaseUrl: "https://testing-al-boyut.vercel.app",
    liveScreenPaths: { landing: "/", products: "/products", laundry: "/laundry" },
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
        "Delish ran on a fragmented Appsol POS and manual spreadsheets. Stock never reconciled with sales, suppliers delivered in packs — crates, sacks, kirks — that didn't map to how ingredients were counted, and the numbers stopped adding up at month-end.",
      approach:
        "I mapped every POS, stock and purchasing workflow onto Odoo 19 before configuring a field, then built it around how Delish works: a POS menu with categories, prices, staff PINs and a two-step waiter → cashier flow; phantom Bills of Materials so selling a dish deducts its exact ingredients; and pack → piece unit conversions (crate, sack, kirk = 53 bottles, beef by the gram per dish) so receipts match how suppliers sell.",
      result:
        "Delish now runs on one live Odoo 19 instance — 130+ menu items on POS, recipes deducting stock on every sale, and physical counts reconciled in across three dated sessions with an auditable formula. Training manuals and monitoring runbooks were handed over so the team runs it without me.",
    },
    impact: [
      "Mapped every POS, stock and purchasing workflow onto Odoo 19 before configuring a single field.",
      "Built phantom Bills of Materials so selling a dish deducts its exact ingredients from stock.",
      "Configured pack → piece unit conversions (crate, sack, kirk = 53 bottles, beef by the gram) so receipts match how suppliers actually sell.",
      "Reconciled physical stock counts into Odoo across three dated sessions, then handed over training manuals and monitoring runbooks.",
    ],
    outcomes: [
      { value: "130+", label: "Menu items on POS" },
      { value: "59", label: "SKUs reconciled" },
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
    tagline: "Non-Interest Banking Hub",
    imagePath: "/images/projects/ethika.webp",
    description:
      "West Africa's definitive resource for non-interest banking (NIB). Bank of Ghana regulatory guidance, NIB vs conventional banking comparisons, and bilingual (EN/FR) education.",
    role: "Researcher, information architect & engineer",
    impact: [
      "Translated BoG's NIB framework into simple, side‑by‑side explanations.",
      "Designed the Knowledge Vault to onboard both retail users and practitioners.",
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
      { id: "comparison", label: "NIB vs Conv." },
      { id: "vault", label: "Knowledge" },
    ],
    screenImages: {
      landing: "/previews/ethika/landing.webp",
      comparison: "/previews/ethika/comparison.webp",
      vault: "/previews/ethika/vault.webp",
    },
    liveBaseUrl: "https://ethika.vercel.app",
    liveScreenPaths: { landing: "/en", comparison: "/en/regulation", vault: "/en/education" },
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
      { value: "GHS 40K+", label: "Raised" },
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
    name: "Pronaj International",
    tagline: "Multi-Sector Conglomerate",
    imagePath: "/images/projects/pronaj-live.webp",
    year: "2024",
    location: "Delaware · Ghana",
    services: ["Brand system", "Editorial web", "Narrative design"],
    outcomes: [
      { value: "3", label: "Sectors" },
      { value: "25+", label: "Markets" },
    ],
    description:
      "Delaware–Ghana conglomerate spanning Digital (IT services), Living (modular housing), and Global (agri-trade & export). 3 sectors, 2 continents, 25+ markets.",
    role: "Brand system & web experience",
    impact: [
      "Created a single narrative that connects Digital, Living and Global into one story.",
      "Designed sector pages that feel corporate but still human and West‑Africa grounded.",
    ],
    category: "corporate",
    categoryLabel: "Corporate · Branding",
    stack: ["Next.js 14", "Framer Motion", "Tailwind v4", "shadcn/ui", "Satoshi"],
    accentColor: "#2563EB",
    accentGlow: "rgba(37, 99, 235, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "sectors", label: "Sectors" },
      { id: "contact", label: "Contact" },
    ],
    screenImages: {
      landing: "/previews/pronaj/landing.webp",
      sectors: "/previews/pronaj/sectors.webp",
      contact: "/previews/pronaj/contact.webp",
    },
    liveBaseUrl: "https://pronaj.vercel.app",
    liveScreenPaths: { landing: "/", sectors: "/digital", contact: "/contact" },
  },
  {
    id: "makossa",
    hidden: true,
    name: "The Makossa Shop",
    tagline: "FMCG Web Shop & Counter POS",
    imagePath: "/images/projects/makossa-landing.webp",
    year: "2025",
    location: "Accra · Ghana",
    services: ["Commerce design", "Inventory ops", "POS", "Full-stack engineering"],
    outcomes: [
      { value: "1", label: "Stock count, online + counter" },
      { value: "POS", label: "+ storefront in sync" },
    ],
    description:
      "Glass-clear retail platform for a Ghanaian mini-mart. One real-time stock count serves both an online storefront and a counter POS, with weighted-average costing, cash reconciliation and an audited back office for daily FMCG operations.",
    role: "Lead full-stack & commerce design",
    impact: [
      "Unified online orders and counter sales onto a single live inventory count.",
      "Built POS session lifecycle with float, cash movements and counted-vs-expected variance.",
      "Designed a back office with weighted-average costing, stock counts and audit trail.",
    ],
    category: "ecommerce",
    categoryLabel: "E-Commerce · Retail",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    accentColor: "#6366F1",
    accentGlow: "rgba(99, 102, 241, 0.16)",
    isLead: true,
    featured: true,
    screens: [
      { id: "landing", label: "Storefront" },
      { id: "catalog", label: "Catalog" },
    ],
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
