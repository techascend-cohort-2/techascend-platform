"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type FormState } from "@/lib/actions/auth";
import styles from "./auth.module.css";

export default function SignupForm({ defaultRole = "student" }: { defaultRole?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signupAction, {});

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>TA</div>
        <div>
          <div className={styles.brandName}>TechAscend</div>
          <div className={styles.brandSub}>AI-Native Ecosystem</div>
        </div>
      </div>

      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.sub}>Join the ecosystem — learn, build, and earn with AI.</p>

      {state.error ? <div className={styles.error}>{state.error}</div> : null}

      <form action={action}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Full name</label>
          <input className={styles.input} id="name" name="name" placeholder="Amina Njoya" required autoComplete="name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input className={styles.input} id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} id="password" name="password" type="password" placeholder="At least 8 characters" required autoComplete="new-password" minLength={8} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="role">I am a</label>
            <select className={styles.select} id="role" name="role" defaultValue={defaultRole}>
              <option value="student">Learner</option>
              <option value="partner">Partner</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="track">Track (learners)</label>
            <select className={styles.select} id="track" name="track" defaultValue="A">
              <option value="A">A · Software Eng</option>
              <option value="B">B · Automation</option>
            </select>
          </div>
        </div>
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className={styles.foot}>
        Already have an account? <Link className={styles.link} href="/login">Sign in</Link>
      </p>
    </div>
  );
}
