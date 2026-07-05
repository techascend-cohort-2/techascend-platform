"use client";

import { useActionState } from "react";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";
import styles from "./auth.module.css";

export default function ChangePasswordForm({ forced }: { forced: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, {});

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>TA</div>
        <div>
          <div className={styles.brandName}>TechAscend</div>
          <div className={styles.brandSub}>AI-Native Ecosystem</div>
        </div>
      </div>

      <h1 className={styles.title}>Set a new password</h1>
      <p className={styles.sub}>
        {forced
          ? "You're signing in with a temporary password. Choose your own to continue."
          : "Update your password below."}
      </p>

      {state.error ? <div className={styles.error}>{state.error}</div> : null}

      <form action={action}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="current">
            {forced ? "Temporary password" : "Current password"}
          </label>
          <input
            className={styles.input}
            id="current"
            name="current"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="next">New password</label>
          <input
            className={styles.input}
            id="next"
            name="next"
            type="password"
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save & continue"}
        </button>
      </form>
    </div>
  );
}
