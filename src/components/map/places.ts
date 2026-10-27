import { projects, projectSlug } from "@/lib/projects";

const byId = (id: string) => projects.find((p) => p.id === id);

/**
 * Where the work runs. Coordinates are approximate to the neighbourhood,
 * not the door (see docs/site-brief.md section 7 to correct them).
 */
export interface Place {
  id: string;
  /** Project id in src/lib/projects.ts. */
  project: string;
  name: string;
  area: string;
  lng: number;
  lat: number;
  image: string;
  /** What we did there, in a few words. */
  shipped: string;
  abroad?: boolean;
}

export const PLACES: Place[] = [
  {
    id: "alboyut",
    project: "alboyut",
    name: "Al Boyut",
    area: "Lakeside Estate",
    lng: -0.129,
    lat: 5.687,
    image: "/previews/alboyut/landing.webp",
    shipped: "Identity, storefront, register, back office, An-Nur laundry counter and a verified Google listing",
  },
  {
    id: "delish",
    project: "enterprise-erp",
    name: "Delish",
    area: "University of Ghana, Legon",
    lng: -0.187,
    lat: 5.6506,
    image: "/previews/delish/site.webp",
    shipped: "Odoo ERP, recipe costing across 77 ingredients, ordering site",
  },
  {
    id: "madina",
    project: "madinabasketball",
    name: "Madina Basketball",
    area: "Libya Quarters, Madina",
    lng: -0.166,
    lat: 5.683,
    image: "/fieldkit/madina-court.webp",
    shipped: "Court platform for bookings, events and transparency reports. GHS 40K+ raised from 11 donors",
  },
  {
    id: "zainas",
    project: "zainas",
    name: "Zaina's Couture",
    area: "Adenta",
    lng: -0.159,
    lat: 5.709,
    image: "/previews/zainas/landing.webp",
    shipped: "Boutique storefront and owner catalogue",
  },
  {
    id: "jireh",
    project: "jireh",
    name: "Jireh Natural Foods",
    area: "Adenta",
    lng: -0.165,
    lat: 5.705,
    image: "/previews/jireh/landing.webp",
    shipped: "Ordering site, cashier POS, back office",
  },
  {
    id: "makossa",
    project: "makossa",
    name: "The Makossa Shop",
    area: "Adenta Housing Down",
    lng: -0.156,
    lat: 5.701,
    image: "/previews/makossa/landing.webp",
    shipped: "Mini mart aisles online, baskets sent on WhatsApp, collected in store",
  },
  {
    id: "magilo",
    project: "magilo",
    name: "Magilo Art College",
    area: "Adenta",
    lng: -0.152,
    lat: 5.716,
    image: "/previews/magilo/landing.webp",
    shipped: "Site for the art school and print studio",
  },
  {
    id: "munamuse",
    project: "munamuse",
    name: "Muna Muse",
    area: "New York",
    lng: -74.006,
    lat: 40.7128,
    image: "/previews/munamuse/landing.webp",
    shipped: "WhatsApp-first storefront shipping from New York to the US and Ghana",
    abroad: true,
  },
  {
    id: "rockmotion",
    project: "rockmotion",
    name: "Rockmotion Auto Group",
    area: "Atlanta",
    lng: -84.388,
    lat: 33.749,
    image: "/previews/rockmotion/landing.webp",
    shipped: "Export platform for a US dealer shipping to 40+ countries",
    abroad: true,
  },
];

export function placeHref(p: Place) {
  const project = byId(p.project);
  return project ? `/work/${projectSlug(project)}` : "/work";
}

export function placeTagline(p: Place) {
  return byId(p.project)?.tagline ?? "";
}

export function mapsSearch(p: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.area}`)}`;
}

export const ACCRA = PLACES.filter((p) => !p.abroad);
