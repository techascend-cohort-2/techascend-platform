// Content + config for the TechAscend platform app screens.
// Ported from the Claude Design "TechAscend Platform" export (renderVals / navData).

export type Persona = "student" | "admin" | "partner";
export type ScreenKey =
  | "dashboard"
  | "lesson"
  | "tutor"
  | "project"
  | "earn"
  | "admin"
  | "partner";

// ---- icon paths (single-path stroked svgs) ----
export const ICON = {
  home: "M3 9.5L12 3l9 6.5M5 8.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V8.5",
  book: "M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5zM20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z",
  chat: "M21 11.5a8.38 8.38 0 01-9 8.38 9 9 0 01-4-.9L3 21l1.9-4.5A8.38 8.38 0 0121 11.5z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  users: "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M11 7a4 4 0 100 8 4 4 0 000-8zM21 21v-2a4 4 0 00-3-3.87",
  bag: "M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  coin: "M12 2v20M16 6.5c-1-1.2-2.5-1.5-4-1.5-2.2 0-4 1-4 3s1.8 2.5 4 3 4 1 4 3-1.8 3-4 3c-1.5 0-3-.3-4-1.5",
  award: "M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5L7 22l5-3 5 3-1.2-8.5",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  star: "M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z",
};

// ---- per-screen header titles ----
export const TITLES: Record<ScreenKey, [string, string]> = {
  dashboard: ["Dashboard", "Your learning & income at a glance"],
  lesson: ["My Learning", "Module 4 · API & System Integration"],
  tutor: ["AI Tutor", "Context-aware help for every lesson"],
  project: ["Projects", "Submit work & get instant AI evaluation"],
  earn: ["Earn Hub", "Turn your skills into real income"],
  admin: ["Admin · Douala Hub", "Cohorts, analytics & partner overview"],
  partner: ["Partner Portal", "Talent, hiring & impact reporting"],
};

// ---- per-persona signed-in user ----
export const PERSONA_INFO: Record<Persona, { name: string; role: string; initials: string }> = {
  student: { name: "Amina Njoya", role: "AI Software Eng · Track A", initials: "AN" },
  admin: { name: "Grace Mbeki", role: "Program Director", initials: "GM" },
  partner: { name: "MTN Foundation", role: "Sponsorship Partner", initials: "MF" },
};

// ---- sidebar nav per persona ----
export type NavItem = {
  label: string;
  icon: string;
  screen: ScreenKey | "soon";
  href: string | null;
  built: boolean;
  badge?: string;
};

export const NAV: Record<Persona, NavItem[]> = {
  student: [
    { label: "Dashboard", icon: ICON.home, screen: "dashboard", href: "/dashboard", built: true },
    { label: "My Learning", icon: ICON.book, screen: "lesson", href: "/learning", built: true },
    { label: "AI Tutor", icon: ICON.chat, screen: "tutor", href: "/tutor", built: true, badge: "New" },
    { label: "Projects", icon: ICON.grid, screen: "project", href: "/projects", built: true },
    { label: "Community", icon: ICON.users, screen: "soon", href: null, built: false },
    { label: "Opportunities", icon: ICON.bag, screen: "soon", href: null, built: false },
    { label: "Earn Hub", icon: ICON.coin, screen: "earn", href: "/earn", built: true },
    { label: "Badges & Certs", icon: ICON.award, screen: "soon", href: null, built: false },
  ],
  admin: [
    { label: "Overview", icon: ICON.chart, screen: "admin", href: "/admin", built: true },
    { label: "Cohorts", icon: ICON.book, screen: "soon", href: null, built: false },
    { label: "Students", icon: ICON.users, screen: "soon", href: null, built: false },
    { label: "Partners", icon: ICON.bag, screen: "soon", href: null, built: false },
    { label: "Revenue", icon: ICON.coin, screen: "soon", href: null, built: false },
  ],
  partner: [
    { label: "Overview", icon: ICON.chart, screen: "partner", href: "/partner", built: true },
    { label: "Talent Pool", icon: ICON.users, screen: "soon", href: null, built: false },
    { label: "Hiring Pipeline", icon: ICON.bag, screen: "soon", href: null, built: false },
    { label: "Impact & ROI", icon: ICON.award, screen: "soon", href: null, built: false },
  ],
};

