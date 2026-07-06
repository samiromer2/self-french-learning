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
- [x] Deploy to Vercel + Supabase Postgres (live at self-french-learning.vercel.app; auth later migrated to Supabase Auth)

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

- [x] Repeat-after-speaker exercise (TTS model + SpeechRecognition scoring, ≥70% word overlap)
- [x] Pronunciation practice exercise (u, nasals, r, liaison drills)
- [x] Shadowing exercises (longer sentences)
- [x] Question-answer practice (hear question, answer aloud, model answer shown)
- [x] Conversation simulation (basic Q&A form; full conversation bot deferred to AI phase)
- [x] Self-assessment fallback when speech recognition is unavailable
- [ ] (Later) AI pronunciation scoring / accent feedback / fluency score / conversation bot

## Phase 7 — Progress Tracking

- [x] User dashboard with real progress data (replace placeholder)
- [x] Per-skill progress views (completed/total + average score per skill)
- [x] Level/unit completion rules (unit complete = all lessons completed; level complete = all units)

## Phase 8 — Gamification

- [x] XP system wired to exercise completion (10 base + 2/correct)
- [x] Daily streaks (increment on consecutive days, reset on gaps, longest tracked)
- [x] Achievements/badges (6 seeded, award logic on completion, toasts + dashboard badges)
- [x] Leaderboards (/leaderboard, top 10 by XP)
- [x] Progress bars (level, per-skill, per-exercise-session)
- [ ] Weekly goals (deferred)

## Real-Life Scenarios (from nextplans.md)

- [x] Scenario track alongside the CEFR curriculum (own model, reuses lessons/exercises/progress/XP)
- [x] ☕ Café, 🛒 Grocery Store, 🚌 Transportation, 🏥 Doctor, 💼 Job Interview, 🏦 Bank, 🏠 Renting — all 7 shipped
- [x] Pattern card + chat-style dialogue with per-line TTS, 4 exercises each
- [x] /scenarios page + dashboard card; stats kept separate from curriculum
- [ ] More scenarios someday (post office, pharmacy, restaurant dinner, phone calls…)

## MVP leftovers (planned in nextplans.md → "Build plans")

- [ ] Unit quizzes (Quiz tables exist since day one, unused — 6 quizzes, quiz player, XP + "Quiz Whiz" achievement)
- [ ] Vocabulary flashcards (/vocabulary page, UserVocabulary table, "words known" stat — closes the Phase 3 vocab-tracking TODO)
- [ ] MATCHING exercise type (enum exists, no component)
- [ ] Weekly goals (simple weekly XP ring on dashboard)
- [ ] Scenarios batch 2 (pharmacy, restaurant, phone, post office, taxi, hotel…)

## Phase 10 — Expand Beyond A1 (A2 plan in nextplans.md)

- [ ] A2 content (6 units planned: Travel, Work, Weather, Hobbies, Directions, Telling Stories — passé composé era)
- [ ] B1 content
- [ ] B2 content
- [ ] C1 content
- [ ] C2 content

## Later — only if this becomes a product

### Phase 9 — AI Features

Needs an Anthropic API key and a decision on billing before building.

- [ ] Writing feedback / grammar checking
- [ ] Pronunciation scoring
- [ ] Conversation practice bot
