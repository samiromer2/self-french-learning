"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FillBlankData } from "@/types/exercises";

export function isFillBlankCorrect(data: FillBlankData, value: string) {
  return value.trim().toLowerCase() === data.answer.trim().toLowerCase();
}

export function FillBlank({
  data,
  value,
  onChange,
  revealed,
}: {
  data: FillBlankData;
  value: string;
  onChange: (value: string) => void;
  revealed: boolean;
}) {
  const [before, after] = data.template.split("___");
  const correct = isFillBlankCorrect(data, value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-base leading-8">
        <span>{before}</span>
        <Input
          value={value}
          disabled={revealed}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "inline-block w-40",
            revealed && correct && "border-green-600 bg-green-600/10",
            revealed && !correct && "border-destructive bg-destructive/10",
          )}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <span>{after}</span>
      </div>
      {!revealed && data.hint && (
        <p className="text-sm text-muted-foreground">Hint: {data.hint}</p>
      )}
      {revealed && !correct && (
        <p className="text-sm text-muted-foreground">
          Correct answer: <span className="font-medium text-foreground">{data.answer}</span>
        </p>
      )}
    </div>
  );
}
