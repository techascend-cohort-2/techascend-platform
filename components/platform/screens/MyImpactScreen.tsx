"use client";

import { useActionState, useState, useTransition } from "react";
import AddProjectWizard, { type WizardProject } from "@/components/platform/AddProjectWizard";
import AddOutcomeForm, { type OutcomeItem } from "@/components/platform/AddOutcomeForm";
import {
  saveImpactBaselineAction,
  outcomeCheckInAction,
  type ActionState,
} from "@/lib/actions/impact";
import { BARRIER_ANSWERS, formatFcfa } from "@/lib/constants";
import {
  impactStatusStyle,
  IMPACT_TIER_STYLES,
  PROJECT_CONTEXT_LABELS,
  PROJECT_MATURITY_LABELS,
  ACHIEVEMENT_KIND_LABELS,
  EDUCATION_LEVELS,
} from "@/components/platform/impactStatus";
import FormattedNote from "@/components/platform/FormattedNote";

export type MyImpactProps = {
  completionPct: number;
  checks: { profiles: boolean; baseline: boolean; project: boolean; evidence: boolean; fresh: boolean };
  outcomeBoard: { validation: boolean; client: boolean; employment: boolean; internship: boolean; income: boolean; business: boolean };
  baseline: null | {
    studentCompleted: boolean;
    previousTechTraining: boolean;
    previousProfessionalTechExperience: boolean;
    employedAtEntry: boolean;
    techEmploymentAtEntry: boolean;
    freelancingAtEntry: boolean;
    techIncomeAtEntry: boolean;
    hasReliableComputerAccess: boolean;
    hasReliableInternetAccess: boolean;
    highestEducationLevel: string | null;
    opportunityBarrierDeclared: string;
    opportunityBarrierSummary: string | null;
    consentToAggregatedImpactReporting: boolean;
  };
  cohortCompleted: boolean;
  projects: (WizardProject & { status: string; tier: string; reviewNote: string | null; maturityLabel: string })[];
  outcomes: (OutcomeItem & { status: string; tier: string; reviewNote: string | null })[];
  autoSignals: { label: string; detail: string }[];
  payoutsTotalLabel: string | null;
  lastOutcomeCheckInAt: string | null;
  cohortMates: { id: string; name: string }[];
};

const card: React.CSSProperties = { padding: 22, marginBottom: 16 };
const input: React.CSSProperties = {
  width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px",
  fontFamily: "inherit", fontSize: 13, color: "var(--ink)", background: "#fff", outline: "none",
};

