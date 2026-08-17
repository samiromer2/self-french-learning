"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AudioButton } from "@/features/listening/audio-button";
import { reviewVocabulary } from "@/app/vocabulary/actions";
import type { VocabStatus } from "@/lib/generated/prisma/client";

export type FlashcardItem = {
  id: string;
  word: string;
  translation: string;
  exampleSentence: string | null;
  status: VocabStatus | null;
};

export function FlashcardDeck({
  cards,
  reviewAll,
}: {
  cards: FlashcardItem[];
  reviewAll: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownDelta, setKnownDelta] = useState(0);
  const [isPending, startTransition] = useTransition();

  const total = cards.length;
  const card = cards[index];
  const done = total === 0 || index >= total;

  function mark(status: VocabStatus) {
    if (!card || isPending) return;
    const wasKnown = card.status === "KNOWN";
    startTransition(async () => {
      try {
        const { xpAwarded } = await reviewVocabulary(card.id, status);
        if (xpAwarded > 0) toast.success(`Known · +${xpAwarded} XP`);
        if (status === "KNOWN" && !wasKnown) setKnownDelta((n) => n + 1);
        setFlipped(false);
        setIndex((i) => i + 1);
      } catch {
        toast.error("Could not save this card. Try again.");
      }
    });
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-2xl font-semibold">
          {total === 0 ? "Nothing in this deck" : "Deck complete"}
        </p>
        <p className="text-muted-foreground">
          {total === 0
            ? reviewAll
              ? "No vocabulary has been seeded yet."
              : "You have no unseen or learning cards. Review known words, or learn more in a reading lesson."
            : knownDelta > 0
              ? `${knownDelta} word${knownDelta === 1 ? "" : "s"} marked known this round.`
              : "Keep going — mark a word known when it feels easy."}
        </p>
        <div className="flex justify-center gap-2">
          {!reviewAll && (
            <Button asChild variant="outline">
              <Link href="/vocabulary?mode=all">Review everything</Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/learn">Back to course</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Progress value={(index / total) * 100} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border bg-card px-6 py-10 text-center shadow-sm transition-colors hover:bg-muted/40"
      >
        {flipped ? (
          <>
            <p className="text-3xl font-semibold tracking-tight">{card.translation}</p>
            {card.exampleSentence && (
              <p className="max-w-md text-sm text-muted-foreground">{card.exampleSentence}</p>
            )}
            <span className="text-xs text-muted-foreground">Tap to hide</span>
          </>
        ) : (
          <>
            <p className="text-4xl font-semibold tracking-tight">{card.word}</p>
            <span className="text-xs text-muted-foreground">Tap to reveal English</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center">
        <AudioButton text={card.word} rate={0.8} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => mark("LEARNING")}
        >
          Still learning
        </Button>
        <Button disabled={isPending} onClick={() => mark("KNOWN")}>
          I know this
        </Button>
      </div>
    </div>
  );
}
