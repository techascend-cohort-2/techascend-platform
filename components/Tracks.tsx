import { tracks, roles } from "@/lib/data";
import styles from "./Tracks.module.css";

export default function Tracks() {
  return (
    <section id="tracks" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className="eyebrow">CHOOSE YOUR PATH</div>
          <h2 className={styles.title}>Two tracks. One future.</h2>
          <p className={styles.lede}>
            Start where your ambition points. Both lead to real, income-generating
            skills.
          </p>
        </div>

        <div className={styles.trackGrid}>
          {tracks.map((t) => (
            <div
              key={t.tag}
              className={styles.track}
              style={{ background: t.gradient, boxShadow: t.shadow }}
            >
              <div className={styles.tag}>{t.tag}</div>
              <div className={styles.trackTitle}>{t.title}</div>
              <p className={styles.trackBody}>{t.body}</p>
              <div className={styles.chips}>
                {t.tools.map((tool) => (
                  <span key={tool} className={styles.chip}>
                    {tool}
                  </span>
                ))}
              </div>
              <div className={styles.becomeLabel}>You can become</div>
              <div className={styles.outcomes}>{t.outcomes}</div>
            </div>
          ))}
        </div>

        <div className={styles.roleGrid}>
          {roles.map((r) => (
            <div key={r.title} className={styles.role}>
              <div className={styles.roleTitle}>{r.title}</div>
              <div className={styles.roleSub}>{r.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
