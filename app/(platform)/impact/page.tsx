import { redirect } from "next/navigation";
import { getCurrentUser, getImpactData } from "@/lib/queries";
import { formatFcfa } from "@/lib/constants";

export default async function ImpactPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const impact = await getImpactData();

  const cards = [
    { label: "Women in training", value: `${impact.students}`, sub: "active students on the platform" },
    { label: "Visibility-verified profiles", value: `${impact.visApproved}`, sub: "six-platform identities reviewed" },
    { label: "Badges awarded", value: `${impact.badges}`, sub: "auto-issued on phase completion" },
    { label: "Certificates issued", value: `${impact.certs}`, sub: "publicly verifiable" },
    { label: "Average progress", value: `${impact.avgProgress}%`, sub: "across all students" },
    { label: "Hired via partners", value: `${impact.hired}`, sub: "pipeline stage: Hired" },
  ];

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        All numbers are live from the platform — nothing is estimated.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: 16 }}>
        {cards.map((c) => (
          <div key={c.label} className="pf-card-2 pf-stat">
            <div className="pf-stat-value">{c.value}</div>
            <div className="pf-stat-label">{c.label}</div>
            <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 3 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="pf-card pf-pad">
        <div className="pf-h" style={{ marginBottom: 6 }}>Paid to students so far</div>
        <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 30, color: "var(--pos)" }}>
          {formatFcfa(impact.paidToStudents)}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
          Recorded payouts from real gigs, freelance work and placements — verified in the program ledger.
        </div>
      </div>
    </div>
  );
}
