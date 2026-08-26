import { redirect } from "next/navigation";
import { getCurrentUser, getReviewQueues } from "@/lib/queries";
import ReviewsScreen from "@/components/platform/screens/ReviewsScreen";

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { visibility, submissions, recentlyDecidedVisibility, recentlyDecidedSubmissions, stats } =
    await getReviewQueues();

  return (
    <ReviewsScreen
      visibility={visibility.map((v) => ({
        id: v.id,
        submittedAt: v.submittedAt.toISOString(),
        githubUrl: v.githubUrl,
        linkedinUrl: v.linkedinUrl,
        xUrl: v.xUrl,
        mediumUrl: v.mediumUrl,
        huggingfaceUrl: v.huggingfaceUrl,
        kaggleUrl: v.kaggleUrl,
        user: v.user,
      }))}
      submissions={submissions.map((s) => ({
        id: s.id,
        createdAt: s.createdAt.toISOString(),
        submissionLink: s.submissionLink,
        notes: s.notes,
        aiScore: s.aiScore,
        aiFeedback: s.aiFeedback,
        aiRubric: (s.rubric as { key?: string; label?: string; score?: number }[] | null) ?? null,
        status: s.status,
        user: s.user,
        project: {
          title: s.project.title,
          description: s.project.description,
          deliverables: (s.project.deliverables as { title?: string; ext?: string }[] | null) ?? [],
          category: s.project.category,
          difficulty: s.project.difficulty,
          estimatedWeeks: s.project.estimatedWeeks,
          monetizationPotential: s.project.monetizationPotential,
          phaseModule: s.project.module ? `${s.project.module.phase.name} · ${s.project.module.title}` : null,
        },
      }))}
      recentlyDecidedVisibility={recentlyDecidedVisibility.map((v) => ({
        id: v.id,
        reviewedAt: (v.reviewedAt ?? v.submittedAt).toISOString(),
        status: v.status,
        user: v.user,
      }))}
      recentlyDecided={recentlyDecidedSubmissions.map((s) => ({
        id: s.id,
        updatedAt: s.updatedAt.toISOString(),
        status: s.status,
        mentorScore: s.mentorScore,
        user: s.user,
        project: { title: s.project.title },
      }))}
      stats={stats}
    />
  );
}
