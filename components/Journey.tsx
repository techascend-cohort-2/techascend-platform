import { journey } from "@/lib/data";
import styles from "./Journey.module.css";

export default function Journey() {
  return (
    <section id="journey" className={styles.section}>
      <div className={styles.head}>
        <div className="eyebrow">FROM APPLICANT TO ALUMNI</div>
        <h2 className={styles.title}>A staged path, not a single sprint.</h2>
        <p className={styles.lede}>
          We measure success 6–12 months out — by income earned, not graduation day.
        </p>
      </div>
      <div className={styles.track}>
        {journey.map((j) => (
          <div key={j.stage} className={styles.stage}>
            <div className={styles.bar} style={{ background: j.barColor }} />
            <div className={styles.stageNum} style={{ color: j.numColor }}>
              {j.stage}
            </div>
            <div className={styles.stageTitle}>{j.title}</div>
            <div className={styles.dur}>{j.dur}</div>
            <div className={styles.body}>{j.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
