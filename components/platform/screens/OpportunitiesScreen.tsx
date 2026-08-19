"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOpportunityAction,
  setOpportunityStatusAction,
  expressInterestAction,
  markAppliedAction,
  setInterestStatusAction,
  type ActionState,
} from "@/lib/actions/community";
import { importOpenSourceProgramsAction } from "@/lib/actions/staff";
import { OPPORTUNITY_TYPES, INTEREST_STATUSES, isStaff, formatFcfa } from "@/lib/constants";
import { interestStatusStyle } from "@/components/platform/interestStatus";
import FormattedNote from "@/components/platform/FormattedNote";

export type OpportunityItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  pay: string | null;
  skills: string[];
  location: string | null;
  link: string | null; // external apply URL
  status: string; // "open" | "closed"
  createdAt: string; // ISO
  postedById: string;
  posterName: string; // partner?.name ?? postedBy.name
  interestedCount: number;
  myInterest: boolean; // students: I already expressed interest
  myInterestStatus: string | null; // students: my application status
  // staff/partner view only
  interestedUsers: { interestId: string; id: string; name: string; status: string; expectedAmount: number | null }[];
};

type OpportunitiesScreenProps = {
  opportunities: OpportunityItem[];
  me: { id: string; role: string };
};

const TYPE_STYLES: Record<string, { fg: string; bg: string; label: string }> = {
  freelance: { fg: "#7C3AED", bg: "#F1EAFC", label: "Freelance" },
  job: { fg: "#1F9D6B", bg: "#E6F6EF", label: "Job" },
  internship: { fg: "#2D6FD9", bg: "#E6F0FC", label: "Internship" },
  studio: { fg: "#D6336C", bg: "#FCE7F0", label: "Studio" },
  sme: { fg: "#C97A0E", bg: "#FCF1DE", label: "SME" },
};

function typeStyle(type: string) {
  return TYPE_STYLES[type] ?? { fg: "var(--brand1)", bg: "#F1EAFC", label: type };
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 12px",
  fontFamily: "inherit",
  fontSize: 13,
  color: "var(--ink)",
  background: "var(--bg)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 700,
  color: "var(--muted)",
  marginBottom: 5,
};

const initialState: ActionState = {};

function OpportunityForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [state, formAction, pending] = useActionState(createOpportunityAction, initialState);

  useEffect(() => {
    if (state.ok) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input name="title" required minLength={2} style={inputStyle} placeholder="e.g. Landing page for a Douala SME" />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select name="type" defaultValue="freelance" style={inputStyle}>
            {OPPORTUNITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {typeStyle(t).label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Pay</label>
          <input name="pay" style={inputStyle} placeholder="45,000 F / Negotiable" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Skills (comma-separated)</label>
          <input name="skills" style={inputStyle} placeholder="React, Tailwind, Copywriting" />
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input name="location" style={inputStyle} placeholder="Remote, Douala, Yaoundé…" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Apply link (optional)</label>
        <input name="link" type="url" style={inputStyle} placeholder="https://… (external application page)" />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          style={{ ...inputStyle, minHeight: 70, resize: "vertical", lineHeight: 1.5 }}
          placeholder="Scope, deliverables, timeline…"
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="submit"
          className="pf-btn-grad"
          disabled={pending}
          style={{ fontSize: 13, padding: "10px 18px", borderRadius: 10, opacity: pending ? 0.7 : 1 }}
        >
          {pending ? "Posting…" : "Post opportunity"}
        </button>
        <button type="button" className="pf-btn-soft" onClick={onCancel} style={{ fontSize: 13, padding: "10px 16px", borderRadius: 10 }}>
          Cancel
        </button>
        {state.error ? (
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--danger)" }}>{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}

// Staff/poster application tracker: one row per interested student with the
// funnel status and an optional expected amount (FCFA) — pipeline value before
// the real payout is recorded in /revenue.
function ApplicationsPanel({
  opp,
  me,
  run,
  isPending,
}: {
  opp: OpportunityItem;
  me: OpportunitiesScreenProps["me"];
  run: (action: () => Promise<ActionState>) => void;
  isPending: boolean;
}) {
  const counts = INTEREST_STATUSES.map((s) => ({
    status: s,
    n: opp.interestedUsers.filter((u) => u.status === s).length,
  })).filter((c) => c.n > 0);
  const expectedTotal = opp.interestedUsers
    .filter((u) => (u.status === "accepted" || u.status === "hired") && u.expectedAmount)
    .reduce((sum, u) => sum + (u.expectedAmount ?? 0), 0);
  const hasOutcome = opp.interestedUsers.some((u) => u.status === "accepted" || u.status === "hired");

  return (
    <div style={{ marginTop: 10, border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", background: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.3, color: "var(--faint)" }}>APPLICATIONS</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)" }}>
          {counts.map((c) => `${c.n} ${interestStatusStyle(c.status).label.toLowerCase()}`).join(" · ")}
        </span>
        {expectedTotal > 0 ? (
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--pos, #1F9D6B)" }}>
            · expected {formatFcfa(expectedTotal)}
          </span>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {opp.interestedUsers.map((u) => (
          <ApplicantRow key={u.interestId} applicant={u} run={run} isPending={isPending} />
        ))}
      </div>
      {hasOutcome && me.role === "admin" ? (
        <a href="/revenue" style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "var(--brand1)", marginTop: 8 }}>
          Record payout in Revenue →
        </a>
      ) : null}
    </div>
  );
}

function ApplicantRow({
  applicant,
  run,
  isPending,
}: {
  applicant: OpportunityItem["interestedUsers"][number];
  run: (action: () => Promise<ActionState>) => void;
  isPending: boolean;
}) {
  const [amount, setAmount] = useState(applicant.expectedAmount ? String(applicant.expectedAmount) : "");
  const st = interestStatusStyle(applicant.status);

  const saveAmount = () => {
    const parsed = amount.trim() === "" ? 0 : Number(amount);
    if (Number.isNaN(parsed) || parsed < 0) return;
    if ((applicant.expectedAmount ?? 0) === parsed) return; // unchanged
    run(() => setInterestStatusAction(applicant.interestId, applicant.status, parsed));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, flex: "1 1 140px", minWidth: 0 }}>{applicant.name}</span>
      <span className="pf-badge-sm" style={{ color: st.fg, background: st.bg }}>{st.label}</span>
      <select
        value={applicant.status}
        disabled={isPending}
        onChange={(e) => run(() => setInterestStatusAction(applicant.interestId, e.target.value))}
        style={{ ...inputStyle, width: 120, padding: "6px 8px", fontSize: 12 }}
      >
        {INTEREST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {interestStatusStyle(s).label}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        step={1000}
        value={amount}
        disabled={isPending}
        onChange={(e) => setAmount(e.target.value)}
        onBlur={saveAmount}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        placeholder="Expected (FCFA)"
        title="Expected stipend/payout in FCFA — saved when you leave the field"
        style={{ ...inputStyle, width: 130, padding: "6px 8px", fontSize: 12 }}
      />
    </div>
  );
}

function OpportunityCard({ opp, me }: { opp: OpportunityItem; me: OpportunitiesScreenProps["me"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const student = me.role === "student";
  const canManage = isStaff(me.role) || opp.postedById === me.id;
  const closed = opp.status === "closed";
  const ts = typeStyle(opp.type);

  function run(action: () => Promise<ActionState>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div
      className="pf-card pf-pad"
      style={{ opacity: closed ? 0.55 : isPending ? 0.6 : 1, transition: "opacity 0.15s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="pf-badge-sm" style={{ color: ts.fg, background: ts.bg }}>
              {ts.label}
            </span>
            <span style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 15 }}>{opp.title}</span>
            {closed ? (
              <span className="pf-badge-sm" style={{ color: "var(--muted)", background: "var(--bg)" }}>
                Closed
              </span>
            ) : null}
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span>{opp.posterName}</span>
            {opp.pay ? (
              <span style={{ fontWeight: 800, color: "var(--pos, #1F9D6B)" }}>{opp.pay}</span>
            ) : null}
            {opp.location ? <span>· {opp.location}</span> : null}
          </div>

          {opp.description ? (
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginTop: 8 }}>
              <FormattedNote text={opp.description} />
            </div>
          ) : null}

          {opp.skills.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {opp.skills.map((s) => (
                <span key={s} className="pf-chip">
                  {s}
                </span>
              ))}
            </div>
          ) : null}

          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--faint)", marginTop: 10 }}>
            {opp.interestedCount} {opp.interestedCount === 1 ? "student" : "students"} interested
          </div>

          {canManage && opp.interestedUsers.length > 0 ? (
            <ApplicationsPanel opp={opp} me={me} run={run} isPending={isPending} />
          ) : null}

          {error ? (
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", marginTop: 8 }}>{error}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {opp.link && !closed ? (
            <a
              href={opp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-btn-soft"
              style={{ fontSize: 12.5, padding: "8px 14px", borderRadius: 9, fontWeight: 700 }}
            >
              Apply ↗
            </a>
          ) : null}
          {student && !closed ? (
            opp.myInterest ? (
              <>
                <span
                  className="pf-badge-sm"
                  style={{
                    padding: "8px 14px",
                    color: interestStatusStyle(opp.myInterestStatus ?? "interested").fg,
                    background: interestStatusStyle(opp.myInterestStatus ?? "interested").bg,
                  }}
                >
                  ✓ {interestStatusStyle(opp.myInterestStatus ?? "interested").label}
                </span>
                {(opp.myInterestStatus ?? "interested") === "interested" ? (
                  <button
                    className="pf-btn-grad"
                    disabled={isPending}
                    onClick={() => run(() => markAppliedAction(opp.id))}
                    style={{ fontSize: 12, padding: "7px 13px", borderRadius: 9 }}
                    title="Applied on the program's site? Let the team know."
                  >
                    I&apos;ve applied →
                  </button>
                ) : null}
              </>
            ) : (
              <button
                className="pf-btn-grad"
                disabled={isPending}
                onClick={() => run(() => expressInterestAction(opp.id))}
                style={{ fontSize: 12.5, padding: "8px 16px", borderRadius: 9 }}
              >
                I&apos;m interested
              </button>
            )
          ) : null}
          {canManage ? (
            <button
              className="pf-btn-soft"
              disabled={isPending}
              onClick={() => run(() => setOpportunityStatusAction(opp.id, closed ? "open" : "closed"))}
              style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8 }}
            >
              {closed ? "Reopen" : "Close"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesScreen({ opportunities, me }: OpportunitiesScreenProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [importing, startImport] = useTransition();
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const canPost = isStaff(me.role) || me.role === "partner";

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 10, flexWrap: "wrap" }}>
          <div className="pf-h" style={{ fontSize: 17 }}>Opportunities</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {me.role === "admin" ? (
              <button
                className="pf-btn-soft"
                disabled={importing}
                onClick={() => {
                  setImportMsg(null);
                  startImport(async () => {
                    const res = await importOpenSourceProgramsAction();
                    if (res.error) setImportMsg(res.error);
                    else {
                      setImportMsg(`Imported — ${res.created ?? 0} new, ${res.updated ?? 0} updated`);
                      router.refresh();
                    }
                  });
                }}
                style={{ fontSize: 13, padding: "10px 16px", borderRadius: 10 }}
                title="Add/update the curated list of real paid open-source programs (Outreachy, GSoC, LFX…). Safe to click again — it updates in place."
              >
                {importing ? "Importing…" : "Import open-source programs"}
              </button>
            ) : null}
            {canPost ? (
              <button
                className={adding ? "pf-btn-soft" : "pf-btn-grad"}
                onClick={() => setAdding((v) => !v)}
                style={{ fontSize: 13, padding: "10px 16px", borderRadius: 10 }}
              >
                {adding ? "Close" : "+ Post opportunity"}
              </button>
            ) : null}
          </div>
        </div>
        {importMsg ? (
          <div style={{ fontSize: 12.5, fontWeight: 700, color: importMsg.startsWith("Imported") ? "var(--pos, #1F9D6B)" : "var(--danger)", marginBottom: 12 }}>
            {importMsg}
          </div>
        ) : null}

        {canPost && adding ? (
          <div className="pf-card pf-pad" style={{ marginBottom: 16 }}>
            <div className="pf-h" style={{ marginBottom: 14 }}>New opportunity</div>
            <OpportunityForm
              onCancel={() => setAdding(false)}
              onDone={() => {
                setAdding(false);
                router.refresh();
              }}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} me={me} />
          ))}
          {opportunities.length === 0 ? (
            <div className="pf-card" style={{ padding: "44px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>💼</div>
              <div className="pf-h" style={{ fontSize: 16, marginBottom: 4 }}>No opportunities posted yet</div>
              <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 400, margin: "0 auto", lineHeight: 1.55 }}>
                No opportunities posted yet — partners and staff post real paid work here.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
