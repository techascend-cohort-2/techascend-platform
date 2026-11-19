import { layers } from "@/lib/data";
import Icon from "./Icon";
import styles from "./Engines.module.css";

export default function Engines() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>One platform. Three engines.</h2>
        <p className={styles.lede}>
          Our programme is designed to connect learning with practical projects and career readiness. Outcomes depend on each participant's progress and opportunities.
        </p>
      </div>
      <div className={styles.grid}>
        {layers.map((L) => (
          <div
            key={L.title}
            className={styles.card}
            style={{ borderTop: `3px solid ${L.accent}` }}
          >
            <div className={styles.cardHead}>
              <div
                className={styles.icon}
                style={{ background: L.iconBg, color: L.iconColor }}
              >
                <Icon path={L.iconPath} />
              </div>
              <div>
                <div className={styles.step}>{L.step}</div>
                <div className={styles.cardTitle}>{L.title}</div>
              </div>
            </div>
            <p className={styles.body}>{L.body}</p>
            <div className={styles.points}>
              {L.points.map((p) => (
                <div key={p} className={styles.point}>
                  <span className={styles.bullet} style={{ background: L.accent }} />
                  {p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
