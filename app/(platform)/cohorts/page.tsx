import { redirect } from "next/navigation";
import { getCurrentUser, getCohortsAdmin } from "@/lib/queries";
import CohortsScreen from "@/components/platform/screens/CohortsScreen";

export default async function CohortsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const cohorts = await getCohortsAdmin();

  return (
    <CohortsScreen
      cohorts={cohorts.map((c) => ({
        id: c.id,
        name: c.name,
        track: c.track,
        status: c.status,
        hub: c.hub,
        startDate: c.startDate?.toISOString() ?? null,
        endDate: c.endDate?.toISOString() ?? null,
        members: c._count.users,
        applicationsOpen: c.applicationsOpen,
      }))}
    />
  );
}
