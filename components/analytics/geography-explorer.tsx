"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "./kpi-card";
import { DualLine, TrendLine } from "./charts";
import { ProvinceTiles } from "./province-tiles";
import { DataSourceFootnote } from "./data-source-footnote";
import { formatPercent } from "@/lib/analytics/format";
import { METRIC_OPTIONS, provincesOnly, trendForGeo, type MetricId } from "@/lib/analytics/canada";
import type { CanadaBundle } from "@/lib/analytics/types";

export function GeographyExplorer({ bundle }: { bundle: CanadaBundle }) {
  const [code, setCode] = useState("ON");
  const [metric, setMetric] = useState<MetricId>("bilingual_rate");
  const provinces = provincesOnly(bundle.provincial_latest);
  const selected = provinces.find((p) => p.geo_code === code) ?? provinces[0];
  const canada = bundle.canada_latest;

  const bilingual = trendForGeo(bundle.bilingualism_trend, selected.geo_code);
  const home = trendForGeo(bundle.home_trend, selected.geo_code);
  const canadaTrend = trendForGeo(bundle.bilingualism_trend, "CA");
  const vsCanada = bilingual.map((row) => ({
    year: row.year,
    province: row.bilingual_rate,
    canada: canadaTrend.find((c) => c.year === row.year)?.bilingual_rate ?? null,
  }));

  const metricMeta = METRIC_OPTIONS.find((m) => m.id === metric)!;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Geography</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Equal-area tile map so small provinces are not visually dwarfed by land area. Values are
          Census rates, not a ranking of which province is “best.”
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          Metric
          <select
            className="ml-2 rounded-md border bg-background px-2 py-1"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricId)}
          >
            {METRIC_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ProvinceTiles
        rows={provinces}
        metric={
          metric === "bilingual_rate"
            ? "bilingual_rate"
            : metric === "french_fols_rate"
              ? "french_fols_rate"
              : metric === "french_home_rate"
                ? "french_home_rate"
                : "french_work_rate"
        }
        selected={selected.geo_code}
        onSelect={setCode}
      />

      <div>
        <h2 className="text-lg font-medium">{selected.geo_name}</h2>
        <p className="text-sm text-muted-foreground">
          Census {selected.year}
          {selected.french_mother_tongue_rate != null && selected.french_mother_tongue_year
            ? ` · mother tongue series in this table ends ${selected.french_mother_tongue_year}`
            : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Bilingualism" value={formatPercent(selected.bilingual_rate)} />
        <KpiCard label="French FOLS" value={formatPercent(selected.french_fols_rate)} />
        <KpiCard label="French at home" value={formatPercent(selected.french_home_rate)} />
        <KpiCard
          label="French at work"
          value={formatPercent(selected.french_work_rate)}
          hint="2021 workers 15+"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bilingualism over time</CardTitle>
            <CardDescription>
              {selected.geo_name} vs Canada ({formatPercent(canada.bilingual_rate)} in {canada.year})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DualLine
              data={vsCanada}
              xKey="year"
              aKey="province"
              bKey="canada"
              aLabel={selected.geo_name}
              bLabel="Canada"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>French at home</CardTitle>
            <CardDescription>Language spoken most often at home</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={home.map((d) => ({ year: d.year, rate: d.french_rate }))}
              xKey="year"
              yKey="rate"
              yLabel="French at home %"
              ySuffix="%"
            />
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Employment and education charts at occupation or school-board level are not in this extract.
        Language used at work is the workplace metric that can be aligned to these geographies
        without inventing “French required” job counts.
      </p>

      <DataSourceFootnote
        dataset={metricMeta.source}
        period={`1971–${bundle.latest_year} (work: 2021)`}
        lastUpdated={bundle.generated_at}
        url="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000401"
      />
    </div>
  );
}
