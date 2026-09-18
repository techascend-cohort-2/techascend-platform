import { z } from "zod";
import { normalizeEmailOrPhone, normalizePhone } from "@/lib/contact";
import {
  TRACKS,
  APPLICATION_ROLES,
  EVENT_KINDS,
  EVENT_AUDIENCES,
  OPPORTUNITY_TYPES,
  INTEREST_STATUSES,
  PIPELINE_STAGES,
  LEDGER_KINDS,
  ROLES,
  LESSON_TYPES,
  PARTNER_TYPES,
  PROJECT_TYPES,
  PROJECT_CONTEXTS,
  PROJECT_MATURITIES,
  TESTER_KINDS,
  ACHIEVEMENT_KINDS,
  MONEY_KINDS,
  EMPLOYMENT_TYPES,
  CONTRIBUTION_LEVELS,
  BARRIER_ANSWERS,
  GENDERS,
  maturityAtLeastTesting,
} from "@/lib/constants";

// Optional phone field: blank passes through as undefined; anything else must
// normalize (bare local numbers are assumed Cameroon — see lib/contact.ts).
const optionalPhone = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (!value || !value.trim()) return undefined;
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid phone number, e.g. 677123456 or +237677123456" });
      return z.NEVER;
    }
    return normalized;
  });

export const loginSchema = z.object({
  email: z.string().min(1).transform((value, ctx) => {
    const normalized = normalizeEmailOrPhone(value);
    if (!normalized) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid email or phone number" });
      return z.NEVER;
    }
    return normalized;
  }),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  track: z.enum(TRACKS).optional(),
  city: z.string().optional(),
  phone: optionalPhone,
  motivation: z.string().optional(),
});

export const tutorMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000),
  lessonId: z.string().optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
  // true for the first message of a fresh conversation — starts a new sticky
  // LCWAT session instead of continuing the previous one.
  newChat: z.boolean().optional(),
});

export const resetPasswordTokenSchema = z.object({
  token: z.string().min(10, "This reset link is invalid or has expired."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const submissionSchema = z.object({
  projectId: z.string().min(1),
  submissionLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  notes: z.string().max(4000).optional(),
});

export const applicationSchema = z.object({
  role: z.enum(APPLICATION_ROLES),
  name: z.string().min(2),
  email: z.string().email(),
  phone: optionalPhone,
  city: z.string().optional(),
  track: z.enum(TRACKS).optional(),
  org: z.string().optional(),
  motivation: z.string().optional(),
  fields: z.record(z.string(), z.any()).optional(),
});

const httpsUrl = z.string().url("Enter a valid link (https://…)");
export const visibilitySchema = z.object({
  githubUrl: httpsUrl,
  linkedinUrl: httpsUrl,
  xUrl: httpsUrl,
  mediumUrl: httpsUrl,
  huggingfaceUrl: httpsUrl,
  kaggleUrl: httpsUrl,
});

export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(600).optional(),
  city: z.string().optional(),
  phone: optionalPhone,
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  xUrl: z.string().url().optional().or(z.literal("")),
  mediumUrl: z.string().url().optional().or(z.literal("")),
  huggingfaceUrl: z.string().url().optional().or(z.literal("")),
  kaggleUrl: z.string().url().optional().or(z.literal("")),
  talentVisible: z.boolean().optional(),
  // optional self-declared; "" = leave unset
  gender: z.enum(GENDERS).optional().or(z.literal("")),
});

export const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  kind: z.enum(EVENT_KINDS),
  audience: z.enum(EVENT_AUDIENCES),
  location: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
});

export const postSchema = z.object({ body: z.string().min(1).max(3000) });

export const opportunitySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(OPPORTUNITY_TYPES),
  pay: z.string().optional(),
  skills: z.string().optional(), // comma-separated in forms
  location: z.string().optional(),
  link: z.string().url("Enter a valid link (https://…)").optional().or(z.literal("")),
  deadline: z.coerce.date().optional(),
});

export const interestStatusSchema = z.enum(INTEREST_STATUSES);

export const pipelineStageSchema = z.enum(PIPELINE_STAGES);

export const ledgerSchema = z.object({
  kind: z.enum(LEDGER_KINDS),
  amount: z.coerce.number().int().positive("Amount must be positive"),
  note: z.string().optional(),
  partnerId: z.string().optional(),
  userId: z.string().optional(),
  occurredAt: z.coerce.date().optional(),
});

export const userAdminSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(ROLES).optional(),
  track: z.enum(TRACKS).optional().or(z.literal("")),
  cohortId: z.string().optional(),
  title: z.string().optional(),
  gender: z.enum(GENDERS).optional().or(z.literal("")), // staff backfill
});

// Lighter-weight than userAdminSchema: track-only, for staff who can move a
// student between tracks but shouldn't touch role/cohort (managers).
export const studentTrackSchema = z.object({
  userId: z.string().min(1),
  track: z.enum(TRACKS),
});

