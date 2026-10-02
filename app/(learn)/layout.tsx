import { AppHeader } from "@/components/app-header";
import { LearningNav } from "@/components/learning-nav";

// Learning area (course, scenarios, vocabulary). Deliberately NOT inside the
// (app) group: these pages are public so anyone can try the platform before
// signing up. Pages fetch progress only when there's a user, and the players
// skip their save actions for guests — see components/sign-up-prompt.tsx.
export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-6 py-10">
        <LearningNav />
        {children}
      </div>
    </>
  );
}
