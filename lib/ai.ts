import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

// The core AI Tutor engine prompt (from the TechAscend platform spec §4).
export const TUTOR_SYSTEM_PROMPT = `You are TechAscend AI Tutor, a world-class software engineering and entrepreneurship mentor focused on African women in technology.

Your responsibilities:
- Teach clearly and simply
- Guide students through tasks
- Help debug code
- Suggest improvements
- Evaluate projects
- Encourage income generation thinking

Rules:
- Always connect learning to real-world income opportunities
- Prefer practical explanations over theory
- Always adapt to Cameroon/Africa context
- Encourage AI-assisted development tools
- Never give vague answers

Output style:
- Simple language
- Step-by-step explanations
- Include examples
- Always end with a "Next Action".`;

export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!aiEnabled()) return null;
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export type TutorTurn = { role: "user" | "assistant"; content: string };

// A graceful, useful reply when no API key is configured (keeps the app usable
// as a demo without a live model).
function fallbackTutorReply(message: string): string {
  return `**AI Tutor (demo mode)**

Thanks for your question:

> ${message.slice(0, 240)}

I'm running without a live model right now. To turn me on, add an \`ANTHROPIC_API_KEY\` to your environment and I'll give full, step-by-step answers with real examples.

**Next Action:** Set \`ANTHROPIC_API_KEY\` in \`.env.local\`, then restart the dev server.`;
}

function buildSystemPrompt(lessonContext?: string): string {
  if (!lessonContext) return TUTOR_SYSTEM_PROMPT;
  return `${TUTOR_SYSTEM_PROMPT}\n\nCURRENT LESSON CONTEXT (use this to make help specific):\n${lessonContext}`;
}

/**
 * Stream a tutor reply as plain-text chunks. Yields the fallback text as a
 * single chunk when no API key is present.
 */
export async function* streamTutorReply(
  message: string,
  history: TutorTurn[] = [],
  lessonContext?: string,
): AsyncGenerator<string> {
  const anthropic = getClient();
  if (!anthropic) {
    yield fallbackTutorReply(message);
    return;
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-10).map((t) => ({ role: t.role, content: t.content })),
    { role: "user" as const, content: message },
  ];

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(lessonContext),
    messages,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

/** Non-streaming tutor reply (used for logging / server-side callers). */
export async function tutorReply(
  message: string,
  history: TutorTurn[] = [],
  lessonContext?: string,
): Promise<string> {
  let out = "";
  for await (const chunk of streamTutorReply(message, history, lessonContext)) out += chunk;
  return out;
}

export type Evaluation = {
  aiScore: number;
  rubric: { label: string; score: number }[];
  feedback: string;
  monetizationSuggestion: string;
};

const RUBRIC_LABELS = ["Functionality", "Code quality", "Documentation", "Monetization potential"];

function fallbackEvaluation(): Evaluation {
  return {
    aiScore: 0,
    rubric: RUBRIC_LABELS.map((label) => ({ label, score: 0 })),
    feedback:
      "AI evaluation is in demo mode. Add an ANTHROPIC_API_KEY to score submissions automatically. A mentor can still review your work.",
    monetizationSuggestion: "Connect a live model to get tailored income suggestions.",
  };
}

/**
 * Evaluate a project submission and return rubric scores + feedback.
 * Uses the Claude tool/JSON pattern; falls back gracefully without a key.
 */
export async function evaluateSubmission(input: {
  projectTitle: string;
  projectDescription?: string | null;
  submissionLink?: string | null;
  notes?: string | null;
}): Promise<Evaluation> {
  const anthropic = getClient();
  if (!anthropic) return fallbackEvaluation();

  const prompt = `Evaluate this student project submission for the TechAscend program.

PROJECT: ${input.projectTitle}
DESCRIPTION: ${input.projectDescription ?? "n/a"}
SUBMISSION LINK: ${input.submissionLink ?? "n/a"}
STUDENT NOTES: ${input.notes ?? "n/a"}

Score each rubric category from 0-100: Functionality, Code quality, Documentation, Monetization potential.
Reply ONLY with a JSON object of this exact shape:
{
  "rubric": [{"label": "Functionality", "score": 0}, {"label": "Code quality", "score": 0}, {"label": "Documentation", "score": 0}, {"label": "Monetization potential", "score": 0}],
  "feedback": "2-4 sentences of specific, encouraging feedback ending with a Next Action",
  "monetizationSuggestion": "one concrete way she could earn income from this work in the Cameroon/Africa context"
}`;

  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: TUTOR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const text = res.content.find((b) => b.type === "text")?.type === "text"
      ? (res.content[0] as { text: string }).text
      : "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Omit<Evaluation, "aiScore">;
    const rubric = Array.isArray(parsed.rubric) && parsed.rubric.length
      ? parsed.rubric.map((r) => ({ label: String(r.label), score: clamp(Number(r.score)) }))
      : RUBRIC_LABELS.map((label) => ({ label, score: 0 }));
    const aiScore = Math.round(rubric.reduce((s, r) => s + r.score, 0) / rubric.length);
    return {
      aiScore,
      rubric,
      feedback: parsed.feedback ?? "Reviewed.",
      monetizationSuggestion: parsed.monetizationSuggestion ?? "",
    };
  } catch {
    return fallbackEvaluation();
  }
}

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
