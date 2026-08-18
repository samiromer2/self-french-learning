import { Suspense } from "react";
import { getCurrentUser } from "@/lib/supabase/server";
import { canadaBundle } from "@/lib/analytics/canada";
import { getLearningAnalytics } from "@/lib/analytics/learning";
import { OverviewDashboard } from "@/components/analytics/canada-dashboards";

export const metadata = { title: "Analytics · Self French Learning" };

export default function AnalyticsOverviewPage() {
  return (
    <Suspense
      fallback={
        <OverviewDashboard
          bundle={canadaBundle}
          learning={null}
          signedIn={false}
          authPending
        />
      }
    >
      <AnalyticsOverviewWithLearning />
    </Suspense>
  );
}

async function AnalyticsOverviewWithLearning() {
  const user = await getCurrentUser();
  const learning = user ? await getLearningAnalytics(user.id) : null;
  return (
    <OverviewDashboard
      bundle={canadaBundle}
      learning={learning}
      signedIn={Boolean(user)}
    />
  );
}
