// Curated, REAL paid open-source programs surfaced on the Opportunities board
// via the admin "Import curated open-source programs" button (see
// importOpenSourceProgramsAction in lib/actions/staff.ts).
//
// IMPORTANT: `title` is the dedup key for the idempotent import — treat titles
// as immutable. Editing any other field and re-running the import updates the
// listing in place; renaming a title would create a duplicate listing.
//
// Stipend amounts change year to year, so every pay string is hedged and each
// listing links to the official site for students to verify current terms.
// Descriptions end in a "**How to prepare:**" bullet section rendered with
// FormattedNote (line breaks, bullets and **bold** preserved).

export type CuratedProgram = {
  title: string;
  type: "internship" | "freelance";
  pay: string;
  link: string;
  skills: string[];
  location: string;
  description: string;
  // ISO date — application deadline for externally-run, cycle-based programs
  // (open-source programs with rolling/annual cycles leave this unset).
  deadline?: string;
};

export const OPEN_SOURCE_PROGRAMS: CuratedProgram[] = [
  {
    title: "Outreachy — Paid Open Source Internship",
    type: "internship",
    pay: "≈US$7,000 stipend / 3 months — verify on site",
    link: "https://www.outreachy.org",
    skills: ["Git", "Open Source", "Python", "Linux"],
    location: "Remote",
    description: `Outreachy runs paid, remote, three-month open-source internships for people underrepresented in tech — students AND non-students, 18+. Two rounds per year (roughly Dec–Mar and May–Aug applications). Many interns from across Africa participate every round, and it is deliberately newcomer-friendly.

**How to prepare:**
- Check eligibility early — the initial application opens weeks before the contribution period.
- Selection is based on recorded contributions you make to your chosen project during the contribution period, so start contributing the moment projects are announced.
- Pick ONE project and go deep; several small merged contributions beat scattered ones.
- Ask questions in the project's public chat — mentors notice consistent, polite communication.`,
  },
  {
    title: "Google Summer of Code (GSoC)",
    type: "internship",
    pay: "≈US$750–$3,000 stipend (by project size & location) — verify on site",
    link: "https://summerofcode.withgoogle.com",
    skills: ["Git", "Open Source", "Programming"],
    location: "Remote",
    description: `Google's flagship open-source program: contributors 18+ who are new to open source (not only students since 2022) work on a mentored project over the summer. The stipend is purchasing-power adjusted by country. Mentoring organizations are announced around February, contributor applications run around March–April, coding June–August.

**How to prepare:**
- Browse past years' organizations now and shortlist 1–2 whose stack you know.
- Make small merged PRs in those repos BEFORE applications open — accepted proposals almost always come from people who already contributed.
- Write a concrete proposal with a weekly timeline; get feedback from the org's mentors before the deadline.`,
  },
  {
    title: "LFX Mentorship (Linux Foundation)",
    type: "internship",
    pay: "≈US$3,000–$6,600 stipend (varies by region) — verify per project",
    link: "https://mentorship.lfx.linuxfoundation.org",
    skills: ["Linux", "Cloud Native", "Go", "Git"],
    location: "Remote",
    description: `Paid remote mentorships on Linux Foundation projects — Kubernetes and the CNCF ecosystem, Hyperledger, the Linux kernel and more. Three terms per year (spring, summer, fall), with region-tiered stipends. Often a lower barrier to entry than GSoC for specific projects.

**How to prepare:**
- Create an LFX profile and browse open mentorships on the portal — each lists its own prerequisites.
- Complete the listed prerequisite tasks before applying; incomplete applications are filtered out.
- Submit your CV and a tailored cover letter early — popular projects fill fast.`,
  },
  {
    title: "Igalia Coding Experience",
    type: "internship",
    pay: "Paid grant (several thousand EUR per call) — verify current call",
    link: "https://www.igalia.com/coding-experience/",
    skills: ["C++", "Compilers", "Browsers", "JavaScript"],
    location: "Remote",
    description: `Igalia — a worker-owned consultancy that maintains major parts of Chromium and WebKit — runs a paid, part-time "Coding Experience" over several months for people starting in open source. Areas include browsers, compilers, graphics and web standards. Deep, résumé-defining work for stronger candidates.

**How to prepare:**
- Follow Igalia's blog/social accounts for call announcements (usually annual).
- Show real open-source contributions in a related area (a browser bug fix, a compiler patch, WebGL/graphics work).
- Tailor your application to one of the offered focus areas rather than applying generically.`,
  },
  {
    title: "Google Season of Docs",
    type: "internship",
    pay: "Paid technical-writing project (org grants historically ≈US$5,000–$15,000) — verify on site",
    link: "https://developers.google.com/season-of-docs",
    skills: ["Technical Writing", "Markdown", "Git", "Docs"],
    location: "Remote",
    description: `Open-source organizations receive grants to hire technical writers for documentation projects. A real paid on-ramp for people who write well but aren't hardcore coders (yet) — documentation is how most contributors first land in a project.

**How to prepare:**
- Build a small docs portfolio: overhaul a README, write a tutorial, fix confusing docs in a project you use.
- Learn docs tooling basics: Markdown, static site generators, docs-as-code workflows in Git.
- When the annual program opens, pitch organizations directly with a scoped project idea.`,
  },
  {
    title: "OSPP — Open Source Promotion Plan",
    type: "internship",
    pay: "RMB 8,000–12,000 per project (≈US$1,100–$1,700, before tax) — verify on site",
    link: "https://summer-ospp.ac.cn",
    skills: ["Git", "Open Source", "Programming"],
    location: "Remote",
    description: `A summer open-source program run by the Institute of Software, Chinese Academy of Sciences — open to student contributors worldwide, working remotely on a mentored project. A solid alternative if GSoC/Outreachy timing doesn't line up.

**How to prepare:**
- Project list opens around April–June — browse it early and pick a project matching your stack.
- Contact the project mentor before applying; mentors help shape strong applications.
- Student status is required — have proof of enrollment ready.`,
  },
  {
    title: "Algora — Open Source Bounties",
    type: "freelance",
    pay: "Per-bounty USD payouts (varies by issue) — see live bounties",
    link: "https://algora.io",
    skills: ["Git", "TypeScript", "Rust", "Open Source"],
    location: "Remote",
    description: `No application cycle: companies attach USD bounties to real GitHub issues on open-source projects. Solve the issue, get your PR merged, get paid. Great for building income AND a public contribution history at the same time.

**How to prepare:**
- Create an Algora profile and browse live bounties filtered by your stack.
- Start with small "good first issue"-sized bounties to build reputation before attempting big ones.
- Read the repo's contribution guide before you start — merged code is what pays, not effort.`,
  },
  {
    title: "IssueHunt — GitHub Issue Bounties",
    type: "freelance",
    pay: "Per-issue bounties (varies; check active bounties on site)",
    link: "https://issuehunt.io",
    skills: ["Git", "JavaScript", "Open Source"],
    location: "Remote",
    description: `Crowdfunded bounties on GitHub issues: maintainers and users fund issues they want fixed, and the contributor whose fix is merged claims the bounty through the platform.

**How to prepare:**
- Check which repositories have ACTIVE funded issues before investing time.
- Comment on the issue to signal you're working on it, then submit a focused PR.
- Claim the bounty via IssueHunt after your PR merges.`,
  },
];
