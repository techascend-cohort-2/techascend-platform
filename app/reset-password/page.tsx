import Link from "next/link";
import { findValidReset } from "@/lib/reset";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import styles from "@/components/auth/auth.module.css";

export const metadata = { title: "Set a new password · TechAscend" };

// Public page reached from an emailed/issued reset link. We validate the token
// up front so an expired or bogus link shows a clear message instead of a form
// that will only fail on submit. Not a redirect-if-signed-in page: a signed-in
// user may still be completing a reset they requested.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const match = token ? await findValidReset(token) : null;

  return (
    <main className={styles.wrap}>
      {match ? (
        <ResetPasswordForm token={token!} />
      ) : (
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.logo}>TA</div>
            <div>
              <div className={styles.brandName}>TechAscend</div>
              <div className={styles.brandSub}>AI-Native Ecosystem</div>
            </div>
          </div>
          <h1 className={styles.title}>Link expired or invalid</h1>
          <p className={styles.sub}>
            This reset link is no longer valid — it may have expired, already been used, or been replaced by a newer
            one. Request a fresh link to continue.
          </p>
          <p className={styles.foot} style={{ marginTop: 16 }}>
            <Link className={styles.link} href="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      )}
    </main>
  );
}
