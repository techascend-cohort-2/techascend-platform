"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewApplicationAction, createAccountForApplicationAction } from "@/lib/actions/staff";

type App = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  track: string | null;
  org: string | null;
  motivation: string | null;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  hasAccount: boolean;
  reviewedByName: string | null;
};

const STATUS_STYLE: Record<string, { c: string; bg: string; label: string }> = {
  new: { c: "#7A4C08", bg: "#FCF1DE", label: "New" },
  reviewing: { c: "#2D6FD9", bg: "#E6F0FC", label: "Reviewing" },
  accepted: { c: "var(--pos)", bg: "var(--posbg)", label: "Accepted" },
  rejected: { c: "#B3243F", bg: "#FDECEF", label: "Rejected" },
};

export default function ApplicationsScreen({ applications }: { applications: App[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tempPwd, setTempPwd] = useState<{ email: string; pwd: string } | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("open");

  function decide(id: string, decision: "accepted" | "rejected" | "reviewing") {
    setError("");
    start(async () => {
      const res = await reviewApplicationAction(id, decision, notes[id] || undefined);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function makeAccount(app: App) {
    setError("");
    start(async () => {
      const res = await createAccountForApplicationAction(app.id);
      if (res.error) setError(res.error);
      else if (res.tempPassword) {
        setTempPwd({ email: app.email, pwd: res.tempPassword });
        router.refresh();
      }
    });
  }

  const shown = applications.filter((a) =>
    filter === "open" ? a.status === "new" || a.status === "reviewing" : filter === "all" ? true : a.status === filter,
  );

  return (
    <div className="pf-screen pf-w1180">
      {tempPwd ? (
        <div style={{ marginBottom: 16, background: "#FCF1DE", border: "1px solid #F2DBB4", borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: "#7A4C08" }}>Account created for {tempPwd.email}</div>
          <div style={{ fontSize: 13, color: "#7A4C08", marginTop: 4 }}>
            Temporary password: <code style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 14, background: "#fff", padding: "2px 8px", borderRadius: 6 }}>{tempPwd.pwd}</code>
            {" "}— share it privately (e.g. WhatsApp). Shown once; she changes it on first login.
          </div>
        </div>
      ) : null}
      {error ? (
        <div style={{ marginBottom: 14, fontSize: 12.5, color: "#B3243F", background: "#FDECEF", borderRadius: 10, padding: "9px 13px" }}>{error}</div>
      ) : null}

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          ["open", "Open"],
          ["accepted", "Accepted"],
          ["rejected", "Rejected"],
          ["all", "All"],
        ].map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={filter === k ? "pf-btn-grad" : "pf-btn-soft"}
            style={{ padding: "7px 15px", borderRadius: 20, fontSize: 12.5, cursor: "pointer" }}
          >
            {lbl}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: "var(--muted)", alignSelf: "center" }}>{shown.length} shown</span>
      </div>

      {shown.length === 0 ? (
        <div className="pf-card" style={{ padding: 32, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
          No applications here. New ones arrive from the public Apply page and from sign-ups.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shown.map((a) => {
            const st = STATUS_STYLE[a.status] ?? STATUS_STYLE.new;
            return (
              <div key={a.id} className="pf-card" style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 800, fontSize: 14.5 }}>
                      {a.name}
                      <span style={{ fontWeight: 600, color: "var(--faint)", fontSize: 12.5 }}>
                        {" "}· {a.role === "partner" ? `Partner${a.org ? ` — ${a.org}` : ""}` : `Learner${a.track ? ` — Track ${a.track}` : ""}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                      {a.email}
                      {a.phone ? ` · ${a.phone}` : ""}
                      {a.city ? ` · ${a.city}` : ""} · applied {new Date(a.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: st.c, background: st.bg, padding: "4px 11px", borderRadius: 20 }}>{st.label}</span>
                  {a.hasAccount ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand1)", background: "#F1EAFC", padding: "4px 11px", borderRadius: 20 }}>
                      Has account
                    </span>
                  ) : null}
                </div>

                {a.motivation ? (
                  <div style={{ fontSize: 13, color: "var(--ink)", background: "#FBFAFE", borderRadius: 9, padding: "10px 13px", marginTop: 10, lineHeight: 1.55 }}>
                    {a.motivation}
                  </div>
                ) : null}
                {a.reviewNote ? (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Note: {a.reviewNote}{a.reviewedByName ? ` — ${a.reviewedByName}` : ""}</div>
                ) : null}

                {a.status === "new" || a.status === "reviewing" ? (
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
                    <input
                      placeholder="Internal note / message to applicant (optional)…"
                      value={notes[a.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))}
                      style={{ flex: 1, minWidth: 220, border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px", fontSize: 12.5 }}
                    />
                    <button className="pf-btn-grad" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending} onClick={() => decide(a.id, "accepted")}>
                      Accept ✓
                    </button>
                    {a.status === "new" ? (
                      <button className="pf-btn-soft" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer" }} disabled={pending} onClick={() => decide(a.id, "reviewing")}>
                        Mark reviewing
                      </button>
                    ) : null}
                    <button
                      className="pf-btn-soft"
                      style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5, cursor: "pointer", color: "#B3243F" }}
                      disabled={pending}
                      onClick={() => decide(a.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : a.status === "accepted" && !a.hasAccount ? (
                  <div style={{ display: "flex", gap: 9, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                    <button className="pf-btn-grad" style={{ padding: "9px 16px", borderRadius: 9, fontSize: 12.5 }} disabled={pending} onClick={() => makeAccount(a)}>
                      Create account (temp password)
                    </button>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      …or she signs up herself at /signup with this email and becomes a student automatically.
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
