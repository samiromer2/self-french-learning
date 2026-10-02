"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { VocabStatus } from "@/lib/generated/prisma/client";

async function requireUserId() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function reviewVocabulary(vocabularyId: string, status: VocabStatus) {
  if (status !== "LEARNING" && status !== "KNOWN") {
    throw new Error("Invalid status");
  }

  const userId = await requireUserId();
  const vocab = await prisma.vocabulary.findUnique({
    where: { id: vocabularyId },
    select: { id: true },
  });
  if (!vocab) throw new Error("Word not found");

  const existing = await prisma.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
  const firstKnown = status === "KNOWN" && existing?.status !== "KNOWN";

  await prisma.$transaction(async (tx) => {
    await tx.userVocabulary.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId } },
      create: {
        userId,
        vocabularyId,
        status,
        timesReviewed: 1,
        lastReviewedAt: new Date(),
      },
      update: {
        status,
        timesReviewed: { increment: 1 },
        lastReviewedAt: new Date(),
      },
    });
    if (firstKnown) {
      await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: 1 } },
      });
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/analytics/learning");

  return { xpAwarded: firstKnown ? 1 : 0 };
}
