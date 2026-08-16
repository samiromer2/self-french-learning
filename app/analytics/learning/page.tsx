import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getLearningAnalytics } from "@/lib/analytics/learning";
import { LearningDashboard } from "@/components/analytics/learning-dashboard";

export const metadata = { title: "My learning · Analytics" };

export default async function LearningAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/analytics/learning");
  const data = await getLearningAnalytics(user.id);
  return <LearningDashboard data={data} />;
}
