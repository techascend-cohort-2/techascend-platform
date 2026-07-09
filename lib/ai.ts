import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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

function buildSystemPrompt(lessonContext?: string): string {
  if (!lessonContext) return TUTOR_SYSTEM_PROMPT;
  return `${TUTOR_SYSTEM_PROMPT}\n\nCURRENT LESSON CONTEXT (use this to make help specific):\n${lessonContext}`;
}

// ---------------------------------------------------------------------------
// AI Tutor — runs on each student's own Gemini API key (BYOK). The platform
// pays for nothing here; students bring their own free-tier Gemini key.
// ---------------------------------------------------------------------------

export type TutorTurn = { role: "user" | "assistant"; content: string };

export class TutorKeyError extends Error {}

/**
 * Stream a tutor reply as plain-text chunks using the student's own Gemini
 * API key. Throws TutorKeyError with a user-facing message if the key is
 * missing/invalid so the caller can show a clear "fix your key" prompt
 * instead of a silent/garbled failure.
 */
export async function* streamTutorReply(
  apiKey: string,
  message: string,
  history: TutorTurn[] = [],
  lessonContext?: string,
): AsyncGenerator<string> {
  let genAI: GoogleGenerativeAI;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch {
    throw new TutorKeyError("That Gemini API key looks invalid. Check it in your profile and try again.");
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: buildSystemPrompt(lessonContext),
  });

  // Gemini requires history to start with a "user" turn and alternate roles.
  const trimmed = history.slice(-10);
  const firstUserIdx = trimmed.findIndex((t) => t.role === "user");
  const geminiHistory = (firstUserIdx === -1 ? [] : trimmed.slice(firstUserIdx)).map((t) => ({
    role: t.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: t.content }],
  }));

  try {
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(message);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/api key not valid|API_KEY_INVALID|PERMISSION_DENIED/i.test(msg)) {
      throw new TutorKeyError("Your Gemini API key was rejected. Double-check it in your profile.");
    }
    if (/quota|RESOURCE_EXHAUSTED|rate limit/i.test(msg)) {
      throw new TutorKeyError("Your Gemini key has hit its rate/quota limit. Try again in a moment.");
    }
    throw new TutorKeyError("The AI Tutor couldn't reach Gemini just now. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// Project evaluation — runs on the platform's own Anthropic key. Every
// student's capstone submission is scored the same way regardless of
// whether they've set up a personal tutor key.
// ---------------------------------------------------------------------------

export function evaluationEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  if (!evaluationEnabled()) return null;
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
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
      "AI evaluation is offline right now (the platform's AI key isn't configured). A mentor will still review your work.",
    monetizationSuggestion: "Ask a mentor for tailored income suggestions once AI evaluation is back online.",
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
  const anthropic = getAnthropicClient();
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
      model: ANTHROPIC_MODEL,
      max_tokens: 700,
      system: TUTOR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = res.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    const text = textBlock?.text ?? "";
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
