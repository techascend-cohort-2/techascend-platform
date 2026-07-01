# TechAscend Platform

An AI-native learning + income-generation ecosystem for women in tech in Cameroon.
This is a **live, full-stack application**: real authentication, a real database, and
a real AI Tutor + project evaluator powered by Claude.

- **Marketing site** — the public landing page and a working application form.
- **Platform app** — role-based dashboards for **students**, **admins**, and **partners**,
  backed by a database (courses, cohorts, projects, submissions, gigs, payouts,
  partners, badges, hiring pipeline).
- **AI Tutor** — context-aware, streaming chat that knows the student's current lesson.
- **AI project evaluation** — submissions are scored against a rubric with feedback
  and a monetization suggestion.

## Tech stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, React 19) + TypeScript                |
| Auth      | Auth.js (NextAuth v5) — credentials + role-based access       |
| Database  | Prisma ORM — **SQLite** for local dev, **Postgres** for prod  |
| AI        | Claude (Anthropic) — tutor + evaluation                       |
| Styling   | CSS Modules + global CSS                                       |

## Quick start (local, zero config)

```bash
npm install            # installs deps + generates the Prisma client
npm run db:push        # creates the local SQLite database (prisma/dev.db)
npm run db:seed        # seeds cohorts, curriculum, partners, demo users…
npm run dev            # http://localhost:3000
```

Then open the app and sign in with a demo account.

### Demo accounts (password: `password`)

| Role    | Email                       | Lands on          |
| ------- | --------------------------- | ----------------- |
| Student | `amina@techascend.africa`   | `/dashboard`      |
| Admin   | `admin@techascend.africa`   | `/admin`          |
| Partner | `partner@techascend.africa` | `/partner`        |

The login screen has one-click buttons that fill each demo account for you.
You can also create a fresh account at `/signup`.

## Turning on the AI

The AI Tutor and project evaluation work in a graceful **demo mode** without a key
(they explain how to enable themselves). To make them live, set an Anthropic key:

```bash
# .env.local
ANTHROPIC_API_KEY="sk-ant-..."
# optional, defaults to claude-sonnet-5
ANTHROPIC_MODEL="claude-sonnet-5"
```

## Environment variables

See `.env.example`. The committed `.env` holds **safe local-dev defaults only**
(SQLite path + a dev auth secret + empty AI key). Never put real secrets in `.env` —
use `.env.local` (gitignored) locally and your host's secret manager in production.

| Variable            | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`      | Prisma connection string (SQLite file in dev, Postgres in prod)|
| `AUTH_SECRET`       | Auth.js session signing secret (`openssl rand -base64 32`)     |
| `AUTH_TRUST_HOST`   | `true` behind a proxy / on platforms that don't set the host   |
| `ANTHROPIC_API_KEY` | Enables the live AI Tutor + evaluation                         |
| `ANTHROPIC_MODEL`   | Optional model override                                        |

## Deploying to production (Vercel + Postgres)

1. **Switch the database to Postgres** — in `prisma/schema.prisma` change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   The models use only portable types, so no other schema change is needed.
2. Create a Postgres database (e.g. **Supabase** or **Neon**) and set `DATABASE_URL`
   to its connection string.
3. Set `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, and `ANTHROPIC_API_KEY` in your host's
   env settings.
4. Run the schema + seed once against prod: `npm run db:push && npm run db:seed`.
5. Deploy. The build runs `prisma generate && next build`.

## Data model

Prisma models (see `prisma/schema.prisma`) implement the platform spec
(`project/uploads/TechAscend_AI_Platform_Spec.md`): `User`, `Cohort`, `Module`,
`Lesson`, `Project`, `Submission`, `AiTutorLog`, `Partner`, plus supporting
`Gig`/`GigMatch`, `Payout`, `Badge`/`UserBadge`, `PipelineCard`, and `Application`.

## Project layout

```
app/
  (platform)/          role-gated app screens (dashboard, learning, tutor, projects, earn, admin, partner…)
  api/
    auth/[...nextauth] Auth.js handler
    tutor/             streaming AI Tutor endpoint
  apply/               public application form
  login/  signup/      auth pages
  page.tsx             marketing landing page
auth.ts, auth.config.ts, middleware.ts   authentication + route protection
lib/
  db.ts                Prisma client singleton
  ai.ts                Claude tutor + evaluation
  queries.ts           server-side data access for every screen
  actions/             server actions (auth, submissions, applications)
  validation.ts        zod schemas
prisma/
  schema.prisma        data model
  seed.ts              database seed
```

## Useful scripts

| Script              | Does                                             |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start the dev server                             |
| `npm run build`     | `prisma generate` + production build             |
| `npm run db:push`   | Sync the schema to the database                  |
| `npm run db:seed`   | Seed demo data                                    |
| `npm run db:reset`  | Reset + reseed the database                      |
| `npm run db:studio` | Open Prisma Studio                               |
