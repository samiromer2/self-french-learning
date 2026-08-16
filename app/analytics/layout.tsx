import { AnalyticsNav } from "@/components/analytics/analytics-nav";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
      <AnalyticsNav />
      {children}
    </div>
  );
}
