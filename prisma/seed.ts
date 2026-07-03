import "dotenv/config";
import { Prisma, PrismaClient, Skill } from "../lib/generated/prisma/client";
import { a1ReadingContent } from "./seed-data/reading";

const prisma = new PrismaClient();

type LessonSeed = {
  title: string;
  skill: Skill;
  intro: string;
};

type UnitSeed = {
  title: string;
  description: string;
  lessons: LessonSeed[];
};

// A1 curriculum from the master plan, section 9.
const a1Units: UnitSeed[] = [
  {
    title: "Greetings and Introductions",
    description: "Say hello, introduce yourself, and hold your first conversation.",
    lessons: [
      { title: "Bonjour", skill: Skill.READING, intro: "Learn the essential French greetings: bonjour, bonsoir, salut, au revoir." },
      { title: "Je m'appelle", skill: Skill.WRITING, intro: "Introduce yourself in writing: je m'appelle, j'ai … ans, j'habite à …." },
      { title: "Nationalities", skill: Skill.LISTENING, intro: "Hear and recognize countries and nationalities: français, anglaise, marocain…." },
      { title: "Basic conversation", skill: Skill.SPEAKING, intro: "Practice a first short dialogue: greeting someone and introducing yourself." },
    ],
  },
  {
    title: "Alphabet and Pronunciation",
    description: "Master the French alphabet, accent marks, and core pronunciation.",
    lessons: [
      { title: "French alphabet", skill: Skill.READING, intro: "The 26 letters and how the French say them." },
      { title: "Accent marks", skill: Skill.WRITING, intro: "é, è, ê, ç, ï — what each accent does and how to type it." },
      { title: "Pronunciation basics", skill: Skill.LISTENING, intro: "Nasal vowels, silent letters, and liaison — train your ear." },
      { title: "Speaking practice", skill: Skill.SPEAKING, intro: "Repeat after native audio to practice the trickiest French sounds." },
    ],
  },
  {
    title: "Numbers and Time",
    description: "Count, tell the time, and talk about dates.",
    lessons: [
      { title: "Numbers 0–100", skill: Skill.READING, intro: "Un, deux, trois… learn to read and count to one hundred." },
      { title: "Dates", skill: Skill.WRITING, intro: "Write dates in French: days, months, and years." },
      { title: "Clock", skill: Skill.LISTENING, intro: "Understand spoken times: il est trois heures et demie." },
      { title: "Calendar", skill: Skill.SPEAKING, intro: "Say dates and schedules aloud: appointments, birthdays, holidays." },
    ],
  },
  {
    title: "Family and People",
    description: "Talk about family members, ages, and descriptions.",
    lessons: [
      { title: "Family members", skill: Skill.READING, intro: "La mère, le père, la sœur, le frère — the family vocabulary." },
      { title: "Descriptions", skill: Skill.WRITING, intro: "Describe people: grand, petite, sympa, les cheveux bruns." },
      { title: "Age", skill: Skill.LISTENING, intro: "Understand people saying their age and asking yours." },
      { title: "Relationships", skill: Skill.SPEAKING, intro: "Talk about your family and relationships aloud." },
    ],
  },
  {
    title: "Food and Shopping",
    description: "Order food, shop, and handle prices.",
    lessons: [
      { title: "Food vocabulary", skill: Skill.READING, intro: "Le pain, le fromage, les légumes — read menus and labels." },
      { title: "Ordering food", skill: Skill.WRITING, intro: "Write simple orders and requests: je voudrais…, l'addition s'il vous plaît." },
      { title: "Shopping dialogue", skill: Skill.LISTENING, intro: "Follow a conversation at the market or bakery." },
      { title: "Prices", skill: Skill.SPEAKING, intro: "Ask for and state prices: c'est combien ? Ça coûte…." },
    ],
  },
  {
    title: "Daily Life",
    description: "Routines, activities, days, and months.",
    lessons: [
      { title: "Routines", skill: Skill.READING, intro: "Read about daily routines: je me lève, je travaille, je dîne." },
      { title: "Activities", skill: Skill.WRITING, intro: "Write about hobbies and daily activities." },
      { title: "Days", skill: Skill.LISTENING, intro: "Recognize the days of the week in fast speech." },
      { title: "Months", skill: Skill.SPEAKING, intro: "Say the months and talk about your year." },
    ],
  },
];

async function main() {
  const level = await prisma.level.upsert({
    where: { code: "A1" },
    update: {},
    create: {
      code: "A1",
      title: "Beginner",
      description: "Survive basic conversations.",
      order: 1,
    },
  });

  for (const [unitIndex, unitSeed] of a1Units.entries()) {
    const unit = await prisma.unit.upsert({
      where: { levelId_order: { levelId: level.id, order: unitIndex + 1 } },
      update: { title: unitSeed.title, description: unitSeed.description },
      create: {
        levelId: level.id,
        order: unitIndex + 1,
        title: unitSeed.title,
        description: unitSeed.description,
      },
    });

    for (const [lessonIndex, lessonSeed] of unitSeed.lessons.entries()) {
      const reading =
        lessonSeed.skill === Skill.READING
          ? a1ReadingContent[unitIndex + 1]
          : undefined;

      const content = reading
        ? { intro: lessonSeed.intro, passage: reading.passage }
        : { intro: lessonSeed.intro };

      const lesson = await prisma.lesson.upsert({
        where: { unitId_order: { unitId: unit.id, order: lessonIndex + 1 } },
        update: {
          title: lessonSeed.title,
          skill: lessonSeed.skill,
          content,
        },
        create: {
          unitId: unit.id,
          order: lessonIndex + 1,
          title: lessonSeed.title,
          skill: lessonSeed.skill,
          content,
        },
      });

      if (reading) {
        // Replace vocabulary and exercises wholesale so re-seeding stays in
        // sync with the seed data (progress records are untouched).
        await prisma.vocabulary.deleteMany({ where: { lessonId: lesson.id } });
        await prisma.vocabulary.createMany({
          data: reading.vocabulary.map((v) => ({ ...v, lessonId: lesson.id })),
        });

        await prisma.exercise.deleteMany({ where: { lessonId: lesson.id } });
        for (const [exerciseIndex, exercise] of reading.exercises.entries()) {
          await prisma.exercise.create({
            data: {
              lessonId: lesson.id,
              order: exerciseIndex + 1,
              type: exercise.type,
              prompt: exercise.prompt,
              data: exercise.data as Prisma.InputJsonValue,
            },
          });
        }
      }
    }
  }

  const unitCount = await prisma.unit.count({ where: { levelId: level.id } });
  const lessonCount = await prisma.lesson.count({ where: { unit: { levelId: level.id } } });
  const exerciseCount = await prisma.exercise.count();
  const vocabCount = await prisma.vocabulary.count();
  console.log(
    `Seeded A1: ${unitCount} units, ${lessonCount} lessons, ${exerciseCount} exercises, ${vocabCount} vocabulary entries.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
