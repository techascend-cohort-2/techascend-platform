import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLE_HOME, isRole } from "@/lib/constants";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Reset password · TechAscend" };

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) {
    const role = session.user.role;
    redirect(isRole(role) ? ROLE_HOME[role] : "/dashboard");
  }
  return (
    <main className={styles.wrap}>
      <ForgotPasswordForm />
    </main>
  );
}
