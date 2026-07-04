import { redirect } from "next/navigation";
import { getCurrentUser, getStudentsAdmin } from "@/lib/queries";
import MembersScreen from "@/components/platform/screens/MembersScreen";
import StudentImport from "@/components/platform/screens/StudentImport";

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { users, cohorts } = await getStudentsAdmin();
  const isAdmin = user.role === "admin";
  const cohortOptions = cohorts.map((c) => ({ id: c.id, name: c.name }));

  return (
    <>
      {isAdmin ? (
        <div className="pf-screen pf-w1180" style={{ paddingBottom: 0 }}>
          <StudentImport cohorts={cohortOptions} />
        </div>
      ) : null}
      <MembersScreen
        isAdmin={isAdmin}
        cohorts={cohortOptions}
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
    </>
  );
}
