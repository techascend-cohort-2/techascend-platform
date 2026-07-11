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

export async function getNotifications(userId: string) {
  const [items, unread] = await Promise.all([
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);
  return { items, unread };
}

export function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function trackFilter(userTrack: string | null) {
  return userTrack ? { in: ["ALL", userTrack] } : { equals: "ALL" };
}

// ---------------------------------------------------------------------------
// Learning: full phase → module → lesson tree with per-user progress
// ---------------------------------------------------------------------------

export async function getLearningTree(userId: string, userTrack: string | null) {
  const [phases, done, visibility] = await Promise.all([
    prisma.phase.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        badge: true,
        modules: {
          where: { track: trackFilter(userTrack) },
          orderBy: { orderIndex: "asc" },
          include: { lessons: { orderBy: { orderIndex: "asc" } }, projects: true },
        },
      },
    }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true } }),
    prisma.visibilitySubmission.findUnique({ where: { userId } }),
  ]);
  const doneSet = new Set(done.map((d) => d.lessonId));

  const tree = phases.map((phase) => {
    const lessons = phase.modules.flatMap((m) => m.lessons);
    const completed = lessons.filter((l) => doneSet.has(l.id)).length;
    return {
      phase,
      totalLessons: lessons.length,
      completedLessons: completed,
      pct: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
      doneSet,
    };
  });

  // Current lesson = first incomplete lesson across ordered phases.
  let current: { lessonId: string; phaseSlug: string } | null = null;
  outer: for (const t of tree) {
    for (const m of t.phase.modules) {
      for (const l of m.lessons) {
        if (!doneSet.has(l.id)) {
          current = { lessonId: l.id, phaseSlug: t.phase.slug };
          break outer;
        }
      }
    }
  }

  return { tree, doneSet, current, visibility };
}

export async function getLessonForUser(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { phase: true, lessons: { orderBy: { orderIndex: "asc" } } } } },
  });
  if (!lesson) return null;
  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const siblings = lesson.module.lessons;
  const idx = siblings.findIndex((l) => l.id === lessonId);
  return {
    lesson,
    completed: Boolean(progress),
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
  };
}

// ---------------------------------------------------------------------------
// Build streak: consecutive calendar days (Africa/Douala) with any learning
// activity (lesson completed, project submitted, or AI Tutor used), counted
// backward from today with a one-day grace period so it doesn't reset just
// because "today" has no activity logged yet.
// ---------------------------------------------------------------------------

function dayKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala" }).format(d);
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map(dayKey));
  const oneDay = 86_400_000;
  let cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor = new Date(cursor.getTime() - oneDay);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - oneDay);
  }
  return streak;
}

// ---------------------------------------------------------------------------
// Student dashboard
// ---------------------------------------------------------------------------

