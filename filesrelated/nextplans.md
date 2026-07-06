idea:

A1
 ├── Greetings
 ├── Numbers
 ├── Family
 ├── Food
 └── Daily Activities

Real-Life Scenarios
 ├── ☕ Café
 ├── 🛒 Grocery Store
 ├── 🚌 Transportation
 ├── 🏥 Doctor
 ├── 💼 Job Interview
 ├── 🏦 Bank
 └── 🏠 Renting an Apartment

Legal
 ├── Terms of Use
 └── Privacy Policy


 Yes. Even if it's a free "just for fun" project, adding a few basic security and legal pages makes it look much more professional and trustworthy.

1. Basic Security Measures

For your French learning website, consider adding:

HTTPS only (already handled if you're using Vercel)
No password storage if users don't need accounts yet
Input validation for all forms and quizzes
Rate limiting if you add login or APIs later
Environment variables for API keys and database credentials
Privacy notice explaining what data you collect (if any)

Example notice:

This project is a personal educational project. No personal information is sold or shared with third parties. User data, if collected, is used only to provide the learning experience.

2. User Agreement / Terms of Use

Create a simple page called Terms of Use.

Example sections:

This website is provided for educational purposes.
Content is offered "as is" without guarantees.
Users are responsible for their own learning progress.
The website owner may modify or remove content at any time.
Users should not misuse the service.

Example:

By using this website, you agree to use it for personal and educational purposes only. This project is provided free of charge and without warranty.

3. Privacy Policy

Even if you collect almost nothing:

We respect your privacy. This website does not sell personal information. Basic analytics or technical information may be collected to improve the learning experience.

---

# Build plans (written 2026-07-06 — plans only, nothing started)

Status: A1 (24 lessons) + all 7 scenarios above are shipped and live.
Legal/security section above is parked in `when its a big project.md`.
These are the next things worth building, in recommended order, with
enough detail to just pick one up and go.

## 1. Unit Quizzes — finishes the original MVP list

The `Quiz`, `QuizQuestion`, `QuizAttempt` tables have existed in the
schema since day one and are completely unused. No migration needed.

- **Content**: one `UNIT_QUIZ` per A1 unit (6 total), 6–8 questions each,
  mixing the unit's four skills (2 reading MC, 2 listening with `tts`,
  1–2 fill-blank, 1 sentence-order). New seed file
  `prisma/seed-data/quizzes.ts`, wired into `prisma/seed.ts` like the
  others (delete + recreate questions per quiz, keyed on unit).
- **Where it appears**: a "Unit quiz" row at the bottom of each unit's
  card on `/learn`, visually distinct (trophy icon), enabled always —
  no gating, it's a fun project. Shows best attempt score if one exists.
- **Player**: new route `app/learn/quiz/[id]/page.tsx`. Reuse the
  exercise components (MultipleChoice, FillBlank, SentenceOrder) but a
  new thin `QuizPlayer` — differences vs ExercisePlayer: no start/
  complete Progress calls; on finish, server action `submitQuizAttempt`
  creates a `QuizAttempt` row (score + answers JSON) and awards XP
  (suggest 15 base + 2/correct, slightly more than lessons).
- **Dashboard**: quiz attempts count + average could join the stats
  cards later; not required for v1.
- **New achievement idea**: "Quiz Whiz" (`quiz-perfect`) — perfect
  score on any unit quiz. Add to `lib/achievements.ts` + award in
  `submitQuizAttempt`.
- **Effort**: ~half of what a skill module took. No schema work.

## 2. Vocabulary Flashcards — the other MVP leftover

"Vocabulary cards" was on the MVP list; today vocab only exists as
hover-tooltips inside reading passages (31 entries seeded, more with A2).

- **Schema**: one small additive migration — `UserVocabulary`
  (id, userId uuid, vocabularyId, status enum LEARNING/KNOWN,
  lastReviewedAt, timesReviewed int, @@unique([userId, vocabularyId])).
  This also finally gives us the per-user "vocab learned" stat that
  Phase 3 left as a TODO.
- **Page**: `/vocabulary` — flip-card UI (French side → click → English
  side + example sentence + TTS button, all components exist). Two
  buttons under each card: "Still learning" / "I know this". Cards
  cycle: unseen first, then LEARNING ones, KNOWN ones only in a
  separate "review everything" mode.
