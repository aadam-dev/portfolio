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
  isLead?: boolean;
  imagePath?: string;
  /** When set, the case study exposes a Live site tab that iframes the real project. */
  liveBaseUrl?: string;
  /** Map screen id → path (e.g. landing → "/", courses → "/courses"). Used with liveBaseUrl. */
  liveScreenPaths?: Record<string, string>;
}

export function projectSlug(p: Project): string {
  return p.slug ?? p.id;
}

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => projectSlug(p) === slug);
}

export const projects: Project[] = [
  {
    id: "koyi",
    name: "Kōyi",
    tagline: "Online Learning Platform",
    imagePath: "/images/projects/koyi.png",
    year: "2024",
    location: "Ghana · West Africa",
    services: ["Product strategy", "Information architecture", "Full-stack engineering"],
    description:
      "LMS built for Ghana and West Africa — WASSCE, BECE, university bridging, and career courses. Multilingual (EN/FR/AR), video streaming, certificates, and role-based access.",
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
    imagePath: "/images/projects/siif.png",
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
    imagePath: "/images/projects/chalesocks.png",
    year: "2025",
    location: "Global",
    services: ["Brand positioning", "Front-end engineering", "Commerce design"],
    description:
      "The global home for Chale Socks — transforming an African gift brand into an international luxury staple through immersive storytelling and high-fidelity UX.",
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
    liveBaseUrl: "https://chalesocks.vercel.app",
    liveScreenPaths: { landing: "/", story: "/#our-story" },
  },
  {
    id: "primehub",
    name: "PrimeHub",
    tagline: "B2B Building Materials Platform",
    imagePath: "/images/projects/primehub.png",
    year: "2025",
    location: "Ghana · B2B",
    services: ["Product architecture", "Workflow design", "Full-stack engineering"],
    description:
      "Procurement command center for Ghanaian contractors. Source building materials, generate proformas, manage approvals, and track deliveries — all in one platform.",
    role: "Product, architecture & procurement workflows",
    impact: [
      "Modelled approval and proforma flows around how contractors actually work on site.",
      "Designed inventory cards and quote builder for fast estimation during client calls.",
    ],
    outcomes: [
      { value: "1", label: "Procurement OS" },
      { value: "3", label: "Core workflows" },
    ],
    category: "ecommerce",
    categoryLabel: "E-Commerce · B2B",
    stack: ["Next.js", "TypeScript", "Tailwind v4", "Drizzle", "Neon PG", "Better Auth"],
    accentColor: "#d97706",
    accentGlow: "rgba(217, 119, 6, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "products", label: "Products" },
      { id: "quote", label: "Quote" },
    ],
    liveBaseUrl: "https://primehubgh.vercel.app",
    liveScreenPaths: { landing: "/", products: "/products", quote: "/quote" },
  },
  {
    id: "enterprise-erp",
    slug: "enterprise-erp",
    name: "Enterprise ERP",
    tagline: "Odoo Implementation & Data Migration",
    year: "2025",
    location: "Confidential · Multi-branch",
    services: [
      "Odoo configuration",
      "Custom module development",
      "Data migration",
      "Team training",
    ],
    description:
      "Full Odoo ERP rollout for an anonymised enterprise client. Replaced a failing POS and a tangle of manual reconciliations with a unified system — POS, Inventory, Purchase, Accounting and HR — configured around how the business actually operates day-to-day.",
    role: "ERP architect & implementation lead",
    impact: [
      "Audited every business process and mapped them onto the relevant Odoo modules before a line of config was written.",
      "Migrated historical data from the legacy POS and spreadsheets into Odoo without downtime or data loss.",
      "Built custom modules to close the gap where out-of-the-box Odoo didn't match the client's real workflow.",
      "Trained owners and staff on the new system so the rollout didn't depend on me post-launch.",
    ],
    outcomes: [
      { value: "0", label: "Manual reconciliations" },
      { value: "6+", label: "Modules configured" },
      { value: "1", label: "Source of truth" },
      { value: "Zero", label: "Data loss" },
    ],
    testimonial: {
      quote:
        "For the first time the numbers actually add up at month-end. We stopped fighting our system and started running the business.",
      author: "Operations lead",
      role: "Anonymised client · Hospitality",
    },
    category: "enterprise",
    categoryLabel: "Enterprise · ERP",
    stack: [
      "Odoo 17",
      "Python",
      "PostgreSQL",
      "XML-RPC",
      "Custom modules",
    ],
    accentColor: "#8B5CF6",
    accentGlow: "rgba(139, 92, 246, 0.18)",
    featured: true,
    screens: [
      { id: "overview", label: "Overview" },
      { id: "modules", label: "Modules" },
      { id: "reports", label: "Reports" },
    ],
  },
  {
    id: "redrow",
    name: "Redrow Minimart",
    tagline: "Premium Daily Essentials",
    imagePath: "/images/projects/redrow.png",
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
/*
  {
    id: "ethika",
    name: "Ethika Finance",
    tagline: "Non-Interest Banking Hub",
    imagePath: "/images/projects/ethika.png",
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
    screens: [
      { id: "landing", label: "Home" },
      { id: "comparison", label: "NIB vs Conv." },
      { id: "vault", label: "Knowledge" },
    ],
    liveBaseUrl: "https://ethika.vercel.app",
    liveScreenPaths: { landing: "/", comparison: "/comparison", vault: "/vault" },
  },
*/
  {
    id: "anisfoods",
    name: "Anis Food & Drink",
    tagline: "Ghanaian Restaurant — POS & Back Office",
    imagePath: "/images/projects/anisfoods.jpg",
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
    liveBaseUrl: "https://aniseatery.netlify.app",
    liveScreenPaths: { landing: "/", pos: "/", dashboard: "/", reports: "/" },
  },
/*
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
    screens: [
      { id: "landing", label: "Home" },
      { id: "listings", label: "Listings" },
      { id: "detail", label: "Property" },
    ],
  },
*/
  // {
  //   id: "lenus",
  //   name: "Lenus Pharmacy",
  //   tagline: "Online Pharmacy & Delivery",
  //   description:
  //     "2000+ products, NEPP-registered, GhanaPostGPS delivery across Greater Accra, WhatsApp prescription handling. Branches in Botwe, Lakeside Estates, and Madina.",
  //   role: "Platform architecture & DX",
  //   impact: [
  //     "Structured pharmacy catalogue, search and checkout for walk‑in and delivery customers.",
  //     "Modelled branch operations and delivery zones around real Accra neighbourhoods.",
  //   ],
  //   category: "healthcare",
  //   categoryLabel: "Healthcare · E-Commerce",
  //   stack: ["Next.js 14", "Fastify", "Prisma", "PostgreSQL", "Turborepo"],
  //   accentColor: "#0d9488",
  //   accentGlow: "rgba(13, 148, 136, 0.15)",
  //   featured: true,
  //   screens: [
  //     { id: "landing", label: "Home" },
  //     { id: "shop", label: "Products" },
  //     { id: "checkout", label: "Checkout" },
  //   ],
  // },
  {
    id: "ladyangel",
    name: "Lady Angel Network",
    tagline: "Private Investment Network for Women",
    imagePath: "/images/projects/ladyangel.png",
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
    liveBaseUrl: "https://lady-angel.vercel.app",
    liveScreenPaths: { landing: "/", membership: "/membership", portfolio: "/portfolio" },
  },
  {
    id: "jireh",
    name: "Jireh Natural Foods",
    tagline: "Restaurant Website & Ordering Experience",
    imagePath: "/images/projects/jireh.jpg",
    year: "2024",
    location: "Accra · Ghana",
    services: ["Conversion UX", "Front-end", "Ordering journeys"],
    outcomes: [
      { value: "4", label: "Order channels" },
      { value: "1", label: "Menu narrative" },
    ],
    description:
      "Modern restaurant web experience for Jireh Natural Foods in Accra, blending menu discovery, direct ordering channels, and strong social proof for daily customers.",
    role: "Product design, front-end build & conversion UX",
    impact: [
      "Structured menu storytelling and CTAs for faster food discovery and order intent.",
      "Connected web traffic to direct channels (WhatsApp, call, Bolt Food, socials).",
    ],
    category: "restaurant",
    categoryLabel: "Restaurant · Branding",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide"],
    accentColor: "#5ecf4f",
    accentGlow: "rgba(94, 207, 79, 0.15)",
    featured: true,
    screens: [
      { id: "landing", label: "Home" },
      { id: "menu", label: "Menu" },
      { id: "contact", label: "Contact" },
    ],
    liveBaseUrl: "https://jirehnaturalfoods.vercel.app",
    liveScreenPaths: { landing: "/", menu: "/#menu", contact: "/#contact" },
  },
  {
    id: "madinabasketball",
    name: "Madina Basketball",
    tagline: "Community Court Platform",
    imagePath: "/images/projects/madinabasketball.png",
    year: "2024",
    location: "Madina · Ghana",
    services: ["Community ops", "Transparency dashboards", "Full-stack"],
    outcomes: [
      { value: "GHS 40K+", label: "Raised" },
      { value: "1", label: "Solar-powered court" },
    ],
    description:
      "Libya Quarters' solar-powered basketball court hub — event management, player registration, court booking, transparency reports, and team highlights for Zurak Basketball & Madina Old Gees.",
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
    liveBaseUrl: "https://madinabball.vercel.app",
    liveScreenPaths: { landing: "/", court: "/court", events: "/events" },
  },
  {
    id: "pronaj",
    name: "ProNaj International",
    tagline: "Multi-Sector Conglomerate",
    imagePath: "/images/projects/pronaj.png",
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
    liveBaseUrl: "https://pronaj.vercel.app",
    liveScreenPaths: { landing: "/", sectors: "/sectors", contact: "/contact" },
  },
/*
  {
    id: "makossa",
    name: "Makossa Shop",
    tagline: "Desktop POS & Inventory",
    description:
      "Cross-platform Electron desktop app for retail point-of-sale and inventory management. Runs fully offline with a local SQLite database — zero internet dependency.",
    role: "Desktop architecture & UX",
    impact: [
      "Designed offline‑first flows for power cuts and unstable internet.",
      "Structured inventory, cash and reporting views for small Ghanaian retailers.",
    ],
    category: "desktop",
    categoryLabel: "Desktop · Electron",
    stack: ["Electron", "React", "TypeScript", "better-sqlite3", "Tailwind CSS", "Vite"],
    accentColor: "#7C3AED",
    accentGlow: "rgba(124, 58, 237, 0.15)",
    featured: true,
    screens: [
      { id: "pos", label: "POS" },
      { id: "inventory", label: "Inventory" },
      { id: "reports", label: "Reports" },
    ],
  },
*/
  {
    id: "rockmotion",
    name: "Rockmotion Auto Group",
    tagline: "US Automotive Export Platform",
    imagePath: "/images/projects/rockmotion.png",
    year: "2025",
    location: "Atlanta → 40+ countries",
    services: ["Brand identity", "UX", "Full-stack engineering"],
    outcomes: [
      { value: "40+", label: "Countries served" },
      { value: "1", label: "Global export flow" },
    ],
    description:
      "Licensed US car dealer & broker — sources, verifies, and ships any American vehicle to 40+ countries. VIN history, crash analysis, port loading with marine insurance, and real-time tracking.",
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
    liveBaseUrl: "https://rockmotion.vercel.app",
    liveScreenPaths: { landing: "/", inventory: "/inventory", process: "/process" },
  },
/*
  {
    id: "gaskiya",
    name: "Gaskiya",
    tagline: "Luxury West African Fashion",
    description:
      "Premium African cultural attire — editorial collections by occasion (Eid, Weddings, Corporate, Holidays). DM Sans + Cormorant Garamond, global shipping, GDPR-compliant checkout.",
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
*/
/*
  {
    id: "thepalms",
    name: "The Palms by Eagles",
    tagline: "Luxury Hotel Website",
    description:
      "4-star Accra hotel — room gallery, amenities, 4.3★ Google rating, sticky booking CTA, and Maps integration. Opposite Association School, +233 55 661 6100.",
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
*/
  {
    id: "magilo",
    name: "Magilo Art College",
    tagline: "Art School, Design & Printing Hub",
    imagePath: "/images/projects/magilo.png",
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
