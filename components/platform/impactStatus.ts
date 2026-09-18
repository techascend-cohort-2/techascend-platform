// Shared chip styles + labels for the Student Impact & Outcomes module —
// used by the student My Impact page, the staff Impact & Outcomes page and
// the staff student-detail timeline so statuses and evidence tiers read the
// same everywhere.

export const IMPACT_STATUS_STYLES: Record<string, { fg: string; bg: string; label: string }> = {
  submitted: { fg: "#2D6FD9", bg: "#E6F0FC", label: "Submitted" },
  under_review: { fg: "#C97A0E", bg: "#FCF1DE", label: "Under review" },
  verified: { fg: "#1F9D6B", bg: "#E6F6EF", label: "Verified ✓" },
  changes_requested: { fg: "#B3243F", bg: "#FDECEF", label: "Changes requested" },
  rejected: { fg: "var(--muted)", bg: "var(--bg)", label: "Rejected" },
};

export function impactStatusStyle(status: string) {
  return IMPACT_STATUS_STYLES[status] ?? IMPACT_STATUS_STYLES.submitted;
}

// Evidence tier — display labels are fixed wording (funder-facing language).
export const IMPACT_TIER_STYLES: Record<string, { fg: string; bg: string; label: string }> = {
  self_reported: { fg: "var(--muted)", bg: "var(--bg)", label: "SELF-REPORTED" },
  evidenced: { fg: "#C97A0E", bg: "#FCF1DE", label: "EVIDENCE PROVIDED" },
  verified: { fg: "#1F9D6B", bg: "#E6F6EF", label: "VERIFIED BY TECHASCEND" },
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  ai: "AI",
  software: "Software",
  automation: "Automation",
  data: "Data",
  web: "Web",
  mobile: "Mobile",
  other: "Other",
};

export const PROJECT_CONTEXT_LABELS: Record<string, string> = {
  learning_exercise: "Learning exercise",
  portfolio_project: "Portfolio project",
  real_world_problem: "Real-world problem",
  real_client: "Real client",
  student_business: "My own business/product",
  techascend_client: "TechAscend client project",
};

export const PROJECT_MATURITY_LABELS: Record<string, string> = {
  prototype: "Prototype",
  working: "Working",
  testing: "Being tested",
  deployed: "Deployed",
  used_by_real_users: "Used by real users",
  paid: "Paid",
};

export const TESTER_KIND_LABELS: Record<string, string> = {
  individual: "Individual",
  sme: "SME / small business",
  ngo: "NGO",
  school: "School",
  company: "Company",
  other: "Other",
};

export const ACHIEVEMENT_KIND_LABELS: Record<string, string> = {
  job: "Got a job",
  internship: "Got an internship",
  freelance: "Freelance work",
  client: "Paying client",
  earning: "Earned from a project",
  fellowship: "Selected for a fellowship",
  competition: "Won / selected in a competition",
  business: "Launched a business/product",
  other: "Other outcome",
};

export const CONTRIBUTION_LABELS: Record<string, string> = {
  direct: "Direct — TechAscend recruited/placed me",
  partial: "Partial — TechAscend project/portfolio/referral contributed",
  indirect: "Indirect — the training helped, opportunity came independently",
  none: "Not related to TechAscend",
  unknown: "Not sure",
};

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  remote: "Remote",
  hybrid: "Hybrid",
};

export const GENDER_LABELS: Record<string, string> = {
  female: "Female",
  male: "Male",
  prefer_not_to_say: "Prefer not to say",
};

export const EDUCATION_LEVELS = [
  "Secondary school",
  "High school / A-levels",
  "Vocational training",
  "Bachelor's (in progress)",
  "Bachelor's degree",
  "Master's degree",
  "Other",
];
