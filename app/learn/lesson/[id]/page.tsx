import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PassageViewer } from "@/features/reading/passage-viewer";
import { ExercisePlayer } from "@/features/exercises/exercise-player";
import type { LessonContent } from "@/types/exercises";
import { SkillBadge } from "../../skill-badge";
import { LessonControls } from "./lesson-controls";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      unit: { include: { level: true } },
      exercises: { orderBy: { order: "asc" } },
      vocabulary: true,
      progress: { where: { userId: session.user.id } },
    },
  });

  if (!lesson) notFound();

  const content = (lesson.content ?? {}) as LessonContent;
  const status = lesson.progress[0]?.status ?? "NOT_STARTED";
  const hasExercises = lesson.exercises.length > 0;

  const placeholderBySkill = {
    READING: "Reading passages and comprehension exercises for this lesson arrive in Phase 3.",
    WRITING: "Writing prompts and guided composition exercises arrive in Phase 4.",
    LISTENING: "Audio clips and dictation exercises arrive in Phase 5.",
    SPEAKING: "Pronunciation and conversation practice arrives in Phase 6.",
  } as const;

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-12">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {lesson.unit.level.code} · Unit {lesson.unit.order}: {lesson.unit.title}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <SkillBadge skill={lesson.skill} />
          </div>
          {content.intro && <CardDescription>{content.intro}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6">
          {content.passage && (
            <>
              <PassageViewer
                title={content.passage.title}
                text={content.passage.text}
                vocabulary={lesson.vocabulary}
              />
              <Separator />
            </>
          )}

          {hasExercises ? (
            <ExercisePlayer
              lessonId={lesson.id}
              exercises={lesson.exercises.map((e) => ({
                id: e.id,
                type: e.type,
                prompt: e.prompt,
                data: e.data,
              }))}
              initialStatus={status}
              passageWordCount={content.passage?.text.split(/\s+/).length}
            />
          ) : (
            <>
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                {placeholderBySkill[lesson.skill]}
              </div>

              <div className="flex items-center justify-between gap-4">
                {status === "COMPLETED" ? (
                  <Badge>Completed</Badge>
                ) : status === "IN_PROGRESS" ? (
                  <Badge variant="secondary">In progress</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Not started</span>
                )}
                <LessonControls lessonId={lesson.id} status={status} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
