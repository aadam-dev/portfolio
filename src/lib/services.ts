/** One source for services: the Services section, Aadam OS (Services.notes) and the phone's Notes app. */

export interface Service {
  n: string;
  key: "strategy" | "build" | "data" | "brand" | "growth" | "erp";
  title: string;
  short: string;
  body: string;
  meta: string;
  proof?: { label: string; href: string };
}

export const SERVICES: Service[] = [
  {
    n: "01",
    key: "strategy",
    title: "Product strategy & architecture",
    short: "From a vague brief to a plan you can ship.",
    body: "I start by sitting in: how the work really happens, where money and stock leak, what the team actually needs. Then a concrete product plan: business model, information architecture and the shortest path to something shippable.",
    meta: "Discovery · IA · Technical planning",
  },
  {
    n: "02",
    key: "build",
    title: "Design & engineering",
    short: "Editorial interfaces, production code, shipped weekly.",
    body: "Editorial-grade interfaces and production-grade code from the same hands. Web and mobile in Next.js, TypeScript and Postgres. Shipped weekly, accessible by default, documented so your team can carry it.",
    meta: "Web · Mobile · Interface systems",
    proof: { label: "PrimeTijara", href: "/work/primetijara" },
  },
  {
    n: "03",
    key: "data",
    title: "Data & business analysis",
    short: "Turning spreadsheets and gut-feel into decisions.",
    body: "Cash flow, cohort behaviour, funnel diagnostics, P&L reconstruction. Dashboards that answer the question the owner keeps asking, and numbers you can defend in a board room.",
    meta: "Modelling · Dashboards · Diligence",
  },
  {
    n: "04",
    key: "brand",
    title: "Brand, content & motion",
    short: "Art direction, copy, packaging and motion films.",
    body: "Identity, copywriting, packaging and art-directed photography, plus motion: scroll films, product videos and launch reels. Bloom Boba is the proof on the shelf; Yeskoko packaging is on the bench.",
    meta: "Identity · Copy · Packaging · Motion video",
    proof: { label: "Bloom Boba", href: "/work/bloom-boba" },
  },
  {
    n: "05",
    key: "growth",
    title: "Digital marketing & growth",
    short: "Launches, SEO, paid and email, built into the product.",
    body: "Positioning, launch campaigns, SEO, paid acquisition, email and content loops. Treated as part of the product from day one, not bolted on after launch.",
    meta: "SEO · Paid · Email · Content",
  },
  {
    n: "06",
    key: "erp",
    title: "ERP & operations: Odoo or custom",
    short: "One source of truth for stock, sales and cash.",
    body: "Replace disconnected spreadsheets and failing POS systems with one source of truth. Odoo configuration and custom modules, data migration and staff training, or a custom system built from scratch.",
    meta: "Odoo · Custom ERP · Migration",
    proof: { label: "Al Boyut", href: "/work/al-boyut" },
  },
];

/** The forward-deployed method: how an engagement actually runs. */
export const METHOD = [
  { step: "Sit in", line: "Shadow the floor, the counter, the finance desk." },
  { step: "Study", line: "Map how money, stock and people really move." },
  { step: "Document", line: "Write it down: flows, specs, decisions." },
  { step: "Build", line: "Ship weekly, in front of the people who use it." },
  { step: "Monitor", line: "Watch the numbers and the floor after launch." },
  { step: "Hand over", line: "Runbooks and training so your team owns it." },
];

/** How remote work runs, for clients outside Ghana. */
export const REMOTE = [
  { k: "GMT+0", v: "Full European workday overlap, US East mornings" },
  { k: "Weekly", v: "Live demo every week, written update every Friday" },
  { k: "Written", v: "Specs, decisions and runbooks your team keeps" },
  { k: "On site", v: "Embedded in person for launches when it matters" },
];

/* ------------------------------------------------------------------ French and Arabic */

type ServiceCopy = Pick<Service, "title" | "short" | "body" | "meta">;

