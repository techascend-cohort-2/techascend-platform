import Link from "next/link";
import Icon from "@/components/Icon";
import { ICON } from "@/lib/platformData";
import { TRACK_LABELS } from "@/lib/constants";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

const SUB_STATUS: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: "Submitted", badgeClass: "pf-badge-neutral" },
  ai_reviewed: { label: "AI reviewed", badgeClass: "pf-badge-brand" },
  mentor_reviewed: { label: "Mentor reviewed", badgeClass: "pf-badge-warn" },
  approved: { label: "Approved ✓", badgeClass: "pf-badge-pos" },
  changes_requested: { label: "Changes requested", badgeClass: "pf-badge-danger" },
};

const VIS_STATUS: Record<string, { label: string; badgeClass: string }> = {
  pending: { label: "Under review", badgeClass: "pf-badge-warn" },
  approved: { label: "Approved ✓", badgeClass: "pf-badge-pos" },
  changes_requested: { label: "Changes requested", badgeClass: "pf-badge-danger" },
};

const VIS_LINKS: { key: string; label: string }[] = [
  { key: "githubUrl", label: "GitHub" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "xUrl", label: "X" },
  { key: "mediumUrl", label: "Medium" },
  { key: "huggingfaceUrl", label: "Hugging Face" },
  { key: "kaggleUrl", label: "Kaggle" },
];

function daysAgo(date: Date | null): string {
  if (!date) return "never";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export type StudentDetailUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  track: string | null;
  city: string | null;
  bio: string | null;
  initials: string | null;
  avatarBg: string | null;
  progressPercentage: number;
  cohortName: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  visibility: {
    status: string;
    reviewNote: string | null;
    links: Record<string, string>;
  } | null;
  submissions: {
    id: string;
    projectTitle: string;
    status: string;
    aiScore: number | null;
    mentorScore: number | null;
    submissionLink: string | null;
    notes: string | null;
    aiFeedback: string | null;
    mentorFeedback: string | null;
    createdAt: string;
  }[];
  visibilityHistory: {
    id: string;
    decision: string;
    note: string | null;
    reviewerName: string | null;
    createdAt: string;
  }[];
  badges: { id: string; name: string; tint: string | null; earnedAt: string }[];
  certificates: { id: string; code: string; title: string; issuedAt: string }[];
  phaseBreakdown: { id: string; name: string; total: number; done: number; pct: number }[];
  tutorCount: number;
  lastTutorAt: string | null;
  lastLessonAt: string | null;
};

const VIS_EVENT: Record<string, { label: string; badgeClass: string }> = {
  approved: { label: "Approved ✓", badgeClass: "pf-badge-pos" },
  changes_requested: { label: "Changes requested", badgeClass: "pf-badge-danger" },
  reopened: { label: "Reopened", badgeClass: "pf-badge-warn" },
};

// Note background follows the decision: green when approved (positive),
// red only when changes are requested, neutral otherwise.
function noteColors(status: string): { bg: string; fg: string } {
  if (status === "approved") return { bg: "var(--posbg)", fg: "#14543A" };
  if (status === "changes_requested") return { bg: "var(--dangerbg)", fg: "var(--danger)" };
  return { bg: "var(--bg)", fg: "var(--ink)" };
}

