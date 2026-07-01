"use client";

import { useState } from "react";
import { useToast } from "@/components/platform/Toast";

type PartnerScreenProps = {
  pipeline: {
    stage: string;
    count: string;
    people: { name: string; role: string; initials: string; avBg: string }[];
  }[];
  talent: {
    id: string;
    name: string;
    role: string;
    initials: string;
    avBg: string;
    skills: string[];
    score: string;
    projects: string;
  }[];
  impact: { label: string; value: string; pct: string }[];
};

export default function PartnerScreen({ pipeline, talent, impact }: PartnerScreenProps) {
  const toast = useToast();
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  function shortlist(name: string) {
    setShortlisted((s) =>
      s.includes(name) ? s.filter((n) => n !== name) : [...s, name],
    );
    if (!shortlisted.includes(name)) toast(`${name} added to your shortlist ✓`);
  }

  return (
    <div className="pf-screen pf-w1240">
      {/* sponsorship hero */}
      <div className="pf-partner-hero">
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600, letterSpacing: 0.3 }}>
            SPONSORSHIP DASHBOARD
          </div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 24, margin: "5px 0 3px" }}>
            MTN Foundation · Women AI Builders Cohort
          </div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Sponsoring 50 learners · Douala Hub · 2026 H1</div>
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {[
            { v: "3.4×", l: "Social ROI" },
            { v: "82%", l: "Completion" },
            { v: "31", l: "Now earning" },
          ].map((s) => (
            <div key={s.l}>
              <div className="pf-partner-stat-v">{s.v}</div>
              <div className="pf-partner-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pf-partner-grid">
        <div className="pf-col">
          {/* hiring pipeline */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 16 }}>Hiring pipeline</div>
            <div className="pf-pipe">
              {pipeline.map((col) => (
                <div key={col.stage} className="pf-pipe-col">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{col.stage}</span>
                    <span className="pf-pipe-count">{col.count}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {col.people.map((p) => (
                      <button key={p.name} className="pf-pipe-person" onClick={() => toast(`Opening ${p.name}'s profile`)}>
                        <div className="pf-pipe-av" style={{ background: p.avBg }}>{p.initials}</div>
                        <div style={{ minWidth: 0, textAlign: "left" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 10.5, color: "var(--muted)" }}>{p.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* talent pool */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="pf-h">Talent pool</div>
              <button className="pf-link" onClick={() => toast("Loading all 50 candidates…")}>View all 50 →</button>
            </div>
            <div className="pf-talent-grid">
              {talent.map((t) => {
                const isShort = shortlisted.includes(t.name);
                return (
                  <div key={t.id} className="pf-talent">
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                      <div className="pf-talent-av" style={{ background: t.avBg }}>{t.initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.role}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {t.skills.map((sk) => (
                        <span key={sk} className="pf-skill">{sk}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                        ⭐ {t.score} · {t.projects} projects
                      </span>
                      <button
                        className="pf-shortlist"
                        style={isShort ? { background: "var(--posbg)", color: "var(--pos)" } : undefined}
                        onClick={() => shortlist(t.name)}
                      >
                        {isShort ? "Shortlisted ✓" : "Shortlist"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pf-col">
          {/* impact metrics */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Impact metrics</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {impact.map((i) => (
                <div key={i.label}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{i.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--font-sora)" }}>{i.value}</span>
                  </div>
                  <div className="pf-meter">
                    <div style={{ width: i.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSR report */}
          <div className="pf-grad" style={{ padding: 22 }}>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: 0.3 }}>CSR / ESG REPORT</div>
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 18, margin: "6px 0 10px" }}>
              Q2 2026 impact report is ready
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, marginBottom: 16 }}>
              Auto-generated with verified outcomes — women trained, income generated,
              SMEs digitized.
            </div>
            <button
              className="pf-btn-white"
              style={{ padding: "11px 16px", borderRadius: 11, fontSize: 13, width: "100%" }}
              onClick={() => toast("Preparing Q2 2026 impact report (PDF)…")}
            >
              Download report (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
