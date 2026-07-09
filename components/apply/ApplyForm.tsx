"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitApplicationAction } from "@/lib/actions/applications";
import styles from "./Apply.module.css";

type Role = "learner" | "partner";

const cities = ["Douala", "Yaoundé", "Buea", "Other / outside Cameroon"];
const tracks = ["Track A — AI Software Engineering", "Track B — AI Product & Automation", "Not sure yet"];
const partnerTypes = ["Funding / sponsorship", "Hiring partner", "Technology partner", "Academic partner", "Government / NGO"];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApplyForm({
  cohortOpen,
  cohortName,
}: {
  cohortOpen: boolean;
  cohortName: string | null;
}) {
  const params = useSearchParams();
  const initialRole: Role = params.get("role") === "partner" ? "partner" : "learner";

  const [role, setRole] = useState<Role>(initialRole);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function set(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  }

  const fields =
    role === "learner"
      ? ["name", "email", "city", "track", "motivation"]
      : ["org", "name", "email", "ptype", "message"];

  function validate() {
    const e: Record<string, string> = {};
    for (const f of fields) {
      if (!values[f]?.trim()) e[f] = "This field is required";
    }
    if (values.email && !emailRe.test(values.email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    const fd = new FormData();
    fd.set("role", role);
    fd.set("name", values.name ?? "");
    fd.set("email", values.email ?? "");
    if (values.org) fd.set("org", values.org);
    // Map "Track A — …" to the "A"/"B" code the backend expects.
    const trackCode = values.track?.match(/Track\s+([AB])/i)?.[1]?.toUpperCase();
    if (trackCode) fd.set("track", trackCode);
    fd.set("motivation", (role === "learner" ? values.motivation : values.message) ?? "");
    // Preserve every raw field for admin review.
    for (const [k, v] of Object.entries(values)) fd.set(k, v);
    fd.set("role", role);

    try {
      const res = await submitApplicationAction({}, fd);
      if (res.error) {
        setServerError(res.error);
      } else {
        setDone(true);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function switchRole(r: Role) {
    setRole(r);
    setErrors({});
    setDone(false);
  }

  if (done) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className={styles.successTitle}>
          {role === "learner" ? "Application received" : "Thanks — we'll be in touch"}
        </h1>
        <p className={styles.successText}>
          {role === "learner" ? (
            <>
              Thanks {values.name?.split(" ")[0] || "there"}! Your application
              {cohortName ? (
                <>
                  {" "}for <b>{cohortName}</b>
                </>
              ) : null}{" "}
              is in. We&apos;ll email <b>{values.email}</b> with next steps within a few days.
            </>
          ) : (
            <>
              Thanks {values.name?.split(" ")[0] || "there"}! Our partnerships team will
              reach out to <b>{values.org}</b> at <b>{values.email}</b> shortly.
            </>
          )}
        </p>
        <Link href="/" className={styles.successBtn}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.toggle}>
        <button className={`${styles.toggleBtn} ${role === "learner" ? styles.toggleActive : ""}`} onClick={() => switchRole("learner")}>
          I want to learn &amp; earn
        </button>
        <button className={`${styles.toggleBtn} ${role === "partner" ? styles.toggleActive : ""}`} onClick={() => switchRole("partner")}>
          I want to partner
        </button>
      </div>

      <h1 className={styles.title}>
        {role === "learner" ? "Apply to TechAscend" : "Partner with TechAscend"}
      </h1>
      <p className={styles.sub}>
        {role === "learner"
          ? "For women 18–35 in Cameroon ready to build with AI and generate real income. It takes about 3 minutes."
          : "Sponsor a cohort, hire AI-native talent, or supply tools and infrastructure. Tell us how you'd like to work together."}
      </p>

      {role === "learner" && !cohortOpen ? (
        <div className={styles.card}>
          <div
            style={{
              background: "#fdecef",
              border: "1px solid #f6c9d3",
              color: "#b3243f",
              fontSize: 13.5,
              lineHeight: 1.6,
              padding: "14px 16px",
              borderRadius: 10,
            }}
          >
            Applications are closed right now — the current cohort has already started. Check back soon, or{" "}
            <a href="mailto:hello@tech-ascend.com" style={{ color: "inherit", fontWeight: 700 }}>
              email us
            </a>{" "}
            to be notified when the next cohort opens.
          </div>
        </div>
      ) : (
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        {role === "partner" ? (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="org">Organisation</label>
            <input id="org" className={`${styles.input} ${errors.org ? styles.invalid : ""}`} value={values.org || ""} onChange={(e) => set("org", e.target.value)} placeholder="e.g. MTN Foundation" />
            {errors.org ? <div className={styles.error}>{errors.org}</div> : null}
          </div>
        ) : null}

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">{role === "learner" ? "Full name" : "Contact name"}</label>
            <input id="name" className={`${styles.input} ${errors.name ? styles.invalid : ""}`} value={values.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
            {errors.name ? <div className={styles.error}>{errors.name}</div> : null}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" type="email" className={`${styles.input} ${errors.email ? styles.invalid : ""}`} value={values.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
            {errors.email ? <div className={styles.error}>{errors.email}</div> : null}
          </div>
        </div>

        {role === "learner" ? (
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">City</label>
              <select id="city" className={`${styles.select} ${errors.city ? styles.invalid : ""}`} value={values.city || ""} onChange={(e) => set("city", e.target.value)}>
                <option value="">Select…</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city ? <div className={styles.error}>{errors.city}</div> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="track">Preferred track</label>
              <select id="track" className={`${styles.select} ${errors.track ? styles.invalid : ""}`} value={values.track || ""} onChange={(e) => set("track", e.target.value)}>
                <option value="">Select…</option>
                {tracks.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.track ? <div className={styles.error}>{errors.track}</div> : null}
            </div>
          </div>
        ) : (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ptype">Partnership type</label>
            <select id="ptype" className={`${styles.select} ${errors.ptype ? styles.invalid : ""}`} value={values.ptype || ""} onChange={(e) => set("ptype", e.target.value)}>
              <option value="">Select…</option>
              {partnerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.ptype ? <div className={styles.error}>{errors.ptype}</div> : null}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="msg">
            {role === "learner" ? "Why do you want to join?" : "How would you like to work with us?"}
          </label>
          <textarea
            id="msg"
            className={`${styles.textarea} ${errors[role === "learner" ? "motivation" : "message"] ? styles.invalid : ""}`}
            value={values[role === "learner" ? "motivation" : "message"] || ""}
            onChange={(e) => set(role === "learner" ? "motivation" : "message", e.target.value)}
            placeholder={role === "learner" ? "Tell us about a problem you'd love to solve with technology…" : "Goals, budget, timeline, or anything else…"}
          />
          {errors[role === "learner" ? "motivation" : "message"] ? (
            <div className={styles.error}>{errors[role === "learner" ? "motivation" : "message"]}</div>
          ) : null}
        </div>

        {serverError ? <div className={styles.error} style={{ marginBottom: 10 }}>{serverError}</div> : null}
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting
            ? "Submitting…"
            : role === "learner"
              ? "Submit application"
              : "Send partnership enquiry"}
        </button>
        <div className={styles.note}>Free to apply · We never share your details.</div>
      </form>
      )}
    </>
  );
}
