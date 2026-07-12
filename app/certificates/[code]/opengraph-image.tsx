import { ImageResponse } from "next/og";
import { getCertificateByCode } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TechAscend Certificate of Completion";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await getCertificateByCode(code.toUpperCase()).catch(() => null);

  const name = cert?.user.name ?? "A TechAscend fellow";
  const completed = cert?.phase ? cert.phase.name : "the TechAscend Fellowship";
  const track = cert?.track ? TRACK_LABELS[cert.track] : null;
  const verifyCode = cert?.code ?? code.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 70px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#7C3AED,#D6336C)",
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            TA
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1130" }}>TechAscend</div>
            <div style={{ fontSize: 17, color: "#8B83A3" }}>AI-Native Fellowship · Cameroon</div>
          </div>
        </div>

        {/* body */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, letterSpacing: 5, fontWeight: 800, color: "#9C8FC0" }}>
            CERTIFICATE OF COMPLETION
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, color: "#1A1130", marginTop: 14, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 30, color: "#4B4463", marginTop: 18 }}>
            {`has successfully completed ${completed}${track ? ` · ${track}` : ""}`}
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>VERIFICATION CODE</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1130", marginTop: 4 }}>{verifyCode}</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: 999,
              background: "#F3F0FA",
              color: "#7C3AED",
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
