import { redirect } from "next/navigation";
import { getCurrentUser, getMyImpact } from "@/lib/queries";
import { impactTier, formatFcfa } from "@/lib/constants";
import { PROJECT_MATURITY_LABELS } from "@/components/platform/impactStatus";
import MyImpactScreen from "@/components/platform/screens/MyImpactScreen";

const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

export default async function MyImpactPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/dashboard");

  const data = await getMyImpact(user.id);
  const payoutsTotal = data.payouts.reduce((s, p) => s + p.amount, 0);

  // Auto-pulled signals the platform already verified — never re-asked.
  const autoSignals: { label: string; detail: string }[] = [];
  if (data.user.visibilitySubmission?.status === "approved") {
    autoSignals.push({ label: "Professional visibility approved", detail: "your six profile links passed review" });
  }
  for (const c of data.approvedCapstones) {
    autoSignals.push({ label: `Capstone approved: ${c.project.title}`, detail: c.mentorScore ? `mentor score ${c.mentorScore}/100` : "mentor-approved" });
  }
  for (const w of data.wonInterests) {
    autoSignals.push({ label: `Opportunity ${w.status}: ${w.opportunity.title}`, detail: "tracked on the Opportunities board" });
  }
  if (payoutsTotal > 0) {
    autoSignals.push({ label: `Payouts recorded by TechAscend: ${formatFcfa(payoutsTotal)}`, detail: "from the platform ledger" });
  }

  return (
    <MyImpactScreen
      completionPct={data.completionPct}
      checks={data.checks}
      outcomeBoard={data.outcomeBoard}
      cohortCompleted={data.user.cohort?.status === "Completed"}
      baseline={
        data.baseline
          ? {
              studentCompleted: Boolean(data.baseline.studentCompletedAt),
              previousTechTraining: data.baseline.previousTechTraining,
              previousProfessionalTechExperience: data.baseline.previousProfessionalTechExperience,
              employedAtEntry: data.baseline.employedAtEntry,
              techEmploymentAtEntry: data.baseline.techEmploymentAtEntry,
              freelancingAtEntry: data.baseline.freelancingAtEntry,
              techIncomeAtEntry: data.baseline.techIncomeAtEntry,
              hasReliableComputerAccess: data.baseline.hasReliableComputerAccess,
              hasReliableInternetAccess: data.baseline.hasReliableInternetAccess,
              highestEducationLevel: data.baseline.highestEducationLevel,
              opportunityBarrierDeclared: data.baseline.opportunityBarrierDeclared,
              opportunityBarrierSummary: data.baseline.opportunityBarrierSummary,
              consentToAggregatedImpactReporting: data.baseline.consentToAggregatedImpactReporting,
            }
          : null
      }
      projects={data.projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        problem: p.problem,
        projectType: p.projectType,
        projectContext: p.projectContext,
        techStack: asStrings(p.techStack),
        aiTools: p.aiTools,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        demoVideoUrl: p.demoVideoUrl,
        screenshotUrls: asStrings(p.screenshotUrls),
        evidenceLinks: asStrings(p.evidenceLinks),
        maturity: p.maturity,
        maturityLabel: PROJECT_MATURITY_LABELS[p.maturity] ?? p.maturity,
        externalTested: p.externalTested,
        testerKind: p.testerKind,
        orgName: p.orgName,
        userCount: p.userCount,
        feedback: p.feedback,
        changesMade: p.changesMade,
        teamUserIds: asStrings(p.teamUserIds),
        status: p.status,
        tier: impactTier(p.evidenceLinks, p.status),
        reviewNote: p.reviewNote,
      }))}
      outcomes={data.outcomes.map((o) => ({
        id: o.id,
        kind: o.kind,
        title: o.title,
        organizationName: o.organizationName,
        roleTitle: o.roleTitle,
        employmentType: o.employmentType,
        amount: o.amount,
        currency: o.currency,
        occurredAt: o.occurredAt ? o.occurredAt.toISOString() : null,
        startedAt: o.startedAt ? o.startedAt.toISOString() : null,
        techascendContribution: o.techascendContribution,
        contributionNote: o.contributionNote,
        evidenceLinks: asStrings(o.evidenceLinks),
        status: o.status,
        tier: impactTier(o.evidenceLinks, o.status),
        reviewNote: o.reviewNote,
      }))}
      autoSignals={autoSignals}
      payoutsTotalLabel={payoutsTotal > 0 ? formatFcfa(payoutsTotal) : null}
      lastOutcomeCheckInAt={data.user.lastOutcomeCheckInAt ? data.user.lastOutcomeCheckInAt.toISOString() : null}
      cohortMates={data.cohortMates}
    />
  );
}
