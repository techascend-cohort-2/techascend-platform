import { redirect } from "next/navigation";
import { getCurrentUser, getNotifications } from "@/lib/queries";
import PlatformShell, { type ShellUser, type ShellNotification } from "@/components/platform/PlatformShell";
import type { Persona } from "@/lib/platformData";
import { isRole } from "@/lib/constants";
import "./platform.css";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Belt-and-braces on top of the middleware check in auth.config.ts: this
  // reads the live DB value (not the JWT snapshot), so it also catches the
  // moment right after sign-in when a client-side transition can otherwise
  // slip past the edge check before the next hard navigation.
  if (user.mustChangePassword) redirect("/change-password");

  const persona = (isRole(user.role) ? user.role : "applicant") as Persona;
  const { items, unread } = await getNotifications(user.id);

  const shellUser: ShellUser = {
    name: user.name,
    initials: user.initials ?? user.name.slice(0, 2).toUpperCase(),
    title: user.title ?? persona,
    persona,
  };
  const notifications: ShellNotification[] = items.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    href: n.href,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <PlatformShell user={shellUser} notifications={notifications} unreadCount={unread}>
      {children}
    </PlatformShell>
  );
}
