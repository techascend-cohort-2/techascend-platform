import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSharedBadge } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";
import SharePanel from "@/components/platform/SharePanel";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tech-ascend.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const ub = await getSharedBadge(id).catch(() => null);
  if (!ub) return { title: "Badge · TechAscend" };
  const title = `${ub.user.name} earned the ${ub.badge.name} badge · TechAscend`;
  const description = `A verified TechAscend achievement — ${ub.badge.name}${ub.badge.phase ? ` for completing ${ub.badge.phase.name}` : ""}.`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: { title, description, type: "website", url: `/badge/${id}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BadgeSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ub = await getSharedBadge(id);
  if (!ub) notFound();

  const track = ub.user.track ? TRACK_LABELS[ub.user.track] : null;
  const shareText = `I earned my ${ub.badge.name} on TechAscend — the AI-Native Fellowship for builders in Central Africa! 🎉`;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#F3F0FA",
        padding: "40px 16px",
        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 30px 80px -40px rgba(60,30,110,.35)",
            border: "1px solid #E9E3F5",
            background: "#fff",
          }}
        >
          {/* hero */}
          <div
            style={{
              background: "linear-gradient(135deg, #10251F 0%, #315C4D 60%, #7C3AED 150%)",
              color: "#fff",
              padding: "34px 32px 30px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 3, fontWeight: 800, opacity: 0.8 }}>VERIFIED ACHIEVEMENT</div>
            <div
              style={{
                width: 76,
                height: 76,
                margin: "20px auto 16px",
                borderRadius: 22,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5L7 22l5-3 5 3-1.2-8.5" />
              </svg>
            </div>
            <div style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }}>
              {ub.badge.name}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 6 }}>
              Earned by <b>{ub.user.name}</b>
            </div>
          </div>

          {/* body */}
          <div style={{ padding: "24px 28px 28px" }}>
            <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>PHASE</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1130", marginTop: 3 }}>{ub.badge.phase?.name ?? "Fellowship"}</div>
              </div>
              {track ? (
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>TRACK</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1130", marginTop: 3 }}>{track}</div>
                </div>
              ) : null}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>EARNED</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1130", marginTop: 3 }}>{dateFmt.format(ub.earnedAt)}</div>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1, marginBottom: 10 }}>SHARE THIS ACHIEVEMENT</div>
            <SharePanel
              sharePath={`/badge/${id}`}
              text={shareText}
              imagePath={`/badge/${id}/opengraph-image`}
              downloadName={`techascend-${ub.badge.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`}
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/" style={{ fontSize: 13, color: "#6B5E8C", textDecoration: "none", fontWeight: 600 }}>
            TechAscend — the AI-Native Fellowship for Central Africa →
          </Link>
        </div>
      </div>
    </main>
  );
}
