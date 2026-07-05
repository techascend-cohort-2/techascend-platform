import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser, getProjectsForUser } from "@/lib/queries";
import { ICON } from "@/lib/platformData";

const STATUS: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: "Submitted", badgeClass: "pf-badge-neutral" },
  ai_reviewed: { label: "AI reviewed", badgeClass: "pf-badge-brand" },
  mentor_reviewed: { label: "Mentor reviewed", badgeClass: "pf-badge-warn" },
  approved: { label: "Approved ✓", badgeClass: "pf-badge-pos" },
  changes_requested: { label: "Changes requested", badgeClass: "pf-badge-danger" },
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await getProjectsForUser(user.id, user.track);

  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-page-intro">
        <div>
          <div className="pf-eyebrow">Build Studio</div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>
            Projects
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, maxWidth: 640 }}>
            Capstone briefs for your track. Submit your work to get an instant AI evaluation;
            a mentor reviews it after. An accepted capstone completes Phase 4 automatically.
          </div>
        </div>
      </div>

      <div className="pf-proj-list">
        {projects.map((p) => {
          const sub = p.submissions[0];
          const st = sub ? STATUS[sub.status] ?? STATUS.submitted : null;
          return (
            <div key={p.id} className="pf-card pf-proj-card">
              <div className="pf-proj-icon">
                <Icon path={ICON.grid} size={17} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: "var(--brand1)", marginBottom: 6 }}>
                {p.module?.phase?.name?.toUpperCase() ?? "CAPSTONE"}
              </div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>{p.title}</div>
              <div className="pf-proj-desc">{p.description}</div>
              {p.monetizationPotential ? (
                <div style={{ fontSize: 12, background: "var(--posbg)", color: "#14543A", borderRadius: 9, padding: "8px 11px", marginBottom: 12 }}>
                  💡 {p.monetizationPotential}
                </div>
              ) : null}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Link
                  href={`/projects/${p.id}`}
                  className={sub ? "pf-btn-soft" : "pf-btn-grad"}
                  style={{ padding: "10px 16px", borderRadius: 10, fontSize: 12.5, textAlign: "center", flex: 1 }}
                >
                  {sub ? "View / resubmit" : "Start submission →"}
                </Link>
                {st ? (
                  <span className={`pf-badge ${st.badgeClass}`} style={{ whiteSpace: "nowrap" }}>
                    {sub?.aiScore ? `${st.label} · ${sub.aiScore}` : st.label}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {projects.length === 0 ? (
        <div className="pf-card" style={{ padding: 32, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
          Capstone briefs unlock with Phase 4 — Build Studio.
        </div>
      ) : null}
    </div>
  );
}
