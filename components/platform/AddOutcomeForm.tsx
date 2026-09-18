"use client";

import { useActionState, useEffect, useState } from "react";
import { saveOutcomeAction, type ActionState } from "@/lib/actions/impact";
import { ACHIEVEMENT_KINDS, MONEY_KINDS, EMPLOYMENT_TYPES, CONTRIBUTION_LEVELS, type AchievementKind } from "@/lib/constants";
import { ACHIEVEMENT_KIND_LABELS, CONTRIBUTION_LABELS, EMPLOYMENT_TYPE_LABELS } from "@/components/platform/impactStatus";

export type OutcomeItem = {
  id: string;
  kind: string;
  title: string;
  organizationName: string | null;
  roleTitle: string | null;
  employmentType: string | null;
  amount: number | null;
  currency: string | null;
  occurredAt: string | null;
  startedAt: string | null;
  techascendContribution: string;
  contributionNote: string | null;
  evidenceLinks: string[];
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

const KIND_EMOJI: Record<string, string> = {
  job: "💼", internship: "🎓", freelance: "🧑‍💻", client: "🤝", earning: "💰",
  fellowship: "🌍", competition: "🏆", business: "🚀", other: "✨",
};

// Which field groups each kind shows — the student never sees irrelevant fields.
const showsOrg = (k: string) => ["job", "internship", "client", "fellowship", "competition", "business"].includes(k);
const showsRole = (k: string) => ["job", "internship", "fellowship"].includes(k);
const showsEmployment = (k: string) => ["job", "internship"].includes(k);
const showsMoney = (k: string) => (MONEY_KINDS as string[]).includes(k);
const dateLabel: Record<string, string> = {
  job: "When did you receive the offer?",
  internship: "When were you selected?",
  fellowship: "When were you selected?",
  competition: "When did you win / get selected?",
};

export default function AddOutcomeForm({
  existing,
  onDone,
  onCancel,
}: {
  existing?: OutcomeItem | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveOutcomeAction, {});
  const [kind, setKind] = useState<AchievementKind | null>((existing?.kind as AchievementKind) ?? null);

  useEffect(() => {
    if (state.ok) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!kind) {
    return (
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 10 }}>What happened?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8 }}>
          {ACHIEVEMENT_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className="pf-btn-soft"
              onClick={() => setKind(k)}
              style={{ fontSize: 12.5, padding: "12px 10px", borderRadius: 10, textAlign: "left" }}
            >
              {KIND_EMOJI[k]} {ACHIEVEMENT_KIND_LABELS[k]}
            </button>
          ))}
        </div>
        <button type="button" className="pf-btn-soft" onClick={onCancel} style={{ fontSize: 12.5, marginTop: 12 }}>
          Cancel
        </button>
      </div>
    );
  }

  const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

  return (
    <form action={formAction}>
      {existing ? <input type="hidden" name="id" value={existing.id} /> : null}
      <input type="hidden" name="kind" value={kind} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>{KIND_EMOJI[kind]}</span>
        <span style={{ fontSize: 13.5, fontWeight: 800 }}>{ACHIEVEMENT_KIND_LABELS[kind]}</span>
        {!existing ? (
          <button type="button" className="pf-link" onClick={() => setKind(null)} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", fontSize: 12 }}>
            change
          </button>
        ) : null}
      </div>

      <label style={label}>Short title *</label>
      <input name="title" style={input} defaultValue={existing?.title ?? ""} placeholder={kind === "job" ? "e.g. Junior developer at …" : "e.g. Built a site for a local SME"} required minLength={3} />

      {showsOrg(kind) ? (
        <>
          <label style={label}>{kind === "client" ? "Client / business name *" : kind === "business" ? "Business / product name" : "Organization / company *"}</label>
          <input name="organizationName" style={input} defaultValue={existing?.organizationName ?? ""} />
        </>
      ) : null}
      {showsRole(kind) ? (
        <>
          <label style={label}>Position / role *</label>
          <input name="roleTitle" style={input} defaultValue={existing?.roleTitle ?? ""} />
        </>
      ) : null}
      {showsEmployment(kind) ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Type</label>
            <select name="employmentType" style={input} defaultValue={existing?.employmentType ?? ""}>
              <option value="">Select…</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{EMPLOYMENT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>Start date</label>
            <input name="startedAt" type="date" style={input} defaultValue={toDateInput(existing?.startedAt ?? null)} />
          </div>
        </div>
      ) : null}
      {showsMoney(kind) ? (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Amount earned (FCFA) *</label>
            <input name="amount" type="number" min={1} step={1000} style={input} defaultValue={existing?.amount ?? ""} />
          </div>
          <div>
            <label style={label}>Currency</label>
            <input name="currency" style={input} defaultValue={existing?.currency ?? "FCFA"} />
          </div>
        </div>
      ) : null}
      <label style={label}>{dateLabel[kind] ?? "When did this happen?"}</label>
      <input name="occurredAt" type="date" style={input} defaultValue={toDateInput(existing?.occurredAt ?? null)} />

      <label style={label}>Did TechAscend contribute to this opportunity?</label>
      <select name="techascendContribution" style={input} defaultValue={existing?.techascendContribution ?? "unknown"}>
        {CONTRIBUTION_LEVELS.map((c) => (
          <option key={c} value={c}>{CONTRIBUTION_LABELS[c]}</option>
        ))}
      </select>
      <label style={label}>How? (optional)</label>
      <input name="contributionNote" style={input} defaultValue={existing?.contributionNote ?? ""} placeholder="e.g. the capstone project in my portfolio convinced them" />

      <label style={label}>Supporting evidence links (one https link per line)</label>
      <textarea
        name="evidenceLinks"
        style={{ ...input, minHeight: 60, resize: "vertical" }}
        defaultValue={existing?.evidenceLinks.join("\n") ?? ""}
        placeholder={"Offer letter (Drive link), LinkedIn post, invoice, payment screenshot…"}
      />
      <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 4, lineHeight: 1.5 }}>
        Evidence stays private to the TechAscend team — it's only used to verify your outcome.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5, padding: "9px 18px", borderRadius: 10 }}>
          {pending ? "Saving…" : existing ? "Save & resubmit" : "Add outcome"}
        </button>
        <button type="button" className="pf-btn-soft" onClick={onCancel} style={{ fontSize: 12.5 }}>
          Cancel
        </button>
        {state.error ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span> : null}
      </div>
    </form>
  );
}
