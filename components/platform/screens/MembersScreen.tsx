"use client";

import { useMemo, useState, useTransition, useActionState } from "react";
import Link from "next/link";
import { ROLES, TRACKS, TRACK_LABELS } from "@/lib/constants";
import { updateUserAction, updateStudentTrackAction, resetPasswordAction, type ActionState } from "@/lib/actions/staff";

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  track: string | null;
  title: string | null;
  initials: string | null;
  avatarBg: string | null;
  cohortId: string | null;
  cohortName: string | null;
  partnerName: string | null;
  progress: number;
  badges: number;
};

export type CohortOption = { id: string; name: string };

export type InsightRow = {
  status: "on_track" | "behind" | "inactive";
  phasePct: number;
  expectedPct: number;
  daysSinceActivity: number | null;
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

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  student: { color: "var(--brand1)", bg: "#f1eafc" },
  admin: { color: "var(--danger)", bg: "var(--dangerbg)" },
  manager: { color: "#2D6FD9", bg: "#e7effc" },
  partner: { color: "var(--warn)", bg: "var(--warnbg)" },
  applicant: { color: "var(--muted)", bg: "var(--bg)" },
};

const ROLE_ORDER = ["student", "applicant", "partner", "manager", "admin"];
const ROLE_TITLES: Record<string, string> = {
  student: "Students",
  applicant: "Applicants",
  partner: "Partner accounts",
  manager: "Managers",
  admin: "Admins",
};

const STATUS_STYLE: Record<InsightRow["status"], { label: string; color: string; bg: string }> = {
  on_track: { label: "On track", color: "var(--pos)", bg: "var(--posbg)" },
  behind: { label: "Behind schedule", color: "var(--warn)", bg: "var(--warnbg)" },
  inactive: { label: "Inactive", color: "var(--danger)", bg: "var(--dangerbg)" },
};

function RoleChip({ role }: { role: string }) {
  const c = ROLE_COLORS[role] ?? ROLE_COLORS.applicant;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 999,
        color: c.color,
        background: c.bg,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

function StatusChip({ insight }: { insight: InsightRow | undefined }) {
  if (!insight) return null;
  const s = STATUS_STYLE[insight.status];
  const detail =
    insight.status === "inactive"
      ? insight.daysSinceActivity !== null
        ? `${insight.daysSinceActivity}d quiet`
        : "no activity yet"
      : insight.status === "behind"
        ? `${insight.phasePct}% vs ${insight.expectedPct}% expected`
        : null;
  return (
    <span
      title={detail ?? undefined}
      style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: s.color, background: s.bg, whiteSpace: "nowrap" }}
    >
      {s.label}
      {detail ? ` · ${detail}` : ""}
    </span>
  );
}

function TempPasswordCard({ password }: { password: string }) {
  return (
    <div
      className="pf-card"
      style={{ background: "var(--warnbg)", border: "1px solid #f0dcb8", padding: "14px 16px", marginTop: 12 }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--warn)", marginBottom: 6 }}>
        Temporary password
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1,
          color: "var(--ink)",
          userSelect: "all",
        }}
      >
        {password}
      </div>
      <div style={{ fontSize: 12, color: "var(--warn)", marginTop: 6 }}>
        Share this with the member — they&apos;ll change it on first login.
      </div>
    </div>
  );
}

