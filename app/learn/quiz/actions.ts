"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { applyGamification } from "@/lib/gamification";

async function requireUserId() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

async function awardQuizWhiz(userId: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { code: "quiz-perfect" },
  });
  if (!achievement) return [];
  const already = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: { userId, achievementId: achievement.id },
    },
  });
  if (already) return [];
  await prisma.userAchievement.createMany({
    data: [{ userId, achievementId: achievement.id }],
    skipDuplicates: true,
  });
  return [{ title: achievement.title, icon: achievement.icon }];
}

export async function submitQuizAttempt(
  quizId: string,
  correct: number,
  _total: number,
  answers: { questionId: string; correct: boolean }[],
  durationMinutes?: number,
) {
  const userId = await requireUserId();
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true, _count: { select: { questions: true } } },
  });
  if (!quiz || quiz._count.questions === 0) throw new Error("Quiz not found");

  const safeTotal = quiz._count.questions;
  const safeCorrect = Math.min(Math.max(0, Math.round(correct)), safeTotal);
  const score = safeTotal > 0 ? safeCorrect / safeTotal : 0;
  const xpAwarded = 15 + safeCorrect * 2;

  await prisma.$transaction([
    prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        answers: answers.slice(0, safeTotal),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpAwarded } },
    }),
  ]);

  const minutes =
    durationMinutes != null && durationMinutes >= 0 && durationMinutes < 24 * 60
      ? durationMinutes
      : null;
  if (minutes != null) {
    const endedAt = new Date();
    try {
      await prisma.learningSession.create({
        data: {
          userId,
          startedAt: new Date(endedAt.getTime() - minutes * 60_000),
          endedAt,
          durationMinutes: minutes,
        },
      });
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (code !== "P2021") throw error;
    }
  }

  const { newAchievements } = await applyGamification(userId, null);
  const quizBadges = score === 1 ? await awardQuizWhiz(userId) : [];

  revalidatePath("/learn");
  revalidatePath(`/learn/quiz/${quizId}`);
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/analytics/learning");

  return { xpAwarded, score, newAchievements: [...newAchievements, ...quizBadges] };
}
