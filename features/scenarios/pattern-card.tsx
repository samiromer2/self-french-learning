import { AudioButton } from "@/features/listening/audio-button";
import type { LessonContent } from "@/types/exercises";

// The core reusable phrase of a scenario, Instagram-caption style:
// big French pattern, translation underneath, swap-in examples below.
export function PatternCard({
  pattern,
}: {
  pattern: NonNullable<LessonContent["pattern"]>;
}) {
  return (
    <div className="space-y-4 rounded-xl border bg-muted/40 p-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          The pattern
        </p>
        <p className="text-xl font-semibold text-pretty">{pattern.fr}</p>
        <p className="text-sm text-muted-foreground">{pattern.en}</p>
      </div>

      <ul className="space-y-2">
        {pattern.examples.map((example, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-sm">
            <span>
              <span className="font-medium">{example.fr}</span>{" "}
              <span className="text-muted-foreground">— {example.en}</span>
            </span>
            <AudioButton text={example.fr} size="icon" />
          </li>
        ))}
      </ul>
    </div>
  );
}
