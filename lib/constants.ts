// Enum-like domain constants. SQLite doesn't support native Prisma enums, so
// these string unions are the single source of truth for allowed values.

export const ROLES = ["applicant", "student", "manager", "admin", "partner"] as const;
export type Role = (typeof ROLES)[number];

export const STAFF_ROLES: Role[] = ["admin", "manager"];

export const TRACKS = ["A", "B"] as const;
export type Track = (typeof TRACKS)[number];

export const TRACK_LABELS: Record<string, string> = {
  A: "AI-Powered Software Engineering",
  B: "AI Product & Automation",
  ALL: "All tracks",
};

export const LESSON_TYPES = ["video", "ai", "quiz", "task"] as const;

export const SUBMISSION_STATUS = [
  "submitted",
  "ai_reviewed",
  "mentor_reviewed",
  "approved",
  "changes_requested",
] as const;

export const PARTNER_TYPES = ["funding", "hiring", "tech", "academic", "govt"] as const;

export const EVENT_KINDS = ["live_session", "workshop", "deadline", "ceremony", "community"] as const;
export const EVENT_AUDIENCES = ["all", "students", "applicants", "partners", "staff"] as const;

export const OPPORTUNITY_TYPES = ["freelance", "job", "internship", "studio", "sme"] as const;

export const PIPELINE_STAGES = ["Shortlisted", "Interview", "Offer", "Hired"] as const;

export const LEDGER_KINDS = ["sponsorship", "revenue", "payout", "expense"] as const;

export const APPLICATION_ROLES = ["learner", "partner"] as const;

// Landing page for each role after sign-in.
export const ROLE_HOME: Record<Role, string> = {
  applicant: "/welcome",
  student: "/dashboard",
  manager: "/community",
  admin: "/admin",
  partner: "/partner",
};

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

export function isStaff(role: string | undefined | null): boolean {
  return role === "admin" || role === "manager";
}

// Format an integer amount of Central African CFA francs.
export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString("en-US")} F`;
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_BGS = [
  "linear-gradient(135deg,#7C3AED,#D6336C)",
  "linear-gradient(135deg,#2D6FD9,#7C3AED)",
  "linear-gradient(135deg,#1F9D6B,#2D6FD9)",
  "linear-gradient(135deg,#D6336C,#C97A0E)",
  "linear-gradient(135deg,#C026D3,#7C3AED)",
];
export function avatarBgFor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997;
  return AVATAR_BGS[h % AVATAR_BGS.length];
}

export function certificateCode(): string {
  // Human-readable verification code, e.g. TA-9F3K-27QM
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const block = (n: number) =>
    Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `TA-${block(4)}-${block(4)}`;
}
