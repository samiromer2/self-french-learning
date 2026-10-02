import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/server";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          A1 → C2
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn French, one skill at a time.
        </h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
          Reading, writing, listening, and speaking exercises guided by the CEFR
          framework — starting with A1.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/learn">Start learning — no account needed</Link>
        </Button>
        <Suspense fallback={<HomeAuthFallback />}>
          <HomeAuthButtons />
        </Suspense>
      </div>

      <p className="text-sm text-muted-foreground">
        Try any lesson, scenario, or quiz as a guest.{" "}
        <Link href="/analytics" className="underline underline-offset-2">
          French in Canada
        </Link>
      </p>
    </div>
  );
}

function HomeAuthFallback() {
  return (
    <span className="inline-block h-10 w-36 rounded-md bg-muted" aria-hidden />
  );
}

async function HomeAuthButtons() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <Button asChild size="lg">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    );
  }

  // Signing up is the secondary action now — the primary CTA lets people
  // in without an account.
  return (
    <>
      <Button asChild size="lg" variant="outline">
        <Link href="/signup">Sign up to save progress</Link>
      </Button>
      <Button asChild size="lg" variant="ghost">
        <Link href="/login">Log in</Link>
      </Button>
    </>
  );
}
