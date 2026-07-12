"use client";

import { useState } from "react";

type Props = {
  // Path (relative) to the public share page, e.g. "/badge/abc123".
  sharePath: string;
  // Prefilled text (without the URL — the URL is appended where supported).
  text: string;
  // Optional path to a downloadable image (relative), e.g. "/badge/abc123/opengraph-image".
  imagePath?: string;
  downloadName?: string;
};

function absolute(path: string): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

const ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.57-2.3 3.2V21h-4z" />
    </svg>
  ),
  x: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3zM17.7 20.2h1.7L7.4 3.7H5.6z" />
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.8 14.2c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42a1.07 1.07 0 01.77-.36c.19 0 .39 0 .55.01.18.01.42-.07.65.5.24.58.82 2.01.9 2.16.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.57.16.28.72 1.18 1.55 1.92 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.1 1.55.73 1.82.86.27.14.44.21.5.32.07.11.07.63-.17 1.31z" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.75-1.6 1.5V12h2.8l-.45 2.9h-2.35v7A10 10 0 0022 12z" />
    </svg>
  ),
};

// Self-contained styles so the panel looks right on standalone pages
// (the /badge and /certificates routes don't load platform.css).
const softBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 9,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  color: "#4B4463",
  background: "#fff",
  border: "1px solid #E4DCF3",
};
const gradBtn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 9,
  fontSize: 12.5,
  fontWeight: 700,
  color: "#fff",
  background: "linear-gradient(135deg,#7C3AED,#9333EA)",
  border: "none",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const BTN: { key: string; label: string; color: string; href: (u: string, t: string) => string }[] = [
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2", href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { key: "x", label: "X", color: "#000000", href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
  { key: "facebook", label: "Facebook", color: "#1877F2", href: (u, t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}&quote=${encodeURIComponent(t)}` },
];

export default function SharePanel({ sharePath, text, imagePath, downloadName }: Props) {
  const [copied, setCopied] = useState<"" | "link" | "text">("");

  async function copy(what: "link" | "text") {
    const value = what === "link" ? absolute(sharePath) : `${text} ${absolute(sharePath)}`;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {BTN.map((b) => (
          <button
            key={b.key}
            onClick={() => window.open(b.href(absolute(sharePath), text), "_blank", "noopener,width=640,height=680")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12.5,
              fontFamily: "inherit",
              background: b.color,
            }}
          >
            {ICONS[b.key]}
            {b.label}
          </button>
        ))}
      </div>

      {/* editable prefilled text */}
      <div style={{ position: "relative" }}>
        <textarea
          readOnly
          value={text}
          rows={3}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            width: "100%",
            border: "1px solid #E4DCF3",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 12.5,
            fontFamily: "inherit",
            resize: "vertical",
            background: "#FBFAFF",
            color: "#2A2340",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => copy("link")} style={softBtn}>
          {copied === "link" ? "Link copied ✓" : "Copy link"}
        </button>
        <button onClick={() => copy("text")} style={softBtn}>
          {copied === "text" ? "Copied ✓" : "Copy text + link"}
        </button>
        {imagePath ? (
          <a href={imagePath} download={downloadName ?? "techascend-badge.png"} style={gradBtn}>
            Download image ↓
          </a>
        ) : null}
      </div>
    </div>
  );
}
