import { ExerciseType } from "../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type ListeningLessonSeed = {
  exercises: ExerciseSeed[];
};

// Keyed by unit order — each unit's LISTENING lesson gets these exercises.
// All audio is browser TTS (fr-FR); rate 0.8 = slow A1 speech per the
// master plan's difficulty progression.
const RATE = 0.8;

export const a1ListeningContent: Record<number, ListeningLessonSeed> = {
  1: {
    // Nationalities
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what nationality do you hear?",
        data: {
          tts: "Elle est espagnole.",
          rate: RATE,
          options: ["Espagnole", "Française", "Anglaise", "Italienne"],
          correctIndex: 0,
          explanation: "« Elle est espagnole » — she is Spanish.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type exactly what you hear.",
        data: {
          text: "Je suis marocain.",
          rate: RATE,
          translation: "I am Moroccan.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing word.",
        data: {
          tts: "Mon ami est canadien.",
          rate: RATE,
          template: "Mon ami est ___.",
          answer: "canadien",
          hint: "Listen for the nationality.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen to the story: where is Sofia from?",
        data: {
          tts: "Sofia est italienne. Elle habite à Paris avec son ami français.",
          rate: RATE,
          options: ["Italy", "France", "Spain", "Canada"],
          correctIndex: 0,
          explanation: "« Sofia est italienne » — Sofia is Italian.",
        },
      },
    ],
  },
  2: {
    // Pronunciation basics
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: which word do you hear?",
        data: {
          tts: "Bonjour.",
          rate: RATE,
          options: ["Bonsoir", "Bonjour", "Bonbon", "Bon appétit"],
          correctIndex: 1,
          explanation: "You heard « bonjour » — hello.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type what you hear — mind the accents!",
        data: {
          text: "Le café est très chaud.",
          rate: RATE,
          translation: "The coffee is very hot.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and complete with the missing word.",
        data: {
          tts: "Merci beaucoup, madame.",
          rate: RATE,
          template: "Merci ___, madame.",
          answer: "beaucoup",
          hint: "It means 'a lot'.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: is the speaker greeting or leaving?",
        data: {
          tts: "Au revoir, à demain !",
          rate: RATE,
          options: ["Greeting someone", "Leaving", "Ordering food", "Asking a question"],
          correctIndex: 1,
          explanation: "« Au revoir, à demain » — goodbye, see you tomorrow.",
        },
      },
    ],
  },
  3: {
    // Clock
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what time is it?",
        data: {
          tts: "Il est trois heures et demie.",
          rate: RATE,
          options: ["3:00", "3:15", "3:30", "3:45"],
          correctIndex: 2,
          explanation: "« et demie » = half past — 3:30.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type the time you hear.",
        data: {
          text: "Il est huit heures.",
          rate: RATE,
          translation: "It is eight o'clock.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the missing number.",
        data: {
          tts: "Le train part à dix heures.",
          rate: RATE,
          template: "Le train part à ___ heures.",
          answer: "dix",
          hint: "A number between neuf and onze.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen to the story: when does the film start?",
        data: {
          tts: "Le film commence à sept heures. Nous dînons à six heures avant le film.",
          rate: RATE,
          options: ["6:00", "6:30", "7:00", "8:00"],
          correctIndex: 2,
          explanation: "« Le film commence à sept heures » — 7:00.",
        },
      },
    ],
  },
  4: {
    // Age
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: how old is the speaker?",
        data: {
          tts: "J'ai vingt-cinq ans.",
          rate: RATE,
          options: ["15", "20", "25", "35"],
          correctIndex: 2,
          explanation: "« vingt-cinq ans » — 25 years old.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type what you hear.",
        data: {
          text: "Ma fille a sept ans.",
          rate: RATE,
          translation: "My daughter is seven years old.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the age you hear.",
        data: {
          tts: "Mon grand-père a soixante ans.",
          rate: RATE,
          template: "Mon grand-père a ___ ans.",
          answer: "soixante",
          hint: "60, as a French word.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen to the story: who is the oldest?",
        data: {
          tts: "Paul a dix ans. Sa sœur Marie a quinze ans. Leur frère Luc a huit ans.",
          rate: RATE,
          options: ["Paul", "Marie", "Luc", "They are the same age"],
          correctIndex: 1,
          explanation: "Marie has 15 years — the oldest of the three.",
        },
      },
    ],
  },
  5: {
    // Shopping dialogue
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: what does the customer want?",
        data: {
          tts: "Bonjour, je voudrais un kilo de tomates, s'il vous plaît.",
          rate: RATE,
          options: ["Potatoes", "Tomatoes", "Apples", "Oranges"],
          correctIndex: 1,
          explanation: "« un kilo de tomates » — a kilo of tomatoes.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type the price you hear.",
        data: {
          text: "Ça coûte deux euros.",
          rate: RATE,
          translation: "It costs two euros.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in what the customer buys.",
        data: {
          tts: "Je prends une baguette et du fromage.",
          rate: RATE,
          template: "Je prends une baguette et du ___.",
          answer: "fromage",
          hint: "A dairy product.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen to the dialogue: how much does it cost in total?",
        data: {
          tts: "Alors, une baguette, un euro. Deux croissants, deux euros. Ça fait trois euros au total.",
          rate: RATE,
          options: ["Two euros", "Three euros", "Four euros", "Five euros"],
          correctIndex: 1,
          explanation: "« Ça fait trois euros au total » — three euros total.",
        },
      },
    ],
  },
  6: {
    // Days
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen: which day do you hear?",
        data: {
          tts: "Aujourd'hui, c'est mercredi.",
          rate: RATE,
          options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
          correctIndex: 2,
          explanation: "« mercredi » — Wednesday.",
        },
      },
      {
        type: ExerciseType.DICTATION,
        prompt: "Listen and type what you hear.",
        data: {
          text: "Le samedi, je ne travaille pas.",
          rate: RATE,
          translation: "On Saturdays, I don't work.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Listen and fill in the day.",
        data: {
          tts: "Nous partons dimanche matin.",
          rate: RATE,
          template: "Nous partons ___ matin.",
          answer: "dimanche",
          hint: "The last day of the weekend.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Listen to the story: when is the party?",
        data: {
          tts: "La fête est vendredi soir. Jeudi, nous préparons le gâteau.",
          rate: RATE,
          options: ["Thursday evening", "Friday evening", "Saturday evening", "Sunday morning"],
          correctIndex: 1,
          explanation: "« La fête est vendredi soir » — Friday evening.",
        },
      },
    ],
  },
};
