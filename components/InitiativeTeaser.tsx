import Link from "next/link";
import styles from "./PublicPages.module.css";

export default function InitiativeTeaser() {
  return (
    <section className="shell" aria-labelledby="talent-challenge-heading" style={{ paddingTop: 76, paddingBottom: 76 }}>
      <div className={styles.feature}>
        <div>
          <p className={styles.eyebrow}>Looking ahead · Proposed 2027 initiative</p>
          <h2 id="talent-challenge-heading">Cameroon to the world. Talent without borders.</h2>
          <p>We are planning a career pitching and networking challenge that will help young Cameroonians practise presenting their skills and connect with mentors and potential employers.</p>
        </div>
        <Link href="/initiatives/global-talent-pitch-2027">Explore the initiative →</Link>
      </div>
    </section>
  );
}