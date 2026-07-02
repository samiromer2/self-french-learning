import { ExerciseType } from "../../lib/generated/prisma/client";

type VocabSeed = {
  word: string;
  translation: string;
  exampleSentence?: string;
};

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type ReadingLessonSeed = {
  passage: { title: string; text: string };
  vocabulary: VocabSeed[];
  exercises: ExerciseSeed[];
};

// Keyed by unit order — each unit's READING lesson gets this content.
export const a1ReadingContent: Record<number, ReadingLessonSeed> = {
  1: {
    passage: {
      title: "Une rencontre au café",
      text: "Bonjour ! Je m'appelle Marie. Je suis française. Voici mon ami Thomas. Il est canadien. Nous sommes au café. « Salut Thomas, ça va ? » « Oui, ça va bien, merci. Et toi ? » « Très bien ! » Le soir, Marie dit : « Bonsoir ! » et Thomas répond : « Au revoir, à demain ! »",
    },
    vocabulary: [
      { word: "bonjour", translation: "hello / good morning", exampleSentence: "Bonjour, je m'appelle Marie." },
      { word: "salut", translation: "hi (informal)", exampleSentence: "Salut Thomas, ça va ?" },
      { word: "bonsoir", translation: "good evening", exampleSentence: "Le soir, Marie dit bonsoir." },
      { word: "au revoir", translation: "goodbye", exampleSentence: "Au revoir, à demain !" },
      { word: "merci", translation: "thank you", exampleSentence: "Ça va bien, merci." },
      { word: "ami", translation: "friend", exampleSentence: "Voici mon ami Thomas." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Comment s'appelle l'amie de Thomas ?",
        data: {
          options: ["Marie", "Sophie", "Claire", "Julie"],
          correctIndex: 0,
          explanation: "« Je m'appelle Marie » — her name is Marie.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Quelle est la nationalité de Thomas ?",
        data: {
          options: ["Français", "Canadien", "Belge", "Suisse"],
          correctIndex: 1,
          explanation: "« Il est canadien » — Thomas is Canadian.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the greeting used in the evening.",
        data: {
          template: "Le soir, Marie dit : « ___ ! »",
          answer: "Bonsoir",
          hint: "The evening equivalent of bonjour.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order to introduce yourself.",
        data: {
          words: ["Je", "m'appelle", "Marie", "et", "je", "suis", "française"],
          translation: "My name is Marie and I am French.",
        },
      },
    ],
  },
  2: {
    passage: {
      title: "L'alphabet français",
      text: "L'alphabet français a vingt-six lettres, comme l'alphabet anglais. Mais attention : la prononciation est différente ! La lettre « e » se dit « euh ». La lettre « j » se dit « ji ». Le français utilise aussi des accents : é, è, ê et ç. Le « ç » s'appelle la cédille, comme dans le mot « français ».",
    },
    vocabulary: [
      { word: "lettre", translation: "letter", exampleSentence: "La lettre « e » se dit « euh »." },
      { word: "vingt-six", translation: "twenty-six", exampleSentence: "L'alphabet français a vingt-six lettres." },
      { word: "prononciation", translation: "pronunciation", exampleSentence: "La prononciation est différente." },
      { word: "cédille", translation: "cedilla (ç)", exampleSentence: "Le « ç » s'appelle la cédille." },
      { word: "mot", translation: "word", exampleSentence: "Comme dans le mot « français »." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Combien de lettres a l'alphabet français ?",
        data: {
          options: ["24", "25", "26", "27"],
          correctIndex: 2,
          explanation: "« vingt-six lettres » — twenty-six letters.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Comment s'appelle le symbole « ç » ?",
        data: {
          options: ["L'accent aigu", "La cédille", "L'accent grave", "Le tréma"],
          correctIndex: 1,
          explanation: "« Le ç s'appelle la cédille. »",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the sentence about the alphabet.",
        data: {
          template: "L'alphabet français a ___ lettres.",
          answer: "vingt-six",
          hint: "26 in French, with a hyphen.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order.",
        data: {
          words: ["La", "prononciation", "est", "différente"],
          translation: "The pronunciation is different.",
        },
      },
    ],
  },
  3: {
    passage: {
      title: "Les nombres au marché",
      text: "Au marché, Paul compte : un, deux, trois, quatre, cinq pommes ! Le vendeur dit : « Cinq pommes, ça fait trois euros. » Paul donne dix euros. Le vendeur rend sept euros. Paul a aussi vingt oranges à la maison et cent questions pour son professeur de français !",
    },
    vocabulary: [
      { word: "cinq", translation: "five", exampleSentence: "Cinq pommes, s'il vous plaît." },
      { word: "dix", translation: "ten", exampleSentence: "Paul donne dix euros." },
      { word: "vingt", translation: "twenty", exampleSentence: "Paul a vingt oranges." },
      { word: "cent", translation: "one hundred", exampleSentence: "Cent questions pour le professeur." },
      { word: "compter", translation: "to count", exampleSentence: "Paul compte les pommes." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Combien de pommes Paul achète-t-il ?",
        data: {
          options: ["Trois", "Cinq", "Sept", "Dix"],
          correctIndex: 1,
          explanation: "« un, deux, trois, quatre, cinq pommes ! »",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Combien coûtent les pommes ?",
        data: {
          options: ["Trois euros", "Cinq euros", "Sept euros", "Dix euros"],
          correctIndex: 0,
          explanation: "« Cinq pommes, ça fait trois euros. »",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete with the right number (as a word).",
        data: {
          template: "Paul donne dix euros et le vendeur rend ___ euros.",
          answer: "sept",
          hint: "10 − 3 = ?",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order.",
        data: {
          words: ["Cinq", "pommes,", "ça", "fait", "trois", "euros"],
          translation: "Five apples, that's three euros.",
        },
      },
    ],
  },
  4: {
    passage: {
      title: "La famille de Léa",
      text: "Léa présente sa famille. « Voici ma mère, Anne, et mon père, Marc. J'ai un frère, Hugo. Il a douze ans. Ma sœur s'appelle Emma. Elle a huit ans. Mes grands-parents habitent à Lyon. J'adore ma famille ! »",
    },
    vocabulary: [
      { word: "mère", translation: "mother", exampleSentence: "Voici ma mère, Anne." },
      { word: "père", translation: "father", exampleSentence: "Mon père s'appelle Marc." },
      { word: "frère", translation: "brother", exampleSentence: "J'ai un frère, Hugo." },
      { word: "sœur", translation: "sister", exampleSentence: "Ma sœur s'appelle Emma." },
      { word: "grands-parents", translation: "grandparents", exampleSentence: "Mes grands-parents habitent à Lyon." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Comment s'appelle le frère de Léa ?",
        data: {
          options: ["Marc", "Hugo", "Emma", "Paul"],
          correctIndex: 1,
          explanation: "« J'ai un frère, Hugo. »",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Quel âge a Emma ?",
        data: {
          options: ["Six ans", "Huit ans", "Dix ans", "Douze ans"],
          correctIndex: 1,
          explanation: "« Elle a huit ans. »",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the sentence about Léa's family.",
        data: {
          template: "Mes grands-parents habitent à ___.",
          answer: "Lyon",
          hint: "A big French city.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order.",
        data: {
          words: ["Ma", "sœur", "s'appelle", "Emma"],
          translation: "My sister's name is Emma.",
        },
      },
    ],
  },
  5: {
    passage: {
      title: "À la boulangerie",
      text: "Le matin, Nadia va à la boulangerie. « Bonjour ! Je voudrais une baguette et deux croissants, s'il vous plaît. » La boulangère répond : « Bien sûr ! Ça fait quatre euros cinquante. » Nadia paie et dit : « Merci, bonne journée ! » Elle achète aussi du fromage et du lait au supermarché.",
    },
    vocabulary: [
      { word: "boulangerie", translation: "bakery", exampleSentence: "Nadia va à la boulangerie." },
      { word: "baguette", translation: "baguette (bread)", exampleSentence: "Je voudrais une baguette." },
      { word: "je voudrais", translation: "I would like", exampleSentence: "Je voudrais deux croissants." },
      { word: "fromage", translation: "cheese", exampleSentence: "Elle achète du fromage." },
      { word: "lait", translation: "milk", exampleSentence: "Elle achète du lait." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Qu'est-ce que Nadia achète à la boulangerie ?",
        data: {
          options: [
            "Une baguette et deux croissants",
            "Du fromage et du lait",
            "Trois croissants",
            "Deux baguettes",
          ],
          correctIndex: 0,
          explanation: "« Je voudrais une baguette et deux croissants. »",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Combien paie Nadia ?",
        data: {
          options: ["Trois euros", "Quatre euros", "Quatre euros cinquante", "Cinq euros"],
          correctIndex: 2,
          explanation: "« Ça fait quatre euros cinquante. »",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the polite request.",
        data: {
          template: "Je ___ une baguette, s'il vous plaît.",
          answer: "voudrais",
          hint: "Polite form of « je veux ».",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order to make a polite request.",
        data: {
          words: ["Je", "voudrais", "deux", "croissants,", "s'il", "vous", "plaît"],
          translation: "I would like two croissants, please.",
        },
      },
    ],
  },
  6: {
    passage: {
      title: "La journée de Karim",
      text: "Karim se lève à sept heures. Il prend son petit-déjeuner : du pain et un café. À huit heures, il va au travail en bus. À midi, il déjeune avec ses collègues. Le soir, il rentre à la maison, il dîne à dix-neuf heures et il regarde la télévision. Il se couche à vingt-deux heures.",
    },
    vocabulary: [
      { word: "se lever", translation: "to get up", exampleSentence: "Karim se lève à sept heures." },
      { word: "petit-déjeuner", translation: "breakfast", exampleSentence: "Il prend son petit-déjeuner." },
      { word: "travail", translation: "work", exampleSentence: "Il va au travail en bus." },
      { word: "déjeuner", translation: "to have lunch", exampleSentence: "Il déjeune avec ses collègues." },
      { word: "se coucher", translation: "to go to bed", exampleSentence: "Il se couche à vingt-deux heures." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "À quelle heure Karim se lève-t-il ?",
        data: {
          options: ["À six heures", "À sept heures", "À huit heures", "À neuf heures"],
          correctIndex: 1,
          explanation: "« Karim se lève à sept heures. »",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Comment Karim va-t-il au travail ?",
        data: {
          options: ["En voiture", "À pied", "En bus", "En train"],
          correctIndex: 2,
          explanation: "« il va au travail en bus »",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the sentence about Karim's evening.",
        data: {
          template: "Le soir, il regarde la ___.",
          answer: "télévision",
          hint: "TV, in full.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Put the words in order.",
        data: {
          words: ["Karim", "se", "lève", "à", "sept", "heures"],
          translation: "Karim gets up at seven o'clock.",
        },
      },
    ],
  },
};
