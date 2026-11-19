import { shifts } from "@/lib/data";
import styles from "./ModelComparison.module.css";

export default function ModelComparison() {
  return (
    <section id="model" className={styles.section}>
      <div className={styles.head}>
        <div className="eyebrow">OUR APPROACH TO LEARNING</div>
        <h2 className={styles.title}>Learn by making things that matter.</h2>
        <p className={styles.lede}>
          Courses are a starting point. We also emphasize practical projects, supportive feedback, and ways to demonstrate what you can do.
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
