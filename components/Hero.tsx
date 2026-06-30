import { logos } from "@/lib/data";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.blobA} />
      <div className={styles.blobB} />

      <div className={styles.grid}>
        <div>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Central Africa · Applications open for Cohort 01
          </div>
          <h1 className={styles.h1}>
            Not just women in tech.
            <br />
            <span className={styles.h1grad}>Women building the future.</span>
          </h1>
          <p className={styles.lede}>
            TechAscend is the AI-native ecosystem where women in Cameroon learn to
            build with AI, ship real products, and turn skills into income — through
            freelancing, jobs, and ventures.
          </p>
          <div className={styles.ctas}>
            <a href="#apply" className={styles.ctaPrimary}>
              Apply to the next cohort →
            </a>
            <a href="#partners" className={styles.ctaGhost}>
              Partner with us
            </a>
          </div>
          <div className={styles.facts}>
            <span>✦ Free to join</span>
            <span>✦ Bilingual EN / FR</span>
            <span>✦ Douala · Yaoundé · Buea</span>
          </div>
        </div>

        <div className={styles.media}>
          <div className={styles.portrait}>
            <div className={styles.portraitLabel}>
              <div className={styles.mono}>DROP: learner portrait</div>
              <div className={styles.sub}>a woman building at her laptop</div>
            </div>
          </div>

          <div className={styles.cardIncome}>
            <div className={styles.cardLabel}>Income earned</div>
            <div className={styles.cardIncomeVal}>240,000 F</div>
          </div>

          <div className={styles.cardTutor}>
            <div className={styles.cardTutorIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
              </svg>
            </div>
            <div>
              <div className={styles.cardLabel}>AI Tutor</div>
              <div className={styles.cardTutorTitle}>Always on, every lesson</div>
            </div>
          </div>

          <div className={styles.cardBadge}>★ API Integrator badge earned</div>
        </div>
      </div>

      <div className={styles.logoStrip}>
        <div className={styles.logoStripInner}>
          <span className={styles.logoStripLabel}>BUILT WITH PARTNERS LIKE</span>
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
