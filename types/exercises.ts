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

export type ExerciseData = MultipleChoiceData | FillBlankData | SentenceOrderData;

// Shape stored in Lesson.content for reading lessons.
export type LessonContent = {
  intro?: string;
  passage?: {
    title: string;
    text: string;
  };
};
