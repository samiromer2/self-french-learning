import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SignOutButton } from "@/components/sign-out-button";

// Header for the app shell — used by both the account-only (app) group and
// the public (learn) area, so it has to work signed out too. Only the right
// hand slot depends on auth, and it's wrapped in Suspense (same shape as
// components/site-header.tsx) so the nav never waits on the Auth round-trip.
export function AppHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="shrink-0 font-medium tracking-tight">
            Self French Learning
          </Link>
          <MainNav />
        </div>
        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuth />
        </Suspense>
      </div>
    </header>
  );
}

function HeaderAuthFallback() {
  return (
    <div className="flex shrink-0 items-center gap-1" aria-hidden>
      <span className="inline-block h-7 w-14 rounded-md bg-muted" />
      <span className="inline-block h-7 w-16 rounded-md bg-muted" />
    </div>
  );
}

async function HeaderAuth() {
  const user = await getCurrentUser();

  if (user) return <SignOutButton />;

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  );
}
