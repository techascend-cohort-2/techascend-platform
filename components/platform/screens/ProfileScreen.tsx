"use client";

import { useActionState, useState, useTransition } from "react";
import {
  updateProfileAction,
  saveAiKeyAction,
  removeAiKeyAction,
  type ActionState,
} from "@/lib/actions/community";
import { submitVisibilityAction } from "@/lib/actions/program";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";
import { AI_PROVIDERS, type AiProviderId, type AiProviderMeta } from "@/lib/aiProviderMeta";

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

function RevealField({ id, name, placeholder }: { id: string; name: string; placeholder: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{ ...input, paddingRight: 40, fontFamily: "var(--font-mono)" }}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="off"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide key" : "Show key"}
        tabIndex={-1}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 38,
          display: "grid",
          placeItems: "center",
          background: "none",
          border: "none",
          color: "var(--muted)",
          cursor: "pointer",
        }}
      >
        {visible ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0112 20c-6 0-10-6-10-8 0-.98 1.02-2.98 2.68-4.74M9.9 4.24A10.5 10.5 0 0112 4c6 0 10 6 10 8 0 .8-.6 2.14-1.68 3.44M14.12 14.12a3 3 0 11-4.24-4.24" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

function ProviderKeyBlock({
  meta,
  state: keyState,
  platformProvided,
}: {
  meta: AiProviderMeta;
  state: { masked: string | null; unreadable: boolean };
  platformProvided?: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveAiKeyAction, {});
  const [removing, startRemove] = useTransition();
  const [removeError, setRemoveError] = useState<string | null>(null);
  const { masked, unreadable } = keyState;

  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13.5, fontWeight: 800 }}>{meta.label}</span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: 20,
            color: meta.free ? "var(--pos)" : "#7A4C08",
            background: meta.free ? "var(--posbg)" : "#FCF1DE",
          }}
        >
          {meta.free ? "Free" : "Paid"}
        </span>
        {masked ? (
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--pos)" }}>✓ Using your key</span>
        ) : unreadable ? (
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#B3243F" }}>⚠ Needs re-entry</span>
        ) : platformProvided ? (
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--pos)" }}>✓ Enabled by TechAscend</span>
        ) : null}
      </div>
      {platformProvided && !masked && !unreadable ? (
        <div style={{ marginTop: 8, fontSize: 12.5, background: "var(--posbg)", color: "#14543A", borderRadius: 9, padding: "9px 12px", lineHeight: 1.5 }}>
          The AI Tutor is ready to use — no key needed. Adding your own gateway key below is optional.
        </div>
      ) : null}
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 5, lineHeight: 1.6 }}>
        {meta.getKeyUrl ? (
          <>
            Get your key at{" "}
            <a href={meta.getKeyUrl} target="_blank" rel="noreferrer" className="pf-link">
              {meta.getKeyLabel} ↗
            </a>
            .{" "}
          </>
        ) : null}
        {meta.howTo}
      </div>

      {unreadable ? (
        <div style={{ marginTop: 10, fontSize: 12.5, background: "#FDECEF", color: "#B3243F", borderRadius: 9, padding: "9px 12px", lineHeight: 1.5 }}>
          We couldn&apos;t read your saved {meta.label} key (the platform&apos;s security key changed). Please paste it
          again below to reconnect your AI Tutor.
        </div>
      ) : null}

      {masked ? (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{masked}</span>
          <button
            type="button"
            className="pf-btn-soft"
            style={{ fontSize: 12, color: "var(--danger)" }}
            disabled={removing}
            onClick={() => {
              setRemoveError(null);
              startRemove(async () => {
                const res = await removeAiKeyAction(meta.id);
                if (!res.ok) setRemoveError(res.error ?? "Could not remove the key.");
              });
            }}
          >
            {removing ? "Removing…" : "Remove key"}
          </button>
          {removeError ? <span style={{ fontSize: 12, color: "var(--danger)" }}>{removeError}</span> : null}
        </div>
      ) : null}

      <form action={action} style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <input type="hidden" name="provider" value={meta.id} />
        <div style={{ flex: "1 1 260px" }}>
          <label style={label} htmlFor={`aiKey-${meta.id}`}>
            {masked ? "Replace your key" : unreadable ? `Re-enter your ${meta.label} API key` : `Paste your ${meta.label} API key`}
          </label>
          <RevealField id={`aiKey-${meta.id}`} name="apiKey" placeholder={meta.placeholder} />
        </div>
        <button className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13 }} disabled={pending}>
          {pending ? "Saving…" : "Save key"}
        </button>
      </form>
      <Msg state={state} okText="Key saved — your AI Tutor is ready." />
    </div>
  );
}

function Msg({ state, okText }: { state: { ok?: boolean; error?: string }; okText: string }) {
  if (state.error)
    return <div style={{ marginTop: 10, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 9, padding: "8px 12px" }}>{state.error}</div>;
  if (state.ok)
    return <div style={{ marginTop: 10, fontSize: 12.5, color: "#14543A", background: "var(--posbg)", borderRadius: 9, padding: "8px 12px" }}>{okText}</div>;
  return null;
}

