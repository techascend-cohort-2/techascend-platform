"use client";

import Link from "next/link";
import { useToast } from "./Toast";

export default function ComingSoon({
  feature,
  home = "/dashboard",
}: {
  feature: string;
  home?: string;
}) {
  const toast = useToast();
  return (
    <div className="pf-screen pf-soon">
      <div className="pf-soon-card">
        <div className="pf-soon-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <div className="pf-soon-tag">PART OF THE FULL BUILD</div>
        <h2 className="pf-soon-title">{feature} is coming soon</h2>
        <p className="pf-soon-text">
          This module is mapped out in the TechAscend product plan and lands in an
          upcoming release. The screens you can use today are fully built — jump back
          in below.
        </p>
        <div className="pf-soon-actions">
          <Link href={home} className="pf-btn-grad" style={{ padding: "12px 20px", borderRadius: 12, fontSize: 13.5 }}>
            Return to your workspace
          </Link>
          <button
            className="pf-btn-soft"
            style={{ padding: "12px 20px", borderRadius: 12, fontSize: 13.5 }}
            onClick={() => toast(`We'll notify you when ${feature} is ready ✨`)}
          >
            Notify me
          </button>
        </div>
      </div>
    </div>
  );
}
