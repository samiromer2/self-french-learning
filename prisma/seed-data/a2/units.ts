import { Skill } from "../../../lib/generated/prisma/client";

export type A2LessonSeed = {
  title: string;
  skill: Skill;
  intro: string;
};

export type A2UnitSeed = {
  title: string;
  description: string;
  lessons: A2LessonSeed[];
};

export const a2Units: A2UnitSeed[] = [
  {
    title: "Travel and Holidays",
    description: "Talk about a trip in the past and plans for the next one.",
    lessons: [
      {
        title: "A weekend in Quebec",
        skill: Skill.READING,
        intro: "Read a short travel story. Notice passé composé: je suis allé, nous avons visité.",
      },
      {
        title: "Write about a trip",
        skill: Skill.WRITING,
        intro: "Practise the two helpers of passé composé: avoir and être (with aller).",
      },
      {
        title: "At the station",
        skill: Skill.LISTENING,
        intro: "Hear times, platforms, and travel plans. Speech is a little faster than A1.",
      },
      {
        title: "Talking about a holiday",
        skill: Skill.SPEAKING,
        intro: "Say where you went and where you are going to go (futur proche: je vais aller).",
      },
    ],
  },
  {
    title: "Work and Daily Job Life",
    description: "Talk about your job, hours, colleagues, and a day at the office.",
    lessons: [
      {
        title: "A day at the office",
        skill: Skill.READING,
        intro: "Read about Léa's workday. Present for routines, passé composé for yesterday's project.",
      },
      {
        title: "Write about work",
        skill: Skill.WRITING,
        intro: "Practise je travaille comme… and a simple past sentence about a project.",
      },
      {
        title: "Meetings and hours",
        skill: Skill.LISTENING,
        intro: "Hear office talk: métro, réunions, télétravail. Speech at A2 speed (0.9).",
      },
      {
        title: "Talking about your job",
        skill: Skill.SPEAKING,
        intro: "Say what you do, when you start, and what you finished yesterday.",
      },
    ],
  },
  {
    title: "Weather and Seasons",
    description: "Describe Canadian weather, dress for winter, and talk about tomorrow's forecast.",
    lessons: [
      {
        title: "Four seasons in Canada",
        skill: Skill.READING,
        intro: "Weather phrases: il fait froid, il neige, il va faire beau. One past snowfall in April.",
      },
      {
        title: "Write about the weather",
        skill: Skill.WRITING,
        intro: "Il fait + adjective, il + weather verb, and a short forecast with je vais / il va.",
      },
      {
        title: "The forecast",
        skill: Skill.LISTENING,
        intro: "Listen for temperature, snow, rain, and tomorrow's weather.",
      },
      {
        title: "What's the weather like?",
        skill: Skill.SPEAKING,
        intro: "Answer « Quel temps fait-il ? » and say what you wear in winter.",
      },
    ],
  },
  {
    title: "Hobbies and Free Time",
    description: "Talk about sport, music, friends, and what you did last weekend.",
    lessons: [
      {
        title: "My weekend",
        skill: Skill.READING,
        intro: "Faire du / jouer de / aimer. Past: j'ai visité. Future: je vais commencer.",
      },
      {
        title: "Write about free time",
        skill: Skill.WRITING,
        intro: "je fais du sport, je joue de la guitare — and a few sentences about last Sunday.",
      },
      {
        title: "Plans with friends",
        skill: Skill.LISTENING,
        intro: "Hear hobbies and an invitation for the weekend.",
      },
      {
        title: "What do you like to do?",
        skill: Skill.SPEAKING,
        intro: "Say a hobby, invite someone, and answer what you did last weekend.",
      },
    ],
  },
  {
    title: "Directions and the City",
    description: "Ask for the way, follow street directions, and find places in town.",
    lessons: [
      {
        title: "How do I get there?",
        skill: Skill.READING,
        intro: "à gauche, à droite, tout droit, en face de. Asking: pour aller à… ?",
      },
      {
        title: "Write directions",
        skill: Skill.WRITING,
        intro: "Practise tournez, continuez, and en face de / à côté de.",
      },
      {
        title: "In the street",
        skill: Skill.LISTENING,
        intro: "Hear someone explain the way from the métro to a library.",
      },
      {
        title: "Asking the way",
        skill: Skill.SPEAKING,
        intro: "Ask « Pour aller à… ? » and give a short set of directions.",
      },
    ],
  },
  {
    title: "Telling Stories",
    description: "Narrate a first day in Canada: d'abord, ensuite, puis, enfin — and a little imparfait.",
    lessons: [
      {
        title: "My first day",
        skill: Skill.READING,
        intro: "Passé composé for what happened; imparfait (était, c'était) for how it felt.",
      },
      {
        title: "Write a short story",
        skill: Skill.WRITING,
        intro: "Link events with d'abord / ensuite / enfin. One sentence with c'était is enough.",
      },
      {
        title: "A story out loud",
        skill: Skill.LISTENING,
        intro: "Listen for the order of events at the airport and after.",
      },
      {
        title: "Tell what happened",
        skill: Skill.SPEAKING,
        intro: "Retell a short story: I arrived, I took a taxi, we ate poutine.",
      },
    ],
  },
];
