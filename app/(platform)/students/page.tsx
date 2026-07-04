import { redirect } from "next/navigation";
import { getCurrentUser, getStudentsAdmin } from "@/lib/queries";
import MembersScreen from "@/components/platform/screens/MembersScreen";

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { users, cohorts } = await getStudentsAdmin();

  return (
    <MembersScreen
      isAdmin={user.role === "admin"}
      cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))}
      members={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        track: u.track,
        title: u.title,
        initials: u.initials,
        avatarBg: u.avatarBg,
        cohortId: u.cohortId,
        cohortName: u.cohort?.name ?? null,
        partnerName: u.partner?.name ?? null,
        progress: u.progressPercentage,
        badges: u._count.userBadges,
      }))}
    />
  );
}
