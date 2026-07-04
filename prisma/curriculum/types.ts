// Shared types for curriculum seed content.
// Content files (shared.ts, trackA.ts, trackB.ts) export data in these shapes;
// prisma/seed.ts turns them into Phase/Module/Lesson/Project rows.

export type LessonSeed = {
  title: string;
  /** "video" | "ai" | "quiz" | "task" — "ai" = reading + AI-tutor-driven lesson */
  type: "video" | "ai" | "quiz" | "task";
  /** e.g. "25 min" */
  duration: string;
  /** 3–5 learning objectives, plain sentences */
  objectives: string[];
  /**
   * Markdown lesson body, ~250–450 words. Practical, Cameroon/Africa-aware,
   * AI-native (teach the concept AND how to use an AI assistant with it).
   * MUST end with a paragraph starting with "**Your task:**" describing a
   * concrete deliverable the student produces before marking complete.
   */
  content: string;
  /**
   * Context injected into the AI Tutor when the student asks for help on this
   * lesson. 1–3 sentences: what the lesson covers, what examples to use,
   * what to steer the student toward.
   */
  aiPrompt: string;
};

export type ModuleSeed = {
  title: string;
  description: string;
  lessons: LessonSeed[];
};

/** Phase slugs used across the seed. */
export type PhaseSlug =
  | "visibility"
  | "ai-foundations"
  | "core-skills"
  | "build-studio"
  | "launch-earn";

export type PhaseContent = {
  phaseSlug: PhaseSlug;
  modules: ModuleSeed[];
};

export type ProjectSeed = {
  phaseSlug: PhaseSlug;
  title: string;
  description: string;
  deliverables: { title: string; ext: string }[];
  monetizationPotential: string;
};
