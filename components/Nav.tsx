"use client";

import { useState } from "react";
import styles from "./Nav.module.css";

const links = [
  { href: "#model", label: "The Model" },
  { href: "#tracks", label: "Tracks" },
  { href: "#journey", label: "Journey" },
  { href: "#partners", label: "For Partners" },
  { href: "#impact", label: "Impact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand}>
          <div className={styles.logo}>TA</div>
          <div className={styles.brandName}>TechAscend</div>
        </a>
        <nav className={styles.nav}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#apply" className={styles.signin}>
          Sign in
        </a>
        <a href="#apply" className={styles.apply}>
          Apply now
        </a>
        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div className={`${styles.mobileMenu} ${open ? styles.open : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#apply" className={styles.mobileApply} onClick={() => setOpen(false)}>
          Apply now
        </a>
      </div>
    </header>
  );
}
