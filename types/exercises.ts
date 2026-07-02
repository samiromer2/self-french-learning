// Shapes stored in Exercise.data (Json column), keyed by Exercise.type.

export type MultipleChoiceData = {
  options: string[];
  correctIndex: number;
  explanation?: string;
};

// `template` contains a single ___ placeholder the learner fills in.
export type FillBlankData = {
  template: string;
  answer: string;
  hint?: string;
};

// `words` is the sentence in correct order; the client shuffles for display.
export type SentenceOrderData = {
  words: string[];
  translation?: string;
};

// Writing prompts come in three modes:
// - "copy": type `text` exactly (accent practice)
// - "complete": finish the sentence starting with `starter`; any answer with
//   at least `minWords` words counts (no auto-grading until AI phase)
// - "paragraph": free/guided writing of at least `minWords` words
export type WritingPromptData = {
  mode: "copy" | "complete" | "paragraph";
  text?: string;
  starter?: string;
  minWords?: number;
  guidance?: string[];
};

export type ExerciseData =
  | MultipleChoiceData
  | FillBlankData
  | SentenceOrderData
  | WritingPromptData;

// Shape stored in Lesson.content for reading lessons.
export type LessonContent = {
  intro?: string;
  passage?: {
    title: string;
    text: string;
  };
};
