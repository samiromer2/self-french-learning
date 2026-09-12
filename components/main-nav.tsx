"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LEARNING_PREFIXES = ["/learn", "/scenarios", "/vocabulary"];

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learning" },
  { href: "/analytics", label: "Analytics" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function isActive(href: string, pathname: string) {
  if (href === "/learn") {
    return LEARNING_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }
  return pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto text-sm">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted-foreground hover:text-foreground",
            isActive(item.href, pathname) && "bg-muted font-medium text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
