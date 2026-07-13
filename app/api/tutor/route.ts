import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { streamTutorReply, TutorKeyError, type TutorKey, type TutorTurn } from "@/lib/ai";
import { getLcwatConfig } from "@/lib/settings";
import { decryptSecret } from "@/lib/crypto";
import { tutorMessageSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = tutorMessageSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(parsed.error.issues[0]?.message ?? "Invalid request", { status: 400 });
  }
  const { message, lessonId, history } = parsed.data;

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { geminiApiKeyEnc: true, anthropicApiKeyEnc: true, openaiApiKeyEnc: true, lcwatApiKeyEnc: true },
  });

  // Fallback order: Gemini (free) first, then Claude, then OpenAI. A stored
  // key that fails to decrypt (e.g. AUTH_SECRET was rotated) is tracked
  // separately so we can tell the student to re-enter it, not "add one".
  const keys: TutorKey[] = [];
  let hadUnreadable = false;
  const addKey = (enc: string | null | undefined, provider: TutorKey["provider"]) => {
    if (!enc) return;
    const plain = decryptSecret(enc);
    if (plain === null) hadUnreadable = true;
    else keys.push({ provider, apiKey: plain });
  };
  addKey(user?.geminiApiKeyEnc, "gemini");
  addKey(user?.anthropicApiKeyEnc, "anthropic");
  addKey(user?.openaiApiKeyEnc, "openai");
  // LCWAT: a student's own gateway key overrides the platform default. The
  // gateway URL is always the platform's (admin-configured in the DB).
  const lcwatConfig = await getLcwatConfig();
  const personalLcwat = user?.lcwatApiKeyEnc ? decryptSecret(user.lcwatApiKeyEnc) : null;
  if (user?.lcwatApiKeyEnc && personalLcwat === null) hadUnreadable = true;
  const lcwatKey = personalLcwat ?? lcwatConfig.apiKey;
  if (lcwatKey && lcwatConfig.url) {
    keys.push({ provider: "lcwat", apiKey: lcwatKey, baseUrl: lcwatConfig.url });
  }

  if (keys.length === 0) {
    return Response.json(
      hadUnreadable
        ? {
            code: "unreadable_key",
            message:
              "Your saved AI key couldn't be read after a security update. Please re-enter it in My Profile to reconnect your AI Tutor.",
          }
        : {
            code: "no_key",
            message:
              "Add an AI API key in My Profile to start using the AI Tutor — the Gemini key is free and takes about a minute to get.",
          },
      { status: 412 },
    );
  }

  // Pull lesson context for context-aware answers.
  let lessonContext: string | undefined;
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });
    if (lesson) {
      lessonContext = [
        `Module: ${lesson.module.title}`,
        `Lesson: ${lesson.title}`,
        lesson.content ? `Content: ${lesson.content}` : "",
        lesson.aiPrompt ?? "",
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  const turns: TutorTurn[] = (history ?? []) as TutorTurn[];

  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamTutorReply(keys, message, turns, lessonContext)) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const msg =
          err instanceof TutorKeyError
            ? `\n\n_${err.message}_`
            : "\n\n_Sorry — I hit an error. Please try again._";
        full += msg;
        controller.enqueue(encoder.encode(msg));
      } finally {
        controller.close();
        // Persist the exchange (best-effort, after the response is streamed).
        prisma.aiTutorLog
          .create({ data: { userId, lessonId: lessonId ?? null, prompt: message, response: full } })
          .catch(() => {});
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
