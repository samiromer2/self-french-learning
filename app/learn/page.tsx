import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkillBadge } from "./skill-badge";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const levels = await prisma.level.findMany({
    orderBy: { order: "asc" },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: { userId: user.id },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-10 px-6 py-12">
      {levels.map((level) => {
        const lessons = level.units.flatMap((u) => u.lessons);
        const completed = lessons.filter(
          (l) => l.progress[0]?.status === "COMPLETED",
        ).length;
        const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

        const completedUnits = level.units.filter(
          (u) =>
            u.lessons.length > 0 &&
            u.lessons.every((l) => l.progress[0]?.status === "COMPLETED"),
        ).length;
        const levelComplete =
          level.units.length > 0 && completedUnits === level.units.length;

        return (
          <section key={level.id} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{level.code}</Badge>
                <h1 className="text-2xl font-semibold tracking-tight">{level.title}</h1>
                {levelComplete && <Badge>Level complete 🎉</Badge>}
              </div>
              {level.description && (
                <p className="text-muted-foreground">{level.description}</p>
              )}
              <div className="flex items-center gap-3">
                <Progress value={pct} className="max-w-xs" />
                <span className="text-sm text-muted-foreground">
                  {completed}/{lessons.length} lessons · {completedUnits}/
                  {level.units.length} units
                </span>
              </div>
            </div>

            {level.units.map((unit) => {
              const unitComplete =
                unit.lessons.length > 0 &&
                unit.lessons.every((l) => l.progress[0]?.status === "COMPLETED");
              return (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>
                      Unit {unit.order}: {unit.title}
                    </CardTitle>
                    {unitComplete && <Badge>Complete</Badge>}
                  </div>
                  {unit.description && (
                    <CardDescription>{unit.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {unit.lessons.map((lesson) => {
                      const status = lesson.progress[0]?.status ?? "NOT_STARTED";
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/learn/lesson/${lesson.id}`}
                            className="flex items-center justify-between gap-4 py-3 hover:bg-muted/50"
                          >
                            <span className="flex items-center gap-3">
                              <SkillBadge skill={lesson.skill} />
                              <span className="font-medium">{lesson.title}</span>
                            </span>
                            {status === "COMPLETED" ? (
                              <Badge>Completed</Badge>
                            ) : status === "IN_PROGRESS" ? (
                              <Badge variant="secondary">In progress</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Not started
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
