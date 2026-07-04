import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getPartnerOverview } from "@/lib/queries";
import { formatFcfa, initialsOf } from "@/lib/constants";
import PartnerNotice from "@/components/platform/screens/PartnerNotice";

const FALLBACK_BG = "linear-gradient(135deg,#7C3AED,#D6336C)";

const STAGE_TINT: Record<string, { color: string; bg: string }> = {
  Shortlisted: { color: "var(--brand1)", bg: "#f4edfc" },
  Interview: { color: "var(--warn)", bg: "var(--warnbg)" },
  Offer: { color: "var(--brand2)", bg: "#f1eafc" },
  Hired: { color: "var(--pos)", bg: "var(--posbg)" },
};

export default async function PartnerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.partnerId) return <PartnerNotice title="Partner overview" />;

  const { org, impact, talentCount } = await getPartnerOverview(user.partnerId);
  if (!org) return <PartnerNotice title="Partner overview" />;

  const totalInterests = org.opportunities.reduce((s, o) => s + o._count.interests, 0);

  const stats = [
    { value: String(org.opportunities.length), label: "Your opportunities" },
    { value: String(totalInterests), label: "Student interests" },
    { value: String(org.pipelineCards.length), label: "In your pipeline" },
    { value: String(talentCount), label: "Talent pool profiles" },
  ];

  const impactStrip = [
    { value: String(impact.students), label: "Women in training" },
    { value: String(impact.visApproved), label: "Verified profiles" },
    { value: String(impact.badges), label: "Badges awarded" },
    { value: String(impact.certs), label: "Certificates" },
    { value: `${impact.avgProgress}%`, label: "Avg progress" },
    { value: String(impact.hired), label: "Hired via partners" },
  ];

  return (
    <div className="pf-screen pf-w1180">
      {/* org header */}
      <div className="pf-partner-hero">
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, opacity: 0.7 }}>
            PARTNER ORGANISATION
          </div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 24, marginTop: 4 }}>
            {org.name}
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 6 }}>
            <span
              style={{
                background: "rgba(255,255,255,0.14)",
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 11.5,
                textTransform: "capitalize",
              }}
            >
              {org.type} partner
            </span>
            {org.contribution ? <span style={{ marginLeft: 10 }}>{org.contribution}</span> : null}
          </div>
        </div>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: "center", minWidth: 90 }}>
            <div className="pf-partner-stat-v">{s.value}</div>
            <div className="pf-partner-stat-l">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pf-partner-grid">
        <div className="pf-col">
          {/* opportunities */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="pf-h">Your opportunities</div>
              <Link href="/opportunities" className="pf-link">Manage opportunities →</Link>
            </div>
            {org.opportunities.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                You haven&apos;t posted any opportunities yet —{" "}
                <Link href="/opportunities" className="pf-link">post your first one →</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {org.opportunities.map((o) => (
                  <Link
                    key={o.id}
                    href="/opportunities"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {o.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "capitalize" }}>
                        {o.type}
                        {o.pay ? ` · ${o.pay}` : ""}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 20,
                        color: o.status === "open" ? "var(--pos)" : "var(--muted)",
                        background: o.status === "open" ? "var(--posbg)" : "var(--bg)",
                        textTransform: "capitalize",
                        flexShrink: 0,
                      }}
                    >
                      {o.status}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--brand1)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {o._count.interests} interested
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* impact strip */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="pf-h">Platform impact</div>
              <Link href="/impact" className="pf-link">Full impact report →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10 }}>
              {impactStrip.map((s) => (
                <div key={s.label} style={{ textAlign: "center", background: "var(--bg)", borderRadius: 10, padding: "12px 6px" }}>
                  <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 18 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pf-col">
          {/* pipeline mini list */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="pf-h">Your pipeline</div>
              <Link href="/hiring-pipeline" className="pf-link">Open board →</Link>
            </div>
            {org.pipelineCards.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                No one in your pipeline yet —{" "}
                <Link href="/talent-pool" className="pf-link">browse the Talent Pool →</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {org.pipelineCards.map((c) => {
                  const tint = STAGE_TINT[c.stage] ?? STAGE_TINT.Shortlisted;
                  return (
                    <div key={c.id} className="pf-pipe-person">
                      <div className="pf-pipe-av" style={{ background: c.user.avatarBg ?? FALLBACK_BG }}>
                        {c.user.initials ?? initialsOf(c.user.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.user.name}
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 20,
                          color: tint.color,
                          background: tint.bg,
                          flexShrink: 0,
                        }}
                      >
                        {c.stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ledger mini list */}
          {org.ledgerEntries.length > 0 ? (
            <div className="pf-card pf-pad">
              <div className="pf-h" style={{ marginBottom: 12 }}>Recent contributions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {org.ledgerEntries.map((e) => (
                  <div
                    key={e.id}
                    style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--line)" }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand1)", textTransform: "capitalize", flexShrink: 0 }}>
                      {e.kind}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--font-sora)", flexShrink: 0 }}>
                      {formatFcfa(e.amount)}
                    </span>
                    {e.note ? (
                      <span style={{ fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.note}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
