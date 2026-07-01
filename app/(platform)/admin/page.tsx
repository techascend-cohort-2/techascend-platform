import { redirect } from "next/navigation";
import { getCurrentUser, getAdminOverview } from "@/lib/queries";
import AdminScreen from "@/components/platform/screens/AdminScreen";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getAdminOverview();
  return <AdminScreen kpis={data.kpis} cohorts={data.cohorts} enrollBars={data.enrollBars} riskList={data.riskList} partnerMini={data.partnerMini} />;
}
