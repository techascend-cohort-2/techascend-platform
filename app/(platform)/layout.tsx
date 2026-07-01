import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";
import PlatformShell, { type ShellUser } from "@/components/platform/PlatformShell";
import type { Persona } from "@/lib/platformData";
import "./platform.css";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const persona = (["student", "admin", "partner"].includes(user.role) ? user.role : "student") as Persona;

  const shellUser: ShellUser = {
    name: user.name,
    initials: user.initials ?? user.name.slice(0, 2).toUpperCase(),
    title: user.title ?? (persona === "student" ? "Fellow" : persona),
    persona,
  };

  return <PlatformShell user={shellUser}>{children}</PlatformShell>;
}
