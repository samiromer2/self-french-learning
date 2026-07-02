"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WritingPromptData } from "@/types/exercises";

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function countWords(s: string) {
  return normalize(s) === "" ? 0 : normalize(s).split(" ").length;
}

export function isWritingCorrect(data: WritingPromptData, value: string) {
  if (data.mode === "copy") {
    // Accent-sensitive on purpose: copying é/è/ç correctly is the exercise.
    return normalize(value) === normalize(data.text ?? "");
  }
  return countWords(value) >= (data.minWords ?? 5);
}

export function WritingPrompt({
  data,
  value,
  onChange,
  revealed,
}: {
  data: WritingPromptData;
  value: string;
  onChange: (value: string) => void;
  revealed: boolean;
}) {
  const correct = isWritingCorrect(data, value);
  const words = countWords(value);
  const minWords = data.minWords ?? 5;

  return (
    <div className="space-y-3">
      {data.mode === "copy" && data.text && (
        <p className="rounded-lg bg-muted px-4 py-3 font-medium">{data.text}</p>
      )}

      {data.guidance && data.guidance.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {data.guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}

      {data.mode === "copy" ? (
        <Input
          value={value}
          disabled={revealed}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type the sentence exactly…"
          autoCapitalize="off"
          autoCorrect="off"
          className={cn(
            revealed && correct && "border-green-600 bg-green-600/10",
            revealed && !correct && "border-destructive bg-destructive/10",
          )}
        />
      ) : (
        <div className="space-y-1">
          <textarea
            value={value}
            disabled={revealed}
            onChange={(e) => onChange(e.target.value)}
            placeholder={data.starter ? `${data.starter}…` : "Write in French…"}
            rows={data.mode === "paragraph" ? 5 : 2}
            className={cn(
              "w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
              revealed && correct && "border-green-600 bg-green-600/10",
              revealed && !correct && "border-destructive bg-destructive/10",
            )}
          />
          <p className="text-right text-xs text-muted-foreground">
            {words}/{minWords} words minimum
          </p>
        </div>
      )}

      {revealed && data.mode === "copy" && !correct && (
        <p className="text-sm text-muted-foreground">
          Expected: <span className="font-medium text-foreground">{data.text}</span>
        </p>
      )}
      {revealed && data.mode !== "copy" && correct && (
        <p className="text-sm text-muted-foreground">
          Nice work! AI feedback on grammar and style arrives in Phase 9.
        </p>
      )}
    </div>
  );
}
