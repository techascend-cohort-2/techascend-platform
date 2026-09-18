"use client";

import { useActionState, useEffect, useState } from "react";
import { saveStudentProjectAction, type ActionState } from "@/lib/actions/impact";
import {
  PROJECT_TYPES,
  PROJECT_CONTEXTS,
  PROJECT_MATURITIES,
  TESTER_KINDS,
  maturityAtLeastTesting,
} from "@/lib/constants";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_CONTEXT_LABELS,
  PROJECT_MATURITY_LABELS,
  TESTER_KIND_LABELS,
} from "@/components/platform/impactStatus";

export type WizardProject = {
  id: string;
  title: string;
  description: string;
  problem: string | null;
  projectType: string;
  projectContext: string;
  techStack: string[];
  aiTools: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  demoVideoUrl: string | null;
  screenshotUrls: string[];
  evidenceLinks: string[];
  maturity: string;
  externalTested: boolean;
  testerKind: string | null;
  orgName: string | null;
  userCount: number | null;
  feedback: string | null;
  changesMade: string | null;
  teamUserIds: string[];
};

const input: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 12px",
  fontFamily: "inherit",
  fontSize: 13,
  color: "var(--ink)",
  background: "#fff",
  outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginBottom: 5, marginTop: 10 };

const STEPS = ["What you built", "Show it", "Who used it"];

/**
 * Real 3-step wizard on the existing pf-stepper CSS. All steps live inside ONE
 * form — hidden steps stay mounted (display:none) so every field submits
 * together at the end. Step 3 only applies once maturity is at least
 * "testing". A mid-wizard refresh loses input (accepted lean trade-off).
 */
