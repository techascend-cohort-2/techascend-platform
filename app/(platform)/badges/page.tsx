import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser, getBadgesData } from "@/lib/queries";
import { ICON } from "@/lib/platformData";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { earned, locked, certificates } = await getBadgesData(user.id);

  return (
    <div className="pf-screen pf-w1180">
      {/* earned */}
      <div className="pf-card pf-pad" style={{ marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>Earned badges</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>
          Badges issue automatically when you complete each phase. Share them on LinkedIn and X.
        </div>
        {earned.length === 0 ? (
          <div style={{ fontSize: 13.5, color: "var(--muted)" }}>
            Complete <b>Phase 1 — Visibility</b> to earn your first badge: finish its lessons in{" "}
            <Link href="/learning" className="pf-link">My Learning</Link> and submit your six links in{" "}
            <Link href="/profile" className="pf-link">My Profile</Link>.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {earned.map((ub) => (
              <div key={ub.id} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 18, textAlign: "center" }}>
                <div
                  style={{
                    width: 54, height: 54, margin: "0 auto 10px", borderRadius: 16,
                    display: "grid", placeItems: "center", color: "#fff",
                    background: ub.badge.tint ?? "var(--brand1)",
                  }}
                >
                  <Icon path={ub.badge.iconPath ?? ICON.award} size={26} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 14 }}>{ub.badge.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>
                  {ub.badge.phase?.name ?? "Program"} · {dateFmt.format(ub.earnedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* locked */}
      {locked.length > 0 ? (
        <div className="pf-card pf-pad" style={{ marginBottom: 16 }}>
          <div className="pf-h" style={{ marginBottom: 14 }}>Still ahead</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {locked.map((b) => (
              <div key={b.id} style={{ border: "1px dashed var(--line)", borderRadius: 14, padding: 18, textAlign: "center", opacity: 0.55 }}>
                <div style={{ width: 54, height: 54, margin: "0 auto 10px", borderRadius: 16, display: "grid", placeItems: "center", color: "var(--faint)", background: "#F0EDF7" }}>
                  <Icon path={b.iconPath ?? ICON.award} size={26} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{b.phase?.name ?? "Complete all phases"}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* certificates */}
      <div className="pf-card pf-pad">
        <div className="pf-h" style={{ marginBottom: 4 }}>Certificates</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
          Every certificate has a public verification link you can put on LinkedIn or a CV.
        </div>
        {certificates.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Certificates are auto-issued when you complete each phase.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {certificates.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid var(--line)", borderRadius: 11, padding: "12px 15px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>Issued {dateFmt.format(c.issuedAt)}</div>
                </div>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "#F4F1FA", border: "1px solid #E7E1F2", padding: "3px 9px", borderRadius: 6 }}>
                  {c.code}
                </code>
                <Link href={`/certificates/${c.code}`} target="_blank" className="pf-btn-soft" style={{ padding: "8px 14px", borderRadius: 9, fontSize: 12.5 }}>
                  View & share ↗
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