- **No real spaced repetition** — that's over-engineering for now. Just
  the two buckets. (True SRS intervals → note it in
  `when its a big project.md` if ever wanted.)
- **Dashboard**: "Words known: X/Y" mini-stat card; counts feed from
  UserVocabulary where status=KNOWN.
- **XP**: +1 XP per card marked KNOWN the first time (cheap, additive
  via existing user.xp increment pattern). "100 Words Learned"
  achievement from the master plan becomes buildable once A2 content
  pushes the vocab pool past 100.
- **Effort**: small migration + one page + one server action.

## 3. Scenarios batch 2 — same format, new situations

Zero new infrastructure: add entries to
`prisma/seed-data/scenarios.ts`, reseed, done. Candidates (pick any):

- 💊 Pharmacy (j'ai besoin de… / vous avez quelque chose contre… ?)
- 🍽️ Restaurant dinner (réserver une table, le menu, allergies)
- 📞 Phone calls (allô, c'est de la part de qui ?, laisser un message)
- 📮 Post office (envoyer un colis, un timbre pour…)
- 🚕 Taxi/rideshare (à cette adresse, gardez la monnaie)
- 🏨 Hotel check-in (une réservation au nom de…, la clé, le petit-déj)
- 👮 Lost & found / police (j'ai perdu…, on m'a volé…)

Each needs: pattern + 3 examples, 5–6 line dialogue, 4 exercises.
Roughly 30–40 minutes of content writing per scenario.

## 4. A2 — Elementary (Phase 10 begins)

Master plan topics: Travel, Work, School, Weather, Hobbies, Directions,
Past experiences. Proposed unit structure (mirrors A1's shape — 6 units
× 4 lessons, one per skill):

  A2
   ├── Unit 1: Travel & Holidays      (passé composé intro happens here)
   ├── Unit 2: Work & Daily Job Life
   ├── Unit 3: Weather & Seasons
   ├── Unit 4: Hobbies & Free Time
   ├── Unit 5: Directions & The City
   └── Unit 6: Telling Stories        (past experiences, narration)

- **Infrastructure**: none. Seed a `Level` row (code A2, order 2), six
  units, 24 lessons — the `/learn` page already renders multiple levels
  (it maps over all of them).
- **Content dials for A2 vs A1**: passages 6–8 sentences (vs 3–5),
  TTS rate 0.9 (vs 0.8), introduce passé composé + futur proche,
  dialogues can span two exchanges of context, fill-blanks start
  testing conjugation not just vocab.
- **Seed layout**: `prisma/seed-data/a2/{reading,writing,listening,speaking}.ts`
  (a folder this time — the flat A1 files are already long).
- **Per-level dashboard**: the "A1 — Beginner" card on the dashboard is
  hardcoded-ish; generalize to one card per level with its own
  progress. `/learn` needs no change.
- **Effort**: the big one — it's 24 lessons of French content again.
  Doable in unit-sized chunks (seed + verify one unit at a time).

## 5. Small polish (grab-bag, any time)

- **MATCHING exercise type**: enum value exists, no component. Plan:
  data `{ pairs: [{left, right}] }`, tap-left-then-right to connect,
  green/red feedback, correct when all matched. Slot into
  ExercisePlayer like the others. Nice for vocab-heavy lessons.
- **Weekly goals** (deferred from Phase 8): simplest honest version —
  a `weeklyXpGoal Int @default(50)` on User + a progress ring on the
  dashboard computed from XP earned since Monday (needs an XpEvent
  log table OR just count completions this week × their XP — the
  latter is approximate but table-free).
- **Streak repair honesty check**: streaks currently only update on
  lesson completion; a user who only does flashcards (plan 2) wouldn't
  extend their streak. When flashcards land, call the same
  `applyGamification` streak path from the vocab action too.

## Recommended order

1 (quizzes) → 2 (flashcards) → 3 (a couple of new scenarios as a
break) → 4 (A2, unit by unit) → 5 (whenever bored).

Rationale: 1 and 2 close out the original MVP promise with small,
self-contained wins; A2 is the long haul and lands better once the
loop (learn → quiz → review vocab) is complete.