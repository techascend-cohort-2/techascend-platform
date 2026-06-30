import styles from "./Promise.module.css";

export default function Promise() {
  return (
    <section className={styles.section}>
      <div className={styles.band}>
        <div className={styles.blob} />
        <div className={styles.content}>
          <div className={styles.eyebrow}>OUR PROMISE</div>
          <h2 className={styles.title}>
            Free to learn.
            <br />
            We earn when you earn.
          </h2>
          <p className={styles.lede}>
            No upfront fees for learners. TechAscend is funded by partners, employers,
            and a small share of the income you generate — never by charging women who
            can&apos;t yet afford it.
          </p>
          <a href="#apply" className={styles.cta}>
            Start your application
          </a>
        </div>
      </div>
    </section>
  );
}
