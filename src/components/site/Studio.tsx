"use client";

import InViewVideo from "@/components/ui/InViewVideo";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";

/**
 * Studio: brand, product, copy and motion work. Cards stack as you scroll, each pinned a little
 * lower than the last. Only verified work: Bloom Boba is shipped; Yeskoko packaging is in progress.
 */
const CARDS = [
  {
    id: "bloom",
    kicker: "01 · Shipped · Concept brand",
    title: "Bloom Boba",
    line: "A drinks brand built to feel photographed, not coded.",
    body: "Art direction on one locked dark set, an AI photography pipeline (40+ matched stills), a nine-beat scroll film, a make-your-own builder with a 3D shake, and the copy that sells it.",
    steps: ["Brief", "Art direction", "AI photography", "Scroll film", "Builder + 3D", "Copy"],
    media: ["/studio/bloom-film-milk.webp", "/studio/bloom-builder-taro.webp", "/studio/bloom-flavour-mango.webp"],
    links: [
      { label: "Case study", href: "/work/bloom-boba" },
      { label: "Live site", href: "https://bloom-boba.vercel.app" },
    ],
    tone: "#140c08",
  },
  {
    id: "yeskoko",
    kicker: "02 · In progress · Packaging",
    title: "Yeskoko",
    line: "Ghanaian dried fruit, packed to stand out on a foreign shelf.",
    body: "An export-first pack system and a tree-to-crisp product film for Edis Mart's snack brand: clear labels per fruit, one visual language from pouch to storefront.",
    steps: ["Shelf audit", "Pack system", "Product film", "Storefront"],
    media: ["/studio/yeskoko-pack.webp", "/studio/yeskoko-mango.webp"],
    links: [],
    tone: "#173b2a",
  },
  {
    id: "motion",
    kicker: "03 · Motion",
    title: "Films for launches",
    line: "Scroll films, product videos and walkthrough reels.",
    body: "Every build ships with motion: a recorded walkthrough, a scroll-scrubbed film or a short launch reel cut for socials. Silent by default, sharp at any size.",
    steps: ["Scroll films", "Product video", "Walkthrough reels", "Social cuts"],
    video: "/studio/bloom-film-loop.mp4",
    poster: "/studio/bloom-film-loop.webp",
    media: [],
    links: [{ label: "Watch the boba film", href: "/work/bloom-boba#walkthrough" }],
    tone: "#1c1712",
  },
  {
    id: "copy",
    kicker: "04 · Copywriting",
    title: "Words that do the selling",
    line: "The generic line, and the one I wrote instead.",
    pairs: [
      ["Bubble tea, smoothies & more", "Built from the bottom up."],
      ["Our tapioca is made fresh daily", "The pearl is the point."],
      ["Quality dried fruit from Ghana", "Dried in Ghana. Distinct on shelf."],
    ],
    steps: ["Positioning", "Headlines", "Product copy", "Microcopy"],
    media: [],
    links: [],
    tone: "#241a12",
  },
] as const;

