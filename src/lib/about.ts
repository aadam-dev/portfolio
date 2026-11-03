/** About me: one source for the About page and About.rtf in Aadam OS, in English, French and Arabic. */

type Link = { href: string; label: string };
export interface About {
  meta: { title: string; description: string };
  ui: {
    onThisPage: string;
    elsewhere: string;
    sections: { experience: string; research: string; education: string; leadership: string; leadershipLong: string; skills: string };
    cvTitle: string;
    cvBody: string;
    askCv: string;
    hire: string;
  };
  ABOUT_INTRO: string[];
  ABOUT_FACTS: (readonly [string, string])[];
  EXPERIENCE: { when: string; role: string; org: string; body: string; link?: Link }[];
  EDUCATION: { when: string; title: string; org: string; body: string }[];
  RESEARCH: { title: string; where: string; body: string; link?: Link }[];
  LEADERSHIP: string[];
  SKILLS: { group: string; items: string }[];
}

const en: About = {
  meta: {
    title: "About Aadam",
    description: "Software engineer and analyst in Accra. Mathematics at UMaT, IT at IOU, three years of PE and VC analysis, now building operating systems for 17 businesses.",
  },
  ui: {
    onThisPage: "On this page",
    elsewhere: "Elsewhere",
    sections: { experience: "Experience", research: "Research", education: "Education", leadership: "Leadership", leadershipLong: "Leadership, volunteering and programmes", skills: "Skills" },
    cvTitle: "Hiring, or need the full CV?",
    cvBody: "I send the CV on request, usually the same day.",
    askCv: "Ask for the CV",
    hire: "Hire Aadam",
  },
  ABOUT_INTRO: [
    "I'm a software engineer and analyst in Accra. I studied mathematics, spent three years evaluating businesses for investors, and now build the systems those businesses run on.",
    "The studio is me. You work with one person who can read the books, map the stockroom, write the code and stay for the stock count.",
  ],
  ABOUT_FACTS: [
    ["Based in", "Accra, GMT"],
    ["Businesses on my systems", "17, seven end to end"],
    ["Email", "adam@aadambuilds.dev"],
  ],
  EXPERIENCE: [
    {
      when: "2025 to now",
      role: "Software engineer and systems consultant",
      org: "Independent practice, Accra",
      body: "Production systems for 17 businesses across retail, healthcare, construction, hospitality, fashion and education. Seven of them run end to end on what I built: point of sale, inventory and back office. For Delish I mapped the processes, built the Bills of Materials across 77 ingredients with pack-to-piece conversions, and ran the stock counts and reconciliations.",
      link: { href: "/work", label: "See the work" },
    },
    {
      when: "Jan to Aug 2026",
      role: "Co-founder and operations lead",
      org: "PrimeTijara, Accra",
      body: "A team of five supplying builders. I ran the order pipeline, supplier terms, inventory, pricing and daily reconciliation, and built the platform from January. We opened in late June and sold GHS 177,532 in the first month, with 20+ repeat customers. Operations paused in August 2026.",
      link: { href: "/work/primetijara", label: "Case study" },
    },
    {
      when: "Sep 2023 to Dec 2025",
      role: "Analyst and IT systems lead",
      org: "Mirepa Investment Advisors, Accra",
      body: "Officially to June 2025, then on ongoing work until the end of the year. The full deal cycle on 50+ SMEs: sourcing, due diligence, Investment Committee and portfolio monitoring. I built a deal-screening dashboard that cut evaluation time by 40%, and a standardised ESG assessment framework.",
      link: { href: "/lab/model", label: "A model like the ones I built" },
    },
    {
      when: "Jan 2023 to Dec 2024",
      role: "Investment analyst",
      org: "Venture Capital Trust Fund, Ghana",
      body: "Business analysis, due diligence, sector research, Investment Committee materials and ESG risk.",
    },
    {
      when: "Sep 2020 to Aug 2021",
      role: "National Service",
      org: "Accra Metropolitan Assembly, Traffic and Parks Unit",
      body: "",
    },
  ],
  EDUCATION: [
    {
      when: "2022 to 2026",
      title: "BSc Information Technology",
      org: "International Open University",
      body: "CGPA 3.54 out of 4.0 over 144 credits, studied online while working full time as an analyst.",
    },
    {
      when: "2016 to 2020",
      title: "BSc Mathematics",
      org: "University of Mines and Technology, Tarkwa",
      body: "Final-semester average 73.3, up from 54.8 in third year.",
    },
  ],
  RESEARCH: [
    {
      title: "A hybrid Wavelet-ANN time series model for diesel fuel price forecasting",
      where: "BSc Mathematics project, UMaT. Graded 90%.",
      body: "Decompose the price series into frequency bands with a wavelet transform, train a neural network on each band, then recombine the forecasts.",
    },
    {
      title: "Kōyi: a multilingual, low-bandwidth learning platform",
      where: "IOU capstone, graded 97%. Co-authored paper presented at the 8th International Conference on Integrated Sciences (ICIS), 29 to 30 August 2026.",
      body: "60+ courses in English, French and Arabic, with right-to-left layouts given equal care, built to work on slow connections.",
      link: { href: "/work/koyi", label: "See Kōyi" },
    },
  ],
  LEADERSHIP: [
    "Technical and operations co-lead, Madina Basketball Court: renovated an unusable public court, raised GHS 40,000+ from 11 donors and built the community web app.",
    "IT lead and committee executive, IOU Student Committee, 2024 to 2026: 780 approved service hours against a 216-hour requirement.",
    "My mother's provisions shop in Adenta, since 2015: I built its online presence and a basic inventory system.",
    "VC Analyst Program: one of 10 selected by VCTF with the Ministry of Finance and the World Bank.",
    "Aspire Leadership Programme (Harvard faculty-led), Cohort 4, 2025. AI-Integrated Leadership Program, 2026.",
    "Google Cybersecurity Professional Certificate, 2026. Goldman Sachs Investment University, three modules.",
  ],
  SKILLS: [
    { group: "Code", items: "Python, TypeScript, SQL. Next.js, React, Node.js, PostgreSQL, Odoo." },
    { group: "Quantitative", items: "Time series modelling, wavelet decomposition, neural networks, statistical inference, regression, design of experiments." },
    { group: "Finance", items: "Three-statement models, valuation, due diligence, ESG assessment, portfolio monitoring." },
    { group: "Languages", items: "English, French, Arabic." },
  ],
};

