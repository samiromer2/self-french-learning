"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DictationData } from "@/types/exercises";
import { AudioButton } from "./audio-button";

// Case-, punctuation-, and whitespace-insensitive comparison. Accents still
// count: hearing « é » vs « e » is part of the exercise.
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:«»"'’-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isDictationCorrect(data: DictationData, value: string) {
  return normalize(value) === normalize(data.text);
}

export function Dictation({
  data,
  value,
  onChange,
  revealed,
}: {
  data: DictationData;
  value: string;
  onChange: (value: string) => void;
  revealed: boolean;
}) {
  const correct = isDictationCorrect(data, value);

  return (
    <div className="space-y-3">
      <AudioButton text={data.text} rate={data.rate} label="Play sentence" />
      <Input
        value={value}
        disabled={revealed}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type what you hear…"
        autoCapitalize="off"
        autoCorrect="off"
        className={cn(
          revealed && correct && "border-green-600 bg-green-600/10",
          revealed && !correct && "border-destructive bg-destructive/10",
        )}
      />
      {revealed && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {!correct && (
            <p>
              You heard:{" "}
              <span className="font-medium text-foreground">{data.text}</span>
            </p>
          )}
          {data.translation && <p>Translation: {data.translation}</p>}
        </div>
      )}
    </div>
  );
}
