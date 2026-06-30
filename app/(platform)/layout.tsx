"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { ToastProvider } from "@/components/platform/Toast";
import {
  NAV,
  ROUTES,
  PERSONA_INFO,
  PERSONA_HOME,
  ICON,
  notifications,
  SEARCH_TARGETS,
  type Persona,
} from "@/lib/platformData";
import "./platform.css";

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
  const router = useRouter();
  const meta = ROUTES[pathname] ?? ROUTES["/dashboard"];
  const persona = meta.persona;
  const user = PERSONA_INFO[persona];
  const nav = NAV[persona];

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [bellRead, setBellRead] = useState(false);

  // close transient UI whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setBellOpen(false);
    setQuery("");
  }, [pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_TARGETS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.sub.toLowerCase().includes(q),
    );
  }, [query]);

  function goto(href: string) {
    setQuery("");
    setSearchOpen(false);
    setBellOpen(false);
    router.push(href);
  }

  return (
    <ToastProvider>
      <div className="platform">
        <div className="pf-app">
          {menuOpen ? <div className="pf-backdrop" onClick={() => setMenuOpen(false)} aria-hidden /> : null}

          <aside className={`pf-aside ${menuOpen ? "pf-aside-open" : ""}`}>
            <div className="pf-brand">
              <div className="pf-logo">TA</div>
              <div>
                <div className="pf-brand-name">TechAscend</div>
                <div className="pf-brand-sub">AI-Native Ecosystem</div>
              </div>
              <button className="pf-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
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
                const active = item.href === pathname;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`pf-nav-item ${active ? "pf-nav-active" : ""} ${item.soon ? "pf-nav-soon" : ""}`}
                  >
                    <Icon path={item.icon} size={19} strokeWidth={1.7} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge ? <span className="pf-nav-badge">{item.badge}</span> : null}
                    {item.soon ? <span className="pf-nav-soonbadge">Soon</span> : null}
                  </Link>
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
              <button className="pf-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div style={{ minWidth: 0 }}>
                <div className="pf-title">{meta.title}</div>
                <div className="pf-sub">{meta.sub}</div>
              </div>
              <div style={{ flex: 1 }} />

              {/* search */}
              <div className="pf-search-wrap">
                <div className="pf-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A93AD" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && results[0]) goto(results[0].href);
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    placeholder="Search lessons, projects, people"
                  />
                </div>
                {searchOpen && query.trim() ? (
                  <div className="pf-search-results">
                    {results.length ? (
                      results.map((r) => (
                        <button key={r.href} className="pf-result" onClick={() => goto(r.href)}>
                          <span className="pf-result-label">{r.label}</span>
                          <span className="pf-result-sub">{r.sub}</span>
                        </button>
                      ))
                    ) : (
                      <div className="pf-result-empty">No matches for “{query}”</div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* notifications */}
              <div className="pf-bell-wrap">
                <button
                  className="pf-iconbtn"
                  aria-label="Notifications"
                  onClick={() => {
                    setBellOpen((v) => !v);
                    setBellRead(true);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A5470" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 01-3.4 0" />
                  </svg>
                  {!bellRead ? <span className="pf-bell-dot" /> : null}
                </button>
                {bellOpen ? (
                  <div className="pf-bell-menu">
                    <div className="pf-bell-head">
                      <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                      <button className="pf-link" onClick={() => setBellRead(true)} style={{ fontSize: 11.5 }}>
                        Mark all read
                      </button>
                    </div>
                    {notifications.map((n) => (
                      <button key={n.title} className="pf-bell-item" onClick={() => goto(n.href)}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.4 }}>{n.title}</span>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{n.time}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {(searchOpen || bellOpen) ? (
                <div
                  className="pf-overlay"
                  onClick={() => {
                    setSearchOpen(false);
                    setBellOpen(false);
                  }}
                  aria-hidden
                />
              ) : null}
            </header>

            <div className="pf-scroll">{children}</div>

            {pathname !== "/tutor" ? (
              <Link href="/tutor" className="pf-ask">
                <Icon path={ICON.star} size={18} strokeWidth={2} />
                Ask AI
              </Link>
            ) : null}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
