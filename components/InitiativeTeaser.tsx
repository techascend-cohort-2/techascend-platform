import Link from "next/link";
import styles from "./InitiativeTeaser.module.css";

export default function InitiativeTeaser() {
  return (
    <section className={styles.section} aria-labelledby="initiative-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.kicker}>PROPOSED 2027 INITIATIVE</div>
          <h2 id="initiative-heading">Cameroon to the world. <span>Talent without borders.</span></h2>
          <p>We are developing the TechAscend Global Talent Pitch Challenge, a public event to help young professionals practise telling their stories, showcase their work, and meet mentors, recruiters, and potential collaborators.</p>
          <Link className={styles.link} href="/initiatives/global-talent-pitch-2027">Learn about the proposed event <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.details}>
          <div><span>Where</span><strong>Douala, Cameroon</strong></div>
          <div><span>When</span><strong>Target: June 2027</strong></div>
          <div><span>Who</span><strong>Young professionals, with a dedicated focus on women in technology</strong></div>
          <p className={styles.disclaimer}>A Guinness World Records concept has been submitted for consideration. No title or attempt has been approved or verified.</p>
        </div>
      </div>
    </section>
  );
}
