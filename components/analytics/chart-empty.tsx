export function ChartEmpty({
  title = "Not enough data yet",
  detail,
}: {
  title?: string;
  detail: string;
}) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed px-6 text-center">
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
