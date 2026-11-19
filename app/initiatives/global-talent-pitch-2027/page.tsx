import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "@/components/PublicPages.module.css";

export const metadata: Metadata = {
 title: "Global Talent Pitch Challenge 2027 | TechAscend",
 description: "A proposed Cameroon-based career pitching and networking initiative designed to connect emerging talent with mentors and opportunity."
};

export default function TalentChallengePage() {
 return <><Nav/><main className={styles.page}><div className={styles.shell}>
   <Link className={styles.back} href="/">← Back to homepage</Link>
   <div className={styles.hero}><p className={styles.eyebrow}>Proposed 2027 initiative · Douala, Cameroon</p><h1 className={styles.title}>Cameroon to the world.<br/>Talent without borders.</h1><p className={styles.lede}>The TechAscend Global Talent Pitch Challenge is a proposed career development and networking event where young people can practise introducing their skills, present their projects and meet potential mentors, employers and collaborators.</p>
    <div className={styles.links}><Link className={styles.primary} href="/apply?role=partner">Discuss a partnership</Link><Link className={styles.secondary} href="/about">About the organizers</Link></div>
   </div>
   <div className={styles.grid}><article className={styles.card}><h2>Why we want to do this</h2><p>Talent exists across Cameroon, but access to networks and opportunities is uneven. We want to help emerging professionals tell their stories clearly and make meaningful connections.</p></article><article className={styles.card}><h2>Who it is for</h2><p>Young professionals, graduates, entrepreneurs and technology builders across Cameroon, with a dedicated focus on supporting women in technology.</p></article></div>
   <section className={styles.section}><p className={styles.eyebrow}>Proposed programme</p><h2>One event, three practical goals</h2><ol className={styles.steps}><li><strong>Prepare</strong>Hands-on coaching in introductions, public speaking and presenting a portfolio or project.</li><li><strong>Present</strong>A coordinated pitching activity, with the format to be finalized after feasibility review.</li><li><strong>Connect</strong>Conversations with potential employers, mentors and community partners, followed by opportunities to stay engaged.</li></ol></section>
   <section className={styles.section}><p className={styles.eyebrow}>Record concept under review</p><h2>A possible Guinness World Records attempt</h2><p>TechAscend has submitted a proposal exploring a large-group career pitching record attempt. The exact record title, eligibility, rules and evidence requirements have not been approved or confirmed.</p><div className={styles.note}><strong>Important:</strong> This is a proposed initiative, not an officially approved Guinness World Records attempt. Guinness World Records has not been announced as a partner or sponsor.</div></section>
   <section className={styles.section}><p className={styles.eyebrow}>Timing and location</p><h2>Our working plan</h2><p>We are considering June 2027 in Douala, Cameroon. The venue, date, participant capacity, sponsors and programme are still being developed. We will publish confirmed details when they are available.</p></section>
   <section className={styles.section}><p className={styles.eyebrow}>Get involved</p><h2>Help us make it useful.</h2><p>We welcome conversations with employers, universities, mentorship communities, trainers, event volunteers and organizations interested in supporting meaningful career opportunities.</p><div className={styles.links}><Link className={styles.primary} href="/apply?role=partner">Contact us about partnering →</Link></div></section>
 </div></main><Footer/></>;
}