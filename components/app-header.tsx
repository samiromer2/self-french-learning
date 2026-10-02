import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { SignOutButton } from "@/components/sign-out-button";

// Header for the authenticated (app) area. Rendered inside the (app)
// layout, which has already enforced auth — no user checks needed here.
export function AppHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/dashboard" className="shrink-0 font-medium tracking-tight">
            Self French Learning
          </Link>
          <MainNav />
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