const SERVICES_FR: Record<Service["key"], ServiceCopy> = {
  strategy: { title: "Stratégie produit et architecture", short: "D'un brief flou à un plan livrable.", body: "Je commence par m'installer avec vous : comment le travail se fait vraiment, où l'argent et le stock fuient, ce dont l'équipe a réellement besoin. Puis un plan produit concret : modèle économique, architecture de l'information et le chemin le plus court vers quelque chose de livrable.", meta: "Découverte · Architecture · Planification technique" },
  build: { title: "Design et ingénierie", short: "Interfaces soignées, code de production, livré chaque semaine.", body: "Des interfaces de qualité éditoriale et du code de qualité production, des mêmes mains. Web et mobile en Next.js, TypeScript et Postgres. Livré chaque semaine, accessible par défaut, documenté pour que votre équipe puisse le reprendre.", meta: "Web · Mobile · Systèmes d'interface" },
  data: { title: "Analyse de données et d'activité", short: "Transformer tableurs et intuitions en décisions.", body: "Trésorerie, comportement des cohortes, diagnostic des tunnels, reconstruction du compte de résultat. Des tableaux de bord qui répondent à la question que le dirigeant pose sans cesse, et des chiffres défendables en conseil d'administration.", meta: "Modélisation · Tableaux de bord · Due diligence" },
  brand: { title: "Marque, contenu et motion", short: "Direction artistique, rédaction, emballage et films.", body: "Identité, rédaction, emballage et photographie dirigée, plus la motion : films au défilement, vidéos produit et bandes-annonces de lancement. Bloom Boba en est la preuve en rayon ; les emballages Yeskoko sont sur l'établi.", meta: "Identité · Rédaction · Emballage · Vidéo" },
  growth: { title: "Marketing digital et croissance", short: "Lancements, SEO, publicité et e-mail, intégrés au produit.", body: "Positionnement, campagnes de lancement, SEO, acquisition payante, e-mail et boucles de contenu. Traités comme une partie du produit dès le premier jour, pas ajoutés après le lancement.", meta: "SEO · Publicité · E-mail · Contenu" },
  erp: { title: "ERP et opérations : Odoo ou sur mesure", short: "Une seule source de vérité pour le stock, les ventes et la trésorerie.", body: "Remplacer des tableurs déconnectés et des caisses défaillantes par une seule source de vérité. Configuration et modules Odoo sur mesure, migration des données et formation des équipes, ou un système construit de zéro.", meta: "Odoo · ERP sur mesure · Migration" },
};

const SERVICES_AR: Record<Service["key"], ServiceCopy> = {
  strategy: { title: "استراتيجية المنتج وبنيته", short: "من فكرة غامضة إلى خطة قابلة للتنفيذ.", body: "أبدأ بالجلوس معكم: كيف يجري العمل فعلاً، وأين يتسرّب المال والمخزون، وما الذي يحتاجه الفريق حقاً. ثم خطة منتج ملموسة: نموذج العمل، وبنية المعلومات، وأقصر طريق إلى شيء قابل للإطلاق.", meta: "استكشاف · بنية المعلومات · تخطيط تقني" },
  build: { title: "التصميم والهندسة", short: "واجهات متقنة وشيفرة إنتاجية، تُسلَّم كل أسبوع.", body: "واجهات بجودة تحريرية وشيفرة بجودة الإنتاج من اليدين نفسيهما. ويب وجوّال بـ Next.js وTypeScript وPostgres. تُسلَّم أسبوعياً، وسهلة الوصول افتراضياً، وموثّقة ليتمكّن فريقك من حملها.", meta: "ويب · جوّال · أنظمة الواجهات" },
  data: { title: "تحليل البيانات والأعمال", short: "تحويل الجداول والحدس إلى قرارات.", body: "التدفق النقدي، وسلوك الشرائح، وتشخيص مسارات التحويل، وإعادة بناء قائمة الأرباح والخسائر. لوحات تجيب عن السؤال الذي يكرّره المالك، وأرقام يمكنك الدفاع عنها أمام مجلس الإدارة.", meta: "نمذجة · لوحات معلومات · فحص نافي للجهالة" },
  brand: { title: "الهوية والمحتوى والحركة", short: "إدارة فنية وكتابة وتغليف وأفلام.", body: "هوية وكتابة إعلانية وتغليف وتصوير بإدارة فنية، إضافة إلى الحركة: أفلام التمرير وفيديوهات المنتج ومقاطع الإطلاق. Bloom Boba هو الدليل على الرف، وعبوات Yeskoko على طاولة العمل.", meta: "هوية · كتابة · تغليف · فيديو" },
  growth: { title: "التسويق الرقمي والنمو", short: "الإطلاق وتحسين البحث والإعلانات والبريد، جزء من المنتج.", body: "التموضع وحملات الإطلاق وتحسين محركات البحث والاستحواذ المدفوع والبريد الإلكتروني وحلقات المحتوى. تُعامَل كجزء من المنتج منذ اليوم الأول، لا كإضافة بعد الإطلاق.", meta: "تحسين البحث · إعلانات · بريد · محتوى" },
  erp: { title: "تخطيط الموارد والعمليات: Odoo أو نظام مخصّص", short: "مصدر واحد للحقيقة للمخزون والمبيعات والنقد.", body: "استبدال الجداول المتفرّقة وأنظمة نقاط البيع المتعثّرة بمصدر واحد للحقيقة. إعداد Odoo ووحدات مخصّصة، ونقل البيانات وتدريب الموظفين، أو نظام مبني من الصفر.", meta: "Odoo · نظام مخصّص · نقل البيانات" },
};

