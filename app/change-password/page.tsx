import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Set a new password · TechAscend" };

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className={styles.wrap}>
      <ChangePasswordForm forced={session.user.mustChangePassword} />
    </main>
  );
}
