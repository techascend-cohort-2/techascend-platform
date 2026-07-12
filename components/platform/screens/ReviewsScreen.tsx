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
import { PROJECT_RUBRIC, PASS_OVERALL, PASS_MIN_PER_CRITERION, overallScore, evaluateRubric } from "@/lib/rubric";

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
  aiRubric: { key?: string; label?: string; score?: number }[] | null;
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
  // submissionId → { criterionKey → mentor score 0-100 }
  const [rubricScores, setRubricScores] = useState<Record<string, Record<string, number>>>({});
  const [error, setError] = useState("");

  function aiScoreOf(sub: SubItem, key: string): number {
    const r = sub.aiRubric?.find((x) => x.key === key);
    const n = r?.score;
    return typeof n === "number" ? Math.max(0, Math.min(100, Math.round(n))) : 0;
  }
  // Mentor's current score for a criterion — defaults to the AI's suggestion.
  function scoreOf(sub: SubItem, key: string): number {
    const override = rubricScores[sub.id]?.[key];
    return typeof override === "number" ? override : aiScoreOf(sub, key);
  }
  function setCriterion(subId: string, key: string, value: number) {
    const v = Math.max(0, Math.min(100, Math.round(Number.isNaN(value) ? 0 : value)));
    setRubricScores((prev) => ({ ...prev, [subId]: { ...prev[subId], [key]: v } }));
  }
  function subRubric(sub: SubItem) {
    return PROJECT_RUBRIC.map((c) => ({ key: c.key, score: scoreOf(sub, c.key) }));
  }
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
    const sub = submissions.find((s) => s.id === id);
    const rubric = sub ? subRubric(sub) : [];
    start(async () => {
      const res = await mentorReviewAction(id, { rubric, mentorFeedback: notes[`s-${id}`] || undefined, status });
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
                {(() => {
                  const verdict = evaluateRubric(subRubric(s));
                  return (
                    <>
                      {/* rubric scoring */}
                      <div style={{ marginTop: 14, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", background: "var(--bg)", flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.3, color: "var(--faint)" }}>
                            RUBRIC — score each 0–100 (AI suggestions prefilled)
                          </span>
                          <span
                            style={{
                              fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                              color: verdict.passed ? "var(--pos)" : "#B3243F",
                              background: verdict.passed ? "var(--posbg)" : "#FDECEF",
                            }}
                          >
                            {verdict.overall}/100 · {verdict.passed ? "Meets the bar ✓" : "Below the bar"}
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {PROJECT_RUBRIC.map((c) => {
                            const val = scoreOf(s, c.key);
                            const low = val < PASS_MIN_PER_CRITERION;
                            return (
                              <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 13px", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 180 }}>
                                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                                    {c.label} <span style={{ color: "var(--faint)", fontWeight: 600 }}>· {c.weight}%</span>
                                  </div>
                                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.description}</div>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={val}
                                  onChange={(e) => setCriterion(s.id, c.key, Number(e.target.value))}
                                  style={{ flex: "1 1 140px", accentColor: low ? "#B3243F" : "var(--brand2)" }}
                                />
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={val}
                                  onChange={(e) => setCriterion(s.id, c.key, Number(e.target.value))}
                                  style={{ width: 62, border: `1px solid ${low ? "#F0B7C2" : "var(--line)"}`, borderRadius: 8, padding: "7px 8px", fontSize: 12.5, textAlign: "center", color: low ? "#B3243F" : "var(--ink)", fontWeight: 700 }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <input
                        placeholder="Mentor feedback to the student…"
                        value={notes[`s-${s.id}`] ?? ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [`s-${s.id}`]: e.target.value }))}
                        style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5, marginTop: 12 }}
                      />

                      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                        <button
                          className="pf-btn-grad"
                          style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, opacity: verdict.passed ? 1 : 0.5, cursor: verdict.passed ? "pointer" : "not-allowed" }}
                          disabled={pending || !verdict.passed}
                          title={verdict.passed ? "Approve this submission" : `Needs ≥${PASS_OVERALL}/100 overall and every criterion ≥${PASS_MIN_PER_CRITERION}`}
                          onClick={() => decideSub(s.id, "approved")}
                        >
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
                        {!verdict.passed ? (
                          <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                            {verdict.failedCriteria.length
                              ? `${verdict.failedCriteria.join(", ")} below ${PASS_MIN_PER_CRITERION}%`
                              : `Needs ≥${PASS_OVERALL}/100 to pass`}
                          </span>
                        ) : null}
                      </div>
                    </>
                  );
                })()}
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
            <b>Project submissions:</b> score each project against the four rubric criteria (Functionality,
            Code &amp; build quality, Documentation &amp; communication, Real-world &amp; income potential). The AI&apos;s
            scores are prefilled — adjust them. A project can be approved only when it reaches{" "}
            <b>≥{PASS_OVERALL}/100 overall with no criterion below {PASS_MIN_PER_CRITERION}%</b>; otherwise request changes.
          </div>
        ) : null}
      </div>
    </div>
  );
}
