import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiProviderId } from "@/lib/aiProviderMeta";
import { PROJECT_RUBRIC, PASS_OVERALL, PASS_MIN_PER_CRITERION, overallScore } from "@/lib/rubric";

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
// baseUrl is only used by the LCWAT provider (its gateway URL).
export type TutorKey = { provider: AiProviderId; apiKey: string; baseUrl?: string };

export class TutorKeyError extends Error {}

const PROVIDER_LABEL: Record<AiProviderId, string> = {
  gemini: "Gemini",
  anthropic: "Claude",
  openai: "OpenAI",
  lcwat: "TechAscend LCWAT",
};

// A trimmed one-line snippet of a raw provider error, safe to show a student
// (strips any key/token material that might appear in a URL or message).
function shortReason(msg: string): string {
  const clean = msg
    .replace(/(key|api[_-]?key|token)=[^&\s]+/gi, "$1=•••")
    .replace(/AIza[0-9A-Za-z_-]{10,}/g, "•••")
    .replace(/sk-[0-9A-Za-z_-]{10,}/g, "•••")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 160 ? `${clean.slice(0, 157)}…` : clean;
}

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
    let produced = false;
    for await (const chunk of result.stream) {
      // Extract text defensively: chunk.text() can throw on a chunk that has a
      // finishReason but no text parts even when the overall call succeeded,
      // so fall back to reading the raw parts instead of failing the reply.
      let text = "";
      try {
        text = chunk.text();
      } catch {
        text = (chunk.candidates?.[0]?.content?.parts ?? [])
          .map((p) => (typeof p.text === "string" ? p.text : ""))
          .join("");
      }
      if (text) {
        produced = true;
        yield text;
      }
    }
    if (!produced) {
      // The call succeeded (HTTP 200) but returned no usable text — usually a
      // safety block or an empty candidate. Explain that rather than a raw error.
      const resp = await result.response.catch(() => null);
      const block = resp?.promptFeedback?.blockReason;
      const finish = resp?.candidates?.[0]?.finishReason;
      console.error("[tutor] Gemini empty response:", JSON.stringify({ block, finish }));
      throw new TutorKeyError(
        block || (finish && finish !== "STOP")
          ? `Gemini blocked this reply (${block || finish}) — try rephrasing your question`
          : "Gemini returned an empty reply — try asking again",
      );
    }
  } catch (err) {
    if (err instanceof TutorKeyError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    // Log the real Google error so it can be diagnosed from server logs — the
    // student-facing message below is a friendly interpretation of it.
    console.error("[tutor] Gemini error:", msg);
    if (/api key not valid|API_KEY_INVALID|PERMISSION_DENIED/i.test(msg)) {
      throw new TutorKeyError("your Gemini key was rejected — double-check it in your profile");
    }
    if (/location is not supported|not available in your|user location|failed_precondition/i.test(msg)) {
      throw new TutorKeyError(
        "Gemini's free tier isn't available for your Google account's country yet. Add a Claude or OpenAI key in My Profile to use the tutor",
      );
    }
    if (/quota|RESOURCE_EXHAUSTED|rate limit|429/i.test(msg)) {
      throw new TutorKeyError(
        `your Gemini key has no available quota. If it has never worked, the free tier likely isn't enabled for your account/region — enable billing, or add a Claude/OpenAI key in My Profile. (Google: ${shortReason(msg)})`,
      );
    }
    throw new TutorKeyError(`Gemini couldn't be reached (${shortReason(msg)})`);
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
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tutor] Claude error:", msg);
    if (err instanceof Anthropic.APIError) {
      if (err.status === 401 || err.status === 403) {
        throw new TutorKeyError("your Claude key was rejected — double-check it in your profile");
      }
      if (err.status === 429 || /credit balance/i.test(err.message)) {
        throw new TutorKeyError("your Claude key is out of credits or rate-limited — add credit at console.anthropic.com");
      }
    }
    throw new TutorKeyError(`Claude couldn't be reached (${shortReason(msg)})`);
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
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tutor] OpenAI error:", msg);
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401 || err.status === 403) {
        throw new TutorKeyError("your OpenAI key was rejected — double-check it in your profile");
      }
      if (err.status === 429) {
        throw new TutorKeyError("your OpenAI key is out of credits or rate-limited — add credit in platform.openai.com Billing");
      }
    }
    throw new TutorKeyError(`OpenAI couldn't be reached (${shortReason(msg)})`);
  }
}

