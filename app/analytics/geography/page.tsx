import { canadaBundle } from "@/lib/analytics/canada";
import { GeographyExplorer } from "@/components/analytics/geography-explorer";

export const metadata = { title: "Geography · Analytics" };

export default function GeographyPage() {
  return <GeographyExplorer bundle={canadaBundle} />;
}
