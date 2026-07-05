import { AudioButton } from "@/features/listening/audio-button";
import { cn } from "@/lib/utils";
import type { DialogueLine } from "@/types/exercises";

// A realistic conversation, line by line, with per-line TTS. Lines spoken
// by "Vous" (the learner) are right-aligned like a chat.
export function DialogueViewer({ dialogue }: { dialogue: DialogueLine[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        The conversation
      </p>
      <ul className="space-y-3">
        {dialogue.map((line, i) => {
          const isLearner = line.speaker === "Vous";
          return (
            <li
              key={i}
              className={cn("flex", isLearner ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] space-y-1 rounded-xl border px-4 py-3",
                  isLearner ? "bg-primary/5" : "bg-muted/40",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {line.speaker}
                  </p>
                  <AudioButton text={line.fr} size="icon" />
                </div>
                <p className="font-medium text-pretty">{line.fr}</p>
                <p className="text-sm text-muted-foreground text-pretty">{line.en}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
