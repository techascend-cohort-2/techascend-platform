import { partners } from "@/lib/data";
import Icon from "./Icon";
import styles from "./Partners.module.css";

export default function Partners() {
  return (
    <section id="partners" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <div className="eyebrow">FOR PARTNERS &amp; FUNDERS</div>
            <h2 className={styles.title}>Help people build skills that open doors.</h2>
            <p className={styles.lede}>
              We welcome universities, employers, mentors, and supporters who want to help more people gain practical technology skills. Together we can create learning experiences and document what they achieve.
            </p>
            <a href="/apply?role=partner" className={styles.cta}>
              Become a partner
            </a>
          </div>
          <div className={styles.cards}>
            {partners.map((p) => (
              <div key={p.title} className={styles.card}>
                <div className={styles.icon}>
                  <Icon path={p.iconPath} size={19} />
                </div>
                <div className={styles.cardTitle}>{p.title}</div>
                <div className={styles.cardBody}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
