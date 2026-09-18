"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/progress";
import { isStaff } from "@/lib/constants";
import {
  impactBaselineSchema,
  selectionBaselineSchema,
  studentProjectSchema,
  achievementSchema,
  impactDecisionSchema,
} from "@/lib/validation";

export type ActionState = { ok?: boolean; error?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user;
}

const IMPACT_PATHS = ["/my-impact", "/impact-review", "/dashboard"];
const revalidateImpact = () => IMPACT_PATHS.forEach((p) => revalidatePath(p));

async function notifyStaff(title: string) {
  const staff = await prisma.user.findMany({ where: { role: { in: ["admin", "manager"] } }, select: { id: true } });
  await Promise.all(staff.map((s) => notify(s.id, title, "/impact-review")));
}

// Owner-edit guard shared by projects and outcomes: verified and rejected
// items are locked (audit); everything else is editable and an edit resets
// the review cycle.
const LOCKED = ["verified", "rejected"];

// ---------------- Baseline ----------------

/** Student fills their own entry baseline (once; editable while cohort active). */
export async function saveImpactBaselineAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "student") return { error: "Students only." };
    const parsed = impactBaselineSchema.safeParse({
      previousTechTraining: formData.get("previousTechTraining") === "on",
      previousProfessionalTechExperience: formData.get("previousProfessionalTechExperience") === "on",
      employedAtEntry: formData.get("employedAtEntry") === "on",
      techEmploymentAtEntry: formData.get("techEmploymentAtEntry") === "on",
      freelancingAtEntry: formData.get("freelancingAtEntry") === "on",
      techIncomeAtEntry: formData.get("techIncomeAtEntry") === "on",
      hasReliableComputerAccess: formData.get("hasReliableComputerAccess") === "on",
      hasReliableInternetAccess: formData.get("hasReliableInternetAccess") === "on",
      highestEducationLevel: formData.get("highestEducationLevel") || undefined,
      opportunityBarrierDeclared: formData.get("opportunityBarrierDeclared") || "prefer_not_to_say",
      opportunityBarrierSummary: formData.get("opportunityBarrierSummary") || undefined,
      consentToAggregatedImpactReporting: formData.get("consentToAggregatedImpactReporting") === "on",
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details." };
    const d = parsed.data;

    // Locked once the student's cohort is completed — baseline describes entry.
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { cohort: true } });
    if (dbUser?.cohort?.status === "Completed") return { error: "Your cohort has ended — the baseline is locked." };

    await prisma.impactBaseline.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...d, opportunityBarrierSummary: d.opportunityBarrierSummary ?? null, highestEducationLevel: d.highestEducationLevel ?? null, studentCompletedAt: new Date() },
      update: { ...d, opportunityBarrierSummary: d.opportunityBarrierSummary ?? null, highestEducationLevel: d.highestEducationLevel ?? null, studentCompletedAt: new Date() },
    });
    revalidateImpact();
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

