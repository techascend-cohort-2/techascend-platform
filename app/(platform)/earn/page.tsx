import { redirect } from "next/navigation";
import { getCurrentUser, getEarn } from "@/lib/queries";
import EarnScreen from "@/components/platform/screens/EarnScreen";

export default async function EarnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getEarn(user.id);
  return <EarnScreen kpis={data.kpis} gigs={data.gigs} smeGigs={data.smeGigs} payouts={data.payouts} />;
}
