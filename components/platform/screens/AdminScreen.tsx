"use client";

import { useToast } from "@/components/platform/Toast";

type AdminScreenProps = {
  kpis: { label: string; value: string; delta: string; color: string }[];
  cohorts: { name: string; track: string; learners: string; pct: string; status: string; tone: "pos" | "warn" | "brand" }[];
  enrollBars: { label: string; h1: string; h2: string }[];
  riskList: { name: string; reason: string; initials: string; avBg: string; risk: string; tone: string }[];
  partnerMini: { abbr: string; name: string; type: string; value: string }[];
};

const badgeClass: Record<string, string> = {
  pos: "pf-badge-pos",
  warn: "pf-badge-warn",
  brand: "pf-badge-brand",
  danger: "pf-badge-danger",
};

export default function AdminScreen({ kpis, cohorts, enrollBars, riskList, partnerMini }: AdminScreenProps) {
  const toast = useToast();

  return (
    <div className="pf-screen pf-w1240">
      <div className="pf-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="pf-card-2 pf-kpi">
            <div className="pf-kpi-label">{k.label}</div>
            <div className="pf-kpi-value">{k.value}</div>
            <div className="pf-kpi-delta" style={{ color: k.color }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="pf-admin-grid">
        <div className="pf-col">
          {/* enrollment chart */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="pf-h">Enrollment &amp; completion</div>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Last 6 cohorts</span>
            </div>
            <div className="pf-bars">
              {enrollBars.map((b) => (
                <div key={b.label} className="pf-bar-col">
                  <div className="pf-bar-stack">
                    <div className="pf-bar-2" style={{ height: b.h2 }} />
                    <div className="pf-bar-1" style={{ height: b.h1 }} />
                  </div>
                  <span className="pf-bar-lbl">{b.label}</span>
                </div>
              ))}
            </div>
            <div className="pf-legend">
              <div className="pf-legend-item">
                <span className="pf-legend-sw" style={{ background: "linear-gradient(180deg,var(--brand1),var(--brand2))" }} />
                Completed
              </div>
              <div className="pf-legend-item">
                <span className="pf-legend-sw" style={{ background: "#E7DCFA" }} />
                Enrolled
              </div>
            </div>
          </div>

          {/* cohort table */}
          <div className="pf-card" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px" }}>
              <div className="pf-h">Cohort management</div>
              <button className="pf-link" style={{ fontSize: 12 }} onClick={() => toast("Opening new cohort wizard…")}>
                + New cohort
              </button>
            </div>
            <div className="pf-table-head">
              <span>COHORT</span>
              <span>TRACK</span>
              <span>LEARNERS</span>
              <span>PROGRESS</span>
              <span>STATUS</span>
            </div>
            {cohorts.map((c) => (
              <div
                key={c.name}
                className="pf-table-row pf-clickrow"
                onClick={() => toast(`Opening ${c.name}`)}
              >
                <span style={{ fontWeight: 700 }}>{c.name}</span>
                <span style={{ color: "var(--muted)" }}>{c.track}</span>
                <span style={{ color: "var(--muted)" }}>{c.learners}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="pf-table-progress">
                    <div style={{ width: c.pct }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>{c.pct}</span>
                </div>
                <span className={`pf-badge ${badgeClass[c.tone]}`} style={{ justifySelf: "start" }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-col">
          {/* dropout risk */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div className="pf-risk-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                </svg>
              </div>
              <div className="pf-h">Dropout risk</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
              AI flags learners needing outreach.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {riskList.map((r) => (
                <button key={r.name} className="pf-list-btn" onClick={() => toast(`Outreach sent to ${r.name} 📩`)}>
                  <div className="pf-risk-av" style={{ background: r.avBg }}>{r.initials}</div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{r.reason}</div>
                  </div>
                  <span className={`pf-badge-sm ${badgeClass[r.tone]}`}>{r.risk}</span>
                </button>
              ))}
            </div>
          </div>

          {/* partner overview */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Partner overview</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {partnerMini.map((p) => (
                <button key={p.name} className="pf-list-btn" onClick={() => toast(`Opening ${p.name}`)}>
                  <div className="pf-pmini-abbr">{p.abbr}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.type}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)" }}>{p.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
