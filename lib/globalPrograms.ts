import type { CuratedProgram } from "@/lib/openSourcePrograms";

// Curated GLOBAL programs — real, currently-open international internships and
// fellowships that Cameroonian students are eligible for, hand-filtered by the
// TechAscend team (region-restricted programs are deliberately excluded).
// Imported onto the Opportunities board together with the open-source list via
// the admin "Import curated programs" button.
//
// IMPORTANT: `title` is the dedup key for the idempotent import — treat titles
// as immutable. Deadlines and stipends change per cycle, so descriptions tell
// students to confirm on the official site; re-running the import after
// editing this file updates listings in place.

export const GLOBAL_PROGRAMS: CuratedProgram[] = [
  {
    title: "UNDP Digital, AI & Innovation Internship",
    type: "internship",
    pay: "Monthly stipend (varies by location) — confirm on the UNDP portal",
    link: "https://estm.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/33001",
    skills: ["AI", "Data Analysis", "Research", "Digital Transformation"],
    location: "Remote",
    deadline: "2026-09-30",
    description: `A three-month, fully remote internship with the United Nations Development Programme focused on AI, digital transformation, innovation and international development. Interns contribute to research, policy design, digital tools and capacity building across UNDP country offices. Open to final-year Bachelor's students, graduate students and recent graduates — a strong first international credential.

**Who's eligible:**
- Final-year Bachelor's students, Master's students, or graduates within the eligibility window UNDP specifies
- Open globally — Cameroonian applicants are eligible
- Fully remote, so no visa or travel needed

**How to prepare:**
- Deadline: 30 September 2026 (rolling review) — confirm on the official UNDP vacancy page.
- Apply through the official UNDP portal AND complete every step the vacancy notice lists — a partial application is not considered.
- Tailor your motivation to a concrete UNDP theme (AI for development, data, digital public goods).
- Have your CV in international format and your portfolio/GitHub links ready.`,
  },
  {
    title: "ERA Fellowship — Cambridge (AI Safety & Governance)",
    type: "internship",
    pay: "£10,000 stipend + housing, meals, visa & travel covered — confirm on site",
    link: "https://erafellowship.org/",
    skills: ["AI Safety", "AI Governance", "Research", "Technical Writing"],
    location: "Cambridge, UK (fully funded)",
    deadline: "2026-09-13",
    description: `A fully funded 10-week research fellowship in Cambridge, UK (18 January – 26 March 2027) on technical AI safety and AI governance. Fellows work 1-on-1 with a mentor on a research agenda. Open to students, researchers and professionals from any country, 18+ — you do NOT need a traditional AI research background. Stipend, accommodation, meals, visa support and travel are all covered.

**Who's eligible:**
- 18+, any nationality, any background — students, builders, researchers or professionals
- Best suited to our strongest AI students: agents, ML, responsible AI, governance, strong writing

**How to prepare:**
- Deadline: 13 September 2026, 11:59pm Anywhere on Earth — confirm on erafellowship.org. This one is SOON.
- Stage 1 is short essay questions (~2 hours) — draft answers about why AI safety/governance matters to you, with concrete examples from your projects.
- Read 2–3 recent AI-safety or governance papers so your motivation is specific, not generic.
- A passport (or application in progress) is needed for the UK visa step if selected.`,
  },
  {
    title: "OIST Research Internship — Okinawa, Japan",
    type: "internship",
    pay: "¥2,400/day + round-trip flights, housing & visa support — confirm on site",
    link: "https://www.oist.jp/admissions/research-internship",
    skills: ["Research", "STEM", "Computational Science", "Mathematics"],
    location: "Okinawa, Japan (fully funded)",
    deadline: "2026-10-15",
    description: `A fully supported 4–6 month research placement in a lab at the Okinawa Institute of Science and Technology, Japan. Fields include computational sciences, mathematics, physics, neuroscience, quantum science and more. Open to Bachelor's/Master's students and recent graduates of any nationality (current/completed PhD students can't apply). Interns receive a daily allowance, a round-trip air ticket, furnished accommodation and visa assistance.

**Who's eligible:**
- Bachelor's or Master's students (or recent graduates) in STEM/CS — academically strong candidates
- Any nationality — Cameroonian applicants are eligible

**How to prepare:**
- Deadline for the Spring 2027 intake: 15 October 2026, 23:59 JST — confirm on oist.jp.
- Note: there is a non-refundable ¥5,000 (~US$35) application fee — budget for it.
- Browse OIST research units first and name the specific labs you want in your application.
- Prepare transcripts, a recommendation letter, and a focused statement linking your coursework/projects to the lab's research.`,
  },
];
