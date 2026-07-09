import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sharedContent } from "./curriculum/shared";
import { trackAContent, trackAProjects } from "./curriculum/trackA";
import { trackBContent, trackBProjects } from "./curriculum/trackB";
import type { PhaseContent, ProjectSeed } from "./curriculum/types";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// TechAscend Cohort 02 — July–December 2026.
// Seeds ONLY real program structure: phases, curriculum, badges, events, and
// the two staff accounts needed to operate the platform. No fabricated
// students, partners, payouts or metrics.
// ---------------------------------------------------------------------------

// Times below are West Africa Time (UTC+1) expressed in UTC.
function wat(dateStr: string, hour: number, minute = 0): Date {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCHours(hour - 1, minute, 0, 0);
  return d;
}

const PHASES = [
  {
    slug: "visibility",
    name: "Phase 1 — Visibility",
    description:
      "Build your professional identity before you build software: GitHub, LinkedIn, X, Medium/Substack, Hugging Face and Kaggle — reviewed by the community team.",
    orderIndex: 1,
    startsAt: wat("2026-07-03", 0),
    endsAt: wat("2026-07-12", 23, 59),
    requiresVisibilityApproval: true,
    requiresProjectSubmission: false,
    badge: {
      name: "Visibility Badge",
      description: "Professional identity established and verified across six platforms.",
      iconPath: "M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z",
      tint: "#7C3AED",
    },
  },
  {
    slug: "ai-foundations",
    name: "Phase 2 — AI Foundations",
    description:
      "Think and work with AI: how models work, prompt craft, verification, plus your builder toolkit — terminal, Git & GitHub, VS Code and the web's mental model.",
    orderIndex: 2,
    startsAt: wat("2026-07-13", 0),
    endsAt: wat("2026-08-07", 23, 59),
    requiresVisibilityApproval: false,
    requiresProjectSubmission: false,
    badge: {
      name: "AI Foundations Badge",
      description: "AI-native fundamentals: prompting, verification, Git and the builder toolkit.",
      iconPath: "M12 2s5 4 5 9a5 5 0 01-10 0c0-2 1-3 1-3s0 2 2 2 2-4 2-8z",
      tint: "#2D6FD9",
    },
  },
  {
    slug: "core-skills",
    name: "Phase 3 — Core Skills",
    description:
      "Track-specific depth. Track A: web foundations, JavaScript, React, APIs & databases, AI-assisted engineering. Track B: automation thinking, n8n, APIs & webhooks, AI workflows, no-code products.",
    orderIndex: 3,
    startsAt: wat("2026-08-10", 0),
    endsAt: wat("2026-10-09", 23, 59),
    requiresVisibilityApproval: false,
    requiresProjectSubmission: false,
    badge: {
      name: "Core Builder Badge",
      description: "Core track skills completed — ready to build real products.",
      iconPath: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
      tint: "#C026D3",
    },
  },
  {
    slug: "build-studio",
    name: "Phase 4 — Build Studio",
    description:
      "From brief to deployed product: guided build sprints and a capstone project submitted for AI evaluation and mentor review.",
    orderIndex: 4,
    startsAt: wat("2026-10-12", 0),
    endsAt: wat("2026-11-20", 23, 59),
    requiresVisibilityApproval: false,
    requiresProjectSubmission: true,
    badge: {
      name: "Studio Builder Badge",
      description: "Shipped a real capstone: deployed, documented and demoed.",
      iconPath: "M20 6L9 17l-5-5",
      tint: "#1F9D6B",
    },
  },
  {
    slug: "launch-earn",
    name: "Phase 5 — Launch & Earn",
    description:
      "Turn skills into income: channels, pricing, portfolio, interviews, first leads, getting paid — closing with Demo Day and graduation.",
    orderIndex: 5,
    startsAt: wat("2026-11-23", 0),
    endsAt: wat("2026-12-18", 23, 59),
    requiresVisibilityApproval: false,
    requiresProjectSubmission: false,
    badge: {
      name: "Launch Ready Badge",
      description: "Publicly launched with portfolio, pricing and first leads in motion.",
      iconPath: "M12 2v20M16 6.5c-1-1.2-2.5-1.5-4-1.5-2.2 0-4 1-4 3s1.8 2.5 4 3 4 1 4 3-1.8 3-4 3c-1.5 0-3-.3-4-1.5",
      tint: "#D6336C",
    },
  },
] as const;

