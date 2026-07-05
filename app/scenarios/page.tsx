import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ScenariosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const scenarios = await prisma.scenario.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          progress: { where: { userId: user.id } },
        },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-6 py-12">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Real-Life Scenarios
        </h1>
        <p className="text-muted-foreground">
          Survival French for situations you&apos;ll actually be in — one
          reusable phrase pattern and a real conversation each.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((scenario) => {
          const lesson = scenario.lessons[0];
          const status = lesson?.progress[0]?.status ?? "NOT_STARTED";
          return (
            <Link
              key={scenario.id}
              href={lesson ? `/learn/lesson/${lesson.id}` : "/scenarios"}
              className="group"
            >
              <Card className="h-full transition-colors group-hover:bg-muted/40">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{scenario.emoji}</span>
                      {scenario.title}
                    </CardTitle>
                    {status === "COMPLETED" ? (
                      <Badge>Done</Badge>
                    ) : status === "IN_PROGRESS" ? (
                      <Badge variant="secondary">Started</Badge>
                    ) : null}
                  </div>
                  {scenario.description && (
                    <CardDescription>{scenario.description}</CardDescription>
                  )}
                </CardHeader>
                {lesson?.progress[0]?.score != null && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Best score: {Math.round(lesson.progress[0].score * 100)}%
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