export async function getStudentDashboard(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { cohort: true } });
  if (!user) throw new Error("User not found");

  const [
    { tree, current },
    badgeCount,
    certCount,
    payoutAgg,
    upcomingEvents,
    openOpps,
    projectsSubmitted,
    recentPosts,
    openOpportunities,
    lessonDates,
    submissionDates,
    tutorDates,
  ] = await Promise.all([
    getLearningTree(userId, user.track),
    prisma.userBadge.count({ where: { userId } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.ledgerEntry.aggregate({ where: { userId, kind: "payout" }, _sum: { amount: true } }),
    prisma.event.findMany({
      where: { startsAt: { gte: new Date() }, audience: { in: ["all", "students"] } },
      orderBy: { startsAt: "asc" },
      take: 4,
    }),
    prisma.opportunity.count({ where: { status: "open" } }),
    prisma.submission.count({ where: { userId } }),
    prisma.post.findMany({
      include: { author: { select: { id: true, name: true, initials: true, avatarBg: true, role: true } } },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.opportunity.findMany({
      where: { status: "open" },
      include: { partner: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { completedAt: true } }),
    prisma.submission.findMany({ where: { userId }, select: { createdAt: true } }),
    prisma.aiTutorLog.findMany({ where: { userId }, select: { createdAt: true } }),
  ]);

  const totalLessons = tree.reduce((s, t) => s + t.totalLessons, 0);
  const doneLessons = tree.reduce((s, t) => s + t.completedLessons, 0);
  const earned = payoutAgg._sum.amount ?? 0;

  const currentPhase = tree.find((t) => t.pct < 100) ?? tree[tree.length - 1] ?? null;
  const currentLesson = current
    ? await prisma.lesson.findUnique({ where: { id: current.lessonId }, include: { module: true } })
    : null;

  const currentPhaseLessons = currentPhase
    ? currentPhase.phase.modules.flatMap((m) =>
        m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          status: currentPhase.doneSet.has(l.id)
            ? ("done" as const)
            : current?.lessonId === l.id
              ? ("current" as const)
              : ("upcoming" as const),
        })),
      )
    : [];

  const streak = computeStreak([
    ...lessonDates.map((d) => d.completedAt),
    ...submissionDates.map((d) => d.createdAt),
    ...tutorDates.map((d) => d.createdAt),
  ]);

  return {
    user,
    progressPct: user.progressPercentage,
    stats: {
      lessonsDone: doneLessons,
      lessonsTotal: totalLessons,
      badges: badgeCount,
      certificates: certCount,
      earned,
      earnedLabel: formatFcfa(earned),
      openOpportunities: openOpps,
      projectsSubmitted,
      streak,
    },
    currentPhase,
    currentPhaseLessons,
    currentLesson,
    upcomingEvents,
    recentPosts,
    openOpportunities,
    trackLabel: user.track ? TRACK_LABELS[user.track] : "—",
  };
}

// ---------------------------------------------------------------------------
// Tutor
// ---------------------------------------------------------------------------

export async function getTutorData(userId: string, userTrack: string | null) {
  const [{ current }, logs] = await Promise.all([
    getLearningTree(userId, userTrack),
    prisma.aiTutorLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const currentLesson = current
    ? await prisma.lesson.findUnique({ where: { id: current.lessonId } })
    : null;

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
            text: `Hi! 👋 I'm your AI Tutor.${currentLesson ? ` You're on “${currentLesson.title}”.` : ""} What would you like help with?`,
          },
        ];
  const chatHistory = Array.from(new Set(logs.map((l) => l.prompt))).slice(0, 6);

  return {
    seedMessages,
    chatHistory,
    currentLessonId: currentLesson?.id ?? null,
    currentLessonTitle: currentLesson?.title ?? null,
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getProjectsForUser(userId: string, userTrack: string | null) {
  const projects = await prisma.project.findMany({
    where: { track: trackFilter(userTrack) },
    include: {
      module: { include: { phase: true } },
      submissions: { where: { userId }, orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { title: "asc" },
  });
  return projects;
}

// ---------------------------------------------------------------------------
// Earn hub (real: payouts from ledger + open opportunities + my interests)
// ---------------------------------------------------------------------------

export async function getEarnData(userId: string) {
  const [payouts, opportunities, interests] = await Promise.all([
    prisma.ledgerEntry.findMany({
      where: { userId, kind: "payout" },
      orderBy: { occurredAt: "desc" },
    }),
    prisma.opportunity.findMany({
      where: { status: "open" },
      include: { partner: true, interests: { where: { userId } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.opportunityInterest.findMany({
      where: { userId },
      include: { opportunity: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const total = payouts.reduce((s, p) => s + p.amount, 0);
  return { payouts, opportunities, interests, total, totalLabel: formatFcfa(total) };
}

// ---------------------------------------------------------------------------
// Badges & certificates
// ---------------------------------------------------------------------------

export async function getBadgesData(userId: string) {
  const [allBadges, earned, certificates] = await Promise.all([
    prisma.badge.findMany({ include: { phase: true }, orderBy: { name: "asc" } }),
    prisma.userBadge.findMany({ where: { userId }, include: { badge: { include: { phase: true } } } }),
    prisma.certificate.findMany({ where: { userId }, include: { phase: true }, orderBy: { issuedAt: "asc" } }),
  ]);
  const earnedIds = new Set(earned.map((e) => e.badgeId));
  return {
    earned: earned.sort((a, b) => (a.badge.phase?.orderIndex ?? 99) - (b.badge.phase?.orderIndex ?? 99)),
    locked: allBadges
      .filter((b) => !earnedIds.has(b.id))
      .sort((a, b) => (a.phase?.orderIndex ?? 99) - (b.phase?.orderIndex ?? 99)),
    certificates,
  };
}

// Staff view: every badge/certificate ever issued, with who earned it — the
// admin overview's "Badges awarded"/"Certificates" cards link here so those
// counts are actually explorable, not just numbers.
export async function getBadgesAdmin() {
  const [userBadges, certificates] = await Promise.all([
    prisma.userBadge.findMany({
      include: {
        badge: { include: { phase: true } },
        user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } },
      },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.certificate.findMany({
      include: {
        phase: true,
        user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } },
      },
      orderBy: { issuedAt: "desc" },
    }),
  ]);
  return { userBadges, certificates };
}

export async function getCertificateByCode(code: string) {
  return prisma.certificate.findUnique({
    where: { code },
    include: { user: true, phase: true },
  });
}

// ---------------------------------------------------------------------------
// Community, events, opportunities (shared)
// ---------------------------------------------------------------------------

export async function getCommunityFeed() {
  return prisma.post.findMany({
    include: { author: { select: { id: true, name: true, initials: true, avatarBg: true, role: true, title: true } } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 60,
  });
}

export async function getEventsForRole(role: string) {
  const audiences =
    role === "admin" || role === "manager"
      ? undefined // staff see everything
      : role === "student"
        ? ["all", "students"]
        : role === "partner"
          ? ["all", "partners"]
          : ["all", "applicants"];
  const where = audiences ? { audience: { in: audiences } } : {};
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { ...where, startsAt: { gte: now } }, orderBy: { startsAt: "asc" }, take: 40 }),
    prisma.event.findMany({ where: { ...where, startsAt: { lt: now } }, orderBy: { startsAt: "desc" }, take: 15 }),
  ]);
  return { upcoming, past };
}

export async function getOpportunitiesData(userId: string, role: string) {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      partner: true,
      postedBy: { select: { name: true, role: true } },
      interests: role === "student" ? { where: { userId } } : { include: { user: { select: { id: true, name: true, initials: true, avatarBg: true } } } },
      _count: { select: { interests: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return opportunities;
}

// ---------------------------------------------------------------------------
// Applicant workspace
// ---------------------------------------------------------------------------

// Cohort a new/accepted applicant should land in: prefer whichever cohort is
// currently open for applications, else fall back to the most recently
// started cohort. Used instead of blindly picking the oldest cohort, which
// would misassign applicants once a program has run more than one cohort.
export async function getAssignableCohort() {
  const open = await prisma.cohort.findFirst({
    where: { applicationsOpen: true },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
  if (open) return open;
  return prisma.cohort.findFirst({ orderBy: [{ startDate: "desc" }, { createdAt: "desc" }] });
}

// Public-safe: whichever cohort is currently open for applications (landing
// page banner + /apply). Returns null when nothing is open right now.
export async function getOpenCohortForApply() {
  return prisma.cohort.findFirst({
    where: { applicationsOpen: true },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    select: { id: true, name: true },
  });
}

export async function getWelcomeData(email: string) {
  const [application, events, cohort] = await Promise.all([
    prisma.application.findUnique({ where: { email: email.toLowerCase() } }),
    prisma.event.findMany({
      where: { startsAt: { gte: new Date() }, audience: { in: ["all", "applicants"] } },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    getAssignableCohort(),
  ]);
  return { application, events, cohort };
}

// ---------------------------------------------------------------------------
// Staff: admin overview, reviews, applications, students, curriculum, ledger
// ---------------------------------------------------------------------------

export async function getAdminOverview() {
  const now = new Date();
  const [students, applicants, pendingApps, pendingVis, pendingSubs, cohorts, partners, events, avg, ledger] =
    await Promise.all([
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "applicant" } }),
      prisma.application.count({ where: { status: { in: ["new", "reviewing"] } } }),
      prisma.visibilitySubmission.count({ where: { status: "pending" } }),
      prisma.submission.count({ where: { status: { in: ["submitted", "ai_reviewed"] } } }),
      prisma.cohort.findMany({ include: { _count: { select: { users: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.partner.count(),
      prisma.event.findMany({ where: { startsAt: { gte: now } }, orderBy: { startsAt: "asc" }, take: 5 }),
      prisma.user.aggregate({ where: { role: "student" }, _avg: { progressPercentage: true } }),
      prisma.ledgerEntry.groupBy({ by: ["kind"], _sum: { amount: true } }),
    ]);

  const ledgerByKind = Object.fromEntries(ledger.map((l) => [l.kind, l._sum.amount ?? 0]));
  const badgesAwarded = await prisma.userBadge.count();
  const certsIssued = await prisma.certificate.count();

  return {
    kpis: {
      students,
      applicants,
      pendingApps,
      pendingReviews: pendingVis + pendingSubs,
      avgProgress: Math.round(avg._avg.progressPercentage ?? 0),
      partners,
      badgesAwarded,
      certsIssued,
      income: (ledgerByKind["sponsorship"] ?? 0) + (ledgerByKind["revenue"] ?? 0),
      paidOut: ledgerByKind["payout"] ?? 0,
    },
    cohorts,
    upcomingEvents: events,
  };
}

export async function getReviewQueues() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [visibility, submissions, activeReviewers, approvedVisThisMonth, approvedSubsThisMonth, reviewedVisThisMonth] =
    await Promise.all([
      prisma.visibilitySubmission.findMany({
        where: { status: "pending" },
        include: { user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } } },
        orderBy: { submittedAt: "asc" },
      }),
      prisma.submission.findMany({
        where: { status: { in: ["submitted", "ai_reviewed"] } },
        include: {
          user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } },
          project: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.count({ where: { role: { in: ["admin", "manager"] } } }),
      prisma.visibilitySubmission.count({ where: { status: "approved", reviewedAt: { gte: monthStart } } }),
      prisma.submission.count({ where: { status: "approved", updatedAt: { gte: monthStart } } }),
      prisma.visibilitySubmission.findMany({
        where: { status: { not: "pending" }, reviewedAt: { gte: monthStart } },
        select: { submittedAt: true, reviewedAt: true },
      }),
    ]);

  // Recently-decided visibility submissions, so a mistaken approval / requested-
  // changes can be undone (once decided they drop out of the pending queue).
  const recentlyDecidedVisibility = await prisma.visibilitySubmission.findMany({
    where: { status: { not: "pending" } },
    include: { user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } } },
    orderBy: { reviewedAt: "desc" },
    take: 8,
  });

  // Recently-decided project submissions, so a mistaken approval / requested-
  // changes can be undone (once decided they drop out of the pending queue).
  const recentlyDecidedSubmissions = await prisma.submission.findMany({
    where: { status: { in: ["approved", "changes_requested"] } },
    include: {
      user: { select: { id: true, name: true, email: true, track: true, initials: true, avatarBg: true } },
      project: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  const reviewDurations = reviewedVisThisMonth
    .filter((v): v is { submittedAt: Date; reviewedAt: Date } => v.reviewedAt !== null)
    .map((v) => v.reviewedAt.getTime() - v.submittedAt.getTime());
  const avgReviewDays = reviewDurations.length
    ? Math.round((reviewDurations.reduce((a, b) => a + b, 0) / reviewDurations.length / 86_400_000) * 10) / 10
    : null;

  return {
    visibility,
    submissions,
    recentlyDecidedVisibility,
    recentlyDecidedSubmissions,
    stats: {
      pendingVisibility: visibility.length,
      pendingProjects: submissions.length,
      approvedThisMonth: approvedVisThisMonth + approvedSubsThisMonth,
      avgReviewDays,
      activeReviewers,
    },
  };
}

export async function getApplicationsAdmin() {
  return prisma.application.findMany({
    include: { reviewedBy: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getStudentsAdmin() {
  const [users, cohorts] = await Promise.all([
    prisma.user.findMany({
      include: { cohort: true, partner: true, _count: { select: { userBadges: true, lessonProgress: true } } },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    }),
    prisma.cohort.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  return { users, cohorts };
}

// ---------------------------------------------------------------------------
// Student progress insights (admin + manager): who's behind schedule in the
// current phase, and who's gone quiet — so staff can follow up proactively.
// ---------------------------------------------------------------------------

export type StudentInsight = {
  userId: string;
  status: "on_track" | "behind" | "inactive";
  phasePct: number; // % of current-phase lessons completed
  expectedPct: number; // % of current-phase time elapsed
  daysSinceActivity: number | null;
  currentPhaseName: string | null;
};

export async function getStudentProgressInsights(): Promise<{
  currentPhaseName: string | null;
  insights: StudentInsight[];
}> {
  const now = new Date();

  const phases = await prisma.phase.findMany({
    orderBy: { orderIndex: "asc" },
    include: { modules: { include: { lessons: { select: { id: true } } } } },
  });
  // The active phase: the latest one that has already started. Falls back to
  // the first phase if the program hasn't officially started yet.
  const currentPhase = [...phases].reverse().find((p) => p.startsAt && p.startsAt <= now) ?? phases[0] ?? null;

  let phaseElapsedPct = 0;
  const lessonIdsByTrack: Record<string, Set<string>> = { ALL: new Set(), A: new Set(), B: new Set() };
  if (currentPhase) {
    if (currentPhase.startsAt && currentPhase.endsAt) {
      const span = currentPhase.endsAt.getTime() - currentPhase.startsAt.getTime();
      const elapsed = now.getTime() - currentPhase.startsAt.getTime();
      phaseElapsedPct = span > 0 ? Math.min(1, Math.max(0, elapsed / span)) : 1;
    }
    for (const m of currentPhase.modules) {
      if (!lessonIdsByTrack[m.track]) lessonIdsByTrack[m.track] = new Set();
      for (const l of m.lessons) lessonIdsByTrack[m.track].add(l.id);
    }
  }

  const [students, lessonProgress, tutorActivity] = await Promise.all([
    prisma.user.findMany({ where: { role: "student" }, select: { id: true, track: true, progressPercentage: true } }),
    prisma.lessonProgress.findMany({ select: { userId: true, lessonId: true, completedAt: true } }),
    prisma.aiTutorLog.groupBy({ by: ["userId"], _max: { createdAt: true } }),
  ]);

  const lastActivity = new Map<string, Date>();
  const bump = (userId: string, at: Date) => {
    const prev = lastActivity.get(userId);
    if (!prev || at > prev) lastActivity.set(userId, at);
  };
  const doneLessonsByUser = new Map<string, Set<string>>();
  for (const lp of lessonProgress) {
    bump(lp.userId, lp.completedAt);
    if (!doneLessonsByUser.has(lp.userId)) doneLessonsByUser.set(lp.userId, new Set());
    doneLessonsByUser.get(lp.userId)!.add(lp.lessonId);
  }
  for (const t of tutorActivity) {
    if (t._max.createdAt) bump(t.userId, t._max.createdAt);
  }

  const INACTIVE_DAYS = 7;
  const BEHIND_THRESHOLD = 0.2; // 20 percentage points behind the phase clock

  const insights: StudentInsight[] = students.map((u) => {
    const applicable = new Set<string>([
      ...lessonIdsByTrack.ALL,
      ...(u.track ? lessonIdsByTrack[u.track] ?? [] : []),
    ]);
    const done = doneLessonsByUser.get(u.id) ?? new Set();
    const doneInPhase = [...applicable].filter((id) => done.has(id)).length;
    const phasePct = applicable.size > 0 ? doneInPhase / applicable.size : 0;

    const last = lastActivity.get(u.id) ?? null;
    const daysSinceActivity = last ? Math.floor((now.getTime() - last.getTime()) / 86_400_000) : null;

    const isInactive = u.progressPercentage < 100 && (daysSinceActivity === null || daysSinceActivity >= INACTIVE_DAYS);
    const isBehind = Boolean(currentPhase?.endsAt) && phaseElapsedPct - phasePct > BEHIND_THRESHOLD;

    return {
      userId: u.id,
      status: isInactive ? "inactive" : isBehind ? "behind" : "on_track",
      phasePct: Math.round(phasePct * 100),
      expectedPct: Math.round(phaseElapsedPct * 100),
      daysSinceActivity,
      currentPhaseName: currentPhase?.name ?? null,
    };
  });

  return { currentPhaseName: currentPhase?.name ?? null, insights };
}

// ---------------------------------------------------------------------------
// Single-student detail (staff): full progress/submissions/badges/activity
// breakdown for one student, used by the Reviews/Members "view profile" link.
// ---------------------------------------------------------------------------

export async function getStudentDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cohort: true,
      partner: true,
      userBadges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
      certificates: { include: { phase: true }, orderBy: { issuedAt: "desc" } },
      visibilitySubmission: true,
      submissions: { include: { project: true }, orderBy: { createdAt: "desc" } },
      lessonProgress: { select: { lessonId: true, completedAt: true } },
    },
  });
  if (!user) return null;

  const [tutorCount, lastTutor] = await Promise.all([
    prisma.aiTutorLog.count({ where: { userId } }),
    prisma.aiTutorLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  const phases = await prisma.phase.findMany({
    orderBy: { orderIndex: "asc" },
    include: { modules: { where: { track: { in: ["ALL", user.track ?? "A"] } }, include: { lessons: { select: { id: true } } } } },
  });
  const doneLessonIds = new Set(user.lessonProgress.map((lp) => lp.lessonId));
  const phaseBreakdown = phases.map((phase) => {
    const lessons = phase.modules.flatMap((m) => m.lessons);
    const done = lessons.filter((l) => doneLessonIds.has(l.id)).length;
    return {
      id: phase.id,
      name: phase.name,
      total: lessons.length,
      done,
      pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
  });

  const lastLessonAt = user.lessonProgress.reduce<Date | null>(
    (max, lp) => (!max || lp.completedAt > max ? lp.completedAt : max),
    null,
  );

  return { user, phaseBreakdown, tutorCount, lastTutorAt: lastTutor?.createdAt ?? null, lastLessonAt };
}

export async function getCurriculumAdmin() {
  return prisma.phase.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      badge: true,
      modules: {
        orderBy: { orderIndex: "asc" },
        include: { lessons: { orderBy: { orderIndex: "asc" } }, projects: true },
      },
    },
  });
}

export async function getCohortsAdmin() {
  return prisma.cohort.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getPartnersAdmin() {
  return prisma.partner.findMany({
    include: { users: true, _count: { select: { opportunities: true, pipelineCards: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getLedgerData() {
  const [entries, partners, students] = await Promise.all([
    prisma.ledgerEntry.findMany({
      include: { partner: true, user: { select: { name: true } }, createdBy: { select: { name: true } } },
      orderBy: { occurredAt: "desc" },
    }),
    prisma.partner.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: "student" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  const sum = (kind: string) => entries.filter((e) => e.kind === kind).reduce((s, e) => s + e.amount, 0);
  return {
    entries,
    partners,
    students,
    totals: {
      sponsorship: sum("sponsorship"),
      revenue: sum("revenue"),
      payout: sum("payout"),
      expense: sum("expense"),
      net: sum("sponsorship") + sum("revenue") - sum("payout") - sum("expense"),
    },
  };
}

// ---------------------------------------------------------------------------
// Partner suite
// ---------------------------------------------------------------------------

export async function getTalentPool() {
  const users = await prisma.user.findMany({
    where: { role: "student", talentVisible: true },
    include: { _count: { select: { userBadges: true, submissions: true } }, cohort: true },
    orderBy: { progressPercentage: "desc" },
  });
  return users;
}

export async function getPipelineForPartner(partnerId: string) {
  const cards = await prisma.pipelineCard.findMany({
    where: { partnerId },
    include: { user: { select: { id: true, name: true, initials: true, avatarBg: true, track: true, title: true, progressPercentage: true } } },
    orderBy: { createdAt: "asc" },
  });
  return cards;
}

export async function getImpactData() {
  const [students, visApproved, badges, certs, avg, hired, payoutAgg] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.visibilitySubmission.count({ where: { status: "approved" } }),
    prisma.userBadge.count(),
    prisma.certificate.count(),
    prisma.user.aggregate({ where: { role: "student" }, _avg: { progressPercentage: true } }),
    prisma.pipelineCard.count({ where: { stage: "Hired" } }),
    prisma.ledgerEntry.aggregate({ where: { kind: "payout" }, _sum: { amount: true } }),
  ]);
  return {
    students,
    visApproved,
    badges,
    certs,
    avgProgress: Math.round(avg._avg.progressPercentage ?? 0),
    hired,
    paidToStudents: payoutAgg._sum.amount ?? 0,
  };
}

export async function getPartnerOverview(partnerId: string | null) {
  const [org, impact] = await Promise.all([
    partnerId
      ? prisma.partner.findUnique({
          where: { id: partnerId },
          include: {
            opportunities: { include: { _count: { select: { interests: true } } }, orderBy: { createdAt: "desc" } },
            pipelineCards: { include: { user: { select: { name: true, initials: true, avatarBg: true } } } },
            ledgerEntries: { orderBy: { occurredAt: "desc" }, take: 5 },
          },
        })
      : Promise.resolve(null),
    getImpactData(),
  ]);
  const talentCount = await prisma.user.count({ where: { role: "student", talentVisible: true } });
  return { org, impact, talentCount };
}
