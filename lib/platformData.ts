// UI config for the platform app: icons, route metadata, per-role navigation.
// All *content* lives in the database — this file holds only chrome/config.

export type Persona = "applicant" | "student" | "manager" | "admin" | "partner";

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
  calendar: "M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7z",
  check: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
  tag: "M12.59 2.59A2 2 0 0011.17 2H4a2 2 0 00-2 2v7.17a2 2 0 00.59 1.42l8.7 8.7a2 2 0 002.83 0l6.29-6.29a2 2 0 000-2.83zM7 7h.01",
  cloudUpload: "M7 18a4 4 0 01-.6-7.96 5 5 0 019.44-2A4.5 4.5 0 0117.5 18H7zM12 11v6M9.5 13.5L12 11l2.5 2.5",
  document: "M6 2h9l3 3v17a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1zM9 8h6M9 12h6M9 16h4",
  chevronDown: "M6 9l6 6 6-6",
  zap: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
  close: "M18 6L6 18M6 6l12 12",
  filter: "M4 4h16l-6 8v6l-4 2v-8z",
  eye: "M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8zM12 15a3 3 0 100-6 3 3 0 000 6z",
  shield: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z",
} as const;

export type RouteMeta = { title: string; sub: string };

export const ROUTES: Record<string, RouteMeta> = {
  "/welcome": { title: "Welcome", sub: "Your application & next steps" },
  "/dashboard": { title: "Dashboard", sub: "Your learning & income at a glance" },
  "/learning": { title: "My Learning", sub: "Phases, modules & lessons" },
  "/tutor": { title: "AI Tutor", sub: "Context-aware help for every lesson" },
  "/projects": { title: "Projects", sub: "Capstones with instant AI evaluation" },
  "/earn": { title: "Earn Hub", sub: "Opportunities, interests & payouts" },
  "/badges": { title: "Badges & Certificates", sub: "Your verified achievements" },
  "/community": { title: "Community", sub: "Announcements & peer updates" },
  "/events": { title: "Events", sub: "Live sessions, deadlines & ceremonies" },
  "/opportunities": { title: "Opportunities", sub: "Jobs, gigs & internships" },
  "/profile": { title: "My Profile", sub: "Identity, links & visibility" },
  "/admin": { title: "Admin Overview", sub: "Program health at a glance" },
  "/applications": { title: "Applications", sub: "Review & onboard applicants" },
  "/students": { title: "Members", sub: "Everyone on the platform" },
  "/curriculum": { title: "Curriculum", sub: "Edit phases, modules & lessons" },
  "/cohorts": { title: "Cohorts", sub: "Create & manage cohorts" },
  "/reviews": { title: "Reviews", sub: "Visibility & project submissions" },
  "/partners": { title: "Partners", sub: "Organisations & partner accounts" },
  "/revenue": { title: "Revenue", sub: "Sponsorships, income & payouts" },
  "/partner": { title: "Partner Portal", sub: "Talent, hiring & impact" },
  "/talent-pool": { title: "Talent Pool", sub: "Vetted, opted-in builders" },
  "/hiring-pipeline": { title: "Hiring Pipeline", sub: "Track candidates end-to-end" },
  "/impact": { title: "Impact", sub: "Verified program outcomes" },
};

export type NavItem = { label: string; icon: string; href: string; badge?: string };

