import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getProjectsForUser } from "@/lib/queries";

const STATUS: Record<string, { label: string; c: string; bg: string }> = {
  submitted: { label: "Submitted", c: "#2D6FD9", bg: "#E6F0FC" },
  ai_reviewed: { label: "AI reviewed", c: "#7C3AED", bg: "#F1EAFC" },
  mentor_reviewed: { label: "Mentor reviewed", c: "#C97A0E", bg: "#FCF1DE" },
  approved: { label: "Approved ✓", c: "var(--pos)", bg: "var(--posbg)" },
  changes_requested: { label: "Changes requested", c: "#B3243F", bg: "#FDECEF" },
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await getProjectsForUser(user.id, user.track);

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        Capstone briefs for your track. Submit your work to get an instant AI evaluation;
        a mentor reviews it after. An accepted capstone completes Phase 4 automatically.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {projects.map((p) => {
          const sub = p.submissions[0];
          const st = sub ? STATUS[sub.status] ?? STATUS.submitted : null;
          return (
            <div key={p.id} className="pf-card" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: "var(--brand1)", marginBottom: 6 }}>
                {p.module?.phase?.name?.toUpperCase() ?? "CAPSTONE"}
              </div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", margin: "8px 0 10px", lineHeight: 1.55, flex: 1 }}>
                {p.description}
              </div>
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
                  <span style={{ fontSize: 11, fontWeight: 800, color: st.c, background: st.bg, padding: "5px 11px", borderRadius: 20, whiteSpace: "nowrap" }}>
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
