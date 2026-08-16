import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  unavailable,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  unavailable?: boolean;
  className?: string;
}) {
  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn("text-2xl tabular-nums", unavailable && "text-muted-foreground")}>
          {unavailable ? "Not enough data" : value}
        </CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
