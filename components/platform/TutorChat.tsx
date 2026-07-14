"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { tutorChips } from "@/lib/platformData";

type Msg = { role: "bot" | "user"; text: string };

export default function TutorChat({
  initialMessages,
  chatHistory,
  lessonId,
  lessonTitle,
  hasAiKey,
}: {
  initialMessages: Msg[];
  chatHistory: string[];
  lessonId: string | null;
  lessonTitle: string | null;
  hasAiKey: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);

    // Build history from prior turns for context.
    const history = messages.map((m) => ({
      role: m.role === "bot" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    }));
    // First student message of this conversation → start a fresh sticky session.
    const newChat = messages.every((m) => m.role !== "user");

    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: "" }]);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lessonId, history, newChat }),
      });
      if (res.status === 412) {
        const body = await res.json().catch(() => null);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "bot",
            text: body?.message ?? "Add an AI API key in My Profile to start using the AI Tutor — the Gemini key is free.",
          };
          return copy;
        });
        return;
      }
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "Request failed"));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "bot", text: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "bot", text: "Sorry — I couldn't reach the tutor. Please try again." };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pf-screen" style={{ maxWidth: 1180, margin: "0 auto", height: "calc(100vh - 122px)" }}>
      <div className="pf-tutor-grid">
        <div className="pf-card pf-tutor-side">
          <button
            className="pf-btn-grad pf-newchat"
            onClick={() => setMessages(initialMessages.slice(0, 1))}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: 0.3, marginBottom: 8 }}>
            RECENT
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {(chatHistory.length ? chatHistory : ["Ask your first question…"]).map((c, i) => (
              <button
                key={`${c}-${i}`}
                className={`pf-hist-item ${i === 0 ? "pf-hist-active" : ""}`}
                onClick={() => send(c)}
                disabled={busy || !chatHistory.length}
                style={{ textAlign: "left", background: "none", border: "none", cursor: chatHistory.length ? "pointer" : "default", font: "inherit", color: "inherit" }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

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
                {lessonTitle ? `Context: ${lessonTitle}` : "Context-aware help"}
              </div>
            </div>
          </div>

          {!hasAiKey ? (
            <div
              style={{
                margin: "0 18px",
                marginTop: 14,
                padding: "14px 16px",
                borderRadius: 12,
                background: "var(--warnbg)",
                border: "1px solid #F2DBB4",
                color: "#7A4C08",
                fontSize: 12.5,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 4 }}>
                One quick step before your first chat: add your AI key
              </div>
              <div style={{ lineHeight: 1.6, marginBottom: 10 }}>
                The AI Tutor runs on your own API key, so your chats are never rate-limited by other students. The{" "}
                <b>Gemini key is free</b> (about a minute to get, no card needed) — you can also add Claude or OpenAI
                keys, and the tutor automatically switches keys if one runs out.
              </div>
              <Link href="/profile#ai-keys" className="pf-btn-grad" style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12.5 }}>
                Add your key in My Profile →
              </Link>
            </div>
          ) : null}

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
                  <div className={isBot ? "pf-bubble-bot" : "pf-bubble-user"} style={{ whiteSpace: "pre-wrap" }}>
                    {m.text || (isBot && busy ? "…" : "")}
                  </div>
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
                disabled={busy}
              />
              <button className="pf-send" onClick={() => send()} aria-label="Send" disabled={busy}>
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
