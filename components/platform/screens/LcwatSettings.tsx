"use client";

import { useActionState, useState, useTransition } from "react";
import {
  saveLcwatConfigAction,
  clearLcwatConfigAction,
  type ActionState,
} from "@/lib/actions/staff";

export type LcwatAdminView = {
  url: string;
  keyMasked: string | null;
  usingEnvUrl: boolean;
  usingEnvKey: boolean;
};

const input: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "#FBFAFF",
};
const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", margin: "12px 0 5px" };

export default function LcwatSettings({ view }: { view: LcwatAdminView }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveLcwatConfigAction, {});
  const [clearing, startClear] = useTransition();
  const [showKey, setShowKey] = useState(false);
  const configured = Boolean(view.url && view.keyMasked);

  return (
    <div className="pf-card pf-pad">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div className="pf-h" style={{ flex: 1 }}>AI Tutor gateway — TechAscend LCWAT</div>
        <span
          className={`pf-badge ${configured ? "pf-badge-pos" : "pf-badge-neutral"}`}
        >
          {configured ? "Enabled" : "Not configured"}
        </span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.6 }}>
        When both a URL and key are set, every student&apos;s AI Tutor can use the gateway with no personal key.
        Changes take effect immediately — no redeploy. Values saved here override any <code>LCWAT_*</code> environment variables.
      </div>

      <form action={action}>
        <label style={label} htmlFor="lcwat-url">Gateway URL</label>
        <input
          id="lcwat-url"
          name="gatewayUrl"
          type="url"
          defaultValue={view.url}
          placeholder="https://gateway.tech-ascend.com  (or http://host:8600)"
          style={input}
        />
        {view.usingEnvUrl ? (
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>Currently inherited from the LCWAT_GATEWAY_URL env var — saving stores it in the database.</div>
        ) : null}

        <label style={label} htmlFor="lcwat-key">
          Gateway API key {view.keyMasked ? <span style={{ color: "var(--pos)", fontWeight: 800 }}>· ✓ saved ({view.keyMasked})</span> : null}
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="lcwat-key"
            name="apiKey"
            type={showKey ? "text" : "password"}
            placeholder={view.keyMasked ? "Leave blank to keep the current key" : "lcwat_…"}
            autoComplete="off"
            style={{ ...input, paddingRight: 40, fontFamily: "var(--font-mono)" }}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            tabIndex={-1}
            aria-label={showKey ? "Hide key" : "Show key"}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 38, background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
          >
            {showKey ? "🙈" : "👁"}
          </button>
        </div>
        {view.usingEnvKey ? (
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>Currently inherited from the LCWAT_API_KEY env var — set a key here to store it (encrypted) in the database.</div>
        ) : null}

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13 }} disabled={pending}>
            {pending ? "Saving…" : "Save gateway settings"}
          </button>
          {configured ? (
            <button
              type="button"
              className="pf-btn-soft"
              style={{ padding: "11px 18px", borderRadius: 11, fontSize: 13, color: "var(--danger)", cursor: "pointer" }}
              disabled={clearing}
              onClick={() => startClear(async () => { await clearLcwatConfigAction(); })}
            >
              {clearing ? "Removing…" : "Disable gateway"}
            </button>
          ) : null}
        </div>
        {state.error ? (
          <div style={{ marginTop: 10, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 9, padding: "8px 12px" }}>{state.error}</div>
        ) : state.ok ? (
          <div style={{ marginTop: 10, fontSize: 12.5, color: "#14543A", background: "var(--posbg)", borderRadius: 9, padding: "8px 12px" }}>Saved — the AI Tutor gateway is updated.</div>
        ) : null}
      </form>
    </div>
  );
}
