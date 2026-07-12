import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificateByCode } from "@/lib/queries";
import { TRACK_LABELS } from "@/lib/constants";
import PrintClient from "./print-button";
import SharePanel from "@/components/platform/SharePanel";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tech-ascend.com";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const cert = await getCertificateByCode(code.toUpperCase()).catch(() => null);
  if (!cert) return { title: "Certificate · TechAscend" };
  const what = cert.phase ? cert.phase.name : "the TechAscend Fellowship";
  const title = `${cert.user.name} — Certificate of Completion · TechAscend`;
  const description = `A verified TechAscend certificate for completing ${what}.`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: { title, description, type: "website", url: `/certificates/${cert.code}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await getCertificateByCode(code.toUpperCase());
  if (!cert) notFound();

  const trackLabel = cert.track ? TRACK_LABELS[cert.track] : null;
  const whatCompleted = cert.phase ? cert.phase.name : "the TechAscend AI-Native Fellowship";
  const shareText = `I completed ${whatCompleted} and earned my verified TechAscend certificate! 🎓 TechAscend is the AI-Native Fellowship for builders in Central Africa.`;

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
      <div style={{ width: "100%", maxWidth: 760 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "56px 52px",
            boxShadow: "0 30px 80px -40px rgba(60,30,110,.35)",
            border: "1px solid #E9E3F5",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: "10px solid transparent", background: "linear-gradient(135deg,#7C3AED22,#D6336C22) border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 34 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center",
                color: "#fff", fontWeight: 800, fontSize: 17,
                background: "linear-gradient(135deg,#7C3AED,#D6336C)",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              TA
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 17, color: "#1A1130" }}>TechAscend</div>
              <div style={{ fontSize: 11.5, color: "#8B83A3" }}>AI-Native Fellowship · Cameroon</div>
            </div>
          </div>

          <div style={{ fontSize: 12, letterSpacing: 3, fontWeight: 800, color: "#9C8FC0", marginBottom: 10 }}>
            CERTIFICATE OF COMPLETION
          </div>
          <div style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: -0.8, color: "#1A1130", lineHeight: 1.15 }}>
            {cert.user.name}
          </div>
          <div style={{ fontSize: 15, color: "#4B4463", marginTop: 16, lineHeight: 1.6, maxWidth: 560 }}>
            has successfully completed{" "}
            <b>{cert.phase ? cert.phase.name : "the TechAscend Fellowship"}</b>
            {trackLabel ? <> on the <b>{trackLabel}</b> track</> : null}
            {cert.phase ? " of the TechAscend AI-Native Fellowship" : ""}.
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>ISSUED</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1130", marginTop: 3 }}>{dateFmt.format(cert.issuedAt)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>VERIFICATION CODE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1130", marginTop: 3, fontFamily: "var(--font-mono), monospace" }}>{cert.code}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1 }}>ISSUED BY</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1130", marginTop: 3 }}>TechAscend Program Team</div>
            </div>
          </div>

          <div style={{ marginTop: 36, paddingTop: 18, borderTop: "1px solid #EFEAF8", fontSize: 11.5, color: "#8B83A3" }}>
            This certificate was issued automatically by the TechAscend platform on verified completion of all
            requirements. Anyone can verify it at this page&apos;s address.
          </div>
        </div>

        <div className="cert-actions" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 22 }}>
          <PrintClient />
          <Link
            href="/"
            style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13.5, fontWeight: 700, color: "#7C3AED", background: "#fff", border: "1px solid #E4DCF3", textDecoration: "none" }}
          >
            About TechAscend
          </Link>
        </div>

        <div
          className="cert-share"
          style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9E3F5", padding: "20px 22px", marginTop: 18, boxShadow: "0 20px 60px -40px rgba(60,30,110,.35)" }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "#9C8FC0", letterSpacing: 1, marginBottom: 12 }}>SHARE THIS CERTIFICATE</div>
          <SharePanel
            sharePath={`/certificates/${cert.code}`}
            text={shareText}
            imagePath={`/certificates/${cert.code}/opengraph-image`}
            downloadName={`techascend-certificate-${cert.code}.png`}
          />
        </div>
      </div>
    </main>
  );
}
