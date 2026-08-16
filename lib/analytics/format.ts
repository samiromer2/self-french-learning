export function formatNumber(value: number | null | undefined, digits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-CA", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatHours(hours: number | null | undefined) {
  if (hours == null || Number.isNaN(hours)) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)} h`;
}

export function formatMinutes(minutes: number | null | undefined) {
  if (minutes == null || Number.isNaN(minutes)) return "—";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  return formatHours(minutes / 60);
}
