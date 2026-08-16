import { canadaBundle } from "@/lib/analytics/canada";
import { TrendsInsights } from "@/components/analytics/trends-insights";

export const metadata = { title: "Trends · Analytics" };

export default function TrendsPage() {
  return <TrendsInsights bundle={canadaBundle} />;
}
