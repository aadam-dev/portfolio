export type ProjectCategory =
  | "edtech"
  | "fintech"
  | "ecommerce"
  | "proptech"
  | "restaurant"
  | "sports"
  | "corporate"
  | "desktop"
  | "healthcare"
  | "hospitality"
  | "fashion"
  | "community"
  | "creative";

export interface ProjectScreen {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  role?: string;
  impact?: string[];
  category: ProjectCategory;
  categoryLabel: string;
  stack: string[];
  screens: ProjectScreen[];
  accentColor: string;
  accentGlow: string;
  featured?: boolean;
  isLead?: boolean;
  /** When set, modal can show the real site in an iframe (exact homepage/logos/media). */
  liveBaseUrl?: string;
  /** Map screen id → path (e.g. landing → "/", courses → "/courses"). Used with liveBaseUrl for iframe. */
  liveScreenPaths?: Record<string, string>;
}

export const projects: Project[] = [
  {
    id: "koyi",
    name: "Kōyi",
    tagline: "Online Learning Platform",
    description:
      "LMS built for Ghana and West Africa — WASSCE, BECE, university bridging, and career courses. Multilingual (EN/FR/AR), video streaming, certificates, and role-based access.",
    role: "Product strategist & full‑stack developer",
    impact: [
      "Designed the academic pathways and course structure with Ghanaian teachers.",
      "Prototyped the full LMS flows end‑to‑end (student, tutor, admin).",
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
    liveBaseUrl: "https://koyiacademy.com",
    liveScreenPaths: { landing: "/", courses: "/courses", lesson: "/learn/wassce-maths/lesson-3", dashboard: "/dashboard" },
  },
  {
    id: "primehub",
    name: "PrimeHub",
    tagline: "B2B Building Materials Platform",
    description:
      "Procurement command center for Ghanaian contractors. Source building materials, generate proformas, manage approvals, and track deliveries — all in one platform.",
    role: "Product, architecture & procurement workflows",
    impact: [
      "Modelled approval and proforma flows around how contractors actually work on site.",
      "Designed inventory cards and quote builder for fast estimation during client calls.",
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
    liveBaseUrl: "https://primehub.com.gh",
    liveScreenPaths: { landing: "/", products: "/products", quote: "/quote/new" },
  },
  {
    id: "ethika",
    name: "Ethika Finance",
    tagline: "Non-Interest Banking Hub",
    description:
      "West Africa's definitive resource for non-interest banking (NIB). Bank of Ghana regulatory guidance, NIB vs conventional banking comparisons, and bilingual (EN/FR) education.",
    role: "Researcher, information architect & engineer",
    impact: [
      "Translated BoG’s NIB framework into simple, side‑by‑side explanations.",
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
    liveBaseUrl: "https://ethikawestafrica.com",
    liveScreenPaths: { landing: "/", comparison: "/compare", vault: "/knowledge" },
  },
  {
    id: "anisfoods",
    name: "Anis Food & Drink",
    tagline: "Ghanaian Restaurant — POS & Back Office",
    description:
      "Public website, cashier POS, and full back-office suite for an Accra restaurant. Real-time orders, financial reports (P&L, cash flow, payroll), multi-role access.",
    role: "Systems designer & full‑stack implementer",
    impact: [
      "Designed POS, reporting and kitchen flows directly from the owner’s daily operations.",
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
    liveScreenPaths: { landing: "/", pos: "/pos/cashier", dashboard: "/dashboard", reports: "/reports/monthly" },
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
    screens: [
      { id: "landing", label: "Home" },
      { id: "listings", label: "Listings" },
      { id: "detail", label: "Property" },
    ],
    liveBaseUrl: "https://rentcheck.com.gh",
    liveScreenPaths: { landing: "/", listings: "/listings", detail: "/property/akr-2024-007" },
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
    liveBaseUrl: "https://lenuspharmacy.com.gh",
    liveScreenPaths: { landing: "/", shop: "/shop", checkout: "/checkout" },
  },
  {
    id: "ladyangel",
    name: "Lady Angel Network",
    tagline: "Private Investment Network for Women",
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
    liveBaseUrl: "https://ladyangel.vercel.app",
    liveScreenPaths: { landing: "/", membership: "/membership", portfolio: "/portfolio" },
  },
  {
    id: "madinabasketball",
    name: "Madina Basketball",
    tagline: "Community Court Platform",
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
    liveBaseUrl: "https://pronajinternational.com",
    liveScreenPaths: { landing: "/", sectors: "/sectors", contact: "/contact" },
  },
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
    liveBaseUrl: "https://gaskiya.com",
    liveScreenPaths: { landing: "/", collections: "/collections", product: "/products/eid-collection-001" },
  },
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
    liveBaseUrl: "https://thepalmsbyeagles.com",
    liveScreenPaths: { landing: "/", rooms: "/rooms", amenities: "/amenities" },
  },
  {
    id: "magilo",
    name: "Magilo Art College",
    tagline: "Art School, Design & Printing Hub",
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
    liveBaseUrl: "https://magilo.com.gh",
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
  desktop: "#7C3AED",
  healthcare: "#0d9488",
  hospitality: "#0D9488",
  fashion: "#D4AF37",
  community: "#FB7C06",
  creative: "#EA580C",
};
