"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { setLessonComplete, runAwardChecks, revokeVisibilityAwards, notify } from "@/lib/progress";
import { visibilitySchema } from "@/lib/validation";
import { isStaff } from "@/lib/constants";

export type ActionState = { ok?: boolean; error?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user;
}

// ---------------- Lessons ----------------

export async function toggleLessonAction(lessonId: string, complete: boolean): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "student") return { error: "Only students can track lesson progress." };
    await setLessonComplete(user.id, lessonId, complete);
    revalidatePath("/learning");
    revalidatePath("/dashboard");
    revalidatePath("/badges");
    return { ok: true };
  } catch {
    return { error: "Could not update progress. Please try again." };
  }
}

// ---------------- Visibility (Phase 1) ----------------

export async function submitVisibilityAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (user.role !== "student") return { error: "Only students submit the Visibility phase." };

  const parsed = visibilitySchema.safeParse({
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    xUrl: formData.get("xUrl"),
    mediumUrl: formData.get("mediumUrl"),
    huggingfaceUrl: formData.get("huggingfaceUrl"),
    kaggleUrl: formData.get("kaggleUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your links." };
  const d = parsed.data;

  await prisma.$transaction([
    prisma.visibilitySubmission.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...d, status: "pending" },
      // Reset submittedAt on resubmit so "avg review time" measures the
      // reviewer's turnaround on the new version — not the whole
      // request-changes round-trip (which includes the student's fix time).
      update: { ...d, status: "pending", reviewNote: null, reviewedAt: null, reviewerId: null, submittedAt: new Date() },
    }),
    prisma.user.update({ where: { id: user.id }, data: { ...d } }),
  ]);

  // Tell staff there's a review waiting.
  const staff = await prisma.user.findMany({ where: { role: { in: ["admin", "manager"] } }, select: { id: true } });
  await Promise.all(
    staff.map((s) => notify(s.id, `Visibility submission from ${user.name ?? "a student"}`, "/reviews")),
  );

  revalidatePath("/profile");
  revalidatePath("/reviews");
  return { ok: true };
}

export async function reviewVisibilityAction(
  submissionId: string,
  decision: "approved" | "changes_requested",
  note?: string,
): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };

  const sub = await prisma.visibilitySubmission.update({
    where: { id: submissionId },
    data: { status: decision, reviewNote: note ?? null, reviewerId: user.id, reviewedAt: new Date() },
  });

  // Preserve this decision in the history log (the submission row is reused on
  // resubmit, so its own reviewNote would otherwise be overwritten).
  await prisma.visibilityReview.create({
    data: { userId: sub.userId, decision, note: note ?? null, reviewerId: user.id },
  });

  await notify(
    sub.userId,
    decision === "approved"
      ? "✅ Your Visibility submission was approved!"
      : "Your Visibility submission needs changes",
    decision === "approved" ? "/badges" : "/profile",
    note ?? undefined,
  );
  if (decision === "approved") await runAwardChecks(sub.userId);

  revalidatePath("/reviews");
  return { ok: true };
}

/**
 * Undo a visibility decision — returns the student's six profile links to the
 * review queue so a mistaken approval (or requested-changes) can be corrected.
 * If it was approved, any phase badge + certificate the approval auto-issued is
 * revoked too, so nothing is awarded until it's re-approved.
 */
export async function reopenVisibilityAction(submissionId: string): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };

  const existing = await prisma.visibilitySubmission.findUnique({ where: { id: submissionId } });
  if (!existing) return { error: "Submission not found." };
  if (existing.status === "pending") return { error: "This submission is already in the review queue." };

  const wasApproved = existing.status === "approved";
  const sub = await prisma.visibilitySubmission.update({
    where: { id: submissionId },
    data: { status: "pending", reviewNote: null, reviewerId: null, reviewedAt: null },
  });

  if (wasApproved) await revokeVisibilityAwards(sub.userId);

  await prisma.visibilityReview.create({
    data: { userId: sub.userId, decision: "reopened", reviewerId: user.id },
  });

  await notify(
    sub.userId,
    "Your Visibility submission is back under review",
    "/profile",
    wasApproved
      ? "A reviewer reopened your six profile links — the phase badge and certificate are paused until it's approved again."
      : "A reviewer reopened your six profile links to take another look.",
  );

  revalidatePath("/reviews");
  revalidatePath("/profile");
  revalidatePath("/badges");
  return { ok: true };
}

// ---------------- Project submission review (mentor) ----------------

export async function mentorReviewAction(
  submissionId: string,
  data: { mentorScore?: number; mentorFeedback?: string; status: "approved" | "changes_requested" | "mentor_reviewed" },
): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };

  const sub = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      mentorScore: data.mentorScore ?? null,
      mentorFeedback: data.mentorFeedback ?? null,
      status: data.status,
    },
    include: { project: true },
  });

  await notify(
    sub.userId,
    data.status === "changes_requested"
      ? `Changes requested on “${sub.project.title}”`
      : `Mentor feedback on “${sub.project.title}”`,
    "/projects",
    data.mentorFeedback ?? undefined,
  );
  if (data.status !== "changes_requested") await runAwardChecks(sub.userId);

  revalidatePath("/reviews");
  return { ok: true };
}

/**
 * Undo a project decision — sends an already-decided submission back into the
 * mentor review queue so a mistaken approval (or requested-changes) can be
 * corrected. The submission still counts as a valid submission while it sits
 * in the queue, so a badge the student legitimately earned (all lessons done
 * + a submission) is retained; only the mentor's score/feedback is cleared.
 */
export async function reopenSubmissionAction(submissionId: string): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };

  const existing = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!existing) return { error: "Submission not found." };
  if (existing.status !== "approved" && existing.status !== "changes_requested") {
    return { error: "This submission is already in the review queue." };
  }

  // Back to the queue: keep the AI-reviewed marker if it had one, else plain
  // submitted. Clear the mentor decision so the reviewer starts fresh.
  const sub = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: existing.aiScore != null ? "ai_reviewed" : "submitted",
      mentorScore: null,
      mentorFeedback: null,
    },
    include: { project: true },
  });

  await runAwardChecks(sub.userId);
  await notify(
    sub.userId,
    `“${sub.project.title}” is back in review`,
    "/projects",
    "A reviewer reopened your submission to take another look.",
  );

  revalidatePath("/reviews");
  return { ok: true };
}

/**
 * Mark approved submissions as celebrated so the "project passed" confetti
 * only ever fires once. Scoped to the caller's own submissions.
 */
export async function markProjectsCelebratedAction(submissionIds: string[]): Promise<ActionState> {
  const user = await requireUser();
  if (submissionIds.length === 0) return { ok: true };
  await prisma.submission.updateMany({
    where: { id: { in: submissionIds }, userId: user.id, celebratedAt: null },
    data: { celebratedAt: new Date() },
  });
  return { ok: true };
}

// ---------------- Notifications ----------------

export async function markNotificationsReadAction(): Promise<ActionState> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  return { ok: true };
}
