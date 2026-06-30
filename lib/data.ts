// Content model for the TechAscend landing page.
// Ported from the Claude Design export (renderVals()) into typed data.

export const logos = [
  "MTN Foundation",
  "Orange Digital",
  "UNDP",
  "GIZ",
  "Mastercard Fdn",
  "Microsoft",
];

export type Shift = { old: string; new: string };
export const shifts: Shift[] = [
  { old: "Static teachers", new: "AI tutor on every lesson" },
  { old: "Exams & quizzes", new: "Real projects for real users" },
  { old: "Certificates", new: "Income you can track" },
  { old: "Job boards", new: "A live partner pipeline" },
  { old: "Diplomas", new: "A public, shippable portfolio" },
];

export type Layer = {
  step: string;
  title: string;
  accent: string;
  iconBg: string;
  iconColor: string;
  iconPath: string;
  body: string;
  points: string[];
};
export const layers: Layer[] = [
  {
    step: "LAYER 01",
    title: "Learn",
    accent: "#7C3AED",
    iconBg: "#F1EAFC",
    iconColor: "#7C3AED",
    iconPath:
      "M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5zM20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z",
    body: "AI-native curriculum that teaches judgement and execution — not syntax memorisation.",
    points: ["AI-assisted development", "Automation & APIs", "Cloud & deployment"],
  },
  {
    step: "LAYER 02",
    title: "Build",
    accent: "#2D6FD9",
    iconBg: "#E6F0FC",
    iconColor: "#2D6FD9",
    iconPath: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    body: "Ship real products for local businesses, NGOs and startups — with AI review and mentor feedback.",
    points: ["Capstone projects", "Live client work", "Deployed, public portfolio"],
  },
  {
    step: "LAYER 03",
    title: "Earn",
    accent: "#1F9D6B",
    iconBg: "#E6F6EF",
    iconColor: "#1F9D6B",
    iconPath:
      "M12 2v20M16 6.5c-1-1.2-2.5-1.5-4-1.5-2.2 0-4 1-4 3s1.8 2.5 4 3 4 1 4 3-1.8 3-4 3c-1.5 0-3-.3-4-1.5",
    body: "AI matches your skills to paid work — freelance gigs, local SMEs, jobs, and ventures.",
    points: ["AI-matched freelance gigs", "Hiring partner pipeline", "Venture studio support"],
  },
];

export type Track = {
  tag: string;
  title: string;
  gradient: string;
  shadow: string;
  body: string;
  tools: string[];
  outcomes: string;
};
export const tracks: Track[] = [
  {
    tag: "TRACK A",
    title: "AI Software Engineering",
    gradient: "linear-gradient(155deg,#2A1554,#7C3AED)",
    shadow: "0 24px 56px -30px rgba(124,58,237,.6)",
    body: "Become a full-stack, AI-augmented engineer who builds and ships production systems.",
    tools: ["React", "Node.js", "TypeScript", "PostgreSQL", "OpenAI API"],
    outcomes: "Software Engineer · Remote Developer · API Engineer",
  },
  {
    tag: "TRACK B",
    title: "AI Product & Automation",
    gradient: "linear-gradient(155deg,#5A1248,#D6336C)",
    shadow: "0 24px 56px -30px rgba(214,51,108,.55)",
    body: "Automate business workflows and build SaaS products — the fastest income path for African SMEs.",
    tools: ["n8n", "LangChain", "Bubble", "Zapier", "Stripe / MoMo"],
    outcomes: "Automation Engineer · Freelance Consultant · Founder",
  },
];

export type Role = { title: string; sub: string };
export const roles: Role[] = [
  { title: "Automation Specialist", sub: "For African SMEs" },
  { title: "AI Data Analyst", sub: "Dashboards & BI" },
  { title: "Cloud & DevOps Associate", sub: "Deploy & monitor" },
  { title: "Founder", sub: "Venture studio track" },
];

