import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

type Item = { href: string; title: string; body: string; image: string };
type Copy = { title: string; description: string; lead: string; open: string; items: Item[] };

const IMAGES = ["/previews/ethika/tools.webp", "/lab/car-poster.webp", "/previews/makossa/landing.webp"];
const HREFS = ["/lab/model", "/lab/car", "/#map"];
const items = (rows: [string, string][]): Item[] => rows.map(([title, body], i) => ({ href: HREFS[i], image: IMAGES[i], title, body }));

const COPY: Record<string, Copy> = {
  en: {
    title: "Lab",
    description: "Working pieces from the studio: a three-statement model you can stress, a car you inspect, ship and cost the way Rockmotion's buyers do, and a map of where the work runs.",
    lead: "Working pieces that show how I think: models you can stress and machines you can take apart.",
    open: "Open",
    items: items([
      ["Three-statement model", "Five years of income statement, balance sheet and cash flow for an illustrative food company. Shock the cedi, rates or demand and watch the covenant."],
      ["Buy a car you haven't seen", "Rockmotion's export flow on a real car: check the VIN, inspect it panel by panel, follow it to your port and add up the landed cost."],
      ["Where the work runs", "Every shop, kitchen, court and college on the map, with what I built there."],
    ]),
  },
  fr: {
    title: "Labo",
    description: "Des pièces qui fonctionnent : un modèle à trois états financiers à mettre sous tension, une voiture à inspecter, expédier et chiffrer comme les acheteurs de Rockmotion, et la carte des lieux où le travail tourne.",
    lead: "Des pièces qui fonctionnent et montrent ma façon de penser : des modèles à mettre sous tension et des machines à démonter.",
    open: "Ouvrir",
    items: items([
      ["Modèle à trois états financiers", "Cinq ans de compte de résultat, de bilan et de flux de trésorerie pour une entreprise alimentaire fictive. Faites chuter le cedi, montez les taux ou la demande, et surveillez le covenant."],
      ["Acheter une voiture jamais vue", "Le parcours d'export de Rockmotion sur une vraie voiture : vérifiez le VIN, inspectez-la panneau par panneau, suivez-la jusqu'à votre port et calculez le coût rendu."],
      ["Là où le travail tourne", "Chaque boutique, cuisine, terrain et école sur la carte, avec ce que j'y ai construit."],
    ]),
  },
  ar: {
    title: "المختبر",
    description: "قطع تعمل من الاستوديو: نموذج للقوائم المالية الثلاث يمكنك اختباره، وسيارة تفحصها وتشحنها وتحسب تكلفتها كما يفعل مشترو Rockmotion، وخريطة لأماكن العمل.",
    lead: "قطع تعمل وتُظهر طريقة تفكيري: نماذج يمكنك اختبارها تحت الضغط، وآلات يمكنك تفكيكها.",
    open: "افتح",
    items: items([
      ["نموذج القوائم المالية الثلاث", "خمس سنوات من قائمة الدخل والميزانية والتدفقات النقدية لشركة أغذية توضيحية. اخفض قيمة السيدي أو ارفع الفائدة أو غيّر الطلب، وراقب التعهدات."],
      ["اشترِ سيارة لم ترها", "مسار التصدير لدى Rockmotion على سيارة حقيقية: تحقّق من رقم الهيكل، وافحصها لوحًا لوحًا، وتابعها حتى ميناءك، واحسب التكلفة الواصلة."],
      ["حيث تعمل الأنظمة", "كل متجر ومطبخ وملعب وكلية على الخريطة، مع ما بنيته هناك."],
    ]),
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = COPY[await getLocale()] ?? COPY.en;
  return { title: c.title, description: c.description };
}

export default async function LabPage() {
  const c = COPY[await getLocale()] ?? COPY.en;
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-display text-white" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            {c.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--ink-2)]">{c.lead}</p>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.items.map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="card card-link h-full">
                  <div className="card-media">
                    <Image src={x.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
                  </div>
                  <div className="card-pad">
                    <h2 className="card-title">{x.title}</h2>
                    <p className="card-text">{x.body}</p>
                    <span className="card-foot">
                      <span>{c.open}</span>
                      <ArrowUpRight className="card-arrow" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