export default function AddProjectWizard({
  existing,
  cohortMates,
  onDone,
  onCancel,
}: {
  existing?: WizardProject | null;
  cohortMates: { id: string; name: string }[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveStudentProjectAction, {});
  const [step, setStep] = useState(0);
  const [maturity, setMaturity] = useState(existing?.maturity ?? "prototype");
  const [tested, setTested] = useState(existing?.externalTested ?? false);
  const [stepError, setStepError] = useState<string | null>(null);
  // Step-1 fields we validate before advancing.
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  useEffect(() => {
    if (state.ok) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const showStep3 = maturityAtLeastTesting(maturity);
  const lastStep = showStep3 ? 2 : 1;

  const next = () => {
    setStepError(null);
    if (step === 0 && (title.trim().length < 3 || description.trim().length < 10)) {
      setStepError("Give the project a name and a short description first.");
      return;
    }
    setStep((s) => Math.min(s + 1, lastStep));
  };

  const show = (i: number): React.CSSProperties => ({ display: step === i ? "block" : "none" });

  return (
    <form action={formAction}>
      {existing ? <input type="hidden" name="id" value={existing.id} /> : null}

      {/* stepper */}
      <div className="pf-stepper" style={{ marginBottom: 16 }}>
        {STEPS.slice(0, lastStep + 1).map((s, i) => (
          <div key={s} className="pf-step" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span className={`pf-step-dot ${i <= step ? "pf-step-dot-active" : ""}`}>{i + 1}</span>
            <span className="pf-step-text" style={{ fontWeight: i === step ? 800 : 600 }}>{s}</span>
            {i < lastStep ? <span className="pf-step-line" /> : null}
          </div>
        ))}
      </div>

      {/* STEP 1 — what you built */}
      <div style={show(0)}>
        <label style={label}>Project name *</label>
        <input name="title" style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. WhatsApp ordering bot for a Douala bakery" />
        <label style={label}>Short description *</label>
        <textarea name="description" style={{ ...input, minHeight: 70, resize: "vertical" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you build?" />
        <label style={label}>What real problem does it solve?</label>
        <textarea name="problem" style={{ ...input, minHeight: 55, resize: "vertical" }} defaultValue={existing?.problem ?? ""} placeholder="Who has this problem and why does it matter?" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Project type</label>
            <select name="projectType" style={input} defaultValue={existing?.projectType ?? "other"}>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{PROJECT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>What kind of project is this?</label>
            <select name="projectContext" style={input} defaultValue={existing?.projectContext ?? "portfolio_project"}>
              {PROJECT_CONTEXTS.map((c) => (
                <option key={c} value={c}>{PROJECT_CONTEXT_LABELS[c]}</option>
              ))}
            </select>
          </div>
        </div>
        <label style={label}>Technologies (comma-separated)</label>
        <input name="techStack" style={input} defaultValue={existing?.techStack.join(", ") ?? ""} placeholder="Next.js, WhatsApp API, Postgres…" />
        <label style={label}>AI / automation used</label>
        <input name="aiTools" style={input} defaultValue={existing?.aiTools ?? ""} placeholder="e.g. Claude for the chatbot replies" />
        <label style={label}>Team project? Select your TechAscend teammates</label>
        <select name="teamUserIds" multiple size={Math.min(4, Math.max(2, cohortMates.length))} style={{ ...input, height: "auto" }} defaultValue={existing?.teamUserIds ?? []}>
          {cohortMates.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* STEP 2 — show it */}
      <div style={show(1)}>
        <label style={label}>GitHub repository</label>
        <input name="githubUrl" type="url" style={input} defaultValue={existing?.githubUrl ?? ""} placeholder="https://github.com/…" />
        <label style={label}>Live URL</label>
        <input name="liveUrl" type="url" style={input} defaultValue={existing?.liveUrl ?? ""} placeholder="https://…" />
        <label style={label}>Demo video link</label>
        <input name="demoVideoUrl" type="url" style={input} defaultValue={existing?.demoVideoUrl ?? ""} placeholder="https://… (60–120s screen recording)" />
        <label style={label}>Screenshot links (one https link per line)</label>
        <textarea name="screenshotUrls" style={{ ...input, minHeight: 55, resize: "vertical" }} defaultValue={existing?.screenshotUrls.join("\n") ?? ""} placeholder={"https://drive.google.com/…\nhttps://…"} />
        <label style={label}>Other evidence links (one per line)</label>
        <textarea name="evidenceLinks" style={{ ...input, minHeight: 55, resize: "vertical" }} defaultValue={existing?.evidenceLinks.join("\n") ?? ""} placeholder="Docs, posts, client messages (with permission)…" />
        <label style={label}>Where is the project today?</label>
        <select name="maturity" style={input} value={maturity} onChange={(e) => setMaturity(e.target.value)}>
          {PROJECT_MATURITIES.map((m) => (
            <option key={m} value={m}>{PROJECT_MATURITY_LABELS[m]}</option>
          ))}
        </select>
      </div>

      {/* STEP 3 — who used it (only from "testing" upward) */}
      <div style={show(2)}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, marginTop: 10 }}>
          <input type="checkbox" name="externalTested" checked={tested} onChange={(e) => setTested(e.target.checked)} />
          Someone outside TechAscend tested or used this project
        </label>
        {tested ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={label}>Who tested/used it? *</label>
                <select name="testerKind" style={input} defaultValue={existing?.testerKind ?? ""}>
                  <option value="">Select…</option>
                  {TESTER_KINDS.map((k) => (
                    <option key={k} value={k}>{TESTER_KIND_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={label}>Organization / business name</label>
                <input name="orgName" style={input} defaultValue={existing?.orgName ?? ""} placeholder="e.g. Boulangerie du Rond-Point" />
              </div>
            </div>
            <label style={label}>Number of testers / users</label>
            <input name="userCount" type="number" min={0} style={input} defaultValue={existing?.userCount ?? ""} />
            <label style={label}>What feedback did they give?</label>
            <textarea name="feedback" style={{ ...input, minHeight: 55, resize: "vertical" }} defaultValue={existing?.feedback ?? ""} />
            <label style={label}>What did you change after their feedback?</label>
            <textarea name="changesMade" style={{ ...input, minHeight: 55, resize: "vertical" }} defaultValue={existing?.changesMade ?? ""} />
          </>
        ) : (
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.55 }}>
            No problem — getting your project in front of one real user is a great next goal. You can update this any time.
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        {step > 0 ? (
          <button type="button" className="pf-btn-soft" onClick={() => setStep((s) => s - 1)} style={{ fontSize: 12.5 }}>
            ← Back
          </button>
        ) : null}
        {step < lastStep ? (
          <button type="button" className="pf-btn-grad" onClick={next} style={{ fontSize: 12.5, padding: "9px 18px", borderRadius: 10 }}>
            Next →
          </button>
        ) : (
          <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5, padding: "9px 18px", borderRadius: 10 }}>
            {pending ? "Saving…" : existing ? "Save & resubmit" : "Add project"}
          </button>
        )}
        <button type="button" className="pf-btn-soft" onClick={onCancel} style={{ fontSize: 12.5 }}>
          Cancel
        </button>
        {(stepError || state.error) && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{stepError ?? state.error}</span>
        )}
      </div>
    </form>
  );
}
