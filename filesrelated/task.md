# Task Tracker

Based on the roadmap in `French Learning Platform – Project Master Plan.pdf`.

## Phase 1 — Setup, Auth, Database

- [x] Scaffold Next.js app (TypeScript, Tailwind, App Router)
- [x] Initialize shadcn/ui + add core components
- [x] Design Prisma schema (Users, Levels, Units, Lessons, Exercises, Vocabulary, Audio, Progress, Quizzes, Assessments, Achievements)
- [x] Local Postgres via docker-compose + run initial migration
- [x] Auth.js (NextAuth v5) with Credentials provider + Prisma adapter
- [x] Signup / login / dashboard pages, verified end-to-end in browser
- [x] Create project folder structure (features/, content/french/a1-c2, public/audio, public/images, docs/, types/)
- [x] Commit Phase 1 scaffold to git
- [x] Set `nvm alias default` or add `.nvmrc` (repo Node was 18.12.1, too old for Next 16)
- [ ] Deploy skeleton to Vercel + provision hosted Postgres (e.g. Neon/Supabase) for prod `DATABASE_URL`

## Phase 2 — Course Structure & Lesson System

- [x] Seed script for Level/Unit/Lesson data (starting with A1, 6 units per master plan)
- [x] Course/level/unit/lesson listing pages (`/learn`)
- [x] Lesson detail page shell (renders content by skill type)
- [x] Progress model wiring (mark lesson started/completed, +10 XP on completion)

## Phase 3 — Reading Module

- [x] Reading passage viewer
- [x] Vocabulary highlights (hover tooltips with translation + example)
- [x] Fill-in-the-blanks exercise
- [x] Multiple choice questions
- [x] Sentence ordering exercise
- [x] Reading comprehension exercise (MC questions about the passage)
- [x] Progress tracking (accuracy saved as Progress.score; reading pace shown in results; per-user vocab tracking still TODO)

## Phase 4 — Writing Module

- [x] Copy sentence exercise (exact match, accent-sensitive)
- [x] Complete sentence exercise (starter + min word count)
- [x] Short paragraph writing
- [x] Guided composition (guidance bullet points)
- [x] Free writing (word-count validated; auto-grading deferred to AI phase)
- [ ] (Later) AI grammar checking / suggestions / CEFR scoring / error explanations

## Phase 5 — Listening Module

- [x] Audio via browser TTS (SpeechSynthesis fr-FR) — native audio clips can replace TTS later using the same Audio model
- [x] Dictation exercise (punctuation/case-insensitive, accent-sensitive)
- [x] Listen-and-choose exercise
- [x] Fill missing words exercise
- [x] Story comprehension exercise
- [x] Difficulty progression by level (rate 0.8 slow speech at A1; per-exercise rate field scales to native speed)

## Phase 6 — Speaking Module

- [ ] Repeat-after-speaker exercise
- [ ] Pronunciation practice exercise
- [ ] Shadowing exercises
- [ ] Question-answer practice
- [ ] Conversation simulation
- [ ] (Later) AI pronunciation scoring / accent feedback / fluency score / conversation bot

## Phase 7 — Progress Tracking

- [ ] User dashboard with real progress data (replace placeholder)
- [ ] Per-skill progress views
- [ ] Level/unit completion rules

## Phase 8 — Gamification

- [ ] XP system wired to exercise completion
- [ ] Daily streaks
- [ ] Achievements/badges (seed Achievement table, award logic)
- [ ] Leaderboards
- [ ] Progress bars, weekly goals

## Phase 9 — AI Features

- [ ] Writing feedback / grammar checking
- [ ] Pronunciation scoring
- [ ] Conversation practice bot

## Phase 10 — Expand Beyond A1

- [ ] A2 content
- [ ] B1 content
- [ ] B2 content
- [ ] C1 content
- [ ] C2 content
