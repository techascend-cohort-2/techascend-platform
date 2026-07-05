# TechAscend Platform

The live platform for the **TechAscend AI-Native Fellowship** — training women in
Cameroon to build with AI and turn skills into income. Full-stack, database-backed,
no placeholder pages, no fabricated data.

## The program it runs (Cohort 02 · July–December 2026)

| Phase | Dates | Completion earns |
| ----- | ----- | ---------------- |
| 1 · Visibility | Jul 3 – Jul 12 | Visibility Badge + certificate (profile links reviewed by staff) |
| 2 · AI Foundations | Jul 13 – Aug 7 | AI Foundations Badge + certificate |
| 3 · Core Skills (per track) | Aug 10 – Oct 9 | Core Builder Badge + certificate |
| 4 · Build Studio (capstones) | Oct 12 – Nov 20 | Studio Builder Badge + certificate |
| 5 · Launch & Earn | Nov 23 – Dec 18 | Launch Ready Badge + certificate |

Completing all five auto-issues the **program certificate** + Graduate badge.
Badges/certificates are generated automatically by the award engine (`lib/progress.ts`)
— every certificate has a public verification page at `/certificates/<code>`.

Seeded content: **5 phases · 19 modules · 76 real lessons** (shared + Track A
"AI-Powered Software Engineering" + Track B "AI Product & Automation"),
**6 capstone briefs**, and a **57-event calendar** (orientation Jul 6, Tue/Thu live
sessions, phase kickoffs, deadlines, Demo Day Dec 12, graduation Dec 18).

## Roles & workspaces

- **Student** — dashboard, curriculum with per-lesson progress, AI Tutor (lesson-aware,
  streaming), capstone submission with AI evaluation, community, events, opportunities,
  Earn Hub (real payouts only), badges & certificates, profile (incl. Phase 1 links submission).
- **Applicant** — anyone who signs up: application status workspace, events, profile.
  Accepted by staff → becomes a student automatically.
- **Community manager** — community feed moderation, review queues (visibility +
  project submissions), members list, events management, opportunities.
- **Admin** — everything: overview KPIs, applications, reviews, members (roles/tracks/
  cohorts/password resets), full curriculum editor, cohorts, partners, events,
  opportunities, revenue ledger.
- **Partner** — portal, opted-in talent pool, hiring pipeline (kanban), own
  opportunities, live impact metrics.

## Run it

```bash
npm install
npm run db:push        # create SQLite db (dev)
npm run db:seed        # seed the full program
npm run dev            # http://localhost:3000
```

### Operating accounts (seeded — CHANGE BOTH PASSWORDS after first login)

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `admin@techascend.africa` | `TechAscend-Admin-2026` |
| Community manager | `community@techascend.africa` | `TechAscend-Team-2026` |

Students are **not** pre-seeded (no fake data): they sign up at `/signup` (become
applicants) and are accepted in **Applications**; or staff accept a landing-page
application and generate an account with a one-time temporary password.

## Importing existing students (bulk)

You already have a roster, so students don't have to sign up one by one. Two ways,
both create **student** accounts with a shared default password and set
`mustChangePassword` so each person is prompted to set her own on first login.
Accounts that already exist are skipped (never overwritten).

**CSV format** (header row optional — see `students-template.csv`):

```csv
name,email,track,city,phone
Amina Njoya,amina@example.com,A,Douala,+237600000001
Marie Doh,,B,Yaoundé,+237600000002
```

- `name` — required
- `email`, `phone` — at least one is required; each must be unique when present
- `track` — `A` or `B` (defaults to `A`)
- `city` — optional

**Option 1 — Admin UI:** sign in as admin → **Members** → *Import from CSV*.
Paste rows or upload a `.csv`, set the default password and cohort, and import.
You get a summary of created / skipped / invalid rows.

**Option 2 — Command line** (good for a big spreadsheet export):

```bash
npm run import:students -- ./students-template.csv "TechAscend2026!" "Cohort 02"
#                            ^ csv file             ^ default password  ^ cohort (optional; matches by name)
```

> Keep real rosters out of git — CSVs at the repo root are gitignored (only
> `students-template.csv` is tracked).

## AI

Claude powers the tutor (spec system prompt + per-lesson context injection, streaming)
and capstone evaluation (rubric + feedback + monetization suggestion). Without
`ANTHROPIC_API_KEY` both run in a clearly-labelled demo fallback.

```bash
# .env.local
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-sonnet-5"   # optional
```

## Production

1. `prisma/schema.prisma`: change provider `sqlite` → `postgresql`; set `DATABASE_URL`.
2. Set `AUTH_SECRET` (`openssl rand -base64 32`), `AUTH_TRUST_HOST=true`, `ANTHROPIC_API_KEY`.
3. `npm run db:push && npm run db:seed` once against prod, then deploy (`prisma generate && next build`).

For the full free Vercel + Postgres checklist, see `DEPLOYMENT.md`.

## Key architecture

```
lib/progress.ts        award engine: lesson/visibility/capstone completion → auto badge + certificate + notification
lib/queries.ts         all server-side data access
lib/actions/           server actions (auth, program, community, staff, submissions, applications)
auth.config.ts         5-role route protection (edge middleware)
prisma/curriculum/     full seeded curriculum (shared + track A + track B)
prisma/seed.ts         program install: phases, badges, events, staff accounts
app/(platform)/        all role workspaces
app/certificates/[code] public certificate verification & print
```
