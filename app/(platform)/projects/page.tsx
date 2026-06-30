import { projectSteps, deliverables, rubric } from "@/lib/platformData";

export default function ProjectPage() {
  return (
    <div className="pf-screen pf-w1180">
      {/* header + stepper */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>
            Submit Project
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            AI Customer Support Agent · Module 4 capstone
          </div>
        </div>
        <div className="pf-stepper">
          {projectSteps.map((s, i) => (
            <div key={s.n} className="pf-step">
              <div className={`pf-step-dot ${s.active ? "pf-step-dot-active" : ""}`}>{s.n}</div>
              <span className={`pf-step-text ${s.active ? "pf-step-text-active" : ""}`}>{s.label}</span>
              {i < projectSteps.length - 1 ? <div className="pf-step-line" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="pf-proj-grid">
        {/* upload */}
        <div className="pf-card" style={{ padding: 22 }}>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16 }}>Upload deliverables</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 18px" }}>
            Submit the required files. The AI evaluator reviews each as you upload.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {deliverables.map((d) => (
              <div key={d.title} className="pf-deliv-row">
                <div className="pf-deliv-ext" style={{ background: d.tintBg, color: d.tint }}>
                  {d.ext}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.file}</div>
                </div>
                <div className="pf-deliv-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
            ))}
            <div className="pf-dropzone">
              <div className="pf-dropzone-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Upload additional files</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Drag &amp; drop or click to browse · max 50MB
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="pf-btn-soft" style={{ flex: 1, padding: 12, borderRadius: 11, fontSize: 13 }}>
              Back
            </button>
            <button className="pf-btn-grad" style={{ flex: 2, padding: 12, borderRadius: 11, fontSize: 13 }}>
              Submit for final review →
            </button>
          </div>
        </div>

        {/* evaluation column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="pf-grad" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, opacity: 0.92 }}>AI EVALUATION</span>
            </div>
            <div className="pf-eval-score">
              <div className="pf-eval-num">87</div>
              <div style={{ fontSize: 16, opacity: 0.7, marginBottom: 6 }}>/ 100</div>
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
              Strong submission — ready for mentor review.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 18 }}>
              {rubric.map((r) => (
                <div key={r.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ opacity: 0.9 }}>{r.label}</span>
                    <span style={{ fontWeight: 700 }}>{r.score}</span>
                  </div>
                  <div className="pf-eval-bar">
                    <div style={{ width: r.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pf-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
              <div className="pf-mentor-av">MN</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Mentor feedback</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Mary Ndi · Senior Engineer</div>
              </div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink)" }}>
              Excellent prompt handling and clean error states. Add retry logic for
              failed API calls and you&apos;re at production quality. 👏
            </div>
          </div>

          <div className="pf-monet">
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pos)", letterSpacing: 0.3, marginBottom: 7 }}>
              💡 MONETIZATION SUGGESTION
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: "#14543A" }}>
              This agent solves a real SME pain point. Package it as a{" "}
              <b>WhatsApp support bot</b> and offer it to 3 local shops at 35,000
              FCFA/month each.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
