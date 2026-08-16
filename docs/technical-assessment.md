# Technical assessment — Analytics expansion

Written before implementation. The French-learning product stays intact; analytics is an additive layer.

## What already exists

| Layer | Current state |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (neutral / Geist) |
| Backend | Next.js server components + server actions (`app/learn/actions.ts`) |
| Database | PostgreSQL via Prisma |
| Auth | Supabase Auth. App `User.id` matches `auth.users.id`. `getCurrentUser()` is the session source of truth |
| Learning | CEFR levels → units → lessons; real-life scenarios; exercises (MCQ, fill-blank, sentence order, dictation, writing, speaking) |
| Progress | `Progress` (status, score 0–1, attempts, `completedAt`) |
| Quizzes | `Quiz` / `QuizQuestion` / `QuizAttempt` exist in the schema; there is **no quiz UI yet**, so attempts will usually be empty |
| Vocabulary | Content table attached to lessons — **not** an independent review log |
| Gamification | `User.xp`, `currentStreak`, `longestStreak`, `lastActivityAt`, achievements |
| Timing | `ExercisePlayer` already measures elapsed milliseconds in the client but **does not persist** it |

There is no analytics section, no public-data pipeline, and no `LearningSession` table.

## What can be reused

- **Auth and privacy:** every personal KPI query uses `getCurrentUser().id`. Never accept a user id from the client.
- **Progress + lesson joins:** lessons completed, scores by skill/unit/scenario, activity dates, strongest/weakest skills.
- **Streak / XP:** already maintained on `User`.
- **Vocabulary learned:** count of `Vocabulary` rows on lessons the user has completed (derived, not a new event stream).
- **UI:** `Card`, `Badge`, `Button`, `Progress`, chart CSS tokens (`--chart-1` … `--chart-5`).
- **Lesson completion path:** extend `completeLessonWithScore` / `startLesson` instead of a parallel progress system.

## Database changes required

**Add only `LearningSession`.** Do not duplicate `Progress`, `QuizAttempt`, or `Vocabulary`.

| Entity | Action |
| --- | --- |
| `LearningSession` | **New.** `userId`, optional `lessonId`, `startedAt`, `endedAt`, `durationMinutes`. Closes the gap that elapsed time is currently discarded. |
| `Progress` | Reuse for lesson completion, scores, timestamps. |
| `QuizAttempt` | Reuse if/when quizzes ship. Dashboard must not invent quiz rows. |
| `VocabularyActivity` | **Not added.** There is no per-word review event. “Vocabulary learned” is derived from completed lessons. |

## New components required

- Site header link: **Analytics**
- Routes under `/analytics`: Overview, My Learning, French in Canada, Geography, Trends, Data Sources
- Chart primitives (line, bar, heatmap, tile map) using the existing design tokens
- Server loaders: personal KPIs from Postgres; Canadian KPIs from precomputed JSON
- Export route for Power BI–ready CSV/JSON
- Python package `analytics/` plus `data/{raw,processed,analytics}`

## New data pipeline required

```
Statistics Canada CSV/ZIP  →  data/raw/  →  pandas clean/validate
    →  data/processed/  →  star-schema CSV + dashboard JSON  →  /analytics
Application Postgres       →  SQL / Prisma aggregations      →  My Learning
```

Public data is never mixed into UI components as raw StatCan files. Personal learning data never goes into the public JSON bundle.

## What can be done without changing architecture

- Canadian language dashboards (read-only JSON)
- SQL analytics scripts against existing `Progress` / `User` / `Lesson`
- Power BI export of public facts
- Documentation, data dictionary, data-quality report
- Insights computed from processed tables

Persisting session duration is the only product-schema change needed for honest learning-time KPIs. Until sessions exist, time-based charts use empty states rather than fabricated hours.
