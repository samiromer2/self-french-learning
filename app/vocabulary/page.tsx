import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlashcardDeck, type FlashcardItem } from "@/features/vocabulary/flashcard-deck";

function isMissingTable(error: unknown) {
  return typeof error === "object" && error && "code" in error && String(error.code) === "P2021";
}

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { mode } = await searchParams;
  const reviewAll = mode === "all";

  let items: (FlashcardItem & { lastReviewedAt: Date | null })[] = [];
  let knownCount = 0;
  try {
    const [entries, known] = await Promise.all([
      prisma.vocabulary.findMany({
        include: {
          reviews: { where: { userId: user.id } },
        },
        orderBy: { word: "asc" },
      }),
      prisma.userVocabulary.count({
        where: { userId: user.id, status: "KNOWN" },
      }),
    ]);
    knownCount = known;
    items = entries.map((entry) => ({
      id: entry.id,
      word: entry.word,
      translation: entry.translation,
      exampleSentence: entry.exampleSentence,
      status: entry.reviews[0]?.status ?? null,
      lastReviewedAt: entry.reviews[0]?.lastReviewedAt ?? null,
    }));
  } catch (error) {
    if (!isMissingTable(error)) throw error;
    const entries = await prisma.vocabulary.findMany({ orderBy: { word: "asc" } });
    items = entries.map((entry) => ({
      id: entry.id,
      word: entry.word,
      translation: entry.translation,
      exampleSentence: entry.exampleSentence,
      status: null,
      lastReviewedAt: null,
    }));
  }

  const unseen = items.filter((c) => c.status == null);
  const learning = items
    .filter((c) => c.status === "LEARNING")
    .sort((a, b) => (a.lastReviewedAt?.getTime() ?? 0) - (b.lastReviewedAt?.getTime() ?? 0));
  const known = items
    .filter((c) => c.status === "KNOWN")
    .sort((a, b) => (a.lastReviewedAt?.getTime() ?? 0) - (b.lastReviewedAt?.getTime() ?? 0));
  const deck: FlashcardItem[] = (reviewAll ? [...unseen, ...learning, ...known] : [...unseen, ...learning]).map(
    ({ lastReviewedAt: _ignored, ...card }) => card,
  );

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-2xl">Vocabulary</CardTitle>
            <Badge variant="secondary">
              {knownCount}/{items.length} known
            </Badge>
          </div>
          <CardDescription>
            {reviewAll
              ? "Reviewing every word, including ones you already marked known."
              : "Unseen words first, then ones still learning. Known cards stay out of this deck."}
          </CardDescription>
          <p className="text-sm">
            {reviewAll ? (
              <Link href="/vocabulary" className="underline underline-offset-2">
                Practice new and learning cards
              </Link>
            ) : (
              <Link href="/vocabulary?mode=all" className="underline underline-offset-2">
                Review everything
              </Link>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <FlashcardDeck cards={deck} reviewAll={reviewAll} />
        </CardContent>
      </Card>
    </div>
  );
}
