import { redirect } from "next/navigation";
import { getCurrentUser, getTalentPool } from "@/lib/queries";
import { TRACK_LABELS, initialsOf } from "@/lib/constants";
import PartnerNotice from "@/components/platform/screens/PartnerNotice";
import ShortlistButton from "@/components/platform/screens/ShortlistButton";

const FALLBACK_BG = "linear-gradient(135deg,#7C3AED,#D6336C)";

export default async function TalentPoolPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.partnerId) return <PartnerNotice title="Talent Pool" />;

  const students = await getTalentPool();

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div className="pf-title">Talent Pool</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
          {students.length} verified {students.length === 1 ? "profile" : "profiles"} · every
          student here opted in to be visible
        </div>
      </div>

      {students.length === 0 ? (
        <div className="pf-card pf-pad" style={{ textAlign: "center", padding: 40 }}>
          <div className="pf-h" style={{ marginBottom: 6 }}>Nothing here yet</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            No students have opted into the talent pool yet.
          </div>
        </div>
      ) : (
        <div className="pf-card pf-pad">
          <div className="pf-talent-grid">
            {students.map((s) => {
              const links = [
                { label: "GitHub", href: s.githubUrl },
                { label: "LinkedIn", href: s.linkedinUrl },
                { label: "Portfolio", href: s.portfolioUrl },
              ].filter((l): l is { label: string; href: string } => Boolean(l.href));
              return (
                <div key={s.id} className="pf-talent">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                    <div className="pf-talent-av" style={{ background: s.avatarBg ?? FALLBACK_BG }}>
                      {s.initials ?? initialsOf(s.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.title ?? s.cohort?.name ?? "TechAscend student"}
                      </div>
                    </div>
                    <ShortlistButton studentId={s.id} />
                  </div>

                  {s.track ? (
                    <div style={{ marginTop: 10 }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "var(--brand1)",
                          background: "#f4edfc",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        {TRACK_LABELS[s.track] ?? s.track}
                      </span>
                    </div>
                  ) : null}

                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="pf-progress" style={{ flex: 1 }}>
                      <div style={{ width: `${s.progressPercentage}%` }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", flexShrink: 0 }}>
                      {s.progressPercentage}%
                    </span>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "var(--muted)" }}>
                    <span>
                      <b style={{ color: "var(--ink)" }}>{s._count.userBadges}</b>{" "}
                      {s._count.userBadges === 1 ? "badge" : "badges"}
                    </span>
                    <span>
                      <b style={{ color: "var(--ink)" }}>{s._count.submissions}</b>{" "}
                      {s._count.submissions === 1 ? "submission" : "submissions"}
                    </span>
                  </div>

                  {links.length > 0 ? (
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "var(--muted)",
                            border: "1px solid var(--line)",
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
