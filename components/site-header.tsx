import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/learn", label: "Learn", auth: true },
  { href: "/scenarios", label: "Scenarios", auth: true },
  { href: "/analytics", label: "Analytics", auth: false },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-medium tracking-tight">
          Self French Learning
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links
            .filter((l) => !l.auth || user)
            .map((l) => (
              <Button key={l.href} asChild variant="ghost" size="sm">
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
