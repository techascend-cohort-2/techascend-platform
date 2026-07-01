import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLE_HOME, isRole } from "@/lib/constants";
import SignupForm from "@/components/auth/SignupForm";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Create account · TechAscend" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    const role = session.user.role;
    redirect(isRole(role) ? ROLE_HOME[role] : "/dashboard");
  }
  const { role } = await searchParams;
  return (
    <main className={styles.wrap}>
      <SignupForm defaultRole={role === "partner" ? "partner" : "student"} />
    </main>
  );
}
