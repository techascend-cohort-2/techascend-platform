import styles from "./Promise.module.css";

export default function Promise() {
  return (
    <section className={styles.section}>
      <div className={styles.band}>
        <div className={styles.blob} />
        <div className={styles.content}>
          <div className={styles.eyebrow}>OUR PROMISE</div>
          <h2 className={styles.title}>
            Skills should be accessible.
            <br />
            Opportunity should follow.
          </h2>
          <p className={styles.lede}>
            Our goal is to reduce barriers to practical technology education. Programme costs, eligibility, and any applicable fees or agreements will be explained clearly before participants enrol.
          </p>
          <a href="/apply" className={styles.cta}>
            Start your application
          </a>
        </div>
      </div>
    </section>
  );
}
