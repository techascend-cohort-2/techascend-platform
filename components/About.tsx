import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>ABOUT TECHASCEND</span>
          <h2 id="about-heading">Technology opens doors when people can actually use it.</h2>
          <p>TechAscend is a Cameroon-based technology empowerment initiative focused on practical learning, mentorship, and pathways to opportunity. Our main programme is designed for women building confidence and experience in software engineering and digital tools.</p>
          <p>We believe that learning is more meaningful when it leads to something tangible: a project, a portfolio, a new connection, or the confidence to take the next step.</p>
        </div>
        <aside className={styles.founder} aria-label="Founder information">
          <div className={styles.marker}>Founded with purpose</div>
          <h3>Meet the founder</h3>
          <p><strong>Ngai Elizabeth Asobi</strong> is a software engineer and TechWomen 2025 alumna. Her experience in software development, cloud infrastructure, and technology mentorship informs TechAscend&apos;s hands-on approach.</p>
          <a href="https://www.linkedin.com/in/ngai-e/" target="_blank" rel="noopener noreferrer">Connect with Elizabeth on LinkedIn <span aria-hidden="true">↗</span></a>
          <div className={styles.note}>We are building partnerships, recording programme outcomes, and developing future community initiatives. We will share verified updates as they become available.</div>
        </aside>
      </div>
    </section>
  );
}
