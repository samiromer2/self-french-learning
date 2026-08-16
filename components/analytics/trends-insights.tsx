import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceFootnote, PrivacyNote } from "./data-source-footnote";
import { formatPercent } from "@/lib/analytics/format";
import type { CanadaBundle } from "@/lib/analytics/types";

export function TrendsInsights({ bundle }: { bundle: CanadaBundle }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trends and insights</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every sentence below is computed from the processed Statistics Canada tables. Nothing is
          generated from a language model at request time.
        </p>
      </div>

      <ol className="space-y-4">
        {bundle.insights.map((insight) => (
          <li key={insight.id}>
            <Card>
              <CardHeader>
                <CardDescription>{insight.question}</CardDescription>
                <CardTitle className="text-base leading-relaxed font-normal">
                  {insight.text}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Metric: {insight.metric}
                  {insight.unit === "percent" ? " (%)" : ""}
                </span>
                <span>
                  Period: {insight.start_year}
                  {insight.end_year !== insight.start_year ? `–${insight.end_year}` : ""}
                </span>
                <span>Geography: {insight.geo}</span>
                <span>
                  Values: {formatPercent(insight.start_value)}
                  {insight.end_year !== insight.start_year
                    ? ` → ${formatPercent(insight.end_value)}`
                    : ""}
                </span>
                <span>Table: {insight.source_table}</span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <PrivacyNote />
      <DataSourceFootnote
        dataset="See each insight’s table id"
        period={`${bundle.census_years[0] ?? 1951}–${bundle.latest_year}`}
        lastUpdated={bundle.generated_at}
        url="https://www150.statcan.gc.ca/en/subjects-start/languages"
      />
    </div>
  );
}
