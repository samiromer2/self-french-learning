import { cache } from "react";
import bundleJson from "@/data/analytics/dashboard_bundle.json";
import type { CanadaBundle, GeoPoint, ProvincialSnapshot } from "./types";

export const canadaBundle = bundleJson as CanadaBundle;

export const loadCanadaBundle = cache(async (): Promise<CanadaBundle> => canadaBundle);

export const PROVINCE_ORDER = [
  "NL",
  "PE",
  "NS",
  "NB",
  "QC",
  "ON",
  "MB",
  "SK",
  "AB",
  "BC",
  "YT",
  "NT",
  "NU",
] as const;

export function provincesOnly(rows: ProvincialSnapshot[]) {
  return rows
    .filter((r) => r.geo_type === "province" || r.geo_type === "territory")
    .sort(
      (a, b) =>
        PROVINCE_ORDER.indexOf(a.geo_code as (typeof PROVINCE_ORDER)[number]) -
        PROVINCE_ORDER.indexOf(b.geo_code as (typeof PROVINCE_ORDER)[number]),
    );
}

export function trendForGeo(series: GeoPoint[], geoCode: string) {
  return series
    .filter((r) => r.geo_code === geoCode)
    .sort((a, b) => a.year - b.year);
}

export const METRIC_OPTIONS = [
  { id: "bilingual_rate", label: "English–French bilingualism", unit: "%", source: "15-10-0004-01" },
  { id: "french_fols_rate", label: "French as first official language", unit: "%", source: "15-10-0032-01" },
  { id: "french_home_rate", label: "French most often at home", unit: "%", source: "15-10-0033-01" },
  { id: "french_work_rate", label: "French most often at work", unit: "%", source: "98-10-0533-01" },
] as const;

export type MetricId = (typeof METRIC_OPTIONS)[number]["id"];