function ManageForm({ member, cohorts }: { member: MemberRow; cohorts: CohortOption[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateUserAction, {});
  const [resetting, startReset] = useTransition();
  const [temp, setTemp] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  return (
    <div style={{ padding: "14px 16px", borderTop: "1px dashed var(--line)", background: "var(--bg)", borderRadius: "0 0 12px 12px" }}>
      <form action={action}>
        <input type="hidden" name="userId" value={member.id} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
            Role
            <select name="role" defaultValue={member.role} style={{ ...inp, marginTop: 4 }}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
            Track
            <select name="track" defaultValue={member.track ?? ""} style={{ ...inp, marginTop: 4 }}>
              <option value="">No track</option>
              {TRACKS.map((t) => (
                <option key={t} value={t}>
                  Track {t} — {TRACK_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
            Cohort
            <select name="cohortId" defaultValue={member.cohortId ?? ""} style={{ ...inp, marginTop: 4 }}>
              <option value="">No cohort</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
            Title
            <input
              name="title"
              defaultValue={member.title ?? ""}
              placeholder="e.g. Fellow · Track A"
              style={{ ...inp, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5 }}>
            {pending ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            className="pf-btn-soft"
            disabled={resetting}
            style={{ fontSize: 12.5 }}
            onClick={() => {
              setResetError(null);
              startReset(async () => {
                const res = await resetPasswordAction(member.id);
                if (res.ok && res.tempPassword) setTemp(res.tempPassword);
                else setResetError(res.error ?? "Could not reset the password.");
              });
            }}
          >
            {resetting ? "Resetting…" : "Reset password"}
          </button>
          {state.ok && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)" }}>Saved ✓</span>}
          {state.error && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span>}
          {resetError && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{resetError}</span>}
        </div>
      </form>
      {temp && <TempPasswordCard password={temp} />}
    </div>
  );
}

function TrackForm({ member }: { member: MemberRow }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateStudentTrackAction, {});
  return (
    <div style={{ padding: "14px 16px", borderTop: "1px dashed var(--line)", background: "var(--bg)", borderRadius: "0 0 12px 12px" }}>
      <form action={action} style={{ display: "flex", alignItems: "end", gap: 10, flexWrap: "wrap" }}>
        <input type="hidden" name="userId" value={member.id} />
        <label style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
          Track
          <select name="track" defaultValue={member.track ?? "A"} style={{ ...inp, marginTop: 4, width: 220 }}>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                Track {t} — {TRACK_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="pf-btn-grad" disabled={pending} style={{ fontSize: 12.5 }}>
          {pending ? "Saving…" : "Save track"}
        </button>
        {state.ok && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)" }}>Saved ✓</span>}
        {state.error && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)" }}>{state.error}</span>}
      </form>
    </div>
  );
}

export default function MembersScreen({
  members,
  cohorts,
  viewerRole,
  insightsByUserId = {},
  currentPhaseName,
}: {
  members: MemberRow[];
  cohorts: CohortOption[];
  viewerRole: "admin" | "manager";
  insightsByUserId?: Record<string, InsightRow>;
  currentPhaseName?: string | null;
}) {
  const isAdmin = viewerRole === "admin";
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);

  const atRisk = useMemo(
    () =>
      members
        .filter((m) => m.role === "student")
        .map((m) => ({ member: m, insight: insightsByUserId[m.id] }))
        .filter((r): r is { member: MemberRow; insight: InsightRow } => Boolean(r.insight) && r.insight.status !== "on_track")
        .sort((a, b) => {
          if (a.insight.status !== b.insight.status) return a.insight.status === "inactive" ? -1 : 1;
          return b.insight.expectedPct - b.insight.phasePct - (a.insight.expectedPct - a.insight.phasePct);
        }),
    [members, insightsByUserId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (showAtRiskOnly && (m.role !== "student" || (insightsByUserId[m.id]?.status ?? "on_track") === "on_track")) return false;
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.cohortName ?? "").toLowerCase().includes(q)
      );
    });
  }, [members, query, roleFilter, showAtRiskOnly, insightsByUserId]);

  const groups = ROLE_ORDER.map((role) => ({
    role,
    rows: filtered.filter((m) => m.role === role),
  })).filter((g) => g.rows.length > 0);

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Members</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            {members.length} accounts across students, applicants, partners and staff.
            {!isAdmin && " Only admins can change roles or cohorts — you can still update a student's track."}
          </div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or cohort…"
          style={{ ...inp, width: 260 }}
        />
      </div>

      {/* Needs follow-up */}
      <div className="pf-card" style={{ marginBottom: 18, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: atRisk.length ? 12 : 0 }}>
          <div>
            <div className="pf-h">Needs follow-up</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {currentPhaseName ? `Measured against ${currentPhaseName}'s schedule. ` : ""}
              {atRisk.length === 0 ? "Everyone is on track 🎉" : `${atRisk.length} student${atRisk.length === 1 ? "" : "s"} may need a nudge.`}
            </div>
          </div>
          {atRisk.length > 0 && (
            <button
              className="pf-chip"
              onClick={() => setShowAtRiskOnly((v) => !v)}
              style={showAtRiskOnly ? { background: "#f1eafc", borderColor: "#ddd0f3", color: "var(--brand1)", fontWeight: 700 } : undefined}
            >
              {showAtRiskOnly ? "Showing at-risk only ×" : "Filter list to these"}
            </button>
          )}
        </div>
        {atRisk.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {atRisk.map(({ member, insight }) => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg)", borderRadius: 9, flexWrap: "wrap" }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: "50%", background: member.avatarBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0,
                  }}
                >
                  {member.initials ?? member.name.slice(0, 2).toUpperCase()}
                </div>
                <Link href={`/students/${member.id}`} className="pf-link" style={{ fontSize: 12.5, fontWeight: 700, flex: "1 1 140px", minWidth: 0, color: "var(--ink)" }}>
                  {member.name}
                </Link>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{member.track ? `Track ${member.track}` : "No track"}</div>
                <StatusChip insight={insight} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {["all", ...ROLES].map((r) => {
          const active = roleFilter === r;
          return (
            <button
              key={r}
              className="pf-chip"
              onClick={() => setRoleFilter(r)}
              style={
                active
                  ? { background: "#f1eafc", borderColor: "#ddd0f3", color: "var(--brand1)", fontWeight: 700, textTransform: "capitalize" }
                  : { textTransform: "capitalize" }
              }
            >
              {r === "all" ? "All roles" : r}
            </button>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div className="pf-card pf-pad" style={{ textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>
          No members match this filter.
        </div>
      )}

      {groups.map((g) => (
        <div key={g.role} className="pf-card" style={{ marginBottom: 18, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
            <div className="pf-h">{ROLE_TITLES[g.role] ?? g.role}</div>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{g.rows.length}</span>
          </div>
          {g.rows.map((m) => {
            const canManageFull = isAdmin;
            const canManageTrack = m.role === "student" && !isAdmin; // admins already get track via the full form
            const canOpen = canManageFull || canManageTrack;
            return (
              <div key={m.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: m.avatarBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12.5,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {m.initials ?? m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {m.role === "student" ? (
                        <Link href={`/students/${m.id}`} className="pf-link" style={{ color: "var(--ink)", fontWeight: 700 }}>
                          {m.name}
                        </Link>
                      ) : (
                        m.name
                      )}
                      <RoleChip role={m.role} />
                      {m.role === "student" ? <StatusChip insight={insightsByUserId[m.id]} /> : null}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.email}
                      {m.partnerName ? ` · ${m.partnerName}` : ""}
                    </div>
                  </div>
                  <div style={{ width: 90, fontSize: 12.5, color: "var(--muted)" }}>
                    {m.track ? `Track ${m.track}` : "—"}
                  </div>
                  <div style={{ width: 130, fontSize: 12.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.cohortName ?? "—"}
                  </div>
                  <div style={{ width: 120, display: "flex", alignItems: "center", gap: 8 }}>
                    {m.role === "student" ? (
                      <>
                        <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.max(0, m.progress))}%`,
                              height: "100%",
                              borderRadius: 999,
                              background: "linear-gradient(90deg,var(--brand1),var(--brand2))",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>{m.progress}%</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12.5, color: "var(--faint)" }}>—</span>
                    )}
                  </div>
                  <div style={{ width: 70, fontSize: 12.5, color: "var(--muted)" }}>
                    {m.badges} 🏅
                  </div>
                  {canOpen && (
                    <button
                      className="pf-btn-soft"
                      style={{ fontSize: 12 }}
                      onClick={() => setOpenId(openId === m.id ? null : m.id)}
                    >
                      {openId === m.id ? "Close" : canManageFull ? "Manage" : "Change track"}
                    </button>
                  )}
                </div>
                {openId === m.id && canManageFull && <ManageForm member={m} cohorts={cohorts} />}
                {openId === m.id && canManageTrack && <TrackForm member={m} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
