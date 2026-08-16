import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canadaBundle } from "@/lib/analytics/canada";
import { formatNumber } from "@/lib/analytics/format";

export const metadata = { title: "Data sources · Analytics" };

export default function SourcesPage() {
  const q = canadaBundle.quality;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Data sources</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Public dashboards use Statistics Canada tables under the Open Government Licence –
          Canada. Personal learning data stays in PostgreSQL and is never written into these files.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Pipeline status</CardDescription>
            <CardTitle className="capitalize">{q.status}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Records processed</CardDescription>
            <CardTitle>{formatNumber(q.records_processed)}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Rejected / missing</CardDescription>
            <CardTitle>
              {formatNumber(q.records_rejected)} / {formatNumber(q.missing_values)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Last successful update</CardDescription>
            <CardTitle className="text-lg">
              {q.last_successful_update?.slice(0, 10) ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        {canadaBundle.sources.map((source) => {
          const ingest = q.ingest.find((i) => i.key === source.key);
          return (
            <Card key={source.key}>
              <CardHeader>
                <CardTitle className="text-base">{source.title}</CardTitle>
                <CardDescription>
                  {source.organization} · Table {source.table}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <a href={source.url} className="underline underline-offset-2" target="_blank" rel="noreferrer">
                    Official table
                  </a>
                  {" · "}
                  {source.licence}
                </p>
                <p>
                  Import: {ingest?.ok ? `ok (${ingest.method ?? "download"})` : ingest?.error ?? "not ingested"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Field-level documentation lives in the repository: <code>docs/data-sources.md</code>,{" "}
        <code>docs/data-dictionary.md</code>, and <code>docs/power-bi.md</code>. Power BI-ready CSVs
        are in <code>data/analytics/powerbi/</code>. HTTP export:{" "}
        <Link className="underline" href="/api/analytics/export?dataset=provincial_snapshot&format=csv">
          /api/analytics/export
        </Link>
        .
      </p>
    </div>
  );
}
