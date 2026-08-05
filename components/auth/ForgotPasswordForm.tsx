"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type FormState } from "@/lib/actions/auth";
import styles from "./auth.module.css";

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordResetAction, {});

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>TA</div>
        <div>
          <div className={styles.brandName}>TechAscend</div>
          <div className={styles.brandSub}>AI-Native Ecosystem</div>
        </div>
      </div>

      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.sub}>Enter your email and we&apos;ll send you a link to set a new password.</p>

      {state.ok ? (
        <>
          <div className={styles.success}>
            If an account matches that email, a reset link is on its way. The link expires in an hour — check your
            inbox (and spam). Still stuck? Ask the community team to send you one.
          </div>
          <p className={styles.foot} style={{ marginTop: 16 }}>
            <Link className={styles.link} href="/login">Back to sign in</Link>
          </p>
        </>
      ) : (
        <>
          {state.error ? <div className={styles.error}>{state.error}</div> : null}
          <form action={action}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email or phone</label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="text"
                placeholder="you@example.com or 677123456"
                required
                autoComplete="username"
              />
            </div>
            <button className={styles.btn} type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <p className={styles.foot} style={{ marginTop: 14 }}>
            Remembered it? <Link className={styles.link} href="/login">Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}
