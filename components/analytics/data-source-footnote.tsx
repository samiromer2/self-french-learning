export function DataSourceFootnote({
  organization = "Statistics Canada",
  dataset,
  period,
  lastUpdated,
  url,
}: {
  organization?: string;
  dataset: string;
  period: string;
  lastUpdated?: string | null;
  url?: string;
}) {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">Data source.</span> {organization}
      {" · "}
      {url ? (
        <a href={url} className="underline underline-offset-2" target="_blank" rel="noreferrer">
          {dataset}
        </a>
      ) : (
        dataset
      )}
      {" · "}
      Period: {period}
      {lastUpdated ? ` · Pipeline updated: ${lastUpdated.slice(0, 10)}` : null}
      . Open Government Licence – Canada. Figures are not Statistics Canada endorsements of this app.
    </p>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-xs text-muted-foreground">
      Personal learning metrics describe this signed-in account only. They are not a sample of
      Canadian language learners and must not be compared as if they were Census statistics.
    </p>
  );
}
