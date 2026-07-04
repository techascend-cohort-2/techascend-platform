import { redirect } from "next/navigation";
import { getCurrentUser, getLedgerData } from "@/lib/queries";
import RevenueScreen from "@/components/platform/screens/RevenueScreen";

export default async function RevenuePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { entries, partners, students, totals } = await getLedgerData();

  return (
    <RevenueScreen
      entries={entries.map((e) => ({
        id: e.id,
        kind: e.kind,
        amount: e.amount,
        note: e.note,
        occurredAt: e.occurredAt.toISOString(),
        partnerName: e.partner?.name ?? null,
        userName: e.user?.name ?? null,
        createdByName: e.createdBy?.name ?? null,
      }))}
      partners={partners.map((p) => ({ id: p.id, name: p.name }))}
      students={students}
      totals={totals}
    />
  );
}
