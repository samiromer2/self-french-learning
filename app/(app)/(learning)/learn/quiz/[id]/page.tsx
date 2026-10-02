import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { requireUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizPlayer } from "@/features/quizzes/quiz-player";
import { isQuizQuestionData, type QuizQuestionView } from "@/types/quizzes";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();

  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      unit: { include: { level: true } },
      questions: { orderBy: { order: "asc" } },
      attempts: {
        where: { userId: user.id },
        orderBy: { score: "desc" },
        take: 1,
      },
    },
  });

  if (!quiz || quiz.questions.length === 0) notFound();

  const questions: QuizQuestionView[] = quiz.questions.flatMap((q) => {
    if (!isQuizQuestionData(q.data)) return [];
    return [{ id: q.id, order: q.order, prompt: q.prompt, data: q.data }];
  });

  if (questions.length === 0) notFound();

  const best = quiz.attempts[0];
  const bestPct =
    best == null ? null : Math.round((best.score <= 1 ? best.score * 100 : best.score));

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {quiz.unit
          ? `${quiz.unit.level.code} · Unit ${quiz.unit.order}: ${quiz.unit.title}`
          : "Back to course"}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="size-5" />
              {quiz.title}
            </CardTitle>
            {bestPct != null && <Badge>Best {bestPct}%</Badge>}
          </div>
          <CardDescription>
            {questions.length} questions · mixes reading, listening, and writing from this unit.
            You can retake it any time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuizPlayer quizId={quiz.id} questions={questions} />
        </CardContent>
      </Card>
    </div>
  );
}
