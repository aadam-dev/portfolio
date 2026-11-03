/** About me: one source for the About page and About.rtf in Aadam OS. */

export const ABOUT_INTRO = [
  "I'm a software engineer and analyst in Accra. I studied mathematics, spent three years evaluating businesses for investors, and now build the systems those businesses run on.",
  "The studio is me. You work with one person who can read the books, map the stockroom, write the code and stay for the stock count.",
];

export const ABOUT_FACTS = [
  ["Based in", "Accra, GMT"],
  ["Businesses on my systems", "17, seven end to end"],
  ["Email", "adam@aadambuilds.dev"],
] as const;

export const EXPERIENCE = [
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
];

export const EDUCATION = [
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
];

export const RESEARCH = [
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
];

export const LEADERSHIP = [
  "Technical and operations co-lead, Madina Basketball Court: renovated an unusable public court, raised GHS 40,000+ from 11 donors and built the community web app.",
  "IT lead and committee executive, IOU Student Committee, 2024 to 2026: 780 approved service hours against a 216-hour requirement.",
  "My mother's provisions shop in Adenta, since 2015: I built its online presence and a basic inventory system.",
  "VC Analyst Program: one of 10 selected by VCTF with the Ministry of Finance and the World Bank.",
  "Aspire Leadership Programme (Harvard faculty-led), Cohort 4, 2025. AI-Integrated Leadership Program, 2026.",
  "Google Cybersecurity Professional Certificate, 2026. Goldman Sachs Investment University, three modules.",
];

export const SKILLS = [
  { group: "Code", items: "Python, TypeScript, SQL. Next.js, React, Node.js, PostgreSQL, Odoo." },
  { group: "Quantitative", items: "Time series modelling, wavelet decomposition, neural networks, statistical inference, regression, design of experiments." },
  { group: "Finance", items: "Three-statement models, valuation, due diligence, ESG assessment, portfolio monitoring." },
  { group: "Languages", items: "English, French, Arabic." },
];

