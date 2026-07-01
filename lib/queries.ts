import { cache } from "react";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { formatFcfa, TRACK_LABELS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { cohort: true, partner: true },
  });
});

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

// ---------------------------------------------------------------------------
// Student · Dashboard
// ---------------------------------------------------------------------------

export async function getStudentDashboard(userId: string) {
  const [user, badgeCount, submissions, matches, paidAgg] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, include: { cohort: true } }),
    prisma.userBadge.count({ where: { userId } }),
    prisma.submission.count({ where: { userId } }),
    prisma.gigMatch.findMany({
      where: { userId },
      include: { gig: true },
      orderBy: { matchPct: "desc" },
      take: 3,
    }),
    prisma.payout.aggregate({ where: { userId, status: "Paid" }, _sum: { amount: true } }),
  ]);
  if (!user) throw new Error("User not found");
  const earned = paidAgg._sum.amount ?? 0;

  const stats = [
    { label: "Overall progress", value: `${user.progressPercentage}%`, delta: "+8%", deltaColor: "var(--pos)", tint: "#7C3AED", tintBg: "#F1EAFC", iconPath: "M22 12A10 10 0 1112 2v10z" },
    { label: "Day streak", value: `${user.streak}`, delta: "🔥", deltaColor: "var(--warn)", tint: "#C97A0E", tintBg: "#FCF1DE", iconPath: "M12 2s5 4 5 9a5 5 0 01-10 0c0-2 1-3 1-3s0 2 2 2 2-4 2-8z" },
    { label: "Badges earned", value: `${badgeCount}`, delta: "+3", deltaColor: "var(--pos)", tint: "#D6336C", tintBg: "#FCE7F0", iconPath: "M12 15a6 6 0 100-12 6 6 0 000 12zM8 13l-1 8 5-3 5 3-1-8" },
    { label: "Projects shipped", value: `${Math.max(user.projectsShipped, submissions)}`, delta: "+1", deltaColor: "var(--pos)", tint: "#1F9D6B", tintBg: "#E6F6EF", iconPath: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  ];

  const tints = [
    { tint: "#7C3AED", tintBg: "#F1EAFC" },
    { tint: "#1F9D6B", tintBg: "#E6F6EF" },
    { tint: "#D6336C", tintBg: "#FCE7F0" },
  ];
  const incomeTasks = matches.map((m, i) => ({
    id: m.gigId,
    title: m.gig.title,
    meta: m.gig.type ?? "Freelance",
    pay: m.gig.pay,
    match: `${m.matchPct}%`,
    glyph: m.gig.glyph ?? "W",
    tint: m.gig.tint ?? tints[i % 3].tint,
    tintBg: m.gig.tintBg ?? tints[i % 3].tintBg,
  }));

  // Current module + upcoming milestones.
  const currentModule = user.track
    ? await prisma.module.findFirst({
        where: { track: user.track },
        orderBy: { orderIndex: "desc" },
        include: { lessons: { orderBy: { orderIndex: "asc" } } },
      })
    : null;

  const milestones = [
    { title: `Finish ${currentModule?.title ?? "your module"}`, sub: "2 lessons left", dotBg: "var(--brand1)", dotBorder: "#E7DCFA" },
    { title: "Submit capstone project", sub: "AI Customer Support Agent", dotBg: "#fff", dotBorder: "var(--line)" },
    { title: "Live session: API design", sub: "Sat · 3:00 PM", dotBg: "#fff", dotBorder: "var(--line)" },
    { title: 'Earn "API Integrator" badge', sub: "Unlocks new income tasks", dotBg: "#fff", dotBorder: "var(--line)" },
  ];

  const portfolio = {
    projectsShipped: Math.max(user.projectsShipped, submissions),
    earned,
    earnedShort: earned >= 1000 ? `${Math.round(earned / 1000)}k` : `${earned}`,
  };

  return { user, stats, incomeTasks, milestones, currentModule, portfolio };
}

// ---------------------------------------------------------------------------
// Student · Learning
// ---------------------------------------------------------------------------

export async function getLearning(track: string | null) {
  const t = track ?? "A";
  const modules = await prisma.module.findMany({
    where: { track: t },
    orderBy: { orderIndex: "asc" },
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
  });

  // "Current" lesson: the one flagged with content in the last module, else first.
  const currentModule = modules[modules.length > 3 ? 3 : modules.length - 1] ?? modules[0];
  const currentLesson =
    currentModule?.lessons.find((l) => l.content) ?? currentModule?.lessons[0] ?? null;

  const lessonPoints = currentLesson?.content
    ? currentLesson.content
        .split("\n")
        .filter((l) => l.trim().startsWith("- "))
        .map((l) => l.replace(/^-\s*/, "").trim())
    : [];

  return { modules, currentModule, currentLesson, lessonPoints, trackLabel: TRACK_LABELS[t] ?? t };
}

