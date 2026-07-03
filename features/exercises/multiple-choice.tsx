"use client";

import { cn } from "@/lib/utils";
import type { MultipleChoiceData } from "@/types/exercises";

export function MultipleChoice({
  data,
  selected,
  onSelect,
  revealed,
}: {
  data: MultipleChoiceData;
  selected: number | null;
  onSelect: (index: number) => void;
  revealed: boolean;
}) {
  return (
    <div className="space-y-2">
      {data.options.map((option, i) => {
        const isCorrect = i === data.correctIndex;
        const isSelected = i === selected;
        return (
          <button
            key={i}
            type="button"
            disabled={revealed}
            onClick={() => onSelect(i)}
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              !revealed && "hover:bg-muted/60",
              !revealed && isSelected && "border-primary bg-primary/5",
              revealed && isCorrect && "border-green-600 bg-green-600/10",
              revealed && isSelected && !isCorrect && "border-destructive bg-destructive/10",
            )}
          >
            {option}
          </button>
        );
      })}
      {revealed && data.explanation && (
        <p className="pt-1 text-sm text-muted-foreground">{data.explanation}</p>
      )}
    </div>
  );
}
