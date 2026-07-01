import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Every demo account uses this password.
const DEMO_PASSWORD = "password";

async function main() {
  console.log("🌱 Seeding TechAscend platform…");

  // Idempotent reset (safe on a fresh or existing db).
  await prisma.gigMatch.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.gig.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.aiTutorLog.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.project.deleteMany();
  await prisma.module.deleteMany();
  await prisma.pipelineCard.deleteMany();
  await prisma.application.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.partner.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------------- Cohorts ----------------
  const [doualaA, yaoundeB, buea, studio] = await Promise.all([
    prisma.cohort.create({
      data: { name: "Douala · Track A", track: "A", trackName: "AI Software Eng", status: "Active", tone: "pos", hub: "Douala" },
    }),
    prisma.cohort.create({
      data: { name: "Yaoundé · Track B", track: "B", trackName: "AI Automation", status: "Active", tone: "pos", hub: "Yaoundé" },
    }),
    prisma.cohort.create({
      data: { name: "Buea · Explorer", track: "Foundations", trackName: "Foundations", status: "Onboarding", tone: "warn", hub: "Buea" },
    }),
    prisma.cohort.create({
      data: { name: "Douala · Studio", track: "Venture", trackName: "Venture", status: "Demo day", tone: "brand", hub: "Douala" },
    }),
  ]);

  // ---------------- Partners ----------------
  const mtn = await prisma.partner.create({
    data: { name: "MTN Foundation", abbr: "MTN", type: "funding", contribution: "50 sponsored seats", benefit: "Employer branding + CSR impact reporting", value: "8.5M F", seats: 50, contactInfo: "foundation@mtn.cm" },
  });
  await prisma.partner.createMany({
    data: [
      { name: "Orange Digital", abbr: "OR", type: "tech", contribution: "Infra + cloud credits", benefit: "Innovation exposure", value: "Active" },
      { name: "UNDP Cameroon", abbr: "UN", type: "funding", contribution: "Cohort grant", benefit: "SDG impact reporting", value: "6.2M F", seats: 40 },
      { name: "GIZ", abbr: "GIZ", type: "govt", contribution: "Youth employment support", benefit: "National skills development", value: "Active" },
      { name: "Mastercard Foundation", abbr: "MC", type: "funding", contribution: "Scholarships", benefit: "Pan-African reach", value: "12M F", seats: 80 },
      { name: "Microsoft", abbr: "MS", type: "tech", contribution: "Azure credits + tooling", benefit: "Talent pipeline access", value: "Active" },
    ],
  });

  // ---------------- Users ----------------
  const student = await prisma.user.create({
    data: {
      name: "Amina Njoya",
      email: "amina@techascend.africa",
      passwordHash,
      role: "student",
      title: "AI Software Eng · Track A",
      initials: "AN",
      avatarBg: "linear-gradient(135deg,#F0A,#7C3AED)",
      gender: "female",
      country: "Cameroon",
      track: "A",
      skillLevel: "intermediate",
      progressPercentage: 72,
      incomeStatus: "earning",
      githubUrl: "https://github.com/aminanjoya",
      portfolioUrl: "https://aminanjoya.dev",
      score: 4.9,
      incomeReadiness: 78,
      streak: 12,
      skills: ["React", "Node", "OpenAI"],
      projectsShipped: 7,
      cohortId: doualaA.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Grace Mbeki",
      email: "admin@techascend.africa",
      passwordHash,
      role: "admin",
      title: "Program Director",
      initials: "GM",
      avatarBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)",
      country: "Cameroon",
    },
  });

  const partnerUser = await prisma.user.create({
    data: {
      name: "MTN Foundation",
      email: "partner@techascend.africa",
      passwordHash,
      role: "partner",
      title: "Sponsorship Partner",
      initials: "MF",
      avatarBg: "linear-gradient(135deg,#FFCB05,#C97A0E)",
      partnerId: mtn.id,
    },
  });

  // Additional learners that populate the talent pool + hiring pipeline.
  const talentSeed = [
    { name: "Marie Doh", email: "marie@techascend.africa", title: "Automation Engineer", initials: "MD", avatarBg: "linear-gradient(135deg,#D6336C,#C97A0E)", track: "B", score: 4.8, skills: ["n8n", "APIs", "Stripe"], projects: 5, cohortId: yaoundeB.id },
    { name: "Grace Mba", email: "gracemba@techascend.africa", title: "AI Data Analyst", initials: "GM", avatarBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)", track: "A", score: 4.7, skills: ["SQL", "Python", "BI"], projects: 6, cohortId: doualaA.id },
    { name: "Joy Etang", email: "joy@techascend.africa", title: "Product Builder", initials: "JE", avatarBg: "linear-gradient(135deg,#7C3AED,#4F46E5)", track: "B", score: 4.6, skills: ["Bubble", "UX", "AI"], projects: 4, cohortId: yaoundeB.id },
    { name: "Fatima N.", email: "fatima@techascend.africa", title: "AI Engineer", initials: "FN", avatarBg: "linear-gradient(135deg,#7C3AED,#D6336C)", track: "A", score: 4.9, skills: ["React", "Node", "OpenAI"], projects: 7, cohortId: doualaA.id },
  ];
  const talentUsers = [] as { id: string; name: string }[];
  for (const t of talentSeed) {
    const u = await prisma.user.create({
      data: {
        name: t.name, email: t.email, passwordHash, role: "student", title: t.title,
        initials: t.initials, avatarBg: t.avatarBg, track: t.track, score: t.score,
        skillLevel: "intermediate", incomeStatus: "earning", country: "Cameroon",
        skills: t.skills, projectsShipped: t.projects,
        progressPercentage: 60 + t.projects, cohortId: t.cohortId,
        portfolioUrl: `https://portfolio.techascend.africa/${t.email.split("@")[0]}`,
      },
    });
    talentUsers.push({ id: u.id, name: u.name });
  }
  // Amina's own skill set (stored via GigMatch/skills usage) — keep on the main student too.
  const aminaSkills = ["React", "Node", "OpenAI"];

  // ---------------- Modules, Lessons, Projects (Track A) ----------------
  const trackAModules = [
    {
      title: "Foundations of AI-Assisted Development", order: 1,
      lessons: [
        { title: "How AI changes software engineering", type: "video" },
        { title: "Your AI-native toolchain", type: "task" },
      ],
    },
    {
      title: "Frontend Engineering with React", order: 2,
      lessons: [
        { title: "Components & state", type: "ai" },
        { title: "Building a real UI", type: "task" },
      ],
    },
    {
      title: "Backend & Databases", order: 3,
      lessons: [
        { title: "Node.js fundamentals", type: "ai" },
        { title: "Modelling data with PostgreSQL", type: "ai" },
      ],
    },
    {
      title: "API & System Integration", order: 4, current: true,
      lessons: [
        { title: "What is an API?", type: "ai", content: "An API is a contract that lets two programs talk to each other. You'll learn what an endpoint is, how requests and responses flow, and why APIs power every modern app." },
        { title: "HTTP methods & status codes", type: "ai", content: "GET, POST, PUT, DELETE — and how to read 2xx/4xx/5xx status codes." },
        { title: "Building REST APIs", type: "ai", order: 3, current: true, duration: "18 min",
          content: "## REST APIs\n\nLearn to design and build RESTful endpoints end-to-end.\n\n**In this lesson:**\n- What an API is and why it matters\n- How REST APIs work end-to-end\n- HTTP methods: GET, POST, PUT, DELETE\n- Reading and handling status codes\n- Testing endpoints with AI assistance",
          aiPrompt: "The student is on Lesson 4.3 — Building REST APIs. Focus help on REST concepts, HTTP methods, endpoints, status codes, and testing APIs. Use JavaScript/Node examples." },
        { title: "Authentication with JWT", type: "ai" },
        { title: "Testing endpoints with AI", type: "task" },
      ],
    },
    {
      title: "Cloud & Deployment", order: 5,
      lessons: [
        { title: "Deploying to the cloud", type: "video" },
        { title: "CI/CD with GitHub", type: "task" },
      ],
    },
    {
      title: "Capstone & Portfolio", order: 6,
      lessons: [
        { title: "Scoping your capstone", type: "task" },
        { title: "Shipping & presenting", type: "task" },
      ],
    },
  ];

  let currentLessonId: string | null = null;
  let module4Id: string | null = null;
  for (const m of trackAModules) {
    const mod = await prisma.module.create({
      data: { track: "A", title: m.title, orderIndex: m.order, description: `Track A · Module ${m.order}` },
    });
    if (m.current) module4Id = mod.id;
    let li = 1;
    for (const l of m.lessons as any[]) {
      const lesson = await prisma.lesson.create({
        data: {
          moduleId: mod.id, title: l.title, type: l.type,
          content: l.content ?? null, aiPrompt: l.aiPrompt ?? null,
          orderIndex: l.order ?? li, duration: l.duration ?? "12 min",
        },
      });
      if (l.current) currentLessonId = lesson.id;
      li++;
    }
  }

  // Track B modules (lighter).
  for (const [i, title] of [
    "Automation Foundations (n8n)", "No-code / Low-code Building", "AI Workflows with LangChain", "Freelancing & Monetization",
  ].entries()) {
    const mod = await prisma.module.create({ data: { track: "B", title, orderIndex: i + 1, description: `Track B · Module ${i + 1}` } });
    await prisma.lesson.create({ data: { moduleId: mod.id, title: `${title} — intro`, type: "ai", orderIndex: 1, duration: "15 min" } });
  }

  // ---------------- Projects ----------------
  const capstone = await prisma.project.create({
    data: {
      moduleId: module4Id,
      title: "AI Customer Support Agent",
      description: "Build and deploy an AI-powered customer support agent for a real local business, with documentation and a demo video.",
      deliverables: [
        { title: "Project Documentation", ext: "PDF" },
        { title: "Source Code", ext: "ZIP" },
        { title: "Demo Video", ext: "MP4" },
      ],
      monetizationPotential: "High — SMEs pay 60,000–120,000 F for a working support bot.",
    },
  });
  await prisma.project.createMany({
    data: [
      { moduleId: module4Id, title: "REST API for a bookings app", description: "Design and build a documented REST API.", monetizationPotential: "Medium", deliverables: [{ title: "Source Code", ext: "ZIP" }] },
      { title: "Landing page for a local bakery", description: "Ship a responsive marketing site.", monetizationPotential: "45,000 F freelance", deliverables: [{ title: "Deployed URL", ext: "LINK" }] },
    ],
  });

  // A completed, AI-reviewed submission for the demo student.
  await prisma.submission.create({
    data: {
      userId: student.id, projectId: capstone.id,
      submissionLink: "https://github.com/aminanjoya/support-agent",
      notes: "Deployed on Vercel with an OpenAI-backed chat widget.",
      aiScore: 87, mentorScore: 84, status: "mentor_reviewed",
      aiFeedback: "Strong functionality and clear docs. Improve error handling on the API layer and add tests.",
      monetizationSuggestion: "Package this as a 3-tier support-bot service for Douala SMEs (setup + monthly retainer).",
      rubric: [
        { label: "Functionality", score: 92 },
        { label: "Code quality", score: 85 },
        { label: "Documentation", score: 80 },
        { label: "Monetization potential", score: 90 },
      ],
    },
  });

  // ---------------- AI tutor history for the demo student ----------------
  await prisma.aiTutorLog.createMany({
    data: [
      { userId: student.id, lessonId: currentLessonId, prompt: "Can you explain what an API endpoint actually is, in simple terms?", response: "An endpoint is just a specific URL where an API listens for requests — like a phone number for one service. For example, GET /api/users returns a list of users.\n\nNext action: try fetching /api/users in your editor and log the result." },
      { userId: student.id, prompt: "Explain JWT authentication", response: "JWT is a signed token the server gives you after login; you send it back on each request to prove who you are.\n\nNext action: add an Authorization: Bearer <token> header to a test request." },
    ],
  });

  // ---------------- Badges ----------------
  const badgeData = [
    { name: "First Commit", iconPath: "M12 15a6 6 0 100-12 6 6 0 000 12z" },
    { name: "API Integrator", iconPath: "M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" },
    { name: "React Builder", iconPath: "M4 4h7v7H4z" },
    { name: "First Payout", iconPath: "M12 2v20" },
    { name: "Team Player", iconPath: "M17 21v-2a4 4 0 00-4-4H7" },
    { name: "Shipped to Prod", iconPath: "M20 6L9 17l-5-5" },
  ];
  const badges = [];
  for (const b of badgeData) badges.push(await prisma.badge.create({ data: { name: b.name, iconPath: b.iconPath, description: `${b.name} achievement` } }));
  // Award most badges to the demo student.
  for (const b of badges.slice(0, 5)) await prisma.userBadge.create({ data: { userId: student.id, badgeId: b.id } });

  // ---------------- Gigs + matches (Earn Hub) ----------------
  const gigSeed = [
    { title: "Landing page for a bakery", type: "Freelance · React", pay: "45,000 F", match: 96, glyph: "B", tint: "#7C3AED", tintBg: "#F1EAFC", skills: ["React", "Tailwind"], source: "freelance" },
    { title: "Invoice automation for an SME", type: "Studio gig · n8n", pay: "80,000 F", match: 91, glyph: "A", tint: "#1F9D6B", tintBg: "#E6F6EF", skills: ["n8n", "APIs"], source: "studio" },
    { title: "WhatsApp AI support bot", type: "Partner brief · OpenAI", pay: "120,000 F", match: 88, glyph: "AI", tint: "#D6336C", tintBg: "#FCE7F0", skills: ["OpenAI", "Node"], source: "partner" },
  ];
  for (const g of gigSeed) {
    const gig = await prisma.gig.create({
      data: { title: g.title, type: g.type, pay: g.pay, glyph: g.glyph, tint: g.tint, tintBg: g.tintBg, skills: g.skills, source: g.source },
    });
    await prisma.gigMatch.create({ data: { gigId: gig.id, userId: student.id, matchPct: g.match } });
  }
  // SME gigs (no match)
  await prisma.gig.createMany({
    data: [
      { title: "Online ordering page", type: "SME · Douala", pay: "35,000 F", source: "sme", need: "Online ordering page", location: "Douala", glyph: "MG", skills: ["React"] },
      { title: "Appointment chatbot", type: "SME · Buea", pay: "60,000 F", source: "sme", need: "Appointment chatbot", location: "Buea", glyph: "BH", skills: ["OpenAI", "Node"] },
    ],
  });

  // ---------------- Payouts ----------------
  await prisma.payout.createMany({
    data: [
      { userId: student.id, title: "Bakery landing page", method: "Mobile Money", amount: 45000, status: "Paid" },
      { userId: student.id, title: "CRM automation setup", method: "Mobile Money", amount: 80000, status: "Paid" },
      { userId: student.id, title: "AI support bot pilot", method: "In escrow", amount: 45000, status: "Pending" },
    ],
  });

  // ---------------- Hiring pipeline (partner portal) ----------------
  const byName = (n: string) => talentUsers.find((t) => t.name === n)?.id ?? null;
  await prisma.pipelineCard.createMany({
    data: [
      { stage: "Applied", userId: student.id, name: "Amina Njoya", role: "Frontend Eng", initials: "AN", avBg: "linear-gradient(135deg,#F0A,#7C3AED)", orderIndex: 1 },
      { stage: "Applied", userId: byName("Joy Etang"), name: "Joy Etang", role: "Automation", initials: "JE", avBg: "linear-gradient(135deg,#7C3AED,#4F46E5)", orderIndex: 2 },
      { stage: "Interview", userId: byName("Marie Doh"), name: "Marie Doh", role: "Full-stack", initials: "MD", avBg: "linear-gradient(135deg,#D6336C,#C97A0E)", orderIndex: 1 },
      { stage: "Interview", userId: byName("Grace Mba"), name: "Grace Mba", role: "Data analyst", initials: "GM", avBg: "linear-gradient(135deg,#1F9D6B,#7C3AED)", orderIndex: 2 },
      { stage: "Hired", userId: byName("Fatima N."), name: "Fatima N.", role: "AI Engineer", initials: "FN", avBg: "linear-gradient(135deg,#7C3AED,#D6336C)", orderIndex: 1 },
    ],
  });

  // Store Amina's skills on a match-less gig-independent place isn't needed; skills live per talent user.
  void aminaSkills;

  console.log("✅ Seed complete.");
  console.log(`   Demo logins (password: "${DEMO_PASSWORD}")`);
  console.log("   • student  amina@techascend.africa");
  console.log("   • admin    admin@techascend.africa");
  console.log("   • partner  partner@techascend.africa");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
