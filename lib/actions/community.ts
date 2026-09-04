"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isStaff } from "@/lib/constants";
import { postSchema, eventSchema, opportunitySchema, profileSchema, interestStatusSchema } from "@/lib/validation";
import { notify } from "@/lib/progress";
import { encryptSecret } from "@/lib/crypto";
import { isAiProviderId, type AiProviderId } from "@/lib/aiProviderMeta";

export type ActionState = { ok?: boolean; error?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user;
}

// ---------------- Community feed ----------------

export async function createPostAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (user.role === "applicant") return { error: "Community opens once you join the cohort." };
  const parsed = postSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) return { error: "Write something first." };
  await prisma.post.create({ data: { authorId: user.id, body: parsed.data.body } });
  revalidatePath("/community");
  return { ok: true };
}

export async function deletePostAction(postId: string): Promise<ActionState> {
  const user = await requireUser();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "Post not found." };
  if (post.authorId !== user.id && !isStaff(user.role)) return { error: "Not allowed." };
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/community");
  return { ok: true };
}

export async function togglePinPostAction(postId: string): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "Post not found." };
  await prisma.post.update({ where: { id: postId }, data: { pinned: !post.pinned } });
  revalidatePath("/community");
  return { ok: true };
}

// ---------------- Events ----------------

function parseEventForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    kind: formData.get("kind"),
    audience: formData.get("audience"),
    location: formData.get("location") || undefined,
    link: formData.get("link") || "",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
  });
}

export async function createEventAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };
  const parsed = parseEventForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the event details." };
  const { link, ...rest } = parsed.data;
  await prisma.event.create({ data: { ...rest, link: link || null, createdById: user.id } });
  revalidatePath("/events");
  return { ok: true };
}

export async function updateEventAction(eventId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };
  const parsed = parseEventForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the event details." };
  const { link, ...rest } = parsed.data;
  await prisma.event.update({ where: { id: eventId }, data: { ...rest, link: link || null } });
  revalidatePath("/events");
  return { ok: true };
}

export async function deleteEventAction(eventId: string): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { error: "Staff only." };
  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/events");
  return { ok: true };
}

// ---------------- Opportunities ----------------

export async function createOpportunityAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!isStaff(user.role) && user.role !== "partner") return { error: "Staff or partners only." };
  const parsed = opportunitySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    type: formData.get("type"),
    pay: formData.get("pay") || undefined,
    skills: formData.get("skills") || undefined,
    location: formData.get("location") || undefined,
    link: formData.get("link") || "",
    deadline: formData.get("deadline") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  const d = parsed.data;

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  await prisma.opportunity.create({
    data: {
      title: d.title,
      description: d.description ?? null,
      type: d.type,
      pay: d.pay ?? null,
      skills: d.skills ? d.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      location: d.location ?? null,
      link: d.link || null,
      deadline: d.deadline ?? null,
      postedById: user.id,
      partnerId: dbUser?.partnerId ?? null,
    },
  });
  revalidatePath("/opportunities");
  return { ok: true };
}

export async function setOpportunityStatusAction(id: string, status: "open" | "closed"): Promise<ActionState> {
  const user = await requireUser();
  const opp = await prisma.opportunity.findUnique({ where: { id } });
  if (!opp) return { error: "Not found." };
  if (opp.postedById !== user.id && !isStaff(user.role)) return { error: "Not allowed." };
  await prisma.opportunity.update({ where: { id }, data: { status } });
  revalidatePath("/opportunities");
  return { ok: true };
}

export async function expressInterestAction(opportunityId: string, note?: string): Promise<ActionState> {
  const user = await requireUser();
  if (user.role !== "student") return { error: "Students only." };
  await prisma.opportunityInterest.upsert({
    where: { opportunityId_userId: { opportunityId, userId: user.id } },
    create: { opportunityId, userId: user.id, note: note ?? null },
    update: { note: note ?? null },
  });
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (opp) await notify(opp.postedById, `${user.name ?? "A student"} is interested in “${opp.title}”`, "/opportunities");
  revalidatePath("/opportunities");
  revalidatePath("/earn");
  return { ok: true };
}

