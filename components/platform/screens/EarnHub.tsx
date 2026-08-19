"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { expressInterestAction, markAppliedAction, type ActionState } from "@/lib/actions/community";
import { formatFcfa } from "@/lib/constants";
import { interestStatusStyle } from "@/components/platform/interestStatus";

export type EarnPayout = {
  id: string;
  amount: number;
  note: string | null;
  occurredAt: string; // ISO
};

export type EarnOpportunity = {
  id: string;
  title: string;
  type: string;
  pay: string | null;
  link: string | null;
  posterName: string;
  myInterest: boolean;
  myInterestStatus: string | null;
};

export type EarnInterest = {
  id: string;
  opportunityId: string;
  title: string;
  link: string | null;
  status: string; // "interested" | "applied" | "accepted" | "hired" | "declined"
};

type EarnHubProps = {
  payouts: EarnPayout[];
  opportunities: EarnOpportunity[];
  interests: EarnInterest[];
  totalLabel: string;
  meId: string;
};

const TYPE_LABELS: Record<string, string> = {
  freelance: "Freelance",
  job: "Job",
  internship: "Internship",
  studio: "Studio",
  sme: "SME",
};

function payoutDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Douala",
  });
}

function InterestButton({ opp }: { opp: EarnOpportunity }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (opp.myInterest) {
    const st = interestStatusStyle(opp.myInterestStatus ?? "interested");
    return (
      <span className="pf-badge-sm" style={{ color: st.fg, background: st.bg }}>
        ✓ {st.label}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {error ? <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--danger)" }}>{error}</span> : null}
      <button
        className="pf-btn-soft"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res: ActionState = await expressInterestAction(opp.id);
            if (res.error) setError(res.error);
            else router.refresh();
          });
        }}
        style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, opacity: isPending ? 0.7 : 1 }}
      >
        I&apos;m interested
      </button>
    </span>
  );
}

// One row in "My interests": title + status badge, an "Apply ↗" link out to
// the program site, and — while still just "interested" — an "I've applied →"
// self-report button (external programs are applied to off-platform).
function InterestRow({ interest, first }: { interest: EarnInterest; first: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const st = interestStatusStyle(interest.status);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderTop: first ? "none" : "1px solid var(--line)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 140px", minWidth: 0, fontSize: 13, fontWeight: 700 }}>{interest.title}</div>
      {error ? <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--danger)" }}>{error}</span> : null}
      {interest.link ? (
        <a
          href={interest.link}
          target="_blank"
          rel="noopener noreferrer"
          className="pf-link"
          style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}
        >
          Apply ↗
        </a>
      ) : null}
      {interest.status === "interested" ? (
        <button
          className="pf-btn-soft"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const res: ActionState = await markAppliedAction(interest.opportunityId);
              if (res.error) setError(res.error);
              else router.refresh();
            });
          }}
          style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, opacity: isPending ? 0.7 : 1 }}
          title="Applied on the program's site? Let the team know."
        >
          I&apos;ve applied →
        </button>
      ) : null}
      <span className="pf-badge-sm" style={{ color: st.fg, background: st.bg, flexShrink: 0 }}>
        {st.label}
      </span>
    </div>
  );
}

export default function EarnHub({ payouts, opportunities, interests, totalLabel }: EarnHubProps) {
  const stats = [
    { label: "Total earned", value: totalLabel, color: "var(--pos)" },
    { label: "Payouts", value: String(payouts.length), color: "var(--ink)" },
    { label: "My interests", value: String(interests.length), color: "var(--ink)" },
  ];

  return (
    <div className="pf-screen pf-w1180">
      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
        {stats.map((s) => (
          <div key={s.label} className="pf-card pf-pad">
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 24, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "start" }}>
        {/* LEFT: open opportunities */}
        <div className="pf-card pf-pad">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="pf-h">Open opportunities</div>
            <a href="/opportunities" className="pf-link">View all →</a>
          </div>
          {opportunities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {opportunities.map((opp, i) => (
                <div
                  key={opp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderTop: i > 0 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{opp.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      {TYPE_LABELS[opp.type] ?? opp.type} · {opp.posterName}
                      {opp.pay ? (
                        <>
                          {" · "}
                          <span style={{ fontWeight: 700, color: "var(--pos)" }}>{opp.pay}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {opp.link ? (
                    <a
                      href={opp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pf-link"
                      style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                    >
                      Apply ↗
                    </a>
                  ) : null}
                  <InterestButton opp={opp} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
              No open opportunities right now — check back soon, partners post paid work here.
            </div>
          )}
        </div>

        {/* RIGHT: payouts + interests */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 12 }}>My payouts</div>
            {payouts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {payouts.map((p, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderTop: i > 0 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.note ?? "Payout"}</div>
                      <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>
                        {payoutDate(p.occurredAt)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--pos)", flexShrink: 0 }}>
                      +{formatFcfa(p.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
                No payouts yet — real money only, recorded when you earn through TechAscend.
              </div>
            )}
          </div>

          <div className="pf-card pf-pad">
            <div className="pf-h" style={{ marginBottom: 12 }}>My interests</div>
            {interests.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {interests.map((it, i) => (
                  <InterestRow key={it.id} interest={it} first={i === 0} />
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
                When you raise your hand for an opportunity, it shows up here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
