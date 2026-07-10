import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiProviderId } from "@/lib/aiProviderMeta";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

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
// AI Tutor — runs on each student's own API key(s) (BYOK). The platform pays
// for nothing here. A student can save keys for several providers; the tutor
// tries them in order and falls back to the next one when a key is exhausted
// or rejected, so one dead key never blocks a chat.
// ---------------------------------------------------------------------------

export type TutorTurn = { role: "user" | "assistant"; content: string };
export type TutorKey = { provider: AiProviderId; apiKey: string };

export class TutorKeyError extends Error {}

const PROVIDER_LABEL: Record<AiProviderId, string> = {
  gemini: "Gemini",
  anthropic: "Claude",
  openai: "OpenAI",
};

async function* streamGemini(
  apiKey: string,
  message: string,
  history: TutorTurn[],
  lessonContext?: string,
): AsyncGenerator<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
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
      throw new TutorKeyError("your Gemini key was rejected — double-check it in your profile");
    }
    if (/quota|RESOURCE_EXHAUSTED|rate limit/i.test(msg)) {
      throw new TutorKeyError("your Gemini key hit its rate/quota limit");
    }
    throw new TutorKeyError("Gemini couldn't be reached");
  }
}

async function* streamAnthropic(
  apiKey: string,
  message: string,
  history: TutorTurn[],
  lessonContext?: string,
): AsyncGenerator<string> {
  const client = new Anthropic({ apiKey });
  try {
    const stream = client.messages.stream({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(lessonContext),
      messages: [...history.slice(-10), { role: "user" as const, content: message }],
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401 || err.status === 403) {
        throw new TutorKeyError("your Claude key was rejected — double-check it in your profile");
      }
      if (err.status === 429 || /credit balance/i.test(err.message)) {
        throw new TutorKeyError("your Claude key is out of credits or rate-limited");
      }
    }
    throw new TutorKeyError("Claude couldn't be reached");
  }
}

async function* streamOpenAI(
  apiKey: string,
  message: string,
  history: TutorTurn[],
  lessonContext?: string,
): AsyncGenerator<string> {
  const client = new OpenAI({ apiKey });
  try {
    const stream = await client.chat.completions.create({
      model: OPENAI_MODEL,
      stream: true,
      messages: [
        { role: "system" as const, content: buildSystemPrompt(lessonContext) },
        ...history.slice(-10),
        { role: "user" as const, content: message },
      ],
    });
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
    }
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401 || err.status === 403) {
        throw new TutorKeyError("your OpenAI key was rejected — double-check it in your profile");
      }
      if (err.status === 429) {
        throw new TutorKeyError("your OpenAI key is out of credits or rate-limited");
      }
    }
    throw new TutorKeyError("OpenAI couldn't be reached");
  }
}

const PROVIDER_STREAMS: Record<
  AiProviderId,
  (apiKey: string, message: string, history: TutorTurn[], lessonContext?: string) => AsyncGenerator<string>
> = {
  gemini: streamGemini,
  anthropic: streamAnthropic,
  openai: streamOpenAI,
};

/**
 * Stream a tutor reply as plain-text chunks using the student's own keys.
 * Tries each key in order; if a provider fails before producing any text
 * (bad key, quota exhausted, unreachable), silently falls back to the next.
 * Throws TutorKeyError with a user-facing message only when every key failed.
 */
export async function* streamTutorReply(
  keys: TutorKey[],
  message: string,
  history: TutorTurn[] = [],
  lessonContext?: string,
): AsyncGenerator<string> {
  const failures: string[] = [];

  for (const { provider, apiKey } of keys) {
    let yielded = false;
    try {
      for await (const chunk of PROVIDER_STREAMS[provider](apiKey, message, history, lessonContext)) {
        yielded = true;
        yield chunk;
      }
      return;
    } catch (err) {
      const reason = err instanceof TutorKeyError ? err.message : `${PROVIDER_LABEL[provider]} failed`;
      // Once text has been streamed we can't cleanly restart on another
      // provider — surface the interruption instead of a confusing mid-answer
      // model switch.
      if (yielded) {
        throw new TutorKeyError(`The reply was interrupted: ${reason}. Please ask again.`);
      }
      failures.push(reason);
    }
  }

  const detail = failures.join("; ");
  throw new TutorKeyError(
    failures.length > 1
      ? `None of your AI keys worked just now: ${detail}. Check them in your profile.`
      : `The AI Tutor couldn't answer: ${detail}.`,
  );
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
