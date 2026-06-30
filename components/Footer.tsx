import { footerCols } from "@/lib/data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.brand}>
            <div className={styles.logo}>TA</div>
            <div className={styles.brandName}>TechAscend</div>
          </div>
          <p className={styles.blurb}>
            The AI-native women&apos;s technology empowerment ecosystem for Central
            Africa.
          </p>
        </div>
        {footerCols.map((c) => (
          <div key={c.head}>
            <div className={styles.colHead}>{c.head}</div>
            <div className={styles.links}>
              {c.links.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className={styles.link}
                  {...(lnk.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {lnk.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={styles.tagline}>
          <span>Built for women.</span>
          <span>By women.</span>
          <span>For impact.</span>
        </div>
        <div className={styles.copyright}>© 2026 TechAscend · Douala, Cameroon</div>
      </div>
    </footer>
  );
}
