import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

// Header for the public (site) area and the public analytics pages. The
// authenticated app shell has its own header (components/app-header.tsx).
export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-medium tracking-tight">
          Self French Learning
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button asChild variant="ghost" size="sm">
            <Link href="/learn">Learn French</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/analytics">French in Canada</Link>
          </Button>
          <Suspense fallback={<HeaderAuthFallback />}>
            <HeaderAuth />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

function HeaderAuthFallback() {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      <span className="inline-block h-7 w-14 rounded-md bg-muted" />
      <span className="inline-block h-7 w-16 rounded-md bg-muted" />
    </div>
  );
}

async function HeaderAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <Button asChild size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Sign up</Link>
      </Button>
    </>
  );
}
