// Shared badge styles for OpportunityInterest.status — used by both the
// Opportunities board (staff tracking view) and the student Earn Hub so the
// application funnel reads the same everywhere. Canonical statuses live in
// lib/constants.ts (INTEREST_STATUSES); "contacted" is kept here only as a
// defensive fallback for manually edited rows.
export const INTEREST_STATUS_STYLES: Record<string, { fg: string; bg: string; label: string }> = {
  interested: { fg: "#2D6FD9", bg: "#E6F0FC", label: "Interested" },
  applied: { fg: "#C97A0E", bg: "#FCF1DE", label: "Applied" },
  accepted: { fg: "#7C3AED", bg: "#F1EAFC", label: "Accepted" },
  hired: { fg: "#1F9D6B", bg: "#E6F6EF", label: "Hired" },
  declined: { fg: "var(--muted)", bg: "var(--bg)", label: "Declined" },
  contacted: { fg: "#C97A0E", bg: "#FCF1DE", label: "Contacted" }, // legacy fallback
};

export function interestStatusStyle(status: string) {
  return INTEREST_STATUS_STYLES[status] ?? INTEREST_STATUS_STYLES.interested;
}
