import type { Stop } from "./objects";

/** French and Arabic copy for the desk tour. English lives in objects.ts. */
type StopCopy = { label: string; eyebrow: string; title: string; body: string; action?: string };
type Ui = { lampOn: string; lampOff: string; phone: string; desktop: string; openOS: string; scrollHint: string; reading: string; next: string; deskAlt: string };

const FR: Record<string, StopCopy> = {
  desk: { label: "Bureau", eyebrow: "Aadam · Ingénieur déployé sur le terrain", title: "Je rejoins votre équipe et je livre le système sur lequel vous tournez.", body: "Produit, design, ingénierie, données et marque depuis un bureau à Accra, pour des équipes partout. Faites défiler le bureau." },
  lamp: { label: "À distance", eyebrow: "À distance · GMT+0", title: "Journée à Accra, matinée à New York.", body: "GMT+0 couvre toute la journée de travail européenne et les matinées de la côte Est. Spécifications écrites, démos hebdomadaires, asynchrone par défaut. Allumez la lampe pour le mode nuit." },
  notebook: { label: "Notes de terrain", eyebrow: "Sur le terrain", title: "Je m'installe. J'observe le travail. Je l'écris.", body: "Avant tout code : suivre le terrain, cartographier comment l'argent et le stock circulent vraiment, et le documenter pour que votre équipe en reste maître après mon départ.", action: "Lire mes notes de recherche" },
  books: { label: "Livres", eyebrow: "Ma façon de penser", title: "Lire large. Livrer précis.", body: "Produit, systèmes, sport et histoire sur cette étagère." },
  device: { label: "Déploiements", eyebrow: "Déploiements", title: "En service sur le terrain : comptoirs, blanchisseries, analystes.", body: "Caisses, suivi de vêtements et outils financiers utilisés toute la journée par de vraies équipes. Essayez-les vous-même juste en dessous.", action: "Essayer le kit de terrain" },
  phone: { label: "Mobile", eyebrow: "Mobile", title: "Pensé pour le téléphone dans votre poche.", body: "Des parcours au toucher natif pour les équipes sur le terrain et les clients chez eux. Prenez-le et essayez-en quelques-uns." },
  brand: { label: "Studio", eyebrow: "Studio · Marque, produit et motion", title: "Des marques qu'on a envie de photographier.", body: "Direction artistique, emballage, rédaction et motion. Le film photoréaliste de Bloom Boba est sur l'étagère ; les emballages Yeskoko sont sur l'établi.", action: "Ouvrir le Studio" },
  ball: { label: "Hors service", eyebrow: "Hors service", title: "L'esprit d'équipe, appris sur le terrain.", body: "Je codirige Madina Basketball : nous avons levé plus de 40 000 GHS pour un terrain communautaire éclairé à l'énergie solaire. Mêmes réflexes au travail : être là, communiquer, finir.", action: "Voir le projet du terrain" },
  screens: { label: "Le bureau", eyebrow: "Aadam OS", title: "Installez-vous.", body: "Chaque projet est une application. Ouvrez-la, regardez-la tourner, essayez le site en ligne." },
};

