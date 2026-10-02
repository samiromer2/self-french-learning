import { SiteHeader } from "@/components/site-header";
import { AnalyticsNav } from "@/components/analytics/analytics-nav";

// Analytics is public, so it uses the public site header (the root layout
// no longer renders a global one) plus its own sub-nav.
export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <AnalyticsNav />
        {children}
      </div>
    </>
  );
}
