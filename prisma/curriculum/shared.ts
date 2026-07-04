import type { PhaseContent } from "./types";

// Shared phases taken by BOTH tracks: Phase 1 (Visibility, run live via the
// WhatsApp sessions), Phase 2 (AI Foundations) and Phase 5 (Launch & Earn).

export const sharedContent: PhaseContent[] = [
  {
    phaseSlug: "visibility",
    modules: [
      {
        title: "Build Your Professional Identity",
        description:
          "Before you write code, the world needs to be able to find you. Create and polish the six accounts every AI-powered builder needs.",
        lessons: [
          {
            title: "Why visibility comes before code",
            type: "ai",
            duration: "15 min",
            objectives: [
              "Understand why a professional online presence multiplies every skill you learn",
              "See how recruiters, clients and collaborators actually find talent",
              "Commit to your professional naming system across all platforms",
            ],
            content:
              "## Your name is your first product\n\nEvery opportunity in tech — a job, a freelance gig, a collaboration — starts with someone looking you up. If they find nothing, you don't exist to them. If they find a consistent, professional presence, you're already ahead of most applicants before a single interview.\n\nThat's why TechAscend starts here, not with syntax. Over this phase you will create and polish six accounts: **professional Gmail, GitHub, LinkedIn, X, Medium/Substack, and Hugging Face + Kaggle**.\n\n## Pick one professional identity\n\nChoose ONE name format and use it everywhere, e.g. `ngozi-tech`, `amina-builds`, or simply `firstnamelastname`. Avoid birth years, nicknames and numbers. Same profile photo everywhere: good light, plain background, your face clearly visible — a phone photo against a wall works perfectly.\n\n## What \"done\" looks like\n\nBy the end of this phase you'll submit all six profile links on your TechAscend profile page. Our community team reviews each one, and on approval you earn the **TechAscend Visibility Badge** and your first verifiable certificate — share both on LinkedIn and X.\n\n**Your task:** Decide your professional username and take (or choose) your profile photo. Write both down — you'll reuse them in every lesson this week.",
            aiPrompt:
              "The student is starting Phase 1 (Visibility): building a professional online identity. Help with choosing professional usernames, bios, and profile photos. Encourage consistency across GitHub, LinkedIn, X, Medium, Hugging Face and Kaggle.",
          },
          {
            title: "Professional Gmail & your naming system",
            type: "task",
            duration: "15 min",
            objectives: [
              "Create a clean, professional Gmail address",
              "Set up a recovery method so you never lose the account",
              "Use this one email for every professional platform",
            ],
            content:
              "## One professional inbox\n\nYour professional Gmail is the root of your identity — every other account this week will be created with it. If your current address is anything like `sweetbabygirl2004@gmail.com`, create a new one now.\n\n## Format\n\nBest options, in order: `firstname.lastname@gmail.com`, `firstnamelastname@gmail.com`, or `firstname.lastname.tech@gmail.com` if taken. No years, no nicknames.\n\n## Set it up properly\n\n1. Add a **recovery phone number and recovery email** — losing this account later means losing everything built on it.\n2. Turn on **2-step verification** (Security settings). This matters: your GitHub and LinkedIn will hang off this address.\n3. Set your display name to your real, professional name — it appears on every email you send.\n\nUse this address for GitHub, LinkedIn, X, Medium, Hugging Face and Kaggle — one email, one identity, everything findable and recoverable.\n\n**Your task:** Create (or clean up) your professional Gmail with recovery options and 2-step verification enabled. It becomes the email for every account you create this week.",
            aiPrompt:
              "Help the student set up a professional Gmail account: naming format, recovery options, 2-step verification. Keep advice concrete and step-by-step.",
          },
          {
            title: "GitHub: your builder's home",
            type: "task",
            duration: "25 min",
            objectives: [
              "Create a GitHub account with a professional username",
              "Complete your profile: photo, bio, verified email",
              "Understand why GitHub is a builder's real CV",
            ],
            content:
              "## Where your work will live\n\nGitHub is where every project you build at TechAscend will be published. Employers and clients don't read certificates first — they open your GitHub. An active profile with real projects beats a polished CV.\n\n## Minimum requirements (reviewed by our team)\n\n1. **Professional username** — the one you chose in lesson 1.\n2. **Profile picture** — your professional photo.\n3. **Bio completed** — one line that says what you're becoming, e.g. *\"AI-powered software engineering fellow @ TechAscend · building with React, Node & AI\"* (Track B: *\"AI automation & product fellow…\"*).\n4. **Email verified** — check your Gmail for the verification link.\n\n## Level up (5 extra minutes)\n\nCreate your first repository named exactly your username (e.g. `amina-builds/amina-builds`) — GitHub shows its README on your profile. Write three lines: who you are, what you're learning, what you want to build. Ask your AI assistant to help you draft it, then make it yours.\n\n**Your task:** Create your GitHub account meeting all four minimum requirements, and (bonus) add the profile README. Copy your profile URL — you'll submit it at the end of this phase.",
            aiPrompt:
              "Help the student set up a professional GitHub profile: username, bio wording, email verification, and the special profile README repository. Offer to draft bio/README text she can personalise.",
          },
          {
            title: "LinkedIn: your professional story",
            type: "task",
            duration: "30 min",
            objectives: [
              "Create a LinkedIn profile with photo, headline and About section",
              "Add TechAscend as your current learning experience",
              "Write a headline that says where you're going, not where you've been",
            ],
            content:
              "## The room where opportunities happen\n\nLinkedIn is where hiring managers, NGO programme leads and clients in Douala, Lagos, Nairobi and London all look. Your profile needs five things (our team reviews each):\n\n1. **Professional profile photo** — same one as GitHub.\n2. **Headline** — not \"Student\". Try: *\"AI-Powered Software Engineering Fellow @ TechAscend | Building with React, Node.js & AI\"* or the automation equivalent for Track B.\n3. **About section** — 4–6 sentences: who you are, what you're learning, what you've decided to become, and an invitation (\"Open to junior roles, internships and freelance projects from 2027\").\n4. **Education** — your schooling as it is. No embellishment; honesty reads stronger.\n5. **TechAscend added as current experience** — Title: \"Software Engineering Fellow\" (or \"AI Product & Automation Fellow\"), Company: TechAscend, Start date: July 2026, Description: two lines about the fellowship.\n\nDraft your About section with your AI assistant, then rewrite it in your own voice — reviewers can tell pure AI text from a real person.\n\n**Your task:** Complete all five items above and copy your profile URL (use LinkedIn's \"edit public profile URL\" to claim a clean link like linkedin.com/in/amina-builds).",
            aiPrompt:
              "Help the student write her LinkedIn headline and About section for the TechAscend fellowship, and add TechAscend as a current experience entry. Draft text she can personalise; keep it honest, confident and specific.",
          },
          {
            title: "X (Twitter): join the AI conversation",
            type: "task",
            duration: "20 min",
            objectives: [
              "Create a professional X account",
              "Follow the right AI and software engineering voices",
              "Post your first introduction",
            ],
            content:
              "## Where tech thinks out loud\n\nX is where AI news breaks, where builders share what they're shipping, and where a good thread can put a beginner from Buea in front of a hiring manager in Berlin. You don't need to be famous — you need to be present and consistent.\n\n## Set up (reviewed)\n\n1. **Professional username** — same identity as everywhere else (add `_` or `builds` if taken).\n2. **Profile picture** — same photo.\n3. **Bio** — one line + hashtag-free: *\"Software engineering fellow @ TechAscend. Building with AI. Documenting the journey.\"*\n4. **Follow 15–20 accounts** in AI and software engineering: AI labs and their researchers, African tech communities, developers who build in public. Ask your AI tutor for suggestions by category, then choose who resonates.\n\n## First post\n\nPost a short introduction: who you are, that you've started the TechAscend fellowship, and one thing you're excited to learn. Tag @-nobody, keep it simple, pin it to your profile.\n\n**Your task:** Complete your X profile, follow at least 15 relevant accounts, and publish + pin your introduction post. Copy your profile URL for submission.",
            aiPrompt:
              "Help the student set up a professional X (Twitter) presence: bio wording, categories of accounts to follow in AI/software, and drafting a genuine first introduction post.",
          },
          {
            title: "Medium or Substack: document your journey",
            type: "task",
            duration: "25 min",
            objectives: [
              "Create a Medium or Substack account",
              "Publish a short introductory post",
              "Understand why writing in public compounds your career",
            ],
            content:
              "## Learning in public\n\nEvery week of this fellowship you'll learn things worth writing down. Published learning notes do three jobs at once: they cement your understanding, they build a public record of growth, and they become the answer to \"tell me about yourself\" in every future interview.\n\nChoose **Medium** (simpler, built-in audience) or **Substack** (your own newsletter) — either is fine. Same username, same photo.\n\n## Your introductory post (reviewed)\n\nPublish a short post — 150 words is enough:\n\n> *Hello everyone! I'm excited to begin my journey as an AI-Powered Software Engineering student at TechAscend. I'll be documenting my learning journey throughout the program — what I build, what breaks, and what I learn fixing it. Follow along!*\n\nMake it yours: add why you joined, and what you want to build for your community. Draft with your AI assistant if you're stuck, but the final voice must be yours.\n\n## The habit\n\nAim for one short post per phase — even three paragraphs. By graduation you'll have a public trail of growth no CV can match.\n\n**Your task:** Create your Medium or Substack, publish your introduction post, and copy the profile (not post) URL for submission.",
            aiPrompt:
              "Help the student choose between Medium and Substack, and draft a genuine 150-word introduction post about starting the TechAscend fellowship. Encourage a learning-in-public habit.",
          },
          {
            title: "Hugging Face & Kaggle: your AI presence",
            type: "task",
            duration: "20 min",
            objectives: [
              "Create Hugging Face and Kaggle accounts with completed profiles",
              "Know what each platform is for and why they matter for AI careers",
            ],
            content:
              "## The two homes of applied AI\n\n**Hugging Face** is where the AI world shares models, datasets and demo apps (\"Spaces\") — think GitHub, but for machine learning. Later in the program you can deploy AI demos there for free, which is the single fastest way to show an employer you can *ship* AI, not just talk about it.\n\n**Kaggle** is where data skills are practised and proven: real datasets, free notebooks with GPUs, competitions with public leaderboards. Even one completed beginner notebook tells a recruiter you can work with data.\n\n## Set both up (reviewed)\n\nFor each platform: sign up with your professional Gmail, use your standard username and photo, and complete the profile (name, short bio, link to your GitHub). Two minutes of exploring each: on Hugging Face open a trending Space and try it; on Kaggle open the \"Titanic\" learn competition to see what a notebook looks like. You're not doing the work yet — you're learning the terrain.\n\n**Your task:** Create and complete both profiles, then copy both profile URLs. You now have all six links — next lesson you submit them for review.",
            aiPrompt:
              "Explain what Hugging Face and Kaggle are for, help complete both profiles, and give the student a 2-minute orientation tour of each platform.",
          },
          {
            title: "Submit your links for review",
            type: "task",
            duration: "10 min",
            objectives: [
              "Submit all six profile links on your TechAscend profile",
              "Understand the review process and what earns the Visibility Badge",
            ],
            content:
              "## Claim your first badge\n\nYou've built your professional identity across six platforms. Now make it official.\n\n## How submission works\n\n1. Open **My Profile** from the sidebar.\n2. In the **Visibility submission** section, paste all six links: GitHub, LinkedIn, X, Medium/Substack, Hugging Face, Kaggle.\n3. Submit. Your links go to the TechAscend community team for review.\n\n## What reviewers check\n\nExactly what the sessions covered: professional username, profile photo, completed bio on each platform, TechAscend listed on LinkedIn, introduction post published, email verified on GitHub. If something needs fixing you'll get a note back — fix it and resubmit, no penalty.\n\n## What you earn\n\nOn approval — and with every lesson in this phase marked complete — the platform automatically issues your **TechAscend Visibility Badge** and a **verifiable certificate** with a public link. Share both on LinkedIn and X and tag TechAscend: that post is itself the first entry in your public journey.\n\n**Your task:** Mark this lesson complete, go to My Profile, and submit all six links for review.",
            aiPrompt:
              "The student is submitting her six profile links for Visibility review on the profile page. Help her check each link against the review criteria before submitting.",
          },
        ],
      },
    ],
  },
  {
    phaseSlug: "ai-foundations",
    modules: [
      {
        title: "Think and Work with AI",
        description:
          "Understand what AI models really are, how to direct them with precision, and how to keep your judgement in charge.",
        lessons: [
          {
            title: "How AI models actually work",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Explain in plain words what a large language model does",
              "Understand tokens, training and why models sound confident",
              "Know what AI is genuinely good and bad at",
            ],
            content:
              "## Prediction machines\n\nA large language model (LLM) — the engine behind ChatGPT, Claude and Gemini — is, at its core, a system trained on enormous amounts of text to predict what comes next. Ask it a question and it generates the most plausible continuation, one small piece (a *token*) at a time.\n\nThis explains both its power and its danger. Power: it has absorbed patterns from billions of documents, so it can draft, translate, explain, and write code with startling fluency. Danger: *plausible* is not the same as *true*. A model will state a wrong answer with the same confident tone as a right one — this is called **hallucination**.\n\n## What this means for you as a builder\n\n- AI is brilliant at: drafting, explaining concepts many ways, transforming formats, generating code you then verify, brainstorming.\n- AI is weak at: precise facts it wasn't given, current events, arithmetic at scale, knowing when it's wrong.\n\nThe professional workflow you'll use all program: **you direct, AI drafts, you verify.** The person who understands the output owns the outcome.\n\n**Your task:** Ask your AI Tutor to explain LLMs three ways: to a child, to a market trader in Douala, and to an engineer. Note which explanation taught you something new, and write two sentences in your own words about what a hallucination is.",
            aiPrompt:
              "Teach how LLMs work at an intuitive level: next-token prediction, training data, hallucination. Use everyday Cameroonian analogies. The student may ask for the three-audience explanation exercise.",
          },
          {
            title: "Prompt engineering fundamentals",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Structure prompts with role, context, task, format and constraints",
              "Iterate on outputs instead of accepting the first answer",
              "Build a personal prompt library",
            ],
            content:
              "## Talking to AI is a skill\n\nThe difference between a mediocre AI answer and an excellent one is usually the prompt. Compare:\n\n> \"Write about my business\"\n\n> \"You are a marketing copywriter. Write a 3-sentence WhatsApp status for *Mama Grace Bakery* in Douala announcing we now take pre-orders for birthday cakes. Warm tone, plain English, end with the phone number 6XX XX XX XX.\"\n\nThe second prompt gives the model a **role**, **context**, a precise **task**, a **format**, and **constraints**. That's the whole craft in one sentence — the rest is practice.\n\n## The loop\n\nNever settle for draft one. Reply with corrections: \"shorter\", \"more formal\", \"give 3 alternatives\", \"explain why you chose this\". Each iteration sharpens the output — treat the model like a fast junior assistant, not an oracle.\n\n## Your prompt library\n\nProfessionals save prompts that work. Start a document (Google Doc or GitHub repo) called `prompt-library` and add every prompt that produced something great, with a note on what it's for.\n\n**Your task:** Write one five-part prompt (role, context, task, format, constraints) for a real need — a study plan, a business message, a bio — run it, iterate twice, and save the final version as the first entry in your prompt library.",
            aiPrompt:
              "Coach the student on prompt structure (role, context, task, format, constraints) and iterative refinement. Critique her prompts and show improved versions side by side.",
          },
          {
            title: "AI as your study and productivity partner",
            type: "ai",
            duration: "25 min",
            objectives: [
              "Use AI to learn faster: explanations, quizzes, summaries",
              "Automate everyday writing tasks responsibly",
              "Recognise when AI use helps learning vs. replaces it",
            ],
            content:
              "## Your unfair advantage\n\nUsed well, AI collapses the distance between confusion and understanding. Concretely, from today onwards:\n\n- **Stuck on a concept?** Ask for three explanations at different levels, then an example from your own life.\n- **Just finished a lesson?** Ask the tutor to quiz you with five questions, then grade your answers. Retrieval beats rereading.\n- **Long document?** Paste it and ask for a summary plus the three most important implications for your situation.\n- **Everyday writing** — formal emails, applications, announcements — draft with AI, then edit into your own voice.\n\n## The line you must not cross\n\nThere's a difference between AI helping you learn and AI learning instead of you. If you paste an exercise and submit the model's answer without understanding it, you've spent effort making yourself *look* skilled while staying unskilled — and every later phase will expose it. The rule for the whole fellowship: **you may use AI for everything, and you must be able to explain everything you submit.**\n\n**Your task:** Take the previous lesson's content, ask the AI Tutor to quiz you with five questions, answer them without looking, and have it grade you. Note your score and one gap it revealed.",
            aiPrompt:
              "Help the student build AI-assisted study habits: multi-level explanations, self-quizzing, summarisation. If asked to quiz her, generate five questions on the requested topic and grade her answers honestly.",
          },
          {
            title: "Verify everything: judgement over generation",
            type: "task",
            duration: "30 min",
            objectives: [
              "Catch an AI hallucination yourself",
              "Develop a verification checklist for AI outputs",
              "Understand accountability when shipping AI-assisted work",
            ],
            content:
              "## The skill that makes you employable\n\nAnyone can generate AI text. What clients and employers pay for is someone who can tell *good* output from *broken* output. That judgement is your real product — this lesson starts training it.\n\n## Hallucination hunt\n\nModels fail in predictable places: specific local facts (\"list five restaurants in Buea with their phone numbers\"), niche statistics, citations, and anything after their training cutoff. Ask a model such a question and then verify each claim with a search. You will almost certainly find at least one confident fabrication. Feel the danger of how *plausible* it looked.\n\n## Your verification checklist\n\nBefore using any AI output that matters:\n1. **Facts** — can I confirm names, numbers, dates from a real source?\n2. **Logic** — do the steps actually follow, or does it just sound smooth?\n3. **Fit** — does this match *my* context (country, currency, audience), or is it generic?\n4. **Ownership** — can I explain every line as if I wrote it?\n\nThis checklist applies to every submission for the rest of the program.\n\n**Your task:** Run a hallucination hunt: ask an AI three specific factual questions about Cameroon, verify each answer, and write a short paragraph (3–5 sentences) on what it got wrong and how you caught it. Keep this — it's a great Medium post draft.",
            aiPrompt:
              "Guide the student through detecting hallucinations and applying a verification checklist (facts, logic, fit, ownership). Be candid about model failure modes, including your own limitations.",
          },
        ],
      },
      {
        title: "Your Builder Toolkit",
        description:
          "The command line, Git & GitHub, an AI-powered editor, and a mental model of how the web fits together.",
        lessons: [
          {
            title: "Command line basics",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Navigate folders and files from a terminal",
              "Run, stop and read the output of commands",
              "Lose the fear — the terminal is just typing to your computer",
            ],
            content:
              "## Talking to your computer directly\n\nEvery tool you'll use — Git, Node, deployment, automation CLIs — lives in the terminal. It looks intimidating; it's actually just a chat box where the computer does exactly what you type.\n\n## The eight commands that cover 90% of life\n\n```\npwd         # where am I?\nls          # what's in this folder?\ncd projects # move into a folder\ncd ..       # move up one level\nmkdir app   # create a folder\ntouch notes.md   # create a file\ncat notes.md     # show a file's contents\nclear       # clean the screen\n```\n\nOn Windows, install **Git Bash** (it comes with Git, next lesson) so these same commands work; on Mac/Linux the built-in terminal is fine.\n\n## When a command fails\n\nRead the error out loud — it usually says exactly what's wrong (\"no such file or directory\" = you're in the wrong folder; check with `pwd` and `ls`). Paste any confusing error to your AI assistant and ask \"explain this error and how to fix it\" — that habit alone will carry you through the whole program.\n\n**Your task:** In your terminal, create a folder `techascend`, inside it a folder `phase-2`, inside that a file `about-me.md`, write one sentence in it, and show its contents with `cat`. Screenshot the session for your notes.",
            aiPrompt:
              "Teach terminal basics: navigation, creating files/folders, reading errors. The student may be on Windows (recommend Git Bash), Mac or Linux. Give copy-pasteable commands and decode any error she pastes.",
          },
          {
            title: "Git & GitHub: save points for your work",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Understand repositories, commits and pushes",
              "Create a repo locally and publish it to GitHub",
              "Write commit messages a teammate can read",
            ],
            content:
              "## Never lose work again\n\nGit is a time machine for your projects: every **commit** is a save point you can return to. GitHub is the online home where those save points are published — and where reviewers, employers and teammates see your work.\n\n## The core loop (you'll run it thousands of times)\n\n```\ngit init                     # once per project: start tracking\ngit add .                    # stage your changes\ngit commit -m \"Add about page\"   # save point with a message\ngit push                     # publish to GitHub\n```\n\nSet up once: install Git, then `git config --global user.name \"Your Name\"` and `git config --global user.email \"your@gmail.com\"` (your professional Gmail).\n\n## Publish your first repo\n\nOn GitHub create an empty repository `techascend-journey`. Then connect your local `techascend` folder from last lesson (GitHub shows the exact three commands after you create the repo — read them, run them, and ask your AI assistant about anything unclear).\n\n## Commit messages\n\nWrite what the change *does*: \"Add phase-2 notes\", not \"stuff\" or \"asdf\". Your commit history is part of your professional image.\n\n**Your task:** Publish `techascend-journey` to your GitHub with at least two commits with clear messages. This repo will collect your notes and exercises for the whole fellowship.",
            aiPrompt:
              "Teach the Git basics loop (init, add, commit, push) and help publish a first repository to GitHub. Decode Git errors (auth, remote, branch names) step by step — first-time pushes often hit token/credential issues.",
          },
          {
            title: "VS Code + your AI assistant",
            type: "task",
            duration: "30 min",
            objectives: [
              "Install and set up Visual Studio Code",
              "Add an AI coding assistant and learn the ask–apply–verify loop",
              "Open a project folder and edit with confidence",
            ],
            content:
              "## Your workshop\n\nVisual Studio Code is the editor most of the world's software is written in — free, fast, endlessly extensible. Install it from code.visualstudio.com, then take the 5-minute built-in tour.\n\n## Make it yours\n\n1. Open your `techascend` folder (**File → Open Folder** — always open the *folder*, not a single file).\n2. Install extensions: **Prettier** (auto-formatting) and an AI assistant — GitHub Copilot has a free tier for many users; Codeium is a free alternative; and you can always keep Claude or ChatGPT open beside the editor. Any of these is fine for the program.\n3. Learn three shortcuts: `Ctrl+P` (jump to file), `Ctrl+\\`` (toggle terminal — yes, the terminal lives inside VS Code), `Ctrl+S` (save).\n\n## The AI-native editing loop\n\nAsk your assistant for code → apply it → **read every line and ask about anything you can't explain** → run it → paste errors back. This loop, plus the verification checklist from Module 1, is exactly how professional AI-native engineers work in 2026.\n\n**Your task:** Set up VS Code with Prettier and an AI assistant, open your `techascend` folder, improve your `about-me.md` (add headings and a goals list), and commit + push the change with a clear message.",
            aiPrompt:
              "Help the student set up VS Code, extensions (Prettier, an AI assistant like Copilot/Codeium), the integrated terminal, and practise the ask-apply-verify editing loop.",
          },
          {
            title: "How the web works: clients, servers & APIs",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Trace what happens when you open a website",
              "Distinguish front end, back end, database and API",
              "See where both tracks fit in the same picture",
            ],
            content:
              "## The one diagram behind everything\n\nWhen you open a site on your phone (the **client**), it sends a **request** across the internet to a **server** — a computer that never sleeps. The server may consult a **database** (where information lives permanently), then sends back a **response**: the page you see. Every app you've ever used is this loop, repeated fast.\n\n## The four parts, in market terms\n\nThink of a restaurant: the **front end** is the dining room (what customers see and touch), the **back end** is the kitchen (where the real work happens), the **database** is the storeroom (where ingredients are kept), and the **API** is the waiter — a messenger carrying structured orders between the dining room and kitchen, with a fixed menu of what can be asked for.\n\nAn API request is literally a formatted message like `GET /api/orders` (\"waiter, fetch the orders\"). APIs matter to *both* tracks: Track A builds them; Track B connects them to automate businesses.\n\n## See it live\n\nIn your browser, press F12 to open developer tools → **Network** tab → reload any site. Every line is a request. Click one: you can see the request and the response. You've just watched the web work.\n\n**Your task:** Draw the client → API → server → database diagram by hand, label each part with your restaurant analogy (or your own better one), photograph it, and add it to your `techascend-journey` repo.",
            aiPrompt:
              "Teach the client/server/API/database mental model with everyday analogies. Help the student explore the browser Network tab and interpret a real request/response.",
          },
        ],
      },
    ],
  },
  {
    phaseSlug: "launch-earn",
    modules: [
      {
        title: "Income Channels",
        description:
          "Turn a semester of shipped work into money: positioning, pricing, portfolio and interviews.",
        lessons: [
          {
            title: "Where the money is: your four income channels",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Map the four channels: freelance, local SME work, employment, your own product",
              "Choose your primary channel for the next 6 months",
              "Understand how TechAscend's partner network fits in",
            ],
            content:
              "## Four doors, pick one to push first\n\nEverything you've built — the profiles, the skills, the capstone — now needs a route to income. There are four:\n\n1. **Freelance platforms** (Upwork, Fiverr, Contra): global demand, hard first win, compounding after 3–5 reviews. Best paired with the exact skills of your capstone.\n2. **Local SME work**: bakeries, clinics, boutiques and schools around you need ordering pages, booking bots and invoice automation. Less competition, real relationships, paid in FCFA via Mobile Money — often the *fastest* first income.\n3. **Employment / internships**: through TechAscend's hiring partners (keep your Talent Pool profile visible!) and normal applications. Steadier, slower to land.\n4. **Your own product**: the hardest and slowest — but Track B especially has the skills to launch a micro-SaaS.\n\n## Choose deliberately\n\nTrying all four at once means failing at all four. Pick a primary (most fellows: local SME work or freelance) and a secondary (usually employment applications in the background).\n\n**Your task:** Write a one-page income plan: your primary channel, why, your first three concrete actions, and a monthly income target for month 3 (be realistic — 50,000–150,000 F is a strong start).",
            aiPrompt:
              "Help the student choose between freelance platforms, local SME clients, employment, and own-product paths based on her track and capstone. Push for one primary channel and concrete first actions with realistic FCFA targets.",
          },
          {
            title: "Pricing & proposals that win",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Price fixed-scope packages instead of hourly rates",
              "Write a one-page proposal a non-technical client says yes to",
              "Handle 'it's too expensive' without collapsing your price",
            ],
            content:
              "## Sell outcomes, not hours\n\nA Douala shop owner doesn't care about your hours — she cares that orders stop getting lost. So sell the outcome as a **package**: \"Online ordering page, live in 7 days, training included — 60,000 F.\" Fixed scope, fixed price, clear deliverable.\n\n## Reference points (Cameroon SME market, adjust to your city)\n\n- Landing page / ordering page: **40,000–80,000 F**\n- WhatsApp support or booking bot: **80,000–150,000 F** setup + optional monthly care fee\n- Invoice / reminder automation: **60,000–120,000 F**\n- Monthly maintenance & support: **10,000–25,000 F/month** — recurring revenue is what stabilises freelance life.\n\n## The one-page proposal\n\nProblem (their words) → Solution (plain language, no jargon) → Deliverables (bullet list) → Timeline → Price → What you need from them → One line about you + portfolio link. Draft it with AI, personalise, send as PDF.\n\n## \"Too expensive\"\n\nDon't drop the price — shrink the scope: \"We can start with just the ordering page at 40,000 F and add the WhatsApp bot next month.\" Price cuts without scope cuts teach clients to squeeze you.\n\n**Your task:** Create your rate card (3 packages with prices) and a proposal template. Submit both to your `techascend-journey` repo.",
            aiPrompt:
              "Coach on productised pricing for Cameroon SMEs, drafting one-page proposals, and negotiating by scope rather than price. Use realistic FCFA figures.",
          },
          {
            title: "Portfolio & case studies",
            type: "task",
            duration: "40 min",
            objectives: [
              "Turn your capstone into a written case study",
              "Assemble a portfolio a stranger can grasp in 90 seconds",
              "Make every profile point to it",
            ],
            content:
              "## Proof beats promises\n\nWhen a client or employer looks you up (and after Phase 1, they *will* find you), they should hit proof of work within two clicks. The strongest proof format is the **case study** — not \"technologies used\" but a story:\n\n1. **Context** — who it was for and the problem in one paragraph.\n2. **What I built** — plain language + one screenshot or the demo video from Phase 4.\n3. **How** — the interesting decisions, including how you used AI and what you verified.\n4. **Result** — what works now that didn't before; numbers if you have them.\n5. **Links** — live demo + repository.\n\n## Assemble the portfolio\n\nTrack A: a simple portfolio site (you built one in Phase 4) with your case studies. Track B: a Medium post or Notion page per case study works fine — the writing matters more than the site. Either way: your capstone case study is mandatory, plus 1–2 smaller pieces from the program.\n\nThen close the loop: link the portfolio from GitHub bio, LinkedIn About, X bio and Medium. One identity, everything connected — exactly what Phase 1 set up.\n\n**Your task:** Publish your capstone case study and link it from all Phase 1 profiles. Post the link in the TechAscend community feed for feedback.",
            aiPrompt:
              "Help structure and edit portfolio case studies (context, build, decisions, result). Review drafts hard for jargon a non-technical client wouldn't understand.",
          },
          {
            title: "Interviews & remote-work readiness",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Answer the five interview questions that always come",
              "Present AI-assisted work honestly and confidently",
              "Meet the practical bar for remote work: communication, availability, reliability",
            ],
            content:
              "## The five questions\n\nAlmost every junior interview, local or remote, includes: *Tell me about yourself* (your journey → what you build → where you're going, 60 seconds); *Walk me through a project* (use your case-study structure); *How do you use AI tools?*; *Tell me about a problem you got stuck on*; *What do you want to learn next?* Prepare all five out loud — not in your head. Rehearse with your AI tutor: ask it to interview you and critique your answers.\n\n## The AI question — answer it like a 2026 professional\n\nWeak: \"I try not to use AI.\" Weak: \"AI writes my code.\" Strong: **\"I work AI-native: I direct the tools, verify everything they produce, and I can explain every line I ship. Here's an example…\"** — then tell the story of a bug you caught in AI output (you have several from this program).\n\n## Remote-readiness checklist\n\nRemote employers buy *reliability*: stable-enough internet plan (and a backup plan — a nearby workspace or data bundle), a quiet corner, camera-ready presence, crisp written updates (\"Done / Doing / Blocked\" format), and honesty about timezone and availability. These basics eliminate more candidates than technical skill does.\n\n**Your task:** Do a mock interview with your AI tutor (all five questions, spoken aloud, then typed summaries). Note the weakest answer and rewrite it. Book a peer mock interview via the community feed.",
            aiPrompt:
              "Run realistic mock interviews for junior roles: ask the five classic questions one at a time, critique answers honestly, and coach the 'how do you use AI' answer especially hard.",
          },
        ],
      },
      {
        title: "Launch Week",
        description:
          "Go public, find your first leads, get paid properly, and stand on the Demo Day stage.",
        lessons: [
          {
            title: "Your public launch",
            type: "task",
            duration: "30 min",
            objectives: [
              "Announce your services / availability across your platforms",
              "Ship the launch post with your portfolio attached",
            ],
            content:
              "## Stop being a secret\n\nSix months ago you created six profiles. Today they work for you. A **launch post** is a simple announcement that you exist, you build, and you're available:\n\n> *Six months ago I couldn't write a line of code. This week I shipped [capstone, one line] — live demo + case study below. I'm now taking on [what you offer: ordering pages / WhatsApp bots / junior roles]. If you know a business that needs this, my DMs are open.*\n\nPost the long version on LinkedIn and Medium, the short version on X (pin it), the friendly version on WhatsApp Status — in Cameroon, WhatsApp Status is often where the first client actually comes from.\n\n## Make it easy to say yes\n\nEvery version links your portfolio and states one clear way to contact you. Reply to every comment; each reply pushes the post to more feeds.\n\n**Your task:** Publish your launch post on at least LinkedIn, X and WhatsApp Status, links included. Drop the LinkedIn link in the community feed — the whole cohort engages with each other's launches this week.",
            aiPrompt:
              "Help draft and adapt the launch post for LinkedIn, X, Medium and WhatsApp Status. Keep it genuine, specific and confident; review drafts against the student's actual capstone.",
          },
          {
            title: "Finding your first three leads",
            type: "task",
            duration: "40 min",
            objectives: [
              "Build a list of 10 realistic prospects",
              "Send three tailored outreach messages",
              "Track everything in a simple pipeline",
            ],
            content:
              "## Leads don't arrive — they're fetched\n\nA **lead** is a specific person/business with a problem you can solve. Build a list of ten: businesses you already know (your tailor, your pharmacy, your church's school), businesses whose pain you can *see* (taking orders in DMs, paper appointment books, chasing payments by hand), and referrals (\"who do you know that runs a busy shop?\").\n\n## The outreach message\n\nShort, specific, about *them*:\n\n> *Hello Madame Solange — I noticed Bella Boutique takes orders through WhatsApp DMs. I build simple ordering pages that collect orders automatically so nothing gets lost (example: [portfolio link]). Would you be open to a 15-minute chat this week? — Amina, TechAscend fellow*\n\nNo essay, no jargon, one clear ask. Personalise every message — copy-paste blasts read as spam and burn your name.\n\n## Track it\n\nA simple sheet: Name · Contact · Problem · Status (contacted → replied → meeting → proposal → won/lost) · Next action + date. Follow up once after 3–4 days; silence after two touches means move on gracefully.\n\n**Your task:** Build your 10-prospect list, send your first three tailored messages, and set up the tracking sheet. Report your first reply in the community feed — first meeting booked gets celebrated at Demo Day.",
            aiPrompt:
              "Help brainstorm realistic local prospects, draft short personalised outreach messages (no spam patterns), and set up a simple lead-tracking sheet. Role-play the follow-up conversation if asked.",
          },
          {
            title: "Getting paid: invoices, Mobile Money & simple records",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Issue a professional invoice",
              "Structure deposits and final payments to protect yourself",
              "Keep records that make month-end obvious",
            ],
            content:
              "## Professionals get paid on purpose\n\nThe difference between a hobby and a business is the paper trail. Three habits from your very first gig:\n\n**1. Always invoice.** A one-page PDF: your name/brand + contact, client name, date + invoice number (start at #001), line items with prices, total, payment instructions, due date. Generate a clean template with your AI assistant once, reuse forever.\n\n**2. Deposit first.** For fixed-scope work: **50% before you start, 50% on delivery**. This is standard, it filters unserious clients, and it means you never work a full project for free. For monthly support fees: payment at the start of the month.\n\n**3. Mobile Money, done properly.** MTN MoMo and Orange Money are how Cameroonian SMEs actually pay. Confirm every payment with a message (\"Received 30,000 F deposit for invoice #003 — thank you! Work starts tomorrow.\") so the record exists in writing.\n\n## The money sheet\n\nOne row per payment: date, client, invoice #, amount, channel. Ten seconds per entry, and at month-end you know exactly what you earned. Report earnings to TechAscend when they happen — verified income becomes part of the program's public impact record (and your Earn Hub payout history).\n\n**Your task:** Create your invoice template and money sheet, and write your standard payment-terms paragraph (deposit %, due dates, MoMo details) for the bottom of every proposal.",
            aiPrompt:
              "Help create an invoice template, deposit-based payment terms, and a simple income record. Ground everything in Mobile Money workflows used in Cameroon.",
          },
          {
            title: "Demo Day: tell the story of your build",
            type: "task",
            duration: "35 min",
            objectives: [
              "Structure a 5-minute demo presentation",
              "Demo live software without panic",
              "Close the fellowship with a clear next chapter",
            ],
            content:
              "## Five minutes on stage\n\nDemo Day (12 December) puts you in front of the cohort, staff and partners. The structure that works:\n\n1. **Who I was** (30s) — one honest sentence about where you started in July.\n2. **The problem** (45s) — whose problem your capstone solves; make the audience feel it.\n3. **The demo** (2 min) — the live product doing its job. One golden path, rehearsed five times. Have the Phase 4 demo video ready as a fallback if the network betrays you — pros always have plan B.\n4. **How I built it** (1 min) — the stack, one hard moment, and how you used AI like a professional.\n5. **What's next** (45s) — your income channel, your ask (\"if you run a shop that loses orders in DMs — talk to me after this\").\n\n## Rehearse like it matters\n\nOut loud, timed, three times minimum — once to your AI tutor (paste your script, ask for cuts), once to a peer, once to a mirror. Cut everything that doesn't serve the story; five tight minutes beat eight loose ones.\n\n**Your task:** Write your script, rehearse three times, and submit your slide (just one: name, capstone, ask) via the community feed before 10 December.",
            aiPrompt:
              "Help script and tighten a 5-minute Demo Day presentation: story structure, live-demo golden path, fallback plan, and the closing ask. Time-check sections and cut ruthlessly.",
          },
        ],
      },
    ],
  },
];
