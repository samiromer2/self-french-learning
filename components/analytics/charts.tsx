"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmpty } from "./chart-empty";

const axis = { fontSize: 11, fill: "oklch(0.556 0 0)" };
const grid = "oklch(0.922 0 0)";
const ink = "oklch(0.269 0 0)";
const inkMuted = "oklch(0.439 0 0)";

type Point = Record<string, string | number | null | undefined>;

export function TrendLine({
  data,
  xKey,
  yKey,
  yLabel,
  ySuffix = "",
  empty,
}: {
  data: Point[];
  xKey: string;
  yKey: string;
  yLabel: string;
  ySuffix?: string;
  empty?: string;
}) {
  const usable = data.filter((d) => d[yKey] != null);
  if (usable.length < 2) {
    return <ChartEmpty detail={empty ?? "This series does not yet have enough points to plot."} />;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={usable} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tick={axis} tickMargin={8} />
          <YAxis
            tick={axis}
            tickMargin={8}
            width={48}
            label={{ value: yLabel, angle: -90, position: "insideLeft", style: axis }}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? [`${value.toFixed(1)}${ySuffix}`, yLabel] : [String(value), yLabel]
            }
          />
          <Line type="monotone" dataKey={yKey} stroke={ink} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompareBars({
  data,
  xKey,
  yKey,
  yLabel,
  ySuffix = "",
  empty,
  layout = "vertical",
}: {
  data: Point[];
  xKey: string;
  yKey: string;
  yLabel: string;
  ySuffix?: string;
  empty?: string;
  layout?: "vertical" | "horizontal";
}) {
  const usable = data.filter((d) => d[yKey] != null);
  if (!usable.length) {
    return <ChartEmpty detail={empty ?? "No values are available for this comparison."} />;
  }
  const horizontal = layout === "horizontal";
  return (
    <div className={horizontal ? "h-[28rem] w-full" : "h-64 w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={usable}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 16, left: horizontal ? 88 : 0, bottom: 0 }}
        >
          <CartesianGrid stroke={grid} horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={axis} unit={ySuffix} />
              <YAxis type="category" dataKey={xKey} tick={axis} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={axis} tickMargin={8} />
              <YAxis tick={axis} width={48} />
            </>
          )}
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? [`${value.toFixed(1)}${ySuffix}`, yLabel] : [String(value), yLabel]
            }
          />
          <Bar dataKey={yKey} fill={inkMuted} radius={[4, 4, 4, 4]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GroupedBars({
  data,
  xKey,
  aKey,
  bKey,
  aLabel,
  bLabel,
  ySuffix = "%",
  empty,
}: {
  data: Point[];
  xKey: string;
  aKey: string;
  bKey: string;
  aLabel: string;
  bLabel: string;
  ySuffix?: string;
  empty?: string;
}) {
  const usable = data.filter((d) => d[aKey] != null || d[bKey] != null);
  if (!usable.length) {
    return <ChartEmpty detail={empty ?? "No values are available for this comparison."} />;
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={usable} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tick={axis} />
          <YAxis tick={axis} width={48} />
          <Tooltip
            formatter={(value, name) =>
              typeof value === "number" ? [`${value.toFixed(1)}${ySuffix}`, String(name)] : [String(value), String(name)]
            }
          />
          <Bar dataKey={aKey} name={aLabel} fill={ink} maxBarSize={18} />
          <Bar dataKey={bKey} name={bLabel} fill={inkMuted} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DualLine({
  data,
  xKey,
  aKey,
  bKey,
  aLabel,
  bLabel,
  ySuffix = "%",
  empty,
}: {
  data: Point[];
  xKey: string;
  aKey: string;
  bKey: string;
  aLabel: string;
  bLabel: string;
  ySuffix?: string;
  empty?: string;
}) {
  const usable = data.filter((d) => d[aKey] != null || d[bKey] != null);
  if (usable.length < 2) {
    return <ChartEmpty detail={empty ?? "Not enough overlapping points to compare these series."} />;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={usable} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tick={axis} />
          <YAxis tick={axis} width={48} />
          <Tooltip
            formatter={(value, name) =>
              typeof value === "number" ? [`${value.toFixed(1)}${ySuffix}`, String(name)] : [String(value), String(name)]
            }
          />
          <Line type="monotone" dataKey={aKey} name={aLabel} stroke={ink} strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey={bKey}
            name={bLabel}
            stroke={inkMuted}
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