// ---------------------------------------------------------------------------
// Student · Tutor
// ---------------------------------------------------------------------------

export async function getTutorData(userId: string, track: string | null) {
  const [logs, learning] = await Promise.all([
    prisma.aiTutorLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    getLearning(track),
  ]);

  // Rebuild the most recent conversation as seed messages.
  const recent = [...logs].reverse().slice(-2);
  const seedMessages =
    recent.length > 0
      ? recent.flatMap((l) => [
          { role: "user" as const, text: l.prompt },
          { role: "bot" as const, text: l.response },
        ])
      : [
          {
            role: "bot" as const,
            text: "Hi! 👋 I'm your AI Tutor. I can see your current lesson — what would you like help with?",
          },
        ];

  const chatHistory = Array.from(new Set(logs.map((l) => l.prompt))).slice(0, 6);

  return {
    seedMessages,
    chatHistory,
    currentLessonId: learning.currentLesson?.id ?? null,
    currentLessonTitle: learning.currentLesson?.title ?? null,
  };
}

// ---------------------------------------------------------------------------
// Student · Projects
// ---------------------------------------------------------------------------

export async function getProjectsData(userId: string) {
  const projects = await prisma.project.findMany({
    orderBy: { title: "asc" },
    include: {
      submissions: { where: { userId }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const featured = projects.find((p) => p.title.includes("Customer Support")) ?? projects[0] ?? null;
  const latestSubmission = featured?.submissions[0] ?? null;

  return {
    featured,
    latestSubmission,
    deliverables: (featured?.deliverables as { title: string; ext: string }[] | null) ?? [],
    projects,
  };
}

// ---------------------------------------------------------------------------
// Student · Earn Hub
// ---------------------------------------------------------------------------

export async function getEarn(userId: string) {
  const [user, payouts, matches, smeGigs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.payout.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.gigMatch.findMany({ where: { userId }, include: { gig: true }, orderBy: { matchPct: "desc" } }),
    prisma.gig.findMany({ where: { source: "sme" } }),
  ]);

  const paid = payouts.filter((p) => p.status === "Paid");
  const totalEarned = paid.reduce((s, p) => s + p.amount, 0);
  const pending = payouts.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);

  const kpis = [
    { label: "Total earned", value: formatFcfa(totalEarned), delta: "+18% this month", color: "var(--pos)" },
    { label: "This month", value: formatFcfa(Math.round(totalEarned * 0.35)), delta: `${paid.length} gigs completed`, color: "var(--muted)" },
    { label: "Pending payout", value: formatFcfa(pending), delta: "Clears soon", color: "var(--warn)" },
    { label: "Income readiness", value: `${user?.incomeReadiness ?? 0}/100`, delta: "AI assessed", color: "var(--brand1)" },
  ];

  const gigs = matches.map((m) => ({
    id: m.gigId,
    title: m.gig.title,
    type: m.gig.type ?? "Freelance",
    pay: m.gig.pay,
    match: `${m.matchPct}%`,
    glyph: m.gig.glyph ?? "W",
    tint: m.gig.tint ?? "#7C3AED",
    tintBg: m.gig.tintBg ?? "#F1EAFC",
    skills: asStringArray(m.gig.skills),
  }));

  return {
    kpis,
    gigs,
    smeGigs: smeGigs.map((g) => ({ name: g.title, need: g.need ?? "", pay: g.pay, loc: g.location ?? "", abbr: g.glyph ?? "SME" })),
    payouts: payouts.map((p) => ({
      title: p.title,
      date: `${p.method ?? ""}`.trim(),
      amount: `+${formatFcfa(p.amount)}`,
      status: p.status,
      tone: p.status === "Paid" ? ("pos" as const) : ("warn" as const),
    })),
  };
}

// ---------------------------------------------------------------------------
// Student · Badges
// ---------------------------------------------------------------------------

export async function getBadges(userId: string) {
  const [all, earned] = await Promise.all([
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId }, include: { badge: true } }),
  ]);
  const earnedIds = new Set(earned.map((e) => e.badgeId));
  return {
    earned: earned.map((e) => e.badge),
    locked: all.filter((b) => !earnedIds.has(b.id)),
  };
}

// ---------------------------------------------------------------------------
// Admin · Overview
// ---------------------------------------------------------------------------

