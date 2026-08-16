import { prisma } from "@/lib/prisma";
import type { LearningAnalytics, LearningSeriesPoint } from "./types";

const DAY_MS = 86_400_000;

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getLearningAnalytics(userId: string): Promise<LearningAnalytics> {
  const [user, sessions, progress, quizAttempts, completedLessonIds] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true },
    }),
    prisma.learningSession.findMany({
      where: { userId },
      select: { startedAt: true, endedAt: true, durationMinutes: true },
      orderBy: { startedAt: "asc" },
    }),
    prisma.progress.findMany({
      where: { userId },
      select: {
        status: true,
        score: true,
        completedAt: true,
        lessonId: true,
        lesson: {
          select: {
            title: true,
            skill: true,
            unit: { select: { title: true } },
            scenario: { select: { title: true } },
          },
        },
      },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { score: true, completedAt: true },
    }),
    prisma.progress.findMany({
      where: { userId, status: "COMPLETED" },
      select: { lessonId: true },
    }),
  ]);

  const completed = progress.filter((p) => p.status === "COMPLETED");
  const scored = completed.filter((p) => p.score != null);
  const vocabularyLearned = await prisma.vocabulary.count({
    where: { lessonId: { in: completedLessonIds.map((p) => p.lessonId) } },
  });

  const closed = sessions.filter((s) => s.durationMinutes != null && s.durationMinutes >= 0);
  const totalMinutes = closed.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  const hasDurationData = closed.length > 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const monthAgo = new Date(now.getTime() - 30 * DAY_MS);
  const weeklyMinutes = hasDurationData
    ? closed
        .filter((s) => (s.endedAt ?? s.startedAt) >= weekAgo)
        .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0)
    : null;
  const monthlyMinutes = hasDurationData
    ? closed
        .filter((s) => (s.endedAt ?? s.startedAt) >= monthAgo)
        .reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0)
    : null;

  const dayMap = new Map<string, { minutes: number; lessons: number; scoreSum: number; scoreN: number }>();
  for (const p of completed) {
    if (!p.completedAt) continue;
    const key = isoDay(p.completedAt);
    const cur = dayMap.get(key) ?? { minutes: 0, lessons: 0, scoreSum: 0, scoreN: 0 };
    cur.lessons += 1;
    if (p.score != null) {
      cur.scoreSum += p.score * 100;
      cur.scoreN += 1;
    }
    dayMap.set(key, cur);
  }
  for (const s of closed) {
    const key = isoDay(s.endedAt ?? s.startedAt);
    const cur = dayMap.get(key) ?? { minutes: 0, lessons: 0, scoreSum: 0, scoreN: 0 };
    cur.minutes += s.durationMinutes ?? 0;
    dayMap.set(key, cur);
  }

  const activity: LearningSeriesPoint[] = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      minutes: hasDurationData ? v.minutes : null,
      lessons: v.lessons,
      avgScore: v.scoreN ? v.scoreSum / v.scoreN : null,
    }));

  const skills = ["READING", "WRITING", "LISTENING", "SPEAKING"] as const;
  const bySkill = skills.map((skill) => {
    const rows = completed.filter((p) => p.lesson.skill === skill);
    const withScore = rows.filter((p) => p.score != null);
    return {
      skill,
      completed: rows.length,
      avgScore: withScore.length
        ? (withScore.reduce((sum, p) => sum + (p.score ?? 0), 0) / withScore.length) * 100
        : null,
    };
  });

  const unitMap = new Map<string, { completed: number; scoreSum: number; scoreN: number }>();
  for (const p of completed) {
    const label = p.lesson.unit?.title ?? p.lesson.scenario?.title ?? "Other";
    const cur = unitMap.get(label) ?? { completed: 0, scoreSum: 0, scoreN: 0 };
    cur.completed += 1;
    if (p.score != null) {
      cur.scoreSum += p.score * 100;
      cur.scoreN += 1;
    }
    unitMap.set(label, cur);
  }
  const byUnit = [...unitMap.entries()].map(([label, v]) => ({
    label,
    completed: v.completed,
    avgScore: v.scoreN ? v.scoreSum / v.scoreN : null,
  }));

  const heatmap = Array.from({ length: 7 * 24 }, (_, i) => ({
    weekday: Math.floor(i / 24),
    hour: i % 24,
    count: 0,
  }));
  for (const p of completed) {
    if (!p.completedAt) continue;
    const d = p.completedAt;
    heatmap[d.getUTCDay() * 24 + d.getUTCHours()].count += 1;
  }

  const scoreTrend = scored
    .filter((p) => p.completedAt)
    .sort((a, b) => (a.completedAt?.getTime() ?? 0) - (b.completedAt?.getTime() ?? 0))
    .map((p) => ({
      date: isoDay(p.completedAt!),
      score: (p.score ?? 0) * 100,
      title: p.lesson.title,
      skill: p.lesson.skill,
    }));

  const quizScores = quizAttempts.map((q) => q.score);
  // QuizAttempt.score is stored as 0–1 in the schema comments for Progress;
  // QuizAttempt.score is a Float without documented scale. Treat values ≤ 1 as ratios.
  const quizPct = quizScores.map((s) => (s <= 1 ? s * 100 : s));

  return {
    kpis: {
      totalHours: hasDurationData ? totalMinutes / 60 : null,
      sessionCount: sessions.length,
      closedSessionCount: closed.length,
      currentStreak: user?.currentStreak ?? 0,
      longestStreak: user?.longestStreak ?? 0,
      lessonsCompleted: completed.length,
      lessonsInProgress: progress.filter((p) => p.status === "IN_PROGRESS").length,
      vocabularyLearned,
      averageLessonScore: scored.length
        ? (scored.reduce((sum, p) => sum + (p.score ?? 0), 0) / scored.length) * 100
        : null,
      quizAttemptCount: quizAttempts.length,
      averageQuizScore: quizPct.length
        ? quizPct.reduce((sum, s) => sum + s, 0) / quizPct.length
        : null,
      weeklyMinutes,
      monthlyMinutes,
    },
    activity,
    bySkill,
    byUnit,
    heatmap,
    scoreTrend,
    hasDurationData,
    hasScoreData: scored.length > 0,
    hasQuizData: quizAttempts.length > 0,
  };
}

export function emptyLearningAnalytics(): LearningAnalytics {
  return {
    kpis: {
      totalHours: null,
      sessionCount: 0,
      closedSessionCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      lessonsCompleted: 0,
      lessonsInProgress: 0,
      vocabularyLearned: 0,
      averageLessonScore: null,
      quizAttemptCount: 0,
      averageQuizScore: null,
      weeklyMinutes: null,
      monthlyMinutes: null,
    },
    activity: [],
    bySkill: [],
    byUnit: [],
    heatmap: [],
    scoreTrend: [],
    hasDurationData: false,
    hasScoreData: false,
    hasQuizData: false,
  };
}
