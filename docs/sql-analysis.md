# SQL analysis

The project uses SQL in two places. They are not interchangeable.

## 1. Application analytics (PostgreSQL + Prisma)

Lesson progress, streaks, and session duration live in the OLTP database. The Next.js loaders in `lib/analytics/learning.ts` issue equivalent Prisma queries. The canonical SQL is in [`sql/learning_kpis.sql`](../sql/learning_kpis.sql).

Examples: weekly hours, monthly completions, average score, vocabulary derived from completed lessons, lowest-scoring skills, rolling average score (`AVG() OVER ... ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`).

Always filter `userId` from the authenticated session.

## 2. Canadian language analytics (SQLite)

`analytics/sqlite_load.py` writes `data/analytics/french_canada.sqlite` (gitignored; rebuild with the pipeline). Queries: [`sql/french_canada.sql`](../sql/french_canada.sql).

```bash
sqlite3 data/analytics/french_canada.sqlite < sql/french_canada.sql
```

Examples: latest provincial bilingualism, Canada time series, home vs work, immigrant vs non-immigrant French knowledge, year-over-year change with `LAG()`.

## Why two engines

Postgres is the system of record for learners. Census extracts are bulk, slowly changing, and shared. Mixing a 2 GB language-of-work cube into Postgres would slow the learning product. The dashboard reads a ~250 KB JSON bundle; Power BI reads the star-schema CSVs; SQLite is for notebook/SQL practice.
