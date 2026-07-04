import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        background: "#faf8ff",
        color: "#1b1530",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "2px",
          color: "#7C3AED",
          marginBottom: 14,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "clamp(30px, 5vw, 46px)",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          margin: "0 0 12px",
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 16, color: "#6b6480", maxWidth: 420, lineHeight: 1.6, margin: "0 0 28px" }}>
        No worries — the page you&apos;re looking for has moved or never existed.
        Your journey with TechAscend is still right on track.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            background: "#7C3AED",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
        <Link
          href="/login"
          style={{
            background: "#fff",
            color: "#7C3AED",
            border: "1px solid #ddd0f3",
            fontWeight: 700,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