function TierChip({ tier }: { tier: string }) {
  const t = IMPACT_TIER_STYLES[tier] ?? IMPACT_TIER_STYLES.self_reported;
  return (
    <span className="pf-badge-sm" style={{ color: t.fg, background: t.bg, letterSpacing: 0.4, fontSize: 9.5 }}>
      {t.label}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const s = impactStatusStyle(status);
  return <span className="pf-badge-sm" style={{ color: s.fg, background: s.bg }}>{s.label}</span>;
}

const EDITABLE = ["submitted", "under_review", "changes_requested"];

// ---------------- Baseline form ----------------

const BASELINE_QUESTIONS: { name: string; text: string }[] = [
  { name: "previousTechTraining", text: "I had structured technology training before TechAscend" },
  { name: "previousProfessionalTechExperience", text: "I had professional tech work experience before TechAscend" },
  { name: "employedAtEntry", text: "I was employed (any sector) when I joined" },
  { name: "techEmploymentAtEntry", text: "I was employed in tech when I joined" },
  { name: "freelancingAtEntry", text: "I was freelancing when I joined" },
  { name: "techIncomeAtEntry", text: "I was earning income from technology when I joined" },
  { name: "hasReliableComputerAccess", text: "I have reliable access to a computer" },
  { name: "hasReliableInternetAccess", text: "I have reliable internet access" },
];

function BaselineForm({ baseline, cohortCompleted, onDone }: { baseline: MyImpactProps["baseline"]; cohortCompleted: boolean; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await saveImpactBaselineAction(prev, fd);
      if (res.ok) onDone();
      return res;
    },
    {},
  );
  const label: React.CSSProperties = { display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginBottom: 5, marginTop: 12 };

  return (
    <form action={formAction}>
      <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 10 }}>
        This describes your starting point when you joined TechAscend — it's how we show what changed for you.
        Tick everything that was true <b>when you joined</b>.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6 }}>
        {BASELINE_QUESTIONS.map((q) => (
          <label key={q.name} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, lineHeight: 1.5 }}>
            <input type="checkbox" name={q.name} defaultChecked={Boolean(baseline?.[q.name as keyof NonNullable<MyImpactProps["baseline"]>])} disabled={cohortCompleted} style={{ marginTop: 2 }} />
            {q.text}
          </label>
        ))}
      </div>
      <label style={label}>Highest education level</label>
      <select name="highestEducationLevel" style={input} defaultValue={baseline?.highestEducationLevel ?? ""} disabled={cohortCompleted}>
        <option value="">Select…</option>
        {EDUCATION_LEVELS.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
      <label style={label}>
        Do you believe you have faced under-representation, systemic bias, discrimination or structural barriers that
        have made it harder for you to enter or advance in technology?
      </label>
      <select name="opportunityBarrierDeclared" style={input} defaultValue={baseline?.opportunityBarrierDeclared ?? "prefer_not_to_say"} disabled={cohortCompleted}>
        {BARRIER_ANSWERS.map((b) => (
          <option key={b} value={b}>{b === "yes" ? "Yes" : b === "no" ? "No" : "Prefer not to say"}</option>
        ))}
      </select>
      <label style={label}>If you'd like, tell us more (optional — only the TechAscend team sees this)</label>
      <textarea name="opportunityBarrierSummary" style={{ ...input, minHeight: 60, resize: "vertical" }} defaultValue={baseline?.opportunityBarrierSummary ?? ""} disabled={cohortCompleted} />
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, lineHeight: 1.55, marginTop: 12 }}>
        <input type="checkbox" name="consentToAggregatedImpactReporting" defaultChecked={baseline?.consentToAggregatedImpactReporting ?? false} disabled={cohortCompleted} style={{ marginTop: 2 }} />
        <span>
          I agree that TechAscend may use my answers in <b>anonymous, aggregated statistics</b> (e.g. “X% of
          participants…”). This is <b>not</b> permission to publish my name, photo or personal story.
        </span>
      </label>
      {!cohortCompleted ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5, padding: "9px 18px", borderRadius: 10 }}>
            {pending ? "Saving…" : "Save my baseline"}
          </button>
          {state.error ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span> : null}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 10 }}>Your cohort has ended — the baseline is locked.</div>
      )}
    </form>
  );
}

// ---------------- Screen ----------------

