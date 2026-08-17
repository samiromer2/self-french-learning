import { ExerciseType } from "../../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type SpeakingLessonSeed = {
  exercises: ExerciseSeed[];
};

const RATE = 0.9;

export const a2SpeakingContent: Record<number, SpeakingLessonSeed> = {
  1: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Le week-end dernier, je suis allé à Québec.",
          translation: "Last weekend, I went to Quebec.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — practice the near future.",
        data: {
          mode: "repeat",
          text: "La semaine prochaine, je vais aller à Montréal.",
          translation: "Next week, I'm going to go to Montreal.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "Nous avons visité le Vieux-Québec et nous avons mangé dans un petit restaurant.",
          translation: "We visited Old Quebec and we ate in a small restaurant.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Où êtes-vous allé le week-end dernier ?",
          text: "Je suis allé à Québec.",
          translation: "I went to Quebec.",
          rate: RATE,
        },
      },
    ],
  },
  2: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Je travaille dans un bureau à Montréal.",
          translation: "I work in an office in Montreal.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — remote work.",
        data: {
          mode: "repeat",
          text: "Le vendredi, je fais du télétravail.",
          translation: "On Friday, I work from home.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "Hier, nous avons fini un projet important avec mes collègues.",
          translation: "Yesterday, we finished an important project with my colleagues.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Vous travaillez où ?",
          text: "Je travaille dans un bureau à Montréal.",
          translation: "I work in an office in Montreal.",
          rate: RATE,
        },
      },
    ],
  },
  3: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Aujourd'hui, il fait très froid.",
          translation: "Today, it's very cold.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — winter clothes.",
        data: {
          mode: "repeat",
          text: "Je mets un manteau, une écharpe et des bottes.",
          translation: "I put on a coat, a scarf, and boots.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "Demain, il va faire beau, mais hier il a neigé à Québec.",
          translation: "Tomorrow it will be nice out, but yesterday it snowed in Quebec.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Quel temps fait-il aujourd'hui ?",
          text: "Il fait froid.",
          translation: "It's cold.",
          rate: RATE,
        },
      },
    ],
  },
  4: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Le samedi, je fais du sport.",
          translation: "On Saturday, I play sports / I work out.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — an instrument.",
        data: {
          mode: "repeat",
          text: "Je joue de la guitare.",
          translation: "I play the guitar.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "Dimanche, j'ai visité un musée avec ma cousine.",
          translation: "On Sunday, I visited a museum with my cousin.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Qu'est-ce que tu aimes faire le week-end ?",
          text: "J'aime faire du sport et voir des amis.",
          translation: "I like to work out and see friends.",
          rate: RATE,
        },
      },
    ],
  },
  5: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Excusez-moi, pour aller à la bibliothèque ?",
          translation: "Excuse me, how do I get to the library?",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — a direction.",
        data: {
          mode: "repeat",
          text: "Tournez à gauche et continuez tout droit.",
          translation: "Turn left and keep going straight.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "La bibliothèque est en face du parc, à côté de la pharmacie.",
          translation: "The library is opposite the park, next to the pharmacy.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Pour aller à la pharmacie ?",
          text: "Tournez à droite et continuez tout droit.",
          translation: "Turn right and keep going straight.",
          rate: RATE,
        },
      },
    ],
  },
  6: {
    exercises: [
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat after the speaker.",
        data: {
          mode: "repeat",
          text: "Je suis arrivé à l'aéroport de Montréal.",
          translation: "I arrived at Montreal airport.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Repeat — the next step in the story.",
        data: {
          mode: "repeat",
          text: "Ensuite, j'ai pris un taxi.",
          translation: "Then I took a taxi.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Shadow this longer sentence.",
        data: {
          mode: "repeat",
          text: "Puis, nous avons mangé une poutine. Enfin, je me suis couché tôt.",
          translation: "Then we ate poutine. Finally, I went to bed early.",
          rate: RATE,
        },
      },
      {
        type: ExerciseType.SPEAKING_PROMPT,
        prompt: "Answer the question aloud in French.",
        data: {
          mode: "answer",
          question: "Comment c'était, le premier jour ?",
          text: "C'était bien. J'étais fatigué, mais j'étais heureux.",
          translation: "It was good. I was tired, but I was happy.",
          rate: RATE,
        },
      },
    ],
  },
};
