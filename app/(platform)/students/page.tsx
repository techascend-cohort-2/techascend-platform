import { redirect } from "next/navigation";
import { getCurrentUser, getStudentsAdmin, getStudentProgressInsights } from "@/lib/queries";
import MembersScreen from "@/components/platform/screens/MembersScreen";
import StudentImport from "@/components/platform/screens/StudentImport";

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "admin";
  const [{ users, cohorts }, { currentPhaseName, insights }] = await Promise.all([
    getStudentsAdmin(),
    getStudentProgressInsights(),
  ]);
  const cohortOptions = cohorts.map((c) => ({ id: c.id, name: c.name }));
  const insightsByUserId = Object.fromEntries(
    insights.map((i) => [
      i.userId,
      { status: i.status, phasePct: i.phasePct, expectedPct: i.expectedPct, daysSinceActivity: i.daysSinceActivity },
    ]),
  );

  return (
    <>
      {isAdmin ? (
        <div className="pf-screen pf-w1180" style={{ paddingBottom: 0 }}>
          <StudentImport cohorts={cohortOptions} />
        </div>
      ) : null}
      <MembersScreen
        viewerRole={isAdmin ? "admin" : "manager"}
        cohorts={cohortOptions}
        insightsByUserId={insightsByUserId}
        currentPhaseName={currentPhaseName}
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
