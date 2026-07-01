import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser, getStudentDashboard } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { stats, incomeTasks, milestones, currentModule, portfolio } =
    await getStudentDashboard(user.id);

  const firstName = user.name.split(" ")[0];
  const trackLabel = user.track ? TRACK_LABELS[user.track] ?? "Your track" : "Your track";
  const moduleTitle = currentModule?.title ?? "your current module";

  return (
    <div className="pf-screen pf-w1180">
      {/* welcome + ring */}
      <div className="pf-dash-top">
        <div className="pf-welcome">
          <div className="pf-welcome-b1" />
          <div className="pf-welcome-b2" />
          <div style={{ position: "relative" }}>
            <div className="pf-welcome-eyebrow">WELCOME BACK</div>
            <div className="pf-welcome-title">{firstName}, you&apos;re on a roll.</div>
            <div className="pf-welcome-text">
              You&apos;re {user.progressPercentage}% through <b>{moduleTitle}</b>.
              Finish 2 lessons to unlock your next income task.
            </div>
            <div className="pf-welcome-actions">
              <Link href="/learning" className="pf-btn-white solid">
                Continue learning
              </Link>
              <Link href="/tutor" className="ghost">
                Ask AI Tutor
              </Link>
            </div>
          </div>
        </div>

        <div className="pf-ring-card">
          <div className="pf-ring">
            <div className="pf-ring-inner">
              <div className="pf-ring-pct">{user.progressPercentage}%</div>
              <div className="pf-ring-lbl">Track complete</div>
            </div>
          </div>
          <div className="pf-ring-cap">
            {trackLabel}
            <br />
            <b style={{ color: "var(--ink)" }}>{user.cohort?.name ?? "Cohort 01"}</b>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="pf-stats">
        {stats.map((s) => (
          <div key={s.label} className="pf-card-2 pf-stat">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="pf-stat-icon" style={{ background: s.tintBg, color: s.tint }}>
                <Icon path={s.iconPath} size={17} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.deltaColor }}>{s.delta}</span>
            </div>
            <div className="pf-stat-value">{s.value}</div>
            <div className="pf-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* main grid */}
      <div className="pf-dash-grid">
        <div className="pf-col">
          {/* continue learning */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="pf-h">Continue learning</div>
              <Link href="/learning" className="pf-link">View curriculum →</Link>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div className="pf-cl-thumb">
                <div className="pf-play">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--brand1)">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="pf-cl-time">14:20</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: "var(--brand1)", fontWeight: 700, letterSpacing: 0.3 }}>
                  {(currentModule ? `MODULE ${currentModule.orderIndex}` : "MODULE 4")} · LESSON 4.3
                </div>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16, margin: "4px 0 2px" }}>
                  Working with REST APIs
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>
                  Request/response cycle, HTTP methods, status codes, and testing endpoints with AI assistance.
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="pf-progress">
                    <div style={{ width: `${user.progressPercentage}%` }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
                    {user.progressPercentage}%
                  </span>
                  <Link
                    href="/learning"
                    className="pf-btn-grad"
                    style={{ fontSize: 12.5, padding: "8px 14px", borderRadius: 9 }}
                  >
                    Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* income tasks */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div className="pf-h">Income tasks</div>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Earn while you learn</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
              AI-matched paid opportunities based on the skills you&apos;ve shipped.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {incomeTasks.map((t) => (
                <Link key={t.id} href="/earn" className="pf-task-row">
                  <div className="pf-task-glyph" style={{ background: t.tintBg, color: t.tint }}>
                    {t.glyph}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.meta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--pos)" }}>{t.pay}</div>
                    <div style={{ fontSize: 11, color: "var(--faint)" }}>{t.match} match</div>
                  </div>
                </Link>
              ))}
              {incomeTasks.length === 0 ? (
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>No matched tasks yet — keep shipping!</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pf-col">
          {/* milestones */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Upcoming milestones</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {milestones.map((m) => (
                <div key={m.title} className="pf-ms-row">
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="pf-ms-dot" style={{ background: m.dotBg, border: `3px solid ${m.dotBorder}` }} />
                    <div className="pf-ms-line" />
                  </div>
                  <div style={{ paddingBottom: 14 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* portfolio */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Your portfolio</div>
            <div className="pf-pf-stats">
              <div className="pf-pf-stat">
                <div className="pf-pf-stat-v">{portfolio.projectsShipped}</div>
                <div className="pf-pf-stat-l">Projects shipped</div>
              </div>
              <div className="pf-pf-stat">
                <div className="pf-pf-stat-v">{portfolio.earnedShort}</div>
                <div className="pf-pf-stat-l">FCFA earned</div>
              </div>
            </div>
            <Link href="/projects" className="pf-soft-btn" style={{ display: "block", textAlign: "center" }}>
              Submit a new project →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
