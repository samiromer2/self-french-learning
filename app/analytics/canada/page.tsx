import { canadaBundle } from "@/lib/analytics/canada";
import { CanadaExplorer } from "@/components/analytics/canada-dashboards";

export const metadata = { title: "French in Canada · Analytics" };

export default function CanadaAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">French in Canada</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Official-language knowledge, first official language spoken, home use, and workplace use
          from Statistics Canada. Filters update the charts from the precomputed extract — the
          browser never downloads the raw Census cube.
        </p>
      </div>
      <CanadaExplorer bundle={canadaBundle} />
    </div>
  );
}
