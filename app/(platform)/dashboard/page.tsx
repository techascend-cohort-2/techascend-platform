import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import { getCurrentUser, getStudentDashboard } from "@/lib/queries";
import { ICON } from "@/lib/platformData";
import ProjectCelebration from "@/components/platform/ProjectCelebration";

const eventFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "Africa/Douala" });
const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Africa/Douala" });

function timeAgo(iso: Date): string {
  const ms = Date.now() - iso.getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const EVENT_KIND_LABEL: Record<string, string> = {
  live_session: "Live session",
  workshop: "Workshop",
  deadline: "Deadline",
  ceremony: "Ceremony",
  community: "Community",
};

const OPP_TYPE_STYLE: Record<string, { fg: string; bg: string; label: string }> = {
  freelance: { fg: "#7C3AED", bg: "#F1EAFC", label: "Freelance" },
  job: { fg: "#1F9D6B", bg: "#E6F6EF", label: "Job" },
  internship: { fg: "#2D6FD9", bg: "#E6F0FC", label: "Internship" },
  studio: { fg: "#D6336C", bg: "#FCE7F0", label: "Studio" },
  sme: { fg: "#C97A0E", bg: "#FCF1DE", label: "SME" },
};

function DateBadge({ d }: { d: Date }) {
  return (
    <div className="pf-datebadge">
      <b>{dayFmt.format(d)}</b>
      <span>{monthFmt.format(d)}</span>
    </div>
  );
}

export default async function DashboardPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  const {
    user,
    progressPct,
    stats,
    reviewStatus,
    celebrations,
    currentPhase,
    currentPhaseLessons,
    currentLesson,
    upcomingEvents,
    recentPosts,
    openOpportunities,
    trackLabel,
  } = await getStudentDashboard(sessionUser.id);

  const firstName = user.name.split(" ")[0];
  const continueHref = currentLesson ? `/learning/${currentLesson.id}` : "/learning";

  // Review notices — action-needed (amber) first, then under-review (neutral),
  // so a pending review is obvious at login without opening the profile.
  type Notice = { kind: "action" | "review"; text: string; href: string; cta: string };
  const notices: Notice[] = [];
  if (reviewStatus.visibility === "changes_requested") {
    notices.push({ kind: "action", text: "Changes were requested on your visibility submission. Update your six links to move forward.", href: "/profile", cta: "Fix in My Profile" });
  }
  if (reviewStatus.projectsNeedingChanges > 0) {
    notices.push({ kind: "action", text: `Changes were requested on ${reviewStatus.projectsNeedingChanges} project submission${reviewStatus.projectsNeedingChanges === 1 ? "" : "s"}. Read the feedback and resubmit.`, href: "/projects", cta: "View projects" });
  }
  if (reviewStatus.visibility === "pending") {
    notices.push({ kind: "review", text: "Your visibility submission is under review. We'll notify you the moment it's decided.", href: "/profile", cta: "View submission" });
  }
  if (reviewStatus.projectsAwaitingReview > 0) {
    notices.push({ kind: "review", text: `${reviewStatus.projectsAwaitingReview} project submission${reviewStatus.projectsAwaitingReview === 1 ? " is" : "s are"} awaiting mentor review.`, href: "/projects", cta: "View projects" });
  }

  const statCards = [
    {
      label: "Build streak",
      value: `${stats.streak}${stats.streak === 1 ? " day" : " days"}`,
      caption: stats.streak > 0 ? "keep it up" : "start today",
      iconPath: ICON.zap,
      tint: "#C97A0E",
      tintBg: "#FCF1DE",
    },
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
      <ProjectCelebration celebrations={celebrations} />

      {/* review status — bold, so it's caught at a glance on login */}
      {notices.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          {notices.map((n, i) => {
            const action = n.kind === "action";
            return (
              <div key={i} className={`pf-alert ${action ? "pf-alert-action" : "pf-alert-review"}`}>
                <div className="pf-alert-icon">
                  <Icon path={action ? ICON.zap : ICON.clock} size={19} strokeWidth={2.2} />
                </div>
                <div className="pf-alert-body">
                  <div className="pf-alert-title">
                    {action ? <span className="pf-alert-dot" /> : null}
                    {action ? "Action needed" : "Under review"}
                  </div>
                  <div className="pf-alert-text">{n.text}</div>
                </div>
                <Link href={n.href} className="pf-alert-cta">
                  {n.cta} →
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* welcome + ring */}
      <div className="pf-dash-top">
        <div className="pf-welcome">
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
            <div className="pf-today-strip">
              <div>
                <span>Current phase</span>
                <b>{currentPhase?.phase.name ?? "Ready when published"}</b>
              </div>
              <div>
                <span>Next event</span>
                <b>{upcomingEvents[0]?.title ?? "No event scheduled"}</b>
              </div>
              <div>
                <span>Track</span>
                <b>{trackLabel}</b>
              </div>
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
          {/* phase progress */}
          <div className="pf-card pf-pad">
            <div className="pf-section-head">
              <div>
                <div className="pf-eyebrow">Today</div>
                <div className="pf-h">Phase progress</div>
              </div>
              <Link href="/learning" className="pf-link">View curriculum →</Link>
            </div>

            {currentPhase ? (
              <>
                <div style={{ fontSize: 11.5, color: "var(--brand1)", fontWeight: 700, letterSpacing: 0.3 }}>
                  {currentPhase.phase.name.toUpperCase()}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                  {currentPhase.phase.description}
                </div>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="pf-progress">
                    <div style={{ width: `${currentPhase.pct}%` }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
                    {currentPhase.completedLessons}/{currentPhase.totalLessons} lessons · {currentPhase.pct}%
                  </span>
                </div>

                {currentPhaseLessons.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                    {currentPhaseLessons.map((l, i) => (
                      <Link
                        key={l.id}
                        href={`/learning/${l.id}`}
                        className={`pf-lesson-row ${l.status === "done" ? "pf-lesson-done" : ""} ${l.status === "current" ? "pf-lesson-current" : ""}`}
                      >
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            background: l.status === "done" ? "var(--pos)" : "#EFEBF7",
                            color: l.status === "done" ? "#fff" : "var(--faint)",
                            fontSize: 10.5,
                            fontWeight: 800,
                          }}
                        >
                          {l.status === "done" ? "✓" : i + 1}
                        </span>
                        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, opacity: l.status === "done" ? 0.7 : 1 }}>
                          {l.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            color: l.status === "done" ? "var(--pos)" : l.status === "current" ? "var(--brand1)" : "var(--faint)",
                            background: l.status === "done" ? "var(--posbg)" : l.status === "current" ? "#F1EAFC" : "#F3F1F8",
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          {l.status === "done" ? "Completed" : l.status === "current" ? "In progress" : "Upcoming"}
                        </span>
                        {l.duration ? (
                          <span style={{ fontSize: 11.5, color: "var(--faint)", width: 40, textAlign: "right" }}>{l.duration}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                Your curriculum will appear here once it&apos;s published.
              </div>
            )}
          </div>

          {/* next lesson */}
          {currentLesson ? (
            <div className="pf-card pf-pad">
              <div className="pf-eyebrow">Next lesson</div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 700, fontSize: 16, marginTop: 4 }}>
                {currentLesson.title}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                {currentLesson.module.title}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {currentLesson.duration ? (
                  <span className="pf-badge pf-badge-neutral">{currentLesson.duration}</span>
                ) : null}
                <span className="pf-badge pf-badge-brand" style={{ textTransform: "capitalize" }}>
                  {currentLesson.type}
                </span>
              </div>
              <Link
                href={`/learning/${currentLesson.id}`}
                className="pf-btn-grad"
                style={{ display: "inline-block", marginTop: 14, fontSize: 13, padding: "10px 18px", borderRadius: 10 }}
              >
                Continue lesson →
              </Link>
            </div>
          ) : null}

          {/* community activity */}
          <div className="pf-card pf-pad">
            <div className="pf-section-head" style={{ marginBottom: 4 }}>
              <div>
                <div className="pf-eyebrow">Connect</div>
                <div className="pf-h">Community activity</div>
              </div>
              <Link href="/community" className="pf-link">View all →</Link>
            </div>
            {recentPosts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {recentPosts.map((p) => (
                  <div key={p.id} style={{ display: "flex", gap: 10, padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 12,
                        background: p.author.avatarBg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
                      }}
                    >
                      {p.author.initials ?? "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {p.author.name}
                        <span style={{ fontWeight: 500, color: "var(--faint)", marginLeft: 6, fontSize: 11.5 }}>
                          {timeAgo(p.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                        {p.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                No posts yet — be the first to share something in Community.
              </div>
            )}
          </div>
        </div>

        <div className="pf-col">
          {/* opportunities */}
          <div className="pf-card pf-pad">
            <div className="pf-section-head" style={{ marginBottom: 4 }}>
              <div>
                <div className="pf-eyebrow">Career</div>
                <div className="pf-h">Opportunities</div>
              </div>
              <Link href="/earn" className="pf-link">All →</Link>
            </div>
            {openOpportunities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {openOpportunities.map((o) => {
                  const ts = OPP_TYPE_STYLE[o.type] ?? { fg: "var(--brand1)", bg: "#F1EAFC", label: o.type };
                  return (
                    <Link
                      key={o.id}
                      href="/earn"
                      style={{
                        display: "block",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: 10,
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{o.title}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: ts.fg, background: ts.bg, padding: "2px 8px", borderRadius: 20 }}>
                          {ts.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>
                        {o.partner?.name ?? "TechAscend"}
                        {o.location ? ` · ${o.location}` : ""}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                No open opportunities right now — check back soon.
              </div>
            )}
          </div>

          {/* upcoming events */}
          <div className="pf-card pf-pad">
            <div className="pf-eyebrow">Calendar</div>
            <div className="pf-h" style={{ marginBottom: 14 }}>Upcoming events</div>
            {upcomingEvents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcomingEvents.map((e) => (
                  <Link
                    key={e.id}
                    href="/events"
                    style={{ display: "flex", alignItems: "center", gap: 12, color: "inherit", textDecoration: "none" }}
                  >
                    <DateBadge d={e.startsAt} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {eventFmt.format(e.startsAt)} WAT{e.location ? ` · ${e.location}` : ""}
                      </div>
                    </div>
                    <span className="pf-badge pf-badge-neutral" style={{ flexShrink: 0 }}>
                      {EVENT_KIND_LABEL[e.kind] ?? e.kind}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                No upcoming events — new sessions will show up here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* keep going banner */}
      <div className="pf-keepgoing" style={{ marginTop: 16 }}>
        <div>
          <div className="pf-keepgoing-title">Keep going, {firstName}!</div>
          <div className="pf-keepgoing-sub">You&apos;re building real momentum — here&apos;s your proof of work so far.</div>
        </div>
        <div className="pf-keepgoing-stats">
          <div className="pf-keepgoing-stat">
            <b>{stats.lessonsDone}</b>
            <span>Lessons completed</span>
          </div>
          <div className="pf-keepgoing-stat">
            <b>{stats.projectsSubmitted}</b>
            <span>Projects submitted</span>
          </div>
          <div className="pf-keepgoing-stat">
            <b>{stats.badges}</b>
            <span>Badges earned</span>
          </div>
        </div>
        <Link href="/learning" className="pf-keepgoing-cta">
          View my progress →
        </Link>
      </div>
    </div>
  );
}
