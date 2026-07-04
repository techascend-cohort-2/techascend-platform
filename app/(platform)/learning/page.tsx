import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getLearningTree } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

const TYPE_META: Record<string, { label: string; tint: string; bg: string }> = {
  ai: { label: "Lesson", tint: "#7C3AED", bg: "#F1EAFC" },
  task: { label: "Task", tint: "#1F9D6B", bg: "#E6F6EF" },
  video: { label: "Video", tint: "#2D6FD9", bg: "#E6F0FC" },
  quiz: { label: "Quiz", tint: "#C97A0E", bg: "#FCF1DE" },
};

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { tree, doneSet, current, visibility } = await getLearningTree(user.id, user.track);
  const trackLabel = user.track ? TRACK_LABELS[user.track] : "Your track";

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>
            {trackLabel}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            Five phases · badges and certificates issue automatically as you complete each one.
          </div>
        </div>
        {current ? (
          <Link href={`/learning/${current.lessonId}`} className="pf-btn-grad" style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13 }}>
            Continue where you left off →
          </Link>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tree.map(({ phase, totalLessons, completedLessons, pct }) => {
          const complete = pct === 100 && totalLessons > 0;
          const isCurrent = current
            ? phase.modules.some((m) => m.lessons.some((l) => l.id === current.lessonId))
            : false;
          return (
            <div key={phase.id} className="pf-card" style={{ padding: 22, borderColor: isCurrent ? "var(--brand1)" : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16.5 }}>{phase.name}</span>
                    {complete ? (
                      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--pos)", background: "var(--posbg)", padding: "3px 9px", borderRadius: 20 }}>
                        ✓ Complete
                      </span>
                    ) : isCurrent ? (
                      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--brand1)", background: "#F1EAFC", padding: "3px 9px", borderRadius: 20 }}>
                        In progress
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, maxWidth: 660, lineHeight: 1.5 }}>
                    {phase.description}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 4 }}>
                    {phase.startsAt ? `${dateFmt.format(phase.startsAt)}${phase.endsAt ? ` – ${dateFmt.format(phase.endsAt)}` : ""}` : ""}
                    {phase.badge ? ` · earns the ${phase.badge.name} + certificate` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 130 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                    {completedLessons}/{totalLessons} lessons
                  </div>
                  <div className="pf-progress" style={{ width: 130 }}>
                    <div style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              {phase.requiresVisibilityApproval ? (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12.5,
                    padding: "9px 13px",
                    borderRadius: 10,
                    background: visibility?.status === "approved" ? "var(--posbg)" : "#FCF1DE",
                    color: visibility?.status === "approved" ? "#14543A" : "#7A4C08",
                  }}
                >
                  {visibility?.status === "approved" ? (
                    "✓ Visibility submission approved."
                  ) : visibility?.status === "pending" ? (
                    "Your six profile links are with the review team."
                  ) : visibility?.status === "changes_requested" ? (
                    <>
                      Changes requested on your links — fix them in{" "}
                      <Link href="/profile" className="pf-link">My Profile</Link>.
                    </>
                  ) : (
                    <>
                      This phase also requires submitting your six profile links in{" "}
                      <Link href="/profile" className="pf-link">My Profile</Link>.
                    </>
                  )}
                </div>
              ) : null}

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                {phase.modules.map((mod) => (
                  <div key={mod.id}>
                    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: "var(--faint)", marginBottom: 8 }}>
                      {mod.title.toUpperCase()}
                      {mod.track !== "ALL" ? ` · TRACK ${mod.track}` : ""}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {mod.lessons.map((lesson) => {
                        const done = doneSet.has(lesson.id);
                        const isNow = current?.lessonId === lesson.id;
                        const tm = TYPE_META[lesson.type] ?? TYPE_META.ai;
                        return (
                          <Link
                            key={lesson.id}
                            href={`/learning/${lesson.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 11,
                              padding: "9px 12px",
                              borderRadius: 10,
                              border: `1px solid ${isNow ? "var(--brand1)" : "var(--line)"}`,
                              background: done ? "#FBFAFE" : "#fff",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                                background: done ? "var(--pos)" : "#EFEBF7",
                                color: done ? "#fff" : "var(--faint)",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {done ? "✓" : ""}
                            </span>
                            <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, opacity: done ? 0.7 : 1 }}>
                              {lesson.title}
                            </span>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: tm.tint, background: tm.bg, padding: "2px 8px", borderRadius: 20 }}>
                              {tm.label}
                            </span>
                            {lesson.duration ? (
                              <span style={{ fontSize: 11.5, color: "var(--faint)", width: 48, textAlign: "right" }}>{lesson.duration}</span>
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {phase.modules.length === 0 ? (
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Content for this phase is being prepared.</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
