// Relation filter for "rows belonging to this user" that matches nothing
// when there is no user (guest mode). `{ id: { in: [] } }` compiles to a
// false predicate, so guests get an empty relation array — which every
// learning page already handles via `progress[0]?.status ?? "NOT_STARTED"`.
// Comparing the Uuid columns against "" instead would be a Postgres cast
// error.
export function ownedBy(
  userId: string | undefined,
): { userId: string } | { id: { in: string[] } } {
  return userId ? { userId } : { id: { in: [] } };
}
