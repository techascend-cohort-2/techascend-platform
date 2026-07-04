import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser, getApplicationsAdmin } from "@/lib/queries";
import ApplicationsScreen from "@/components/platform/screens/ApplicationsScreen";

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [apps, users] = await Promise.all([
    getApplicationsAdmin(),
    prisma.user.findMany({ select: { email: true } }),
  ]);
  const emails = new Set(users.map((u) => u.email));

  return (
    <ApplicationsScreen
      applications={apps.map((a) => ({
        id: a.id,
        role: a.role,
        name: a.name,
        email: a.email,
        phone: a.phone,
        city: a.city,
        track: a.track,
        org: a.org,
        motivation: a.motivation,
        status: a.status,
        reviewNote: a.reviewNote,
        createdAt: a.createdAt.toISOString(),
        hasAccount: emails.has(a.email),
        reviewedByName: a.reviewedBy?.name ?? null,
      }))}
    />
  );
}