const fr: About = {
  meta: {
    title: "À propos d'Aadam",
    description: "Ingénieur logiciel et analyste à Accra. Mathématiques à l'UMaT, informatique à l'IOU, trois ans d'analyse en private equity et capital-risque, et aujourd'hui les systèmes de 17 entreprises.",
  },
  ui: {
    onThisPage: "Sur cette page",
    elsewhere: "Ailleurs",
    sections: { experience: "Expérience", research: "Recherche", education: "Formation", leadership: "Engagements", leadershipLong: "Engagements, bénévolat et programmes", skills: "Compétences" },
    cvTitle: "Vous recrutez, ou il vous faut le CV complet ?",
    cvBody: "J'envoie le CV sur demande, en général le jour même.",
    askCv: "Demander le CV",
    hire: "Travailler avec Aadam",
  },
  ABOUT_INTRO: [
    "Je suis ingénieur logiciel et analyste à Accra. J'ai étudié les mathématiques, passé trois ans à évaluer des entreprises pour des investisseurs, et je construis aujourd'hui les systèmes sur lesquels ces entreprises tournent.",
    "Le studio, c'est moi. Vous travaillez avec une seule personne qui sait lire les comptes, cartographier la réserve, écrire le code et rester pour l'inventaire.",
  ],
  ABOUT_FACTS: [
    ["Basé à", "Accra, GMT"],
    ["Entreprises sur mes systèmes", "17, dont sept de bout en bout"],
    ["E-mail", "adam@aadambuilds.dev"],
  ],
  EXPERIENCE: [
    {
      when: "2025 à aujourd'hui",
      role: "Ingénieur logiciel et consultant en systèmes",
      org: "En indépendant, Accra",
      body: "Des systèmes en production pour 17 entreprises dans le commerce, la santé, le bâtiment, la restauration, la mode et l'éducation. Sept d'entre elles tournent de bout en bout sur ce que j'ai construit : caisse, stock et back-office. Pour Delish, j'ai cartographié les processus, construit les nomenclatures de 77 ingrédients avec les conversions du colis à la pièce, et mené les inventaires et les rapprochements.",
      link: { href: "/work", label: "Voir le travail" },
    },
    {
      when: "Janv. à août 2026",
      role: "Cofondateur et responsable des opérations",
      org: "PrimeTijara, Accra",
      body: "Une équipe de cinq personnes qui fournit les chantiers. Je gérais les commandes, les conditions fournisseurs, le stock, les prix et le rapprochement quotidien, et j'ai construit la plateforme dès janvier. Ouverture fin juin, 177 532 GHS de ventes le premier mois, plus de 20 clients réguliers. Activité suspendue en août 2026.",
      link: { href: "/work/primetijara", label: "Étude de cas" },
    },
    {
      when: "Sept. 2023 à déc. 2025",
      role: "Analyste et responsable des systèmes informatiques",
      org: "Mirepa Investment Advisors, Accra",
      body: "Officiellement jusqu'en juin 2025, puis sur des missions en cours jusqu'à la fin de l'année. Le cycle complet sur plus de 50 PME : sourcing, due diligence, comité d'investissement et suivi de portefeuille. J'ai construit un tableau de bord de présélection qui a réduit le temps d'évaluation de 40 %, et une grille d'évaluation ESG standardisée.",
      link: { href: "/lab/model", label: "Un modèle comme ceux que je construisais" },
    },
    {
      when: "Janv. 2023 à déc. 2024",
      role: "Analyste en investissement",
      org: "Venture Capital Trust Fund, Ghana",
      body: "Analyse d'entreprises, due diligence, études sectorielles, dossiers pour le comité d'investissement et risques ESG.",
    },
    {
      when: "Sept. 2020 à août 2021",
      role: "Service national",
      org: "Accra Metropolitan Assembly, service de la circulation et des parcs",
      body: "",
    },
  ],
  EDUCATION: [
    {
      when: "2022 à 2026",
      title: "Licence en technologies de l'information",
      org: "International Open University",
      body: "Moyenne de 3,54 sur 4,0 sur 144 crédits, suivie en ligne tout en travaillant à plein temps comme analyste.",
    },
    {
      when: "2016 à 2020",
      title: "Licence de mathématiques",
      org: "University of Mines and Technology, Tarkwa",
      body: "Moyenne de 73,3 au dernier semestre, contre 54,8 en troisième année.",
    },
  ],
  RESEARCH: [
    {
      title: "Un modèle hybride ondelettes et réseau de neurones pour prévoir le prix du gazole",
      where: "Projet de licence de mathématiques, UMaT. Noté 90 %.",
      body: "Décomposer la série de prix en bandes de fréquence par une transformée en ondelettes, entraîner un réseau de neurones sur chaque bande, puis recombiner les prévisions.",
    },
    {
      title: "Kōyi : une plateforme d'apprentissage multilingue et peu gourmande en données",
      where: "Projet de fin d'études à l'IOU, noté 97 %. Article co-écrit, présenté à la 8e International Conference on Integrated Sciences (ICIS), les 29 et 30 août 2026.",
      body: "Plus de 60 cours en anglais, en français et en arabe, avec le même soin pour les mises en page de droite à gauche, conçus pour fonctionner sur des connexions lentes.",
      link: { href: "/work/koyi", label: "Voir Kōyi" },
    },
  ],
  LEADERSHIP: [
    "Co-responsable technique et opérations, terrain de basket de Madina : rénovation d'un terrain public inutilisable, plus de 40 000 GHS réunis auprès de 11 donateurs, et l'application web de la communauté.",
    "Responsable informatique et membre du bureau, comité des étudiants de l'IOU, 2024 à 2026 : 780 heures de service validées pour 216 exigées.",
    "La boutique de produits de première nécessité de ma mère à Adenta, depuis 2015 : sa présence en ligne et un système de stock simple.",
    "VC Analyst Program : l'un des 10 sélectionnés par le VCTF avec le ministère des Finances et la Banque mondiale.",
    "Aspire Leadership Programme (enseignants de Harvard), promotion 4, 2025. AI-Integrated Leadership Program, 2026.",
    "Certificat professionnel Google Cybersecurity, 2026. Goldman Sachs Investment University, trois modules.",
  ],
  SKILLS: [
    { group: "Code", items: "Python, TypeScript, SQL. Next.js, React, Node.js, PostgreSQL, Odoo." },
    { group: "Quantitatif", items: "Séries temporelles, décomposition en ondelettes, réseaux de neurones, inférence statistique, régression, plans d'expérience." },
    { group: "Finance", items: "Modèles à trois états financiers, valorisation, due diligence, évaluation ESG, suivi de portefeuille." },
    { group: "Langues", items: "Anglais, français, arabe." },
  ],
};

