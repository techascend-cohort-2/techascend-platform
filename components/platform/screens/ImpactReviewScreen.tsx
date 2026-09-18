"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewImpactItemAction, type ActionState } from "@/lib/actions/impact";
import { impactStatusStyle, IMPACT_TIER_STYLES } from "@/components/platform/impactStatus";

export type QueueItem = {
  id: string;
  type: "project" | "achievement";
  title: string;
  createdAt: string;
  status: string;
  tier: string;
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
  // shared display fields
  summaryLines: { label: string; value: string }[];
  links: { label: string; url: string }[];
  reviewerName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
};

export type ImpactDashboardData = {
  funnel: { key: string; label: string; students: number }[];
  inclusion: {
    participants: number;
    baselinesCompleted: number;
    consented: number;
    barriersDeclared: number;
    firstStructuredTraining: number;
    noPriorTechEmployment: number;
    women: number;
    men: number;
    genderNotSet: number;
  };
  tiles: {
    projects: { total: number; verified: number; evidenced: number; selfReported: number };
    realWorldProjects: { total: number; verified: number; evidenced: number; selfReported: number };
    outcomes: { total: number; verified: number; evidenced: number; selfReported: number };
    jobs: { total: number; verified: number; evidenced: number; selfReported: number };
    internships: { total: number; verified: number; evidenced: number; selfReported: number };
    orgsEngaged: number;
    verifiedEarningsLabel: string;
    ledgerPayoutsLabel: string;
  };
};

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

function Avatar({ initials, bg }: { initials: string | null; bg: string | null }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 12, background: bg ?? "linear-gradient(135deg,#7C3AED,#D6336C)" }}>
      {initials ?? "?"}
    </div>
  );
}

function TierChip({ tier }: { tier: string }) {
  const t = IMPACT_TIER_STYLES[tier] ?? IMPACT_TIER_STYLES.self_reported;
  return <span className="pf-badge-sm" style={{ color: t.fg, background: t.bg, letterSpacing: 0.4, fontSize: 9.5 }}>{t.label}</span>;
}

