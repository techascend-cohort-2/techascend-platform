import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Global Talent Pitch Challenge 2027 | TechAscend",
  description: "Explore TechAscend's proposed 2027 career pitching and networking initiative in Douala, Cameroon. Learn about its goals, status, and opportunities to collaborate.",
};

const activities = [
  { step: "01", title: "Prepare", description: "Practical sessions on public speaking, portfolio storytelling, and introducing your skills clearly." },
  { step: "02", title: "Pitch", description: "A coordinated public pitching challenge. Its record format will depend on official eligibility and guidelines." },
  { step: "03", title: "Connect", description: "Opportunities for conversations with mentors, employers, entrepreneurs, and other professionals." },
  { step: "04", title: "Follow through", description: "Participant feedback and follow-up on introductions, interviews, and project opportunities, with consent." },
];

export default function TalentPitchPage() {
  return (
    <>
      <Nav />
      <main>
        <div className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>A PROPOSED TECHASCEND INITIATIVE · 2027</p>
            <h1>Cameroon to the world.<br /><span>Talent without borders.</span></h1>
            <p className={styles.lead}>The TechAscend Global Talent Pitch Challenge is an event concept designed to help young Cameroonian professionals become more confident presenting their work and connecting with opportunities.</p>
            <div className={styles.quickFacts}>
              <span>Proposed location: Douala, Cameroon</span>
              <span>Target period: June 2027</span>
              <span>Planning stage</span>
            </div>
          </div>
        </div>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <p className={styles.eyebrow}>WHY THIS MATTERS</p>
                <h2>Talent is everywhere. Access to opportunity is not.</h2>
              </div>
              <div className={styles.prose}>
                <p>Many skilled people find it difficult to communicate their experience, build useful networks, or meet potential clients and employers. We want to create a welcoming space to practise those skills in public and make meaningful professional connections.</p>
                <p>The event is intended for students, developers, designers, entrepreneurs, graduates, and other early-career professionals. A dedicated <strong>Women Pitching the Future</strong> programme will support women in technology through mentoring and pitch preparation.</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.soft}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>EVENT FORMAT</p>
            <h2>More than a moment on stage.</h2>
            <div className={styles.cards}>
              {activities.map(activity => (
                <article className={styles.card} key={activity.step}>
                  <span className={styles.number}>{activity.step}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.notice}>
              <p className={styles.eyebrow}>RECORD ATTEMPT STATUS</p>
              <h2>We have submitted a record concept for consideration.</h2>
              <p>TechAscend has proposed an elevator-pitch-related record concept to Guinness World Records. This is an application-stage idea, not an approved record title or an officially authorized attempt. The format, rules, and eligibility must be confirmed before we announce or conduct any record attempt.</p>
              <p>The career development event is an independent TechAscend initiative and can proceed even if the record concept is not accepted.</p>
            </div>
          </div>
        </section>
        <section className={styles.ctaArea}>
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <p className={styles.eyebrow}>GET INVOLVED</p>
                <h2>Help us make it useful.</h2>
                <p>We are exploring partnerships with universities, employers, mentors, local communities, and organizations that want to support practical skills and access to opportunity.</p>
              </div>
              <div className={styles.actions}>
                <Link href="/apply?role=partner" className={styles.primary}>Discuss a partnership →</Link>
                <Link href="/#about" className={styles.secondary}>Learn about TechAscend →</Link>
                <p>Partner and volunteer opportunities are still being planned. Any registration or participation details will be shared when confirmed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
