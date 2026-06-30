import { stats } from "@/lib/data";
import styles from "./Impact.module.css";

export default function Impact() {
  return (
    <section id="impact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <h2 className={styles.title}>
              Impact you can measure.
              <br />
              Not just stories.
            </h2>
            <p className={styles.lede}>
              Every cohort is tracked with investor-grade discipline — women trained,
              projects shipped, income generated, SMEs digitized.
            </p>
            <a href="#partners" className={styles.cta}>
              See the partner impact report →
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
