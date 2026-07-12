// The single source of truth for how student projects are evaluated — used by
// the AI evaluator, the mentor review UI, and the pass/fail gate. Tied to
// TechAscend's goal: real, well-built, income-generating work.

export type RubricCriterion = {
  key: string;
  label: string;
  description: string;
  weight: number; // percentage weight; the four sum to 100
};

export const PROJECT_RUBRIC: RubricCriterion[] = [
  {
    key: "functionality",
    label: "Functionality",
    description: "Does it work end-to-end and meet the brief?",
    weight: 30,
  },
  {
    key: "quality",
    label: "Code & build quality",
    description: "Clean, maintainable, and makes good use of AI-native tools.",
    weight: 25,
  },
  {
    key: "documentation",
    label: "Documentation & communication",
    description: "Clear README, a demo, and an understandable explanation.",
    weight: 20,
  },
  {
    key: "impact",
    label: "Real-world & income potential",
    description: "Employable, could earn money, or solves a real local problem.",
    weight: 25,
  },
];

// Pass bar: at least 70/100 overall AND no single criterion below 50/100.
export const PASS_OVERALL = 70;
export const PASS_MIN_PER_CRITERION = 50;

export type CriterionScore = { key: string; score: number };

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreFor(scores: CriterionScore[], key: string): number {
  return clamp(scores.find((s) => s.key === key)?.score ?? 0);
}

/** Weighted 0–100 overall from per-criterion (0–100) scores. */
export function overallScore(scores: CriterionScore[]): number {
  const totalWeight = PROJECT_RUBRIC.reduce((s, c) => s + c.weight, 0);
  const weighted = PROJECT_RUBRIC.reduce((s, c) => s + scoreFor(scores, c.key) * c.weight, 0);
  return Math.round(weighted / totalWeight);
}

export type RubricVerdict = {
  overall: number;
  passed: boolean;
  failedCriteria: string[]; // labels of criteria below the per-criterion minimum
};

export function evaluateRubric(scores: CriterionScore[]): RubricVerdict {
  const overall = overallScore(scores);
  const failedCriteria = PROJECT_RUBRIC.filter(
    (c) => scoreFor(scores, c.key) < PASS_MIN_PER_CRITERION,
  ).map((c) => c.label);
  return { overall, passed: overall >= PASS_OVERALL && failedCriteria.length === 0, failedCriteria };
}
