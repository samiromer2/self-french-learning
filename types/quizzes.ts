import type {
  FillBlankData,
  MultipleChoiceData,
  SentenceOrderData,
} from "@/types/exercises";

export type QuizQuestionData =
  | ({ type: "MULTIPLE_CHOICE" } & MultipleChoiceData)
  | ({ type: "FILL_BLANK" } & FillBlankData)
  | ({ type: "SENTENCE_ORDER" } & SentenceOrderData);

export type QuizQuestionView = {
  id: string;
  order: number;
  prompt: string;
  data: QuizQuestionData;
};

export function isQuizQuestionData(value: unknown): value is QuizQuestionData {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const type = (value as { type: unknown }).type;
  return (
    type === "MULTIPLE_CHOICE" ||
    type === "FILL_BLANK" ||
    type === "SENTENCE_ORDER"
  );
}
