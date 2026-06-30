"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import {
  NAV,
  TITLES,
  PERSONA_INFO,
  PERSONA_HOME,
  ICON,
  type Persona,
  type ScreenKey,
} from "@/lib/platformData";
import "./platform.css";

const SCREEN_BY_PATH: Record<string, ScreenKey> = {
  "/dashboard": "dashboard",
  "/learning": "lesson",
  "/tutor": "tutor",
  "/projects": "project",
  "/earn": "earn",
  "/admin": "admin",
  "/partner": "partner",
};

function personaForScreen(screen: ScreenKey): Persona {
  if (screen === "admin") return "admin";
  if (screen === "partner") return "partner";
  return "student";
}

const PERSONAS: { key: Persona; label: string }[] = [
  { key: "student", label: "Student" },
  { key: "admin", label: "Admin" },
  { key: "partner", label: "Partner" },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const screen = SCREEN_BY_PATH[pathname] ?? "dashboard";
  const persona = personaForScreen(screen);
  const [title, sub] = TITLES[screen];
  const user = PERSONA_INFO[persona];
  const nav = NAV[persona];

  const [menuOpen, setMenuOpen] = useState(false);
  // close the mobile drawer whenever the route changes (nav link / persona pill)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="platform">
      <div className="pf-app">
        {menuOpen ? (
          <div className="pf-backdrop" onClick={() => setMenuOpen(false)} aria-hidden />
        ) : null}
        <aside className={`pf-aside ${menuOpen ? "pf-aside-open" : ""}`}>
          <div className="pf-brand">
            <div className="pf-logo">TA</div>
            <div>
              <div className="pf-brand-name">TechAscend</div>
              <div className="pf-brand-sub">AI-Native Ecosystem</div>
            </div>
            <button
              className="pf-drawer-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="pf-pills-wrap">
            <div className="pf-pills">
              {PERSONAS.map((p) => (
                <Link
                  key={p.key}
                  href={PERSONA_HOME[p.key]}
                  className={`pf-pill ${persona === p.key ? "pf-pill-active" : ""}`}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          <nav className="pf-nav">
            {nav.map((item) => {
              const active = item.built && item.screen === screen;
              const cls = active
                ? "pf-nav-item pf-nav-active"
                : item.built
                  ? "pf-nav-item"
                  : "pf-nav-item pf-nav-disabled";
              const inner = (
                <>
                  <Icon path={item.icon} size={19} strokeWidth={1.7} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? <span className="pf-nav-badge">{item.badge}</span> : null}
                </>
              );
              return item.built && item.href ? (
                <Link key={item.label} href={item.href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <div key={item.label} className={cls} aria-disabled>
                  {inner}
                </div>
              );
            })}
          </nav>

          <div className="pf-user-wrap">
            <div className="pf-user">
              <div className="pf-user-av">{user.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pf-user-name">{user.name}</div>
                <div className="pf-user-role">{user.role}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="pf-main">
          <header className="pf-header">
            <button
              className="pf-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div style={{ minWidth: 0 }}>
              <div className="pf-title">{title}</div>
              <div className="pf-sub">{sub}</div>
            </div>
            <div style={{ flex: 1 }} />
            <div className="pf-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A93AD" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input placeholder="Search lessons, projects, people" />
            </div>
            <button className="pf-iconbtn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A5470" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span className="pf-bell-dot" />
            </button>
          </header>

          <div className="pf-scroll">{children}</div>

          {screen !== "tutor" ? (
            <Link href="/tutor" className="pf-ask">
              <Icon path={ICON.star} size={18} strokeWidth={2} />
              Ask AI
            </Link>
          ) : null}
        </main>
      </div>
    </div>
  );
}
