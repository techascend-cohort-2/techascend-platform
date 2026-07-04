import { redirect } from "next/navigation";
import { getCurrentUser, getEventsForRole } from "@/lib/queries";
import { isStaff } from "@/lib/constants";
import EventsScreen, { type EventItem } from "@/components/platform/screens/EventsScreen";

type DbEvent = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  audience: string;
  location: string | null;
  link: string | null;
  startsAt: Date;
  endsAt: Date | null;
};

function serialize(e: DbEvent): EventItem {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    kind: e.kind,
    audience: e.audience,
    location: e.location,
    link: e.link,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : null,
  };
}

export default async function EventsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { upcoming, past } = await getEventsForRole(user.role);

  return (
    <EventsScreen
      upcoming={upcoming.map(serialize)}
      past={past.map(serialize)}
      isStaff={isStaff(user.role)}
    />
  );
}
