"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "./kpi-card";
import { CompareBars, TrendLine } from "./charts";
import { ActivityHeatmap } from "./activity-heatmap";
import { PrivacyNote } from "./data-source-footnote";
import { formatHours, formatMinutes, formatNumber, formatPercent } from "@/lib/analytics/format";
import type { LearningAnalytics } from "@/lib/analytics/types";

const SKILL_LABEL: Record<string, string> = {
  READING: "Reading",
  WRITING: "Writing",
  LISTENING: "Listening",
  SPEAKING: "Speaking",
};

export function LearningDashboard({ data }: { data: LearningAnalytics }) {
  const { kpis } = data;
  const strongest = [...data.bySkill]
    .filter((s) => s.avgScore != null)
    .sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My French learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          First-party metrics from your lessons. Unit quizzes are not in the product yet; scores
          come from lesson exercises.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Learning hours"
          value={formatHours(kpis.totalHours)}
          unavailable={kpis.totalHours == null}
          hint="Timed from lesson sessions after this feature shipped"
        />
        <KpiCard label="Sessions" value={formatNumber(kpis.sessionCount)} />
        <KpiCard label="Streak" value={`${kpis.currentStreak} days`} hint={`Longest ${kpis.longestStreak}`} />
        <KpiCard label="Vocabulary learned" value={formatNumber(kpis.vocabularyLearned)} hint="Words attached to completed lessons" />
        <KpiCard
          label="Average score"
          value={formatPercent(kpis.averageLessonScore)}
          unavailable={kpis.averageLessonScore == null}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Lessons completed" value={formatNumber(kpis.lessonsCompleted)} />
        <KpiCard
          label="Last 7 days"
          value={formatMinutes(kpis.weeklyMinutes)}
          unavailable={kpis.weeklyMinutes == null}
        />
        <KpiCard
          label="Last 30 days"
          value={formatMinutes(kpis.monthlyMinutes)}
          unavailable={kpis.monthlyMinutes == null}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning time</CardTitle>
            <CardDescription>Minutes recorded per day</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={data.activity.map((d) => ({ date: d.date.slice(5), minutes: d.minutes }))}
              xKey="date"
              yKey="minutes"
              yLabel="Minutes"
              empty="No timed sessions yet. Start a lesson after this update to record duration."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lesson scores</CardTitle>
            <CardDescription>Percent correct over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendLine
              data={data.scoreTrend.map((d) => ({ date: d.date.slice(5), score: d.score }))}
              xKey="date"
              yKey="score"
              yLabel="Score"
              ySuffix="%"
              empty="No scored lessons yet."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lessons by skill</CardTitle>
            <CardDescription>Completed lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={data.bySkill.map((s) => ({
                skill: SKILL_LABEL[s.skill] ?? s.skill,
                completed: s.completed,
              }))}
              xKey="skill"
              yKey="completed"
              yLabel="Lessons"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strongest vs weakest skills</CardTitle>
            <CardDescription>Average lesson score (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={strongest.map((s) => ({
                skill: SKILL_LABEL[s.skill] ?? s.skill,
                score: s.avgScore,
              }))}
              xKey="skill"
              yKey="score"
              yLabel="Avg score"
              ySuffix="%"
              empty="Scores appear after you complete scored exercises."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity by day and hour</CardTitle>
          <CardDescription>Lesson completions (UTC)</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={data.heatmap} />
        </CardContent>
      </Card>

      {data.byUnit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Units and scenarios</CardTitle>
            <CardDescription>Completed lessons by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CompareBars
              data={data.byUnit.map((u) => ({ label: u.label, completed: u.completed }))}
              xKey="label"
              yKey="completed"
              yLabel="Lessons"
              layout="horizontal"
            />
          </CardContent>
        </Card>
      )}

      {!data.hasQuizData && (
        <p className="text-xs text-muted-foreground">
          Unit quizzes and level assessments are in the database schema but not yet in the UI, so
          quiz-attempt KPIs are hidden rather than invented.
        </p>
      )}
      <PrivacyNote />
    </div>
  );
}
