import { ExerciseType } from "../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type SpeakingLessonSeed = {
  exercises: ExerciseSeed[];
};

// Keyed by unit order — each unit's SPEAKING lesson gets these exercises.
// Progression per master plan: repeat after speaker → pronunciation →
// shadowing (longer sentences) → question-answer practice.
const RATE = 0.8;

export const a1SpeakingContent: Record<number, SpeakingLessonSeed> = {
  1: {
    // Basic conversation
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Bonjour, comment ça va ?", translation: "Hello, how are you?", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Ça va bien, merci.", translation: "I'm fine, thank you.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence — try to match the rhythm.",
        data: { mode: "repeat", text: "Je m'appelle Thomas et je suis très content de te rencontrer.", translation: "My name is Thomas and I'm very happy to meet you.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Listen to the question and answer it aloud in French.",
        data: { mode: "answer", question: "Comment tu t'appelles ?", text: "Je m'appelle Samir.", translation: "My name is Samir.", rate: RATE },
      },
    ],
  },
  2: {
    // Speaking practice (pronunciation)
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — practice the French « u » sound.",
        data: { mode: "repeat", text: "Tu as vu la rue ?", translation: "Did you see the street?", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — practice the nasal sounds.",
        data: { mode: "repeat", text: "Mon oncle mange un bonbon.", translation: "My uncle eats a candy.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — practice the French « r ».",
        data: { mode: "repeat", text: "Le rat rouge rit rarement.", translation: "The red rat rarely laughs.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this sentence with liaison.",
        data: { mode: "repeat", text: "Les enfants adorent les oranges.", translation: "The children love oranges.", rate: RATE },
      },
    ],
  },
  3: {
    // Calendar
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Aujourd'hui, c'est lundi.", translation: "Today is Monday.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Mon anniversaire est en avril.", translation: "My birthday is in April.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this sentence about a schedule.",
        data: { mode: "repeat", text: "Nous avons rendez-vous mercredi à trois heures.", translation: "We have an appointment Wednesday at three.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Listen to the question and answer aloud.",
        data: { mode: "answer", question: "Quel jour sommes-nous ?", text: "Nous sommes mardi.", translation: "It's Tuesday.", rate: RATE },
      },
    ],
  },
  4: {
    // Relationships
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Voici ma mère et mon père.", translation: "Here are my mother and my father.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "J'ai deux frères et une sœur.", translation: "I have two brothers and one sister.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this description.",
        data: { mode: "repeat", text: "Ma grand-mère habite à Lyon avec mon grand-père.", translation: "My grandmother lives in Lyon with my grandfather.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Listen and answer about your own family.",
        data: { mode: "answer", question: "Tu as des frères et sœurs ?", text: "Oui, j'ai un frère.", translation: "Yes, I have a brother.", rate: RATE },
      },
    ],
  },
  5: {
    // Prices
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "C'est combien ?", translation: "How much is it?", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Ça coûte cinq euros.", translation: "It costs five euros.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this polite exchange.",
        data: { mode: "repeat", text: "Je voudrais un café, s'il vous plaît. Merci beaucoup.", translation: "I'd like a coffee, please. Thank you very much.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Listen to the question and answer aloud.",
        data: { mode: "answer", question: "C'est combien, le croissant ?", text: "C'est un euro cinquante.", translation: "It's one euro fifty.", rate: RATE },
      },
    ],
  },
  6: {
    // Months
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "Janvier, février, mars, avril.", translation: "January, February, March, April.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: { mode: "repeat", text: "En été, il fait chaud.", translation: "In summer, it's hot.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this sentence about the year.",
        data: { mode: "repeat", text: "Mon mois préféré est septembre parce que j'aime l'automne.", translation: "My favorite month is September because I love autumn.", rate: RATE },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Listen to the question and answer aloud.",
        data: { mode: "answer", question: "Quel est ton mois préféré ?", text: "Mon mois préféré est juin.", translation: "My favorite month is June.", rate: RATE },
      },
    ],
  },
};
