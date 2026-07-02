"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function startLesson(lessonId: string) {
  const userId = await requireUserId();

  await prisma.progress.upsert({
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
  });

  revalidatePath("/learn");
  revalidatePath(`/learn/lesson/${lessonId}`);
}

export async function completeLessonWithScore(
  lessonId: string,
  correct: number,
  total: number,
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
        lastActivityAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/learn");
  revalidatePath(`/learn/lesson/${lessonId}`);
  revalidatePath("/dashboard");

  return { xpAwarded };
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
        lastActivityAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/learn");
  revalidatePath(`/learn/lesson/${lessonId}`);
  revalidatePath("/dashboard");
}
