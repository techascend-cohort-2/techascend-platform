import { testimonials } from "@/lib/data";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-sora), var(--font-jakarta), sans-serif",
            fontSize: "clamp(26px, 3.4vw, 38px)",
            letterSpacing: "-0.5px",
            margin: "0 0 10px",
          }}
        >
          The journey
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 16, margin: 0 }}>
          Five phases, each ending in a verified badge and certificate.
        </p>
      </div>
      <div className={styles.grid}>
        {testimonials.map((t) => (
          <div key={t.name} className={styles.card}>
            <div className={styles.quote}>&quot;{t.quote}&quot;</div>
            <div className={styles.person}>
              <div className={styles.avatar} style={{ background: t.avBg }}>
                {t.initials}
              </div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
