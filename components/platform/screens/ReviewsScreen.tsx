"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ICON } from "@/lib/platformData";
import {
  reviewVisibilityAction,
  mentorReviewAction,
  reopenSubmissionAction,
  reopenVisibilityAction,
} from "@/lib/actions/program";

type VisItem = {
  id: string;
  submittedAt: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  mediumUrl: string;
  huggingfaceUrl: string;
  kaggleUrl: string;
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
};

type SubItem = {
  id: string;
  createdAt: string;
  submissionLink: string | null;
  notes: string | null;
  aiScore: number | null;
  aiFeedback: string | null;
  status: string;
  user: { name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
  project: { title: string };
};

type DecidedItem = {
  id: string;
  updatedAt: string;
  status: string; // "approved" | "changes_requested"
  mentorScore: number | null;
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
  project: { title: string };
};

type DecidedVisItem = {
  id: string;
  reviewedAt: string;
  status: string; // "approved" | "changes_requested"
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
};

export type ReviewStats = {
  pendingVisibility: number;
  pendingProjects: number;
  approvedThisMonth: number;
  avgReviewDays: number | null;
  activeReviewers: number;
};

const REVIEW_SLA_DAYS = 3;
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function dueDate(submittedAt: string): Date {
  const d = new Date(submittedAt);
  d.setDate(d.getDate() + REVIEW_SLA_DAYS);
  return d;
}

const linkChip: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: "var(--brand1)",
  background: "#F1EAFC",
  padding: "4px 10px",
  borderRadius: 20,
  textDecoration: "none",
};

function Avatar({ initials, bg }: { initials: string | null; bg: string | null }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize: 13,
        background: bg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
      }}
    >
      {initials ?? "?"}
    </div>
  );
}

const TRACK_OPTIONS = [
  { key: "all", label: "All tracks" },
  { key: "A", label: "Track A" },
  { key: "B", label: "Track B" },
] as const;

