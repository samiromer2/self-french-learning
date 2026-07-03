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
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, lessonCount, completedCount, inProgressCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.lesson.count(),
    prisma.progress.count({
      where: { userId: session.user.id, status: "COMPLETED" },
    }),
    prisma.progress.count({
      where: { userId: session.user.id, status: "IN_PROGRESS" },
    }),
  ]);

  const pct = lessonCount ? Math.round((completedCount / lessonCount) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {session.user.name ?? session.user.email}
        </h1>
        <SignOutButton />
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