const METHOD_FR = [
  { step: "S'installer", line: "Suivre le terrain, le comptoir, la comptabilité." },
  { step: "Étudier", line: "Cartographier comment l'argent, le stock et les gens circulent." },
  { step: "Documenter", line: "Tout écrire : flux, spécifications, décisions." },
  { step: "Construire", line: "Livrer chaque semaine, devant ceux qui l'utilisent." },
  { step: "Suivre", line: "Surveiller les chiffres et le terrain après le lancement." },
  { step: "Transmettre", line: "Guides et formation pour que votre équipe en soit maître." },
];
const METHOD_AR = [
  { step: "الجلوس معكم", line: "مرافقة العمل في الميدان والكاونتر والمحاسبة." },
  { step: "الدراسة", line: "رسم كيف تتحرك الأموال والمخزون والناس فعلاً." },
  { step: "التوثيق", line: "تدوين كل شيء: المسارات والمواصفات والقرارات." },
  { step: "البناء", line: "تسليم أسبوعي أمام من يستخدمونه." },
  { step: "المتابعة", line: "مراقبة الأرقام والميدان بعد الإطلاق." },
  { step: "التسليم", line: "أدلة وتدريب ليصبح فريقك صاحب النظام." },
];
const REMOTE_FR = [
  { k: "GMT+0", v: "Toute la journée européenne, et les matinées de la côte Est" },
  { k: "Chaque semaine", v: "Démo en direct chaque semaine, point écrit chaque vendredi" },
  { k: "Par écrit", v: "Spécifications, décisions et guides que votre équipe garde" },
  { k: "Sur place", v: "Présent en personne pour les lancements qui comptent" },
];
const REMOTE_AR = [
  { k: "GMT+0", v: "يوم العمل الأوروبي كاملاً، وصباح الساحل الشرقي الأمريكي" },
  { k: "أسبوعياً", v: "عرض مباشر كل أسبوع، وتقرير مكتوب كل جمعة" },
  { k: "مكتوباً", v: "مواصفات وقرارات وأدلة يحتفظ بها فريقك" },
  { k: "في الموقع", v: "حضور شخصي في عمليات الإطلاق المهمة" },
];

export const SERVICES_COPY = {
  en: { intro: "Most teams hand you off between strategy, design, engineering, data, brand and marketing. I work forward deployed: I sit in with your team, study how the work really happens, write it down, build the system, then watch it until the numbers move. One person from the business case to the code to the launch film. Fewer seams, faster decisions, better work.", remoteEyebrow: "Remote, worldwide", remoteTitle: "Accra is GMT+0.", remoteAccent: "Your morning is my morning.", see: "See", isNew: "New" },
  fr: { intro: "La plupart des équipes vous font passer de main en main entre stratégie, design, ingénierie, données, marque et marketing. Je travaille sur le terrain : je m'installe avec votre équipe, j'étudie comment le travail se fait vraiment, je l'écris, je construis le système, puis je le suis jusqu'à ce que les chiffres bougent. Une seule personne du business case au code et au film de lancement. Moins de coutures, des décisions plus rapides, un meilleur travail.", remoteEyebrow: "À distance, partout", remoteTitle: "Accra est en GMT+0.", remoteAccent: "Votre matin est mon matin.", see: "Voir", isNew: "Nouveau" },
  ar: { intro: "معظم الفرق تنقلك من يد إلى يد بين الاستراتيجية والتصميم والهندسة والبيانات والهوية والتسويق. أنا أعمل ميدانياً: أجلس مع فريقك، وأدرس كيف يجري العمل فعلاً، وأدوّنه، وأبني النظام، ثم أتابعه حتى تتحرك الأرقام. شخص واحد من دراسة الجدوى إلى الشيفرة إلى فيلم الإطلاق. فجوات أقل وقرارات أسرع وعمل أفضل.", remoteEyebrow: "عن بُعد، حول العالم", remoteTitle: "أكرا على توقيت GMT+0.", remoteAccent: "صباحك هو صباحي.", see: "شاهد", isNew: "جديد" },
};

/** Services, method and remote facts in the visitor's language. */
export function localServices(locale: string) {
  const map = locale === "fr" ? SERVICES_FR : locale === "ar" ? SERVICES_AR : null;
  return {
    services: map ? SERVICES.map((s) => ({ ...s, ...map[s.key] })) : SERVICES,
    method: locale === "fr" ? METHOD_FR : locale === "ar" ? METHOD_AR : METHOD,
    remote: locale === "fr" ? REMOTE_FR : locale === "ar" ? REMOTE_AR : REMOTE,
    copy: SERVICES_COPY[locale as keyof typeof SERVICES_COPY] ?? SERVICES_COPY.en,
  };
}
