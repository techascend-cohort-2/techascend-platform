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
            Our goal is to make practical learning more accessible through mentorship, community support and partnerships. Any programme fees or commercial arrangements will be explained clearly before enrolment.
          </p>
          <a href="/apply" className={styles.cta}>
            Start your application
          </a>
        </div>
      </div>
    </section>
  );
}
