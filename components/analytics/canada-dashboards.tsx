"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "./kpi-card";
import { CompareBars, GroupedBars, TrendLine } from "./charts";
import { DataSourceFootnote, PrivacyNote } from "./data-source-footnote";
import { formatHours, formatNumber, formatPercent } from "@/lib/analytics/format";
import { METRIC_OPTIONS, provincesOnly, trendForGeo, type MetricId } from "@/lib/analytics/canada";
import type { CanadaBundle } from "@/lib/analytics/types";
import type { LearningAnalytics } from "@/lib/analytics/types";

export function OverviewDashboard({
  bundle,
  learning,
  signedIn,
}: {
  bundle: CanadaBundle;
  learning: LearningAnalytics | null;
  signedIn: boolean;
}) {
  const ca = bundle.canada_latest;
  const bilingualCa = trendForGeo(bundle.bilingualism_trend, "CA");
  const provinces = provincesOnly(bundle.provincial_latest);
  const scores = learning?.scoreTrend ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics overview</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Personal practice next to Census measures of French in Canada. The two sides answer
          different questions and are not statistically comparable.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          My learning
        </h2>
        {signedIn && learning ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              label="Learning hours"
              value={formatHours(learning.kpis.totalHours)}
              unavailable={learning.kpis.totalHours == null}
              hint={
                learning.kpis.totalHours == null
                  ? "Hours are recorded from timed lesson sessions going forward."
                  : `${learning.kpis.closedSessionCount} timed sessions`
              }
            />
            <KpiCard label="Sessions" value={formatNumber(learning.kpis.sessionCount)} />
            <KpiCard
              label="Current streak"
              value={`${learning.kpis.currentStreak}`}
              hint={`Longest ${learning.kpis.longestStreak} days`}
            />
            <KpiCard
              label="Average lesson score"
              value={formatPercent(learning.kpis.averageLessonScore)}
              unavailable={learning.kpis.averageLessonScore == null}
            />
            <KpiCard
              label="Vocabulary on completed lessons"
              value={formatNumber(learning.kpis.vocabularyLearned)}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Log in to see hours, streak, and scores for your account. Canadian figures below stay
            public.
          </p>
        )}
        <PrivacyNote />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          French in Canada ({ca.year} Census)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="English–French bilingual"
            value={formatPercent(ca.bilingual_rate)}
            hint={ca.english_and_french ? `${formatNumber(ca.english_and_french)} people` : undefined}
          />
          <KpiCard
            label="French first official language"
            value={formatPercent(ca.french_fols_rate)}
            hint={ca.french_fols ? `${formatNumber(ca.french_fols)} people` : undefined}
          />
          <KpiCard
            label="French most often at home"
            value={formatPercent(ca.french_home_rate)}
          />
          <KpiCard
            label="French most often at work"
            value={formatPercent(ca.french_work_rate)}
            hint="Workers aged 15+ who worked since 1 Jan 2020"
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning activity</CardTitle>
            <CardDescription>Lesson completions by day (your account)</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={(learning?.activity ?? []).map((d) => ({ date: d.date.slice(5), lessons: d.lessons }))}
              xKey="date"
              yKey="lessons"
              yLabel="Lessons"
              empty={
                signedIn
                  ? "No completed lessons yet — this chart stays empty until you finish a lesson."
                  : "Log in to plot your lesson completions."
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lesson scores over time</CardTitle>
            <CardDescription>Percent correct on scored lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={scores.map((s) => ({ date: s.date.slice(5), score: s.score }))}
              xKey="date"
              yKey="score"
              yLabel="Score"
              ySuffix="%"
              empty={
                signedIn
                  ? "No scored lessons yet. Unit quizzes are not in the product yet, so this uses lesson exercise scores."
                  : "Log in to plot your scores."
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>English–French bilingualism</CardTitle>
            <CardDescription>Canada, Census years 1951–{ca.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={bilingualCa.map((d) => ({ year: d.year, rate: d.bilingual_rate ?? null }))}
              xKey="year"
              yKey="rate"
              yLabel="Bilingual %"
              ySuffix="%"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provincial bilingualism</CardTitle>
            <CardDescription>{ca.year} · provinces and territories</CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={provinces.map((p) => ({
                geo: p.geo_code,
                rate: p.bilingual_rate,
              }))}
              xKey="geo"
              yKey="rate"
              yLabel="Bilingual %"
              ySuffix="%"
              layout="horizontal"
            />
          </CardContent>
        </Card>
      </div>

      <DataSourceFootnote
        dataset="Tables 15-10-0004, 15-10-0032, 15-10-0033, 98-10-0533"
        period={`1951–${ca.year} (work language: 2021 only)`}
        lastUpdated={bundle.generated_at}
        url="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000401"
      />
    </div>
  );
}

export function CanadaExplorer({ bundle }: { bundle: CanadaBundle }) {
  const [year, setYear] = useState(bundle.latest_year);
  const [geo, setGeo] = useState("CA");
  const [metric, setMetric] = useState<MetricId>("bilingual_rate");
  const years = bundle.census_years;
  const geos = [
    { code: "CA", name: "Canada" },
    { code: "CA-XQ", name: "Canada outside Quebec" },
    ...provincesOnly(bundle.provincial_latest).map((p) => ({ code: p.geo_code, name: p.geo_name })),
  ];

  const metricMeta = METRIC_OPTIONS.find((m) => m.id === metric)!;
  const trend = useMemo(() => {
    if (metric === "bilingual_rate") return trendForGeo(bundle.bilingualism_trend, geo);
    if (metric === "french_fols_rate") return trendForGeo(bundle.fols_trend, geo);
    if (metric === "french_home_rate") return trendForGeo(bundle.home_trend, geo);
    return [];
  }, [bundle, geo, metric]);

  const provinces = provincesOnly(bundle.provincial_latest);
  const snapshot = provinces.find((p) => p.geo_code === geo);
  const canada = bundle.canada_latest;
  const homeVsWork = provinces
    .filter((p) => p.french_home_rate != null || p.french_work_rate != null)
    .map((p) => ({
      geo: p.geo_code,
      home: p.french_home_rate,
      work: p.french_work_rate,
    }));

  const immigrant = bundle.immigrant_trend.filter(
    (r) => r.year === year && r.geo_code === geo && r.immigrant_status_key !== "total",
  );

  const kpiRate =
    metric === "bilingual_rate"
      ? trend.find((t) => t.year === year)?.bilingual_rate ??
        (geo === "CA" ? canada.bilingual_rate : snapshot?.bilingual_rate)
      : metric === "french_fols_rate"
        ? trend.find((t) => t.year === year)?.french_rate ??
          (geo === "CA" ? canada.french_fols_rate : snapshot?.french_fols_rate)
        : metric === "french_home_rate"
          ? trend.find((t) => t.year === year)?.french_rate ??
            (geo === "CA" ? canada.french_home_rate : snapshot?.french_home_rate)
          : geo === "CA"
            ? canada.french_work_rate
            : snapshot?.french_work_rate;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          Year
          <select
            className="ml-2 rounded-md border bg-background px-2 py-1"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Geography
          <select
            className="ml-2 rounded-md border bg-background px-2 py-1"
            value={geo}
            onChange={(e) => setGeo(e.target.value)}
          >
            {geos.map((g) => (
              <option key={g.code} value={g.code}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={metricMeta.label} value={formatPercent(kpiRate ?? null)} hint={`${geo} · ${year}`} />
        <KpiCard label="French speakers (FOLS)" value={formatPercent(canada.french_fols_rate)} hint={`Canada · ${canada.year}`} />
        <KpiCard label="Bilingual population" value={formatNumber(canada.english_and_french)} hint={`Canada · ${canada.year}`} />
        <KpiCard
          label="French at work"
          value={formatPercent(canada.french_work_rate)}
          hint="Canada · 2021 workers"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend</CardTitle>
            <CardDescription>
              {metricMeta.label}
              {metric === "french_work_rate"
                ? " — workplace language is 2021 only, so the trend chart is unavailable for this metric."
                : ` in ${geos.find((g) => g.code === geo)?.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={trend.map((d) => ({
                year: d.year,
                rate: metric === "bilingual_rate" ? d.bilingual_rate : d.french_rate,
              }))}
              xKey="year"
              yKey="rate"
              yLabel={metricMeta.label}
              ySuffix="%"
              empty="Workplace language is a 2021 snapshot, not a time series in this extract."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provincial comparison</CardTitle>
            <CardDescription>
              {metric === "bilingual_rate" ? `${year} bilingualism` : `${canada.year} snapshot`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={
                metric === "bilingual_rate"
                  ? bundle.bilingualism_trend
                      .filter((r) => r.year === year && r.geo_code !== "CA" && r.geo_code !== "CA-XQ")
                      .map((r) => ({ geo: r.geo_code, rate: r.bilingual_rate }))
                  : provinces.map((p) => ({
                      geo: p.geo_code,
                      rate:
                        metric === "french_fols_rate"
                          ? p.french_fols_rate
                          : metric === "french_home_rate"
                            ? p.french_home_rate
                            : p.french_work_rate,
                    }))
              }
              xKey="geo"
              yKey="rate"
              yLabel={metricMeta.label}
              ySuffix="%"
              layout="horizontal"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Home vs workplace French</CardTitle>
            <CardDescription>
              Percent using French most often. Different universes (all people vs workers 15+).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GroupedBars
              data={homeVsWork.map((r) => ({ geo: r.geo, home: r.home, work: r.work }))}
              xKey="geo"
              aKey="home"
              bKey="work"
              aLabel="At home"
              bLabel="At work"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Immigrants and official languages</CardTitle>
            <CardDescription>
              Share who know French (French only or English and French) · {year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={immigrant.map((r) => ({
                status: r.immigrant_status_key.replaceAll("_", " "),
                rate: r.french_knowledge_rate,
              }))}
              xKey="status"
              yKey="rate"
              yLabel="Knows French %"
              ySuffix="%"
              empty="No immigrant-status rows for this geography/year."
            />
          </CardContent>
        </Card>
      </div>

      <DataSourceFootnote
        dataset={`${metricMeta.source} (+ 15-10-0037 for immigrant status)`}
        period={`${years[0] ?? 1951}–${bundle.latest_year}`}
        lastUpdated={bundle.generated_at}
        url="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1510000401"
      />
    </div>
  );
}