export type JourneyStage = {
  stage: string;
  title: string;
  dur: string;
  body: string;
  barColor: string;
  numColor: string;
};
export const journey: JourneyStage[] = [
  {
    stage: "STAGE 0",
    title: "Explorer",
    dur: "4 weeks",
    body: "AI literacy, digital confidence & career orientation.",
    barColor: "linear-gradient(90deg,#C9B8F0,#7C3AED)",
    numColor: "#9C7AD6",
  },
  {
    stage: "STAGE 1",
    title: "Core Fellowship",
    dur: "12 weeks",
    body: "AI-assisted dev, automation, APIs, cloud & product.",
    barColor: "linear-gradient(90deg,#7C3AED,#9C2FC0)",
    numColor: "#7C3AED",
  },
  {
    stage: "STAGE 2",
    title: "Studio",
    dur: "12 weeks",
    body: "Real client projects, paid pilots & startup prototypes.",
    barColor: "linear-gradient(90deg,#9C2FC0,#C026D3)",
    numColor: "#9C2FC0",
  },
  {
    stage: "STAGE 3",
    title: "Placement",
    dur: "3–12 months",
    body: "Employment, freelance income or venture path.",
    barColor: "linear-gradient(90deg,#C026D3,#D6336C)",
    numColor: "#C026D3",
  },
  {
    stage: "STAGE 4",
    title: "Alumni",
    dur: "Ongoing",
    body: "Job leads, mentor network & founder circles.",
    barColor: "linear-gradient(90deg,#D6336C,#F2994A)",
    numColor: "#D6336C",
  },
];

export type Stat = { v: string; l: string };
export const stats: Stat[] = [
  { v: "50+", l: "women in the first cohort" },
  { v: "82%", l: "completion rate" },
  { v: "3.4×", l: "average income uplift" },
  { v: "12", l: "SMEs digitised" },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avBg: string;
};
export const testimonials: Testimonial[] = [
  {
    quote:
      "I came in not knowing what an API was. Six months later I automated invoicing for two shops in Douala — and I get paid every month.",
    name: "Amina N.",
    role: "Automation Engineer · Cohort 01",
    initials: "AN",
    avBg: "linear-gradient(135deg,#F0A,#7C3AED)",
  },
  {
    quote:
      "The AI tutor never made me feel stupid for asking. It explained things in French when I needed it, at 11pm, every time.",
    name: "Marie D.",
    role: "Frontend Developer",
    initials: "MD",
    avBg: "linear-gradient(135deg,#D6336C,#C97A0E)",
  },
  {
    quote:
      "TechAscend treated us like builders, not charity. I shipped a real product and now I am hiring my own first intern.",
    name: "Grace M.",
    role: "Founder · Studio track",
    initials: "GM",
    avBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)",
  },
];

export type Partner = { title: string; body: string; iconPath: string };
export const partners: Partner[] = [
  {
    title: "Funding partners",
    body: "Sponsor branded cohorts and scholarships with verified impact reporting.",
    iconPath:
      "M12 2v20M16 6.5c-1-1.2-2.5-1.5-4-1.5-2.2 0-4 1-4 3s1.8 2.5 4 3 4 1 4 3-1.8 3-4 3c-1.5 0-3-.3-4-1.5",
  },
  {
    title: "Hiring partners",
    body: "Access a pre-vetted, AI-native, diverse talent pipeline.",
    iconPath: "M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  },
  {
    title: "Tech partners",
    body: "Provide cloud credits, AI tools and infrastructure to emerging builders.",
    iconPath: "M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z",
  },
  {
    title: "Academic partners",
    body: "Validate curriculum and reach women across campuses.",
    iconPath: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5",
  },
  {
    title: "Government partners",
    body: "Advance youth employment and national digital skills goals.",
    iconPath: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
  },
];

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterCol = { head: string; links: FooterLink[] };
export const footerCols: FooterCol[] = [
  {
    head: "PROGRAM",
    links: [
      { label: "The Model", href: "/#model" },
      { label: "Tracks", href: "/#tracks" },
      { label: "Journey", href: "/#journey" },
      { label: "Apply", href: "/apply" },
    ],
  },
  {
    head: "PARTNERS",
    links: [
      { label: "Sponsor a cohort", href: "/apply?role=partner" },
      { label: "Hire talent", href: "/apply?role=partner" },
      { label: "Impact reports", href: "/#impact" },
    ],
  },
  {
    head: "CONNECT",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com", external: true },
      { label: "Instagram", href: "https://www.instagram.com", external: true },
      { label: "WhatsApp", href: "https://wa.me/237600000000", external: true },
      { label: "Contact", href: "mailto:hello@techascend.africa" },
    ],
  },
];
