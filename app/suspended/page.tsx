import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";
import { logoutAction } from "@/lib/actions/auth";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Account suspended · TechAscend" };

// Where suspended-but-still-signed-in users land (see app/(platform)/layout).
// Lives outside the (platform) route group so it doesn't hit that layout's
// suspension redirect and loop.
export default async function SuspendedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // No longer suspended? Send them home.
  if (!user.suspendedAt) redirect("/dashboard");

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>TA</div>
          <div>
            <div className={styles.brandName}>TechAscend</div>
            <div className={styles.brandSub}>AI-Native Ecosystem</div>
          </div>
        </div>

        <h1 className={styles.title}>Your account is suspended</h1>
        <p className={styles.sub}>
          Access to the TechAscend platform is currently paused for this account. If you think this is a mistake,
          please reach out to the TechAscend team.
        </p>

        {user.suspendReason ? (
          <div className={styles.error} style={{ marginBottom: 16 }}>
            Reason: {user.suspendReason}
          </div>
        ) : null}

        <form action={logoutAction}>
          <button className={styles.btn} type="submit">Sign out</button>
        </form>
      </div>
    </main>
  );
}
