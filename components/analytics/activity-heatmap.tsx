import { cn } from "@/lib/utils";
import { ChartEmpty } from "./chart-empty";
import type { HeatCell } from "@/lib/analytics/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ActivityHeatmap({ data }: { data: HeatCell[] }) {
  const max = Math.max(0, ...data.map((c) => c.count));
  if (max === 0) {
    return (
      <ChartEmpty detail="Complete a lesson to populate this UTC day-by-hour activity grid. Times use UTC so they stay comparable across devices." />
    );
  }
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-0.5">
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="text-center text-[10px] text-muted-foreground">
            {h % 3 === 0 ? h : ""}
          </div>
        ))}
        {DAYS.map((day, weekday) => (
          <div key={day} className="contents">
            <div className="flex items-center text-[10px] text-muted-foreground">{day}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find((c) => c.weekday === weekday && c.hour === hour);
              const count = cell?.count ?? 0;
              const t = count / max;
              return (
                <div
                  key={`${weekday}-${hour}`}
                  title={`${day} ${hour}:00 UTC · ${count} completion${count === 1 ? "" : "s"}`}
                  className={cn("aspect-square rounded-sm", count === 0 && "bg-muted")}
                  style={
                    count
                      ? { backgroundColor: `oklch(${0.87 - t * 0.5} 0 0)` }
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Hours are UTC. Darker cells = more lesson completions.</p>
    </div>
  );
}
