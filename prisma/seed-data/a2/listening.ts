import { ExerciseType } from "../../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type ListeningLessonSeed = {
  exercises: ExerciseSeed[];
};

const RATE = 0.9;

export const a2ListeningContent: Record<number, ListeningLessonSeed> = {
  1: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: which platform do you hear?",
        data: {
          tts: "Le train pour Québec part voie cinq.",
          rate: RATE,
          options: ["Voie deux", "Voie trois", "Voie cinq", "Voie sept"],
          correctIndex: 2,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Nous avons pris le train à la gare.",
          rate: RATE,
          translation: "We took the train at the station.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Je vais aller à Montréal la semaine prochaine.",
          rate: RATE,
          template: "Je vais aller à Montréal la semaine ___.",
          answer: "prochaine",
          hint: "Next (week).",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: when did the trip happen?",
        data: {
          tts: "Le week-end dernier, je suis allé à Québec.",
          rate: RATE,
          options: ["Next weekend", "This morning", "Last weekend", "Tonight"],
          correctIndex: 2,
        },
      },
    ],
  },
  2: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what time does she take the métro?",
        data: {
          tts: "Tous les matins, je prends le métro à huit heures.",
          rate: RATE,
          options: ["7:00", "8:00", "9:00", "12:00"],
          correctIndex: 1,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Mes collègues sont très sympas.",
          rate: RATE,
          translation: "My colleagues are very nice.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Le vendredi, je fais du télétravail.",
          rate: RATE,
          template: "Le vendredi, je fais du ___.",
          answer: "télétravail",
          hint: "Working from home.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what did they finish?",
        data: {
          tts: "Hier, nous avons fini un projet important.",
          rate: RATE,
          options: ["A meeting", "An email", "An important project", "The métro"],
          correctIndex: 2,
        },
      },
    ],
  },
  3: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what is the weather like?",
        data: {
          tts: "Aujourd'hui, il fait très froid.",
          rate: RATE,
          options: ["It's raining", "It's very cold", "It's hot", "It's windy"],
          correctIndex: 1,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "En hiver, il neige souvent.",
          rate: RATE,
          translation: "In winter, it often snows.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Demain, il va faire beau.",
          rate: RATE,
          template: "Demain, il va faire ___.",
          answer: "beau",
          hint: "Nice weather.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what happened in Quebec?",
        data: {
          tts: "Hier, il a neigé à Québec.",
          rate: RATE,
          options: ["It rained", "It was sunny", "It snowed", "It was windy"],
          correctIndex: 2,
        },
      },
    ],
  },
  4: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what sport do you hear?",
        data: {
          tts: "Le samedi matin, je cours dans le parc.",
          rate: RATE,
          options: ["Swimming", "Running", "Tennis", "Football"],
          correctIndex: 1,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Je joue de la guitare.",
          rate: RATE,
          translation: "I play the guitar.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Dimanche, j'ai visité un musée.",
          rate: RATE,
          template: "Dimanche, j'ai visité un ___.",
          answer: "musée",
          hint: "A place with art.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what will they start next week?",
        data: {
          tts: "La semaine prochaine, je vais commencer un cours de natation.",
          rate: RATE,
          options: ["Guitar lessons", "A French course", "Swimming lessons", "A new job"],
          correctIndex: 2,
        },
      },
    ],
  },
  5: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: which way do you turn?",
        data: {
          tts: "Sortez du métro et tournez à gauche.",
          rate: RATE,
          options: ["Right", "Left", "Straight on", "Back"],
          correctIndex: 1,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Continuez tout droit jusqu'au feu.",
          rate: RATE,
          translation: "Keep going straight until the traffic light.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "La bibliothèque est en face du parc.",
          rate: RATE,
          template: "La bibliothèque est en face du ___.",
          answer: "parc",
          hint: "A green place in the city.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: where is the library relative to the pharmacy?",
        data: {
          tts: "La bibliothèque est à côté de la pharmacie.",
          rate: RATE,
          options: ["Opposite the pharmacy", "Far from the pharmacy", "Next to the pharmacy", "Inside the pharmacy"],
          correctIndex: 2,
        },
      },
    ],
  },
  6: {
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: where did they arrive?",
        data: {
          tts: "Je suis arrivé à l'aéroport de Montréal.",
          rate: RATE,
          options: ["The train station", "The office", "Montreal airport", "The hotel"],
          correctIndex: 2,
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Ensuite, j'ai pris un taxi.",
          rate: RATE,
          translation: "Then I took a taxi.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Puis, nous avons mangé une poutine.",
          rate: RATE,
          template: "Puis, nous avons mangé une ___.",
          answer: "poutine",
          hint: "A Quebec dish.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: how did the speaker feel?",
        data: {
          tts: "J'étais fatigué, mais j'étais heureux.",
          rate: RATE,
          options: ["Angry and hungry", "Tired but happy", "Lost and cold", "Late but calm"],
          correctIndex: 1,
        },
      },
    ],
  },
};
