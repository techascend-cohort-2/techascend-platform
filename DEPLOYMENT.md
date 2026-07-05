# Free Deployment

This project can run on Vercel's free Hobby plan with a free hosted Postgres
database such as Supabase, Neon, or Prisma Postgres.

## 1. Prepare the production database

Create a free Postgres database and copy its pooled connection string. It should
look like:

```env
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

For production, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Keep local SQLite only for local development. Production needs Postgres because
the SQLite file is not durable on serverless hosting.

## 2. Set Vercel environment variables

In Vercel, import the GitHub repository and add these variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"
ANTHROPIC_API_KEY="optional-unless-ai-features-should-be-live"
ANTHROPIC_MODEL="claude-sonnet-5"
```

Generate `AUTH_SECRET` locally:

```bash
openssl rand -base64 32
```

## 3. Create tables and seed the program

After setting `DATABASE_URL` to the production Postgres URL locally, run:

```bash
npm run db:push
npm run db:seed
```

Then deploy from Vercel. The existing build script already runs:

```bash
prisma generate && next build
```

## 4. First login

Use the seeded admin account, then change the password immediately:

```text
admin@techascend.africa
TechAscend-Admin-2026
```

