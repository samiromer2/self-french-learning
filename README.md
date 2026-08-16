# Self French Learning + French Language Analytics

An interactive CEFR French-learning app (A1–C2) and a portfolio data-analytics layer on **French in Canada**.

The learning product still does the original job: help a newcomer practise reading, writing, listening, and speaking. Analytics sits beside it. It does not replace the curriculum.

## Problem

Moving to Canada means French is not only a classroom subject. It is a demographic, workplace, and policy fact. This project treats both sides honestly:

1. **My learning** — hours, streaks, lesson scores from this app (one person, not a survey).
2. **French in Canada** — Census measures of bilingualism, first official language spoken, home use, and workplace use.

Those two datasets are never joined as if a single learner represented Canadian immigrants.

## Data

| Kind | What | Where |
| --- | --- | --- |
| First-party | Lessons, scores, streaks, timed sessions | PostgreSQL (`Progress`, `LearningSession`, `User`) |
| Public | Knowledge of official languages 1951–2021 | Statistics Canada 15-10-0004 |
| Public | First official language spoken 1971–2021 | 15-10-0032 |
| Public | Language most often at home 1971–2021 | 15-10-0033 |
| Public | Official languages by immigrant status | 15-10-0037 |
| Public | Language used most often at work (2021) | 98-10-0533 (province totals only) |
| Public | Mother tongue (extract currently through 2016) | 15-10-0003 |

Licence: [Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada). Details: [`docs/data-sources.md`](docs/data-sources.md).

## Analytics questions

The dashboards are built around questions, not chart decoration:

1. How has English–French bilingualism changed in Canada?
2. Which provinces have the highest bilingualism rates?
3. Where is French most often used at home?
4. Where is it used at work (2021 workers)?
5. How do Quebec and Canada outside Quebec differ?
6. How does French knowledge among immigrants compare with non-immigrants in the Census?
7. What does *my* practice look like — without treating it as a national sample?

Insights on **Trends** are calculated in `analytics/insights.py` from the processed tables.

## Technologies

Next.js 16 · TypeScript · React 19 · Tailwind CSS · shadcn/ui · Prisma · PostgreSQL · Supabase Auth · Recharts · Python · Pandas · NumPy · Matplotlib · SQL (PostgreSQL + SQLite) · Power BI–ready CSV star schema

## Architecture

```
User learning events
        ↓
PostgreSQL (Prisma)  →  SQL / Prisma aggregations  →  My Learning (auth)
                                                      ↓
                                              optional CSV export

Statistics Canada ZIP/CSV
        ↓
data/raw/  →  pandas clean/validate  →  data/processed/
        ↓
data/analytics/ (JSON + Power BI CSVs + SQLite)
        ↓
Web dashboard  /  Power BI Desktop
```

## Getting started (app)

Requires Node 18.18+ (or 20+) and Docker for local Postgres.

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Analytics: [http://localhost:3000/analytics](http://localhost:3000/analytics).

## Data pipeline

```bash
python3 -m pip install -r analytics/requirements.txt
python3 -m analytics.run_pipeline
python3 -m unittest analytics.tests.test_clean
```

Re-running uses cached `data/raw/` files when present. The 2021 language-of-work cube is huge; after the first successful clean, the pipeline reuses `data/processed/work_province_extract.csv` instead of downloading ~2 GB again.

Power BI: import `data/analytics/powerbi/*.csv` (see [`docs/power-bi.md`](docs/power-bi.md)).

HTTP export: `/api/analytics/export?dataset=provincial_snapshot&format=csv`

## Project structure

```
app/analytics/          dashboard routes
app/api/analytics/      CSV/JSON export
analytics/              Python ingest → clean → insights
data/raw|processed|analytics
docs/                   sources, dictionary, SQL, Power BI
notebooks/              collection, cleaning, EDA, Canada analysis
sql/                    OLTP vs OLAP queries
prisma/                 learning schema including LearningSession
```

## What I learned

- Combining an operational learning database with official Census extracts without mixing grain or population
- Cleaning StatCan wide cubes vs tidy historical tables (nulls, suppressed cells, “Canada outside Quebec”, trailing spaces in geography names)
- Deriving rates from counts instead of trusting mixed Number/Percentage rows blindly
- SQL aggregations and window functions for learner KPIs vs provincial time series
- Dashboard design: line for trends, bar for comparison, tile map instead of a land-area choropleth
- Writing insights that cite metric, geography, and period
- Preparing a star schema for Power BI while serving a fast JSON bundle on the web
- Not fabricating workplace “French required” occupation stats when the table only measures language used at work

## Privacy

My Learning requires a session. Exports of learning data include an internal user id only — no email or name. Canadian JSON is public and contains no account data.

## Licence notes

App code: see repository licence if present. Statistics Canada data: Open Government Licence – Canada. Cite the table ids; this project is not affiliated with Statistics Canada.
