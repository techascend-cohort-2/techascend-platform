"use client";

import { useState } from "react";
import { useToast } from "@/components/platform/Toast";
import { earnKpis, gigs, smeGigs, earnTrend, payouts } from "@/lib/platformData";

const badgeClass: Record<string, string> = {
  pos: "pf-badge-pos",
  warn: "pf-badge-warn",
};

export default function EarnPage() {
  const toast = useToast();
  const [applied, setApplied] = useState<string[]>([]);

  function apply(title: string) {
    if (applied.includes(title)) return;
    setApplied((a) => [...a, title]);
    toast(`Applied to “${title}” ✓`);
  }

  return (
    <div className="pf-screen pf-w1240">
      <div className="pf-kpis">
        {earnKpis.map((k) => (
          <div key={k.label} className="pf-card-2 pf-kpi">
            <div className="pf-kpi-label">{k.label}</div>
            <div className="pf-kpi-value" style={{ fontSize: 26 }}>{k.value}</div>
            <div className="pf-kpi-delta" style={{ color: k.color }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="pf-earn-grid">
        <div className="pf-col">
          {/* AI-matched gigs */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
              <div className="pf-chat-icon" style={{ width: 26, height: 26, borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
                </svg>
              </div>
              <div className="pf-h">AI-matched for your skills</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>
              Paid work matched to the projects you&apos;ve actually shipped — apply in
              one tap.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {gigs.map((g) => {
                const isApplied = applied.includes(g.title);
                return (
                  <div key={g.title} className="pf-gig-row">
                    <div className="pf-gig-glyph" style={{ background: g.tintBg, color: g.tint }}>{g.glyph}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", margin: "1px 0 6px" }}>{g.type}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {g.skills.map((sk) => (
                          <span key={sk} className="pf-skill">{sk}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--pos)" }}>{g.pay}</div>
                      <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 8 }}>{g.match} match</div>
                      <button
                        className="pf-apply"
                        style={isApplied ? { background: "var(--posbg)", color: "var(--pos)" } : undefined}
                        onClick={() => apply(g.title)}
                      >
                        {isApplied ? "Applied ✓" : "Apply"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* local SME gigs */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="pf-h">Local business gigs</div>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>SMEs near you</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {smeGigs.map((s) => (
                <div key={s.name} className="pf-sme">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div className="pf-sme-abbr">{s.abbr}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>📍 {s.loc}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink)", marginBottom: 10 }}>{s.need}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pos)" }}>{s.pay}</span>
                    <button className="pf-link" style={{ fontSize: 11.5 }} onClick={() => toast(`Opening brief: ${s.name}`)}>
                      View brief →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pf-col">
          {/* earnings tracker */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="pf-h">Earnings tracker</div>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>6 months · FCFA</span>
            </div>
            <div className="pf-earn-bars">
              {earnTrend.map((b) => (
                <div key={b.m} className="pf-earn-col">
                  <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>{b.amt}</span>
                  <div className="pf-earn-bar" style={{ height: b.h }} />
                  <span style={{ fontSize: 10.5, color: "var(--faint)", fontWeight: 600 }}>{b.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* payout history */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Payout history</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {payouts.map((p) => (
                <div key={p.title} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.date}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{p.amount}</div>
                    <span className={`pf-badge-sm ${badgeClass[p.tone]}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* balance */}
          <div className="pf-grad" style={{ padding: 22 }}>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: 0.3 }}>AVAILABLE BALANCE</div>
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 30, margin: "4px 0 14px" }}>
              195,000 F
            </div>
            <button
              className="pf-btn-white"
              style={{ padding: "12px 16px", borderRadius: 11, fontSize: 13, width: "100%" }}
              onClick={() => toast("Withdrawal of 195,000 F requested via Mobile Money 📲")}
            >
              Withdraw via Mobile Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
