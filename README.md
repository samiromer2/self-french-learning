# Self French Learning + French in Canada

An interactive CEFR French-learning app and a portfolio analytics layer on **French in Canada**.

The learning side is for a newcomer who needs usable French. The analytics side is first-party practice metrics next to **Statistics Canada** Census extracts. Those two datasets are never treated as the same sample.

Live: [https://self-french-learning.vercel.app/](https://self-french-learning.vercel.app/)

## What’s in the product

a lot was added

**Curriculum**

| Track | Content |
| --- | --- |
| A1 Beginner | 6 units × 4 skills = 24 lessons (greetings, alphabet, numbers, family, food, daily life) |
| A2 Elementary | 6 units × 4 skills = 24 lessons (travel, work, weather, hobbies, directions, telling stories) |
| Scenarios | 10 survival lessons (café, grocery, transport, doctor, interview, bank, renting, pharmacy, restaurant, phone) |
| Unit quizzes | 6 A1 quizzes (7 questions each: reading, listening TTS, fill-blank, sentence order) |
| Vocabulary | Hover words in reading passages + `/vocabulary` flashcards (`LEARNING` / `KNOWN`) |

Each unit lesson is one skill: reading, writing, listening, or speaking. Listening and speaking use the browser’s French TTS (A1 rate 0.8, A2 rate 0.9). Exercises shipped: multiple choice, fill-blank, sentence order, dictation, writing prompt, speaking prompt.

**Progress and play**

- Lesson scores, XP, streaks, achievements (including Quiz Whiz, A1 Graduate, A2 Graduate)
- Timed sittings stored on `LearningSession`
- Dashboard cards per CEFR level, plus scenario progress
- Leaderboard

**Analytics** (`/analytics`)

- Overview, My Learning, French in Canada, Geography, Trends, Data Sources
- Personal KPIs from this app only (hours, streak, lesson scores, quiz average, words marked known)
- Official bilingualism, FOLS, home language, work language, immigrant-status language knowledge — from StatCan table ids, not scraped pages and not invented numbers

## Tech stack

| Layer | Choice | Role |
| --- | --- | --- |
| App framework | **Next.js 16** (App Router) | Pages, server components, server actions |
| Language | **TypeScript** | App + Prisma client |
| UI | **React 19**, **Tailwind CSS 4**, **shadcn/ui**, **Lucide**, **Sonner** | Layout, cards, toasts |
| Charts | **Recharts** | Learning and Census dashboards |
| Auth | **Supabase Auth** (`@supabase/ssr`) | Email signup/login. App `User.id` = Supabase user UUID |
| Database | **PostgreSQL 16** | Curriculum, progress, quizzes, sessions, flashcard reviews |
| ORM | **Prisma 6** | Schema, migrations, seed |
| Hosting | **Vercel** | App + serverless routes |
| Local DB | **Docker Compose** (`postgres:16-alpine`) | `docker compose up -d` |
| Analytics pipeline | **Python 3**, **pandas**, **numpy**, **matplotlib** | Download → clean → validate → insights |
| SQL | PostgreSQL (learner KPIs) + SQLite (processed Canada cube) | [`sql/`](sql/), [`docs/sql-analysis.md`](docs/sql-analysis.md) |
| BI | Power BI–ready CSVs (star schema) | [`docs/power-bi.md`](docs/power-bi.md) |
| Audio | Browser `speechSynthesis` (fr-FR) | No recorded files yet |

No extra env vars beyond [`.env.example`](.env.example): `DATABASE_URL`, Supabase URL + publishable/anon key, `SUPABASE_SECRET_KEY` (server-only, pre-confirmed signup).

## Architecture

```
Browser (Next.js)
  ├── Learn / Quizzes / Flashcards / Scenarios   (auth)
  ├── Dashboard / Leaderboard                    (auth)
  └── Analytics
        ├── My Learning     ← PostgreSQL (session user only)
        └── Canada / maps   ← data/analytics/dashboard_bundle.json

Auth: Supabase  →  profile row in PostgreSQL (Prisma)

Statistics Canada ZIP/CSV
        ↓
analytics/ (pandas)  →  data/processed/  →  data/analytics/
        ↓
Web JSON bundle  +  Power BI CSVs  +  SQLite
```

## Data (Canada)

| Kind | What | Where |
| --- | --- | --- |
| First-party | Lessons, quizzes, flashcards, streaks, timed sessions | PostgreSQL (`Progress`, `QuizAttempt`, `UserVocabulary`, `LearningSession`, `User`) |
| Public | Knowledge of official languages 1951–2021 | Statistics Canada 15-10-0004 |
| Public | First official language spoken 1971–2021 | 15-10-0032 |
| Public | Language most often at home 1971–2021 | 15-10-0033 |
| Public | Official languages by immigrant status | 15-10-0037 |
| Public | Language used most often at work (2021) | 98-10-0533 (province totals only) |
| Public | Mother tongue (extract currently through 2016) | 15-10-0003 |

Licence: [Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada). Details: [`docs/data-sources.md`](docs/data-sources.md).

Dashboards are built around questions, not chart decoration: bilingualism over time, provinces, home vs work, Quebec vs Canada outside Quebec, immigrants vs non-immigrants, and *my* practice without treating it as a national sample. Insights on **Trends** come from `analytics/insights.py`.

## Getting started (app)

Needs Node 18.18+ (or 20+) and Docker for local Postgres.

```bash
cp .env.example .env
# fill Supabase keys if you want auth locally
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Analytics: [http://localhost:3000/analytics](http://localhost:3000/analytics)

**Production / Vercel** (after pulling new work):

```bash
npx prisma migrate deploy   # LearningSession, UserVocabulary, …
npx prisma db seed          # A1+A2 lessons, 10 scenarios, A1 quizzes, achievements
```

Seed upserts curriculum in place. It does not wipe user progress.

## Data pipeline

```bash
python3 -m pip install -r analytics/requirements.txt
python3 -m analytics.run_pipeline
python3 -m unittest analytics.tests.test_clean
```

Re-runs use cached `data/raw/` when present. The 2021 language-of-work cube is huge; after the first clean, the pipeline reuses `data/processed/work_province_extract.csv` instead of downloading ~2 GB again.

Power BI: import `data/analytics/powerbi/*.csv`. HTTP export: `/api/analytics/export?dataset=provincial_snapshot&format=csv`.

## Project structure

```
app/                    routes (learn, quiz, vocabulary, scenarios, dashboard, analytics)
features/               exercise player, quizzes, flashcards, reading, speaking
lib/                    Prisma, Supabase, gamification, analytics loaders
prisma/schema.prisma    learning + analytics session models
prisma/seed-data/       A1 content, quizzes, scenarios
prisma/seed-data/a2/    A2 units (reading / writing / listening / speaking)
analytics/              Python ingest → clean → insights
data/raw|processed|analytics
docs/                   sources, dictionary, SQL, Power BI
notebooks/              collection, cleaning, EDA
sql/                    learner KPIs (Postgres) + Canada (SQLite)
```

## What’s left

**Small product polish (next if we keep going)**

| Item | Status |
| --- | --- |
| `MATCHING` exercise UI | Enum exists; no component. Tap-left-then-right pairs. |
| Weekly XP goal | Not built. Would need an XP event log or an approximate “completions this week” ring. |
| Streak on flashcards | Streak updates on lessons and quizzes only. Vocab reviews do not call `applyGamification`. |
| A2 unit quizzes | A1 has six quizzes. A2 has none yet. |
| “100 words known” badge | Vocab pool is still under 100 entries (~30 A1 + ~36 A2). Honest to wait. |

**Content, later**

| Item | Status |
| --- | --- |
| More scenarios | Still unused ideas: post office, taxi, hotel, lost & found |
| B1–C2 | Schema has the CEFR codes. No units seeded. |
| A2 quizzes / level tests | `LEVEL_ASSESSMENT` quiz kind exists; unused |
| True spaced repetition | Flashcards are two buckets only (`LEARNING` / `KNOWN`) |

**Parked until it’s a real product** (see internal notes, not blockers)

- Terms of Use + Privacy Policy pages
- Native-speaker audio instead of browser TTS (`Audio` table is empty)
- AI writing/pronunciation feedback
- Email confirmation + custom SMTP
- Rate limiting, RLS on the Supabase Data API, credential rotation for a public audience

**Ops reminder:** new environments need `migrate deploy` then `db seed`, or quizzes / A2 / flashcard reviews will look empty.

## What I learned

- Combining an operational learning database with official Census extracts without mixing grain or population
- Cleaning StatCan wide cubes vs tidy historical tables (nulls, suppressed cells, “Canada outside Quebec”, trailing spaces in geography names)
- Deriving rates from counts instead of trusting mixed Number/Percentage rows blindly
- SQL aggregations and window functions for learner KPIs vs provincial time series
- Dashboard design: line for trends, bar for comparison, tile map instead of a land-area choropleth
- Writing insights that cite metric, geography, and period
- Preparing a star schema for Power BI while serving a fast JSON bundle on the web
- Not fabricating workplace “French required” occupation stats when the table only measures language used at work
- Growing a CEFR curriculum in the same schema (A1 → A2) without a second progress system

## Privacy

My Learning requires a session. Queries always use the signed-in user id from the server — never a client-supplied id. Learning CSV export includes an internal user id only, no email or name. Canadian JSON is public and contains no account data.

## Licence notes

App code: see repository licence if present. Statistics Canada data: Open Government Licence – Canada. Cite the table ids; this project is not affiliated with Statistics Canada.
