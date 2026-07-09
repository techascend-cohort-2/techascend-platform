import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { streamTutorReply, TutorKeyError, type TutorTurn } from "@/lib/ai";
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
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { geminiApiKeyEnc: true } });
  const apiKey = user?.geminiApiKeyEnc ? decryptSecret(user.geminiApiKeyEnc) : null;
  if (!apiKey) {
    return Response.json(
      {
        code: "no_key",
        message: "Add your Gemini API key in My Profile to start using the AI Tutor.",
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
        for await (const chunk of streamTutorReply(apiKey, message, turns, lessonContext)) {
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
