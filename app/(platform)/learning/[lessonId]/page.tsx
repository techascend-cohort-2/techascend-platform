import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getLessonForUser } from "@/lib/queries";
import Markdown from "@/components/platform/Markdown";
import LessonComplete from "@/components/platform/LessonComplete";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { lessonId } = await params;
  const data = await getLessonForUser(lessonId, user.id);
  if (!data) notFound();

  const { lesson, completed, prev, next } = data;
  const objectives = Array.isArray(lesson.objectives) ? (lesson.objectives as string[]) : [];

  return (
    <div className="pf-screen" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* breadcrumb */}
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
        <Link href="/learning" className="pf-link">My Learning</Link>
        {" · "}
        {lesson.module.phase.name}
        {" · "}
        {lesson.module.title}
      </div>

      <div className="pf-card" style={{ padding: "28px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 23, letterSpacing: -0.4, flex: 1, minWidth: 240 }}>
            {lesson.title}
          </h1>
          {completed ? (
            <span style={{ fontSize: 11.5, fontWeight: 800, color: "var(--pos)", background: "var(--posbg)", padding: "4px 11px", borderRadius: 20 }}>
              ✓ Completed
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
          {lesson.duration ? `${lesson.duration} · ` : ""}
          {lesson.type === "task" ? "Hands-on task" : lesson.type === "video" ? "Video lesson" : lesson.type === "quiz" ? "Quiz" : "Guided lesson"}
        </div>

        {objectives.length > 0 ? (
          <div style={{ marginTop: 18, background: "#F8F5FE", border: "1px solid #EDE6FA", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4, color: "var(--brand1)", marginBottom: 8 }}>
              YOU&apos;LL LEARN TO
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {objectives.map((o) => (
                <li key={o} style={{ fontSize: 13.5, margin: "4px 0", lineHeight: 1.5 }}>{o}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div style={{ marginTop: 8 }}>
          {lesson.content ? (
            <Markdown text={lesson.content} />
          ) : (
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 16 }}>
              This lesson is delivered in the live session — check <Link href="/events" className="pf-link">Events</Link> for the schedule.
            </p>
          )}
        </div>

        {/* tutor callout */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 13,
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "13px 16px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg,#7C3AED,#D6336C)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
            </svg>
          </div>
          <div style={{ flex: 1, fontSize: 13, color: "var(--muted)" }}>
            Stuck, curious, or want to be quizzed? The AI Tutor knows this lesson.
          </div>
          <Link href="/tutor" className="pf-btn-soft" style={{ padding: "9px 15px", borderRadius: 10, fontSize: 12.5, whiteSpace: "nowrap" }}>
            Ask the AI Tutor
          </Link>
        </div>

        {/* completion + nav */}
        <div style={{ marginTop: 22, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          {user.role === "student" ? (
            <LessonComplete
              lessonId={lesson.id}
              completed={completed}
              nextHref={next ? `/learning/${next.id}` : null}
            />
          ) : (
            <div style={{ fontSize: 12.5, color: "var(--faint)" }}>
              Viewing as {user.role} — progress tracking is for students.
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, gap: 10, flexWrap: "wrap" }}>
            {prev ? (
              <Link href={`/learning/${prev.id}`} className="pf-link" style={{ fontSize: 13 }}>
                ← {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learning/${next.id}`} className="pf-link" style={{ fontSize: 13 }}>
                {next.title} →
              </Link>
            ) : (
              <Link href="/learning" className="pf-link" style={{ fontSize: 13 }}>
                Back to curriculum →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