async function* streamLcwat(
  apiKey: string,
  message: string,
  history: TutorTurn[],
  lessonContext?: string,
  baseUrl?: string,
): AsyncGenerator<string> {
  const gateway = (baseUrl || "").replace(/\/+$/, "");
  if (!gateway) throw new TutorKeyError("the TechAscend LCWAT gateway isn't configured");

  // LCWAT /v1/messages is stateless request/response with a single `prompt`,
  // so fold the system prompt + recent history into one prompt string.
  const convo = history
    .slice(-10)
    .map((t) => `${t.role === "assistant" ? "Assistant" : "Student"}: ${t.content}`)
    .join("\n");
  const prompt = [
    buildSystemPrompt(lessonContext),
    convo ? `Conversation so far:\n${convo}` : "",
    `Student: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  let res: Response;
  try {
    res = await fetch(`${gateway}/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify({ prompt, timeout_seconds: 180 }),
      signal: AbortSignal.timeout(200_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tutor] LCWAT fetch error:", msg);
    throw new TutorKeyError("the TechAscend LCWAT gateway couldn't be reached — try again shortly");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
    const code = body?.error?.code;
    console.error("[tutor] LCWAT error:", res.status, code, body?.error?.message);
    if (res.status === 401) throw new TutorKeyError("your TechAscend LCWAT key was rejected — check it in your profile");
    if (res.status === 429) throw new TutorKeyError("the TechAscend LCWAT gateway is busy — try again in a moment");
    if (res.status === 503) throw new TutorKeyError("the TechAscend LCWAT providers are temporarily unavailable — try again shortly");
    if (res.status === 504) throw new TutorKeyError("the TechAscend LCWAT gateway took too long — try a shorter question");
    throw new TutorKeyError(`the TechAscend LCWAT gateway couldn't answer (${code ?? res.status})`);
  }

  const data = (await res.json().catch(() => null)) as { response?: string } | null;
  const text = data?.response;
  if (typeof text === "string" && text.trim()) {
    yield text;
    return;
  }
  throw new TutorKeyError("the TechAscend LCWAT gateway returned an empty reply — try again");
}

const PROVIDER_STREAMS: Record<
  AiProviderId,
  (apiKey: string, message: string, history: TutorTurn[], lessonContext?: string, baseUrl?: string) => AsyncGenerator<string>
> = {
  gemini: streamGemini,
  anthropic: streamAnthropic,
  openai: streamOpenAI,
  lcwat: streamLcwat,
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

  for (const { provider, apiKey, baseUrl } of keys) {
    let yielded = false;
    try {
      for await (const chunk of PROVIDER_STREAMS[provider](apiKey, message, history, lessonContext, baseUrl)) {
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
  rubric: { key: string; label: string; score: number }[];
  feedback: string;
  monetizationSuggestion: string;
};

function fallbackEvaluation(): Evaluation {
  return {
    aiScore: 0,
    rubric: PROJECT_RUBRIC.map((c) => ({ key: c.key, label: c.label, score: 0 })),
    feedback:
      "AI evaluation is offline right now (the platform's AI key isn't configured). A mentor will still review your work.",
    monetizationSuggestion: "Ask a mentor for tailored income suggestions once AI evaluation is back online.",
  };
}

/**
 * Evaluate a project submission against the TechAscend project rubric and return
 * per-criterion scores + feedback. Falls back gracefully without a key.
 */
export async function evaluateSubmission(input: {
  projectTitle: string;
  projectDescription?: string | null;
  submissionLink?: string | null;
  notes?: string | null;
}): Promise<Evaluation> {
  const anthropic = getAnthropicClient();
  if (!anthropic) return fallbackEvaluation();

  const criteriaText = PROJECT_RUBRIC.map(
    (c) => `- ${c.key} — ${c.label} (${c.weight}%): ${c.description}`,
  ).join("\n");
  const shape = PROJECT_RUBRIC.map((c) => `{"key": "${c.key}", "score": 0}`).join(", ");

  const prompt = `Evaluate this student project submission for the TechAscend program (AI-native builders in Central Africa).

PROJECT: ${input.projectTitle}
DESCRIPTION: ${input.projectDescription ?? "n/a"}
SUBMISSION LINK: ${input.submissionLink ?? "n/a"}
STUDENT NOTES: ${input.notes ?? "n/a"}

Score EACH rubric criterion from 0-100 using these weighted criteria:
${criteriaText}

A submission passes when the weighted total is at least ${PASS_OVERALL}/100 AND no criterion scores below ${PASS_MIN_PER_CRITERION}. Be fair but hold the bar to real, working, income-ready work.
Reply ONLY with a JSON object of this exact shape:
{
  "rubric": [${shape}],
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
    const parsed = JSON.parse(json) as {
      rubric?: { key?: string; score?: number }[];
      feedback?: string;
      monetizationSuggestion?: string;
    };
    const byKey = new Map((parsed.rubric ?? []).map((r) => [String(r.key), clamp(Number(r.score))]));
    const scored = PROJECT_RUBRIC.map((c) => ({ key: c.key, score: byKey.get(c.key) ?? 0 }));
    const rubric = PROJECT_RUBRIC.map((c) => ({ key: c.key, label: c.label, score: byKey.get(c.key) ?? 0 }));
    const aiScore = overallScore(scored);
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