/** Staff-only: record selection signals from admissions (talent side). */
export async function saveSelectionBaselineAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (!isStaff(user.role)) return { error: "Staff only." };
    const parsed = selectionBaselineSchema.safeParse({
      userId: formData.get("userId"),
      selectionPotentialScore: formData.get("selectionPotentialScore") || undefined,
      selectionMotivationScore: formData.get("selectionMotivationScore") || undefined,
      selectionChallengeScore: formData.get("selectionChallengeScore") || undefined,
      selectionNotes: formData.get("selectionNotes") || undefined,
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the scores (1-10)." };
    const { userId, ...scores } = parsed.data;
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target || target.role !== "student") return { error: "Not a student account." };
    await prisma.impactBaseline.upsert({
      where: { userId },
      create: { userId, ...scores, selectionNotes: scores.selectionNotes ?? null },
      update: { ...scores, selectionNotes: scores.selectionNotes ?? null },
    });
    revalidatePath(`/students/${userId}`);
    revalidatePath("/impact-review");
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

// ---------------- Projects & Solutions ----------------

export async function saveStudentProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "student") return { error: "Students only." };
    const parsed = studentProjectSchema.safeParse({
      id: formData.get("id") || undefined,
      title: formData.get("title"),
      description: formData.get("description"),
      problem: formData.get("problem") || undefined,
      projectType: formData.get("projectType"),
      projectContext: formData.get("projectContext"),
      techStack: formData.get("techStack") || undefined,
      aiTools: formData.get("aiTools") || undefined,
      githubUrl: formData.get("githubUrl") || "",
      liveUrl: formData.get("liveUrl") || "",
      demoVideoUrl: formData.get("demoVideoUrl") || "",
      screenshotUrls: formData.get("screenshotUrls") || "",
      evidenceLinks: formData.get("evidenceLinks") || "",
      maturity: formData.get("maturity"),
      externalTested: formData.get("externalTested") === "on",
      testerKind: formData.get("testerKind") || undefined,
      orgName: formData.get("orgName") || undefined,
      userCount: formData.get("userCount") || undefined,
      feedback: formData.get("feedback") || undefined,
      changesMade: formData.get("changesMade") || undefined,
      teamUserIds: formData.getAll("teamUserIds").map(String).filter(Boolean),
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details." };
    const d = parsed.data;

    const data = {
      title: d.title,
      description: d.description,
      problem: d.problem ?? null,
      projectType: d.projectType,
      projectContext: d.projectContext,
      techStack: d.techStack ? d.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
      aiTools: d.aiTools ?? null,
      githubUrl: d.githubUrl || null,
      liveUrl: d.liveUrl || null,
      demoVideoUrl: d.demoVideoUrl || null,
      screenshotUrls: d.screenshotUrls ?? [],
      evidenceLinks: d.evidenceLinks ?? [],
      maturity: d.maturity,
      externalTested: d.externalTested,
      testerKind: d.externalTested ? d.testerKind ?? null : null,
      orgName: d.externalTested ? d.orgName ?? null : null,
      userCount: d.externalTested ? d.userCount ?? null : null,
      feedback: d.externalTested ? d.feedback ?? null : null,
      changesMade: d.externalTested ? d.changesMade ?? null : null,
      teamUserIds: d.teamUserIds ?? [],
    };

    if (d.id) {
      const existing = await prisma.studentProject.findUnique({ where: { id: d.id } });
      if (!existing || existing.userId !== user.id) return { error: "Project not found." };
      if (LOCKED.includes(existing.status)) return { error: "Verified items are locked — add a new project instead." };
      const wasChangesRequested = existing.status === "changes_requested";
      await prisma.studentProject.update({
        where: { id: d.id },
        // Any edit re-enters review: reset status, clear reviewer fields.
        data: { ...data, status: "submitted", reviewerId: null, reviewedAt: null, reviewNote: null, celebratedAt: null },
      });
      if (wasChangesRequested) {
        await prisma.impactReview.create({
          data: { subjectType: "project", subjectId: d.id, userId: user.id, decision: "resubmitted" },
        });
      }
    } else {
      await prisma.studentProject.create({ data: { userId: user.id, ...data } });
      await notifyStaff(`${user.name ?? "A student"} added a project to their Impact Profile`);
    }
    revalidateImpact();
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

// ---------------- Outcomes (Achievement model; UI says "outcome") ----------------

export async function saveOutcomeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "student") return { error: "Students only." };
    const details: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("details.") && typeof value === "string" && value.trim()) {
        details[key.slice("details.".length)] = value.trim().slice(0, 500);
      }
    }
    const parsed = achievementSchema.safeParse({
      id: formData.get("id") || undefined,
      kind: formData.get("kind"),
      title: formData.get("title"),
      organizationName: formData.get("organizationName") || undefined,
      roleTitle: formData.get("roleTitle") || undefined,
      employmentType: formData.get("employmentType") || undefined,
      amount: formData.get("amount") || undefined,
      currency: formData.get("currency") || "FCFA",
      occurredAt: formData.get("occurredAt") || undefined,
      startedAt: formData.get("startedAt") || undefined,
      techascendContribution: formData.get("techascendContribution") || "unknown",
      contributionNote: formData.get("contributionNote") || undefined,
      evidenceLinks: formData.get("evidenceLinks") || "",
      details: Object.keys(details).length ? details : undefined,
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details." };
    const d = parsed.data;

    const data = {
      kind: d.kind,
      title: d.title,
      organizationName: d.organizationName ?? null,
      roleTitle: d.roleTitle ?? null,
      employmentType: d.employmentType ?? null,
      amount: d.amount ?? null,
      currency: d.currency,
      occurredAt: d.occurredAt ?? null,
      startedAt: d.startedAt ?? null,
      techascendContribution: d.techascendContribution,
      contributionNote: d.contributionNote ?? null,
      evidenceLinks: d.evidenceLinks ?? [],
      details: d.details ?? undefined,
    };

    if (d.id) {
      const existing = await prisma.achievement.findUnique({ where: { id: d.id } });
      if (!existing || existing.userId !== user.id) return { error: "Outcome not found." };
      if (LOCKED.includes(existing.status)) return { error: "Verified items are locked — add a new outcome instead." };
      const wasChangesRequested = existing.status === "changes_requested";
      await prisma.achievement.update({
        where: { id: d.id },
        data: { ...data, status: "submitted", reviewerId: null, reviewedAt: null, reviewNote: null, celebratedAt: null },
      });
      if (wasChangesRequested) {
        await prisma.impactReview.create({
          data: { subjectType: "achievement", subjectId: d.id, userId: user.id, decision: "resubmitted" },
        });
      }
    } else {
      await prisma.achievement.create({ data: { userId: user.id, ...data } });
      await notifyStaff(`${user.name ?? "A student"} reported a new outcome (${d.kind})`);
    }
    // Adding/updating an outcome IS an outcome check-in.
    await prisma.user.update({ where: { id: user.id }, data: { lastOutcomeCheckInAt: new Date() } });
    revalidateImpact();
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

/** "No new outcomes — I'm up to date." */
export async function outcomeCheckInAction(): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "student") return { error: "Students only." };
    await prisma.user.update({ where: { id: user.id }, data: { lastOutcomeCheckInAt: new Date() } });
    revalidatePath("/my-impact");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

// ---------------- Verification (staff) ----------------

export async function reviewImpactItemAction(
  subjectType: "project" | "achievement",
  id: string,
  decision: string,
  note?: string,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (!isStaff(user.role)) return { error: "Staff only." };
    const parsed = impactDecisionSchema.safeParse({ subjectType, id, decision, note });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid decision." };
    const d = parsed.data;

    const item =
      d.subjectType === "project"
        ? await prisma.studentProject.findUnique({ where: { id: d.id } })
        : await prisma.achievement.findUnique({ where: { id: d.id } });
    if (!item) return { error: "Item not found." };

    const update = {
      status: d.decision,
      reviewerId: user.id,
      reviewedAt: new Date(),
      reviewNote: d.note?.trim() || null,
    };
    if (d.subjectType === "project") {
      await prisma.studentProject.update({ where: { id: d.id }, data: update });
    } else {
      await prisma.achievement.update({ where: { id: d.id }, data: update });
    }
    // Append-only audit — never deleted.
    await prisma.impactReview.create({
      data: {
        subjectType: d.subjectType,
        subjectId: d.id,
        userId: item.userId,
        decision: d.decision,
        note: d.note?.trim() || null,
        reviewerId: user.id,
      },
    });

    const label = d.subjectType === "project" ? "project" : "outcome";
    const title = "title" in item ? item.title : label;
    if (d.decision === "verified") {
      const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      await notify(item.userId, `✓ Verified by TechAscend — ${date}: “${title}”`, "/my-impact");
    } else if (d.decision === "changes_requested") {
      await notify(item.userId, `More information needed on your ${label} “${title}”`, "/my-impact", d.note);
    } else if (d.decision === "rejected") {
      await notify(item.userId, `Your ${label} “${title}” could not be verified`, "/my-impact", d.note);
    }
    revalidateImpact();
    revalidatePath(`/students/${item.userId}`);
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}

// ---------------- Celebrations ----------------

/** Mark verified impact items as celebrated (confetti fires once). */
export async function markImpactCelebratedAction(projectIds: string[], achievementIds: string[]): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (projectIds.length) {
      await prisma.studentProject.updateMany({
        where: { id: { in: projectIds }, userId: user.id, celebratedAt: null },
        data: { celebratedAt: new Date() },
      });
    }
    if (achievementIds.length) {
      await prisma.achievement.updateMany({
        where: { id: { in: achievementIds }, userId: user.id, celebratedAt: null },
        data: { celebratedAt: new Date() },
      });
    }
    return { ok: true };
  } catch {
    return { error: "Please sign in again." };
  }
}
