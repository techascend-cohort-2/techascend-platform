import { logos } from "@/lib/data";
import { getOpenCohortForApply } from "@/lib/queries";
import styles from "./Hero.module.css";

export default async function Hero() {
  const openCohort = await getOpenCohortForApply();

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.blobA} />
      <div className={styles.blobB} />

      <div className={styles.grid}>
        <div>
          <div className={styles.badge}>
            <span className={styles.dot} />
            {openCohort ? `Central Africa · Applications open for ${openCohort.name}` : "Central Africa · Applications closed — join the waitlist"}
          </div>
          <h1 className={styles.h1}>
            Not just women in tech.
            <br />
            <span className={styles.h1grad}>Women building the future.</span>
          </h1>
          <p className={styles.lede}>
            TechAscend helps women in Cameroon learn practical technology skills, build meaningful projects and prepare for professional opportunities. We are growing a community rooted in mentorship and real-world learning.
          </p>
          <div className={styles.ctas}>
            <a href="/apply" className={styles.ctaPrimary}>
              {openCohort ? "Apply to the next cohort →" : "Join the waitlist →"}
            </a>
            <a href="/#partners" className={styles.ctaGhost}>
              Partner with us
            </a>
          </div>
          <div className={styles.facts}>
            <span>✦ Community-led learning</span>
            <span>✦ Bilingual EN / FR</span>
            <span>✦ Based in Cameroon</span>
          </div>
        </div>

        <div className={styles.media}>
          <div className={styles.portrait}>
            <div className={styles.portraitLabel}>
              <span className={styles.visualEyebrow}>LEARN · BUILD · CONNECT</span>
              <span className={styles.visualHeadline}>Talent grows when opportunity is shared.</span>
              <span className={styles.visualBody}>Practical learning, peer support and opportunities to show what you can build.</span>
              <a className={styles.visualLink} href="/about">Get to know TechAscend →</a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.logoStrip}>
        <div className={styles.logoStripInner}>
          <span className={styles.logoStripLabel}>WHAT THE FELLOWSHIP IS BUILT ON</span>
          {logos.map((l) => (
            <span key={l} className={styles.logoStripLogo}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
