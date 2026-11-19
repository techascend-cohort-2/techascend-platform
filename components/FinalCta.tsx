import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <section id="apply" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.title}>I want to learn and build</div>
          <p className={styles.body}>
            For women in Cameroon looking to grow technical skills and develop practical projects.
          </p>
          <a href="/apply" className={styles.ctaPrimary}>
            Apply or join the waitlist →
          </a>
        </div>
        <div className={styles.cardDark}>
          <div className={styles.title}>I want to partner</div>
          <p className={styles.bodyDark}>
            For funders, employers, telecoms, universities and development
            organisations.
          </p>
          <a href="/apply?role=partner" className={styles.ctaLight}>
            Talk to our team →
          </a>
        </div>
      </div>
    </section>
  );
}
