"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export type BadgeAward = {
  id: string;
  badgeName: string;
  phaseName: string | null;
  earnedAt: string;
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
};

export type CertAward = {
  id: string;
  code: string;
  title: string;
  issuedAt: string;
  user: { id: string; name: string; email: string; track: string | null; initials: string | null; avatarBg: string | null };
};

function Avatar({ initials, bg }: { initials: string | null; bg: string | null }) {
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center",
        color: "#fff", fontWeight: 800, fontSize: 12, background: bg ?? "linear-gradient(135deg,#7C3AED,#D6336C)",
      }}
    >
      {initials ?? "?"}
    </div>
  );
}

export default function AdminBadgesScreen({ badges, certificates }: { badges: BadgeAward[]; certificates: CertAward[] }) {
  const [query, setQuery] = useState("");

  const filteredBadges = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return badges;
    return badges.filter((b) => b.user.name.toLowerCase().includes(q) || b.user.email.toLowerCase().includes(q) || b.badgeName.toLowerCase().includes(q));
  }, [badges, query]);

  const filteredCerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter((c) => c.user.name.toLowerCase().includes(q) || c.user.email.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
  }, [certificates, query]);

  return (
    <div className="pf-screen pf-w1180">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Badges &amp; Certificates</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            {badges.length} badge{badges.length === 1 ? "" : "s"} awarded · {certificates.length} certificate{certificates.length === 1 ? "" : "s"} issued
          </div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student or badge…"
          style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", fontSize: 13.5, width: 260 }}
        />
      </div>

      <div className="pf-card" style={{ marginBottom: 18, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }} className="pf-h">
          Badge awards
        </div>
        {filteredBadges.length === 0 ? (
          <div style={{ padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>
            {badges.length === 0 ? "No badges awarded yet." : "No matches."}
          </div>
        ) : (
          filteredBadges.map((b) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
              <Avatar initials={b.user.initials} bg={b.user.avatarBg} />
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <Link href={`/students/${b.user.id}`} className="pf-link" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
                  {b.user.name}
                </Link>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.user.email}</div>
              </div>
              <span className="pf-badge pf-badge-warn">🏅 {b.badgeName}</span>
              <div style={{ width: 140, fontSize: 12.5, color: "var(--muted)" }}>{b.phaseName ?? "Program"}</div>
              <div style={{ width: 110, fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{dateFmt.format(new Date(b.earnedAt))}</div>
            </div>
          ))
        )}
      </div>

      <div className="pf-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }} className="pf-h">
          Certificates issued
        </div>
        {filteredCerts.length === 0 ? (
          <div style={{ padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>
            {certificates.length === 0 ? "No certificates issued yet." : "No matches."}
          </div>
        ) : (
          filteredCerts.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
              <Avatar initials={c.user.initials} bg={c.user.avatarBg} />
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <Link href={`/students/${c.user.id}`} className="pf-link" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
                  {c.user.name}
                </Link>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.user.email}</div>
              </div>
              <div style={{ width: 200, fontSize: 12.5 }}>{c.title}</div>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, background: "#F4F1FA", border: "1px solid #E7E1F2", padding: "3px 8px", borderRadius: 6 }}>
                {c.code}
              </code>
              <div style={{ width: 100, fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{dateFmt.format(new Date(c.issuedAt))}</div>
              <Link href={`/certificates/${c.code}`} target="_blank" className="pf-btn-soft" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12 }}>
                View ↗
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
