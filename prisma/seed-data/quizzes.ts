import { ExerciseType } from "../../lib/generated/prisma/client";

export type QuizQuestionSeed = {
  prompt: string;
  data: Record<string, unknown> & { type: ExerciseType };
};

export type UnitQuizSeed = {
  title: string;
  questions: QuizQuestionSeed[];
};

const RATE = 0.8;

export const a1UnitQuizzes: UnitQuizSeed[] = [
  {
    title: "Unit 1 quiz — Greetings",
    questions: [
      {
        prompt: "What does « Bonjour » mean?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["Good evening", "Hello / good morning", "Thank you", "Goodbye"],
          correctIndex: 1,
          explanation: "Bonjour is the standard daytime greeting.",
        },
      },
      {
        prompt: "How do you say « My name is… »?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["Je suis…", "J'habite…", "Je m'appelle…", "J'ai…"],
          correctIndex: 2,
        },
      },
      {
        prompt: "Listen and choose what you hear.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Bonsoir, ça va bien, merci.",
          rate: RATE,
          options: [
            "Bonjour, ça va ?",
            "Bonsoir, ça va bien, merci.",
            "Au revoir, à demain.",
            "Salut, je m'appelle Marie.",
          ],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the informal greeting.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Salut !",
          rate: RATE,
          options: ["Bonjour", "Bonsoir", "Au revoir", "Salut"],
          correctIndex: 3,
        },
      },
      {
        prompt: "Complete the sentence.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Je ___ Marie.",
          answer: "m'appelle",
          hint: "to be named",
        },
      },
      {
        prompt: "Complete the goodbye.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Au ___, à demain !",
          answer: "revoir",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["Je", "m'appelle", "Thomas", "."],
          translation: "My name is Thomas.",
        },
      },
    ],
  },
  {
    title: "Unit 2 quiz — Alphabet",
    questions: [
      {
        prompt: "Which letter has a cedilla in French?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["é", "ç", "ô", "ï"],
          correctIndex: 1,
          explanation: "Ç (c cédille) is pronounced like s, as in français.",
        },
      },
      {
        prompt: "The accent on « café » is…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["un accent grave (è)", "un accent aigu (é)", "un circonflexe (ê)", "un tréma (ë)"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the letter you hear.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "J",
          rate: RATE,
          options: ["G", "J", "I", "Z"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the word.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "français",
          rate: RATE,
          options: ["france", "français", "franc", "françaises"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Complete with the accented letter.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "caf___",
          answer: "é",
          hint: "accent aigu",
        },
      },
      {
        prompt: "How do you write the French word for ‘French’ (masculine)?",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "___",
          answer: "français",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["L'alphabet", "français", "a", "vingt-six", "lettres", "."],
          translation: "The French alphabet has twenty-six letters.",
        },
      },
    ],
  },
  {
    title: "Unit 3 quiz — Numbers and time",
    questions: [
      {
        prompt: "What number is « quinze »?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["5", "12", "15", "50"],
          correctIndex: 2,
        },
      },
      {
        prompt: "« Il est trois heures et demie » means…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["It is 3:00", "It is 3:15", "It is 3:30", "It is 2:30"],
          correctIndex: 2,
        },
      },
      {
        prompt: "Listen and choose the number.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "soixante-dix",
          rate: RATE,
          options: ["17", "60", "70", "16"],
          correctIndex: 2,
        },
      },
      {
        prompt: "Listen and choose the time.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Il est huit heures.",
          rate: RATE,
          options: ["Il est deux heures.", "Il est huit heures.", "Il est dix heures.", "Il est onze heures."],
          correctIndex: 1,
        },
      },
      {
        prompt: "Complete the weekday after Sunday.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Après dimanche, on est ___.",
          answer: "lundi",
          hint: "Monday",
        },
      },
      {
        prompt: "How do you ask ‘What time is it?’",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Quelle ___ est-il ?",
          answer: "heure",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["Il", "est", "midi", "."],
          translation: "It is noon.",
        },
      },
    ],
  },
  {
    title: "Unit 4 quiz — Family",
    questions: [
      {
        prompt: "« La sœur » means…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["the brother", "the mother", "the sister", "the father"],
          correctIndex: 2,
        },
      },
      {
        prompt: "How do you say ‘I am 30 years old’?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["J'ai trente ans.", "Je suis trente.", "J'ai trente années.", "Je suis vieux."],
          correctIndex: 0,
        },
      },
      {
        prompt: "Listen and choose who is mentioned.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Voici mon père.",
          rate: RATE,
          options: ["ma mère", "mon père", "ma sœur", "mon frère"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the description.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Elle est petite et sympa.",
          rate: RATE,
          options: [
            "Il est grand et sympa.",
            "Elle est petite et sympa.",
            "Elle est grande et fatiguée.",
            "Il est petit et triste.",
          ],
          correctIndex: 1,
        },
      },
      {
        prompt: "Complete with the family word.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Mon ___ s'appelle Ahmed.",
          answer: "père",
          hint: "father",
        },
      },
      {
        prompt: "Complete the age question.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Tu as quel ___ ?",
          answer: "âge",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["J'ai", "une", "sœur", "et", "un", "frère", "."],
          translation: "I have a sister and a brother.",
        },
      },
    ],
  },
  {
    title: "Unit 5 quiz — Food and shopping",
    questions: [
      {
        prompt: "« Je voudrais… » is used to…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["say thank you", "politely ask for something", "say goodbye", "count money"],
          correctIndex: 1,
        },
      },
      {
        prompt: "« L'addition, s'il vous plaît » means…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["The menu, please", "The bill, please", "Water, please", "A table, please"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose what is ordered.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Je voudrais du pain et du fromage.",
          rate: RATE,
          options: [
            "Je voudrais un café.",
            "Je voudrais du pain et du fromage.",
            "Je voudrais l'addition.",
            "C'est combien ?",
          ],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the question.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "C'est combien ?",
          rate: RATE,
          options: ["Ça coûte cher ?", "C'est combien ?", "Vous acceptez la carte ?", "Où est le marché ?"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Complete the order.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Je ___ un café, s'il vous plaît.",
          answer: "voudrais",
        },
      },
      {
        prompt: "Complete with a food word.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "J'aime le ___.",
          answer: "fromage",
          hint: "cheese",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["C'est", "combien", "?"],
          translation: "How much is it?",
        },
      },
    ],
  },
  {
    title: "Unit 6 quiz — Daily life",
    questions: [
      {
        prompt: "« Je me lève » means…",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["I go to bed", "I get up", "I eat lunch", "I work"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Which day comes after lundi?",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          options: ["dimanche", "mardi", "vendredi", "samedi"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the routine.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "Le matin, je travaille.",
          rate: RATE,
          options: [
            "Le soir, je dîne.",
            "Le matin, je travaille.",
            "Le week-end, je dors.",
            "L'après-midi, je lis.",
          ],
          correctIndex: 1,
        },
      },
      {
        prompt: "Listen and choose the month.",
        data: {
          type: ExerciseType.MULTIPLE_CHOICE,
          tts: "juillet",
          rate: RATE,
          options: ["juin", "juillet", "janvier", "décembre"],
          correctIndex: 1,
        },
      },
      {
        prompt: "Complete the routine.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Le soir, je ___.",
          answer: "dîne",
          hint: "I have dinner",
        },
      },
      {
        prompt: "Complete with a day.",
        data: {
          type: ExerciseType.FILL_BLANK,
          template: "Le ___ je ne travaille pas.",
          answer: "dimanche",
        },
      },
      {
        prompt: "Put the sentence in order.",
        data: {
          type: ExerciseType.SENTENCE_ORDER,
          words: ["Je", "me", "lève", "à", "sept", "heures", "."],
          translation: "I get up at seven o'clock.",
        },
      },
    ],
  },
];