/**
 * Staff/poster application tracking: set the funnel status on a student's
 * interest (interested → applied → accepted/hired/declined) and optionally
 * the expected stipend/payout in FCFA — pipeline value visible before the
 * real money is recorded in the ledger (/revenue).
 */
export async function setInterestStatusAction(
  interestId: string,
  status: string,
  expectedAmount?: number | null,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = interestStatusSchema.safeParse(status);
  if (!parsed.success) return { error: "Invalid status." };
  const amount =
    expectedAmount === undefined || expectedAmount === null
      ? undefined // leave stored value untouched
      : Number.isInteger(expectedAmount) && expectedAmount > 0
        ? expectedAmount
        : expectedAmount === 0
          ? null // explicit clear
          : undefined;

  const interest = await prisma.opportunityInterest.findUnique({
    where: { id: interestId },
    include: { opportunity: true },
  });
  if (!interest) return { error: "Application not found." };
  if (!isStaff(user.role) && interest.opportunity.postedById !== user.id) return { error: "Not allowed." };

  await prisma.opportunityInterest.update({
    where: { id: interestId },
    data: { status: parsed.data, ...(amount !== undefined ? { expectedAmount: amount } : {}) },
  });
  if (parsed.data === "accepted" || parsed.data === "hired") {
    await notify(interest.userId, `🎉 You've been marked ${parsed.data} for “${interest.opportunity.title}”`, "/earn");
  }
  revalidatePath("/opportunities");
  revalidatePath("/earn");
  return { ok: true };
}

/**
 * Student self-report for external programs: "I've applied". Only transitions
 * the caller's OWN interest from interested → applied — never touches other
 * users' rows and never downgrades a staff-set outcome (idempotent no-op
 * once the status has moved past "interested").
 */
export async function markAppliedAction(opportunityId: string): Promise<ActionState> {
  const user = await requireUser();
  if (user.role !== "student") return { error: "Students only." };
  const interest = await prisma.opportunityInterest.findUnique({
    where: { opportunityId_userId: { opportunityId, userId: user.id } },
    include: { opportunity: true },
  });
  if (!interest) return { error: "Mark yourself as interested first." };
  if (interest.status !== "interested") return { ok: true }; // already advanced

  await prisma.opportunityInterest.update({ where: { id: interest.id }, data: { status: "applied" } });
  await notify(interest.opportunity.postedById, `${user.name ?? "A student"} applied to “${interest.opportunity.title}”`, "/opportunities");
  revalidatePath("/opportunities");
  revalidatePath("/earn");
  return { ok: true };
}

// ---------------- Hiring pipeline (partners) ----------------

async function requirePartnerOrg(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u?.partnerId) throw new Error("NO_PARTNER_ORG");
  return u.partnerId;
}

export async function shortlistAction(studentId: string): Promise<ActionState> {
  try {
    const user = await requireUser();
    if (user.role !== "partner") return { error: "Partners only." };
    const partnerId = await requirePartnerOrg(user.id);
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "student" || !student.talentVisible) {
      return { error: "This profile is not available." };
    }
    await prisma.pipelineCard.upsert({
      where: { partnerId_userId: { partnerId, userId: studentId } },
      create: { partnerId, userId: studentId, stage: "Shortlisted" },
      update: {},
    });
    revalidatePath("/talent-pool");
    revalidatePath("/hiring-pipeline");
    return { ok: true };
  } catch {
    return { error: "Your account is not linked to a partner organisation yet — ask an admin." };
  }
}

