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
            We help women in Cameroon develop practical technology skills, build projects they can show, and take their next step towards work, entrepreneurship, and community leadership.
          </p>
          <div className={styles.ctas}>
            <a href="/apply" className={styles.ctaPrimary}>
              {openCohort ? "Apply to the next cohort →" : "Join the waitlist →"}
            </a>
            <a href="#partners" className={styles.ctaGhost}>
              Partner with us
            </a>
          </div>
          <div className={styles.facts}>
            <span>✦ Fellowship applications welcome</span>
            <span>✦ Bilingual EN / FR</span>
            <span>✦ Based in Cameroon</span>
          </div>
        </div>

        <div className={styles.media}>
          <div className={styles.portrait}>
            <div className={styles.portraitLabel}>
              <div className={styles.portraitHeading}>Real skills. Real projects.</div>
              <div className={styles.portraitSub}>Learn with others, build with confidence, and grow a portfolio you can share.</div>
              <a className={styles.portraitLink} href="/initiatives/global-talent-pitch-2027">Explore our 2027 initiative →</a>
            </div>
          </div>

          <div className={styles.cardIncome}>
            <div className={styles.cardLabel}>Our approach</div>
            <div className={styles.cardIncomeVal}>Learn · Build · Grow</div>
          </div>

          <div className={styles.cardTutor}>
            <div className={styles.cardTutorIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
              </svg>
            </div>
            <div>
              <div className={styles.cardLabel}>Learning support</div>
              <div className={styles.cardTutorTitle}>Guidance as you learn</div>
            </div>
          </div>

          <div className={styles.cardBadge}>Hands-on learning community</div>
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
