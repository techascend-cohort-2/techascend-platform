import { redirect } from "next/navigation";
import { getCurrentUser, getPartnerOverview } from "@/lib/queries";
import PartnerScreen from "@/components/platform/screens/PartnerScreen";

export default async function PartnerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const data = await getPartnerOverview();
  return <PartnerScreen pipeline={data.pipeline} talent={data.talent} impact={data.impact} />;
}
