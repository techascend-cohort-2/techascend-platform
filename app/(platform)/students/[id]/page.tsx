import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getStudentDetail } from "@/lib/queries";
import { isStaff } from "@/lib/constants";
import StudentDetailScreen, { type StudentDetailUser } from "@/components/platform/screens/StudentDetailScreen";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await getCurrentUser();
  if (!viewer) redirect("/login");
  if (!isStaff(viewer.role)) redirect("/dashboard");

  const { id } = await params;
  const detail = await getStudentDetail(id);
  if (!detail || detail.user.role !== "student") notFound();

  const { user, phaseBreakdown, tutorCount, lastTutorAt, lastLessonAt, visibilityHistory, impactBaseline, impactProjects, impactOutcomes } = detail;

  const links: Record<string, string> = {};
  if (user.visibilitySubmission) {
    for (const key of ["githubUrl", "linkedinUrl", "xUrl", "mediumUrl", "huggingfaceUrl", "kaggleUrl"] as const) {
      const value = user.visibilitySubmission[key];
      if (value) links[key] = value;
    }
  }

  const student: StudentDetailUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    track: user.track,
    city: user.city,
    bio: user.bio,
    initials: user.initials,
    avatarBg: user.avatarBg,
    progressPercentage: user.progressPercentage,
    cohortName: user.cohort?.name ?? null,
    portfolioUrl: user.portfolioUrl,
    createdAt: user.createdAt.toISOString(),
    suspendedAt: user.suspendedAt ? user.suspendedAt.toISOString() : null,
    visibility: user.visibilitySubmission
      ? { status: user.visibilitySubmission.status, reviewNote: user.visibilitySubmission.reviewNote, links }
      : null,
    submissions: user.submissions.map((s) => ({
      id: s.id,
      projectTitle: s.project.title,
      status: s.status,
      aiScore: s.aiScore,
      mentorScore: s.mentorScore,
      submissionLink: s.submissionLink,
      notes: s.notes,
      aiFeedback: s.aiFeedback,
      mentorFeedback: s.mentorFeedback,
      createdAt: s.createdAt.toISOString(),
    })),
    visibilityHistory: visibilityHistory.map((h) => ({
      id: h.id,
      decision: h.decision,
      note: h.note,
      reviewerName: h.reviewer?.name ?? null,
      createdAt: h.createdAt.toISOString(),
    })),
    badges: user.userBadges.map((ub) => ({
      id: ub.id,
      name: ub.badge.name,
      tint: ub.badge.tint,
      earnedAt: ub.earnedAt.toISOString(),
    })),
    certificates: user.certificates.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      issuedAt: c.issuedAt.toISOString(),
    })),
    phaseBreakdown,
    tutorCount,
    lastTutorAt: lastTutorAt ? lastTutorAt.toISOString() : null,
    lastLessonAt: lastLessonAt ? lastLessonAt.toISOString() : null,
    impactBaseline: impactBaseline
      ? {
          studentCompleted: Boolean(impactBaseline.studentCompletedAt),
          opportunityBarrierDeclared: impactBaseline.opportunityBarrierDeclared,
          opportunityBarrierSummary: impactBaseline.opportunityBarrierSummary,
          consentToAggregatedImpactReporting: impactBaseline.consentToAggregatedImpactReporting,
          previousTechTraining: impactBaseline.previousTechTraining,
          techEmploymentAtEntry: impactBaseline.techEmploymentAtEntry,
          hasReliableComputerAccess: impactBaseline.hasReliableComputerAccess,
          hasReliableInternetAccess: impactBaseline.hasReliableInternetAccess,
          highestEducationLevel: impactBaseline.highestEducationLevel,
          selectionPotentialScore: impactBaseline.selectionPotentialScore,
          selectionMotivationScore: impactBaseline.selectionMotivationScore,
          selectionChallengeScore: impactBaseline.selectionChallengeScore,
          selectionNotes: impactBaseline.selectionNotes,
        }
      : null,
    impactItems: [
      ...impactProjects.map((p) => ({
        id: p.id,
        type: "project" as const,
        title: p.title,
        sub: p.projectContext,
        status: p.status,
        evidenceCount: Array.isArray(p.evidenceLinks) ? (p.evidenceLinks as unknown[]).length : 0,
        reviewerName: p.reviewer?.name ?? null,
        reviewedAt: p.reviewedAt ? p.reviewedAt.toISOString() : null,
        updatedAt: p.updatedAt.toISOString(),
      })),
      ...impactOutcomes.map((a) => ({
        id: a.id,
        type: "outcome" as const,
        title: a.title,
        sub: a.kind,
        status: a.status,
        evidenceCount: Array.isArray(a.evidenceLinks) ? (a.evidenceLinks as unknown[]).length : 0,
        reviewerName: a.reviewer?.name ?? null,
        reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
        updatedAt: a.updatedAt.toISOString(),
      })),
    ].sort((x, y) => new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime()),
  };

  return <StudentDetailScreen student={student} backHref={viewer.role === "admin" ? "/students" : "/reviews"} />;
}
