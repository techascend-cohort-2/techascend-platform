import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getAdminOverview } from "@/lib/queries";
import { formatFcfa } from "@/lib/constants";

const eventFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { kpis, cohorts, upcomingEvents } = await getAdminOverview();

  const cards = [
    { label: "Students", value: `${kpis.students}`, href: "/students", sub: "active fellows" },
    { label: "Applications", value: `${kpis.pendingApps}`, href: "/applications", sub: "awaiting decision", hot: kpis.pendingApps > 0 },
    { label: "Reviews pending", value: `${kpis.pendingReviews}`, href: "/reviews", sub: "visibility + projects", hot: kpis.pendingReviews > 0 },
    { label: "Average progress", value: `${kpis.avgProgress}%`, href: "/students", sub: "across all students" },
    { label: "Badges awarded", value: `${kpis.badgesAwarded}`, href: "/badges", sub: "auto-issued — view recipients" },
    { label: "Certificates", value: `${kpis.certsIssued}`, href: "/badges", sub: "auto-issued — view recipients" },
    { label: "Income recorded", value: formatFcfa(kpis.income), href: "/revenue", sub: "sponsorship + revenue" },
    { label: "Paid to students", value: formatFcfa(kpis.paidOut), href: "/revenue", sub: "payouts" },
  ];

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="pf-card-2 pf-stat" style={{ textDecoration: "none", color: "inherit", borderColor: c.hot ? "var(--brand1)" : undefined }}>
            <div className="pf-stat-value" style={{ color: c.hot ? "var(--brand1)" : undefined }}>{c.value}</div>
            <div className="pf-stat-label">{c.label}</div>
            <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 3 }}>{c.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="pf-card pf-pad">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="pf-h">Cohorts</div>
            <Link href="/cohorts" className="pf-link">Manage →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cohorts.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.hub ?? ""}{c.hub ? " · " : ""}{c.status}</div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800 }}>{c._count.users}</span>
                <span style={{ fontSize: 11.5, color: "var(--faint)" }}>members</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/curriculum" className="pf-link" style={{ fontSize: 12.5 }}>Edit curriculum →</Link>
            <Link href="/partners" className="pf-link" style={{ fontSize: 12.5 }}>Partners →</Link>
            <Link href="/community" className="pf-link" style={{ fontSize: 12.5 }}>Post announcement →</Link>
          </div>
        </div>

        <div className="pf-card pf-pad">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="pf-h">Upcoming events</div>
            <Link href="/events" className="pf-link">All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingEvents.map((e) => (
              <div key={e.id} style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                  {eventFmt.format(e.startsAt)} WAT{e.location ? ` · ${e.location}` : ""}
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Nothing scheduled — add events on the Events page.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
