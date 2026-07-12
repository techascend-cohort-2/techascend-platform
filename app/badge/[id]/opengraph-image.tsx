import { ImageResponse } from "next/og";
import { getSharedBadge } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TechAscend verified achievement";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ub = await getSharedBadge(id).catch(() => null);

  const badgeName = ub?.badge.name ?? "TechAscend Badge";
  const studentName = ub?.user.name ?? "A TechAscend fellow";
  const phaseName = ub?.badge.phase?.name ?? "TechAscend Fellowship";
  const track = ub?.user.track ? TRACK_LABELS[ub.user.track] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 72px",
          color: "#fff",
          background: "linear-gradient(135deg, #10251F 0%, #315C4D 55%, #7C3AED 140%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#7C3AED,#D6336C)",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            TA
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>TechAscend</div>
            <div style={{ fontSize: 18, opacity: 0.8 }}>AI-Native Fellowship · Cameroon</div>
          </div>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, opacity: 0.85, fontWeight: 700 }}>
            VERIFIED ACHIEVEMENT
          </div>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05, marginTop: 12 }}>{badgeName}</div>
          <div style={{ fontSize: 34, opacity: 0.92, marginTop: 22 }}>{`Earned by ${studentName}`}</div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 24, opacity: 0.85 }}>{`${phaseName}${track ? ` · ${track}` : ""}`}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            tech-ascend.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
