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
        posterName: opp.partner?.name ?? "TechAscend",
        myInterest: opp.interests.length > 0,
      }))}
      interests={interests.map((it) => ({
        id: it.id,
        title: it.opportunity.title,
        status: it.status,
      }))}
      totalLabel={totalLabel}
      meId={user.id}
    />
  );
}