function QueueCard({ item }: { item: QueueItem }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [noteMode, setNoteMode] = useState<"changes_requested" | "rejected" | null>(null);

  const decide = (decision: string, n?: string) => {
    setError(null);
    start(async () => {
      const res: ActionState = await reviewImpactItemAction(item.type, item.id, decision, n);
      if (res.error) setError(res.error);
      else {
        setNoteMode(null);
        setNote("");
        router.refresh();
      }
    });
  };

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, opacity: pending ? 0.6 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Avatar initials={item.user.initials} bg={item.user.avatarBg} />
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5 }}>
            {item.title} <span style={{ color: "var(--faint)", fontWeight: 600 }}>— {item.user.name}</span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
            {item.type === "project" ? "Project" : "Outcome"} · {dateFmt.format(new Date(item.createdAt))}
          </div>
        </div>
        <TierChip tier={item.tier} />
        <span className="pf-badge-sm" style={{ color: impactStatusStyle(item.status).fg, background: impactStatusStyle(item.status).bg }}>
          {impactStatusStyle(item.status).label}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 4, marginTop: 10 }}>
        {item.summaryLines.map((l, i) => (
          <div key={i} style={{ fontSize: 12 }}>
            <span style={{ color: "var(--faint)", fontWeight: 700 }}>{l.label}: </span>
            <span>{l.value}</span>
          </div>
        ))}
      </div>

      {item.links.length > 0 ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          {item.links.map((l, i) => (
            <a key={i} className="pf-link" style={{ fontSize: 12, fontWeight: 700 }} href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "var(--warn, #C97A0E)", marginTop: 8 }}>No evidence links provided.</div>
      )}

      {noteMode ? (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={noteMode === "changes_requested" ? "What does the student need to add or fix?" : "Why can't this be verified?"}
            style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", minHeight: 60 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="pf-btn-grad" disabled={pending || !note.trim()} onClick={() => decide(noteMode, note)} style={{ fontSize: 12 }}>
              {noteMode === "changes_requested" ? "Send request" : "Confirm reject"}
            </button>
            <button className="pf-btn-soft" onClick={() => setNoteMode(null)} style={{ fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button className="pf-btn-grad" disabled={pending} onClick={() => decide("verified")} style={{ fontSize: 12 }}>
            Verify ✓
          </button>
          <button className="pf-btn-soft" disabled={pending} onClick={() => setNoteMode("changes_requested")} style={{ fontSize: 12 }}>
            Request information
          </button>
          <button className="pf-btn-soft" disabled={pending} onClick={() => setNoteMode("rejected")} style={{ fontSize: 12, color: "var(--danger)" }}>
            Reject
          </button>
          {item.status === "submitted" ? (
            <button className="pf-btn-soft" disabled={pending} onClick={() => decide("under_review")} style={{ fontSize: 12 }}>
              Mark reviewing
            </button>
          ) : null}
        </div>
      )}
      {error ? <div style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", marginTop: 8 }}>{error}</div> : null}
    </div>
  );
}

export default function ImpactReviewScreen({
  dashboard,
  pending,
  decided,
}: {
  dashboard: ImpactDashboardData;
  pending: QueueItem[];
  decided: QueueItem[];
}) {
  const max = Math.max(1, ...dashboard.funnel.map((f) => f.students));
  const t = dashboard.tiles;
  const tierCaption = (x: { verified: number; evidenced: number; selfReported: number }) =>
    `${x.verified} verified · ${x.evidenced} evidenced · ${x.selfReported} self-reported`;

  return (
    <div className="pf-screen pf-w1180">
      {/* Funnel */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>TechAscend impact journey</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          Distinct students at each stage. Strict rules: “externally tested” needs a named tester type; “used by real
          users” needs real-user or paid maturity — an organization name alone never counts as adoption.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {dashboard.funnel.map((f) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, textAlign: "right", fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16 }}>{f.students}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{f.label}</div>
                <div style={{ height: 8, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((100 * f.students) / max)}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,var(--brand1),var(--brand2))" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inclusion & access */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>Inclusion &amp; access</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Baseline aggregates from consenting students only ({dashboard.inclusion.consented} of {dashboard.inclusion.baselinesCompleted} completed baselines consent to aggregate reporting). Individual answers stay private.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          {[
            { label: "Participants", value: dashboard.inclusion.participants },
            { label: "Declared barriers to tech opportunity", value: dashboard.inclusion.barriersDeclared },
            { label: "First structured tech training", value: dashboard.inclusion.firstStructuredTraining },
            { label: "Entered without tech employment", value: dashboard.inclusion.noPriorTechEmployment },
            { label: "Women", value: dashboard.inclusion.women },
            { label: "Men", value: dashboard.inclusion.men },
            { label: "Not provided / prefer not to say", value: dashboard.inclusion.genderNotSet },
          ].map((k) => (
            <div key={k.label} className="pf-card-2 pf-stat" style={{ padding: 14 }}>
              <div className="pf-stat-value" style={{ fontSize: 22 }}>{k.value}</div>
              <div className="pf-stat-label">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome tiles */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 12 }}>Evidence &amp; outcomes</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 22 }}>{t.projects.total}</div>
            <div className="pf-stat-label">Projects · {tierCaption(t.projects)}</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 22 }}>{t.realWorldProjects.total}</div>
            <div className="pf-stat-label">Real-world solutions · {tierCaption(t.realWorldProjects)}</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 22 }}>{t.orgsEngaged}</div>
            <div className="pf-stat-label">Organizations engaged (via verified external testing)</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 22 }}>{t.jobs.verified}</div>
            <div className="pf-stat-label">Jobs verified · {t.jobs.total - t.jobs.verified} reported</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 22 }}>{t.internships.verified}</div>
            <div className="pf-stat-label">Internships verified · {t.internships.total - t.internships.verified} reported</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 20 }}>{t.verifiedEarningsLabel}</div>
            <div className="pf-stat-label">Verified student earnings (outcomes)</div>
          </div>
          <div className="pf-card-2 pf-stat" style={{ padding: 14 }}>
            <div className="pf-stat-value" style={{ fontSize: 20 }}>{t.ledgerPayoutsLabel}</div>
            <div className="pf-stat-label">TechAscend ledger payouts (separate — never summed)</div>
          </div>
        </div>
      </div>

      {/* Verification queue */}
      <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="pf-h" style={{ marginBottom: 4 }}>Verification queue</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          {pending.length === 0
            ? "Nothing waiting — every reported project and outcome has been reviewed."
            : `${pending.length} item${pending.length === 1 ? "" : "s"} waiting. Open the evidence, then Verify, request information, or reject (with a note). Nothing is ever deleted.`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((item) => (
            <QueueCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>

      {/* Recently decided */}
      {decided.length > 0 ? (
        <div className="pf-card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="pf-h" style={{ marginBottom: 12 }}>Recently decided</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {decided.map((item) => (
              <div key={`${item.type}-${item.id}`} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12.5 }}>
                <span className="pf-badge-sm" style={{ color: impactStatusStyle(item.status).fg, background: impactStatusStyle(item.status).bg, flexShrink: 0 }}>
                  {impactStatusStyle(item.status).label}
                </span>
                <b>{item.title}</b>
                <span style={{ color: "var(--muted)" }}>
                  {item.user.name} · {item.type === "project" ? "project" : "outcome"}
                  {item.reviewerName ? ` · by ${item.reviewerName}` : ""}
                  {item.reviewedAt ? ` · ${dateFmt.format(new Date(item.reviewedAt))}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
