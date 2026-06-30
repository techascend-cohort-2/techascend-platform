"use client";

import { useState, useRef, useEffect } from "react";
import {
  seedMessages,
  tutorReply,
  chatHistory,
  tutorChips,
  type ChatMessage,
} from "@/lib/platformData";

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: tutorReply }]);
    setInput("");
  }

  return (
    <div className="pf-screen" style={{ maxWidth: 1180, margin: "0 auto", height: "calc(100vh - 122px)" }}>
      <div className="pf-tutor-grid">
        {/* history sidebar */}
        <div className="pf-card pf-tutor-side">
          <button className="pf-btn-grad pf-newchat" onClick={() => setMessages(seedMessages)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: 0.3, marginBottom: 8 }}>
            RECENT
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {chatHistory.map((c, i) => (
              <div key={c} className={`pf-hist-item ${i === 0 ? "pf-hist-active" : ""}`}>
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* chat */}
        <div className="pf-card pf-chat">
          <div className="pf-chat-head">
            <div className="pf-chat-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 15 }}>TechAscend AI Tutor</div>
              <div className="pf-ctx">
                <span className="pf-ctx-dot" />
                Context: Lesson 4.3 · REST APIs
              </div>
            </div>
          </div>

          <div className="pf-msgs" ref={scrollRef}>
            {messages.map((m, i) => {
              const isBot = m.role === "bot";
              return (
                <div key={i} className={isBot ? "pf-msg-bot" : "pf-msg-user"}>
                  {isBot ? (
                    <div className="pf-msg-av">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
                      </svg>
                    </div>
                  ) : null}
                  <div className={isBot ? "pf-bubble-bot" : "pf-bubble-user"}>{m.text}</div>
                </div>
              );
            })}
          </div>

          <div className="pf-chat-foot">
            <div style={{ display: "flex", gap: 7, marginBottom: 11, flexWrap: "wrap" }}>
              {tutorChips.map((ch) => (
                <span key={ch.label} className="pf-chip" onClick={() => send(ch.send)}>
                  {ch.label}
                </span>
              ))}
            </div>
            <div className="pf-chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Ask anything about this lesson…"
              />
              <button className="pf-send" onClick={() => send()} aria-label="Send">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
