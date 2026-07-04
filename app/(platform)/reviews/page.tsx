import { redirect } from "next/navigation";
import { getCurrentUser, getReviewQueues } from "@/lib/queries";
import ReviewsScreen from "@/components/platform/screens/ReviewsScreen";

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { visibility, submissions } = await getReviewQueues();

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
        status: s.status,
        user: s.user,
        project: { title: s.project.title },
      }))}
    />
  );
}