export type ProfileUser = {
  name: string;
  email: string;
  role: string;
  bio: string | null;
  city: string | null;
  phone: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  mediumUrl: string | null;
  huggingfaceUrl: string | null;
  kaggleUrl: string | null;
  talentVisible: boolean;
  mustChangePassword: boolean;
  aiKeys: Record<AiProviderId, { masked: string | null; unreadable: boolean }>;
  lcwatPlatformEnabled: boolean;
};

export type VisibilityInfo = {
  status: string;
  reviewNote: string | null;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  mediumUrl: string;
  huggingfaceUrl: string;
  kaggleUrl: string;
} | null;

export type VisibilityEvent = {
  id: string;
  decision: string; // "approved" | "changes_requested" | "reopened"
  note: string | null;
  reviewerName: string | null;
  createdAt: string;
};

const VIS_EVENT_META: Record<string, { label: string; fg: string; bg: string }> = {
  approved: { label: "Approved", fg: "var(--pos)", bg: "var(--posbg)" },
  changes_requested: { label: "Changes requested", fg: "#B3243F", bg: "#FDECEF" },
  reopened: { label: "Reopened for review", fg: "#7A4C08", bg: "#FCF1DE" },
};

// Note background follows the decision: green when approved, red only when
// changes are requested, neutral otherwise.
function noteColors(status: string): { bg: string; fg: string } {
  if (status === "approved") return { bg: "var(--posbg)", fg: "#14543A" };
  if (status === "changes_requested") return { bg: "#FDECEF", fg: "#B3243F" };
  return { bg: "var(--bg)", fg: "var(--ink)" };
}

const visFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

const LINKS: { name: keyof ProfileUser & string; lbl: string; ph: string }[] = [
  { name: "githubUrl", lbl: "GitHub", ph: "https://github.com/you" },
  { name: "linkedinUrl", lbl: "LinkedIn", ph: "https://linkedin.com/in/you" },
  { name: "xUrl", lbl: "X (Twitter)", ph: "https://x.com/you" },
  { name: "mediumUrl", lbl: "Medium / Substack", ph: "https://medium.com/@you" },
  { name: "huggingfaceUrl", lbl: "Hugging Face", ph: "https://huggingface.co/you" },
  { name: "kaggleUrl", lbl: "Kaggle", ph: "https://kaggle.com/you" },
];