export default function StudentDetailScreen({ student, backHref }: { student: StudentDetailUser; backHref: string }) {
  const trackLabel = student.track ? TRACK_LABELS[student.track] ?? student.track : "No track";

  return (
    <div className="pf-screen pf-w1180">
      <Link href={backHref} className="pf-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        ← Back
      </Link>

      <div className="pf-card" style={{ padding: 22, marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: student.avatarBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, flexShrink: 0,
          }}
        >
          {student.initials ?? student.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 19 }}>{student.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
            {student.email}
            {student.phone ? ` · ${student.phone}` : ""}
            {student.city ? ` · ${student.city}` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span className="pf-badge pf-badge-brand">{trackLabel}</span>
            <span className="pf-badge pf-badge-neutral">{student.cohortName ?? "No cohort"}</span>
            <span className="pf-badge pf-badge-neutral">Joined {dateFmt.format(new Date(student.createdAt))}</span>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 26 }}>{student.progressPercentage}%</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>PROGRAM COMPLETE</div>
        </div>
      </div>

      <div className="pf-stats" style={{ marginBottom: 16 }}>
        {[
          { label: "Badges earned", value: String(student.badges.length), icon: ICON.award },
          { label: "Certificates", value: String(student.certificates.length), icon: ICON.check },
          { label: "AI Tutor questions", value: String(student.tutorCount), icon: ICON.chat },
          { label: "Last lesson activity", value: daysAgo(student.lastLessonAt ? new Date(student.lastLessonAt) : null), icon: ICON.clock },
        ].map((s) => (
          <div key={s.label} className="pf-card-2 pf-stat">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="pf-stat-icon" style={{ background: "#f1eafc", color: "var(--brand1)" }}>
                <Icon path={s.icon} size={17} />
              </div>
            </div>
            <div className="pf-stat-value">{s.value}</div>
            <div className="pf-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 14 }}>Progress by phase</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {student.phaseBreakdown.map((p) => (
            <div key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: "var(--muted)" }}>{p.done}/{p.total} lessons · {p.pct}%</span>
              </div>
              <div className="pf-progress">
                <div style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {student.visibility ? (
        <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div className="pf-h" style={{ flex: 1 }}>Visibility submission</div>
            <span className={`pf-badge ${VIS_STATUS[student.visibility.status]?.badgeClass ?? "pf-badge-neutral"}`}>
              {VIS_STATUS[student.visibility.status]?.label ?? student.visibility.status}
            </span>
          </div>
          {student.visibility.reviewNote ? (
            <div style={{ fontSize: 12.5, background: noteColors(student.visibility.status).bg, color: noteColors(student.visibility.status).fg, borderRadius: 9, padding: "9px 12px", marginBottom: 10 }}>
              Reviewer note: {student.visibility.reviewNote}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {VIS_LINKS.map((l) =>
              student.visibility!.links[l.key] ? (
                <a key={l.key} href={student.visibility!.links[l.key]} target="_blank" rel="noreferrer" className="pf-chip">
                  {l.label} ↗
                </a>
              ) : null,
            )}
          </div>

          {student.visibilityHistory.length > 0 ? (
            <div style={{ marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--faint)", letterSpacing: 0.3, marginBottom: 8 }}>REVIEW HISTORY</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {student.visibilityHistory.map((ev) => {
                  const meta = VIS_EVENT[ev.decision] ?? { label: ev.decision, badgeClass: "pf-badge-neutral" };
                  return (
                    <div key={ev.id} style={{ fontSize: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span className={`pf-badge ${meta.badgeClass}`}>{meta.label}</span>
                        <span style={{ color: "var(--muted)" }}>
                          {ev.reviewerName ? `${ev.reviewerName} · ` : ""}{dateFmt.format(new Date(ev.createdAt))}
                        </span>
                      </div>
                      {ev.note ? (
                        <div style={{ background: noteColors(ev.decision).bg, color: noteColors(ev.decision).fg, borderRadius: 8, padding: "7px 10px", marginTop: 5, lineHeight: 1.5 }}>
                          {ev.note}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 14 }}>Project submissions</div>
        {student.submissions.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No project submissions yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {student.submissions.map((s) => (
              <div key={s.id} style={{ padding: "12px 14px", background: "var(--bg)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.projectTitle}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      Submitted {dateFmt.format(new Date(s.createdAt))}
                      {s.aiScore !== null ? ` · AI score ${s.aiScore}` : ""}
                      {s.mentorScore !== null ? ` · Mentor score ${s.mentorScore}` : ""}
                    </div>
                  </div>
                  {s.submissionLink ? (
                    <a href={s.submissionLink} target="_blank" rel="noreferrer" className="pf-chip">
                      View ↗
                    </a>
                  ) : null}
                  <span className={`pf-badge ${SUB_STATUS[s.status]?.badgeClass ?? "pf-badge-neutral"}`}>
                    {SUB_STATUS[s.status]?.label ?? s.status}
                  </span>
                </div>
                {s.notes ? (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>“{s.notes}”</div>
                ) : null}
                {s.aiFeedback ? (
                  <div style={{ fontSize: 12, background: "#F8F5FE", borderRadius: 8, padding: "8px 11px", marginTop: 8, lineHeight: 1.5 }}>
                    <b>AI:</b> {s.aiFeedback}
                  </div>
                ) : null}
                {s.mentorFeedback ? (
                  <div style={{ fontSize: 12, background: "var(--posbg)", color: "#14543A", borderRadius: 8, padding: "8px 11px", marginTop: 8, lineHeight: 1.5 }}>
                    <b>Mentor:</b> {s.mentorFeedback}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pf-dash-grid">
        <div className="pf-card pf-pad">
          <div className="pf-h" style={{ marginBottom: 12 }}>Badges</div>
          {student.badges.length === 0 ? (
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No badges earned yet.</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {student.badges.map((b) => (
                <span key={b.id} className="pf-badge pf-badge-warn" title={dateFmt.format(new Date(b.earnedAt))}>
                  🏅 {b.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="pf-card pf-pad">
          <div className="pf-h" style={{ marginBottom: 12 }}>Certificates</div>
          {student.certificates.length === 0 ? (
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No certificates issued yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {student.certificates.map((c) => (
                <Link key={c.id} href={`/certificates/${c.code}`} target="_blank" className="pf-link" style={{ fontSize: 12.5 }}>
                  {c.title} — issued {dateFmt.format(new Date(c.issuedAt))} ↗
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
