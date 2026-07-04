"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { movePipelineCardAction, removePipelineCardAction } from "@/lib/actions/community";
import { PIPELINE_STAGES, TRACK_LABELS } from "@/lib/constants";

export type PipelineCardData = {
  id: string;
  stage: string;
  note: string | null;
  user: {
    id: string;
    name: string;
    initials: string | null;
    avatarBg: string | null;
    track: string | null;
    title: string | null;
    progressPercentage: number;
  };
};

const FALLBACK_BG = "linear-gradient(135deg,#7C3AED,#D6336C)";

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PipelineBoard({ cards }: { cards: PipelineCardData[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function run(cardId: string, action: () => Promise<{ ok?: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await action();
      if (res.error) {
        const message = res.error;
        setErrors((e) => ({ ...e, [cardId]: message }));
      } else {
        setErrors((e) => {
          const next = { ...e };
          delete next[cardId];
          return next;
        });
        router.refresh();
      }
    });
  }

  if (cards.length === 0) {
    return (
      <div className="pf-card pf-pad" style={{ textAlign: "center", padding: 36 }}>
        <div className="pf-h" style={{ marginBottom: 6 }}>Your pipeline is empty</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          Shortlist talent from the Talent Pool to start your pipeline.
        </div>
        <Link
          href="/talent-pool"
          className="pf-btn-grad"
          style={{ display: "inline-block", fontSize: 13, padding: "10px 18px", borderRadius: 10 }}
        >
          Browse the Talent Pool →
        </Link>
      </div>
    );
  }

  const btnStyle: React.CSSProperties = {
    fontSize: 12,
    padding: "5px 10px",
    borderRadius: 8,
    lineHeight: 1,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
      {PIPELINE_STAGES.map((stage, si) => {
        const prevStage = si > 0 ? PIPELINE_STAGES[si - 1] : null;
        const nextStage = si < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[si + 1] : null;
        const colCards = cards.filter((c) => c.stage === stage);
        return (
          <div key={stage} className="pf-card" style={{ padding: 14, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span className="pf-h" style={{ fontSize: 13 }}>{stage}</span>
              <span className="pf-pipe-count" style={{ background: "var(--bg)" }}>
                {colCards.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {colCards.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--faint)", padding: "6px 2px" }}>
                  No one here yet.
                </div>
              ) : null}
              {colCards.map((card) => (
                <div
                  key={card.id}
                  className="pf-pipe-person"
                  style={{ flexDirection: "column", alignItems: "stretch", gap: 9 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                    <div
                      className="pf-pipe-av"
                      style={{ background: card.user.avatarBg ?? FALLBACK_BG }}
                    >
                      {card.user.initials ?? initialsOf(card.user.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {card.user.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {card.user.track
                          ? TRACK_LABELS[card.user.track] ?? card.user.track
                          : card.user.title ?? "—"}
                      </div>
                    </div>
                  </div>
                  {card.note ? (
                    <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>
                      {card.note}
                    </div>
                  ) : null}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      type="button"
                      className="pf-btn-soft"
                      style={btnStyle}
                      disabled={pending || !prevStage}
                      onClick={() =>
                        prevStage ? run(card.id, () => movePipelineCardAction(card.id, prevStage)) : undefined
                      }
                      aria-label={prevStage ? `Move ${card.user.name} back to ${prevStage}` : "No earlier stage"}
                      title={prevStage ? `Move back to ${prevStage}` : undefined}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="pf-btn-soft"
                      style={btnStyle}
                      disabled={pending || !nextStage}
                      onClick={() =>
                        nextStage ? run(card.id, () => movePipelineCardAction(card.id, nextStage)) : undefined
                      }
                      aria-label={nextStage ? `Move ${card.user.name} forward to ${nextStage}` : "No later stage"}
                      title={nextStage ? `Move forward to ${nextStage}` : undefined}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className="pf-btn-soft"
                      style={{ ...btnStyle, marginLeft: "auto", color: "var(--danger)" }}
                      disabled={pending}
                      onClick={() => run(card.id, () => removePipelineCardAction(card.id))}
                      aria-label={`Remove ${card.user.name} from pipeline`}
                      title="Remove from pipeline"
                    >
                      ✕
                    </button>
                  </div>
                  {errors[card.id] ? (
                    <div style={{ fontSize: 11, color: "var(--danger)", fontWeight: 600 }}>
                      {errors[card.id]}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
