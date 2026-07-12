"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/platform/Toast";
import { submitProjectAction, type SubmitState } from "@/lib/actions/submissions";

const projectSteps: { n: string; label: string }[] = [
  { n: "1", label: "Details" },
  { n: "2", label: "Upload" },
  { n: "3", label: "Preview" },
  { n: "4", label: "Submit" },
];

type Deliverable = { title: string; ext: string };
type Evaluation = {
  aiScore: number;
  rubric: { label: string; score: number }[];
  feedback: string;
  monetizationSuggestion: string;
};
export type SubmissionHistoryItem = {
  id: string;
  createdAt: string;
  status: string;
  submissionLink: string | null;
  notes: string | null;
  aiScore: number | null;
  aiFeedback: string | null;
  mentorScore: number | null;
  mentorFeedback: string | null;
};

const HISTORY_STATUS: Record<string, { label: string; fg: string; bg: string }> = {
  submitted: { label: "Submitted", fg: "var(--muted)", bg: "#eef1ee" },
  ai_reviewed: { label: "AI reviewed", fg: "var(--brand1)", bg: "#f1eafc" },
  mentor_reviewed: { label: "Mentor reviewed", fg: "#2D6FD9", bg: "#e6f0fc" },
  approved: { label: "Approved", fg: "var(--pos)", bg: "var(--posbg)" },
  changes_requested: { label: "Changes requested", fg: "var(--warn)", bg: "var(--warnbg)" },
};

const histFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