export default function ProfileScreen({
  user,
  visibility,
  visibilityHistory = [],
}: {
  user: ProfileUser;
  visibility: VisibilityInfo;
  visibilityHistory?: VisibilityEvent[];
}) {
  const [pState, pAction, pPending] = useActionState<ActionState, FormData>(updateProfileAction, {});
  const [vState, vAction, vPending] = useActionState<ActionState, FormData>(submitVisibilityAction, {});
  const [wState, wAction, wPending] = useActionState<FormState, FormData>(changePasswordAction, {});

  const isStudent = user.role === "student";

  return (
    <div className="pf-screen" style={{ maxWidth: 880, margin: "0 auto" }}>
      {user.mustChangePassword ? (
        <div style={{ marginBottom: 16, background: "#FCF1DE", border: "1px solid #F2DBB4", color: "#7A4C08", borderRadius: 12, padding: "12px 16px", fontSize: 13 }}>
          You&apos;re using a temporary password — set your own in the <b>Password</b> section below.
        </div>
      ) : null}

      {/* Visibility submission (students) */}
      {isStudent ? (
        <form className="pf-card" style={{ padding: 24, marginBottom: 16 }} action={vAction}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="pf-h" style={{ flex: 1 }}>Visibility submission — Phase 1</div>
            {visibility ? (
              <span
                style={{
                  fontSize: 11, fontWeight: 800, padding: "4px 11px", borderRadius: 20,
                  color: visibility.status === "approved" ? "var(--pos)" : visibility.status === "pending" ? "#7A4C08" : "#B3243F",
                  background: visibility.status === "approved" ? "var(--posbg)" : visibility.status === "pending" ? "#FCF1DE" : "#FDECEF",
                }}
              >
                {visibility.status === "approved" ? "✓ Approved" : visibility.status === "pending" ? "Under review" : "Changes requested"}
              </span>
            ) : null}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
            Submit all six profile links. The community team reviews them — approval (plus completing the Phase 1 lessons) earns your Visibility Badge and certificate automatically.
          </div>
          {visibility?.reviewNote ? (
            <div style={{ marginTop: 10, fontSize: 12.5, background: noteColors(visibility.status).bg, color: noteColors(visibility.status).fg, borderRadius: 9, padding: "9px 12px" }}>
              Reviewer note: {visibility.reviewNote}
            </div>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", columnGap: 16 }}>
            {LINKS.map((l) => (
              <div key={l.name}>
                <label style={label} htmlFor={`v-${l.name}`}>{l.lbl} *</label>
                <input
                  style={input}
                  id={`v-${l.name}`}
                  name={l.name}
                  type="url"
                  required
                  placeholder={l.ph}
                  defaultValue={(visibility?.[l.name as keyof NonNullable<VisibilityInfo>] as string) ?? (user[l.name] as string) ?? ""}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13 }} disabled={vPending || visibility?.status === "approved"}>
              {visibility?.status === "approved" ? "Approved ✓" : vPending ? "Submitting…" : visibility ? "Resubmit for review" : "Submit for review"}
            </button>
          </div>
          <Msg state={vState} okText="Submitted! The community team has been notified." />
        </form>
      ) : null}

      {/* Visibility review history (students) */}
      {isStudent && visibilityHistory.length > 0 ? (
        <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="pf-h">Review history</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, marginBottom: 14 }}>
            Every decision the review team has made on your six links, most recent first.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibilityHistory.map((ev) => {
              const meta = VIS_EVENT_META[ev.decision] ?? { label: ev.decision, fg: "var(--muted)", bg: "#eef1ee" };
              return (
                <div key={ev.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "11px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: meta.fg, background: meta.bg, padding: "2px 8px", borderRadius: 20 }}>
                      {meta.label}
                    </span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {ev.reviewerName ? `${ev.reviewerName} · ` : ""}{visFmt.format(new Date(ev.createdAt))}
                    </span>
                  </div>
                  {ev.note ? (
                    <div style={{ fontSize: 12.5, background: noteColors(ev.decision).bg, color: noteColors(ev.decision).fg, borderRadius: 8, padding: "8px 11px", marginTop: 8, lineHeight: 1.5 }}>
                      {ev.note}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Profile */}
      <form className="pf-card" style={{ padding: 24, marginBottom: 16 }} action={pAction}>
        <div className="pf-h">Profile</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", columnGap: 16 }}>
          <div>
            <label style={label} htmlFor="name">Full name</label>
            <input style={input} id="name" name="name" defaultValue={user.name} required />
          </div>
          <div>
            <label style={label} htmlFor="city">City</label>
            <input style={input} id="city" name="city" defaultValue={user.city ?? ""} placeholder="Douala" />
          </div>
          <div>
            <label style={label} htmlFor="phone">Phone / WhatsApp</label>
            <input style={input} id="phone" name="phone" defaultValue={user.phone ?? ""} placeholder="677123456" />
          </div>
          <div>
            <label style={label} htmlFor="portfolioUrl">Portfolio URL</label>
            <input style={input} id="portfolioUrl" name="portfolioUrl" type="url" defaultValue={user.portfolioUrl ?? ""} placeholder="https://…" />
          </div>
        </div>
        <label style={label} htmlFor="bio">Short bio</label>
        <textarea style={{ ...input, resize: "vertical" }} id="bio" name="bio" rows={3} defaultValue={user.bio ?? ""} placeholder="What you're building and where you're headed…" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", columnGap: 16 }}>
          {LINKS.map((l) => (
            <div key={l.name}>
              <label style={label} htmlFor={l.name}>{l.lbl}</label>
              <input style={input} id={l.name} name={l.name} type="url" defaultValue={(user[l.name] as string) ?? ""} placeholder={l.ph} />
            </div>
          ))}
        </div>

        {isStudent ? (
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" name="talentVisible" defaultChecked={user.talentVisible} style={{ marginTop: 3 }} />
            <span>
              <b>Show me in the Talent Pool.</b>{" "}
              <span style={{ color: "var(--muted)" }}>
                Hiring partners can see your profile, progress and links, and shortlist you for real opportunities.
              </span>
            </span>
          </label>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <button className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13 }} disabled={pPending}>
            {pPending ? "Saving…" : "Save profile"}
          </button>
        </div>
        <Msg state={pState} okText="Profile saved." />
      </form>

      {/* AI Tutor — personal API keys */}
      {isStudent ? (
        <div id="ai-keys" className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="pf-h">AI Tutor — your API keys</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.6 }}>
            The AI Tutor runs on your own API key, so your chats are never limited by other students&apos; usage.
            Add at least one key — <b>the Gemini key is free</b>. If you add more than one, the tutor uses them in
            order (Gemini → Claude → OpenAI) and automatically switches to your next key whenever one runs out or
            hits its limit.
          </div>

          {AI_PROVIDERS.map((meta) => (
            <ProviderKeyBlock
              key={meta.id}
              meta={meta}
              state={user.aiKeys[meta.id]}
              platformProvided={meta.id === "lcwat" && user.lcwatPlatformEnabled}
            />
          ))}
        </div>
      ) : null}

      {/* Password */}
      <form className="pf-card" style={{ padding: 24 }} action={wAction}>
        <div className="pf-h">Password</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", columnGap: 16 }}>
          <div>
            <label style={label} htmlFor="current">Current password</label>
            <input style={input} id="current" name="current" type="password" autoComplete="current-password" required />
          </div>
          <div>
            <label style={label} htmlFor="next">New password (min 8 chars)</label>
            <input style={input} id="next" name="next" type="password" autoComplete="new-password" minLength={8} required />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="pf-btn-soft" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13, cursor: "pointer" }} disabled={wPending}>
            {wPending ? "Updating…" : "Update password"}
          </button>
        </div>
        <Msg state={wState} okText="Password updated." />
      </form>
    </div>
  );
}
