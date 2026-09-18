"use client";

import { useActionState } from "react";
import { saveSelectionBaselineAction, type ActionState } from "@/lib/actions/impact";

const input: React.CSSProperties = {
  width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "8px 11px",
  fontFamily: "inherit", fontSize: 13, color: "var(--ink)", background: "#fff", outline: "none",
};

export type SelectionScores = {
  selectionPotentialScore: number | null;
  selectionMotivationScore: number | null;
  selectionChallengeScore: number | null;
  selectionNotes: string | null;
};

/**
 * Staff-recorded selection signals from admissions (the "talent" side of the
 * impact thesis). 1–10 each, never self-reported, never a yes/no "talented"
 * flag.
 */
export default function SelectionBaselineForm({ userId, scores }: { userId: string; scores: SelectionScores | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSelectionBaselineAction, {});
  const fields: { name: string; label: string; value: number | null }[] = [
    { name: "selectionPotentialScore", label: "Potential", value: scores?.selectionPotentialScore ?? null },
    { name: "selectionMotivationScore", label: "Motivation", value: scores?.selectionMotivationScore ?? null },
    { name: "selectionChallengeScore", label: "Barriers faced", value: scores?.selectionChallengeScore ?? null },
  ];
  return (
    <form action={action}>
      <input type="hidden" name="userId" value={userId} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {fields.map((f) => (
          <div key={f.name}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>
              {f.label} (1–10)
            </label>
            <input name={f.name} type="number" min={1} max={10} defaultValue={f.value ?? ""} style={input} />
          </div>
        ))}
      </div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--muted)", margin: "10px 0 4px" }}>
        Selection notes (from admissions)
      </label>
      <textarea name="selectionNotes" defaultValue={scores?.selectionNotes ?? ""} style={{ ...input, minHeight: 55, resize: "vertical" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <button className="pf-btn-soft" disabled={pending} style={{ fontSize: 12 }}>
          {pending ? "Saving…" : "Save selection signals"}
        </button>
        {state.ok ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)" }}>Saved ✓</span> : null}
        {state.error ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span> : null}
      </div>
    </form>
  );
}
