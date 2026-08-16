"use client";

import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/analytics/format";
import type { ProvincialSnapshot } from "@/lib/analytics/types";

const LAYOUT: { code: string; col: string; row: string }[] = [
  { code: "YT", col: "2", row: "1" },
  { code: "NT", col: "3", row: "1" },
  { code: "NU", col: "4", row: "1" },
  { code: "BC", col: "1", row: "2" },
  { code: "AB", col: "2", row: "2" },
  { code: "SK", col: "3", row: "2" },
  { code: "MB", col: "4", row: "2" },
  { code: "ON", col: "5", row: "2" },
  { code: "QC", col: "6", row: "2" },
  { code: "NL", col: "7", row: "2" },
  { code: "NB", col: "6", row: "3" },
  { code: "PE", col: "7", row: "3" },
  { code: "NS", col: "6", row: "4" },
];

export function ProvinceTiles({
  rows,
  metric,
  selected,
  onSelect,
}: {
  rows: ProvincialSnapshot[];
  metric: keyof ProvincialSnapshot;
  selected: string | null;
  onSelect: (code: string) => void;
}) {
  const values = rows
    .map((r) => r[metric])
    .filter((v): v is number => typeof v === "number");
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);

  return (
    <div className="grid grid-cols-7 grid-rows-4 gap-1.5">
      {LAYOUT.map((cell) => {
        const row = rows.find((r) => r.geo_code === cell.code);
        const value = row && typeof row[metric] === "number" ? (row[metric] as number) : null;
        const t = value == null || max === min ? 0 : (value - min) / (max - min);
        const active = selected === cell.code;
        return (
          <button
            key={cell.code}
            type="button"
            onClick={() => onSelect(cell.code)}
            style={{ gridColumn: cell.col, gridRow: cell.row }}
            className={cn(
              "rounded-md border px-2 py-2 text-left text-xs transition-colors",
              active ? "ring-2 ring-foreground" : "hover:border-foreground/40",
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-medium">{cell.code}</span>
              <span
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: value == null ? "oklch(0.92 0 0)" : `oklch(${0.92 - t * 0.55} 0 0)` }}
              />
            </div>
            <p className="mt-1 tabular-nums text-muted-foreground">
              {value == null ? "—" : formatPercent(value)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
