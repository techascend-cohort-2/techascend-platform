"use client";

import { useActionState } from "react";
import { changePasswordAction, type FormState } from "@/lib/actions/auth";
import PasswordField from "./PasswordField";
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
        <PasswordField
          id="current"
          name="current"
          label={forced ? "Temporary password" : "Current password"}
          autoComplete="current-password"
        />
        <PasswordField
          id="next"
          name="next"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
        />
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save & continue"}
        </button>
      </form>
    </div>
  );
}
