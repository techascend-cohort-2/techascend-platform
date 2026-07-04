import { redirect } from "next/navigation";
import { getCurrentUser, getPartnersAdmin } from "@/lib/queries";
import PartnersAdminScreen from "@/components/platform/screens/PartnersAdminScreen";

export default async function PartnersAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orgs = await getPartnersAdmin();

  return (
    <PartnersAdminScreen
      orgs={orgs.map((o) => ({
        id: o.id,
        name: o.name,
        abbr: o.abbr,
        type: o.type,
        contribution: o.contribution,
        contactInfo: o.contactInfo,
        website: o.website,
        users: o.users.map((u) => ({ id: u.id, name: u.name, email: u.email })),
        counts: { opportunities: o._count.opportunities, pipelineCards: o._count.pipelineCards },
      }))}
    />
  );
}