type CardCopy = { kicker: string; line: string; body?: string; steps: string[]; links?: string[] };
const L10N: Record<string, { eyebrow: string; title: string; accent: string; intro: string; cards: Record<string, CardCopy> }> = {
  fr: {
    eyebrow: "Studio · Marque, produit et motion",
    title: "Au-delà du code\u00a0:",
    accent: "des marques qu'on a envie de photographier.",
    intro: "La personne qui construit le système peut aussi diriger la marque, écrire les textes et monter le film de lancement. Moins de passages de relais, et un produit aussi beau qu'efficace.",
    cards: {
      bloom: { kicker: "01 · Livré · Marque concept", line: "Une marque de boissons pensée pour sembler photographiée, pas codée.", body: "Direction artistique sur un seul décor sombre, une chaîne de photographie par IA (plus de 40 images assorties), un film au défilement en neuf temps, un configurateur avec shaker en 3D, et les textes qui la vendent.", steps: ["Brief", "Direction artistique", "Photo IA", "Film au défilement", "Configurateur + 3D", "Rédaction"], links: ["Étude de cas", "Site en ligne"] },
      yeskoko: { kicker: "02 · En cours · Emballage", line: "Des fruits séchés du Ghana, emballés pour se démarquer dans un rayon étranger.", body: "Un système d'emballage pensé pour l'export et un film produit de l'arbre au croquant pour la marque de snacks d'Edis Mart : une étiquette claire par fruit, un même langage visuel du sachet à la boutique.", steps: ["Audit des rayons", "Système d'emballage", "Film produit", "Boutique en ligne"] },
      motion: { kicker: "03 · Motion", line: "Films au défilement, vidéos produit et démonstrations.", body: "Chaque projet sort avec du mouvement : une démonstration enregistrée, un film au défilement ou une courte vidéo de lancement pour les réseaux. Muet par défaut, net à toutes les tailles.", steps: ["Films au défilement", "Vidéo produit", "Démonstrations", "Formats réseaux"], links: ["Voir le film boba"] },
      copy: { kicker: "04 · Rédaction", line: "La phrase générique, et celle que j'ai écrite à la place.", steps: ["Positionnement", "Titres", "Textes produit", "Microcopie"] },
    },
  },
  ar: {
    eyebrow: "الاستوديو · هوية ومنتج وحركة",
    title: "ما بعد الشيفرة:",
    accent: "علامات يرغب الناس في تصويرها.",
    intro: "الشخص الذي يبني النظام يستطيع أيضاً إدارة الهوية فنياً وكتابة النصوص ومونتاج فيلم الإطلاق. انتقالات أقل بين الأيدي، ومنتج يبدو جميلاً بقدر ما يعمل جيداً.",
    cards: {
      bloom: { kicker: "01 · منجز · علامة تجريبية", line: "علامة مشروبات مصمَّمة لتبدو مصوَّرة لا مبرمجة.", body: "إدارة فنية على ديكور داكن واحد، وسلسلة تصوير بالذكاء الاصطناعي (أكثر من 40 صورة متناسقة)، وفيلم تمرير من تسعة مشاهد، ومُنشئ مشروبات مع رجّ ثلاثي الأبعاد، والنصوص التي تبيعها.", steps: ["الموجز", "الإدارة الفنية", "تصوير بالذكاء الاصطناعي", "فيلم التمرير", "المُنشئ + ثلاثي الأبعاد", "الكتابة"], links: ["دراسة الحالة", "الموقع المباشر"] },
      yeskoko: { kicker: "02 · قيد العمل · تغليف", line: "فواكه مجففة من غانا، مغلّفة لتلفت النظر على رف أجنبي.", body: "نظام تغليف موجّه للتصدير وفيلم منتج من الشجرة إلى القرمشة لعلامة الوجبات الخفيفة لدى Edis Mart: ملصق واضح لكل فاكهة، ولغة بصرية واحدة من العبوة إلى المتجر.", steps: ["تدقيق الرفوف", "نظام التغليف", "فيلم المنتج", "المتجر الإلكتروني"] },
      motion: { kicker: "03 · الحركة", line: "أفلام التمرير وفيديوهات المنتج وعروض الاستخدام.", body: "كل مشروع يُطلق ومعه حركة: عرض استخدام مسجّل، أو فيلم تمرير، أو مقطع إطلاق قصير لوسائل التواصل. صامت افتراضياً، وحادّ بأي حجم.", steps: ["أفلام التمرير", "فيديو المنتج", "عروض الاستخدام", "مقاطع التواصل"], links: ["شاهد فيلم البوبا"] },
      copy: { kicker: "04 · الكتابة الإعلانية", line: "الجملة العامة، والجملة التي كتبتها بدلاً منها.", steps: ["التموضع", "العناوين", "نصوص المنتج", "النصوص الدقيقة"] },
    },
  },
};

