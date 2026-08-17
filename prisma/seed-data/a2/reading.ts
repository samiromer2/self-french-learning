import { ExerciseType } from "../../../lib/generated/prisma/client";

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

export const a2ReadingContent: Record<number, ReadingLessonSeed> = {
  1: {
    passage: {
      title: "Un week-end à Québec",
      text: "Le week-end dernier, je suis allé à Québec avec ma sœur. Nous avons pris le train à la gare. Le voyage a duré trois heures. À l'hôtel, nous avons déposé nos valises. L'après-midi, nous avons visité le Vieux-Québec. Le soir, nous avons mangé dans un petit restaurant. J'ai adoré cette ville. La semaine prochaine, je vais aller à Montréal.",
    },
    vocabulary: [
      { word: "voyage", translation: "trip / journey", exampleSentence: "Le voyage a duré trois heures." },
      { word: "gare", translation: "train station", exampleSentence: "Nous avons pris le train à la gare." },
      { word: "valise", translation: "suitcase", exampleSentence: "Nous avons déposé nos valises." },
      { word: "visiter", translation: "to visit (a place)", exampleSentence: "Nous avons visité le Vieux-Québec." },
      { word: "week-end", translation: "weekend", exampleSentence: "Le week-end dernier, je suis allé à Québec." },
      { word: "hôtel", translation: "hotel", exampleSentence: "À l'hôtel, nous avons déposé nos valises." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Where did they go last weekend?",
        data: {
          options: ["Montréal", "Québec", "Ottawa", "Paris"],
          correctIndex: 1,
          explanation: "« je suis allé à Québec » — the Montréal trip is next week.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "« Je vais aller à Montréal » is talking about…",
        data: {
          options: ["Last weekend", "Right now", "A future plan", "A habit"],
          correctIndex: 2,
          explanation: "« je vais + infinitive » is the near future (futur proche).",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete with the passé composé of visiter.",
        data: {
          template: "Nous ___ visité le Vieux-Québec.",
          answer: "avons",
          hint: "The helper verb with most verbs is avoir.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Say that you went to Quebec.",
        data: {
          words: ["Je", "suis", "allé", "à", "Québec"],
          translation: "I went to Quebec.",
        },
      },
    ],
  },
  2: {
    passage: {
      title: "Une journée au bureau",
      text: "Je m'appelle Léa et je travaille dans un bureau à Montréal. Je suis arrivée au Canada l'année dernière. Tous les matins, je prends le métro à huit heures. Au bureau, je réponds aux e-mails et je participe à des réunions. Mes collègues sont très sympas. Hier, nous avons fini un projet important. Le vendredi, je fais du télétravail. J'aime mon travail, mais je suis un peu fatiguée le soir.",
    },
    vocabulary: [
      { word: "bureau", translation: "office / desk", exampleSentence: "Je travaille dans un bureau à Montréal." },
      { word: "collègue", translation: "colleague", exampleSentence: "Mes collègues sont très sympas." },
      { word: "réunion", translation: "meeting", exampleSentence: "Je participe à des réunions." },
      { word: "télétravail", translation: "remote work", exampleSentence: "Le vendredi, je fais du télétravail." },
      { word: "projet", translation: "project", exampleSentence: "Hier, nous avons fini un projet important." },
      { word: "métro", translation: "subway", exampleSentence: "Je prends le métro à huit heures." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Where does Léa work?",
        data: {
          options: ["In a hospital in Québec", "In an office in Montréal", "At home every day", "At the train station"],
          correctIndex: 1,
          explanation: "« je travaille dans un bureau à Montréal ».",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "What did they do yesterday?",
        data: {
          options: ["They started a new job", "They took the métro", "They finished an important project", "They went on holiday"],
          correctIndex: 2,
          explanation: "« Hier, nous avons fini un projet important » — passé composé.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete with the present of travailler.",
        data: {
          template: "Léa ___ dans un bureau.",
          answer: "travaille",
          hint: "elle + travailler.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Say that you work from home on Friday.",
        data: {
          words: ["Le", "vendredi,", "je", "fais", "du", "télétravail"],
          translation: "On Friday, I work remotely.",
        },
      },
    ],
  },
  3: {
    passage: {
      title: "Quel temps fait-il ?",
      text: "Au Canada, les saisons sont très différentes. En hiver, il fait très froid et il neige souvent. Je mets un manteau, une écharpe et des bottes. Au printemps, il pleut et les arbres deviennent verts. L'été, il fait chaud : on va au parc ou au lac. Hier, il a neigé à Québec, même au mois d'avril ! Demain, il va faire beau. J'adore l'automne, parce que les feuilles sont rouges et oranges.",
    },
    vocabulary: [
      { word: "saison", translation: "season", exampleSentence: "Au Canada, les saisons sont très différentes." },
      { word: "neiger", translation: "to snow", exampleSentence: "En hiver, il neige souvent." },
      { word: "manteau", translation: "coat", exampleSentence: "Je mets un manteau." },
      { word: "écharpe", translation: "scarf", exampleSentence: "Je mets une écharpe et des bottes." },
      { word: "pleuvoir", translation: "to rain", exampleSentence: "Au printemps, il pleut." },
      { word: "automne", translation: "autumn / fall", exampleSentence: "J'adore l'automne." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "In winter in this text, it is…",
        data: {
          options: ["Hot and rainy", "Very cold and often snowy", "Always sunny", "Windy but warm"],
          correctIndex: 1,
          explanation: "« il fait très froid et il neige souvent ».",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "« Demain, il va faire beau » talks about…",
        data: {
          options: ["Yesterday", "A habit every winter", "Tomorrow's weather", "Last April"],
          correctIndex: 2,
          explanation: "« il va + infinitive » is the near future.",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the classic weather pattern.",
        data: {
          template: "En hiver, il ___ très froid.",
          answer: "fait",
          hint: "il fait + adjective (froid, chaud, beau).",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Say that it snowed yesterday.",
        data: {
          words: ["Hier,", "il", "a", "neigé"],
          translation: "Yesterday, it snowed.",
        },
      },
    ],
  },
  4: {
    passage: {
      title: "Le week-end",
      text: "Le week-end, j'ai du temps libre. Le samedi matin, je fais du sport : je cours dans le parc. L'après-midi, je joue de la guitare. Le soir, je vois des amis ou je regarde un film. Dimanche, j'ai visité un musée avec ma cousine. Nous avons beaucoup ri. La semaine prochaine, je vais commencer un cours de natation. Et toi, qu'est-ce que tu aimes faire ?",
    },
    vocabulary: [
      { word: "temps libre", translation: "free time", exampleSentence: "Le week-end, j'ai du temps libre." },
      { word: "sport", translation: "sport", exampleSentence: "Le samedi matin, je fais du sport." },
      { word: "jouer de", translation: "to play (an instrument)", exampleSentence: "Je joue de la guitare." },
      { word: "musée", translation: "museum", exampleSentence: "J'ai visité un musée avec ma cousine." },
      { word: "natation", translation: "swimming", exampleSentence: "Je vais commencer un cours de natation." },
      { word: "cousine", translation: "cousin (female)", exampleSentence: "J'ai visité un musée avec ma cousine." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "What does the narrator play?",
        data: {
          options: ["Football", "The piano", "The guitar", "Video games"],
          correctIndex: 2,
          explanation: "« je joue de la guitare » — jouer de + instrument.",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "Last Sunday they…",
        data: {
          options: ["Started swimming lessons", "Visited a museum", "Ran a marathon", "Stayed home all day"],
          correctIndex: 1,
          explanation: "« Dimanche, j'ai visité un musée ».",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete with the verb for doing sport.",
        data: {
          template: "Le samedi, je ___ du sport.",
          answer: "fais",
          hint: "je + faire.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Say that you play guitar.",
        data: {
          words: ["Je", "joue", "de", "la", "guitare"],
          translation: "I play the guitar.",
        },
      },
    ],
  },
  5: {
    passage: {
      title: "Pour aller à la bibliothèque",
      text: "Excusez-moi, pour aller à la bibliothèque, s'il vous plaît ? C'est facile. Sortez du métro et tournez à gauche. Continuez tout droit jusqu'au feu. Au coin de la rue Saint-Denis, tournez à droite. La bibliothèque est en face du parc, à côté de la pharmacie. Hier, je n'ai pas trouvé la rue, alors j'ai demandé à une dame. Elle a été très gentille. Demain, je vais aller au musée : c'est au bout de cette rue.",
    },
    vocabulary: [
      { word: "gauche", translation: "left", exampleSentence: "Tournez à gauche." },
      { word: "droite", translation: "right", exampleSentence: "Tournez à droite." },
      { word: "tout droit", translation: "straight ahead", exampleSentence: "Continuez tout droit jusqu'au feu." },
      { word: "coin", translation: "corner", exampleSentence: "Au coin de la rue Saint-Denis, tournez à droite." },
      { word: "en face", translation: "opposite / across from", exampleSentence: "La bibliothèque est en face du parc." },
      { word: "feu", translation: "traffic light", exampleSentence: "Continuez tout droit jusqu'au feu." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "After leaving the métro, you should…",
        data: {
          options: ["Turn right", "Turn left", "Take a taxi", "Go back inside"],
          correctIndex: 1,
          explanation: "« Sortez du métro et tournez à gauche ».",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "The library is…",
        data: {
          options: ["Behind the pharmacy", "Inside the métro", "Opposite the park, next to the pharmacy", "At the airport"],
          correctIndex: 2,
          explanation: "« en face du parc, à côté de la pharmacie ».",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the direction.",
        data: {
          template: "Continuez tout ___ jusqu'au feu.",
          answer: "droit",
          hint: "tout droit = straight ahead.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Tell someone to turn right.",
        data: {
          words: ["Tournez", "à", "droite"],
          translation: "Turn right.",
        },
      },
    ],
  },
  6: {
    passage: {
      title: "Le premier jour au Canada",
      text: "Le premier jour au Canada, je suis arrivé à l'aéroport de Montréal. D'abord, j'ai cherché mes valises. Ensuite, j'ai pris un taxi. Le chauffeur était patient, parce que je parlais lentement. Puis, nous avons mangé une poutine. Enfin, je me suis couché tôt. J'étais fatigué, mais j'étais heureux. C'était le début d'une nouvelle vie.",
    },
    vocabulary: [
      { word: "d'abord", translation: "first / first of all", exampleSentence: "D'abord, j'ai cherché mes valises." },
      { word: "ensuite", translation: "then / next", exampleSentence: "Ensuite, j'ai pris un taxi." },
      { word: "puis", translation: "then", exampleSentence: "Puis, nous avons mangé une poutine." },
      { word: "enfin", translation: "finally", exampleSentence: "Enfin, je me suis couché tôt." },
      { word: "aéroport", translation: "airport", exampleSentence: "Je suis arrivé à l'aéroport de Montréal." },
      { word: "poutine", translation: "poutine (fries, cheese curds, gravy)", exampleSentence: "Nous avons mangé une poutine." },
    ],
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "What did they do after looking for the bags?",
        data: {
          options: ["They went to bed", "They took a taxi", "They visited a museum", "They started work"],
          correctIndex: 1,
          explanation: "« Ensuite, j'ai pris un taxi ».",
        },
      },
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        prompt: "« Le chauffeur était patient » uses imparfait because it…",
        data: {
          options: ["Names a single finished action", "Describes how things were", "Talks about tomorrow", "Is a question"],
          correctIndex: 1,
          explanation: "Imparfait paints the background (was patient). Passé composé tells the events (j'ai pris, nous avons mangé).",
        },
      },
      {
        type: ExerciseType.FILL_BLANK,
        prompt: "Complete the first action.",
        data: {
          template: "D'abord, j'ai ___ mes valises.",
          answer: "cherché",
          hint: "Past participle of chercher.",
        },
      },
      {
        type: ExerciseType.SENTENCE_ORDER,
        prompt: "Say that you arrived at the airport.",
        data: {
          words: ["Je", "suis", "arrivé", "à", "l'aéroport"],
          translation: "I arrived at the airport.",
        },
      },
    ],
  },
};
