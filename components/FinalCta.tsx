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
          <a href="/apply" className={styles.ctaPrimary}>
            Explore learning opportunities →
          </a>
        </div>
        <div className={styles.cardDark}>
          <div className={styles.title}>I want to partner</div>
          <p className={styles.bodyDark}>
            For mentors, employers, educators and organizations interested in creating practical opportunities.
          </p>
          <a href="/apply?role=partner" className={styles.ctaLight}>
            Talk to our team →
          </a>
        </div>
      </div>
    </section>
  );
}
