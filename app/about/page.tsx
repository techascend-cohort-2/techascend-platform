import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "@/components/PublicPages.module.css";

export const metadata: Metadata = {
 title: "About TechAscend | Our mission and approach",
 description: "Meet the people and purpose behind TechAscend, a Cameroon-based technology education and mentorship initiative."
};

export default function AboutPage() {
 return <><Nav/><main className={styles.page}><div className={styles.shell}>
  <Link className={styles.back} href="/">← Back to homepage</Link>
  <div className={styles.hero}><p className={styles.eyebrow}>About TechAscend</p><h1 className={styles.title}>More opportunity starts with practical skills and people who believe in you.</h1>
  <p className={styles.lede}>TechAscend is a Cameroon-based technology empowerment initiative committed to making practical technology education, mentorship and professional connections more accessible, with a particular focus on women in technology.</p></div>
  <div className={styles.grid}>
    <article className={styles.card}><h2>What we work toward</h2><p>We want people to move beyond watching tutorials into building useful things: software projects, automations, professional portfolios and confidence to pursue the next opportunity.</p></article>
    <article className={styles.card}><h2>How we approach it</h2><p>Hands-on learning, peer support, mentorship and honest conversations about the skills employers and clients need. We are developing programmes and partnerships to make that possible.</p></article>
  </div>
  <section className={styles.section} id="founder"><p className={styles.eyebrow}>Leadership</p><h2>Meet the founder</h2><p>Elizabeth Asobi Ngai is a software engineer and cloud and DevOps professional with over seven years of experience. She participated in the TechWomen 2025 programme and founded TechAscend to help widen access to practical technology education and professional opportunities in Cameroon.</p><div className={styles.links}><a className={styles.secondary} href="https://www.linkedin.com/in/ngai-e/" target="_blank" rel="noopener noreferrer">View founder’s LinkedIn profile ↗</a></div></section>
  <section className={styles.section} id="transparency"><p className={styles.eyebrow}>Transparency</p><h2>Our plans are not our results.</h2><p>TechAscend is developing its learning and career initiatives. We intend to document participation, project completion and career progress and share verified outcomes as programmes are delivered.</p><p>Programme availability, any fees, partnerships and volunteer opportunities should be confirmed directly with the team. We do not present proposed partners, job placements, funding or record recognition as secured.</p><div className={styles.note}>TechAscend is described here as an initiative. This page does not claim registered charity or accredited nongovernmental organization status.</div></section>
  <section className={styles.section} id="contact"><p className={styles.eyebrow}>Get in touch</p><h2>We would like to hear from you.</h2><p>Whether you are interested in learning, mentoring, or exploring a partnership, you can contact TechAscend through the website.</p><div className={styles.links}><Link className={styles.primary} href="/apply">Learner enquiries</Link><Link className={styles.secondary} href="/apply?role=partner">Partnership enquiries</Link></div></section>
 </div></main><Footer/></>;
}