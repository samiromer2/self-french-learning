// Achievement definitions shared by the seed script and award logic.
// Codes are stable identifiers; titles/descriptions can change freely.
export const ACHIEVEMENTS = [
  { code: "first-lesson", title: "First Lesson", description: "Complete your first lesson.", icon: "🎉" },
  { code: "five-lessons", title: "Getting Serious", description: "Complete 5 lessons.", icon: "📚" },
  { code: "perfect-score", title: "Sans Faute", description: "Finish a lesson with a perfect score.", icon: "⭐" },
  { code: "first-unit", title: "Unit Down", description: "Complete every lesson in a unit.", icon: "🏁" },
  { code: "seven-day-streak", title: "7 Day Streak", description: "Practice seven days in a row.", icon: "🔥" },
  { code: "a1-graduate", title: "A1 Graduate", description: "Complete every A1 lesson.", icon: "🎓" },
] as const;
