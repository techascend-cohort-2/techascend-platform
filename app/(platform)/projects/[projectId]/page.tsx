import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/queries";
import ProjectSubmit from "@/components/platform/ProjectSubmit";

type Evaluation = {
  aiScore: number;
  rubric: { label: string; score: number }[];
  feedback: string;
  monetizationSuggestion: string;
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      module: { include: { phase: true } },
      submissions: { where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!project) notFound();

  const latest = project.submissions[0] ?? null;
  const initialEvaluation: Evaluation | null =
    latest && latest.aiScore
      ? {
          aiScore: latest.aiScore,
          rubric: (latest.rubric as { label: string; score: number }[] | null) ?? [],
          feedback: latest.aiFeedback ?? "",
          monetizationSuggestion: latest.monetizationSuggestion ?? "",
        }
      : null;

  return (
    <ProjectSubmit
      projectId={project.id}
      projectTitle={project.title}
      moduleLabel={`${project.module?.phase?.name ?? "Capstone"} · ${project.title}`}
      deliverables={(project.deliverables as { title: string; ext: string }[] | null) ?? []}
      initialEvaluation={initialEvaluation}
    />
  );
}
