import { prisma } from "@/lib/db";
import { certificateCode, TRACK_LABELS } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Progress + auto-award engine.
//
// A phase is complete for a student when:
//   1. Every lesson in the phase's modules that applies to her track
//      (module.track === "ALL" or === her track) is marked complete, AND
//   2. If phase.requiresVisibilityApproval → her VisibilitySubmission is approved, AND
//   3. If phase.requiresProjectSubmission → she has at least one submission
//      (not "changes_requested") on a project of that phase for her track.
//
// On completion we auto-award the phase badge + a verifiable certificate and
// notify her. When every phase is complete, a program certificate + Graduate
// badge are issued. All operations are idempotent.
// ---------------------------------------------------------------------------

export async function notify(
  userId: string,
  title: string,
  href?: string,
  body?: string,
) {
  await prisma.notification.create({ data: { userId, title, href, body } });
}

function moduleAppliesToTrack(moduleTrack: string, userTrack: string | null): boolean {
  return moduleTrack === "ALL" || (!!userTrack && moduleTrack === userTrack);
}

/** All lesson IDs that apply to a user's track, grouped by phase. */
async function lessonIdsByPhase(userTrack: string | null) {
  const phases = await prisma.phase.findMany({
    orderBy: { orderIndex: "asc" },
    include: { modules: { include: { lessons: { select: { id: true } } } }, badge: true },
  });
  return phases.map((phase) => ({
    phase,
    lessonIds: phase.modules
      .filter((m) => moduleAppliesToTrack(m.track, userTrack))
      .flatMap((m) => m.lessons.map((l) => l.id)),
  }));
}

/** Recompute user's overall progress % across all applicable lessons. */
export async function recomputeUserProgress(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return 0;
  const byPhase = await lessonIdsByPhase(user.track);
  const allIds = byPhase.flatMap((p) => p.lessonIds);
  if (allIds.length === 0) return 0;
  const done = await prisma.lessonProgress.count({
    where: { userId, lessonId: { in: allIds } },
  });
  const pct = Math.round((done / allIds.length) * 100);
  await prisma.user.update({ where: { id: userId }, data: { progressPercentage: pct } });
  return pct;
}

async function phaseRequirementsMet(
  userId: string,
  userTrack: string | null,
  phase: { id: string; requiresVisibilityApproval: boolean; requiresProjectSubmission: boolean },
  lessonIds: string[],
): Promise<boolean> {
  if (lessonIds.length === 0) return false;
  const done = await prisma.lessonProgress.count({ where: { userId, lessonId: { in: lessonIds } } });
  if (done < lessonIds.length) return false;

  if (phase.requiresVisibilityApproval) {
    const vs = await prisma.visibilitySubmission.findUnique({ where: { userId } });
    if (vs?.status !== "approved") return false;
  }

  if (phase.requiresProjectSubmission) {
    const count = await prisma.submission.count({
      where: {
        userId,
        status: { not: "changes_requested" },
        project: {
          module: { phaseId: phase.id },
          OR: [{ track: "ALL" }, ...(userTrack ? [{ track: userTrack }] : [])],
        },
      },
    });
    if (count === 0) return false;
  }
  return true;
}

async function awardPhase(
  userId: string,
  phase: { id: string; name: string; badge: { id: string; name: string } | null },
  userTrack: string | null,
) {
  // Badge (idempotent via unique constraint)
  if (phase.badge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: phase.badge.id } },
      create: { userId, badgeId: phase.badge.id },
      update: {},
    });
  }
  // Certificate (idempotent via @@unique([userId, phaseId]))
  const existing = await prisma.certificate.findUnique({
    where: { userId_phaseId: { userId, phaseId: phase.id } },
  });
  let cert = existing;
  if (!cert) {
    cert = await prisma.certificate.create({
      data: {
        userId,
        phaseId: phase.id,
        code: certificateCode(),
        title: `${phase.name} — Certificate of Completion`,
        track: userTrack,
      },
    });
    await notify(
      userId,
      `🎉 ${phase.name} complete — badge & certificate earned`,
      "/badges",
      phase.badge
        ? `You earned the ${phase.badge.name} and a verifiable certificate (${cert.code}).`
        : `Your certificate code is ${cert.code}.`,
    );
  }
  return cert;
}

async function maybeAwardProgramCertificate(userId: string, userTrack: string | null) {
  const byPhase = await lessonIdsByPhase(userTrack);
  for (const { phase, lessonIds } of byPhase) {
    const ok = await phaseRequirementsMet(userId, userTrack, phase, lessonIds);
    if (!ok) return;
  }
  // Every phase complete → program certificate + Graduate badge.
  const already = await prisma.certificate.findFirst({ where: { userId, phaseId: null } });
  if (already) return;

  const trackLabel = userTrack ? TRACK_LABELS[userTrack] : "AI-Native Builder";
  await prisma.certificate.create({
    data: {
      userId,
      code: certificateCode(),
      title: `TechAscend Fellowship — ${trackLabel} · Certificate of Completion`,
      track: userTrack,
    },
  });
  const grad = await prisma.badge.findUnique({ where: { name: "TechAscend Graduate" } });
  if (grad) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: grad.id } },
      create: { userId, badgeId: grad.id },
      update: {},
    });
  }
  await notify(
    userId,
    "🎓 You completed the TechAscend Fellowship!",
    "/badges",
    "Your program certificate has been issued. Congratulations, graduate!",
  );
}

/**
 * Run all phase-completion checks for a user (call after any progress-changing
 * action: lesson completion, visibility approval, project submission/review).
 */
export async function runAwardChecks(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "student") return;

  const byPhase = await lessonIdsByPhase(user.track);
  for (const { phase, lessonIds } of byPhase) {
    if (await phaseRequirementsMet(user.id, user.track, phase, lessonIds)) {
      await awardPhase(user.id, phase, user.track);
    }
  }
  await maybeAwardProgramCertificate(user.id, user.track);
  await recomputeUserProgress(user.id);
}

/**
 * Revoke the awards that a visibility approval unlocked. Called when a staff
 * member undoes a mistaken visibility approval: it removes the badge +
 * certificate for every phase that requires visibility approval, plus the
 * program-level graduate badge + certificate (which depend on every phase
 * being complete), so nothing outlives the approval that earned it.
 */
export async function revokeVisibilityAwards(userId: string) {
  const phases = await prisma.phase.findMany({
    where: { requiresVisibilityApproval: true },
    include: { badge: true },
  });
  for (const phase of phases) {
    if (phase.badge) {
      await prisma.userBadge.deleteMany({ where: { userId, badgeId: phase.badge.id } });
    }
    await prisma.certificate.deleteMany({ where: { userId, phaseId: phase.id } });
  }
  // The program certificate + Graduate badge require every phase complete, so
  // they can't survive an un-approved phase either.
  await prisma.certificate.deleteMany({ where: { userId, phaseId: null } });
  const grad = await prisma.badge.findUnique({ where: { name: "TechAscend Graduate" } });
  if (grad) await prisma.userBadge.deleteMany({ where: { userId, badgeId: grad.id } });
  await recomputeUserProgress(userId);
}

/** Mark a lesson complete (or un-complete) and run award checks. */
export async function setLessonComplete(userId: string, lessonId: string, complete: boolean) {
  if (complete) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: {},
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId, lessonId } });
  }
  await runAwardChecks(userId);
}
