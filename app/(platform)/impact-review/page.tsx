import { redirect } from "next/navigation";
import { getCurrentUser, getImpactQueue, getImpactDashboard } from "@/lib/queries";
import { isStaff, impactTier, formatFcfa } from "@/lib/constants";
import {
  PROJECT_CONTEXT_LABELS,
  PROJECT_MATURITY_LABELS,
  TESTER_KIND_LABELS,
  ACHIEVEMENT_KIND_LABELS,
  CONTRIBUTION_LABELS,
} from "@/components/platform/impactStatus";
import ImpactReviewScreen, { type QueueItem } from "@/components/platform/screens/ImpactReviewScreen";

const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

export default async function ImpactReviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isStaff(user.role)) redirect("/dashboard");

  const [{ pendingProjects, pendingOutcomes, decidedProjects, decidedOutcomes }, dashboard] = await Promise.all([
    getImpactQueue(),
    getImpactDashboard(),
  ]);

  const projectItem = (p: (typeof pendingProjects)[number]): QueueItem => {
    const links: QueueItem["links"] = [];
    if (p.githubUrl) links.push({ label: "GitHub", url: p.githubUrl });
    if (p.liveUrl) links.push({ label: "Live", url: p.liveUrl });
    if (p.demoVideoUrl) links.push({ label: "Demo video", url: p.demoVideoUrl });
    asStrings(p.screenshotUrls).forEach((u, i) => links.push({ label: `Screenshot ${i + 1}`, url: u }));
    asStrings(p.evidenceLinks).forEach((u, i) => links.push({ label: `Evidence ${i + 1}`, url: u }));
    const summaryLines: QueueItem["summaryLines"] = [
      { label: "Kind", value: PROJECT_CONTEXT_LABELS[p.projectContext] ?? p.projectContext },
      { label: "Status", value: PROJECT_MATURITY_LABELS[p.maturity] ?? p.maturity },
      { label: "Problem", value: p.problem ?? "—" },
    ];
    if (p.externalTested) {
      summaryLines.push({
        label: "External testing",
        value: `${p.testerKind ? TESTER_KIND_LABELS[p.testerKind] ?? p.testerKind : "?"}${p.orgName ? ` — ${p.orgName}` : ""}${p.userCount ? ` · ${p.userCount} users` : ""}`,
      });
      if (p.feedback) summaryLines.push({ label: "Feedback", value: p.feedback });
      if (p.changesMade) summaryLines.push({ label: "Changed after feedback", value: p.changesMade });
    }
    return {
      id: p.id,
      type: "project",
      title: p.title,
      createdAt: p.createdAt.toISOString(),
      status: p.status,
      tier: impactTier(p.evidenceLinks, p.status),
      user: p.user,
      summaryLines,
      links,
      reviewerName: "reviewer" in p && p.reviewer ? (p.reviewer as { name: string }).name : null,
      reviewedAt: p.reviewedAt ? p.reviewedAt.toISOString() : null,
      reviewNote: p.reviewNote,
    };
  };

  const outcomeItem = (a: (typeof pendingOutcomes)[number]): QueueItem => {
    const links: QueueItem["links"] = asStrings(a.evidenceLinks).map((u, i) => ({ label: `Evidence ${i + 1}`, url: u }));
    const summaryLines: QueueItem["summaryLines"] = [
      { label: "Kind", value: ACHIEVEMENT_KIND_LABELS[a.kind] ?? a.kind },
    ];
    if (a.organizationName) summaryLines.push({ label: "Organization", value: a.organizationName });
    if (a.roleTitle) summaryLines.push({ label: "Role", value: a.roleTitle });
    if (a.amount) summaryLines.push({ label: "Amount", value: a.currency === "FCFA" || !a.currency ? formatFcfa(a.amount) : `${a.amount} ${a.currency}` });
    if (a.occurredAt) summaryLines.push({ label: "When", value: a.occurredAt.toLocaleDateString("en-GB") });
    summaryLines.push({ label: "TechAscend contribution", value: CONTRIBUTION_LABELS[a.techascendContribution] ?? a.techascendContribution });
    if (a.contributionNote) summaryLines.push({ label: "How", value: a.contributionNote });
    return {
      id: a.id,
      type: "achievement",
      title: a.title,
      createdAt: a.createdAt.toISOString(),
      status: a.status,
      tier: impactTier(a.evidenceLinks, a.status),
      user: a.user,
      summaryLines,
      links,
      reviewerName: "reviewer" in a && a.reviewer ? (a.reviewer as { name: string }).name : null,
      reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
      reviewNote: a.reviewNote,
    };
  };

  const pending = [...pendingProjects.map(projectItem), ...pendingOutcomes.map(outcomeItem)].sort(
    (x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime(),
  );
  const decided = [...decidedProjects.map(projectItem), ...decidedOutcomes.map(outcomeItem)].sort(
    (x, y) => new Date(y.reviewedAt ?? y.createdAt).getTime() - new Date(x.reviewedAt ?? x.createdAt).getTime(),
  );

  return <ImpactReviewScreen dashboard={dashboard} pending={pending} decided={decided.slice(0, 10)} />;
}
