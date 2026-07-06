"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type FormState } from "@/lib/actions/auth";
import PasswordField from "./PasswordField";
import styles from "./auth.module.css";

export default function LoginForm({ passwordChanged = false }: { passwordChanged?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>TA</div>
        <div>
          <div className={styles.brandName}>TechAscend</div>
          <div className={styles.brandSub}>AI-Native Ecosystem</div>
        </div>
      </div>

      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.sub}>Sign in to continue learning and earning.</p>

      {passwordChanged ? (
        <div className={styles.success}>Password updated — sign in with your new password.</div>
      ) : null}
      {state.error ? <div className={styles.error}>{state.error}</div> : null}

      <form id="login-form" action={action}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email or phone</label>
          <input className={styles.input} id="email" name="email" type="text" placeholder="you@example.com or 677123456" required autoComplete="username" />
        </div>
        <PasswordField id="password" name="password" label="Password" placeholder="••••••••" autoComplete="current-password" />
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className={styles.foot}>
        New here? <Link className={styles.link} href="/signup">Create an account</Link>
      </p>
    </div>
  );
}