export default function ProjectSubmit({
  projectId,
  projectTitle,
  moduleLabel,
  deliverables,
  initialEvaluation,
  history = [],
}: {
  projectId: string;
  projectTitle: string;
  moduleLabel: string;
  deliverables: Deliverable[];
  initialEvaluation: Evaluation | null;
  history?: SubmissionHistoryItem[];
}) {
  const toast = useToast();
  const [extra, setExtra] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState<SubmitState, FormData>(
    submitProjectAction,
    {},
  );

  const evaluation: Evaluation | null = state.result ?? initialEvaluation;
  const submitted = Boolean(state.ok);
  const activeStep = submitted ? 3 : 1;

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const names = Array.from(e.target.files ?? []).map((f) => f.name);
    if (names.length) {
      setExtra((x) => [...x, ...names]);
      toast(`${names.length} file${names.length > 1 ? "s" : ""} added`);
    }
  }

  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-page-intro" style={{ marginBottom: 18 }}>
        <div>
          <div className="pf-eyebrow">Build Studio</div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>
            Submit Project
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{moduleLabel}</div>
        </div>
        <div className="pf-stepper">
          {projectSteps.map((s, i) => {
            const on = i <= activeStep;
            return (
              <div key={s.n} className="pf-step">
                <div className={`pf-step-dot ${on ? "pf-step-dot-active" : ""}`}>{s.n}</div>
                <span className={`pf-step-text ${on ? "pf-step-text-active" : ""}`}>{s.label}</span>
                {i < projectSteps.length - 1 ? <div className="pf-step-line" /> : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pf-proj-grid">
        {submitted ? (
          <div className="pf-card" style={{ padding: 40, textAlign: "center" }}>
            <div className="pf-soon-icon" style={{ background: "var(--posbg)", color: "var(--pos)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="pf-soon-title" style={{ fontSize: 22 }}>Submitted &amp; AI-reviewed</h2>
            <p className="pf-soon-text">
              Your submission was saved and scored by the AI evaluator. A mentor will
              add feedback within 48 hours.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" className="pf-btn-grad" style={{ padding: "12px 20px", borderRadius: 12, fontSize: 13.5 }}>
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form className="pf-card" style={{ padding: 22 }} action={action}>
            <input type="hidden" name="projectId" value={projectId} />
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16 }}>Submit your work</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 18px" }}>
              Add a link to your deliverable (repo, deployed URL, or video) and notes.
              The AI evaluator reviews it on submit.
            </div>

            {state.error ? (
              <div style={{ background: "#fdecef", border: "1px solid #f6c9d3", color: "#b3243f", fontSize: 13, padding: "10px 12px", borderRadius: 10, marginBottom: 14 }}>
                {state.error}
              </div>
            ) : null}

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Submission link
            </label>
            <input
              name="submissionLink"
              type="url"
              placeholder="https://github.com/you/project"
              style={{ width: "100%", padding: "11px 13px", border: "1px solid var(--line)", borderRadius: 11, fontSize: 14, marginBottom: 14 }}
            />

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Notes for reviewer
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="What did you build? What are you most proud of? What's still rough?"
              style={{ width: "100%", padding: "11px 13px", border: "1px solid var(--line)", borderRadius: 11, fontSize: 14, marginBottom: 16, fontFamily: "inherit", resize: "vertical" }}
            />

            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>
              REQUIRED DELIVERABLES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
              {deliverables.map((d) => (
                <div key={d.title} className="pf-deliv-row">
                  <div className="pf-deliv-ext" style={{ background: "#F1EAFC", color: "#7C3AED" }}>{d.ext}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.title}</div>
                  </div>
                </div>
              ))}
              {extra.map((name, i) => (
                <div key={`${name}-${i}`} className="pf-deliv-row">
                  <div className="pf-deliv-ext" style={{ background: "#E6F0FC", color: "#2D6FD9" }}>NEW</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                  </div>
                </div>
              ))}
              <button type="button" className="pf-dropzone" onClick={() => fileInput.current?.click()}>
                <div className="pf-dropzone-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Attach files (optional)</div>
              </button>
              <input ref={fileInput} type="file" multiple hidden onChange={onFiles} />
            </div>

            <button className="pf-btn-grad" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }} type="submit" disabled={pending}>
              {pending ? "Evaluating…" : "Submit for AI evaluation →"}
            </button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="pf-grad" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, opacity: 0.92 }}>AI EVALUATION</span>
            </div>
            {evaluation && evaluation.aiScore > 0 ? (
              <>
                <div className="pf-eval-score">
                  <div className="pf-eval-num">{evaluation.aiScore}</div>
                  <div style={{ fontSize: 16, opacity: 0.7, marginBottom: 6 }}>/ 100</div>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{evaluation.feedback}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 18 }}>
                  {evaluation.rubric.map((r) => (
                    <div key={r.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ opacity: 0.9 }}>{r.label}</span>
                        <span style={{ fontWeight: 700 }}>{r.score}</span>
                      </div>
                      <div className="pf-eval-bar">
                        <div style={{ width: `${r.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13.5, opacity: 0.92, lineHeight: 1.6, padding: "10px 0" }}>
                Submit your work to get an instant AI evaluation — rubric scores across
                functionality, code quality, documentation, and monetization potential.
              </div>
            )}
          </div>

          {evaluation?.monetizationSuggestion ? (
            <div className="pf-monet">
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)", letterSpacing: 0.3, marginBottom: 7 }}>
                💡 MONETIZATION SUGGESTION
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "#14543A" }}>
                {evaluation.monetizationSuggestion}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {history.length > 0 ? (
        <div className="pf-card" style={{ padding: 22, marginTop: 16 }}>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16 }}>Your submission history</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 16px" }}>
            Every time you submit this project it&apos;s saved here with the AI score and any mentor feedback.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((h, i) => {
              const st = HISTORY_STATUS[h.status] ?? HISTORY_STATUS.submitted;
              return (
                <div key={h.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      {i === 0 ? "Latest attempt" : `Attempt ${history.length - i}`}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: st.fg, background: st.bg, padding: "2px 8px", borderRadius: 20 }}>
                      {st.label}
                    </span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{histFmt.format(new Date(h.createdAt))}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8, fontSize: 12 }}>
                    {h.aiScore != null ? <span><b>AI:</b> {h.aiScore}/100</span> : null}
                    {h.mentorScore != null ? <span><b>Mentor:</b> {h.mentorScore}/100</span> : null}
                    {h.submissionLink ? (
                      <a href={h.submissionLink} target="_blank" rel="noreferrer" className="pf-link">Open submission ↗</a>
                    ) : null}
                  </div>
                  {h.notes ? (
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>“{h.notes}”</div>
                  ) : null}
                  {h.aiFeedback ? (
                    <div style={{ fontSize: 12.5, background: "#F8F5FE", borderRadius: 9, padding: "9px 12px", marginTop: 8, lineHeight: 1.5 }}>
                      <b>AI feedback:</b> {h.aiFeedback}
                    </div>
                  ) : null}
                  {h.mentorFeedback ? (
                    <div style={{ fontSize: 12.5, background: "var(--posbg)", color: "#14543A", borderRadius: 9, padding: "9px 12px", marginTop: 8, lineHeight: 1.5 }}>
                      <b>Mentor feedback:</b> {h.mentorFeedback}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
