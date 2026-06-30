import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <section id="apply" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.title}>I want to learn &amp; earn</div>
          <p className={styles.body}>
            For women 18–35 in Cameroon who are ready to build with AI and generate
            real income.
          </p>
          <a href="#apply" className={styles.ctaPrimary}>
            Apply to Cohort 01 →
          </a>
        </div>
        <div className={styles.cardDark}>
          <div className={styles.title}>I want to partner</div>
          <p className={styles.bodyDark}>
            For funders, employers, telecoms, universities and development
            organisations.
          </p>
          <a href="#apply" className={styles.ctaLight}>
            Talk to our team →
          </a>
        </div>
      </div>
    </section>
  );
}
