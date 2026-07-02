import { ExerciseType } from "../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type WritingLessonSeed = {
  exercises: ExerciseSeed[];
};

// Keyed by unit order — each unit's WRITING lesson gets these exercises.
// Progression per master plan: copy sentences → complete sentences →
// short paragraphs → guided composition → free writing.
export const a1WritingContent: Record<number, WritingLessonSeed> = {
  1: {
    // Je m'appelle
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the apostrophe.",
        data: { mode: "copy", text: "Je m'appelle Marie et je suis française." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the introduction.",
        data: {
          template: "Bonjour, je ___ Samir.",
          answer: "m'appelle",
          hint: "The verb for saying your name.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Complete the sentence with your own information.",
        data: {
          mode: "complete",
          starter: "Je m'appelle",
          minWords: 4,
          guidance: ["Give your name and one more detail (nationality or city)."],
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write a short introduction of yourself (2–3 sentences).",
        data: {
          mode: "paragraph",
          minWords: 10,
          guidance: [
            "Your name: Je m'appelle…",
            "Where you live: J'habite à…",
            "One thing you like: J'aime…",
          ],
        },
      },
    ],
  },
  2: {
    // Accent marks
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly — watch the accents!",
        data: { mode: "copy", text: "L'élève préfère le café très sucré." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete with the right word (it has a cedilla).",
        data: {
          template: "Je parle ___ avec mes amis.",
          answer: "français",
          hint: "The language you're learning, with ç.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, keeping è and ê.",
        data: { mode: "copy", text: "Mon père achète une crêpe à la fête." },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write two sentences using at least three accented words.",
        data: {
          mode: "paragraph",
          minWords: 8,
          guidance: ["Ideas: café, école, très, préféré, être, âge."],
        },
      },
    ],
  },
  3: {
    // Dates
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this date sentence exactly.",
        data: { mode: "copy", text: "Aujourd'hui, c'est le mardi trois juin." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the sentence about a birthday.",
        data: {
          template: "Mon anniversaire est le quinze ___.",
          answer: "avril",
          hint: "The fourth month of the year.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Complete the sentence with a real date.",
        data: {
          mode: "complete",
          starter: "Mon anniversaire est le",
          minWords: 5,
          guidance: ["Write the day and the month in French words."],
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write your week: mention two days and what you do.",
        data: {
          mode: "paragraph",
          minWords: 10,
          guidance: ["Example: Le lundi, je travaille. Le samedi, je…"],
        },
      },
    ],
  },
  4: {
    // Descriptions
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this description exactly.",
        data: { mode: "copy", text: "Ma sœur est grande et elle a les cheveux bruns." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the description (feminine form).",
        data: {
          template: "Ma mère est très ___.",
          answer: "gentille",
          hint: "Feminine of « gentil » (kind).",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Complete the sentence describing someone in your family.",
        data: {
          mode: "complete",
          starter: "Mon frère est",
          minWords: 4,
          guidance: ["Use one adjective for character and one for appearance."],
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Describe a person you know in 2–3 sentences.",
        data: {
          mode: "paragraph",
          minWords: 12,
          guidance: [
            "Who they are: C'est mon ami(e)…",
            "Appearance: Il/Elle est… Il/Elle a…",
            "Character: Il/Elle est très…",
          ],
        },
      },
    ],
  },
  5: {
    // Ordering food
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this polite order exactly.",
        data: { mode: "copy", text: "Je voudrais un café et un croissant, s'il vous plaît." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the request for the bill.",
        data: {
          template: "L'___, s'il vous plaît !",
          answer: "addition",
          hint: "What you ask for at the end of the meal.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Complete the order with food you like.",
        data: {
          mode: "complete",
          starter: "Je voudrais",
          minWords: 5,
          guidance: ["Order two items and stay polite (s'il vous plaît)."],
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write a short restaurant dialogue (you and the waiter).",
        data: {
          mode: "paragraph",
          minWords: 12,
          guidance: [
            "Greet: Bonjour !",
            "Order: Je voudrais…",
            "Thank and ask for the bill.",
          ],
        },
      },
    ],
  },
  6: {
    // Activities
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this routine sentence exactly.",
        data: { mode: "copy", text: "Le matin, je me lève à sept heures et je prends un café." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the sentence about the evening.",
        data: {
          template: "Le soir, je regarde la ___.",
          answer: "télévision",
          hint: "TV, written in full.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Complete the sentence with your favorite activity.",
        data: {
          mode: "complete",
          starter: "Le week-end, j'aime",
          minWords: 5,
          guidance: ["Use an infinitive after « j'aime » (jouer, lire, regarder…)."],
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Describe your typical day in 3–4 sentences.",
        data: {
          mode: "paragraph",
          minWords: 15,
          guidance: [
            "Morning: Je me lève à…",
            "Day: Je travaille / j'étudie…",
            "Evening: Je dîne à… et je me couche à…",
          ],
        },
      },
    ],
  },
};
