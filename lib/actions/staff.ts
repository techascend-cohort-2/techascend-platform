"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isStaff, initialsOf, avatarBgFor, TRACK_LABELS } from "@/lib/constants";
import { userAdminSchema, studentTrackSchema, partnerOrgSchema, cohortSchema, ledgerSchema, lessonEditSchema } from "@/lib/validation";
import { notify, recomputeUserProgress } from "@/lib/progress";
import { parseStudentsCsv, importStudents } from "@/lib/students-import";
import { getAssignableCohort } from "@/lib/queries";
import { setLcwatConfig, clearLcwatConfig } from "@/lib/settings";
import { createResetToken, sendResetEmail, STAFF_RESET_TTL_MIN } from "@/lib/reset";
import { emailConfigured } from "@/lib/mailer";
import { OPEN_SOURCE_PROGRAMS } from "@/lib/openSourcePrograms";

export type ActionState = {
  ok?: boolean;
  error?: string;
  tempPassword?: string;
  resetLink?: string;
  emailed?: boolean;
  suspended?: boolean;
};

async function requireStaff(adminOnly = false) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  const role = session.user.role;
  if (adminOnly ? role !== "admin" : !isStaff(role)) throw new Error("FORBIDDEN");
  return session.user;
}

/**
 * Guard for staff actions that manage another member's account (password
 * reset, suspension). Admins may act on any account; managers may act on
 * students only — never another manager, an admin, or a partner. Returns the
 * target user's fields the callers need, plus the acting staff member.
 */
async function authorizeMemberAction(userId: string) {
  const actor = await requireStaff(false); // admin or manager
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, suspendedAt: true },
  });
  if (!target) return { actor, target: null as null, error: "Member not found." as const };
  if (actor.role !== "admin" && target.role !== "student") {
    // Managers are limited to student accounts.
    return { actor, target: null as null, error: "You can only manage student accounts." as const };
  }
  return { actor, target, error: null };
}

function tempPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 12 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

// ---------------- Applications ----------------

export async function reviewApplicationAction(
  applicationId: string,
  decision: "accepted" | "rejected" | "reviewing",
  note?: string,
): Promise<ActionState> {
  const staff = await requireStaff();
  const app = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: decision,
      reviewNote: note ?? null,
      reviewedById: staff.id,
      decidedAt: decision === "reviewing" ? null : new Date(),
    },
  });

  // If the applicant already has an account, promote / notify.
  const existing = await prisma.user.findUnique({ where: { email: app.email } });
  if (existing && decision === "accepted" && existing.role === "applicant" && app.role === "learner") {
    const cohort = await getAssignableCohort();
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "student",
        track: app.track ?? existing.track ?? "A",
        cohortId: existing.cohortId ?? cohort?.id ?? null,
        title: `Fellow · Track ${app.track ?? existing.track ?? "A"}`,
      },
    });
    await notify(existing.id, "🎉 Your application was accepted — welcome to the cohort!", "/dashboard",
      "Sign out and back in if your dashboard doesn't appear immediately.");
    await recomputeUserProgress(existing.id);
  } else if (existing && decision === "rejected") {
    await notify(existing.id, "Update on your TechAscend application", "/welcome", note ?? undefined);
  }

  revalidatePath("/applications");
  return { ok: true };
}

/** Create an account for an accepted application (temp password shown once to staff). */
export async function createAccountForApplicationAction(applicationId: string): Promise<ActionState> {
  await requireStaff();
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return { error: "Application not found." };
  if (app.status !== "accepted") return { error: "Accept the application first." };
  if (await prisma.user.findUnique({ where: { email: app.email } })) {
    return { error: "This person already has an account." };
  }
  const pwd = tempPassword();
  const cohort = await getAssignableCohort();
  await prisma.user.create({
    data: {
      name: app.name,
      email: app.email,
      passwordHash: await bcrypt.hash(pwd, 10),
      role: app.role === "partner" ? "partner" : "student",
      track: app.role === "learner" ? app.track ?? "A" : null,
      cohortId: app.role === "learner" ? cohort?.id ?? null : null,
      city: app.city,
      phone: app.phone,
      initials: initialsOf(app.name),
      avatarBg: avatarBgFor(app.name),
      title: app.role === "learner" ? `Fellow · Track ${app.track ?? "A"}` : "Partner",
      mustChangePassword: true,
    },
  });
  revalidatePath("/applications");
  return { ok: true, tempPassword: pwd };
}

// ---------------- Users ----------------