export default function Studio() {
  const l = L10N[useLocale()];
  const card = (c: (typeof CARDS)[number]) => {
    const t = l?.cards[c.id];
    if (!t) return c;
    return { ...c, kicker: t.kicker, line: t.line, ...(t.body && "body" in c ? { body: t.body } : {}), steps: t.steps, links: c.links.map((k, i) => ({ ...k, label: t.links?.[i] ?? k.label })) };
  };
  return (
    <section id="studio" aria-labelledby="studio-heading" className="relative border-t border-[var(--line)] px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">{l?.eyebrow ?? "Studio · Brand, product & motion"}</p>
            <h2 id="studio-heading" className="font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}>
              {l?.title ?? "Beyond the code:"} <span className="font-serif-it text-[var(--ink-2)]">{l?.accent ?? "brands people want to photograph."}</span>
            </h2>
          </div>
          <p className="text-[15px] leading-[1.65] text-[var(--ink-2)] md:col-span-4 md:col-start-9 md:self-end md:text-[16px]">
            {l?.intro ?? "The same person who builds the system can art-direct the brand, write the words and cut the launch film. That's fewer handoffs and a product that looks as good as it works."}
          </p>
        </div>

        <div className="space-y-6">
          {CARDS.map(card).map((c, i) => (
            <article
              key={c.id}
              className="theme-fixed sticky overflow-hidden rounded-[28px] border border-white/10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
              style={{ top: `calc(84px + ${i * 22}px)`, background: c.tone }}
            >
              <div className="grid min-h-[min(78svh,680px)] gap-0 md:grid-cols-[1fr_1.15fr]">
                <div className="flex flex-col justify-between p-7 md:p-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#ff8a5c]">{c.kicker}</p>
                    <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.98]" style={{ letterSpacing: "-0.03em" }}>
                      {c.title}
                    </h3>
                    <p className="mt-3 font-serif-it text-[clamp(1.1rem,1.6vw,1.4rem)] text-white/75">{c.line}</p>
                    {"body" in c && <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-white/70">{c.body}</p>}
                    {"pairs" in c && (
                      <ul className="mt-6 space-y-4">
                        {c.pairs.map(([before, after]) => (
                          <li key={after} className="border-t border-white/10 pt-4">
                            <p className="text-[13px] text-white/40 line-through decoration-white/25">{before}</p>
                            <p className="mt-1 font-display text-[clamp(1.3rem,2vw,1.8rem)] leading-tight">{after}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-8">
                    <ul className="flex flex-wrap gap-2">
                      {c.steps.map((s, k) => (
                        <li key={s} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/70">
                          <span className="mr-1.5 text-[#ff8a5c]">{k + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                    {c.links.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {c.links.map((l) =>
                          l.href.startsWith("http") ? (
                            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-[13px] hover:bg-white/10">
                              {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <Link key={l.label} href={l.href} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-black">
                              {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* media */}
                <div className="relative min-h-[300px] overflow-hidden">
                  {"video" in c ? (
                    <InViewVideo src={c.video} poster={c.poster} className="absolute inset-0 h-full w-full object-cover" />
                  ) : c.media.length ? (
                    <div className={`absolute inset-0 grid gap-1 ${c.media.length === 3 ? "grid-cols-2 grid-rows-2" : "grid-cols-1 grid-rows-2"}`}>
                      {c.media.map((m, k) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={m} src={m} alt="" loading="lazy" className={`h-full w-full object-cover ${c.media.length === 3 && k === 0 ? "col-span-2" : ""}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center p-10">
                      <p className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] text-white/90" style={{ letterSpacing: "-0.03em" }}>
                        &ldquo;The pearl is <span className="font-serif-it text-[#ff8a5c]">the point.</span>&rdquo;
                      </p>
                    </div>
                  )}
                  {c.id === "yeskoko" && (
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white backdrop-blur">In progress</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
