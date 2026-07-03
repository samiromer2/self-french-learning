"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { startLesson, completeLessonWithScore } from "@/app/learn/actions";
import type {
  AudioFields,
  DictationData,
  FillBlankData,
  MultipleChoiceData,
  SentenceOrderData,
  WritingPromptData,
} from "@/types/exercises";
import type { ExerciseType, ProgressStatus } from "@/lib/generated/prisma/client";
import { MultipleChoice } from "./multiple-choice";
import { FillBlank, isFillBlankCorrect } from "./fill-blank";
import { SentenceOrder, isSentenceOrderCorrect } from "./sentence-order";
import { WritingPrompt, isWritingCorrect } from "@/features/writing/writing-prompt";
import { Dictation, isDictationCorrect } from "@/features/listening/dictation";
import { AudioButton } from "@/features/listening/audio-button";

export type PlayerExercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  data: unknown;
};

type Chip = { word: string; id: number };

export function ExercisePlayer({
  lessonId,
  exercises,
  initialStatus,
  passageWordCount,
}: {
  lessonId: string;
  exercises: PlayerExercise[];
  initialStatus: ProgressStatus;
  passageWordCount?: number;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const [selected, setSelected] = useState<number | null>(null);
  const [blankValue, setBlankValue] = useState("");
  const [picked, setPicked] = useState<Chip[]>([]);

  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const [, startTransition] = useTransition();
  const startTimeRef = useRef<number | null>(null);
  const savedRef = useRef(false);

  const exercise = exercises[index];
  const total = exercises.length;

  useEffect(() => {
    startTimeRef.current = Date.now();
    if (initialStatus === "NOT_STARTED") {
      startTransition(() => startLesson(lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hasAnswer() {
    if (exercise.type === "MULTIPLE_CHOICE") return selected !== null;
    if (exercise.type === "FILL_BLANK") return blankValue.trim().length > 0;
    if (exercise.type === "SENTENCE_ORDER")
      return picked.length === (exercise.data as SentenceOrderData).words.length;
    if (exercise.type === "WRITING_PROMPT") return blankValue.trim().length > 0;
    if (exercise.type === "DICTATION") return blankValue.trim().length > 0;
    return false;
  }

  function checkAnswer() {
    let correct = false;
    if (exercise.type === "MULTIPLE_CHOICE") {
      correct = selected === (exercise.data as MultipleChoiceData).correctIndex;
    } else if (exercise.type === "FILL_BLANK") {
      correct = isFillBlankCorrect(exercise.data as FillBlankData, blankValue);
    } else if (exercise.type === "SENTENCE_ORDER") {
      correct = isSentenceOrderCorrect(
        exercise.data as SentenceOrderData,
        picked.map((p) => p.word),
      );
    } else if (exercise.type === "WRITING_PROMPT") {
      correct = isWritingCorrect(exercise.data as WritingPromptData, blankValue);
    } else if (exercise.type === "DICTATION") {
      correct = isDictationCorrect(exercise.data as DictationData, blankValue);
    }
    setWasCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= total) {
      setElapsedMs(Date.now() - (startTimeRef.current ?? Date.now()));
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setRevealed(false);
    setSelected(null);
    setBlankValue("");
    setPicked([]);
  }

  useEffect(() => {
    if (!finished || savedRef.current) return;
    savedRef.current = true;
    startTransition(async () => {
      const { xpAwarded } = await completeLessonWithScore(
        lessonId,
        correctCount,
        total,
      );
      toast.success(`Lesson completed! +${xpAwarded} XP`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished) {
    const elapsedMinutes = elapsedMs !== null ? elapsedMs / 60000 : 0;
    const wpm =
      passageWordCount && elapsedMinutes > 0
        ? Math.round(passageWordCount / elapsedMinutes)
        : null;

    return (
      <div className="space-y-4 text-center">
        <p className="text-4xl font-semibold">
          {Math.round((correctCount / total) * 100)}%
        </p>
        <p className="text-muted-foreground">
          {correctCount} out of {total} correct
          {wpm !== null && <> · reading pace ~{wpm} words/min</>}
        </p>
        <Button asChild>
          <Link href="/learn">Back to course</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Progress value={(index / total) * 100} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>

      <p className="font-medium">{exercise.prompt}</p>

      {(exercise.type === "MULTIPLE_CHOICE" || exercise.type === "FILL_BLANK") &&
        (exercise.data as AudioFields).tts && (
          <AudioButton
            text={(exercise.data as AudioFields).tts!}
            rate={(exercise.data as AudioFields).rate}
          />
        )}

      {exercise.type === "MULTIPLE_CHOICE" && (
        <MultipleChoice
          data={exercise.data as MultipleChoiceData}
          selected={selected}
          onSelect={setSelected}
          revealed={revealed}
        />
      )}
      {exercise.type === "FILL_BLANK" && (
        <FillBlank
          data={exercise.data as FillBlankData}
          value={blankValue}
          onChange={setBlankValue}
          revealed={revealed}
        />
      )}
      {exercise.type === "SENTENCE_ORDER" && (
        <SentenceOrder
          data={exercise.data as SentenceOrderData}
          picked={picked}
          onPickedChange={setPicked}
          revealed={revealed}
        />
      )}
      {exercise.type === "WRITING_PROMPT" && (
        <WritingPrompt
          data={exercise.data as WritingPromptData}
          value={blankValue}
          onChange={setBlankValue}
          revealed={revealed}
        />
      )}
      {exercise.type === "DICTATION" && (
        <Dictation
          data={exercise.data as DictationData}
          value={blankValue}
          onChange={setBlankValue}
          revealed={revealed}
        />
      )}

      <div className="flex justify-end">
        {revealed ? (
          <Button onClick={next}>
            {wasCorrect ? "Correct!" : "Got it"} — {index + 1 >= total ? "Finish" : "Next"}
          </Button>
        ) : (
          <Button onClick={checkAnswer} disabled={!hasAnswer()}>
            Check
          </Button>
        )}
      </div>
    </div>
  );
}
