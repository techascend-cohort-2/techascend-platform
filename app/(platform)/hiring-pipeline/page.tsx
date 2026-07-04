import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getPipelineForPartner } from "@/lib/queries";
import PipelineBoard, { type PipelineCardData } from "@/components/platform/screens/PipelineBoard";
import PartnerNotice from "@/components/platform/screens/PartnerNotice";

export default async function HiringPipelinePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.partnerId) return <PartnerNotice title="Hiring Pipeline" />;

  const cards = await getPipelineForPartner(user.partnerId);
  const data: PipelineCardData[] = cards.map((c) => ({
    id: c.id,
    stage: c.stage,
    note: c.note,
    user: c.user,
  }));

  return (
    <div className="pf-screen pf-w1180">
      {data.length === 0 ? (
        <div className="pf-card" style={{ padding: 36, textAlign: "center" }}>
          <div className="pf-h" style={{ marginBottom: 8 }}>Your pipeline is empty</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Shortlist talent from the Talent Pool to start tracking candidates through
            Shortlisted → Interview → Offer → Hired.
          </div>
          <Link href="/talent-pool" className="pf-btn-grad" style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13 }}>
            Browse the Talent Pool →
          </Link>
        </div>
      ) : (
        <PipelineBoard cards={data} />
      )}
    </div>
  );
}
