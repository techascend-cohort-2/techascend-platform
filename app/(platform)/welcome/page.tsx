import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getWelcomeData } from "@/lib/queries";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

const PHASE1_ACCOUNTS = [
  { name: "Professional Gmail", note: "A clean firstname.lastname address for everything below." },
  { name: "GitHub", note: "Where all your code and projects will live." },
  { name: "LinkedIn", note: "Your professional profile and network." },
  { name: "X (Twitter)", note: "Build in public and follow the AI community." },
  { name: "Medium or Substack", note: "Where you'll write about what you learn." },
  { name: "Hugging Face + Kaggle", note: "Your home in the AI and data community." },
];

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: "Received", color: "#8a6d1a", bg: "#fdf3d7" },
    reviewing: { label: "In review", color: "#8a6d1a", bg: "#fdf3d7" },
    accepted: { label: "Accepted", color: "#1F9D6B", bg: "#e6f6ef" },
    rejected: { label: "Not this cohort", color: "#b3341f", bg: "#fdeceb" },
  };
  const s = status ? map[status] : undefined;
  if (!s) return null;
  return (
    <span className="pf-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { application, events, cohort } = await getWelcomeData(user.email);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="pf-screen" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Greeting */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 18 }}>
        <h2 className="pf-title" style={{ fontSize: 22 }}>Welcome, {firstName} 👋</h2>
        <p className="pf-sub" style={{ marginTop: 6, fontSize: 13.5 }}>
          You&apos;ve taken the first step into the TechAscend fellowship — an AI-native
          program for women in tech in Cameroon
          {cohort ? <>, {cohort.name}</> : null}. Here&apos;s where things stand.
        </p>
      </div>

      {/* Application status */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div className="pf-h">Your application</div>
          <StatusBadge status={application?.status ?? null} />
        </div>
        <div style={{ marginTop: 12 }}>
          {!application ? (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
              We don&apos;t have your application details yet.{" "}
              <Link href="/apply" style={{ color: "#7C3AED", fontWeight: 700 }}>
                Complete your application →
              </Link>
            </p>
          ) : application.status === "accepted" ? (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: "#1F9D6B", fontWeight: 600 }}>
              Accepted! You&apos;re in — your student workspace unlocks when onboarding
              completes (you&apos;ll get a notification). If you signed up after
              acceptance you&apos;re already a student.
            </p>
          ) : application.status === "rejected" ? (
            <div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: "#6b6480" }}>
                We couldn&apos;t offer a place this cohort.
              </p>
              {application.reviewNote ? (
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: "8px 0 0", color: "#b3341f" }}>
                  {application.reviewNote}
                </p>
              ) : null}
            </div>
          ) : (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0, color: "#8a6d1a" }}>
              Application received — our team is reviewing it.
            </p>
          )}
        </div>
      </div>

      {/* Phase 1 head start */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 18 }}>
        <div className="pf-h">While you wait — start Phase 1 now</div>
        <p className="pf-sub" style={{ marginTop: 6, fontSize: 13 }}>
          Phase 1 (Visibility) is about building your professional identity. Create
          these six accounts today and you&apos;ll be ahead on day one:
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 10 }}>
          {PHASE1_ACCOUNTS.map((a, i) => (
            <li key={a.name} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#f1eafc",
                  color: "#7C3AED",
                  fontSize: 11.5,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                <strong>{a.name}</strong>
                <span style={{ color: "#6b6480" }}> — {a.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="pf-sub" style={{ marginTop: 14, fontSize: 12.5 }}>
          You&apos;ll submit these links in{" "}
          <Link href="/profile" style={{ color: "#7C3AED", fontWeight: 700 }}>
            My Profile
          </Link>{" "}
          once you&apos;re onboarded.
        </p>
      </div>

      {/* Upcoming events */}
      <div className="pf-card" style={{ padding: 24 }}>
        <div className="pf-h">Upcoming events</div>
        {events.length === 0 ? (
          <p className="pf-sub" style={{ marginTop: 8, fontSize: 13 }}>
            Nothing scheduled yet — we&apos;ll notify you when new sessions are announced.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 12 }}>
            {events.map((e) => (
              <li
                key={e.id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px 12px",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #efeaf7",
                  paddingBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.title}</div>
                  <div style={{ fontSize: 12.5, color: "#6b6480", marginTop: 2 }}>
                    {dateFmt.format(e.startsAt)}
                    {e.location ? <> · {e.location}</> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