export default function ReviewsScreen({
  visibility,
  submissions,
  recentlyDecidedVisibility,
  recentlyDecided,
  stats,
}: {
  visibility: VisItem[];
  submissions: SubItem[];
  recentlyDecidedVisibility: DecidedVisItem[];
  recentlyDecided: DecidedItem[];
  stats: ReviewStats;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [trackFilter, setTrackFilter] = useState<"all" | "A" | "B">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);

  function decideVis(id: string, decision: "approved" | "changes_requested") {
    setError("");
    start(async () => {
      const res = await reviewVisibilityAction(id, decision, notes[id] || undefined);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function decideSub(id: string, status: "approved" | "changes_requested") {
    setError("");
    const raw = scores[id];
    const mentorScore = raw ? Math.max(0, Math.min(100, parseInt(raw, 10) || 0)) : undefined;
    start(async () => {
      const res = await mentorReviewAction(id, { mentorScore, mentorFeedback: notes[`s-${id}`] || undefined, status });
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function reopenSub(id: string) {
    setError("");
    start(async () => {
      const res = await reopenSubmissionAction(id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function reopenVis(id: string) {
    setError("");
    start(async () => {
      const res = await reopenVisibilityAction(id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  const vLinks = (v: VisItem) =>
    [
      ["GitHub", v.githubUrl],
      ["LinkedIn", v.linkedinUrl],
      ["X", v.xUrl],
      ["Medium", v.mediumUrl],
      ["HF", v.huggingfaceUrl],
      ["Kaggle", v.kaggleUrl],
    ] as const;

  const filteredVisibility = useMemo(() => {
    let list = visibility;
    if (trackFilter !== "all") list = list.filter((v) => v.user.track === trackFilter);
    return [...list].sort((a, b) =>
      newestFirst
        ? new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        : new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    );
  }, [visibility, trackFilter, newestFirst]);

  const STAT_CARDS = [
    { label: "Visibility submissions", value: String(stats.pendingVisibility), caption: "Pending review", icon: ICON.document, bg: "#f1eafc", fg: "var(--brand1)" },
    { label: "Approved submissions", value: String(stats.approvedThisMonth), caption: "This month", icon: ICON.check, bg: "var(--posbg)", fg: "var(--pos)" },
    { label: "Avg. review time", value: stats.avgReviewDays !== null ? `${stats.avgReviewDays}d` : "—", caption: "This month", icon: ICON.clock, bg: "var(--warnbg)", fg: "var(--warn)" },
    { label: "Active reviewers", value: String(stats.activeReviewers), caption: "Team members", icon: ICON.users, bg: "#e6f0fc", fg: "#2D6FD9" },
  ];

  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-page-intro">
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Reviews</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Home &gt; Reviews</div>
        </div>
      </div>

      {error ? (
        <div style={{ marginBottom: 14, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 10, padding: "9px 13px" }}>{error}</div>
      ) : null}

      {/* stat row */}
      <div className="pf-stats" style={{ marginBottom: 16 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="pf-card-2 pf-stat">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="pf-stat-icon" style={{ background: s.bg, color: s.fg }}>
                <Icon path={s.icon} size={17} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)" }}>{s.caption}</span>
            </div>
            <div className="pf-stat-value">{s.value}</div>
            <div className="pf-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Visibility queue */}
      <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
          <div className="pf-h" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Visibility submissions
            <span className="pf-badge pf-badge-brand">{filteredVisibility.length} pending</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="pf-proj-sort">
              <button className="pf-proj-sort-btn" onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}>
                <Icon path={ICON.filter} size={14} />
                {TRACK_OPTIONS.find((t) => t.key === trackFilter)?.label}
              </button>
              {filterOpen ? (
                <div className="pf-proj-sort-menu">
                  {TRACK_OPTIONS.map((t) => (
                    <button key={t.key} className="pf-proj-sort-item" onClick={() => { setTrackFilter(t.key); setFilterOpen(false); }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="pf-proj-sort">
              <button className="pf-proj-sort-btn" onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}>
                Sort: {newestFirst ? "Newest" : "Oldest"}
                <Icon path={ICON.chevronDown} size={14} />
              </button>
              {sortOpen ? (
                <div className="pf-proj-sort-menu">
                  <button className="pf-proj-sort-item" onClick={() => { setNewestFirst(true); setSortOpen(false); }}>Newest first</button>
                  <button className="pf-proj-sort-item" onClick={() => { setNewestFirst(false); setSortOpen(false); }}>Oldest first</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
          Check each submission carefully. Review all required criteria before making a decision.
        </div>
        {filteredVisibility.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {visibility.length === 0 ? "Queue is clear. 🎉" : "No submissions match this filter."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredVisibility.map((v) => (
              <div key={v.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 11, flexWrap: "wrap" }}>
                  <Avatar initials={v.user.initials} bg={v.user.avatarBg} />
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <Link href={`/students/${v.user.id}`} className="pf-link" style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                      {v.user.name}
                    </Link>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {v.user.email}{v.user.track ? ` · Track ${v.user.track}` : ""} · Submitted {dateFmt.format(new Date(v.submittedAt))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11.5, color: "var(--muted)" }}>
                    <div>Submitted<br /><b style={{ color: "var(--ink)" }}>{dateTimeFmt.format(new Date(v.submittedAt))}</b></div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11.5, color: "var(--muted)" }}>
                    <div>Review due<br /><b style={{ color: "var(--ink)" }}>{dateFmt.format(dueDate(v.submittedAt))}</b></div>
                  </div>
                  <Link href={`/students/${v.user.id}`} className="pf-btn-soft" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Icon path={ICON.eye} size={14} />
                    Preview
                  </Link>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
                  {vLinks(v).map(([lbl, url]) => (
                    <a key={lbl} href={url} target="_blank" rel="noreferrer" style={linkChip}>
                      {lbl} ↗
                    </a>
                  ))}
                </div>
                <textarea
                  placeholder="Note to the student (required for changes)…"
                  value={notes[v.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [v.id]: e.target.value }))}
                  rows={2}
                  style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5, fontFamily: "inherit", resize: "vertical", marginBottom: 10 }}
                />
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button
                    className="pf-btn-soft"
                    style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }}
                    disabled={pending || !(notes[v.id] ?? "").trim()}
                    onClick={() => decideVis(v.id, "changes_requested")}
                  >
                    Request changes
                  </button>
                  <button className="pf-btn-grad" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending} onClick={() => decideVis(v.id, "approved")}>
                    Approve ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently decided visibility — undo a mistaken decision */}
      {recentlyDecidedVisibility.length > 0 ? (
        <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="pf-h" style={{ marginBottom: 4 }}>Recently decided visibility submissions</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Approved or sent back by mistake? Undo returns it to the queue above. Undoing an approval also pauses the
            phase badge &amp; certificate until it&apos;s approved again.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentlyDecidedVisibility.map((v) => (
              <div
                key={v.id}
                style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}
              >
                <Avatar initials={v.user.initials} bg={v.user.avatarBg} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <Link href={`/students/${v.user.id}`} className="pf-link" style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                    {v.user.name}
                  </Link>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {v.user.email}{v.user.track ? ` · Track ${v.user.track}` : ""} · {dateTimeFmt.format(new Date(v.reviewedAt))}
                  </div>
                </div>
                <span
                  className={`pf-badge ${v.status === "approved" ? "pf-badge-pos" : "pf-badge-neutral"}`}
                  style={{ flexShrink: 0 }}
                >
                  {v.status === "approved" ? "Approved" : "Changes requested"}
                </span>
                <button
                  className="pf-btn-soft"
                  style={{ padding: "8px 14px", borderRadius: 9, fontSize: 12.5, cursor: "pointer", flexShrink: 0 }}
                  disabled={pending}
                  onClick={() => reopenVis(v.id)}
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Project submissions queue */}
      <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="pf-h" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          Project submissions
          <span className="pf-badge pf-badge-brand">{submissions.length} awaiting mentor review</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
          These projects are waiting for mentor evaluation and feedback.
        </div>
        {submissions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 20px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg)", color: "var(--faint)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Icon path={ICON.inbox} size={22} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>No submissions waiting</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>All caught up! New project submissions will appear here.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {submissions.map((s) => (
              <div key={s.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                  <Avatar initials={s.user.initials} bg={s.user.avatarBg} />
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {s.project.title} <span style={{ color: "var(--faint)", fontWeight: 600 }}>— {s.user.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {dateFmt.format(new Date(s.createdAt))}
                      {s.aiScore ? ` · AI score ${s.aiScore}/100` : " · AI evaluation pending/unavailable"}
                    </div>
                  </div>
                  {s.submissionLink ? (
                    <a href={s.submissionLink} target="_blank" rel="noreferrer" style={linkChip}>Open submission ↗</a>
                  ) : null}
                </div>
                {s.notes ? (
                  <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "10px 0 0", fontStyle: "italic" }}>“{s.notes}”</div>
                ) : null}
                {s.aiFeedback ? (
                  <div style={{ fontSize: 12.5, background: "#F8F5FE", borderRadius: 9, padding: "9px 12px", margin: "10px 0 0" }}>
                    <b>AI:</b> {s.aiFeedback}
                  </div>
                ) : null}
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Score /100"
                    value={scores[s.id] ?? ""}
                    onChange={(e) => setScores((x) => ({ ...x, [s.id]: e.target.value }))}
                    style={{ width: 110, border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5 }}
                  />
                  <input
                    placeholder="Mentor feedback…"
                    value={notes[`s-${s.id}`] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [`s-${s.id}`]: e.target.value }))}
                    style={{ flex: 1, minWidth: 200, border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5 }}
                  />
                  <button className="pf-btn-grad" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending} onClick={() => decideSub(s.id, "approved")}>
                    Approve ✓
                  </button>
                  <button
                    className="pf-btn-soft"
                    style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }}
                    disabled={pending}
                    onClick={() => decideSub(s.id, "changes_requested")}
                  >
                    Request changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently decided — undo a mistaken decision */}
      {recentlyDecided.length > 0 ? (
        <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="pf-h" style={{ marginBottom: 4 }}>Recently decided projects</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Approved or sent back by mistake? Undo puts the project back in the queue above so you can review it again.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentlyDecided.map((s) => (
              <div
                key={s.id}
                style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}
              >
                <Avatar initials={s.user.initials} bg={s.user.avatarBg} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {s.project.title} <span style={{ color: "var(--faint)", fontWeight: 600 }}>— {s.user.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {dateTimeFmt.format(new Date(s.updatedAt))}
                    {s.mentorScore != null ? ` · mentor score ${s.mentorScore}/100` : ""}
                  </div>
                </div>
                <span
                  className={`pf-badge ${s.status === "approved" ? "pf-badge-pos" : "pf-badge-neutral"}`}
                  style={{ flexShrink: 0 }}
                >
                  {s.status === "approved" ? "Approved" : "Changes requested"}
                </span>
                <button
                  className="pf-btn-soft"
                  style={{ padding: "8px 14px", borderRadius: 9, fontSize: 12.5, cursor: "pointer", flexShrink: 0 }}
                  disabled={pending}
                  onClick={() => reopenSub(s.id)}
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Review tips */}
      <div className="pf-proj-banner" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="pf-proj-banner-icon">
            <Icon path={ICON.shield} size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Review tips</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
              Provide constructive feedback, be specific with requested changes, and help students showcase their best work.
            </div>
          </div>
          <button
            type="button"
            className="pf-btn-soft"
            style={{ fontSize: 12, whiteSpace: "nowrap" }}
            onClick={() => setGuidelinesOpen((v) => !v)}
          >
            {guidelinesOpen ? "Hide guidelines" : "Review guidelines"}
          </button>
        </div>
        {guidelinesOpen ? (
          <div style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.6, marginTop: 12, paddingLeft: 42 }}>
            <b>Visibility submissions:</b> check each link against the Phase 1 criteria — professional username,
            photo, completed bio, TechAscend mentioned on LinkedIn, intro post published. Approval triggers the
            badge + certificate automatically once her lessons are complete.
            <br />
            <b>Project submissions:</b> the AI evaluator has already scored these — add a mentor score and specific
            feedback, then approve or request changes.
          </div>
        ) : null}
      </div>
    </div>
  );
}
