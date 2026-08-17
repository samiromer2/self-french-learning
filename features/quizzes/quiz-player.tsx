"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { submitQuizAttempt } from "@/app/learn/quiz/actions";
import type { FillBlankData, MultipleChoiceData, SentenceOrderData } from "@/types/exercises";
import type { QuizQuestionView } from "@/types/quizzes";
import { MultipleChoice } from "@/features/exercises/multiple-choice";
import { FillBlank, isFillBlankCorrect } from "@/features/exercises/fill-blank";
import { SentenceOrder, isSentenceOrderCorrect } from "@/features/exercises/sentence-order";
import { AudioButton } from "@/features/listening/audio-button";

type Chip = { word: string; id: number };

export function QuizPlayer({
  quizId,
  questions,
}: {
  quizId: string;
  questions: QuizQuestionView[];
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [blankValue, setBlankValue] = useState("");
  const [picked, setPicked] = useState<Chip[]>([]);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const startTimeRef = useRef<number | null>(null);
  const savedRef = useRef(false);

  const question = questions[index];
  const total = questions.length;
  const data = question?.data;

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  function resetLocal() {
    setIndex(0);
    setRevealed(false);
    setCorrectCount(0);
    setAnswers([]);
    setFinished(false);
    setWasCorrect(false);
    setSelected(null);
    setBlankValue("");
    setPicked([]);
    setElapsedMs(null);
    savedRef.current = false;
    startTimeRef.current = Date.now();
  }

  function hasAnswer() {
    if (!data) return false;
    if (data.type === "MULTIPLE_CHOICE") return selected !== null;
    if (data.type === "FILL_BLANK") return blankValue.trim().length > 0;
    if (data.type === "SENTENCE_ORDER")
      return picked.length === (data as SentenceOrderData).words.length;
    return false;
  }

  function checkAnswer() {
    if (!data || !question) return;
    let correct = false;
    if (data.type === "MULTIPLE_CHOICE") {
      correct = selected === (data as MultipleChoiceData).correctIndex;
    } else if (data.type === "FILL_BLANK") {
      correct = isFillBlankCorrect(data as FillBlankData, blankValue);
    } else if (data.type === "SENTENCE_ORDER") {
      correct = isSentenceOrderCorrect(
        data as SentenceOrderData,
        picked.map((p) => p.word),
      );
    }
    setWasCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
    setAnswers((prev) => [...prev, { questionId: question.id, correct }]);
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
      const durationMinutes =
        (elapsedMs ?? Date.now() - (startTimeRef.current ?? Date.now())) / 60_000;
      try {
        const { xpAwarded, newAchievements } = await submitQuizAttempt(
          quizId,
          correctCount,
          total,
          answers,
          durationMinutes,
        );
        toast.success(`Quiz saved · +${xpAwarded} XP`);
        for (const a of newAchievements) {
          toast(`${a.icon ?? "🏅"} Achievement unlocked: ${a.title}`);
        }
      } catch {
        savedRef.current = false;
        toast.error("Could not save this quiz. Check your connection and try again.");
      }
    });
  }, [finished, answers, correctCount, elapsedMs, quizId, total]);

  if (finished) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="space-y-4 text-center">
        <p className="text-4xl font-semibold">{pct}%</p>
        <p className="text-muted-foreground">
          {correctCount} out of {total} correct
        </p>
        <div className="flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link href="/learn">Back to course</Link>
          </Button>
          <Button onClick={resetLocal} disabled={isPending}>
            Retake
          </Button>
        </div>
      </div>
    );
  }

  if (!question || !data) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Progress value={(index / total) * 100} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>

      <p className="font-medium">{question.prompt}</p>

      {data.type === "MULTIPLE_CHOICE" && data.tts && (
        <AudioButton text={data.tts} rate={data.rate} />
      )}

      {data.type === "MULTIPLE_CHOICE" && (
        <MultipleChoice
          data={data}
          selected={selected}
          onSelect={setSelected}
          revealed={revealed}
        />
      )}
      {data.type === "FILL_BLANK" && (
        <FillBlank
          data={data}
          value={blankValue}
          onChange={setBlankValue}
          revealed={revealed}
        />
      )}
      {data.type === "SENTENCE_ORDER" && (
        <SentenceOrder
          data={data}
          picked={picked}
          onPickedChange={setPicked}
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
