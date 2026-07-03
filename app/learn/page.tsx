import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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
  const session = await auth();
  if (!session?.user) redirect("/login");

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
                where: { userId: session.user.id },
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

        return (
          <section key={level.id} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{level.code}</Badge>
                <h1 className="text-2xl font-semibold tracking-tight">{level.title}</h1>
              </div>
              {level.description && (
                <p className="text-muted-foreground">{level.description}</p>
              )}
              <div className="flex items-center gap-3">
                <Progress value={pct} className="max-w-xs" />
                <span className="text-sm text-muted-foreground">
                  {completed}/{lessons.length} lessons
                </span>
              </div>
            </div>

            {level.units.map((unit) => (
              <Card key={unit.id}>
                <CardHeader>
                  <CardTitle>
                    Unit {unit.order}: {unit.title}
                  </CardTitle>
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
            ))}
          </section>
        );
      })}
    </div>
  );
}
