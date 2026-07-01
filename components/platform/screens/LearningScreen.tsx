"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useToast } from "@/components/platform/Toast";
import { apiFlow, lessonTabs } from "@/lib/platformData";

const resources = [
  { label: "REST API cheat sheet (PDF)", meta: "1.2 MB" },
  { label: "Postman starter collection", meta: "JSON" },
  { label: "MDN: Using the Fetch API", meta: "External" },
];
const qa = [
  { q: "What's the difference between PUT and PATCH?", a: "PUT replaces the whole resource; PATCH updates only the fields you send." },
  { q: "How do I handle a 401 response?", a: "Refresh or re-request the token, then retry the call once." },
];

type LearningScreenProps = {
  lessonPoints: string[];
  lessonTitle: string | null;
  moduleTitle: string | null;
};

export default function LearningScreen({ lessonPoints, lessonTitle, moduleTitle }: LearningScreenProps) {
  const toast = useToast();
  const [tab, setTab] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div className="pf-screen" style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div className="pf-lesson-grid">
        {/* main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--brand1)", fontWeight: 700, letterSpacing: 0.3 }}>
                {moduleTitle ?? "MODULE 4 · API & SYSTEM INTEGRATION"}
              </div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 3 }}>
                {lessonTitle ?? "Lesson 4.3 — Working with REST APIs"}
              </div>
            </div>
            <button
              className="pf-btn-grad pf-mark-btn"
              style={completed ? { background: "var(--pos)" } : undefined}
              onClick={() => {
                setCompleted((c) => !c);
                if (!completed) toast("Lesson marked complete ✓");
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {completed ? "Completed" : "Mark complete"}
            </button>
          </div>

          {/* video / diagram */}
          <div className="pf-video">
            <div className="pf-video-title">
              What is an <span style={{ color: "#C9A8FF" }}>API</span>?
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {apiFlow.map((n) => (
                <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ textAlign: "center" }}>
                    <div className="pf-node">
                      <Icon path={n.iconPath} size={34} strokeWidth={1.5} />
                    </div>
                    <div className="pf-node-lbl">{n.label}</div>
                  </div>
                  {n.arrow ? (
                    <div className="pf-arrow">
                      <span>{n.arrowLabel}</span>
                      <svg width="44" height="12" viewBox="0 0 44 12" fill="none" stroke="#9C8AD0" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M2 6h38M34 2l6 4-6 4" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="pf-video-bar">
              <div className="pf-video-play">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#15102B">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="pf-video-time">4:20 / 12:00</span>
              <div className="pf-video-track">
                <div />
              </div>
            </div>
          </div>

          {/* tabs + content */}
          <div className="pf-card" style={{ overflow: "hidden" }}>
            <div className="pf-tabs">
              {lessonTabs.map((t, i) => (
                <button key={t} className={`pf-tab ${i === tab ? "pf-tab-active" : ""}`} onClick={() => setTab(i)}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ padding: 22 }}>
              {tab === 0 ? (
                <>
                  <div className="pf-h" style={{ marginBottom: 12 }}>In this lesson you&apos;ll learn</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {lessonPoints.map((p) => (
                      <div key={p} className="pf-lp-row">
                        <div className="pf-lp-check">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {tab === 1 ? (
                <>
                  <div className="pf-h" style={{ marginBottom: 12 }}>My notes</div>
                  <textarea
                    className="pf-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down anything you want to remember from this lesson…"
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button className="pf-btn-grad" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13 }} onClick={() => toast("Notes saved ✓")}>
                      Save notes
                    </button>
                  </div>
                </>
              ) : null}

              {tab === 2 ? (
                <>
                  <div className="pf-h" style={{ marginBottom: 12 }}>Resources</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {resources.map((r) => (
                      <button key={r.label} className="pf-resource" onClick={() => toast(`Opening “${r.label}”…`)}>
                        <div className="pf-lp-check" style={{ background: "#F1EAFC", color: "var(--brand1)" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                        </div>
                        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{r.label}</span>
                        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{r.meta}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              {tab === 3 ? (
                <>
                  <div className="pf-h" style={{ marginBottom: 12 }}>Questions &amp; answers</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {qa.map((item) => (
                      <div key={item.q}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 3 }}>{item.q}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{item.a}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/tutor" className="pf-btn-grad" style={{ display: "inline-block", marginTop: 16, padding: "10px 16px", borderRadius: 10, fontSize: 13 }}>
                    Ask the AI Tutor →
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* sidebar */}
        <div className="pf-side">
          <div className="pf-ai-explain">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <div className="pf-chat-icon" style={{ width: 28, height: 28, borderRadius: 9 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 14 }}>AI explains it simply</div>
            </div>
            <div className="pf-ai-explain-text">
              Think of an API like a <b>waiter at a restaurant</b>. You (the client)
              don&apos;t go into the kitchen (the server). You give your order to the
              waiter, who carries it to the kitchen and brings back your food — the{" "}
              <b>response</b>.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <Link href="/tutor" className="pf-chip-dark">Give me an example →</Link>
              <Link href="/tutor" className="pf-chip-dark">Explain in French</Link>
            </div>
          </div>

          {/* code editor */}
          <div className="pf-code">
            <div className="pf-code-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="pf-code-dot" style={{ background: "#FF5F57" }} />
                <span className="pf-code-dot" style={{ background: "#FEBC2E" }} />
                <span className="pf-code-dot" style={{ background: "#28C840" }} />
                <span className="pf-code-file">fetchUsers.js</span>
              </div>
              <button className="pf-code-run" onClick={() => toast("Ran fetchUsers.js → 24 users ✓")}>▶ Run</button>
            </div>
            <pre>
<span style={{ color: "#7C8BB8" }}>{"// Track A · live editor"}</span>{"\n"}
<span style={{ color: "#C792EA" }}>const</span>{" res "}<span style={{ color: "#89DDFF" }}>=</span>{" "}<span style={{ color: "#C792EA" }}>await</span>{" "}<span style={{ color: "#82AAFF" }}>fetch</span>{"(\n  "}<span style={{ color: "#C3E88D" }}>{"'/api/users'"}</span>{"\n)"}<span style={{ color: "#89DDFF" }}>;</span>{"\n"}
<span style={{ color: "#C792EA" }}>const</span>{" data "}<span style={{ color: "#89DDFF" }}>=</span>{" "}<span style={{ color: "#C792EA" }}>await</span>{" res"}<span style={{ color: "#89DDFF" }}>.</span><span style={{ color: "#82AAFF" }}>json</span>{"()"}<span style={{ color: "#89DDFF" }}>;</span>{"\n"}
{"console"}<span style={{ color: "#89DDFF" }}>.</span><span style={{ color: "#82AAFF" }}>log</span>{"(data"}<span style={{ color: "#89DDFF" }}>.</span>{"length)"}<span style={{ color: "#89DDFF" }}>;</span>
            </pre>
            <div className="pf-code-out">→ 24 users fetched ✓</div>
          </div>

          {/* progress */}
          <div className="pf-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 14 }}>Lesson progress</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand1)" }}>4 / 6</span>
            </div>
            <div className="pf-progress" style={{ marginBottom: 14 }}>
              <div style={{ width: "66%" }} />
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", fontWeight: 700, letterSpacing: 0.3, marginBottom: 8 }}>
              UP NEXT
            </div>
            <div className="pf-upnext" onClick={() => toast("Loading lesson 4.4…")}>
              <div className="pf-upnext-n">4.4</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Authentication &amp; API keys</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
