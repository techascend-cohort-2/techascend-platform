"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOpportunityAction,
  setOpportunityStatusAction,
  expressInterestAction,
  type ActionState,
} from "@/lib/actions/community";
import { OPPORTUNITY_TYPES, isStaff } from "@/lib/constants";

export type OpportunityItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  pay: string | null;
  skills: string[];
  location: string | null;
  status: string; // "open" | "closed"
  createdAt: string; // ISO
  postedById: string;
  posterName: string; // partner?.name ?? postedBy.name
  interestedCount: number;
  myInterest: boolean; // students: I already expressed interest
  interestedUsers: { id: string; name: string }[]; // staff/partner view only
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
              {opp.description}
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {opp.interestedUsers.map((u) => (
                <span key={u.id} className="pf-chip" style={{ fontWeight: 600 }}>
                  {u.name}
                </span>
              ))}
            </div>
          ) : null}

          {error ? (
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", marginTop: 8 }}>{error}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {student && !closed ? (
            opp.myInterest ? (
              <span className="pf-badge-sm pf-badge-pos" style={{ padding: "8px 14px" }}>
                ✓ Interested
              </span>
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
  const canPost = isStaff(me.role) || me.role === "partner";

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="pf-h" style={{ fontSize: 17 }}>Opportunities</div>
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
