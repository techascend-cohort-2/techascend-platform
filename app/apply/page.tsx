import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ApplyForm from "@/components/apply/ApplyForm";
import { getOpenCohortForApply } from "@/lib/queries";
import styles from "@/components/apply/Apply.module.css";

export const metadata: Metadata = {
  title: "Apply — TechAscend",
  description: "Apply to TechAscend as a learner, or partner with us.",
};

export default async function ApplyPage() {
  const openCohort = await getOpenCohortForApply();

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topInner}>
          <Link href="/" className={styles.brand}>
            <div className={styles.logo}>TA</div>
            <div className={styles.brandName}>TechAscend</div>
          </Link>
          <Link href="/" className={styles.back}>
            ← Back to site
          </Link>
        </div>
      </div>
      <div className={styles.wrap}>
        <Suspense fallback={null}>
          <ApplyForm cohortOpen={Boolean(openCohort)} cohortName={openCohort?.name ?? null} />
        </Suspense>
      </div>
    </div>
  );
}
