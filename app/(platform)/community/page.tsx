import { redirect } from "next/navigation";
import { getCurrentUser, getCommunityFeed } from "@/lib/queries";
import { initialsOf, avatarBgFor } from "@/lib/constants";
import CommunityScreen from "@/components/platform/screens/CommunityScreen";

export default async function CommunityPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts = await getCommunityFeed();

  return (
    <CommunityScreen
      posts={posts.map((p) => ({
        id: p.id,
        body: p.body,
        pinned: p.pinned,
        createdAt: p.createdAt.toISOString(),
        author: {
          id: p.author.id,
          name: p.author.name,
          initials: p.author.initials ?? initialsOf(p.author.name),
          avatarBg: p.author.avatarBg ?? avatarBgFor(p.author.name),
          role: p.author.role,
          title: p.author.title,
        },
      }))}
      me={{ id: user.id, role: user.role, name: user.name }}
    />
  );
}