async function seedCurriculum(
  phaseIds: Record<string, string>,
  content: PhaseContent[],
  track: "ALL" | "A" | "B",
) {
  for (const pc of content) {
    const phaseId = phaseIds[pc.phaseSlug];
    if (!phaseId) throw new Error(`Unknown phase slug: ${pc.phaseSlug}`);
    const existingCount = await prisma.module.count({ where: { phaseId } });
    let mi = existingCount;
    for (const mod of pc.modules) {
      mi += 1;
      const m = await prisma.module.create({
        data: {
          phaseId,
          track,
          title: mod.title,
          description: mod.description,
          orderIndex: mi,
        },
      });
      let li = 0;
      for (const lesson of mod.lessons) {
        li += 1;
        await prisma.lesson.create({
          data: {
            moduleId: m.id,
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration,
            objectives: lesson.objectives,
            content: lesson.content,
            aiPrompt: lesson.aiPrompt,
            orderIndex: li,
          },
        });
      }
    }
  }
}

async function seedProjects(
  phaseIds: Record<string, string>,
  projects: ProjectSeed[],
  track: "A" | "B",
) {
  for (const p of projects) {
    const phaseId = phaseIds[p.phaseSlug];
    // Attach to the LAST module of that phase for this track (the submission module).
    const mod = await prisma.module.findFirst({
      where: { phaseId, track },
      orderBy: { orderIndex: "desc" },
    });
    await prisma.project.create({
      data: {
        moduleId: mod?.id ?? null,
        track,
        title: p.title,
        description: p.description,
        deliverables: p.deliverables,
        monetizationPotential: p.monetizationPotential,
        category: p.category,
        difficulty: p.difficulty,
        estimatedWeeks: p.estimatedWeeks,
      },
    });
  }
}

async function seedEvents(createdById: string) {
  const events: {
    title: string;
    kind: string;
    audience?: string;
    location?: string;
    description?: string;
    startsAt: Date;
    endsAt?: Date;
  }[] = [];

  const GROUP = "WhatsApp group";

  // Milestones
  events.push(
    {
      title: "Cohort 02 Orientation — Program & Platform Walkthrough",
      kind: "ceremony",
      audience: "all",
      location: GROUP,
      description:
        "Official start of the fellowship: how the program works, the five phases, how badges and certificates are earned, and a live tour of the platform.",
      startsAt: wat("2026-07-06", 20),
      endsAt: wat("2026-07-06", 21, 30),
    },
    {
      title: "Visibility submissions due — Phase 1 deadline",
      kind: "deadline",
      audience: "students",
      location: "Platform · My Profile",
      description: "Submit all six profile links for review to earn the Visibility Badge.",
      startsAt: wat("2026-07-12", 20),
    },
    {
      title: "Phase 2 kickoff — AI Foundations",
      kind: "live_session",
      audience: "students",
      location: GROUP,
      startsAt: wat("2026-07-13", 20),
      endsAt: wat("2026-07-13", 21, 30),
    },
    {
      title: "Phase 3 kickoff — Core Skills (tracks split)",
      kind: "live_session",
      audience: "students",
      location: GROUP,
      startsAt: wat("2026-08-10", 20),
      endsAt: wat("2026-08-10", 21, 30),
    },
    {
      title: "Phase 4 kickoff — Build Studio",
      kind: "live_session",
      audience: "students",
      location: GROUP,
      startsAt: wat("2026-10-12", 20),
      endsAt: wat("2026-10-12", 21, 30),
    },
    {
      title: "Capstone submissions due",
      kind: "deadline",
      audience: "students",
      location: "Platform · Projects",
      description: "Submit your capstone for AI evaluation and mentor review.",
      startsAt: wat("2026-11-20", 20),
    },
    {
      title: "Phase 5 kickoff — Launch & Earn",
      kind: "live_session",
      audience: "students",
      location: GROUP,
      startsAt: wat("2026-11-23", 20),
      endsAt: wat("2026-11-23", 21, 30),
    },
    {
      title: "Demo Day — Cohort 02",
      kind: "ceremony",
      audience: "all",
      location: "To be announced",
      description: "Every fellow presents her capstone to the cohort, staff and partners.",
      startsAt: wat("2026-12-12", 15),
      endsAt: wat("2026-12-12", 18),
    },
    {
      title: "Graduation — Cohort 02",
      kind: "ceremony",
      audience: "all",
      location: "To be announced",
      description: "Program certificates for fellows completing all five phases.",
      startsAt: wat("2026-12-18", 15),
      endsAt: wat("2026-12-18", 17),
    },
  );

  // Weekly live sessions: Tuesdays & Thursdays 20:00–21:30 WAT, Jul 7 – Dec 17.
  const milestoneDays = new Set(events.map((e) => e.startsAt.toISOString().slice(0, 10)));
  const start = new Date("2026-07-07T00:00:00.000Z");
  const end = new Date("2026-12-17T23:59:59.000Z");
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay(); // 2 = Tue, 4 = Thu
    if (dow !== 2 && dow !== 4) continue;
    const dateStr = d.toISOString().slice(0, 10);
    if (milestoneDays.has(dateStr)) continue;
    events.push({
      title: "Live session — Cohort 02",
      kind: "live_session",
      audience: "students",
      location: GROUP,
      startsAt: wat(dateStr, 20),
      endsAt: wat(dateStr, 21, 30),
    });
  }

  await prisma.event.createMany({
    data: events.map((e) => ({ ...e, createdById })),
  });
  return events.length;
}

