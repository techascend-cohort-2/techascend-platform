import { shifts } from "@/lib/data";
import styles from "./ModelComparison.module.css";

export default function ModelComparison() {
  return (
    <section id="model" className={styles.section}>
      <div className={styles.head}>
        <div className="eyebrow">THE OLD MODEL IS BREAKING</div>
        <h2 className={styles.title}>This is not a coding bootcamp.</h2>
        <p className={styles.lede}>
          &quot;Learn to code → get a certificate → apply for a junior job&quot; no
          longer works. AI changed the rules. TechAscend is built for the economy
          that&apos;s actually arriving.
        </p>
      </div>
      <div className={styles.table}>
        <div className={styles.thead}>
          <div className={styles.thOld}>TRADITIONAL LMS</div>
          <div className={styles.thNew}>THE TECHASCEND WAY</div>
        </div>
        {shifts.map((s) => (
          <div key={s.new} className={styles.row}>
            <div className={styles.old}>{s.old}</div>
            <div className={styles.new}>
              <span className={styles.check}>✓</span>
              {s.new}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
