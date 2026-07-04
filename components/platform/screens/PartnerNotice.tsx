// Shown on partner-suite pages when the signed-in account has no partner org.
export default function PartnerNotice({ title }: { title: string }) {
  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-title" style={{ marginBottom: 16 }}>{title}</div>
      <div className="pf-card pf-pad" style={{ textAlign: "center", padding: 40 }}>
        <div className="pf-h" style={{ marginBottom: 8 }}>No partner organisation linked</div>
        <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 420, margin: "0 auto" }}>
          Your account isn&apos;t linked to a partner organisation yet — ask a TechAscend admin to
          link it.
        </div>
      </div>
    </div>
  );
}
