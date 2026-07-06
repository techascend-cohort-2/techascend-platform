"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type FormState } from "@/lib/actions/auth";
import PasswordField from "./PasswordField";
import styles from "./auth.module.css";

// defaultRole is kept for compatibility with the /signup page, but every
// signup is an application to the fellowship — there is no role picker.
export default function SignupForm({ defaultRole: _defaultRole = "student" }: { defaultRole?: string }) {
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
      <p className={styles.sub}>Apply to join the fellowship — your application goes straight to our team.</p>

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
        <PasswordField id="password" name="password" label="Password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} />
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="city">City</label>
            <input className={styles.input} id="city" name="city" type="text" placeholder="Douala" autoComplete="address-level2" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Phone (optional)</label>
            <input className={styles.input} id="phone" name="phone" type="text" placeholder="677123456" autoComplete="tel" />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="track">Preferred track</label>
          <select className={styles.select} id="track" name="track" defaultValue="A">
            <option value="A">A · AI Software Engineering</option>
            <option value="B">B · AI Product &amp; Automation</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="motivation">Why do you want to join?</label>
          <textarea className={styles.input} id="motivation" name="motivation" rows={3} placeholder="Tell us a little about you and what you want to build." />
        </div>
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account & apply"}
        </button>
      </form>

      <p className={styles.foot}>
        Already have an account? <Link className={styles.link} href="/login">Sign in</Link>
      </p>
    </div>
  );
}
