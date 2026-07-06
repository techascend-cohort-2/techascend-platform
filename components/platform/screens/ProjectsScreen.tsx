"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ICON } from "@/lib/platformData";

const BANNER_DISMISSED_KEY = "techascend:projects-banner-dismissed";

export type ProjectItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string | null;
  estimatedWeeks: string | null;
  monetizationPotential: string | null;
  phaseName: string | null;
  phaseOrder: number | null;
  status: string | null; // submitted | ai_reviewed | mentor_reviewed | approved | changes_requested
  aiScore: number | null;
};

const STATUS: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: "Submitted", badgeClass: "pf-badge-neutral" },
  ai_reviewed: { label: "AI reviewed", badgeClass: "pf-badge-brand" },
  mentor_reviewed: { label: "Mentor reviewed", badgeClass: "pf-badge-warn" },
  approved: { label: "Approved ✓", badgeClass: "pf-badge-pos" },
  changes_requested: { label: "Changes requested", badgeClass: "pf-badge-danger" },
};

const CATEGORY_STYLE: Record<
  string,
  { icon: string; valueIcon: string; fg: string; bg: string; valueBg: string; valueFg: string }
> = {
  "Build Studio": { icon: ICON.cloudUpload, valueIcon: ICON.chart, fg: "#7C3AED", bg: "#F1EAFC", valueBg: "#F1EAFC", valueFg: "#4C1D95" },
  Automation: { icon: ICON.document, valueIcon: ICON.coin, fg: "var(--pos)", bg: "var(--posbg)", valueBg: "var(--posbg)", valueFg: "#14543A" },
  "Support & Ops": { icon: ICON.chat, valueIcon: ICON.tag, fg: "var(--pos)", bg: "var(--posbg)", valueBg: "var(--posbg)", valueFg: "#14543A" },
  "Data & AI": { icon: ICON.chart, valueIcon: ICON.coin, fg: "#2D6FD9", bg: "#E6F0FC", valueBg: "#E6F0FC", valueFg: "#14345C" },
};
const DEFAULT_STYLE = { icon: ICON.grid, valueIcon: ICON.coin, fg: "var(--brand1)", bg: "#F1EAFC", valueBg: "#F1EAFC", valueFg: "#4C1D95" };

const CATEGORY_ORDER = ["Build Studio", "Automation", "Support & Ops", "Data & AI"];

const DIFFICULTY_RANK: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  "Intermediate-Advanced": 2,
  Advanced: 3,
};

