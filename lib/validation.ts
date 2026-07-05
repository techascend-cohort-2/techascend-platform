import { z } from "zod";
import { normalizeEmailOrPhone, normalizePhone } from "@/lib/contact";
import {
  TRACKS,
  APPLICATION_ROLES,
  EVENT_KINDS,
  EVENT_AUDIENCES,
  OPPORTUNITY_TYPES,
  PIPELINE_STAGES,
  LEDGER_KINDS,
  ROLES,
  LESSON_TYPES,
  PARTNER_TYPES,
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
});

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
