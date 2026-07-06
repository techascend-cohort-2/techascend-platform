import { redirect } from "next/navigation";
import { getCurrentUser, getProjectsForUser } from "@/lib/queries";
import ProjectsScreen, { type ProjectItem } from "@/components/platform/screens/ProjectsScreen";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await getProjectsForUser(user.id, user.track);

  const items: ProjectItem[] = projects.map((p) => {
    const sub = p.submissions[0];
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      difficulty: p.difficulty,
      estimatedWeeks: p.estimatedWeeks,
      monetizationPotential: p.monetizationPotential,
      phaseName: p.module?.phase?.name ?? null,
      phaseOrder: p.module?.phase?.orderIndex ?? null,
      status: sub?.status ?? null,
      aiScore: sub?.aiScore ?? null,
    };
  });

  return <ProjectsScreen projects={items} />;
}