export const PERSONA_HOME: Record<Persona, string> = {
  student: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};

// ============ STUDENT DASHBOARD ============
export const dashStats = [
  { label: "Overall progress", value: "72%", delta: "+8%", deltaColor: "var(--pos)", tint: "#7C3AED", tintBg: "#F1EAFC", iconPath: "M22 12A10 10 0 1112 2v10z" },
  { label: "Day streak", value: "12", delta: "🔥", deltaColor: "var(--warn)", tint: "#C97A0E", tintBg: "#FCF1DE", iconPath: "M12 2s5 4 5 9a5 5 0 01-10 0c0-2 1-3 1-3s0 2 2 2 2-4 2-8z" },
  { label: "Badges earned", value: "18", delta: "+3", deltaColor: "var(--pos)", tint: "#D6336C", tintBg: "#FCE7F0", iconPath: "M12 15a6 6 0 100-12 6 6 0 000 12zM8 13l-1 8 5-3 5 3-1-8" },
  { label: "Projects shipped", value: "7", delta: "+1", deltaColor: "var(--pos)", tint: "#1F9D6B", tintBg: "#E6F6EF", iconPath: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
];

export const incomeTasks = [
  { title: "Build a landing page for a local bakery", meta: "Freelance · Track A skills", pay: "45,000 F", match: "96%", glyph: "W", tint: "#7C3AED", tintBg: "#F1EAFC" },
  { title: "Automate invoices for an SME", meta: "TechAscend Studio · n8n", pay: "80,000 F", match: "91%", glyph: "A", tint: "#1F9D6B", tintBg: "#E6F6EF" },
  { title: "AI chatbot for a clinic", meta: "Partner brief · OpenAI API", pay: "120,000 F", match: "88%", glyph: "AI", tint: "#D6336C", tintBg: "#FCE7F0" },
];

export const milestones = [
  { title: "Finish Module 4", sub: "2 lessons left", dotBg: "var(--brand1)", dotBorder: "#E7DCFA" },
  { title: "Submit capstone project", sub: "AI Customer Support Agent", dotBg: "#fff", dotBorder: "var(--line)" },
  { title: "Live session: API design", sub: "Sat · 3:00 PM · with Mary N.", dotBg: "#fff", dotBorder: "var(--line)" },
  { title: 'Earn "API Integrator" badge', sub: "Unlocks new income tasks", dotBg: "#fff", dotBorder: "var(--line)" },
];

// ============ LESSON ============
export const apiFlow = [
  { label: "Client", iconPath: "M3 4h18v12H3zM8 20h8M12 16v4", arrow: true, arrowLabel: "request" },
  { label: "API", iconPath: "M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z", arrow: true, arrowLabel: "query" },
  { label: "Server", iconPath: "M20 6.4c0 1.9-3.6 3.6-8 3.6S4 8.3 4 6.4 7.6 2.8 12 2.8s8 1.7 8 3.6zM4 6.4v11.2C4 19.5 7.6 21 12 21s8-1.5 8-3.4V6.4", arrow: false, arrowLabel: "" },
];

export const lessonTabs = ["Overview", "Notes", "Resources", "Q&A"];

export const lessonPoints = [
  "What an API is and why it matters",
  "How REST APIs work end-to-end",
  "HTTP methods: GET, POST, PUT, DELETE",
  "Reading and handling status codes",
  "Testing endpoints with AI assistance",
];

// ============ PROJECT ============
export const projectSteps = [
  { n: "1", label: "Details", active: true },
  { n: "2", label: "Upload", active: true },
  { n: "3", label: "Preview", active: false },
  { n: "4", label: "Submit", active: false },
];

export const deliverables = [
  { title: "Project Documentation", file: "support-agent-doc.pdf", ext: "PDF", tint: "#D6336C", tintBg: "#FCE7F0" },
  { title: "Source Code", file: "support-agent-code.zip", ext: "ZIP", tint: "#7C3AED", tintBg: "#F1EAFC" },
  { title: "Demo Video", file: "demo-walkthrough.mp4", ext: "MP4", tint: "#1F9D6B", tintBg: "#E6F6EF" },
];

export const rubric = [
  { label: "Functionality", score: "92", pct: "92%" },
  { label: "Code quality", score: "85", pct: "85%" },
  { label: "Documentation", score: "80", pct: "80%" },
  { label: "Monetization potential", score: "90", pct: "90%" },
];

// ============ TUTOR ============
export type ChatMessage = { role: "bot" | "user"; text: string };
export const seedMessages: ChatMessage[] = [
  { role: "bot", text: "Hi Amina! 👋 I'm your AI Tutor. I can see you're on Lesson 4.3 — REST APIs. What would you like help with?" },
  { role: "user", text: "Can you explain what an API endpoint actually is, in simple terms?" },
  { role: "bot", text: "Of course! An endpoint is just a specific URL where an API listens for requests — like a phone number for one service. For example, GET /api/users returns a list of users. Each endpoint does one job.\n\nNext action: try fetching /api/users in your editor and log the result." },
];

export const tutorReply =
  "Great question! Let me break that down step by step with a quick example, then I'll suggest your next action. 💡";

export const chatHistory = [
  "Explain JWT authentication",
  "Help with API integration",
  "Review my project feedback",
  "How do I find freelance clients?",
  "Resume review",
];

export const tutorChips = [
  { label: "Give me an example", send: "Give me an example" },
  { label: "Explain in French", send: "Explain this in French" },
  { label: "Debug my code", send: "Help me debug my code" },
];

// ============ ADMIN ============
export const adminKpis = [
  { label: "Active learners", value: "248", delta: "+22 this cohort", color: "var(--pos)" },
  { label: "Completion rate", value: "82%", delta: "+5% vs last", color: "var(--pos)" },
  { label: "At-risk (AI flag)", value: "14", delta: "Needs outreach", color: "var(--danger)" },
  { label: "Revenue (Q2)", value: "18.4M F", delta: "+31%", color: "var(--pos)" },
];

export const enrollBars = [
  { label: "C1", h1: "52%", h2: "20%" },
  { label: "C2", h1: "60%", h2: "18%" },
  { label: "C3", h1: "58%", h2: "24%" },
  { label: "C4", h1: "70%", h2: "15%" },
  { label: "C5", h1: "76%", h2: "14%" },
  { label: "C6", h1: "82%", h2: "12%" },
];

export type CohortStatus = "pos" | "warn" | "brand";
export const cohorts: {
  name: string; track: string; learners: string; pct: string; status: string; tone: CohortStatus;
}[] = [
  { name: "Douala · Track A", track: "AI Software Eng", learners: "50", pct: "82%", status: "Active", tone: "pos" },
  { name: "Yaoundé · Track B", track: "AI Automation", learners: "42", pct: "64%", status: "Active", tone: "pos" },
  { name: "Buea · Explorer", track: "Foundations", learners: "60", pct: "38%", status: "Onboarding", tone: "warn" },
  { name: "Douala · Studio", track: "Venture", learners: "12", pct: "95%", status: "Demo day", tone: "brand" },
];

export const riskList = [
  { name: "Fatima B.", reason: "No activity in 9 days", initials: "FB", avBg: "linear-gradient(135deg,#D6336C,#7C3AED)", risk: "High", tone: "danger" as const },
  { name: "Linda K.", reason: "Missed 2 submissions", initials: "LK", avBg: "linear-gradient(135deg,#C97A0E,#D6336C)", risk: "Med", tone: "warn" as const },
  { name: "Sandra M.", reason: "Progress slowing", initials: "SM", avBg: "linear-gradient(135deg,#7C3AED,#1F9D6B)", risk: "Med", tone: "warn" as const },
];

export const partnerMini = [
  { abbr: "MTN", name: "MTN Foundation", type: "Funding · 50 seats", value: "8.5M F" },
  { abbr: "OR", name: "Orange Digital", type: "Tech · Infra + credits", value: "Active" },
  { abbr: "UN", name: "UNDP Cameroon", type: "Funding · Grant", value: "6.2M F" },
];

// ============ PARTNER ============
export const pipeline = [
  {
    stage: "Applied", count: "18", people: [
      { name: "Amina Njoya", role: "Frontend Eng", initials: "AN", avBg: "linear-gradient(135deg,#F0A,#7C3AED)" },
      { name: "Joy Etang", role: "Automation", initials: "JE", avBg: "linear-gradient(135deg,#7C3AED,#4F46E5)" },
    ],
  },
  {
    stage: "Interview", count: "7", people: [
      { name: "Marie Doh", role: "Full-stack", initials: "MD", avBg: "linear-gradient(135deg,#D6336C,#C97A0E)" },
      { name: "Grace Mba", role: "Data analyst", initials: "GM", avBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)" },
    ],
  },
  {
    stage: "Hired", count: "4", people: [
      { name: "Fatima N.", role: "AI Engineer", initials: "FN", avBg: "linear-gradient(135deg,#7C3AED,#D6336C)" },
    ],
  },
];

export const talent = [
  { name: "Amina Njoya", role: "AI Software Engineer", initials: "AN", avBg: "linear-gradient(135deg,#F0A,#7C3AED)", skills: ["React", "Node", "OpenAI"], score: "4.9", projects: "7" },
  { name: "Marie Doh", role: "Automation Engineer", initials: "MD", avBg: "linear-gradient(135deg,#D6336C,#C97A0E)", skills: ["n8n", "APIs", "Stripe"], score: "4.8", projects: "5" },
  { name: "Grace Mba", role: "AI Data Analyst", initials: "GM", avBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)", skills: ["SQL", "Python", "BI"], score: "4.7", projects: "6" },
  { name: "Joy Etang", role: "Product Builder", initials: "JE", avBg: "linear-gradient(135deg,#7C3AED,#4F46E5)", skills: ["Bubble", "UX", "AI"], score: "4.6", projects: "4" },
];

export const impactMetrics = [
  { label: "Women trained", value: "50", pct: "100%" },
  { label: "Now earning income", value: "31", pct: "62%" },
  { label: "SMEs digitized", value: "12", pct: "48%" },
  { label: "Avg income uplift", value: "3.4×", pct: "85%" },
];

// ============ EARN HUB ============
export const earnKpis = [
  { label: "Total earned", value: "240,000 F", delta: "+18% this month", color: "var(--pos)" },
  { label: "This month", value: "85,000 F", delta: "3 gigs completed", color: "var(--muted)" },
  { label: "Pending payout", value: "45,000 F", delta: "Clears in 2 days", color: "var(--warn)" },
  { label: "Income readiness", value: "78/100", delta: "AI assessed", color: "var(--brand1)" },
];

export const earnTrend = [
  { m: "Jan", h: "28%", amt: "24k" },
  { m: "Feb", h: "44%", amt: "38k" },
  { m: "Mar", h: "38%", amt: "32k" },
  { m: "Apr", h: "62%", amt: "54k" },
  { m: "May", h: "78%", amt: "68k" },
  { m: "Jun", h: "100%", amt: "85k" },
];

export const gigs = [
  { title: "Landing page for a bakery", type: "Freelance · React", pay: "45,000 F", match: "96%", glyph: "B", tint: "#7C3AED", tintBg: "#F1EAFC", skills: ["React", "Tailwind"] },
  { title: "Invoice automation for an SME", type: "Studio gig · n8n", pay: "80,000 F", match: "91%", glyph: "A", tint: "#1F9D6B", tintBg: "#E6F6EF", skills: ["n8n", "APIs"] },
  { title: "WhatsApp AI support bot", type: "Partner brief · OpenAI", pay: "120,000 F", match: "88%", glyph: "AI", tint: "#D6336C", tintBg: "#FCE7F0", skills: ["OpenAI", "Node"] },
];

export const smeGigs = [
  { name: "Mama Grace Bakery", need: "Online ordering page", pay: "35,000 F", loc: "Douala", abbr: "MG" },
  { name: "Buea Health Clinic", need: "Appointment chatbot", pay: "60,000 F", loc: "Buea", abbr: "BH" },
];

export const payouts = [
  { title: "Bakery landing page", date: "Jun 24 · Mobile Money", amount: "+45,000 F", status: "Paid", tone: "pos" as const },
  { title: "CRM automation setup", date: "Jun 18 · Mobile Money", amount: "+80,000 F", status: "Paid", tone: "pos" as const },
  { title: "AI support bot pilot", date: "Jun 30 · In escrow", amount: "+45,000 F", status: "Pending", tone: "warn" as const },
];
