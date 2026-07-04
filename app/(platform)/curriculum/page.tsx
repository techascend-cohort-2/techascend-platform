import { redirect } from "next/navigation";
import { getCurrentUser, getCurriculumAdmin } from "@/lib/queries";
import CurriculumScreen from "@/components/platform/screens/CurriculumScreen";

export default async function CurriculumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const phases = await getCurriculumAdmin();

  return (
    <CurriculumScreen
      phases={phases.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        startsAt: p.startsAt ? p.startsAt.toISOString() : null,
        endsAt: p.endsAt ? p.endsAt.toISOString() : null,
        badgeName: p.badge?.name ?? null,
        modules: p.modules.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          track: m.track,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            type: l.type,
            duration: l.duration,
            content: l.content,
            aiPrompt: l.aiPrompt,
            objectives: Array.isArray(l.objectives) ? (l.objectives as string[]) : [],
            orderIndex: l.orderIndex,
          })),
        })),
      }))}
    />
  );
}
