import { ExerciseType } from "../../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type WritingLessonSeed = {
  exercises: ExerciseSeed[];
};

export const a2WritingContent: Record<number, WritingLessonSeed> = {
  1: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the accents.",
        data: { mode: "copy", text: "Le week-end dernier, je suis allé à Québec." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Aller uses être in the passé composé.",
        data: {
          template: "Je ___ allé à la gare.",
          answer: "suis",
          hint: "je + être.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Most verbs use avoir.",
        data: {
          template: "Nous ___ pris le train.",
          answer: "avons",
          hint: "nous + avoir.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write 3–4 sentences about a trip (past or next weekend).",
        data: {
          mode: "paragraph",
          minWords: 18,
          guidance: [
            "Use at least one passé composé (j'ai visité / je suis allé).",
            "You can add a plan with je vais aller…",
          ],
        },
      },
    ],
  },
  2: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the accents.",
        data: { mode: "copy", text: "Je travaille dans un bureau à Montréal." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Say what you do for a living.",
        data: {
          template: "Je ___ comme développeur.",
          answer: "travaille",
          hint: "je + travailler.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Yesterday's project — passé composé with avoir.",
        data: {
          template: "Hier, nous avons ___ un projet.",
          answer: "fini",
          hint: "Past participle of finir.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write 3–4 sentences about your job or your studies.",
        data: {
          mode: "paragraph",
          minWords: 18,
          guidance: [
            "Use je travaille / j'étudie and a time (à huit heures, le vendredi…).",
            "Add one past sentence if you can (hier, nous avons…).",
          ],
        },
      },
    ],
  },
  3: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the accents.",
        data: { mode: "copy", text: "En hiver, il fait très froid et il neige." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Weather with il fait.",
        data: {
          template: "Aujourd'hui, il ___ chaud.",
          answer: "fait",
          hint: "il fait + chaud / froid / beau.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Past snowfall.",
        data: {
          template: "Hier, il a ___.",
          answer: "neigé",
          hint: "Past participle of neiger.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write 3–4 sentences about the weather this week.",
        data: {
          mode: "paragraph",
          minWords: 18,
          guidance: [
            "Use il fait… and il neige / il pleut.",
            "You can add tomorrow: demain, il va faire…",
          ],
        },
      },
    ],
  },
  4: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly.",
        data: { mode: "copy", text: "Le samedi matin, je fais du sport." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Play an instrument: jouer de.",
        data: {
          template: "L'après-midi, je ___ de la guitare.",
          answer: "joue",
          hint: "je + jouer.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Last Sunday at the museum.",
        data: {
          template: "Dimanche, j'ai visité un ___.",
          answer: "musée",
          hint: "The place in the reading passage.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write 3–4 sentences about your free time.",
        data: {
          mode: "paragraph",
          minWords: 18,
          guidance: [
            "Use je fais du… or j'aime…",
            "Add one thing you did last weekend (j'ai visité / j'ai joué…).",
          ],
        },
      },
    ],
  },
  5: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the accents.",
        data: { mode: "copy", text: "Sortez du métro et tournez à gauche." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Turn left.",
        data: {
          template: "Tournez à ___.",
          answer: "gauche",
          hint: "The opposite of droite.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Opposite the park.",
        data: {
          template: "La bibliothèque est en ___ du parc.",
          answer: "face",
          hint: "en face de = opposite.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Write 3–4 sentences giving directions to a place in your city.",
        data: {
          mode: "paragraph",
          minWords: 18,
          guidance: [
            "Use tournez à gauche / à droite and continuez tout droit.",
            "You can add en face de or à côté de.",
          ],
        },
      },
    ],
  },
  6: {
    exercises: [
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Copy this sentence exactly, including the accents.",
        data: { mode: "copy", text: "D'abord, j'ai cherché mes valises." },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Arrive uses être in the passé composé.",
        data: {
          template: "Je ___ arrivé à l'aéroport.",
          answer: "suis",
          hint: "je + être.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Background feeling — imparfait.",
        data: {
          template: "J'___ fatigué, mais j'étais heureux.",
          answer: "étais",
          hint: "imparfait of être, je form.",
        },
      },
      {
        type: ExerciseType.WRITING_PROMPT,
        prompt: "Tell a short true or invented story (first day, a trip, or yesterday).",
        data: {
          mode: "paragraph",
          minWords: 20,
          guidance: [
            "Use d'abord, ensuite, and enfin.",
            "Passé composé for events (j'ai pris…). You can add c'était… for how it felt.",
          ],
        },
      },
    ],
  },
};
