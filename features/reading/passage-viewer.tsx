"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type VocabEntry = {
  word: string;
  translation: string;
  exampleSentence?: string | null;
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Splits the passage into plain segments and vocab matches, so known words
// can be rendered as tooltip triggers. Longest words first so "au revoir"
// wins over "au".
function segmentText(text: string, vocabulary: VocabEntry[]) {
  if (vocabulary.length === 0) return [{ text, vocab: undefined }];

  const pattern = vocabulary
    .map((v) => v.word)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  const byLowerWord = new Map(vocabulary.map((v) => [v.word.toLowerCase(), v]));

  return text.split(regex).map((segment) => ({
    text: segment,
    vocab: byLowerWord.get(segment.toLowerCase()),
  }));
}

export function PassageViewer({
  title,
  text,
  vocabulary,
}: {
  title: string;
  text: string;
  vocabulary: VocabEntry[];
}) {
  const segments = segmentText(text, vocabulary);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <TooltipProvider delayDuration={100}>
        <p className="leading-8 text-pretty">
          {segments.map((segment, i) =>
            segment.vocab ? (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <span className="cursor-help rounded-sm bg-primary/10 px-0.5 underline decoration-dotted underline-offset-4">
                    {segment.text}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-60">
                  <p className="font-medium">{segment.vocab.translation}</p>
                  {segment.vocab.exampleSentence && (
                    <p className="mt-1 opacity-80">{segment.vocab.exampleSentence}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <span key={i}>{segment.text}</span>
            ),
          )}
        </p>
      </TooltipProvider>
      <p className="text-xs text-muted-foreground">
        Hover the highlighted words to see their translation.
      </p>
    </div>
  );
}
