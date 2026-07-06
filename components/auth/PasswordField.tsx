"use client";

import { useState } from "react";
import styles from "./auth.module.css";

export default function PasswordField({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  minLength,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.passWrap}>
        <input
          className={`${styles.input} ${styles.passInput}`}
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          minLength={minLength}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={-1}
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0112 20c-6 0-10-6-10-8 0-.98 1.02-2.98 2.68-4.74M9.9 4.24A10.5 10.5 0 0112 4c6 0 10 6 10 8 0 .8-.6 2.14-1.68 3.44M14.12 14.12a3 3 0 11-4.24-4.24" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
