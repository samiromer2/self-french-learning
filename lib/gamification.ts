import { prisma } from "@/lib/prisma";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Returns the new streak values given the previous activity timestamp.
export function nextStreak(
  lastActivityAt: Date | null,
  currentStreak: number,
  now = new Date(),
) {
  if (!lastActivityAt) return 1;
  const dayDiff =
    (startOfDay(now).getTime() - startOfDay(lastActivityAt).getTime()) / 86_400_000;
  if (dayDiff === 0) return Math.max(currentStreak, 1);
  if (dayDiff === 1) return currentStreak + 1;
  return 1;
}

// Applies streak updates and awards any newly earned achievements.
// Called after a lesson completion has been recorded. Owns the
// lastActivityAt update — callers must not set it, or the streak
// calculation would always see "today".
export async function applyGamification(userId: string, score: number | null) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const streak = nextStreak(user.lastActivityAt, user.currentStreak);
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: streak,
      longestStreak: Math.max(streak, user.longestStreak),
      lastActivityAt: new Date(),
    },
  });

  const completedCount = await prisma.progress.count({
    where: { userId, status: "COMPLETED" },
  });

  const earnedCodes: string[] = [];
  if (completedCount >= 1) earnedCodes.push("first-lesson");
  if (completedCount >= 5) earnedCodes.push("five-lessons");
  if (score === 1) earnedCodes.push("perfect-score");
  if (streak >= 7) earnedCodes.push("seven-day-streak");

  // Any unit fully completed?
  const units = await prisma.unit.findMany({
    select: {
      lessons: {
        select: {
          progress: { where: { userId, status: "COMPLETED" }, select: { id: true } },
        },
      },
    },
  });
  const unitDone = units.some(
    (u) => u.lessons.length > 0 && u.lessons.every((l) => l.progress.length > 0),
  );
  if (unitDone) earnedCodes.push("first-unit");

  // A1 Graduate covers curriculum lessons only — scenario-track lessons
  // (unitId null) are a separate, optional path.
  const totalCurriculumLessons = await prisma.lesson.count({
    where: { unitId: { not: null } },
  });
  const completedCurriculum = await prisma.progress.count({
    where: { userId, status: "COMPLETED", lesson: { unitId: { not: null } } },
  });
  if (totalCurriculumLessons > 0 && completedCurriculum >= totalCurriculumLessons) {
    earnedCodes.push("a1-graduate");
  }

  if (earnedCodes.length === 0) return { newAchievements: [] };

  const achievements = await prisma.achievement.findMany({
    where: { code: { in: earnedCodes } },
  });
  const already = await prisma.userAchievement.findMany({
    where: { userId, achievementId: { in: achievements.map((a) => a.id) } },
    select: { achievementId: true },
  });
  const alreadyIds = new Set(already.map((a) => a.achievementId));
  const fresh = achievements.filter((a) => !alreadyIds.has(a.id));

  if (fresh.length > 0) {
    await prisma.userAchievement.createMany({
      data: fresh.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    });
  }

  return {
    newAchievements: fresh.map((a) => ({ title: a.title, icon: a.icon })),
  };
}
