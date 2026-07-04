"use client";

import { useState, useTransition, useActionState } from "react";
import { TRACKS, TRACK_LABELS } from "@/lib/constants";
import { saveCohortAction, deleteCohortAction, type ActionState } from "@/lib/actions/staff";

export type CohortRow = {
  id: string;
  name: string;
  track: string;
  status: string;
  hub: string | null;
  startDate: string | null; // ISO
  endDate: string | null; // ISO
  members: number;
};

const inp: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 13.5,
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
};

const STATUSES = ["Active", "Onboarding", "Completed"];

const STATUS_BADGE: Record<string, string> = {
  Active: "pf-badge-pos",
  Onboarding: "pf-badge-warn",
  Completed: "pf-badge-brand",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function dateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function CohortForm({
  cohort,
  onDone,
}: {
  cohort: CohortRow | null;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveCohortAction.bind(null, cohort?.id ?? null),
    {},
  );

  return (
    <form
      action={action}
      style={{ padding: "14px 16px", borderTop: "1px dashed var(--line)", background: "var(--bg)" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Name
          <input name="name" required defaultValue={cohort?.name ?? ""} placeholder="e.g. Cohort 3" style={{ ...inp, marginTop: 4 }} />
        </label>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Track
          <select name="track" defaultValue={cohort?.track ?? "ALL"} style={{ ...inp, marginTop: 4 }}>
            <option value="ALL">{TRACK_LABELS.ALL}</option>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                Track {t} — {TRACK_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Status
          <select name="status" defaultValue={cohort?.status ?? "Active"} style={{ ...inp, marginTop: 4 }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Hub
          <input name="hub" defaultValue={cohort?.hub ?? ""} placeholder="e.g. Douala" style={{ ...inp, marginTop: 4 }} />
        </label>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Start date
          <input type="date" name="startDate" defaultValue={dateInputValue(cohort?.startDate ?? null)} style={{ ...inp, marginTop: 4 }} />
        </label>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          End date
          <input type="date" name="endDate" defaultValue={dateInputValue(cohort?.endDate ?? null)} style={{ ...inp, marginTop: 4 }} />
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5 }}>
          {pending ? "Saving…" : cohort ? "Save changes" : "Create cohort"}
        </button>
        {onDone && (
          <button type="button" className="pf-btn-soft" style={{ fontSize: 12.5 }} onClick={onDone}>
            Cancel
          </button>
        )}
        {state.ok && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)" }}>Saved ✓</span>}
        {state.error && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span>}
      </div>
    </form>
  );
}

function CohortItem({ cohort }: { cohort: CohortRow }) {
  const [editing, setEditing] = useState(false);
  const [deleting, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <div style={{ borderBottom: "1px solid var(--line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px", minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{cohort.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{cohort.hub ?? "No hub set"}</div>
        </div>
        <div style={{ width: 110, fontSize: 12.5, color: "var(--muted)" }}>
          {cohort.track === "ALL" ? "All tracks" : `Track ${cohort.track}`}
        </div>
        <span className={`pf-badge ${STATUS_BADGE[cohort.status] ?? "pf-badge-brand"}`}>{cohort.status}</span>
        <div style={{ width: 90, fontSize: 12.5, color: "var(--muted)" }}>
          {cohort.members} member{cohort.members === 1 ? "" : "s"}
        </div>
        <div style={{ width: 190, fontSize: 12.5, color: "var(--muted)" }}>
          {fmtDate(cohort.startDate)} → {fmtDate(cohort.endDate)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="pf-btn-soft" style={{ fontSize: 12 }} onClick={() => setEditing((v) => !v)}>
            {editing ? "Close" : "Edit"}
          </button>
          <button
            className="pf-btn-soft"
            style={{ fontSize: 12, color: "var(--danger)" }}
            disabled={deleting}
            onClick={() => {
              setDeleteError(null);
              startDelete(async () => {
                const res = await deleteCohortAction(cohort.id);
                if (!res.ok) setDeleteError(res.error ?? "Could not delete this cohort.");
              });
            }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
        {deleteError && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", flexBasis: "100%" }}>{deleteError}</span>
        )}
      </div>
      {editing && <CohortForm cohort={cohort} onDone={() => setEditing(false)} />}
    </div>
  );
}

export default function CohortsScreen({ cohorts }: { cohorts: CohortRow[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Cohorts</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            {cohorts.length} cohort{cohorts.length === 1 ? "" : "s"} — create, edit and archive learning groups.
          </div>
        </div>
        <button className="pf-btn-grad" style={{ fontSize: 12.5 }} onClick={() => setCreating((v) => !v)}>
          {creating ? "Close" : "New cohort"}
        </button>
      </div>

      {creating && (
        <div className="pf-card" style={{ marginBottom: 18, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px" }}>
            <div className="pf-h">New cohort</div>
          </div>
          <CohortForm cohort={null} onDone={() => setCreating(false)} />
        </div>
      )}

      <div className="pf-card" style={{ overflow: "hidden" }}>
        {cohorts.length === 0 && (
          <div style={{ padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>
            No cohorts yet — create the first one.
          </div>
        )}
        {cohorts.map((c) => (
          <CohortItem key={c.id} cohort={c} />
        ))}
      </div>
    </div>
  );
}
