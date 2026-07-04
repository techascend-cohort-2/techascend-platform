import { redirect } from "next/navigation";
import { getCurrentUser, getOpportunitiesData, asStringArray } from "@/lib/queries";
import OpportunitiesScreen from "@/components/platform/screens/OpportunitiesScreen";

export default async function OpportunitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const opportunities = await getOpportunitiesData(user.id, user.role);

  return (
    <OpportunitiesScreen
      opportunities={opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        type: opp.type,
        pay: opp.pay,
        skills: asStringArray(opp.skills),
        location: opp.location,
        status: opp.status,
        createdAt: opp.createdAt.toISOString(),
        postedById: opp.postedById,
        posterName: opp.partner?.name ?? opp.postedBy.name,
        interestedCount: opp._count.interests,
        myInterest: opp.interests.some((i) => i.userId === user.id),
        interestedUsers: opp.interests.flatMap((i) =>
          "user" in i && i.user ? [{ id: i.user.id, name: i.user.name }] : [],
        ),
      }))}
      me={{ id: user.id, role: user.role }}
    />
  );
}