export async function updateUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true); // admin only: role changes are sensitive
  const parsed = userAdminSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role") || undefined,
    track: formData.get("track") ?? "",
    cohortId: formData.get("cohortId") || undefined,
    title: formData.get("title") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid." };
  const d = parsed.data;
  await prisma.user.update({
    where: { id: d.userId },
    data: {
      ...(d.role ? { role: d.role } : {}),
      track: d.track === "" ? null : d.track,
      ...(d.cohortId ? { cohortId: d.cohortId } : {}),
      ...(d.title ? { title: d.title } : {}),
    },
  });
  revalidatePath("/students");
  return { ok: true };
}

// Track changes are a routine pedagogical call — open to admins AND managers,
// unlike role/cohort changes (updateUserAction, admin only).
export async function updateStudentTrackAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = studentTrackSchema.safeParse({
    userId: formData.get("userId"),
    track: formData.get("track"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid." };
  const { userId, track } = parsed.data;

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.role !== "student") return { error: "This account isn't a student." };

  await prisma.user.update({
    where: { id: userId },
    data: { track, title: `Fellow · Track ${track}` },
  });
  await recomputeUserProgress(userId); // lesson set is track-dependent
  await notify(userId, `Your track was changed to Track ${track}`, "/learning", TRACK_LABELS[track]);
  revalidatePath("/students");
  return { ok: true };
}

export type ImportState = {
  ok?: boolean;
  error?: string;
  summary?: { created: number; skipped: string[]; errors: string[] };
};

export async function importStudentsAction(_prev: ImportState, formData: FormData): Promise<ImportState> {
  await requireStaff(true); // admin only
  const csv = String(formData.get("csv") ?? "").trim();
  const defaultPassword = String(formData.get("defaultPassword") ?? "").trim();
  const cohortId = String(formData.get("cohortId") ?? "").trim() || null;

  if (!csv) return { error: "Paste at least one row of CSV." };
  if (defaultPassword.length < 8) return { error: "Default password must be at least 8 characters." };

  const { rows, errors: parseErrors } = parseStudentsCsv(csv);
  if (rows.length === 0) {
    return { error: parseErrors[0] ?? "No valid rows found. Expected: name,email,track,city,phone" };
  }

  const res = await importStudents(prisma, rows, { defaultPassword, cohortId });
  revalidatePath("/students");
  return {
    ok: true,
    summary: {
      created: res.created,
      skipped: res.skipped,
      errors: [...parseErrors, ...res.errors],
    },
  };
}

export async function resetPasswordAction(userId: string): Promise<ActionState> {
  const { target, error } = await authorizeMemberAction(userId);
  if (error) return { error };
  const pwd = tempPassword();
  await prisma.user.update({
    where: { id: target.id },
    data: { passwordHash: await bcrypt.hash(pwd, 10), mustChangePassword: true },
  });
  return { ok: true, tempPassword: pwd };
}

/**
 * Issue (or re-issue) a self-service reset link for a member. Unlike the temp
 * password above, the member's current password stays valid until they use the
 * link. The link is emailed when an email provider is configured, and is always
 * returned so staff can copy and share it directly. Calling again cuts a fresh
 * link and invalidates the previous one.
 */
export async function sendResetLinkAction(userId: string): Promise<ActionState> {
  const { target, error } = await authorizeMemberAction(userId);
  if (error) return { error };
  const { link } = await createResetToken(target.id, STAFF_RESET_TTL_MIN);
  let emailed = false;
  if (target.email && emailConfigured()) {
    emailed = await sendResetEmail(target.email, target.name, link, STAFF_RESET_TTL_MIN);
  }
  return { ok: true, resetLink: link, emailed };
}

/**
 * Suspend or reactivate a member's account. Same access scope as password
 * resets (admins any account, managers students only). A suspended user can't
 * sign in and is bounced out of any active session. Staff can't suspend their
 * own account.
 */
export async function setSuspensionAction(userId: string, suspend: boolean, reason?: string): Promise<ActionState> {
  const { actor, target, error } = await authorizeMemberAction(userId);
  if (error) return { error };
  if (actor.id === target.id) return { error: "You can't suspend your own account." };

  await prisma.user.update({
    where: { id: target.id },
    data: suspend
      ? { suspendedAt: new Date(), suspendedById: actor.id, suspendReason: reason?.trim() || null }
      : { suspendedAt: null, suspendedById: null, suspendReason: null },
  });

  if (!suspend) {
    // Let a reactivated member know they're back in.
    await notify(target.id, "Your TechAscend account has been reactivated", "/dashboard",
      "Welcome back — you can sign in and pick up where you left off.");
  }

  revalidatePath("/students");
  return { ok: true, suspended: suspend };
}

// ---------------- Cohorts ----------------

export async function saveCohortAction(cohortId: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true);
  const parsed = cohortSchema.safeParse({
    name: formData.get("name"),
    track: formData.get("track") || "ALL",
    status: formData.get("status") || "Active",
    hub: formData.get("hub") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    applicationsOpen: formData.get("applicationsOpen") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid." };
  if (cohortId) await prisma.cohort.update({ where: { id: cohortId }, data: parsed.data });
  else await prisma.cohort.create({ data: parsed.data });
  revalidatePath("/cohorts");
  revalidatePath("/apply");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCohortAction(cohortId: string): Promise<ActionState> {
  await requireStaff(true);
  const members = await prisma.user.count({ where: { cohortId } });
  if (members > 0) return { error: "Move its members to another cohort first." };
  await prisma.cohort.delete({ where: { id: cohortId } });
  revalidatePath("/cohorts");
  return { ok: true };
}

// ---------------- Partner orgs ----------------

export async function savePartnerOrgAction(partnerId: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true);
  const parsed = partnerOrgSchema.safeParse({
    name: formData.get("name"),
    abbr: formData.get("abbr") || undefined,
    type: formData.get("type"),
    contribution: formData.get("contribution") || undefined,
    contactInfo: formData.get("contactInfo") || undefined,
    website: formData.get("website") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid." };
  const { website, ...rest } = parsed.data;
  const data = { ...rest, website: website || null };
  if (partnerId) await prisma.partner.update({ where: { id: partnerId }, data });
  else await prisma.partner.create({ data });
  revalidatePath("/partners");
  return { ok: true };
}

export async function createPartnerUserAction(partnerId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (name.length < 2 || !email.includes("@")) return { error: "Name and a valid email are required." };
  if (await prisma.user.findUnique({ where: { email } })) return { error: "That email already has an account." };
  const pwd = tempPassword();
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(pwd, 10),
      role: "partner",
      partnerId,
      initials: initialsOf(name),
      avatarBg: avatarBgFor(name),
      title: "Partner",
      mustChangePassword: true,
    },
  });
  revalidatePath("/partners");
  return { ok: true, tempPassword: pwd };
}

export async function deletePartnerOrgAction(partnerId: string): Promise<ActionState> {
  await requireStaff(true);
  const users = await prisma.user.count({ where: { partnerId } });
  if (users > 0) return { error: "Remove or reassign this partner's user accounts first." };
  await prisma.partner.delete({ where: { id: partnerId } });
  revalidatePath("/partners");
  return { ok: true };
}

// ---------------- Ledger (revenue) ----------------

export async function addLedgerEntryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const staff = await requireStaff(true);
  const parsed = ledgerSchema.safeParse({
    kind: formData.get("kind"),
    amount: formData.get("amount"),
    note: formData.get("note") || undefined,
    partnerId: formData.get("partnerId") || undefined,
    userId: formData.get("userId") || undefined,
    occurredAt: formData.get("occurredAt") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid entry." };
  const d = parsed.data;
  await prisma.ledgerEntry.create({
    data: {
      kind: d.kind,
      amount: d.amount,
      note: d.note ?? null,
      partnerId: d.partnerId || null,
      userId: d.userId || null,
      createdById: staff.id,
      occurredAt: d.occurredAt ?? new Date(),
    },
  });
  if (d.kind === "payout" && d.userId) {
    await notify(d.userId, `💸 Payout recorded: ${d.amount.toLocaleString()} F`, "/earn", d.note ?? undefined);
  }
  revalidatePath("/revenue");
  revalidatePath("/earn");
  return { ok: true };
}

export async function deleteLedgerEntryAction(id: string): Promise<ActionState> {
  await requireStaff(true);
  await prisma.ledgerEntry.delete({ where: { id } });
  revalidatePath("/revenue");
  return { ok: true };
}

// ---------------- Curriculum CRUD ----------------

export async function saveLessonAction(
  target: { lessonId?: string; moduleId?: string },
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff(true);
  const parsed = lessonEditSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    duration: formData.get("duration") || undefined,
    content: formData.get("content") || undefined,
    aiPrompt: formData.get("aiPrompt") || undefined,
    objectives: formData.get("objectives") || undefined,
    orderIndex: formData.get("orderIndex") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid lesson." };
  const d = parsed.data;
  const data = {
    title: d.title,
    type: d.type,
    duration: d.duration ?? null,
    content: d.content ?? null,
    aiPrompt: d.aiPrompt ?? null,
    objectives: d.objectives ? d.objectives.split("\n").map((s) => s.trim()).filter(Boolean) : [],
    ...(d.orderIndex !== undefined ? { orderIndex: d.orderIndex } : {}),
  };
  if (target.lessonId) {
    await prisma.lesson.update({ where: { id: target.lessonId }, data });
  } else if (target.moduleId) {
    const last = await prisma.lesson.findFirst({
      where: { moduleId: target.moduleId },
      orderBy: { orderIndex: "desc" },
    });
    await prisma.lesson.create({
      data: { ...data, moduleId: target.moduleId, orderIndex: d.orderIndex ?? (last?.orderIndex ?? 0) + 1 },
    });
  }
  revalidatePath("/curriculum");
  revalidatePath("/learning");
  return { ok: true };
}

export async function deleteLessonAction(lessonId: string): Promise<ActionState> {
  await requireStaff(true);
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath("/curriculum");
  revalidatePath("/learning");
  return { ok: true };
}

export async function saveModuleAction(
  target: { moduleId?: string; phaseId?: string },
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff(true);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const track = String(formData.get("track") ?? "ALL");
  if (title.length < 2) return { error: "Module title is required." };
  if (target.moduleId) {
    await prisma.module.update({
      where: { id: target.moduleId },
      data: { title, description: description || null, track },
    });
  } else if (target.phaseId) {
    const last = await prisma.module.findFirst({ where: { phaseId: target.phaseId }, orderBy: { orderIndex: "desc" } });
    await prisma.module.create({
      data: { phaseId: target.phaseId, title, description: description || null, track, orderIndex: (last?.orderIndex ?? 0) + 1 },
    });
  }
  revalidatePath("/curriculum");
  revalidatePath("/learning");
  return { ok: true };
}

export async function deleteModuleAction(moduleId: string): Promise<ActionState> {
  await requireStaff(true);
  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath("/curriculum");
  revalidatePath("/learning");
  return { ok: true };
}

export async function savePhaseAction(phaseId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsAt = String(formData.get("endsAt") ?? "");
  if (name.length < 2) return { error: "Phase name is required." };
  await prisma.phase.update({
    where: { id: phaseId },
    data: {
      name,
      description: description || null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
    },
  });
  revalidatePath("/curriculum");
  revalidatePath("/learning");
  return { ok: true };
}

// ---------------- AI Tutor: LCWAT gateway config (admin) ----------------

export async function saveLcwatConfigAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff(true);
  const url = String(formData.get("gatewayUrl") ?? "").trim();
  const apiKey = String(formData.get("apiKey") ?? "").trim();
  if (url && !/^https?:\/\/.+/i.test(url)) return { error: "Gateway URL must start with http:// or https://" };
  await setLcwatConfig(url, apiKey);
  revalidatePath("/admin");
  revalidatePath("/tutor");
  revalidatePath("/profile");
  return { ok: true };
}

export async function clearLcwatConfigAction(): Promise<ActionState> {
  await requireStaff(true);
  await clearLcwatConfig();
  revalidatePath("/admin");
  revalidatePath("/tutor");
  revalidatePath("/profile");
  return { ok: true };
}

// ---------------- Curated open-source programs (admin) ----------------

/**
 * Idempotently import the curated real open-source internship/bounty programs
 * from lib/openSourcePrograms.ts onto the Opportunities board. Matching is by
 * exact title (the data module treats titles as immutable keys): new titles
 * are created, existing ones get their content fields refreshed — while
 * `status` and the original poster are preserved, so a manually closed
 * listing stays closed on re-import. Safe to click repeatedly.
 */
export async function importOpenSourceProgramsAction(): Promise<ActionState & { created?: number; updated?: number }> {
  const admin = await requireStaff(true);
  let created = 0;
  let updated = 0;
  for (const p of OPEN_SOURCE_PROGRAMS) {
    const existing = await prisma.opportunity.findFirst({ where: { title: p.title } });
    const content = {
      description: p.description,
      type: p.type,
      pay: p.pay,
      skills: p.skills,
      location: p.location,
      link: p.link,
    };
    if (existing) {
      await prisma.opportunity.update({ where: { id: existing.id }, data: content });
      updated++;
    } else {
      await prisma.opportunity.create({ data: { title: p.title, ...content, postedById: admin.id } });
      created++;
    }
  }
  revalidatePath("/opportunities");
  revalidatePath("/earn");
  return { ok: true, created, updated };
}
