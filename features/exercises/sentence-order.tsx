"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SentenceOrderData } from "@/types/exercises";

export function isSentenceOrderCorrect(data: SentenceOrderData, picked: string[]) {
  return picked.join(" ") === data.words.join(" ");
}

// Word chips carry their original index so duplicate words stay distinct.
type Chip = { word: string; id: number };

// Deterministic shuffle (seeded by the sentence itself) so server and client
// render the same scrambled order — no hydration mismatch.
function seededShuffle(chips: Chip[]): Chip[] {
  let seed = chips.reduce(
    (acc, chip) => (acc * 31 + chip.word.charCodeAt(0)) >>> 0,
    7,
  );
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };

  const result = [...chips];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Avoid presenting the already-correct order.
  if (
    result.length > 1 &&
    result.every((chip, i) => chip.word === chips[i].word)
  ) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

export function SentenceOrder({
  data,
  picked,
  onPickedChange,
  revealed,
}: {
  data: SentenceOrderData;
  picked: Chip[];
  onPickedChange: (picked: Chip[]) => void;
  revealed: boolean;
}) {
  const pool = useMemo(
    () => seededShuffle(data.words.map((word, id) => ({ word, id }))),
    [data],
  );

  const remaining = pool.filter((chip) => !picked.some((p) => p.id === chip.id));
  const correct = isSentenceOrderCorrect(
    data,
    picked.map((p) => p.word),
  );

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex min-h-14 flex-wrap items-center gap-2 rounded-lg border border-dashed p-3",
          revealed && correct && "border-green-600 bg-green-600/10",
          revealed && !correct && "border-destructive bg-destructive/10",
        )}
      >
        {picked.length === 0 && (
          <span className="text-sm text-muted-foreground">
            Tap the words below in the right order.
          </span>
        )}
        {picked.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={revealed}
            onClick={() => onPickedChange(picked.filter((p) => p.id !== chip.id))}
          >
            <Badge variant="secondary" className="cursor-pointer text-sm">
              {chip.word}
            </Badge>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {remaining.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={revealed}
            onClick={() => onPickedChange([...picked, chip])}
          >
            <Badge variant="outline" className="cursor-pointer text-sm">
              {chip.word}
            </Badge>
          </button>
        ))}
      </div>

      {revealed && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {!correct && (
            <p>
              Correct order:{" "}
              <span className="font-medium text-foreground">{data.words.join(" ")}</span>
            </p>
          )}
          {data.translation && <p>Translation: {data.translation}</p>}
        </div>
      )}
    </div>
  );
}
