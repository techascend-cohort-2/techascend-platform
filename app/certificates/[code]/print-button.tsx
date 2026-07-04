"use client";

export default function PrintClient() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: "11px 20px",
        borderRadius: 11,
        fontSize: 13.5,
        fontWeight: 700,
        color: "#fff",
        background: "linear-gradient(135deg,#7C3AED,#9333EA)",
        border: "none",
        cursor: "pointer",
      }}
    >
      Print / save as PDF
    </button>
  );
}
