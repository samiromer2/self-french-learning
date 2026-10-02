// Only same-site paths may be used as a post-login/post-signup destination,
// so a crafted ?next= can't turn the auth pages into an open redirect.
export function safeNextPath(next: string | null | undefined) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return null;
}

// Builds a /login (or /signup) URL that returns the visitor to `next`.
export function authPathWithNext(base: "/login" | "/signup", next?: string | null) {
  const safe = safeNextPath(next);
  return safe ? `${base}?next=${encodeURIComponent(safe)}` : base;
}