export const NAV: Record<Persona, NavItem[]> = {
  applicant: [
    { label: "Welcome", icon: ICON.home, href: "/welcome" },
    { label: "Events", icon: ICON.calendar, href: "/events" },
    { label: "My Profile", icon: ICON.user, href: "/profile" },
  ],
  student: [
    { label: "Dashboard", icon: ICON.home, href: "/dashboard" },
    { label: "My Learning", icon: ICON.book, href: "/learning" },
    { label: "AI Tutor", icon: ICON.chat, href: "/tutor" },
    { label: "Projects", icon: ICON.grid, href: "/projects" },
    { label: "Community", icon: ICON.users, href: "/community" },
    { label: "Events", icon: ICON.calendar, href: "/events" },
    { label: "Opportunities", icon: ICON.bag, href: "/opportunities" },
    { label: "Earn Hub", icon: ICON.coin, href: "/earn" },
    { label: "Badges & Certs", icon: ICON.award, href: "/badges" },
    { label: "My Profile", icon: ICON.user, href: "/profile" },
  ],
  manager: [
    { label: "Community", icon: ICON.users, href: "/community" },
    { label: "Reviews", icon: ICON.check, href: "/reviews" },
    { label: "Members", icon: ICON.user, href: "/students" },
    { label: "Badges & Certs", icon: ICON.award, href: "/badges" },
    { label: "Events", icon: ICON.calendar, href: "/events" },
    { label: "Opportunities", icon: ICON.bag, href: "/opportunities" },
    { label: "My Profile", icon: ICON.user, href: "/profile" },
  ],
  admin: [
    { label: "Overview", icon: ICON.chart, href: "/admin" },
    { label: "Applications", icon: ICON.inbox, href: "/applications" },
    { label: "Reviews", icon: ICON.check, href: "/reviews" },
    { label: "Members", icon: ICON.users, href: "/students" },
    { label: "Badges & Certs", icon: ICON.award, href: "/badges" },
    { label: "Curriculum", icon: ICON.edit, href: "/curriculum" },
    { label: "Cohorts", icon: ICON.book, href: "/cohorts" },
    { label: "Events", icon: ICON.calendar, href: "/events" },
    { label: "Community", icon: ICON.chat, href: "/community" },
    { label: "Opportunities", icon: ICON.bag, href: "/opportunities" },
    { label: "Partners", icon: ICON.star, href: "/partners" },
    { label: "Revenue", icon: ICON.coin, href: "/revenue" },
  ],
  partner: [
    { label: "Overview", icon: ICON.chart, href: "/partner" },
    { label: "Talent Pool", icon: ICON.users, href: "/talent-pool" },
    { label: "Hiring Pipeline", icon: ICON.bag, href: "/hiring-pipeline" },
    { label: "Opportunities", icon: ICON.grid, href: "/opportunities" },
    { label: "Impact", icon: ICON.award, href: "/impact" },
    { label: "Events", icon: ICON.calendar, href: "/events" },
    { label: "My Profile", icon: ICON.user, href: "/profile" },
  ],
};

export const PERSONA_HOME: Record<Persona, string> = {
  applicant: "/welcome",
  student: "/dashboard",
  manager: "/community",
  admin: "/admin",
  partner: "/partner",
};

// Quick-jump search targets, filtered by role in the shell.
export const SEARCH_TARGETS: { label: string; sub: string; href: string; roles: Persona[] }[] = [
  { label: "Dashboard", sub: "Student · overview", href: "/dashboard", roles: ["student"] },
  { label: "My Learning", sub: "Curriculum & progress", href: "/learning", roles: ["student"] },
  { label: "AI Tutor", sub: "Context-aware chat", href: "/tutor", roles: ["student"] },
  { label: "Projects", sub: "Capstones & AI evaluation", href: "/projects", roles: ["student"] },
  { label: "Earn Hub", sub: "Opportunities & payouts", href: "/earn", roles: ["student"] },
  { label: "Badges & Certificates", sub: "Your achievements", href: "/badges", roles: ["student"] },
  { label: "Community", sub: "Feed & announcements", href: "/community", roles: ["student", "manager", "admin", "partner"] },
  { label: "Events", sub: "Program calendar", href: "/events", roles: ["applicant", "student", "manager", "admin", "partner"] },
  { label: "Opportunities", sub: "Jobs, gigs & internships", href: "/opportunities", roles: ["student", "manager", "admin", "partner"] },
  { label: "My Profile", sub: "Links & visibility", href: "/profile", roles: ["applicant", "student", "manager", "admin", "partner"] },
  { label: "Admin Overview", sub: "Program health", href: "/admin", roles: ["admin"] },
  { label: "Applications", sub: "Review applicants", href: "/applications", roles: ["admin"] },
  { label: "Reviews", sub: "Submission queues", href: "/reviews", roles: ["admin", "manager"] },
  { label: "Members", sub: "All platform users", href: "/students", roles: ["admin", "manager"] },
  { label: "Curriculum", sub: "Edit program content", href: "/curriculum", roles: ["admin"] },
  { label: "Partner Portal", sub: "Talent & hiring", href: "/partner", roles: ["partner"] },
  { label: "Talent Pool", sub: "Opted-in builders", href: "/talent-pool", roles: ["partner"] },
];

export const tutorChips = [
  { label: "Give me an example", send: "Give me an example" },
  { label: "Explain in French", send: "Explain this in French" },
  { label: "Debug my code", send: "Help me debug my code" },
];