export async function movePipelineCardAction(cardId: string, stage: string): Promise<ActionState> {
  const user = await requireUser();
  if (user.role !== "partner" && !isStaff(user.role)) return { error: "Not allowed." };
  const card = await prisma.pipelineCard.findUnique({ where: { id: cardId } });
  if (!card) return { error: "Not found." };
  if (user.role === "partner") {
    const partnerId = await requirePartnerOrg(user.id);
    if (card.partnerId !== partnerId) return { error: "Not your pipeline." };
  }
  await prisma.pipelineCard.update({ where: { id: cardId }, data: { stage } });
  if (stage === "Hired") {
    await notify(card.userId, "🎉 You've been marked as Hired in a partner's pipeline!", "/dashboard");
  }
  revalidatePath("/hiring-pipeline");
  return { ok: true };
}

export async function removePipelineCardAction(cardId: string): Promise<ActionState> {
  const user = await requireUser();
  const card = await prisma.pipelineCard.findUnique({ where: { id: cardId } });
  if (!card) return { error: "Not found." };
  if (user.role === "partner") {
    const partnerId = await requirePartnerOrg(user.id);
    if (card.partnerId !== partnerId) return { error: "Not your pipeline." };
  } else if (!isStaff(user.role)) {
    return { error: "Not allowed." };
  }
  await prisma.pipelineCard.delete({ where: { id: cardId } });
  revalidatePath("/hiring-pipeline");
  return { ok: true };
}

// ---------------- Profile ----------------

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") || undefined,
    city: formData.get("city") || undefined,
    phone: formData.get("phone") || undefined,
    portfolioUrl: formData.get("portfolioUrl") || "",
    githubUrl: formData.get("githubUrl") || "",
    linkedinUrl: formData.get("linkedinUrl") || "",
    xUrl: formData.get("xUrl") || "",
    mediumUrl: formData.get("mediumUrl") || "",
    huggingfaceUrl: formData.get("huggingfaceUrl") || "",
    kaggleUrl: formData.get("kaggleUrl") || "",
    talentVisible: formData.get("talentVisible") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  const d = parsed.data;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: d.name,
      bio: d.bio ?? null,
      city: d.city ?? null,
      phone: d.phone ?? null,
      portfolioUrl: d.portfolioUrl || null,
      githubUrl: d.githubUrl || null,
      linkedinUrl: d.linkedinUrl || null,
      xUrl: d.xUrl || null,
      mediumUrl: d.mediumUrl || null,
      huggingfaceUrl: d.huggingfaceUrl || null,
      kaggleUrl: d.kaggleUrl || null,
      talentVisible: d.talentVisible ?? false,
    },
  });
  revalidatePath("/profile");
  return { ok: true };
}

// ---------------- AI Tutor: personal API keys (BYOK) ----------------

const AI_KEY_FIELD: Record<AiProviderId, "geminiApiKeyEnc" | "anthropicApiKeyEnc" | "openaiApiKeyEnc" | "lcwatApiKeyEnc"> = {
  gemini: "geminiApiKeyEnc",
  anthropic: "anthropicApiKeyEnc",
  openai: "openaiApiKeyEnc",
  lcwat: "lcwatApiKeyEnc",
};

export async function saveAiKeyAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const provider = String(formData.get("provider") ?? "");
  if (!isAiProviderId(provider)) return { error: "Unknown AI provider." };
  const raw = String(formData.get("apiKey") ?? "").trim();
  if (!raw) return { error: "Paste your API key first." };
  if (raw.length < 15) return { error: "That doesn't look like a valid API key." };
  await prisma.user.update({ where: { id: user.id }, data: { [AI_KEY_FIELD[provider]]: encryptSecret(raw) } });
  revalidatePath("/profile");
  revalidatePath("/tutor");
  return { ok: true };
}

export async function removeAiKeyAction(provider: string): Promise<ActionState> {
  const user = await requireUser();
  if (!isAiProviderId(provider)) return { error: "Unknown AI provider." };
  await prisma.user.update({ where: { id: user.id }, data: { [AI_KEY_FIELD[provider]]: null } });
  revalidatePath("/profile");
  revalidatePath("/tutor");
  return { ok: true };
}