const ar: About = {
  meta: {
    title: "نبذة عن آدم",
    description: "مهندس برمجيات ومحلل في أكرا. رياضيات في UMaT وتقنية معلومات في IOU، وثلاث سنوات من التحليل في الملكية الخاصة ورأس المال الجريء، وأبني اليوم أنظمة 17 شركة.",
  },
  ui: {
    onThisPage: "في هذه الصفحة",
    elsewhere: "في أماكن أخرى",
    sections: { experience: "الخبرة", research: "البحث", education: "التعليم", leadership: "القيادة", leadershipLong: "القيادة والتطوع والبرامج", skills: "المهارات" },
    cvTitle: "توظّف، أو تحتاج السيرة الذاتية كاملة؟",
    cvBody: "أرسل السيرة الذاتية عند الطلب، عادةً في اليوم نفسه.",
    askCv: "اطلب السيرة الذاتية",
    hire: "اعمل مع آدم",
  },
  ABOUT_INTRO: [
    "أنا مهندس برمجيات ومحلل في أكرا. درست الرياضيات، وقضيت ثلاث سنوات أقيّم الشركات للمستثمرين، وأبني اليوم الأنظمة التي تعمل عليها هذه الشركات.",
    "الاستوديو هو أنا. تعمل مع شخص واحد يقرأ الدفاتر، ويرسم خريطة المخزن، ويكتب الشيفرة، ويبقى حتى جرد المخزون.",
  ],
  ABOUT_FACTS: [
    ["المقر", "أكرا، GMT"],
    ["شركات على أنظمتي", "17، منها سبع من البداية إلى النهاية"],
    ["البريد الإلكتروني", "adam@aadambuilds.dev"],
  ],
  EXPERIENCE: [
    {
      when: "2025 حتى الآن",
      role: "مهندس برمجيات ومستشار أنظمة",
      org: "عمل مستقل، أكرا",
      body: "أنظمة قيد التشغيل لـ17 شركة في التجزئة والرعاية الصحية والبناء والضيافة والأزياء والتعليم. سبع منها تعمل بالكامل على ما بنيته: نقاط البيع والمخزون والإدارة الخلفية. لـDelish رسمت العمليات، وبنيت قوائم المواد لـ77 مكوّنًا مع التحويل من العبوة إلى القطعة، وأدرت الجرد والمطابقات.",
      link: { href: "/work", label: "شاهد الأعمال" },
    },
    {
      when: "يناير إلى أغسطس 2026",
      role: "شريك مؤسس ومسؤول العمليات",
      org: "PrimeTijara، أكرا",
      body: "فريق من خمسة أشخاص يورّد لمواقع البناء. أدرت مسار الطلبات وشروط الموردين والمخزون والتسعير والمطابقة اليومية، وبنيت المنصة منذ يناير. افتتحنا أواخر يونيو وبعنا بـ177,532 سيدي في الشهر الأول، مع أكثر من 20 عميلًا دائمًا. توقّف النشاط في أغسطس 2026.",
      link: { href: "/work/primetijara", label: "دراسة الحالة" },
    },
    {
      when: "سبتمبر 2023 إلى ديسمبر 2025",
      role: "محلل ومسؤول أنظمة تقنية المعلومات",
      org: "Mirepa Investment Advisors، أكرا",
      body: "رسميًا حتى يونيو 2025، ثم في أعمال جارية حتى نهاية العام. الدورة الكاملة لأكثر من 50 شركة صغيرة ومتوسطة: البحث عن الفرص، والعناية الواجبة، ولجنة الاستثمار، ومتابعة المحفظة. بنيت لوحة لفرز الصفقات خفّضت وقت التقييم بنسبة 40%، وإطارًا موحّدًا لتقييم معايير ESG.",
      link: { href: "/lab/model", label: "نموذج مثل التي بنيتها" },
    },
    {
      when: "يناير 2023 إلى ديسمبر 2024",
      role: "محلل استثمار",
      org: "Venture Capital Trust Fund، غانا",
      body: "تحليل الأعمال، والعناية الواجبة، والأبحاث القطاعية، وملفات لجنة الاستثمار، ومخاطر ESG.",
    },
    {
      when: "سبتمبر 2020 إلى أغسطس 2021",
      role: "الخدمة الوطنية",
      org: "Accra Metropolitan Assembly، وحدة المرور والحدائق",
      body: "",
    },
  ],
  EDUCATION: [
    {
      when: "2022 إلى 2026",
      title: "بكالوريوس تقنية المعلومات",
      org: "International Open University",
      body: "معدل تراكمي 3.54 من 4.0 على 144 ساعة معتمدة، درستها عن بُعد أثناء عملي محللًا بدوام كامل.",
    },
    {
      when: "2016 إلى 2020",
      title: "بكالوريوس الرياضيات",
      org: "University of Mines and Technology، تاركوا",
      body: "معدل الفصل الأخير 73.3، بعد 54.8 في السنة الثالثة.",
    },
  ],
  RESEARCH: [
    {
      title: "نموذج هجين من المويجات والشبكات العصبية للتنبؤ بسعر الديزل",
      where: "مشروع بكالوريوس الرياضيات، UMaT. الدرجة 90%.",
      body: "تفكيك سلسلة الأسعار إلى نطاقات ترددية بتحويل المويجات، وتدريب شبكة عصبية على كل نطاق، ثم إعادة جمع التنبؤات.",
    },
    {
      title: "Kōyi: منصة تعليمية متعددة اللغات تعمل بأقل قدر من البيانات",
      where: "مشروع التخرج في IOU، الدرجة 97%. ورقة مشتركة قُدّمت في المؤتمر الدولي الثامن للعلوم المتكاملة (ICIS)، 29 و30 أغسطس 2026.",
      body: "أكثر من 60 مقررًا بالإنجليزية والفرنسية والعربية، مع عناية متساوية بالتخطيط من اليمين إلى اليسار، ومصممة لتعمل على الاتصالات البطيئة.",
      link: { href: "/work/koyi", label: "شاهد Kōyi" },
    },
  ],
  LEADERSHIP: [
    "قائد مشارك تقني وتشغيلي، ملعب Madina لكرة السلة: رمّمنا ملعبًا عامًا غير صالح، وجمعنا أكثر من 40,000 سيدي من 11 متبرعًا، وبنيت تطبيق المجتمع على الويب.",
    "مسؤول تقنية المعلومات وعضو تنفيذي، لجنة طلاب IOU، 2024 إلى 2026: 780 ساعة خدمة معتمدة مقابل 216 ساعة مطلوبة.",
    "متجر والدتي للمواد التموينية في أدينتا، منذ 2015: بنيت حضوره على الإنترنت ونظامًا بسيطًا للمخزون.",
    "برنامج محللي رأس المال الجريء: واحد من 10 اختارهم VCTF مع وزارة المالية والبنك الدولي.",
    "برنامج Aspire للقيادة (بإشراف أساتذة من هارفارد)، الدفعة 4، 2025. برنامج القيادة المدمجة بالذكاء الاصطناعي، 2026.",
    "شهادة Google المهنية في الأمن السيبراني، 2026. Goldman Sachs Investment University، ثلاث وحدات.",
  ],
  SKILLS: [
    { group: "البرمجة", items: "Python وTypeScript وSQL. Next.js وReact وNode.js وPostgreSQL وOdoo." },
    { group: "التحليل الكمي", items: "نمذجة السلاسل الزمنية، وتفكيك المويجات، والشبكات العصبية، والاستدلال الإحصائي، والانحدار، وتصميم التجارب." },
    { group: "المالية", items: "نماذج القوائم المالية الثلاث، والتقييم، والعناية الواجبة، وتقييم ESG، ومتابعة المحافظ." },
    { group: "اللغات", items: "الإنجليزية والفرنسية والعربية." },
  ],
};

const ALL: Record<string, About> = { en, fr, ar };

export function aboutFor(locale: string): About {
  return ALL[locale] ?? en;
}

// English, for anything that has no locale (the press kit, scripts)
export const { ABOUT_INTRO, ABOUT_FACTS, EXPERIENCE, EDUCATION, RESEARCH, LEADERSHIP, SKILLS } = en;
