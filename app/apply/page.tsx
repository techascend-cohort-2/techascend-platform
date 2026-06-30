import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ApplyForm from "@/components/apply/ApplyForm";
import styles from "@/components/apply/Apply.module.css";

export const metadata: Metadata = {
  title: "Apply — TechAscend",
  description: "Apply to TechAscend as a learner, or partner with us.",
};

export default function ApplyPage() {
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
          <ApplyForm />
        </Suspense>
      </div>
    </div>
  );
}
