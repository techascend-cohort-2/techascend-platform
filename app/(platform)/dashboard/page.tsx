import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser, getStudentDashboard } from "@/lib/queries";
import { ICON } from "@/lib/platformData";

const eventFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

export default async function DashboardPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  const { user, progressPct, stats, currentPhase, currentLesson, upcomingEvents, trackLabel } =
    await getStudentDashboard(sessionUser.id);

  const firstName = user.name.split(" ")[0];
  const continueHref = currentLesson ? `/learning/${currentLesson.id}` : "/learning";

  const statCards = [
    {
      label: "Lessons completed",
      value: `${stats.lessonsDone}/${stats.lessonsTotal}`,
      caption: "of the full program",
      iconPath: ICON.book,
      tint: "var(--brand1)",
      tintBg: "#f1eafc",
    },
    {
      label: "Badges earned",
      value: String(stats.badges),
      caption: "one per phase",
      iconPath: ICON.award,
      tint: "var(--warn)",
      tintBg: "var(--warnbg)",
    },
    {
      label: "Certificates",
      value: String(stats.certificates),
      caption: "auto-issued",
      iconPath: ICON.check,
      tint: "var(--pos)",
      tintBg: "var(--posbg)",
    },
    {
      label: "Earned so far",
      value: stats.earnedLabel,
      caption: "from paid work",
      iconPath: ICON.coin,
      tint: "var(--brand2)",
      tintBg: "#f1eafc",
    },
  ];

  return (
    <div className="pf-screen pf-w1180">
      {/* welcome + ring */}
      <div className="pf-dash-top">
        <div className="pf-welcome">
          <div className="pf-welcome-b1" />
          <div className="pf-welcome-b2" />
          <div style={{ position: "relative" }}>
            <div className="pf-welcome-eyebrow">WELCOME BACK</div>
            <div className="pf-welcome-title">{firstName}, keep building.</div>
            <div className="pf-welcome-text">
              {currentLesson ? (
                <>
                  You&apos;re {progressPct}% through the program. Next up:{" "}
                  <b>&ldquo;{currentLesson.title}&rdquo;</b> in {currentLesson.module.title}.
                </>
              ) : (
                <>You&apos;re all caught up — check Projects and Opportunities.</>
              )}
            </div>
            <div className="pf-welcome-actions">
              <Link href={continueHref} className="pf-btn-white solid">
                Continue learning
              </Link>
              <Link href="/tutor" className="ghost">
                Ask AI Tutor
              </Link>
            </div>
          </div>
        </div>

        <div className="pf-ring-card">
          <div
            className="pf-ring"
            style={{
              background: `conic-gradient(var(--brand2) 0 ${progressPct}%, #efe9f8 ${progressPct}% 100%)`,
            }}
          >
            <div className="pf-ring-inner">
              <div className="pf-ring-pct">{progressPct}%</div>
              <div className="pf-ring-lbl">Program complete</div>
            </div>
          </div>
          <div className="pf-ring-cap">
            {trackLabel}
            <br />
            <b style={{ color: "var(--ink)" }}>{user.cohort?.name ?? "No cohort yet"}</b>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="pf-stats">
        {statCards.map((s) => (
          <div key={s.label} className="pf-card-2 pf-stat">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="pf-stat-icon" style={{ background: s.tintBg, color: s.tint }}>
                <Icon path={s.iconPath} size={17} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)" }}>{s.caption}</span>
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

            {currentPhase ? (
              <>
                <div style={{ fontSize: 11.5, color: "var(--brand1)", fontWeight: 700, letterSpacing: 0.3 }}>
                  {currentPhase.phase.name.toUpperCase()}
                </div>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="pf-progress">
                    <div style={{ width: `${currentPhase.pct}%` }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
                    {currentPhase.completedLessons}/{currentPhase.totalLessons} lessons · {currentPhase.pct}%
                  </span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                Your curriculum will appear here once it&apos;s published.
              </div>
            )}

            {currentLesson ? (
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: 13,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                }}
              >
                <div className="pf-stat-icon" style={{ background: "#f1eafc", color: "var(--brand1)", flexShrink: 0 }}>
                  <Icon path={ICON.book} size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 14.5 }}>
                    {currentLesson.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {currentLesson.module.title}
                    {currentLesson.duration ? ` · ${currentLesson.duration}` : ""}
                  </div>
                </div>
                <Link
                  href={`/learning/${currentLesson.id}`}
                  className="pf-btn-grad"
                  style={{ fontSize: 12.5, padding: "8px 14px", borderRadius: 9 }}
                >
                  Resume
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted)" }}>
                Every lesson is complete —{" "}
                <Link href="/learning" className="pf-link">revisit the curriculum →</Link>
              </div>
            )}
          </div>

          {/* open opportunities */}
          <div className="pf-card pf-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div className="pf-h">Open opportunities</div>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Earn while you learn</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>
                {stats.openOpportunities} open {stats.openOpportunities === 1 ? "opportunity" : "opportunities"}
              </div>
              <Link href="/earn" className="pf-link">Browse the Earn Hub →</Link>
            </div>
          </div>
        </div>

        <div className="pf-col">
          {/* upcoming events */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Upcoming events</div>
            {upcomingEvents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {upcomingEvents.map((e) => (
                  <Link key={e.id} href="/events" className="pf-ms-row">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        className="pf-ms-dot"
                        style={{ background: "var(--brand2)", border: "3px solid #f1eafc" }}
                      />
                      <div className="pf-ms-line" />
                    </div>
                    <div style={{ paddingBottom: 14 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {eventFmt.format(e.startsAt)}
                        {e.location ? ` · ${e.location}` : ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                No upcoming events — new sessions will show up here.
              </div>
            )}
          </div>

          {/* your journey */}
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 14 }}>Your journey</div>
            <div className="pf-pf-stats">
              <div className="pf-pf-stat">
                <div className="pf-pf-stat-v">{stats.badges}</div>
                <div className="pf-pf-stat-l">Badges earned</div>
              </div>
              <div className="pf-pf-stat">
                <div className="pf-pf-stat-v">{stats.certificates}</div>
                <div className="pf-pf-stat-l">Certificates</div>
              </div>
            </div>
            <Link href="/badges" className="pf-soft-btn" style={{ display: "block", textAlign: "center" }}>
              View badges &amp; certificates →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