const SORTS = [
  { key: "recommended", label: "Recommended" },
  { key: "shortest", label: "Shortest timeline first" },
  { key: "difficulty", label: "Easiest first" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

function weeksRank(estimatedWeeks: string | null): number {
  const match = estimatedWeeks?.match(/\d+/);
  return match ? Number(match[0]) : 99;
}

export default function ProjectsScreen({ projects }: { projects: ProjectItem[] }) {
  const [bannerOpen, setBannerOpen] = useState(true);
  const [category, setCategory] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("recommended");

  useEffect(() => {
    setBannerOpen(localStorage.getItem(BANNER_DISMISSED_KEY) !== "1");
  }, []);

  function dismissBanner() {
    setBannerOpen(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, "1");
  }

  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [projects]);

  const filtered = useMemo(
    () => (category === "all" ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortKey === "shortest") list.sort((a, b) => weeksRank(a.estimatedWeeks) - weeksRank(b.estimatedWeeks));
    if (sortKey === "difficulty")
      list.sort((a, b) => (DIFFICULTY_RANK[a.difficulty ?? ""] ?? 9) - (DIFFICULTY_RANK[b.difficulty ?? ""] ?? 9));
    return list;
  }, [filtered, sortKey]);

  const activeSort = SORTS.find((s) => s.key === sortKey) ?? SORTS[0];

  return (
    <div className="pf-screen pf-w1180">
      <div className="pf-page-intro">
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 26, letterSpacing: -0.4 }}>
            Projects
          </div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 2 }}>
            Capstone projects with instant AI evaluation
          </div>
        </div>
      </div>

      {bannerOpen ? (
        <div className="pf-proj-banner">
          <div className="pf-proj-banner-icon">
            <Icon path={ICON.zap} size={16} />
          </div>
          <div style={{ flex: 1, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
            Capstone briefs for your track. Submit your work to get an instant AI evaluation; a mentor reviews it
            after. An accepted capstone completes Phase 4 automatically.
          </div>
          <button className="pf-iconbtn" aria-label="Dismiss" onClick={dismissBanner}>
            <Icon path={ICON.close} size={16} />
          </button>
        </div>
      ) : null}

      <div className="pf-proj-toolbar">
        <div className="pf-proj-tabs">
          <button
            className={`pf-proj-tab ${category === "all" ? "pf-proj-tab-active" : ""}`}
            onClick={() => setCategory("all")}
          >
            <Icon path={ICON.grid} size={15} />
            All Projects
          </button>
          {categories.map((c) => {
            const style = CATEGORY_STYLE[c] ?? DEFAULT_STYLE;
            return (
              <button
                key={c}
                className={`pf-proj-tab ${category === c ? "pf-proj-tab-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                <Icon path={style.icon} size={15} />
                {c}
              </button>
            );
          })}
        </div>

        <div className="pf-proj-sort">
          <button className="pf-proj-sort-btn" onClick={() => setSortOpen((v) => !v)}>
            {activeSort.label}
            <Icon path={ICON.chevronDown} size={14} />
          </button>
          {sortOpen ? (
            <div className="pf-proj-sort-menu">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  className="pf-proj-sort-item"
                  onClick={() => {
                    setSortKey(s.key);
                    setSortOpen(false);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="pf-proj-list">
        {sorted.map((p) => {
          const style = CATEGORY_STYLE[p.category] ?? DEFAULT_STYLE;
          const st = p.status ? STATUS[p.status] ?? STATUS.submitted : null;
          return (
            <div key={p.id} className="pf-card pf-proj-card" style={{ borderTopColor: style.fg, borderTopWidth: 3, borderTopStyle: "solid" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div className="pf-proj-icon" style={{ background: style.bg, color: style.fg }}>
                  <Icon path={style.icon} size={19} />
                </div>
                {p.phaseOrder ? <span className="pf-badge pf-badge-pos">PHASE {p.phaseOrder}</span> : null}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: "var(--brand1)", marginTop: 12, marginBottom: 6 }}>
                {p.phaseName?.toUpperCase() ?? "CAPSTONE"}
              </div>
              <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>{p.title}</div>
              <div className="pf-proj-desc">{p.description}</div>
              {p.monetizationPotential ? (
                <div className="pf-proj-value" style={{ background: style.valueBg, color: style.valueFg }}>
                  <Icon path={style.valueIcon} size={15} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>Value if built:</div>
                    {p.monetizationPotential}
                  </div>
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {p.estimatedWeeks ? (
                  <span className="pf-proj-meta">
                    <Icon path={ICON.clock} size={13} />
                    Est. {p.estimatedWeeks}
                  </span>
                ) : null}
                {p.difficulty ? (
                  <span className="pf-proj-meta">
                    <Icon path={ICON.chart} size={13} />
                    {p.difficulty}
                  </span>
                ) : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Link
                  href={`/projects/${p.id}`}
                  className={st ? "pf-btn-soft" : "pf-btn-grad"}
                  style={{ padding: "10px 16px", borderRadius: 10, fontSize: 12.5, textAlign: "center", flex: 1 }}
                >
                  {st ? "View / resubmit" : "View brief & start →"}
                </Link>
                {st ? (
                  <span className={`pf-badge ${st.badgeClass}`} style={{ whiteSpace: "nowrap" }}>
                    {p.aiScore ? `${st.label} · ${p.aiScore}` : st.label}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {sorted.length === 0 ? (
        <div className="pf-card" style={{ padding: 32, textAlign: "center", fontSize: 13.5, color: "var(--muted)" }}>
          {projects.length === 0 ? "Capstone briefs unlock with Phase 4 — Build Studio." : "No projects in this category."}
        </div>
      ) : null}
    </div>
  );
}
