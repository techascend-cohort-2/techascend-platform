import { stats } from "@/lib/data";
import styles from "./Impact.module.css";

export default function Impact() {
  return (
    <section id="impact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <h2 className={styles.title}>
              How we plan to measure progress.
              <br />
              Beyond attendance.
            </h2>
            <p className={styles.lede}>
              We aim to track participation, skills developed, projects completed, mentorship provided, and opportunities created. We will publish verified results as our programmes progress.
            </p>
            <a href="#partners" className={styles.cta}>
              Explore partnerships →
            </a>
          </div>
          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.l} className={styles.stat}>
                <div className={styles.statVal}>{s.v}</div>
                <div className={styles.statLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
