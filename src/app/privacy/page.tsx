import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const c = COPY[await getLocale()] ?? COPY.en;
  return { title: c.title, description: c.description };
}

type Copy = { title: string; description: string; lead: string; updated: string; items: [string, string][] };

const COPY: Record<string, Copy> = {
  en: {
    title: "Privacy",
    description: "What aadambuilds.dev records about visits and messages, and what it does not.",
    lead: "The short version: I keep enough to understand who visits and to answer messages, and nothing that identifies you to anyone else.",
    updated: "Updated November 2026.",
    items: [
  ["What I record about a visit", "The pages you open, what you play with on the site (for example ringing up a sale on a replica or stressing the model), how long the visit lasts, the site that sent you, your browser, operating system and device type, and an approximate place (city and country) worked out by my host, Vercel, from your connection."],
  ["Your IP address", "I store the IP address your visit came from, with the visit record, so I can tell visits apart and spot abuse. Only I can see it, and it is deleted with the visit record."],
  ["A second copy for me", "Page views are also sent to Scout, a small visit log I run myself: the page path (without its query string), the site that sent you, your browser language, time zone, screen size and campaign tags, under a random id that lasts one browser session. It skips visits that send Do Not Track or Global Privacy Control."],
  ["What I do not record", "There are no advertising or third-party analytics scripts, no fingerprinting, and nothing is sold or shared."],
  ["How a visit is recognised", "Your browser keeps a random id in local storage so a second visit can be counted as a return. Clearing site data removes it. If your browser sends Do Not Track or Global Privacy Control, nothing is recorded at all."],
  ["Notes and photos you leave", "If you leave a note on the sticky in Aadam OS, or send me a photo from the phone's camera, I keep it with the name you gave and the address it came from. Nobody else sees it unless I approve it, and approved ones can be taken down at any time: email me and I will delete it. Photos you only save on the phone stay in your browser and never reach me; the camera itself never records or uploads anything until you press send."],
  ["Call requests", "Booking a time in the phone's Calendar sends me your name, contact and the time you picked, like any other message. Nothing is added to a calendar until I confirm it with you."],
  ["Messages and briefs", "When you send a message or a brief, I keep what you wrote and the contact details you gave, so I can reply. If you left an email address, you may get a short confirmation."],
  ["Who sees it", "Only me: in my sign-in-protected office, and as private notifications to my Telegram. Records are stored in a database hosted by Supabase."],
  ["How long it is kept", "Visit records are kept for up to 12 months. Messages are kept while I am working with you and deleted on request."],
  ["Your choices", "Email adam@aadambuilds.dev to see or delete anything I hold about you."],
],
  },
  fr: {
    title: "Confidentialité",
    description: "Ce que aadambuilds.dev enregistre sur les visites et les messages, et ce qu'il n'enregistre pas.",
    lead: "En bref : je garde de quoi comprendre qui visite le site et répondre aux messages, et rien qui vous identifie auprès de quelqu'un d'autre.",
    updated: "Mis à jour en novembre 2026.",
    items: [
      ["Ce que j'enregistre d'une visite", "Les pages que vous ouvrez, ce que vous essayez sur le site (par exemple encaisser une vente sur une réplique ou mettre le modèle sous tension), la durée de la visite, le site qui vous a envoyé, votre navigateur, votre système et votre type d'appareil, et un lieu approximatif (ville et pays) déduit de votre connexion par mon hébergeur, Vercel."],
      ["Votre adresse IP", "J'enregistre l'adresse IP d'où vient la visite, avec la visite, pour distinguer les visites et repérer les abus. Je suis le seul à la voir, et elle est supprimée avec la visite."],
      ["Une deuxième copie pour moi", "Les pages vues sont aussi envoyées à Scout, un petit journal de visites que je gère moi-même : le chemin de la page (sans ses paramètres), le site qui vous a envoyé, la langue du navigateur, le fuseau horaire, la taille d'écran et les balises de campagne, sous un identifiant aléatoire qui dure une session. Les visites qui envoient Do Not Track ou Global Privacy Control sont ignorées."],
      ["Ce que je n'enregistre pas", "Aucun script publicitaire ni d'analyse tiers, aucune empreinte de navigateur, et rien n'est vendu ni partagé."],
      ["Comment une visite est reconnue", "Votre navigateur garde un identifiant aléatoire en stockage local pour qu'une deuxième visite compte comme un retour. Effacer les données du site le supprime. Si votre navigateur envoie Do Not Track ou Global Privacy Control, rien n'est enregistré."],
      ["Les mots et les photos que vous laissez", "Si vous laissez un mot sur le pense-bête d'Aadam OS, ou m'envoyez une photo depuis l'appareil photo du téléphone, je la garde avec le nom donné et l'adresse d'où elle vient. Personne d'autre ne la voit tant que je ne l'ai pas approuvée, et une fois approuvée elle peut être retirée à tout moment : écrivez-moi et je la supprime. Les photos seulement gardées sur le téléphone restent dans votre navigateur et ne m'arrivent jamais ; l'appareil photo n'enregistre ni n'envoie rien tant que vous n'appuyez pas sur envoyer."],
      ["Les demandes d'appel", "Réserver un créneau dans le Calendrier du téléphone m'envoie votre nom, votre contact et l'heure choisie, comme n'importe quel message. Rien n'est ajouté à un agenda avant que je vous l'aie confirmé."],
      ["Messages et briefs", "Quand vous envoyez un message ou un brief, je garde ce que vous avez écrit et les coordonnées données, pour pouvoir répondre. Si vous avez laissé un e-mail, vous recevrez peut-être une courte confirmation."],
      ["Qui le voit", "Moi seul : dans mon bureau protégé par connexion, et en notifications privées sur mon Telegram. Les données sont stockées dans une base hébergée par Supabase."],
      ["Combien de temps", "Les visites sont gardées jusqu'à 12 mois. Les messages sont gardés tant que je travaille avec vous et supprimés sur demande."],
      ["Vos choix", "Écrivez à adam@aadambuilds.dev pour voir ou supprimer tout ce que je garde sur vous."],
    ],
  },
  ar: {
    title: "الخصوصية",
    description: "ما يسجّله موقع aadambuilds.dev عن الزيارات والرسائل، وما لا يسجّله.",
    lead: "باختصار: أحتفظ بما يكفي لأفهم من يزور الموقع ولأردّ على الرسائل، ولا شيء يعرّف بك لأي شخص آخر.",
    updated: "حُدّثت في نوفمبر 2026.",
    items: [
      ["ما أسجّله عن الزيارة", "الصفحات التي تفتحها، وما تجرّبه على الموقع (مثل تسجيل عملية بيع على نسخة تجريبية أو اختبار النموذج)، ومدة الزيارة، والموقع الذي أحالك، ومتصفحك ونظام التشغيل ونوع الجهاز، وموقعًا تقريبيًا (المدينة والبلد) يستنتجه مزوّد الاستضافة Vercel من اتصالك."],
      ["عنوان IP", "أحفظ عنوان IP الذي جاءت منه الزيارة مع سجلها، لأميّز بين الزيارات وأكتشف الإساءة. لا يراه أحد غيري، ويُحذف مع سجل الزيارة."],
      ["نسخة ثانية لي", "تُرسل مشاهدات الصفحات أيضًا إلى Scout، وهو سجل زيارات صغير أديره بنفسي: مسار الصفحة (دون معاملاتها)، والموقع الذي أحالك، ولغة المتصفح، والمنطقة الزمنية، وحجم الشاشة، ووسوم الحملات، تحت معرّف عشوائي يدوم جلسة واحدة. وتُستثنى الزيارات التي ترسل Do Not Track أو Global Privacy Control."],
      ["ما لا أسجّله", "لا سكربتات إعلانية أو تحليلية من أطراف ثالثة، ولا بصمة للمتصفح، ولا يُباع شيء أو يُشارك."],
      ["كيف أتعرّف على الزيارة", "يحتفظ متصفحك بمعرّف عشوائي في التخزين المحلي لتُحسب الزيارة الثانية عودة. مسح بيانات الموقع يزيله. وإذا أرسل متصفحك Do Not Track أو Global Privacy Control فلا يُسجَّل شيء إطلاقًا."],
      ["الملاحظات والصور التي تتركها", "إذا تركت ملاحظة على الورقة اللاصقة في Aadam OS، أو أرسلت لي صورة من كاميرا الهاتف، أحتفظ بها مع الاسم الذي كتبته والعنوان الذي جاءت منه. لا يراها أحد غيري ما لم أوافق عليها، ويمكن حذف المعتمد منها في أي وقت: راسلني وسأحذفها. الصور التي تحفظها على الهاتف فقط تبقى في متصفحك ولا تصلني أبدًا؛ والكاميرا لا تسجّل ولا ترفع شيئًا حتى تضغط إرسال."],
      ["طلبات المكالمات", "حجز موعد في تقويم الهاتف يرسل لي اسمك ووسيلة التواصل والوقت الذي اخترته، مثل أي رسالة أخرى. لا يُضاف شيء إلى أي تقويم قبل أن أؤكده معك."],
      ["الرسائل وملخصات المشاريع", "عندما ترسل رسالة أو ملخص مشروع، أحتفظ بما كتبته وبيانات التواصل التي قدّمتها لأتمكن من الرد. وإن تركت بريدًا إلكترونيًا فقد يصلك تأكيد قصير."],
      ["من يراها", "أنا فقط: في مكتبي المحمي بتسجيل الدخول، وفي إشعارات خاصة على Telegram. تُخزَّن السجلات في قاعدة بيانات تستضيفها Supabase."],
      ["مدة الاحتفاظ", "تُحفظ سجلات الزيارات حتى 12 شهرًا. وتُحفظ الرسائل طوال عملي معك وتُحذف عند الطلب."],
      ["خياراتك", "راسل adam@aadambuilds.dev لترى أو تحذف أي شيء أحتفظ به عنك."],
    ],
  },
};

export default async function Privacy() {
  const c = COPY[await getLocale()] ?? COPY.en;
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-display text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            {c.title}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">{c.lead}</p>
          <dl className="mt-10 space-y-8">
            {c.items.map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-[20px] text-white">{k}</dt>
                <dd className="mt-2 text-[15.5px] leading-relaxed text-[var(--ink-2)]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-[13px] text-[var(--ink-3)]">{c.updated}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
