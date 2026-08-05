"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordWithTokenAction, type FormState } from "@/lib/actions/auth";
import PasswordField from "./PasswordField";
import styles from "./auth.module.css";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetPasswordWithTokenAction, {});

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>TA</div>
        <div>
          <div className={styles.brandName}>TechAscend</div>
          <div className={styles.brandSub}>AI-Native Ecosystem</div>
        </div>
      </div>

      <h1 className={styles.title}>Choose a new password</h1>
      <p className={styles.sub}>Pick something you&apos;ll remember — at least 8 characters.</p>

      {state.ok ? (
        <>
          <div className={styles.success}>
            Your password has been updated. You can now sign in with it.
          </div>
          <p className={styles.foot} style={{ marginTop: 16 }}>
            <Link className={styles.link} href="/login">Go to sign in</Link>
          </p>
        </>
      ) : (
        <>
          {state.error ? <div className={styles.error}>{state.error}</div> : null}
          <form action={action}>
            <input type="hidden" name="token" value={token} />
            <PasswordField
              id="password"
              name="password"
              label="New password"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
            />
            <button className={styles.btn} type="submit" disabled={pending}>
              {pending ? "Updating…" : "Update password"}
            </button>
          </form>
          <p className={styles.foot} style={{ marginTop: 14 }}>
            <Link className={styles.link} href="/login">Back to sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}
