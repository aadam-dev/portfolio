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
  category: ProjectCategory;
  categoryLabel: string;
  stack: string[];
  screens: ProjectScreen[];
  accentColor: string;
  accentGlow: string;
  featured?: boolean;
  isLead?: boolean;
}

export const projects: Project[] = [
  {
    id: "koyi",
    name: "Kōyi",
    tagline: "Online Learning Platform",
    description:
      "LMS built for Ghana and West Africa — WASSCE, BECE, university bridging, and career courses. Multilingual (EN/FR/AR), video streaming, certificates, and role-based access.",
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
    id: "primehub",
    name: "PrimeHub",
    tagline: "B2B Building Materials Platform",
    description:
      "Procurement command center for Ghanaian contractors. Source building materials, generate proformas, manage approvals, and track deliveries — all in one platform.",
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
  },
  {
    id: "ethika",
    name: "Ethika Finance",
    tagline: "Non-Interest Banking Hub",
    description:
      "West Africa's definitive resource for non-interest banking (NIB). Bank of Ghana regulatory guidance, NIB vs conventional banking comparisons, and bilingual (EN/FR) education.",
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
  },
  {
    id: "anisfoods",
    name: "Anis Food & Drink",
    tagline: "Ghanaian Restaurant — POS & Back Office",
    description:
      "Public website, cashier POS, and full back-office suite for an Accra restaurant. Real-time orders, financial reports (P&L, cash flow, payroll), multi-role access.",
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
  },
  {
    id: "rentcheck",
    name: "Rentcheck Ghana",
    tagline: "Verified Rental Platform",
    description:
      "Scout-inspected listings, Ghana Card KYC, viewing-fee escrow, utility bill transparency, landlord ratings, and digital tenancy agreements for the Accra rental market.",
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
  {
    id: "lenus",
    name: "Lenus Pharmacy",
    tagline: "Online Pharmacy & Delivery",
    description:
      "2000+ products, NEPP-registered, GhanaPostGPS delivery across Greater Accra, WhatsApp prescription handling. Branches in Botwe, Lakeside Estates, and Madina.",
    category: "healthcare",
    categoryLabel: "Healthcare · E-Commerce",
    stack: ["Next.js 14", "Fastify", "Prisma", "PostgreSQL", "Turborepo"],
    accentColor: "#0d9488",
    accentGlow: "rgba(13, 148, 136, 0.15)",
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
    description:
      "Invitation-only platform for women deploying capital into women-led ventures. Structured deal flow pipeline, 5 investment models, mentorship bootcamps, and a Pan-African portfolio.",
    category: "community",
    categoryLabel: "Finance · Investment",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Playfair Display"],
    accentColor: "#FB7C06",
    accentGlow: "rgba(251, 124, 6, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "membership", label: "Membership" },
      { id: "portfolio", label: "Portfolio" },
    ],
  },
  {
    id: "madinabasketball",
    name: "Madina Basketball",
    tagline: "Community Court Platform",
    description:
      "Libya Quarters' solar-powered basketball court hub — event management, player registration, court booking, transparency reports, and team highlights for Zurak Basketball & Madina Old Gees.",
    category: "sports",
    categoryLabel: "Sports · Community",
    stack: ["Next.js 14", "TypeScript", "Supabase", "react-youtube", "html2canvas", "jspdf"],
    accentColor: "#EAB308",
    accentGlow: "rgba(234, 179, 8, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "court", label: "The Court" },
      { id: "events", label: "Events" },
    ],
  },
  {
    id: "pronaj",
    name: "ProNaj International",
    tagline: "Multi-Sector Conglomerate",
    description:
      "Delaware–Ghana conglomerate spanning Digital (IT services), Living (modular housing), and Global (agri-trade & export). 3 sectors, 2 continents, 25+ markets.",
    category: "corporate",
    categoryLabel: "Corporate · Branding",
    stack: ["Next.js 14", "Framer Motion", "Tailwind v4", "shadcn/ui", "Satoshi"],
    accentColor: "#2563EB",
    accentGlow: "rgba(37, 99, 235, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "sectors", label: "Sectors" },
      { id: "contact", label: "Contact" },
    ],
  },
  {
    id: "makossa",
    name: "Makossa Shop",
    tagline: "Desktop POS & Inventory",
    description:
      "Cross-platform Electron desktop app for retail point-of-sale and inventory management. Runs fully offline with a local SQLite database — zero internet dependency.",
    category: "desktop",
    categoryLabel: "Desktop · Electron",
    stack: ["Electron", "React", "TypeScript", "better-sqlite3", "Tailwind CSS", "Vite"],
    accentColor: "#7C3AED",
    accentGlow: "rgba(124, 58, 237, 0.15)",
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
    name: "The Palms by Eagles",
    tagline: "Luxury Hotel Website",
    description:
      "4-star Accra hotel — room gallery, amenities, 4.3★ Google rating, sticky booking CTA, and Maps integration. Opposite Association School, +233 55 661 6100.",
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
    description:
      "25+ years of creative excellence in Adenta, Accra. SHS Visual Arts support, graphic design training, industrial printing, business consulting. 1000+ projects, 500+ clients.",
    category: "creative",
    categoryLabel: "Creative · Education",
    stack: ["Next.js 14", "React", "Tailwind CSS", "Framer Motion", "Inter/Montserrat"],
    accentColor: "#EA580C",
    accentGlow: "rgba(234, 88, 12, 0.15)",
    screens: [
      { id: "landing", label: "Home" },
      { id: "services", label: "Services" },
      { id: "college", label: "College" },
    ],
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
