import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLE_HOME, isRole } from "@/lib/constants";
import LoginForm from "@/components/auth/LoginForm";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Sign in · TechAscend" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    const role = session.user.role;
    redirect(isRole(role) ? ROLE_HOME[role] : "/dashboard");
  }
  const { changed } = await searchParams;
  return (
    <main className={styles.wrap}>
      <LoginForm passwordChanged={changed === "1"} />
    </main>
  );
}