const AR: Record<string, StopCopy> = {
  desk: { label: "المكتب", eyebrow: "آدم · مهندس ميداني", title: "أنضمّ إلى فريقك وأُسلّم النظام الذي تعمل عليه.", body: "منتج وتصميم وهندسة وبيانات وهوية من مكتب واحد في أكرا، لفرق في كل مكان. مرّر لتتجوّل في المكتب." },
  lamp: { label: "عن بُعد", eyebrow: "عن بُعد · GMT+0", title: "نهار في أكرا، صباح في نيويورك.", body: "توقيت GMT+0 يغطي يوم العمل الأوروبي كاملاً وصباح الساحل الشرقي الأمريكي. مواصفات مكتوبة وعروض أسبوعية، والعمل غير متزامن افتراضياً. أشعل المصباح للوضع الليلي." },
  notebook: { label: "ملاحظات ميدانية", eyebrow: "في الميدان", title: "أجلس معكم. أراقب العمل. أدوّنه.", body: "قبل أي سطر برمجي: أرافق العمل في الميدان، وأرسم كيف تتحرك الأموال والمخزون فعلاً، وأوثّق ذلك ليبقى فريقك صاحب القرار بعد مغادرتي.", action: "اقرأ ملاحظاتي البحثية" },
  books: { label: "الكتب", eyebrow: "طريقة تفكيري", title: "اقرأ على نطاق واسع. أنجز بدقة.", body: "المنتج والأنظمة والرياضة والتاريخ على هذا الرف." },
  device: { label: "الأنظمة الميدانية", eyebrow: "الأنظمة الميدانية", title: "تعمل في الميدان: كاونترات ومغاسل ومحلّلون.", body: "نقاط بيع وتتبّع للملابس وأدوات مالية يستخدمها موظفون حقيقيون طوال اليوم. جرّبها بنفسك في الأسفل.", action: "جرّب الأنظمة" },
  phone: { label: "الهاتف", eyebrow: "الهاتف", title: "مصمَّم للهاتف الذي في جيبك.", body: "تجارب بإحساس التطبيقات الأصلية للعاملين في الميدان وللعملاء في منازلهم. التقطه وجرّب بعضها." },
  brand: { label: "الاستوديو", eyebrow: "الاستوديو · هوية ومنتج وحركة", title: "علامات يرغب الناس في تصويرها.", body: "إدارة فنية وتغليف وكتابة وحركة. فيلم Bloom Boba الواقعي على الرف، وعبوات Yeskoko على طاولة العمل.", action: "افتح الاستوديو" },
  ball: { label: "بعد العمل", eyebrow: "بعد العمل", title: "روح الفريق، تعلّمتها في الملعب.", body: "أشارك في قيادة Madina Basketball: جمعنا أكثر من 40 ألف سيدي لملعب مجتمعي يعمل بالطاقة الشمسية. الغرائز نفسها في العمل: الحضور والتواصل والإنجاز.", action: "شاهد مشروع الملعب" },
  screens: { label: "سطح المكتب", eyebrow: "Aadam OS", title: "تفضّل بالجلوس.", body: "كل مشروع تطبيق. افتحه وشاهده يعمل وجرّب الموقع المباشر." },
};

const UI: Record<string, Ui> = {
  en: { lampOn: "Switch the lamp on", lampOff: "Switch the lamp off", phone: "Pick up the phone", desktop: "Jump into the desktop", openOS: "Open Aadam OS", scrollHint: "Scroll · or tap anything on the desk", reading: "Reading", next: "Next", deskAlt: "Aadam's desk: a laptop with two screen extenders, keyboard, lamp, books, notebook, phone, a bubble tea and a basketball" },
  fr: { lampOn: "Allumer la lampe", lampOff: "Éteindre la lampe", phone: "Prendre le téléphone", desktop: "Entrer dans le bureau", openOS: "Ouvrir Aadam OS", scrollHint: "Faites défiler · ou touchez un objet du bureau", reading: "En cours", next: "Ensuite", deskAlt: "Le bureau d'Aadam : un ordinateur portable avec deux écrans d'extension, un clavier, une lampe, des livres, un carnet, un téléphone, un bubble tea et un ballon de basket" },
  ar: { lampOn: "أشعل المصباح", lampOff: "أطفئ المصباح", phone: "التقط الهاتف", desktop: "ادخل إلى سطح المكتب", openOS: "افتح Aadam OS", scrollHint: "مرّر · أو المس أي شيء على المكتب", reading: "أقرأ الآن", next: "التالي", deskAlt: "مكتب آدم: حاسوب محمول مع شاشتين إضافيتين، ولوحة مفاتيح، ومصباح، وكتب، ودفتر، وهاتف، وكوب شاي بالفقاعات، وكرة سلة" },
};

/** The tour's stops in the visitor's language (English as written in objects.ts otherwise). */
export function localStops(stops: Stop[], locale: string): Stop[] {
  const map = locale === "fr" ? FR : locale === "ar" ? AR : null;
  if (!map) return stops;
  return stops.map((s) => {
    const c = map[s.id];
    if (!c) return s;
    const action = s.action && c.action && "label" in s.action ? { ...s.action, label: c.action } : s.action;
    return { ...s, label: c.label, eyebrow: c.eyebrow, title: c.title, body: c.body, action };
  });
}

export function deskUi(locale: string): Ui {
  return UI[locale] ?? UI.en;
}
