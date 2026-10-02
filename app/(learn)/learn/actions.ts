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

async function openLearningSession(userId: string, lessonId: string) {
  const open = await prisma.learningSession.findFirst({
    where: { userId, lessonId, endedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (open) return open;
  return prisma.learningSession.create({
    data: { userId, lessonId },
  });
}

async function closeLearningSession(
  userId: string,
  lessonId: string,
  durationMinutes?: number,
) {
  const open = await prisma.learningSession.findFirst({
    where: { userId, lessonId, endedAt: null },
    orderBy: { startedAt: "desc" },
  });
  const endedAt = new Date();
  if (!open) {
    const minutes =
      durationMinutes != null && durationMinutes >= 0 && durationMinutes < 24 * 60
        ? durationMinutes
        : null;
    await prisma.learningSession.create({
      data: {
        userId,
        lessonId,
        startedAt: minutes != null ? new Date(endedAt.getTime() - minutes * 60_000) : endedAt,
        endedAt,
        durationMinutes: minutes,
      },
    });
    return;
  }
  const computed =
    (endedAt.getTime() - open.startedAt.getTime()) / 60_000;
  const minutes =
    durationMinutes != null && durationMinutes >= 0 && durationMinutes < 24 * 60
      ? durationMinutes
      : computed >= 0 && computed < 24 * 60
        ? computed
        : null;
  await prisma.learningSession.update({
    where: { id: open.id },
    data: { endedAt, durationMinutes: minutes },
  });
}

export async function startLesson(lessonId: string) {
  const userId = await requireUserId();

  await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: "IN_PROGRESS",
        attempts: { increment: 1 },
      },
      create: {
        userId,
        lessonId,
        status: "IN_PROGRESS",
        attempts: 1,
      },
    }),
  ]);
  await openLearningSession(userId, lessonId);

  revalidatePath("/learn");
  revalidatePath("/scenarios");
  revalidatePath(`/learn/lesson/${lessonId}`);
}

export async function completeLessonWithScore(
  lessonId: string,
  correct: number,
  total: number,
  durationMinutes?: number,
) {
  const userId = await requireUserId();
  const score = total > 0 ? correct / total : 0;
  const xpAwarded = 10 + correct * 2;

  await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: "COMPLETED",
        score,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        status: "COMPLETED",
        score,
        attempts: 1,
        completedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpAwarded },
      },
    }),
  ]);
  await closeLearningSession(userId, lessonId, durationMinutes);

  const { newAchievements } = await applyGamification(userId, score);

  revalidatePath("/learn");
  revalidatePath("/scenarios");
  revalidatePath(`/learn/lesson/${lessonId}`);
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/analytics/learning");

  return { xpAwarded, newAchievements };
}

export async function completeLesson(lessonId: string) {
  const userId = await requireUserId();

  await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        status: "COMPLETED",
        attempts: 1,
        completedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: 10 },
      },
    }),
  ]);
  await closeLearningSession(userId, lessonId);

  const { newAchievements } = await applyGamification(userId, null);

  revalidatePath("/learn");
  revalidatePath("/scenarios");
  revalidatePath(`/learn/lesson/${lessonId}`);
  revalidatePath("/dashboard");

  return { newAchievements };
}
