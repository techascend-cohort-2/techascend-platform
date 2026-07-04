"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewVisibilityAction, mentorReviewAction } from "@/lib/actions/program";

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

export default function ReviewsScreen({
  visibility,
  submissions,
}: {
  visibility: VisItem[];
  submissions: SubItem[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

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

  const vLinks = (v: VisItem) =>
    [
      ["GitHub", v.githubUrl],
      ["LinkedIn", v.linkedinUrl],
      ["X", v.xUrl],
      ["Medium", v.mediumUrl],
      ["HF", v.huggingfaceUrl],
      ["Kaggle", v.kaggleUrl],
    ] as const;

  return (
    <div className="pf-screen pf-w1180">
      {error ? (
        <div style={{ marginBottom: 14, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 10, padding: "9px 13px" }}>{error}</div>
      ) : null}

      {/* Visibility queue */}
      <div className="pf-card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>
          Visibility submissions <span style={{ color: "var(--faint)", fontWeight: 600 }}>· {visibility.length} pending</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
          Check each link against the Phase 1 criteria: professional username, photo, completed bio, TechAscend on LinkedIn, intro post published.
          Approval triggers the badge + certificate automatically once her lessons are complete.
        </div>
        {visibility.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Queue is clear. 🎉</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visibility.map((v) => (
              <div key={v.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                  <Avatar initials={v.user.initials} bg={v.user.avatarBg} />
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{v.user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {v.user.email}{v.user.track ? ` · Track ${v.user.track}` : ""} · submitted {new Date(v.submittedAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
                  {vLinks(v).map(([lbl, url]) => (
                    <a key={lbl} href={url} target="_blank" rel="noreferrer" style={linkChip}>
                      {lbl} ↗
                    </a>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    placeholder="Note to the student (required for changes)…"
                    value={notes[v.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [v.id]: e.target.value }))}
                    style={{ flex: 1, minWidth: 220, border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5 }}
                  />
                  <button className="pf-btn-grad" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending} onClick={() => decideVis(v.id, "approved")}>
                    Approve ✓
                  </button>
                  <button
                    className="pf-btn-soft"
                    style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }}
                    disabled={pending || !(notes[v.id] ?? "").trim()}
                    onClick={() => decideVis(v.id, "changes_requested")}
                  >
                    Request changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project submissions queue */}
      <div className="pf-card" style={{ padding: 22 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>
          Project submissions <span style={{ color: "var(--faint)", fontWeight: 600 }}>· {submissions.length} awaiting mentor review</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
          The AI evaluator has already scored these. Add a mentor score and feedback, then approve or request changes.
        </div>
        {submissions.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>No submissions waiting.</div>
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
                      {new Date(s.createdAt).toLocaleDateString("en-GB")}
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
    </div>
  );
}
