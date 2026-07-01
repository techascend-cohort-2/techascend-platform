// Enum-like domain constants. SQLite doesn't support native Prisma enums, so
// these string unions are the single source of truth for allowed values and are
// enforced by the zod schemas in lib/validation.ts.

export const ROLES = ["student", "admin", "partner"] as const;
export type Role = (typeof ROLES)[number];

export const TRACKS = ["A", "B"] as const;
export type Track = (typeof TRACKS)[number];

export const TRACK_LABELS: Record<string, string> = {
  A: "AI Software Engineering",
  B: "AI Product & Automation",
};

export const LESSON_TYPES = ["video", "ai", "quiz", "task"] as const;
export type LessonType = (typeof LESSON_TYPES)[number];

export const SUBMISSION_STATUS = [
  "draft",
  "submitted",
  "ai_reviewed",
  "mentor_reviewed",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUS)[number];

export const PARTNER_TYPES = [
  "funding",
  "hiring",
  "tech",
  "academic",
  "govt",
] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const APPLICATION_ROLES = ["learner", "partner"] as const;
export type ApplicationRole = (typeof APPLICATION_ROLES)[number];

// Landing page for each role after sign-in.
export const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

// Format an integer amount of local currency (Central African CFA franc).
export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString("en-US")} F`;
}
