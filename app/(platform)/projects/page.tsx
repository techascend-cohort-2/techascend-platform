import { redirect } from "next/navigation";
import { getCurrentUser, getProjectsData } from "@/lib/queries";
import ProjectSubmit from "@/components/platform/ProjectSubmit";

type Evaluation = {
  aiScore: number;
  rubric: { label: string; score: number }[];
  feedback: string;
  monetizationSuggestion: string;
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { featured, latestSubmission, deliverables } = await getProjectsData(user.id);

  if (!featured) {
    return (
      <div className="pf-screen pf-w1180">
        <div className="pf-card" style={{ padding: 40, textAlign: "center" }}>
          <h2 className="pf-soon-title">No projects yet</h2>
          <p className="pf-soon-text">Projects will appear here as you progress through your modules.</p>
        </div>
      </div>
    );
  }

  const initialEvaluation: Evaluation | null =
    latestSubmission && latestSubmission.aiScore
      ? {
          aiScore: latestSubmission.aiScore,
          rubric: (latestSubmission.rubric as { label: string; score: number }[] | null) ?? [],
          feedback: latestSubmission.aiFeedback ?? "",
          monetizationSuggestion: latestSubmission.monetizationSuggestion ?? "",
        }
      : null;

  return (
    <ProjectSubmit
      projectId={featured.id}
      projectTitle={featured.title}
      moduleLabel={`${featured.title} · capstone`}
      deliverables={deliverables}
      initialEvaluation={initialEvaluation}
    />
  );
}