export default function MyImpactScreen(props: MyImpactProps) {
  const [editingProject, setEditingProject] = useState<string | "new" | null>(null);
  const [editingOutcome, setEditingOutcome] = useState<string | "new" | null>(null);
  const [baselineOpen, setBaselineOpen] = useState(!props.baseline?.studentCompleted);
  const [checkinPending, startCheckin] = useTransition();
  const [checkedIn, setCheckedIn] = useState(false);

  const checklist = [
    { ok: props.checks.profiles, text: "Professional profiles (GitHub + LinkedIn on your profile)" },
    { ok: props.checks.baseline, text: "Baseline completed" },
    { ok: props.checks.project, text: "At least one project added" },
    { ok: props.checks.evidence, text: "Evidence links provided" },
    { ok: props.checks.fresh, text: "Updated in the last 30 days" },
  ];
  const outcomeRows = [
    { ok: props.outcomeBoard.validation, text: "Real-world validation" },
    { ok: props.outcomeBoard.client, text: "Paid client" },
    { ok: props.outcomeBoard.employment, text: "Employment" },
    { ok: props.outcomeBoard.internship, text: "Internship" },
    { ok: props.outcomeBoard.income, text: "First tech income" },
    { ok: props.outcomeBoard.business, text: "Business launched" },
  ];

  const careerOutcomes = props.outcomes.filter((o) => ["job", "internship", "fellowship", "competition", "other"].includes(o.kind));
  const incomeOutcomes = props.outcomes.filter((o) => ["freelance", "client", "earning", "business"].includes(o.kind));

  const renderOutcome = (o: MyImpactProps["outcomes"][number]) => (
    <div key={o.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "11px 13px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 800, flex: "1 1 160px", minWidth: 0 }}>{o.title}</span>
        <TierChip tier={o.tier} />
        <StatusChip status={o.status} />
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
        {ACHIEVEMENT_KIND_LABELS[o.kind] ?? o.kind}
        {o.organizationName ? ` · ${o.organizationName}` : ""}
        {o.amount ? ` · ${formatFcfa(o.amount)}` : ""}
      </div>
      {o.status === "changes_requested" && o.reviewNote ? (
        <div style={{ fontSize: 12, background: "#FDECEF", color: "#B3243F", borderRadius: 8, padding: "7px 10px", marginTop: 7, lineHeight: 1.5 }}>
          <FormattedNote text={o.reviewNote} />
        </div>
      ) : null}
      {EDITABLE.includes(o.status) ? (
        <button type="button" className="pf-btn-soft" onClick={() => setEditingOutcome(o.id)} style={{ fontSize: 11.5, marginTop: 8 }}>
          {o.status === "changes_requested" ? "Update & resubmit" : "Edit"}
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="pf-screen pf-w1180">
      {/* Header */}
      <div className="pf-card" style={{ ...card, background: "linear-gradient(120deg, #F6F2FD, #EDF7F2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 21, letterSpacing: -0.4 }}>
              Your potential. Your work. Your progress.
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, lineHeight: 1.6, maxWidth: 640 }}>
              TechAscend tracks evidence of what you build and achieve so we can better support you with employment,
              client, entrepreneurship and international opportunities.
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: 130 }}>
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 30 }}>{props.completionPct}%</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>IMPACT PROFILE</div>
            <div className="pf-progress" style={{ width: 130, marginTop: 6 }}>
              <div style={{ width: `${props.completionPct}%` }} />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 4, marginTop: 14 }}>
          {checklist.map((c) => (
            <div key={c.text} style={{ fontSize: 12.5, color: c.ok ? "var(--pos)" : "var(--muted)", fontWeight: c.ok ? 700 : 500 }}>
              {c.ok ? "✓" : "○"} {c.text}
            </div>
          ))}
        </div>
      </div>

      {/* Baseline */}
      <div className="pf-card" style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="pf-h" style={{ flex: 1 }}>Your starting point{props.baseline?.studentCompleted ? " ✓" : ""}</div>
          <button type="button" className="pf-btn-soft" onClick={() => setBaselineOpen((v) => !v)} style={{ fontSize: 12 }}>
            {baselineOpen ? "Close" : props.baseline?.studentCompleted ? "Review / edit" : "Complete now"}
          </button>
        </div>
        {!props.baseline?.studentCompleted && !baselineOpen ? (
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>
            5 minutes, once — it's how TechAscend shows what changed for you.
          </div>
        ) : null}
        {baselineOpen ? (
          <div style={{ marginTop: 12 }}>
            <BaselineForm baseline={props.baseline} cohortCompleted={props.cohortCompleted} onDone={() => setBaselineOpen(false)} />
          </div>
        ) : null}
      </div>

      {/* Outcome check-in */}
      <div className="pf-card" style={{ ...card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Any new career, income, business or professional outcome?</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
            {props.lastOutcomeCheckInAt
              ? `Last confirmed up to date: ${new Date(props.lastOutcomeCheckInAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
              : "You haven't checked in yet."}
          </div>
        </div>
        <button type="button" className="pf-btn-grad" onClick={() => setEditingOutcome("new")} style={{ fontSize: 12.5, padding: "9px 16px", borderRadius: 10 }}>
          + Add outcome
        </button>
        <button
          type="button"
          className="pf-btn-soft"
          disabled={checkinPending || checkedIn}
          onClick={() => startCheckin(async () => { const r = await outcomeCheckInAction(); if (r.ok) setCheckedIn(true); })}
          style={{ fontSize: 12.5 }}
        >
          {checkedIn ? "Up to date ✓" : checkinPending ? "Saving…" : "I'm up to date"}
        </button>
      </div>

      {/* Outcomes board */}
      <div className="pf-card" style={card}>
        <div className="pf-h" style={{ marginBottom: 8 }}>Outcomes</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
          These are milestones, not requirements — they'll tick off as your journey progresses.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 4 }}>
          {outcomeRows.map((r) => (
            <div key={r.text} style={{ fontSize: 12.5, color: r.ok ? "var(--pos)" : "var(--faint)", fontWeight: r.ok ? 700 : 500 }}>
              {r.ok ? "✓" : "—"} {r.text}
            </div>
          ))}
        </div>
      </div>

      {/* Projects & Solutions */}
      <div className="pf-card" style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div className="pf-h" style={{ flex: 1 }}>🚀 Projects &amp; Solutions</div>
          {editingProject === null ? (
            <button type="button" className="pf-btn-grad" onClick={() => setEditingProject("new")} style={{ fontSize: 12.5, padding: "9px 16px", borderRadius: 10 }}>
              + Add project
            </button>
          ) : null}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Everything you build — with links and evidence, so TechAscend can vouch for it.
        </div>
        {editingProject !== null ? (
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 14, background: "var(--bg)" }}>
            <AddProjectWizard
              existing={editingProject === "new" ? null : props.projects.find((p) => p.id === editingProject) ?? null}
              cohortMates={props.cohortMates}
              onDone={() => setEditingProject(null)}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {props.projects.map((p) => (
            <div key={p.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 800, flex: "1 1 160px", minWidth: 0 }}>{p.title}</span>
                <TierChip tier={p.tier} />
                <StatusChip status={p.status} />
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                {PROJECT_CONTEXT_LABELS[p.projectContext] ?? p.projectContext} · {p.maturityLabel}
                {p.externalTested && p.orgName ? ` · tested with ${p.orgName}` : ""}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                {p.githubUrl ? <a className="pf-link" style={{ fontSize: 12 }} href={p.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a> : null}
                {p.liveUrl ? <a className="pf-link" style={{ fontSize: 12 }} href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a> : null}
                {p.demoVideoUrl ? <a className="pf-link" style={{ fontSize: 12 }} href={p.demoVideoUrl} target="_blank" rel="noopener noreferrer">Demo ↗</a> : null}
              </div>
              {p.status === "changes_requested" && p.reviewNote ? (
                <div style={{ fontSize: 12, background: "#FDECEF", color: "#B3243F", borderRadius: 8, padding: "7px 10px", marginTop: 7, lineHeight: 1.5 }}>
                  <FormattedNote text={p.reviewNote} />
                </div>
              ) : null}
              {EDITABLE.includes(p.status) ? (
                <button type="button" className="pf-btn-soft" onClick={() => setEditingProject(p.id)} style={{ fontSize: 11.5, marginTop: 8 }}>
                  {p.status === "changes_requested" ? "Update & resubmit" : "Edit"}
                </button>
              ) : null}
            </div>
          ))}
          {props.projects.length === 0 && editingProject === null ? (
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No projects yet — add the first thing you've built, however small.</div>
          ) : null}
        </div>
      </div>

      {/* Career & Opportunities */}
      <div className="pf-card" style={card}>
        <div className="pf-h" style={{ marginBottom: 4 }}>💼 Career &amp; Opportunities</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Jobs, internships, fellowships and competitions.
        </div>
        {editingOutcome !== null ? (
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 14, background: "var(--bg)" }}>
            <AddOutcomeForm
              existing={editingOutcome === "new" ? null : props.outcomes.find((o) => o.id === editingOutcome) ?? null}
              onDone={() => setEditingOutcome(null)}
              onCancel={() => setEditingOutcome(null)}
            />
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {careerOutcomes.map(renderOutcome)}
          {careerOutcomes.length === 0 && editingOutcome === null ? (
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Nothing yet — and that's normal mid-training. Use “+ Add outcome” when it happens.</div>
          ) : null}
        </div>
      </div>

      {/* Income & Entrepreneurship */}
      <div className="pf-card" style={card}>
        <div className="pf-h" style={{ marginBottom: 4 }}>💰 Income &amp; Entrepreneurship</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Freelance work, paying clients, product income.
          {props.payoutsTotalLabel ? ` TechAscend-recorded payouts to you so far: ${props.payoutsTotalLabel}.` : ""}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {incomeOutcomes.map(renderOutcome)}
          {incomeOutcomes.length === 0 ? (
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No income outcomes recorded yet.</div>
          ) : null}
        </div>
      </div>

      {/* Auto-pulled verified signals */}
      {props.autoSignals.length > 0 ? (
        <div className="pf-card" style={card}>
          <div className="pf-h" style={{ marginBottom: 4 }}>Verified automatically by the platform</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
            Already part of your record — no need to re-enter these.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {props.autoSignals.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, flexWrap: "wrap" }}>
                <span className="pf-badge-sm" style={{ color: "#1F9D6B", background: "#E6F6EF", flexShrink: 0 }}>✓ verified</span>
                <b>{s.label}</b>
                <span style={{ color: "var(--muted)" }}>{s.detail}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
