-- Analytical queries against the application database (PostgreSQL).
-- These are not the OLTP lookups used by lesson pages.
-- Bind :user_id to the authenticated user. Never accept a user id from the client
-- without matching it to the session.

-- Weekly learning hours (timed sessions)
SELECT
  date_trunc('week', COALESCE("endedAt", "startedAt")) AS week_start,
  COUNT(*) AS sessions,
  SUM("durationMinutes") / 60.0 AS hours
FROM "LearningSession"
WHERE "userId" = :user_id
  AND "durationMinutes" IS NOT NULL
GROUP BY 1
ORDER BY 1;

-- Monthly lesson completions and average score
SELECT
  date_trunc('month', "completedAt") AS month,
  COUNT(*) AS lessons_completed,
  AVG("score") * 100 AS avg_score_percent
FROM "Progress"
WHERE "userId" = :user_id
  AND status = 'COMPLETED'
  AND "completedAt" IS NOT NULL
GROUP BY 1
ORDER BY 1;

-- Average lesson score overall
SELECT
  COUNT(*) FILTER (WHERE "score" IS NOT NULL) AS scored_lessons,
  AVG("score") * 100 AS avg_score_percent,
  MIN("score") * 100 AS min_score_percent,
  MAX("score") * 100 AS max_score_percent
FROM "Progress"
WHERE "userId" = :user_id
  AND status = 'COMPLETED';

-- Vocabulary learned = words on completed lessons (derived, not a review log)
SELECT COUNT(v.id) AS vocabulary_learned
FROM "Vocabulary" v
JOIN "Progress" p ON p."lessonId" = v."lessonId"
WHERE p."userId" = :user_id
  AND p.status = 'COMPLETED';

-- Most difficult skills (lowest average score, at least one scored lesson)
SELECT
  l.skill,
  COUNT(*) AS completed,
  AVG(p."score") * 100 AS avg_score_percent
FROM "Progress" p
JOIN "Lesson" l ON l.id = p."lessonId"
WHERE p."userId" = :user_id
  AND p.status = 'COMPLETED'
  AND p."score" IS NOT NULL
GROUP BY l.skill
ORDER BY avg_score_percent ASC;

-- Rolling 7-completion average score (improvement over time)
SELECT
  p."completedAt",
  l.title,
  p."score" * 100 AS score_percent,
  AVG(p."score") OVER (
    ORDER BY p."completedAt"
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) * 100 AS rolling_avg_percent
FROM "Progress" p
JOIN "Lesson" l ON l.id = p."lessonId"
WHERE p."userId" = :user_id
  AND p.status = 'COMPLETED'
  AND p."score" IS NOT NULL
ORDER BY p."completedAt";

-- Current streak is stored on User (maintained at lesson completion).
SELECT "currentStreak", "longestStreak", "lastActivityAt", xp
FROM "User"
WHERE id = :user_id;