export const partnerOrgSchema = z.object({
  name: z.string().min(2),
  abbr: z.string().optional(),
  type: z.enum(PARTNER_TYPES),
  contribution: z.string().optional(),
  contactInfo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export const cohortSchema = z.object({
  name: z.string().min(2),
  track: z.string().default("ALL"),
  status: z.string().default("Active"),
  hub: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  applicationsOpen: z.boolean().default(false),
});

export const lessonEditSchema = z.object({
  title: z.string().min(2),
  type: z.enum(LESSON_TYPES),
  duration: z.string().optional(),
  content: z.string().optional(),
  aiPrompt: z.string().optional(),
  objectives: z.string().optional(), // one per line in forms
  orderIndex: z.coerce.number().int().min(0).optional(),
});

// ---------------- Student Impact & Outcomes ----------------

// Textarea "one URL per line" → validated string[] (https-only, max 10).
const linkLines = z
  .string()
  .optional()
  .transform((value, ctx) => {
    const lines = (value ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At most 10 links." });
      return z.NEVER;
    }
    for (const l of lines) {
      if (!/^https:\/\/.+/.test(l) || !z.string().url().safeParse(l).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Not a valid https link: ${l.slice(0, 60)}` });
        return z.NEVER;
      }
    }
    return lines;
  });

const httpsOrEmpty = z.string().url("Enter a valid link (https://…)").startsWith("https://", "Links must be https").optional().or(z.literal(""));

export const impactBaselineSchema = z.object({
  previousTechTraining: z.coerce.boolean().default(false),
  previousProfessionalTechExperience: z.coerce.boolean().default(false),
  employedAtEntry: z.coerce.boolean().default(false),
  techEmploymentAtEntry: z.coerce.boolean().default(false),
  freelancingAtEntry: z.coerce.boolean().default(false),
  techIncomeAtEntry: z.coerce.boolean().default(false),
  hasReliableComputerAccess: z.coerce.boolean().default(false),
  hasReliableInternetAccess: z.coerce.boolean().default(false),
  highestEducationLevel: z.string().max(80).optional(),
  opportunityBarrierDeclared: z.enum(BARRIER_ANSWERS),
  opportunityBarrierSummary: z.string().max(2000).optional(),
  consentToAggregatedImpactReporting: z.coerce.boolean().default(false),
});

// Staff-only selection signals (admissions judgment, 1-10 each).
export const selectionBaselineSchema = z.object({
  userId: z.string().min(1),
  selectionPotentialScore: z.coerce.number().int().min(1).max(10).optional(),
  selectionMotivationScore: z.coerce.number().int().min(1).max(10).optional(),
  selectionChallengeScore: z.coerce.number().int().min(1).max(10).optional(),
  selectionNotes: z.string().max(2000).optional(),
});

export const studentProjectSchema = z
  .object({
    id: z.string().optional(), // present ⇒ edit/resubmit
    title: z.string().min(3, "Give the project a name"),
    description: z.string().min(10, "Describe what you built").max(4000),
    problem: z.string().max(2000).optional(),
    projectType: z.enum(PROJECT_TYPES),
    projectContext: z.enum(PROJECT_CONTEXTS),
    techStack: z.string().max(400).optional(), // comma-separated in form
    aiTools: z.string().max(400).optional(),
    githubUrl: httpsOrEmpty,
    liveUrl: httpsOrEmpty,
    demoVideoUrl: httpsOrEmpty,
    screenshotUrls: linkLines,
    evidenceLinks: linkLines,
    maturity: z.enum(PROJECT_MATURITIES),
    externalTested: z.coerce.boolean().default(false),
    testerKind: z.enum(TESTER_KINDS).optional(),
    orgName: z.string().max(200).optional(),
    userCount: z.coerce.number().int().min(0).optional(),
    feedback: z.string().max(2000).optional(),
    changesMade: z.string().max(2000).optional(),
    teamUserIds: z.array(z.string()).max(10).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.externalTested && !maturityAtLeastTesting(d.maturity)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "External testing only applies once the project is at least in testing." });
    }
    if (d.externalTested && !d.testerKind) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tell us who tested it (individual, SME, NGO…)." });
    }
  });

export const achievementSchema = z
  .object({
    id: z.string().optional(),
    kind: z.enum(ACHIEVEMENT_KINDS),
    title: z.string().min(3, "Give this outcome a short title"),
    organizationName: z.string().max(200).optional(),
    roleTitle: z.string().max(200).optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    amount: z.coerce.number().int().positive().optional(),
    currency: z.string().max(10).default("FCFA"),
    occurredAt: z.coerce.date().optional(),
    startedAt: z.coerce.date().optional(),
    techascendContribution: z.enum(CONTRIBUTION_LEVELS).default("unknown"),
    contributionNote: z.string().max(1000).optional(),
    evidenceLinks: linkLines,
    details: z.record(z.string(), z.string().max(500)).optional(),
  })
  .superRefine((d, ctx) => {
    if ((MONEY_KINDS as string[]).includes(d.kind) && !d.amount) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter the amount earned (FCFA)." });
    }
    if ((d.kind === "job" || d.kind === "internship") && (!d.organizationName || !d.roleTitle)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Company and role are required for jobs/internships." });
    }
  });

export const impactDecisionSchema = z
  .object({
    subjectType: z.enum(["project", "achievement"]),
    id: z.string().min(1),
    decision: z.enum(["under_review", "verified", "changes_requested", "rejected"]),
    note: z.string().max(2000).optional(),
  })
  .superRefine((d, ctx) => {
    if ((d.decision === "changes_requested" || d.decision === "rejected") && !d.note?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A note is required when requesting changes or rejecting." });
    }
  });

export const genderSchema = z.enum(GENDERS);
