"use client";

import { useActionState } from "react";
import { updateProfileAction, type ActionState } from "@/lib/actions/community";
import { submitVisibilityAction } from "@/lib/actions/program";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";

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

const LINKS: { name: keyof ProfileUser & string; lbl: string; ph: string }[] = [
  { name: "githubUrl", lbl: "GitHub", ph: "https://github.com/you" },
  { name: "linkedinUrl", lbl: "LinkedIn", ph: "https://linkedin.com/in/you" },
  { name: "xUrl", lbl: "X (Twitter)", ph: "https://x.com/you" },
  { name: "mediumUrl", lbl: "Medium / Substack", ph: "https://medium.com/@you" },
  { name: "huggingfaceUrl", lbl: "Hugging Face", ph: "https://huggingface.co/you" },
  { name: "kaggleUrl", lbl: "Kaggle", ph: "https://kaggle.com/you" },
];

export default function ProfileScreen({ user, visibility }: { user: ProfileUser; visibility: VisibilityInfo }) {
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
          {visibility?.status === "changes_requested" && visibility.reviewNote ? (
            <div style={{ marginTop: 10, fontSize: 12.5, background: "#FDECEF", color: "#B3243F", borderRadius: 9, padding: "9px 12px" }}>
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
            <input style={input} id="phone" name="phone" defaultValue={user.phone ?? ""} placeholder="+237 …" />
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
