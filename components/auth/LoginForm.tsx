"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type FormState } from "@/lib/actions/auth";
import styles from "./auth.module.css";

export default function LoginForm() {
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

      {state.error ? <div className={styles.error}>{state.error}</div> : null}

      <form id="login-form" action={action}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input className={styles.input} id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
        </div>
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
