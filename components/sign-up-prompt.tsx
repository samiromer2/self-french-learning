"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authPathWithNext } from "@/lib/safe-next-path";
import { cn } from "@/lib/utils";

// Shown to guests wherever a signed-in visitor would have had something
// saved (lesson results, quiz results, end of a flashcard deck). Guest work
// is never persisted, so this is the honest "here's what an account adds".
export function SignUpPrompt({
  title = "Nothing was saved",
  description = "Create a free account to save your progress, earn XP, and build a streak.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("rounded-lg border border-dashed bg-muted/40 p-4", className)}>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={authPathWithNext("/signup", pathname)}>Create free account</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={authPathWithNext("/login", pathname)}>Log in</Link>
        </Button>
      </div>
    </div>
  );
}
