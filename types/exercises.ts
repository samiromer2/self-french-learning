// Shapes stored in Exercise.data (Json column), keyed by Exercise.type.

// Optional TTS audio attached to any exercise: the player shows a speaker
// button that reads `tts` aloud in French. `rate` slows speech for lower
// levels (A1 ≈ 0.8).
export type AudioFields = {
  tts?: string;
  rate?: number;
};

export type MultipleChoiceData = AudioFields & {
  options: string[];
  correctIndex: number;
  explanation?: string;
};

// `template` contains a single ___ placeholder the learner fills in.
export type FillBlankData = AudioFields & {
  template: string;
  answer: string;
  hint?: string;
};

// Dictation: listen to `text` (via TTS) and type it. Compared with
// punctuation/case-insensitive matching.
export type DictationData = {
  text: string;
  rate?: number;
  translation?: string;
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
  | WritingPromptData
  | DictationData;

// Shape stored in Lesson.content for reading lessons.
export type LessonContent = {
  intro?: string;
  passage?: {
    title: string;
    text: string;
  };
};
