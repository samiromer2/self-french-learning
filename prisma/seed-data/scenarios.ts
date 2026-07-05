import { ExerciseType, Skill } from "../../lib/generated/prisma/client";

type ExerciseSeed = {
  type: ExerciseType;
  prompt: string;
  data: Record<string, unknown>;
};

export type ScenarioSeed = {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  lesson: {
    title: string;
    skill: Skill;
    intro: string;
    pattern: { fr: string; en: string; examples: { fr: string; en: string }[] };
    dialogue: { speaker: string; fr: string; en: string }[];
    exercises: ExerciseSeed[];
  };
};

// Real-life scenario track — level-independent survival French.
// Format inspired by phrase-pattern teaching: one core pattern you can
// reuse, swap-in vocabulary, then a realistic dialogue.
const RATE = 0.85;

export const scenarios: ScenarioSeed[] = [
  {
    slug: "cafe",
    title: "At the Café",
    emoji: "☕",
    description: "Order like a local: coffee, croissants, and the bill.",
    lesson: {
      title: "Ordering at the café",
      skill: Skill.SPEAKING,
      intro: "The one pattern that orders everything: je voudrais…",
      pattern: {
        fr: "Je voudrais + [quelque chose], s'il vous plaît.",
        en: "I would like + [something], please.",
        examples: [
          { fr: "Je voudrais un café, s'il vous plaît.", en: "I'd like a coffee, please." },
          { fr: "Je voudrais un croissant, s'il vous plaît.", en: "I'd like a croissant, please." },
          { fr: "Je voudrais l'addition, s'il vous plaît.", en: "I'd like the bill, please." },
        ],
      },
      dialogue: [
        { speaker: "Serveur", fr: "Bonjour ! Qu'est-ce que je vous sers ?", en: "Hello! What can I get you?" },
        { speaker: "Vous", fr: "Bonjour, je voudrais un café et un croissant, s'il vous plaît.", en: "Hello, I'd like a coffee and a croissant, please." },
        { speaker: "Serveur", fr: "Sur place ou à emporter ?", en: "For here or to go?" },
        { speaker: "Vous", fr: "Sur place. Et l'addition, s'il vous plaît.", en: "For here. And the bill, please." },
        { speaker: "Serveur", fr: "Ça fait quatre euros cinquante.", en: "That's four euros fifty." },
        { speaker: "Vous", fr: "Voilà. Merci, bonne journée !", en: "Here you go. Thanks, have a good day!" },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "The waiter asks « Sur place ou à emporter ? » — what do they want to know?",
          data: {
            options: ["Cash or card?", "For here or to go?", "Small or large?", "Now or later?"],
            correctIndex: 1,
            explanation: "« Sur place » = for here, « à emporter » = to go.",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Order politely using the pattern.",
          data: {
            template: "Je ___ un café, s'il vous plaît.",
            answer: "voudrais",
            hint: "The polite 'I would like'.",
          },
        },
        {
          type: ExerciseType.SENTENCE_ORDER,
          prompt: "Ask for the bill.",
          data: {
            words: ["Je", "voudrais", "l'addition,", "s'il", "vous", "plaît"],
            translation: "I'd like the bill, please.",
          },
        },
        {
          type: ExerciseType.SPEAKING_PROMPT,
          prompt: "Your turn — order a coffee out loud.",
          data: { mode: "repeat", text: "Je voudrais un café, s'il vous plaît.", translation: "I'd like a coffee, please.", rate: RATE },
        },
      ],
    },
  },
  {
    slug: "grocery-store",
    title: "At the Grocery Store",
    emoji: "🛒",
    description: "Find what you need and ask for quantities.",
    lesson: {
      title: "Shopping for groceries",
      skill: Skill.SPEAKING,
      intro: "Ask where things are and how much you want: où est… / je prends…",
      pattern: {
        fr: "Où est / Où sont + [produit] ?",
        en: "Where is / Where are + [product]?",
        examples: [
          { fr: "Où est le lait ?", en: "Where is the milk?" },
          { fr: "Où sont les œufs ?", en: "Where are the eggs?" },
          { fr: "Je prends un kilo de pommes.", en: "I'll take a kilo of apples." },
        ],
      },
      dialogue: [
        { speaker: "Vous", fr: "Excusez-moi, où est le lait ?", en: "Excuse me, where is the milk?" },
        { speaker: "Employé", fr: "Au fond du magasin, rayon frais.", en: "At the back of the store, in the fresh section." },
        { speaker: "Vous", fr: "Merci ! Et je voudrais un kilo de pommes.", en: "Thanks! And I'd like a kilo of apples." },
        { speaker: "Employé", fr: "Les fruits sont à l'entrée, à gauche.", en: "The fruit is at the entrance, on the left." },
        { speaker: "Vous", fr: "Parfait, merci beaucoup !", en: "Perfect, thank you very much!" },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« Au fond du magasin » means…",
          data: {
            options: ["Next to the register", "At the back of the store", "On the top shelf", "Outside"],
            correctIndex: 1,
            explanation: "« le fond » = the back/bottom of a space.",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Ask where the eggs are (plural!).",
          data: {
            template: "Où ___ les œufs ?",
            answer: "sont",
            hint: "« est » for singular, « … » for plural.",
          },
        },
        {
          type: ExerciseType.DICTATION,
          prompt: "Listen and type what you hear.",
          data: { text: "Je prends un kilo de pommes.", rate: RATE, translation: "I'll take a kilo of apples." },
        },
        {
          type: ExerciseType.SPEAKING_PROMPT,
          prompt: "Ask where the milk is, out loud.",
          data: { mode: "repeat", text: "Excusez-moi, où est le lait ?", translation: "Excuse me, where is the milk?", rate: RATE },
        },
      ],
    },
  },
  {
    slug: "transportation",
    title: "Taking Transportation",
    emoji: "🚌",
    description: "Buy tickets and never miss your stop.",
    lesson: {
      title: "Bus, metro, and train",
      skill: Skill.SPEAKING,
      intro: "Buy a ticket and check the direction: un billet pour… / c'est bien le… ?",
      pattern: {
        fr: "Un billet pour + [destination], s'il vous plaît.",
        en: "A ticket to + [destination], please.",
        examples: [
          { fr: "Un billet pour Paris, s'il vous plaît.", en: "A ticket to Paris, please." },
          { fr: "Un aller-retour pour Lyon.", en: "A round trip to Lyon." },
          { fr: "C'est bien le bus pour la gare ?", en: "This is the right bus for the station, right?" },
        ],
      },
      dialogue: [
        { speaker: "Vous", fr: "Bonjour, un billet pour Marseille, s'il vous plaît.", en: "Hello, a ticket to Marseille, please." },
        { speaker: "Guichetier", fr: "Aller simple ou aller-retour ?", en: "One-way or round trip?" },
        { speaker: "Vous", fr: "Aller simple. Le train part à quelle heure ?", en: "One-way. What time does the train leave?" },
        { speaker: "Guichetier", fr: "À quatorze heures dix, voie trois.", en: "At 2:10 PM, platform three." },
        { speaker: "Vous", fr: "Merci ! C'est bien la voie trois, à droite ?", en: "Thanks! Platform three is to the right, correct?" },
        { speaker: "Guichetier", fr: "Oui, c'est ça. Bon voyage !", en: "Yes, that's right. Have a good trip!" },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« Un aller-retour » is…",
          data: {
            options: ["A one-way ticket", "A round-trip ticket", "A day pass", "A refund"],
            correctIndex: 1,
            explanation: "« aller » (going) + « retour » (return) = round trip.",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Ask what time the train leaves.",
          data: {
            template: "Le train ___ à quelle heure ?",
            answer: "part",
            hint: "From the verb « partir » (to leave).",
          },
        },
        {
          type: ExerciseType.DICTATION,
          prompt: "Listen and type the announcement.",
          data: { text: "Le train part à quatorze heures dix.", rate: RATE, translation: "The train leaves at 2:10 PM." },
        },
        {
          type: ExerciseType.SENTENCE_ORDER,
          prompt: "Buy your ticket.",
          data: {
            words: ["Un", "billet", "pour", "Marseille,", "s'il", "vous", "plaît"],
            translation: "A ticket to Marseille, please.",
          },
        },
      ],
    },
  },
  {
    slug: "doctor",
    title: "At the Doctor",
    emoji: "🏥",
    description: "Explain what hurts and understand the advice.",
    lesson: {
      title: "Seeing a doctor",
      skill: Skill.SPEAKING,
      intro: "Say what hurts with one pattern: j'ai mal à…",
      pattern: {
        fr: "J'ai mal à + [partie du corps].",
        en: "My + [body part] + hurts.",
        examples: [
          { fr: "J'ai mal à la tête.", en: "I have a headache." },
          { fr: "J'ai mal à la gorge.", en: "My throat hurts." },
          { fr: "J'ai mal au ventre.", en: "My stomach hurts." },
        ],
      },
      dialogue: [
        { speaker: "Médecin", fr: "Bonjour, qu'est-ce qui vous amène ?", en: "Hello, what brings you in?" },
        { speaker: "Vous", fr: "J'ai mal à la gorge depuis deux jours.", en: "My throat has been hurting for two days." },
        { speaker: "Médecin", fr: "Vous avez de la fièvre ?", en: "Do you have a fever?" },
        { speaker: "Vous", fr: "Un peu, trente-huit degrés hier soir.", en: "A little, 38 degrees last night." },
        { speaker: "Médecin", fr: "C'est une angine. Reposez-vous et buvez beaucoup d'eau.", en: "It's a throat infection. Rest and drink plenty of water." },
        { speaker: "Vous", fr: "D'accord, merci docteur.", en: "Okay, thank you, doctor." },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« J'ai mal au ventre » means…",
          data: {
            options: ["My head hurts", "My stomach hurts", "My back hurts", "My throat hurts"],
            correctIndex: 1,
            explanation: "« le ventre » = the stomach/belly. (à + le = au)",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Tell the doctor your head hurts.",
          data: {
            template: "J'ai ___ à la tête.",
            answer: "mal",
            hint: "The word for 'pain/ache'.",
          },
        },
        {
          type: ExerciseType.DICTATION,
          prompt: "Listen to the doctor's advice and type it.",
          data: { text: "Reposez-vous et buvez beaucoup d'eau.", rate: RATE, translation: "Rest and drink plenty of water." },
        },
        {
          type: ExerciseType.SPEAKING_PROMPT,
          prompt: "Tell the doctor your throat hurts.",
          data: { mode: "repeat", text: "J'ai mal à la gorge depuis deux jours.", translation: "My throat has been hurting for two days.", rate: RATE },
        },
      ],
    },
  },
  {
    slug: "job-interview",
    title: "Job Interview",
    emoji: "💼",
    description: "Present yourself and your experience with confidence.",
    lesson: {
      title: "The interview",
      skill: Skill.SPEAKING,
      intro: "Present your experience: je travaille comme… / j'ai de l'expérience en…",
      pattern: {
        fr: "Je travaille comme + [métier] depuis + [durée].",
        en: "I've been working as + [job] for + [duration].",
        examples: [
          { fr: "Je travaille comme développeur depuis trois ans.", en: "I've been working as a developer for three years." },
          { fr: "J'ai de l'expérience en gestion de projet.", en: "I have experience in project management." },
          { fr: "Je parle anglais et français.", en: "I speak English and French." },
        ],
      },
      dialogue: [
        { speaker: "Recruteuse", fr: "Parlez-moi de vous.", en: "Tell me about yourself." },
        { speaker: "Vous", fr: "Je travaille comme développeur depuis trois ans.", en: "I've been working as a developer for three years." },
        { speaker: "Recruteuse", fr: "Pourquoi voulez-vous ce poste ?", en: "Why do you want this position?" },
        { speaker: "Vous", fr: "Parce que j'aime les nouveaux défis et votre entreprise est innovante.", en: "Because I like new challenges and your company is innovative." },
        { speaker: "Recruteuse", fr: "Quelles sont vos disponibilités ?", en: "When are you available?" },
        { speaker: "Vous", fr: "Je suis disponible dès le mois prochain.", en: "I'm available starting next month." },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« Quelles sont vos disponibilités ? » — the recruiter is asking about…",
          data: {
            options: ["Your salary expectations", "Your availability", "Your diplomas", "Your references"],
            correctIndex: 1,
            explanation: "« disponibilités » = availability.",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Say how long you've worked as a developer.",
          data: {
            template: "Je travaille comme développeur ___ trois ans.",
            answer: "depuis",
            hint: "French uses this word + present tense for 'for/since'.",
          },
        },
        {
          type: ExerciseType.SENTENCE_ORDER,
          prompt: "Answer « Parlez-moi de vous ».",
          data: {
            words: ["Je", "travaille", "comme", "développeur", "depuis", "trois", "ans"],
            translation: "I've been working as a developer for three years.",
          },
        },
        {
          type: ExerciseType.SPEAKING_PROMPT,
          prompt: "The recruiter asks why you want the job — answer out loud.",
          data: { mode: "answer", question: "Pourquoi voulez-vous ce poste ?", text: "Parce que j'aime les nouveaux défis.", translation: "Because I like new challenges.", rate: RATE },
        },
      ],
    },
  },
  {
    slug: "bank",
    title: "At the Bank",
    emoji: "🏦",
    description: "Open an account and handle basic banking.",
    lesson: {
      title: "Opening an account",
      skill: Skill.SPEAKING,
      intro: "Get things done at the bank: je voudrais ouvrir… / il me faut…",
      pattern: {
        fr: "Je voudrais ouvrir + [type de compte].",
        en: "I would like to open + [account type].",
        examples: [
          { fr: "Je voudrais ouvrir un compte courant.", en: "I'd like to open a checking account." },
          { fr: "Quels documents il vous faut ?", en: "What documents do you need?" },
          { fr: "Voici ma pièce d'identité.", en: "Here's my ID." },
        ],
      },
      dialogue: [
        { speaker: "Vous", fr: "Bonjour, je voudrais ouvrir un compte courant.", en: "Hello, I'd like to open a checking account." },
        { speaker: "Conseiller", fr: "Bien sûr. Il me faut une pièce d'identité et un justificatif de domicile.", en: "Of course. I need an ID and proof of address." },
        { speaker: "Vous", fr: "Voici mon passeport et ma facture d'électricité.", en: "Here's my passport and my electricity bill." },
        { speaker: "Conseiller", fr: "Parfait. Vous recevrez votre carte bancaire sous huit jours.", en: "Perfect. You'll receive your bank card within eight days." },
        { speaker: "Vous", fr: "Très bien. Est-ce que la carte est gratuite ?", en: "Great. Is the card free?" },
        { speaker: "Conseiller", fr: "La première année, oui.", en: "The first year, yes." },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« Un justificatif de domicile » is…",
          data: {
            options: ["A passport", "Proof of address", "A pay slip", "A bank statement"],
            correctIndex: 1,
            explanation: "Utility bills are the classic « justificatif de domicile ».",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Say you want to open a checking account.",
          data: {
            template: "Je voudrais ___ un compte courant.",
            answer: "ouvrir",
            hint: "The verb 'to open'.",
          },
        },
        {
          type: ExerciseType.DICTATION,
          prompt: "Listen to the advisor and type what you hear.",
          data: { text: "Il me faut une pièce d'identité.", rate: RATE, translation: "I need an ID." },
        },
        {
          type: ExerciseType.SENTENCE_ORDER,
          prompt: "Hand over your documents.",
          data: {
            words: ["Voici", "mon", "passeport", "et", "ma", "facture", "d'électricité"],
            translation: "Here's my passport and my electricity bill.",
          },
        },
      ],
    },
  },
  {
    slug: "renting",
    title: "Renting an Apartment",
    emoji: "🏠",
    description: "Visit, ask the right questions, and sign the lease.",
    lesson: {
      title: "The apartment visit",
      skill: Skill.SPEAKING,
      intro: "Ask what matters before signing: quel est le loyer ? / les charges sont comprises ?",
      pattern: {
        fr: "Quel est + [le loyer / le dépôt de garantie] ?",
        en: "What is + [the rent / the security deposit]?",
        examples: [
          { fr: "Quel est le loyer par mois ?", en: "What's the monthly rent?" },
          { fr: "Les charges sont comprises ?", en: "Are utilities included?" },
          { fr: "Quand est-ce que je peux emménager ?", en: "When can I move in?" },
        ],
      },
      dialogue: [
        { speaker: "Agent", fr: "Voici l'appartement : deux pièces, trente-cinq mètres carrés.", en: "Here's the apartment: two rooms, thirty-five square meters." },
        { speaker: "Vous", fr: "Il est lumineux ! Quel est le loyer par mois ?", en: "It's bright! What's the monthly rent?" },
        { speaker: "Agent", fr: "Sept cents euros, charges comprises.", en: "Seven hundred euros, utilities included." },
        { speaker: "Vous", fr: "Et le dépôt de garantie ?", en: "And the security deposit?" },
        { speaker: "Agent", fr: "Un mois de loyer. Vous pouvez emménager le premier septembre.", en: "One month's rent. You can move in September first." },
        { speaker: "Vous", fr: "Parfait, je le prends !", en: "Perfect, I'll take it!" },
      ],
      exercises: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          prompt: "« Charges comprises » means…",
          data: {
            options: ["Furniture included", "Utilities included", "Parking included", "Taxes included"],
            correctIndex: 1,
            explanation: "« les charges » = building/utility costs; « comprises » = included.",
          },
        },
        {
          type: ExerciseType.FILL_BLANK,
          prompt: "Ask about the monthly rent.",
          data: {
            template: "Quel est le ___ par mois ?",
            answer: "loyer",
            hint: "The French word for 'rent'.",
          },
        },
        {
          type: ExerciseType.DICTATION,
          prompt: "Listen to the agent and type what you hear.",
          data: { text: "Sept cents euros, charges comprises.", rate: RATE, translation: "Seven hundred euros, utilities included." },
        },
        {
          type: ExerciseType.SPEAKING_PROMPT,
          prompt: "You love it — say you'll take it!",
          data: { mode: "repeat", text: "Parfait, je le prends !", translation: "Perfect, I'll take it!", rate: RATE },
        },
      ],
    },
  },
];
