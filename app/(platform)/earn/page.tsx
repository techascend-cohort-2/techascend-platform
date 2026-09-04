import { redirect } from "next/navigation";
import { getCurrentUser, getEarnData } from "@/lib/queries";
import EarnHub from "@/components/platform/screens/EarnHub";

export default async function EarnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { payouts, opportunities, interests, totalLabel } = await getEarnData(user.id);

  return (
    <EarnHub
      payouts={payouts.map((p) => ({
        id: p.id,
        amount: p.amount,
        note: p.note,
        occurredAt: p.occurredAt.toISOString(),
      }))}
      opportunities={opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        type: opp.type,
        pay: opp.pay,
        link: opp.link,
        deadline: opp.deadline ? opp.deadline.toISOString() : null,
        posterName: opp.partner?.name ?? "TechAscend",
        myInterest: opp.interests.length > 0,
        myInterestStatus: opp.interests[0]?.status ?? null,
      }))}
      interests={interests.map((it) => ({
        id: it.id,
        opportunityId: it.opportunityId,
        title: it.opportunity.title,
        link: it.opportunity.link,
        status: it.status,
      }))}
      totalLabel={totalLabel}
      meId={user.id}
    />
  );
}
