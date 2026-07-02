import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [
    user,
    lessonCount,
    completedCount,
    inProgressCount,
    lessonsBySkill,
    progressRows,
    earnedAchievements,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.lesson.count(),
    prisma.progress.count({
      where: { userId: session.user.id, status: "COMPLETED" },
    }),
    prisma.progress.count({
      where: { userId: session.user.id, status: "IN_PROGRESS" },
    }),
    prisma.lesson.groupBy({ by: ["skill"], _count: true }),
    prisma.progress.findMany({
      where: { userId: session.user.id, status: "COMPLETED" },
      select: { score: true, lesson: { select: { skill: true } } },
    }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: { achievement: true },
      orderBy: { earnedAt: "asc" },
    }),
  ]);

  const pct = lessonCount ? Math.round((completedCount / lessonCount) * 100) : 0;

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
          Welcome, {session.user.name ?? session.user.email}
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>A1 — Beginner</CardTitle>
          <CardDescription>
            {inProgressCount > 0
              ? `${inProgressCount} lesson${inProgressCount > 1 ? "s" : ""} in progress`
              : "Pick up where you left off"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={pct} />
          <Button asChild>
            <Link href="/learn">Continue learning</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
