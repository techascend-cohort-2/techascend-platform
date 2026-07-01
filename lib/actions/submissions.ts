"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { evaluateSubmission } from "@/lib/ai";
import { submissionSchema } from "@/lib/validation";

export type SubmitState = {
  ok?: boolean;
  error?: string;
  result?: {
    aiScore: number;
    rubric: { label: string; score: number }[];
    feedback: string;
    monetizationSuggestion: string;
  };
};

export async function submitProjectAction(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const session = await auth();
  if (!session?.user) return { error: "You must be signed in to submit." };

  const parsed = submissionSchema.safeParse({
    projectId: formData.get("projectId"),
    submissionLink: formData.get("submissionLink") ?? "",
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid submission." };

  const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId } });
  if (!project) return { error: "Project not found." };

  // Run AI evaluation (graceful fallback without a key).
  const evaluation = await evaluateSubmission({
    projectTitle: project.title,
    projectDescription: project.description,
    submissionLink: parsed.data.submissionLink,
    notes: parsed.data.notes,
  });

  await prisma.submission.create({
    data: {
      userId: session.user.id,
      projectId: project.id,
      submissionLink: parsed.data.submissionLink || null,
      notes: parsed.data.notes || null,
      aiScore: evaluation.aiScore || null,
      rubric: evaluation.rubric,
      aiFeedback: evaluation.feedback,
      monetizationSuggestion: evaluation.monetizationSuggestion,
      status: evaluation.aiScore ? "ai_reviewed" : "submitted",
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { ok: true, result: evaluation };
}