async function main() {
  console.log("🌱 Seeding TechAscend Cohort 02 (live program — no fake data)…");

  // Wipe everything (fresh program install).
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.opportunityInterest.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.pipelineCard.deleteMany(),
    prisma.ledgerEntry.deleteMany(),
    prisma.post.deleteMany(),
    prisma.event.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.aiTutorLog.deleteMany(),
    prisma.visibilitySubmission.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.project.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.module.deleteMany(),
    prisma.phase.deleteMany(),
    prisma.application.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.cohort.deleteMany(),
  ]);

  // ---------------- Cohort ----------------
  const cohort = await prisma.cohort.create({
    data: {
      name: "Cohort 02 — July 2026",
      track: "ALL",
      status: "Active",
      hub: "Cameroon",
      startDate: wat("2026-07-06", 8),
      endDate: wat("2026-12-18", 18),
      // Already in session by the time this seed runs — open the NEXT
      // cohort for applications from the admin Cohorts screen when ready.
      applicationsOpen: false,
    },
  });

  // ---------------- Phases + badges ----------------
  const phaseIds: Record<string, string> = {};
  for (const p of PHASES) {
    const phase = await prisma.phase.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        track: "ALL",
        orderIndex: p.orderIndex,
        startsAt: p.startsAt,
        endsAt: p.endsAt,
        requiresVisibilityApproval: p.requiresVisibilityApproval,
        requiresProjectSubmission: p.requiresProjectSubmission,
      },
    });
    phaseIds[p.slug] = phase.id;
    await prisma.badge.create({
      data: { ...p.badge, phaseId: phase.id },
    });
  }
  // Program-level badge (auto-awarded when all phases complete).
  await prisma.badge.create({
    data: {
      name: "TechAscend Graduate",
      description: "Completed the full TechAscend fellowship — all five phases.",
      iconPath: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5",
      tint: "#0F172A",
    },
  });

  // ---------------- Curriculum ----------------
  await seedCurriculum(phaseIds, sharedContent, "ALL");
  await seedCurriculum(phaseIds, trackAContent, "A");
  await seedCurriculum(phaseIds, trackBContent, "B");
  await seedProjects(phaseIds, trackAProjects, "A");
  await seedProjects(phaseIds, trackBProjects, "B");

  const [phases, modules, lessons, projects] = await Promise.all([
    prisma.phase.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.project.count(),
  ]);

  // ---------------- Staff accounts ----------------
  // Real operating accounts — CHANGE THESE PASSWORDS after first login.
  const adminPwd = "TechAscend-Admin-2026";
  const managerPwd = "TechAscend-Team-2026";
  await prisma.user.create({
    data: {
      name: "TechAscend Admin",
      email: "admin@techascend.africa",
      passwordHash: await bcrypt.hash(adminPwd, 10),
      role: "admin",
      title: "Program Director",
      initials: "TA",
      avatarBg: "linear-gradient(135deg,#7C3AED,#D6336C)",
      mustChangePassword: true,
    },
  });
  await prisma.user.create({
    data: {
      name: "Community Team",
      email: "community@techascend.africa",
      passwordHash: await bcrypt.hash(managerPwd, 10),
      role: "manager",
      title: "Community Manager",
      initials: "CT",
      avatarBg: "linear-gradient(135deg,#2D6FD9,#1F9D6B)",
      mustChangePassword: true,
    },
  });

  // ---------------- Events ----------------
  const admin = await prisma.user.findUnique({ where: { email: "admin@techascend.africa" } });
  const eventCount = await seedEvents(admin!.id);

  console.log("✅ Seed complete.");
  console.log(`   Cohort:  ${cohort.name}`);
  console.log(`   Program: ${phases} phases · ${modules} modules · ${lessons} lessons · ${projects} capstone briefs`);
  console.log(`   Events:  ${eventCount} calendar entries (orientation Jul 6 → graduation Dec 18)`);
  console.log("   Accounts (CHANGE THESE PASSWORDS):");
  console.log(`   • admin     admin@techascend.africa      ${adminPwd}`);
  console.log(`   • manager   community@techascend.africa  ${managerPwd}`);
  console.log("   Students join via /signup (applicants) → accepted in /applications.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
