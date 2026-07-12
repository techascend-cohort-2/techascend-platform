"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { markProjectsCelebratedAction, markVisibilityCelebratedAction } from "@/lib/actions/program";

export type Celebration =
  | { kind: "visibility"; id: string }
  | { kind: "project"; id: string; title: string; score: number | null };

const COLORS = ["#7C3AED", "#1F9D6B", "#F59E0B", "#2D6FD9", "#D6336C", "#22C55E"];

function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;
  type P = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; size: number; color: string; shape: number };
  // Burst from the two bottom-ish corners + a top sprinkle.
  const parts: P[] = Array.from({ length: 160 }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? W() * 0.1 : W() * 0.9,
      y: H() * 0.35 + Math.random() * H() * 0.2,
      vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 6),
      vy: -(6 + Math.random() * 9),
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 7,
      color: COLORS[i % COLORS.length],
      shape: Math.random() < 0.5 ? 0 : 1,
    };
  });

  const start = performance.now();
  const DURATION = 3800;
  let raf = 0;

  function frame(now: number) {
    const elapsed = now - start;
    ctx!.clearRect(0, 0, W(), H());
    const fade = elapsed > DURATION - 800 ? Math.max(0, (DURATION - elapsed) / 800) : 1;
    for (const p of parts) {
      p.vy += 0.22; // gravity
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx!.save();
      ctx!.globalAlpha = fade;
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.fillStyle = p.color;
      if (p.shape === 0) ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }
    if (elapsed < DURATION) raf = requestAnimationFrame(frame);
    else ctx!.clearRect(0, 0, W(), H());
  }
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    ctx.clearRect(0, 0, W(), H());
  };
}

export default function ProjectCelebration({ celebrations }: { celebrations: Celebration[] }) {
  const [open, setOpen] = useState(celebrations.length > 0);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || celebrations.length === 0) return;
    // Mark seen immediately so it only ever fires once, however they leave.
    const projectIds = celebrations.filter((c) => c.kind === "project").map((c) => c.id);
    if (projectIds.length) void markProjectsCelebratedAction(projectIds);
    for (const c of celebrations) if (c.kind === "visibility") void markVisibilityCelebratedAction(c.id);
    const cleanup = canvasRef.current ? launchConfetti(canvasRef.current) : undefined;
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted || !open || celebrations.length === 0) return null;

  const hasVisibility = celebrations.some((c) => c.kind === "visibility");
  const wins = celebrations.map((c) =>
    c.kind === "visibility"
      ? { emoji: "🏅", title: "Visibility phase approved", sub: "You've earned your Visibility Badge and certificate." }
      : {
          emoji: "🚀",
          title: `“${c.title}” passed review`,
          sub: c.score != null ? `Approved with a mentor score of ${c.score}/100.` : "Approved by a mentor.",
        },
  );
  const cta = hasVisibility
    ? { href: "/badges", label: "See my badges →" }
    : { href: "/projects", label: "See feedback →" };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "grid",
        placeItems: "center",
        background: "rgba(16, 37, 31, 0.55)",
        backdropFilter: "blur(2px)",
        padding: 20,
      }}
      onClick={() => setOpen(false)}
    >
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", width: "100vw", height: "100vh" }} />
      <div
        className="pf-celebrate-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 460,
          width: "100%",
          background: "var(--card)",
          borderRadius: 20,
          padding: "34px 30px 28px",
          textAlign: "center",
          boxShadow: "0 30px 70px -20px rgba(16, 37, 31, 0.6)",
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1 }}>🎉</div>
        <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 24, letterSpacing: -0.5, marginTop: 12 }}>
          Congratulations!
        </div>
        <div style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.6, marginTop: 8 }}>
          {wins.length > 1 ? "Great news while you were away — here's what got approved:" : "Amazing work — here's what just got approved:"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, textAlign: "left" }}>
          {wins.map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: "var(--posbg)",
              }}
            >
              <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{w.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#14543A" }}>{w.title}</div>
                <div style={{ fontSize: 12.5, color: "#2C6A4F", lineHeight: 1.45 }}>{w.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          <Link href={cta.href} className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13.5 }}>
            {cta.label}
          </Link>
          <button
            className="pf-btn-soft"
            style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13.5, cursor: "pointer" }}
            onClick={() => setOpen(false)}
          >
            Keep building
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
