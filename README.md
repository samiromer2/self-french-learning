# self-french-learning

Self French Learning — An interactive CEFR-based French learning platform (A1–C2) focused on Reading, Writing, Listening, and Speaking, built with Next.js and deployed on Vercel.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Prisma · PostgreSQL · Auth.js (NextAuth v5, Credentials provider)

## Getting started

Requires Node 18.18+ (or 20+).

```bash
# start local Postgres
docker compose up -d

# install deps
npm install

# apply the Prisma schema
npx prisma migrate dev

# run the app
npm run dev
```

Copy `.env.example` to `.env` and adjust `DATABASE_URL` / `AUTH_SECRET` if needed.

## Project structure

See [shouldbethefilestructure.md](shouldbethefilestructure.md) for the intended layout and the master plan PDF for the full roadmap.