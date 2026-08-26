import { redirect } from "next/navigation";
import { getCurrentUser, getProjectsForUser, getProjectsCatalog } from "@/lib/queries";
import { isStaff } from "@/lib/constants";
import ProjectsScreen, { type ProjectItem } from "@/components/platform/screens/ProjectsScreen";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Staff (admin + community managers) get the read-only catalog of every
  // brief across both tracks; students get their track's briefs + own status.
  if (isStaff(user.role)) {
    const catalog = await getProjectsCatalog();
    const items: ProjectItem[] = catalog.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      difficulty: p.difficulty,
      estimatedWeeks: p.estimatedWeeks,
      monetizationPotential: p.monetizationPotential,
      phaseName: p.module?.phase?.name ?? null,
      phaseOrder: p.module?.phase?.orderIndex ?? null,
      status: null,
      aiScore: null,
      track: p.track,
      submissionCount: p._count.submissions,
    }));
    return <ProjectsScreen projects={items} viewer="staff" />;
  }

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
