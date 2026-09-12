import { LearningNav } from "@/components/learning-nav";

// Learning area (course, scenarios, vocabulary): shared container + sub-nav,
// same shape as the analytics area's layout.
export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-6 py-10">
      <LearningNav />
      {children}
    </div>
  );
}