export async function getAdminOverview() {
  const [students, cohorts, partners, agg, atRisk] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.cohort.findMany({ orderBy: { createdAt: "asc" }, include: { _count: { select: { users: true } } } }),
    prisma.partner.findMany({ orderBy: { createdAt: "asc" }, take: 3 }),
    prisma.user.aggregate({ where: { role: "student" }, _avg: { progressPercentage: true } }),
    prisma.user.findMany({ where: { role: "student", progressPercentage: { lt: 65 } }, take: 3 }),
  ]);

  const revenue = await prisma.payout.aggregate({ _sum: { amount: true } });
  const completion = Math.round(agg._avg.progressPercentage ?? 0);

  const kpis = [
    { label: "Active learners", value: `${students}`, delta: "+22 this cohort", color: "var(--pos)" },
    { label: "Completion rate", value: `${completion}%`, delta: "+5% vs last", color: "var(--pos)" },
    { label: "At-risk (AI flag)", value: `${atRisk.length}`, delta: "Needs outreach", color: "var(--danger)" },
    { label: "Revenue (Q2)", value: formatFcfa(revenue._sum.amount ?? 0), delta: "+31%", color: "var(--pos)" },
  ];

  const cohortRows = cohorts.map((c) => ({
    name: c.name,
    track: c.trackName ?? c.track,
    learners: `${c._count.users}`,
    pct: `${Math.min(95, 40 + c._count.users)}%`,
    status: c.status,
    tone: (c.tone ?? "pos") as "pos" | "warn" | "brand",
  }));

  const enrollBars = cohorts.slice(0, 6).map((c, i) => ({
    label: `C${i + 1}`,
    h1: `${Math.min(90, 50 + c._count.users)}%`,
    h2: `${Math.max(10, 24 - i * 2)}%`,
  }));

  const riskTones = ["danger", "warn", "warn"] as const;
  const riskList = atRisk.map((u, i) => ({
    name: u.name,
    reason: i === 0 ? "No activity in 9 days" : "Progress slowing",
    initials: u.initials ?? u.name.slice(0, 2).toUpperCase(),
    avBg: u.avatarBg ?? "linear-gradient(135deg,#D6336C,#7C3AED)",
    risk: i === 0 ? "High" : "Med",
    tone: riskTones[i] ?? "warn",
  }));

  const partnerMini = partners.map((p) => ({
    abbr: p.abbr ?? p.name.slice(0, 2).toUpperCase(),
    name: p.name,
    type: `${p.type} · ${p.contribution ?? ""}`,
    value: p.value ?? "Active",
  }));

  return { kpis, cohorts: cohortRows, enrollBars, riskList, partnerMini };
}

// ---------------------------------------------------------------------------
// Partner · Overview / Talent / Pipeline / Impact
// ---------------------------------------------------------------------------

export async function getTalentPool() {
  const users = await prisma.user.findMany({
    where: { role: "student", score: { not: null } },
    orderBy: { score: "desc" },
  });
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    role: u.title ?? "AI-native builder",
    initials: u.initials ?? u.name.slice(0, 2).toUpperCase(),
    avBg: u.avatarBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
    skills: asStringArray(u.skills),
    score: u.score ? u.score.toFixed(1) : "—",
    projects: `${u.projectsShipped}`,
  }));
}

export async function getPipeline() {
  const cards = await prisma.pipelineCard.findMany({ orderBy: { orderIndex: "asc" } });
  const stages = ["Applied", "Interview", "Hired"];
  return stages.map((stage) => {
    const people = cards.filter((c) => c.stage === stage);
    return {
      stage,
      count: `${people.length}`,
      people: people.map((p) => ({
        name: p.name,
        role: p.role,
        initials: p.initials ?? p.name.slice(0, 2).toUpperCase(),
        avBg: p.avBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
      })),
    };
  });
}

export async function getImpact() {
  const [trained, earning, smes] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "student", incomeStatus: "earning" } }),
    prisma.gig.count({ where: { source: "sme" } }),
  ]);
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
  return [
    { label: "Women trained", value: `${trained}`, pct: "100%" },
    { label: "Now earning income", value: `${earning}`, pct: `${pct(earning, trained)}%` },
    { label: "SMEs digitized", value: `${smes}`, pct: "48%" },
    { label: "Avg income uplift", value: "3.4×", pct: "85%" },
  ];
}

export async function getPartnerOverview() {
  const [pipeline, impact, talent] = await Promise.all([getPipeline(), getImpact(), getTalentPool()]);
  return { pipeline, impact, talent: talent.slice(0, 4) };
}
