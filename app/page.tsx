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
        <Button asChild size="lg" variant="outline">
          <Link href="/analytics">French in Canada</Link>
        </Button>
        <Suspense fallback={<HomeAuthFallback />}>
          <HomeAuthButtons />
        </Suspense>
      </div>
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

  return (
    <>
      <Button asChild size="lg">
        <Link href="/signup">Get started</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/login">Log in</Link>
      </Button>
    </>
  );
}
