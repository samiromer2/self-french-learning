import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkillBadge } from "@/app/learn/skill-badge";
import type { Skill } from "@/lib/generated/prisma/client";
import { SignOutButton } from "./sign-out-button";

const SKILLS: Skill[] = ["READING", "WRITING", "LISTENING", "SPEAKING"];

export default async function DashboardPage() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    redirect("/login");
  }

  // Curriculum stats cover unit lessons only; the scenario track (unitId
  // null) is counted separately below.
  const curriculumLesson = { unitId: { not: null } } as const;

  const [
    user,
    lessonCount,
    completedCount,
    lessonsBySkill,
    progressRows,
    earnedAchievements,
    scenarioCount,
    scenariosCompleted,
    quizAgg,
    vocabTotal,
    vocabKnown,
    levels,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: authUser.id } }),
    prisma.lesson.count({ where: curriculumLesson }),
    prisma.progress.count({
      where: { userId: authUser.id, status: "COMPLETED", lesson: curriculumLesson },
    }),
    prisma.lesson.groupBy({ by: ["skill"], _count: true, where: curriculumLesson }),
    prisma.progress.findMany({
      where: { userId: authUser.id, status: "COMPLETED", lesson: curriculumLesson },
      select: { score: true, lesson: { select: { skill: true } } },
    }),
    prisma.userAchievement.findMany({
      where: { userId: authUser.id },
      include: { achievement: true },
      orderBy: { earnedAt: "asc" },
    }),
    prisma.scenario.count(),
    prisma.progress.count({
      where: {
        userId: authUser.id,
        status: "COMPLETED",
        lesson: { scenarioId: { not: null } },
      },
    }),
    prisma.quizAttempt.aggregate({
      where: { userId: authUser.id },
      _avg: { score: true },
      _count: true,
    }),
    prisma.vocabulary.count(),
    prisma.userVocabulary
      .count({ where: { userId: authUser.id, status: "KNOWN" } })
      .catch((error) => {
        const code =
          typeof error === "object" && error && "code" in error ? String(error.code) : "";
        if (code === "P2021") return 0;
        throw error;
      }),
    prisma.level.findMany({
      orderBy: { order: "asc" },
      select: {
        code: true,
        title: true,
        units: {
          select: {
            lessons: {
              select: {
                progress: {
                  where: { userId: authUser.id },
                  select: { status: true },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const skillStats = SKILLS.map((skill) => {
    const total = lessonsBySkill.find((l) => l.skill === skill)?._count ?? 0;
    const rows = progressRows.filter((p) => p.lesson.skill === skill);
    const scored = rows.filter((p) => p.score !== null);
    const avgScore = scored.length
      ? Math.round(
          (scored.reduce((sum, p) => sum + (p.score ?? 0), 0) / scored.length) * 100,
        )
      : null;
    return { skill, total, completed: rows.length, avgScore };
  });

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user?.name ?? authUser.name ?? authUser.email}
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/analytics">Analytics</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>XP</CardDescription>
            <CardTitle className="text-3xl">{user?.xp ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Streak</CardDescription>
            <CardTitle className="text-3xl">
              {user?.currentStreak ?? 0} <span className="text-base font-normal">days</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Lessons completed</CardDescription>
            <CardTitle className="text-3xl">
              {completedCount}
              <span className="text-base font-normal text-muted-foreground">
                /{lessonCount}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Words known</CardDescription>
            <CardTitle className="text-3xl">
              {vocabKnown}
              <span className="text-base font-normal text-muted-foreground">
                /{vocabTotal}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/vocabulary" className="text-sm underline underline-offset-2">
              Review flashcards
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Unit quiz average</CardDescription>
          <CardTitle className="text-3xl">
            {quizAgg._count > 0
              ? `${Math.round(
                  (quizAgg._avg.score ?? 0) <= 1
                    ? (quizAgg._avg.score ?? 0) * 100
                    : (quizAgg._avg.score ?? 0),
                )}%`
              : "—"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {quizAgg._count > 0
              ? `${quizAgg._count} attempt${quizAgg._count === 1 ? "" : "s"} · `
              : "No attempts yet · "}
            <Link href="/learn" className="underline underline-offset-2">
              Take a unit quiz
            </Link>
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {skillStats.map(({ skill, total, completed, avgScore }) => (
          <Card key={skill}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <SkillBadge skill={skill} />
                <span className="text-sm text-muted-foreground">
                  {completed}/{total} lessons
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={total ? (completed / total) * 100 : 0} />
              <p className="text-xs text-muted-foreground">
                {avgScore !== null
                  ? `Average score: ${avgScore}%`
                  : "No scored lessons yet"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {earnedAchievements.map(({ achievement }) => (
              <span
                key={achievement.id}
                title={achievement.description ?? undefined}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
              >
                <span>{achievement.icon ?? "🏅"}</span>
                {achievement.title}
              </span>
            ))}
          </CardContent>
        </Card>
      )}

      {levels.map((level) => {
        const lessons = level.units.flatMap((u) => u.lessons);
        const completed = lessons.filter((l) =>
          l.progress.some((p) => p.status === "COMPLETED"),
        ).length;
        const inProgress = lessons.filter((l) =>
          l.progress.some((p) => p.status === "IN_PROGRESS"),
        ).length;
        const levelPct = lessons.length
          ? Math.round((completed / lessons.length) * 100)
          : 0;
        return (
          <Card key={level.code}>
            <CardHeader>
              <CardTitle>
                {level.code} — {level.title}
              </CardTitle>
              <CardDescription>
                {inProgress > 0
                  ? `${inProgress} lesson${inProgress > 1 ? "s" : ""} in progress`
                  : completed === lessons.length && lessons.length > 0
                    ? "Level complete"
                    : "Pick up where you left off"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={levelPct} />
              <div className="flex items-center justify-between">
                <Button asChild>
                  <Link href="/learn">Continue learning</Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {completed}/{lessons.length} lessons
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle>Real-Life Scenarios</CardTitle>
          <CardDescription>
            ☕ Café, 💊 pharmacy, 🍽️ restaurant, 📞 phone… survival French, one
            pattern at a time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress
            value={scenarioCount ? (scenariosCompleted / scenarioCount) * 100 : 0}
          />
          <div className="flex items-center justify-between">
            <Button asChild variant="outline">
              <Link href="/scenarios">Explore scenarios</Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              {scenariosCompleted}/{scenarioCount} done
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
