"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addLedgerEntryAction, deleteLedgerEntryAction, type ActionState } from "@/lib/actions/staff";
import { LEDGER_KINDS, formatFcfa } from "@/lib/constants";

export type LedgerRow = {
  id: string;
  kind: string;
  amount: number;
  note: string | null;
  occurredAt: string;
  partnerName: string | null;
  userName: string | null;
  createdByName: string | null;
};

const KIND_STYLE: Record<string, { c: string; bg: string }> = {
  sponsorship: { c: "#7C3AED", bg: "#F1EAFC" },
  revenue: { c: "#1F9D6B", bg: "#E6F6EF" },
  payout: { c: "#2D6FD9", bg: "#E6F0FC" },
  expense: { c: "#B3243F", bg: "#FDECEF" },
};

const inp: React.CSSProperties = {
  border: "1px solid var(--line)", borderRadius: 9, padding: "9px 12px",
  fontSize: 13, fontFamily: "inherit", background: "#fff",
};
const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 800, color: "var(--faint)", margin: "0 0 4px", letterSpacing: 0.3 };

export default function RevenueScreen({
  entries,
  partners,
  students,
  totals,
}: {
  entries: LedgerRow[];
  partners: { id: string; name: string }[];
  students: { id: string; name: string }[];
  totals: { sponsorship: number; revenue: number; payout: number; expense: number; net: number };
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await addLedgerEntryAction(prev, fd);
      if (res.ok) router.refresh();
      return res;
    },
    {},
  );

  const stat = (label: string, v: number, color?: string) => (
    <div className="pf-card-2 pf-stat" key={label}>
      <div className="pf-stat-value" style={{ color }}>{formatFcfa(v)}</div>
      <div className="pf-stat-label">{label}</div>
    </div>
  );

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {stat("Sponsorship", totals.sponsorship)}
        {stat("Revenue", totals.revenue)}
        {stat("Payouts to students", totals.payout)}
        {stat("Expenses", totals.expense)}
        {stat("Net", totals.net, totals.net >= 0 ? "var(--pos)" : "#B3243F")}
      </div>

      <form className="pf-card" style={{ padding: 18, marginBottom: 16 }} action={action}>
        <div className="pf-h" style={{ marginBottom: 12 }}>Record entry</div>
        <div style={{ display: "grid", gridTemplateColumns: "130px 140px 1fr 170px 170px 140px auto", gap: 10, alignItems: "end" }}>
          <div>
            <label style={lbl}>Kind</label>
            <select style={{ ...inp, width: "100%" }} name="kind" defaultValue="sponsorship">
              {LEDGER_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Amount (F)</label>
            <input style={{ ...inp, width: "100%" }} name="amount" type="number" min={1} required placeholder="50000" />
          </div>
          <div>
            <label style={lbl}>Note</label>
            <input style={{ ...inp, width: "100%" }} name="note" placeholder="What is this entry for?" />
          </div>
          <div>
            <label style={lbl}>Partner (optional)</label>
            <select style={{ ...inp, width: "100%" }} name="partnerId" defaultValue="">
              <option value="">—</option>
              {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Student (for payouts)</label>
            <select style={{ ...inp, width: "100%" }} name="userId" defaultValue="">
              <option value="">—</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Date</label>
            <input style={{ ...inp, width: "100%" }} name="occurredAt" type="date" />
          </div>
          <button className="pf-btn-grad" style={{ padding: "10px 18px", borderRadius: 10, fontSize: 12.5 }} disabled={pending}>
            {pending ? "Saving…" : "Record"}
          </button>
        </div>
        {state.error ? <div style={{ marginTop: 10, fontSize: 12.5, color: "#B3243F" }}>{state.error}</div> : null}
      </form>

      <div className="pf-card" style={{ padding: 18 }}>
        <div className="pf-h" style={{ marginBottom: 12 }}>Ledger</div>
        {entries.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            No financial entries yet. Record sponsorships, revenue, payouts and expenses here — this is the real ledger.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((e) => {
              const ks = KIND_STYLE[e.kind] ?? KIND_STYLE.revenue;
              const negative = e.kind === "payout" || e.kind === "expense";
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--faint)", width: 84 }}>{new Date(e.occurredAt).toLocaleDateString("en-GB")}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: ks.c, background: ks.bg, padding: "3px 9px", borderRadius: 14 }}>{e.kind}</span>
                  <span style={{ fontWeight: 800, fontSize: 13.5, width: 110, color: negative ? "#B3243F" : "var(--pos)" }}>
                    {negative ? "−" : "+"}{formatFcfa(e.amount)}
                  </span>
                  <span style={{ flex: 1, minWidth: 160, fontSize: 12.5 }}>
                    {e.note ?? "—"}
                    <span style={{ color: "var(--faint)" }}>
                      {e.partnerName ? ` · ${e.partnerName}` : ""}
                      {e.userName ? ` · ${e.userName}` : ""}
                    </span>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>{e.createdByName ?? ""}</span>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#B3243F", fontSize: 12 }}
                    onClick={() => {
                      if (confirm("Delete this ledger entry?")) {
                        start(async () => {
                          await deleteLedgerEntryAction(e.id);
                          router.refresh();
                        });
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
